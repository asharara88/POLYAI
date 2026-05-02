import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAgent, getClient, getRmTeam } from "@/lib/content";

export const runtime = "nodejs";
export const maxDuration = 60;

type LeadInput = {
  source: string;
  language: string;
  segment: string;
  unitType: string;
  priceBandAed: string;
  urgency: string;
  returningProspectRmId?: string;
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
  const rmTeam = getRmTeam(clientSlug);
  const inboundQualifier = getAgent("inbound-qualifier");

  if (!client) return Response.json({ error: `client ${clientSlug} not found` }, { status: 404 });
  if (!rmTeam) {
    return Response.json(
      { error: `client ${clientSlug} has no sales/rm-team.md` },
      { status: 400 },
    );
  }
  if (!inboundQualifier) {
    return Response.json({ error: "inbound-qualifier agent missing" }, { status: 500 });
  }

  const ai = new Anthropic({ apiKey });

  const system = [
    inboundQualifier.body,
    "",
    "## Runtime context",
    "",
    "You are running inside POLYAI's direct-lead routing simulator. A direct lead from the developer's own marketing arrives. Route it to the correct in-house RM, NEVER to an external broker. Return a strict JSON routing decision.",
    "",
    `Client: ${clientSlug} (${client.summary.displayName ?? "—"}) — vertical: ${client.summary.vertical ?? "?"}`,
    "",
    "RM team (parsed):",
    "```yaml",
    ...rmTeam.rms.map(
      (r) =>
        `- rm_id: ${r.rmId}\n  name: "${r.name}"\n  tier: ${r.tier}\n  specializations: [${r.specializations.map((s) => `"${s}"`).join(", ")}]\n  languages: [${r.languages.map((l) => `"${l}"`).join(", ")}]\n  current_load: ${r.currentLoad}\n  capacity: ${r.capacity}\n  available_slots: ${(r.capacity ?? 0) - (r.currentLoad ?? 0)}\n  prior_quarter_close_rate: ${r.priorQuarterCloseRate ?? "null"}\n  active: ${r.active}`,
    ),
    "```",
    "",
    "Routing principles (per the rm-team.md):",
    "1. Speed first — 5-minute SLA from form submission to RM acknowledgment.",
    "2. Specialization > load balancing.",
    "3. Capacity is real — if best-fit RM is at capacity, route next-best-fit and queue an alert.",
    "4. Returning prospects route back to the prior RM (when returningProspectRmId provided).",
    "5. Sales leadership can override; log it, don't fight it.",
  ].join("\n");

  const userMsg = [
    "Route this direct lead. Return strict JSON conforming to:",
    "",
    "```json",
    `{`,
    `  "primary": { "rm_id": "<id>", "rm_name": "<name>", "tier": "<senior|mid|junior>", "rationale": "<one sentence>" },`,
    `  "match_breakdown": { "specialization": "<note>", "language": "<match|partial|miss>", "capacity": "<headroom note>", "returning_prospect_rule_applied": <bool> },`,
    `  "alternatives": [ { "rm_id": "<id>", "rm_name": "<name>", "rationale": "<one sentence>" } ],`,
    `  "speed_target_minutes": <int>,`,
    `  "next_actions": ["<action 1>", "<action 2>"],`,
    `  "anti_patterns_avoided": ["<rule applied>"],`,
    `  "alerts_raised": ["<alert if any — e.g. 'overflow recommended', 'best-fit at capacity'>"]`,
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

  return Response.json({ decision, raw: text, parseError });
}
