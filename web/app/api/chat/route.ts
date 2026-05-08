import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAgent, getClients, getSchemas, getVerticals } from "@/lib/content";

export const runtime = "nodejs";
export const maxDuration = 60;

const buildSystemPrompt = (clientSlug?: string) => {
  const cco = getAgent("chief-commercial-officer");
  const clients = getClients().filter((c) => !c.isTemplate);
  const verticals = getVerticals().map((v) => v.name).join(", ");
  const schemas = getSchemas().map((s) => s.name).join(", ");
  const activeClient = clientSlug ? clients.find((c) => c.slug === clientSlug) : undefined;

  return [
    cco?.body ?? "You are the Flow Chief Commercial Officer (CCO).",
    "",
    "## Runtime context",
    "",
    "You are running inside Flow's web control plane. You can plan, route, and draft — but you cannot directly invoke other subagents from this surface (those are Claude Code tools). Treat your output as a plan or a draft the user can copy into a Claude Code session, into a brief, or into a file in the repo.",
    "",
    `Available clients: ${clients.length === 0 ? "(none yet)" : clients.map((c) => `${c.slug} [${c.vertical ?? "?"}]`).join(", ")}`,
    `Available verticals: ${verticals}`,
    `Available schemas: ${schemas}`,
    activeClient
      ? `Active client this turn: ${activeClient.slug} (${activeClient.displayName ?? "—"}, vertical: ${activeClient.vertical ?? "?"}, market: ${activeClient.primaryMarket ?? "?"})`
      : "Active client this turn: none — ask the user which client this is for, or invoke client-onboarding (in Claude Code) to create one.",
    "",
    "## Output style",
    "",
    "- Be tight. Skip preamble.",
    "- When dispatching to another agent, emit a populated handoff-envelope in YAML — the user can paste it into Claude Code.",
    "- When drafting briefs, conform to the schema named in the handoff.",
    "- End every turn with: State / Next step / Asks (each three short bullets max).",
  ].join("\n");
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not set on the server." }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const body = (await req.json().catch(() => ({}))) as {
    messages?: { role: "user" | "assistant"; content: string }[];
    clientSlug?: string;
  };
  const messages = body.messages ?? [];
  if (messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages required" }), { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    system: buildSystemPrompt(body.clientSlug),
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
