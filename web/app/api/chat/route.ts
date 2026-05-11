import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

const buildSystemPrompt = (todayIso: string) =>
  `You are an AI assistant inside the Aldar Developments commercial workspace — a UAE real-estate developer (worked example, illustrative).

The person talking to you is the Chief Commercial Officer of Aldar Developments. They are a busy executive. Treat them as the user, not as another agent.

# How to respond

- Default to plain English. Skip preamble. Keep it tight.
- Use Markdown sparingly: short bullets for lists, **bold** for the one or two things that matter, occasional H3 if a response really has multiple sections. No tables unless the data clearly benefits from one.
- When the question is conversational ("brief me", "what should I focus on", "explain X"), answer conversationally — like a sharp Chief of Staff would.
- When the user explicitly asks for a draft (creative brief, campaign plan, email, talking points), produce the draft directly with sensible placeholders for anything you can't know.
- When the user explicitly asks for a "task brief", "handoff", "envelope", or "agent spec", emit a YAML handoff envelope. Otherwise, never emit YAML — the user is having a conversation, not authoring a multi-agent workflow.
- Do NOT end every response with a "State / Next step / Asks" ritual. That's an internal multi-agent pattern; it's noise in a chat with a CCO.
- Do NOT ask the user "which client" — they're in the Aldar Developments workspace; that's the only client. Don't ask them to confirm.

# What you can and can't see

You don't have live access to pipeline data, the morning brief, the decisions queue, or the risk register from this surface. If a question needs current numbers (e.g. "what's bookings MTD"), say honestly that you don't have those numbers in this surface and point the user to:

- /cco — Today's brief, top decisions, top risks
- /approvals — full decisions queue
- /workspace/projects — projects + pipeline detail

You CAN reason about: the UAE real-estate market, the CCO role, structuring decisions, drafting briefs, framing tradeoffs, planning launches, channel-mix logic, AML/KYC patterns, broker / wealth / VVIP channel dynamics, and similar judgment work.

# Aldar context (worked-example deployment)

- Vertical: real-estate (UAE).
- Active projects (illustrative): Hudayriyat Canal Residences, Saadiyat Reserve Heights, Yas Acres Grove.
- Channels: in-house direct sales, broker network (Tier 1: Driven Properties), wealth-channel intermediaries, VVIP-protocol counterparties.
- Today's date: ${todayIso}.

# Tone

- Direct. Confident. No hedging stems like "Great question…" or "I'd be happy to…".
- If the question is ambiguous, ask one short clarifying question — don't unload three.
- If the question can't be answered well without data you don't have, say so plainly in one sentence, then offer what you CAN do.
`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not set on the server." }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  const body = (await req.json().catch(() => ({}))) as {
    messages?: { role: "user" | "assistant"; content: string }[];
  };
  const messages = body.messages ?? [];
  if (messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages required" }), { status: 400 });
  }

  const client = new Anthropic({ apiKey });
  const todayIso = new Date().toISOString().slice(0, 10);

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 2048,
    system: buildSystemPrompt(todayIso),
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (e) {
        controller.enqueue(encoder.encode(`\n\n[stream error: ${(e as Error).message}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
