import { getClients } from "@/lib/content";
import ChatClient from "./ChatClient";

export const dynamic = "force-dynamic";

export default function Page() {
  const clients = getClients()
    .filter((c) => !c.isTemplate)
    .map((c) => ({ slug: c.slug, displayName: c.displayName ?? c.slug, vertical: c.vertical ?? null }));

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Chat with the chief-commercial-officer</h1>
        <p className="text-ink-500 dark:text-ink-400 mt-2 max-w-2xl text-sm">
          The chief-commercial-officer can plan, route, and draft from here. Subagent invocation lives in Claude Code —
          the chief-commercial-officer will hand you populated handoff envelopes you can paste there.
        </p>
      </header>
      <ChatClient clients={clients} />
    </div>
  );
}
