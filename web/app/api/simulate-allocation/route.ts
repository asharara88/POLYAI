import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  getAgent,
  getAllocationRules,
  getBrokers,
  getClient,
  getInventory,
} from "@/lib/content";

export const runtime = "nodejs";
export const maxDuration = 60;

type AllocationRequest = {
  brokerFirm: string;
  brokerTier: number;
  unitId: string;
  paymentPlan: string;
  prospectIdentifier: string; // phone or email or anonymized id
  notes?: string;
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    clientSlug?: string;
    request?: AllocationRequest;
  };
  const clientSlug = body.clientSlug;
  const request = body.request;
  if (!clientSlug || !request) {
    return Response.json({ error: "clientSlug and request required" }, { status: 400 });
  }

  const client = getClient(clientSlug);
  const inventory = getInventory(clientSlug);
  const brokers = getBrokers(clientSlug);
  const allocationRulesRaw = getAllocationRules(clientSlug);
  const brokerEnablement = getAgent("broker-enablement");

  if (!client) return Response.json({ error: `client ${clientSlug} not found` }, { status: 404 });
  if (!inventory) return Response.json({ error: "inventory missing" }, { status: 400 });
  if (!brokers) return Response.json({ error: "broker registry missing" }, { status: 400 });
  if (!allocationRulesRaw)
    return Response.json({ error: "sales/allocation-rules.md missing" }, { status: 400 });
  if (!brokerEnablement)
    return Response.json({ error: "broker-enablement agent missing" }, { status: 500 });

  const ai = new Anthropic({ apiKey });

  const inventorySummary = [
    `Total: ${inventory.totals.total ?? "?"}; Available: ${inventory.totals.available ?? "?"}; On-hold: ${inventory.totals.onHold ?? "?"}; Reserved: ${inventory.totals.reserved ?? "?"}; Sold: ${inventory.totals.sold ?? "?"}`,
    "",
    "Sample units (currently tracked in inventory/current.md):",
    ...inventory.sampleUnits.map(
      (u) =>
        `- ${u.unitId}: type=${u.type}, floor=${u.floor ?? "?"}, view=${u.view}, sqft=${u.areaSqft ?? "?"}, price=AED ${u.priceAed?.toLocaleString() ?? "?"}, plan=${u.paymentPlan}, status=${u.status}`,
    ),
  ].join("\n");

  const system = [
    brokerEnablement.body,
    "",
    "## Runtime context",
    "",
    "You are running inside Flow's broker-allocation simulator. A broker has submitted an allocation request: a specific unit + payment plan for a named prospect. Run the allocation logic per the client's allocation rules and return a strict JSON decision (approve / decline / counter / escalate).",
    "",
    `Client: ${clientSlug} (${client.summary.displayName ?? "—"})`,
    "",
    "Inventory state (parsed):",
    inventorySummary,
    "",
    "Allocation rules (raw):",
    allocationRulesRaw,
    "",
    "Broker tier sample:",
    brokers.sampleFirms
      .slice(0, 5)
      .map((f) => `- "${f.firm}" tier=${f.tier} active=${f.active}`)
      .join("\n"),
  ].join("\n");

  const userMsg = [
    "Process this allocation request. Return strict JSON conforming to:",
    "",
    "```json",
    `{`,
    `  "decision": "approved | declined | countered | escalated",`,
    `  "rationale": "<one to three sentences citing the specific rule>",`,
    `  "checks": {`,
    `    "inventory_available": <bool>,`,
    `    "plan_eligible_for_unit_type": <bool>,`,
    `    "plan_eligible_for_broker_tier": <bool>,`,
    `    "unit_type_eligible_for_broker_tier": <bool>,`,
    `    "anti_double_allocation_clear": <bool>,`,
    `    "pre_flight_clear": <bool>`,
    `  },`,
    `  "hold_until_iso": "<ISO timestamp if approved>",`,
    `  "counter_offer": { "unit_id": "<id>", "payment_plan": "<plan>", "rationale": "<why>" },`,
    `  "escalation_reason": "<reason if escalated>",`,
    `  "next_actions": ["<action 1>", "<action 2>"]`,
    `}`,
    "```",
    "",
    "Allocation request:",
    "```json",
    JSON.stringify(request, null, 2),
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
