import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAgent, getBrokers, getClient } from "@/lib/content";

export const runtime = "nodejs";
export const maxDuration = 60;

type LeadInput = {
  source: string;            // "property-finder" | "bayut" | "google-ads" | "meta" | "linkedin" | "whatsapp" | "referral" | "walk-in" | ...
  language: string;          // "en" | "ar" | "hi" | ...
  segment: string;           // "gcc-investor" | "diaspora-uk" | "diaspora-india" | "end-user" | "family-office" | ...
  unitType: string;          // "1BR" | "2BR" | "3BR" | "4BR" | "penthouse" | "any"
  priceBandAed: string;      // free-text e.g. "2.5M-3.5M"
  urgency: string;           // "now" | "3-months" | "exploring"
  notes?: string;
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const body = (await req.json().catch(() => ({}))) as { clientSlug?: string; lead?: LeadInput };
  const clientSlug = body.clientSlug;
  const lead = body.lead;
  if (!clientSlug || !lead) {
    return Response.json({ error: "clientSlug and lead required" }, { status: 400 });
  }

  const client = getClient(clientSlug);
  const brokers = getBrokers(clientSlug);
  const brokerAgent = getAgent("broker-enablement");

  if (!client) return Response.json({ error: `client ${clientSlug} not found` }, { status: 404 });
  if (!brokers) {
    return Response.json(
      { error: `client ${clientSlug} has no brokers/registry.md` },
      { status: 400 },
    );
  }
  if (!brokerAgent) {
    return Response.json({ error: "broker-enablement agent missing" }, { status: 500 });
  }

  const ai = new Anthropic({ apiKey });

  const system = [
    brokerAgent.body,
    "",
    "## Runtime context",
    "",
    "You are running inside Flow's lead-routing simulator. Given a lead and the active client's broker registry, return a routing decision in strict JSON. Do not include prose outside the JSON.",
    "",
    `Client: ${clientSlug} (${client.summary.displayName ?? "—"}) — vertical: ${client.summary.vertical ?? "?"}`,
    "",
    "Broker registry (parsed):",
    "```yaml",
    `tiers:`,
    ...brokers.tiers.map((t) => `  - tier: ${t.tier}\n    count: ${t.count}\n    description: "${t.description.replace(/"/g, '\\"')}"`),
    "tier_1_sample:",
    ...brokers.sampleFirms.map(
      (f) =>
        `  - firm: "${f.firm}"\n    tier: ${f.tier}\n    specializations: [${f.specializations.map((s) => `"${s}"`).join(", ")}]\n    languages: [${f.languages.map((l) => `"${l}"`).join(", ")}]\n    prior_launch_conversion: ${f.priorLaunchConversion ?? "null"}`,
    ),
    `speed_to_lead_sla_minutes: ${brokers.speedToLeadSlaMinutes ?? "null"}`,
    "```",
  ].join("\n");

  const userMsg = [
    "Route this lead. Return strict JSON conforming to:",
    "",
    "```json",
    `{`,
    `  "primary": { "firm": "<firm name>", "tier": <int>, "rationale": "<one sentence>" },`,
    `  "alternatives": [ { "firm": "<firm name>", "tier": <int>, "rationale": "<one sentence>" } ],`,
    `  "deferred_segments": ["<reason if no firm matches well — e.g. 'no Hindi-speaking tier-1 broker available'>"],`,
    `  "speed_target_minutes": <int>,`,
    `  "next_actions": ["<action 1>", "<action 2>"],`,
    `  "anti_patterns_avoided": ["<rule applied — e.g. 'anti-double-routing not triggered'>"]`,
    `}`,
    "```",
    "",
    "Lead:",
    "```json",
    JSON.stringify(lead, null, 2),
    "```",
  ].join("\n");

  const res = await ai.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system,
    messages: [{ role: "user", content: userMsg }],
  });

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  // Extract JSON from response (model may wrap in fences)
  const jsonMatch = text.match(/```json\s*([\s\S]+?)\s*```/) ?? text.match(/(\{[\s\S]+\})/);
  let decision: unknown = null;
  let parseError: string | null = null;
  if (jsonMatch) {
    try {
      decision = JSON.parse(jsonMatch[1] ?? jsonMatch[0]);
    } catch (e) {
      parseError = (e as Error).message;
    }
  } else {
    parseError = "no JSON in response";
  }

  return Response.json({
    decision,
    raw: text,
    parseError,
  });
}
