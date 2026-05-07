import type { ParsedDecisionAsks, DecisionAsk } from "@/lib/content";
import SignDecisionAsk from "@/components/SignDecisionAsk";

function urgencyTone(urgency: string): string {
  const u = urgency.toLowerCase();
  if (u.includes("48h") || u.includes("immediate") || u.includes("same day")) {
    return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/40";
  }
  if (u.includes("3 business") || u.includes("5 business")) {
    return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40";
  }
  return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/40";
}

function classTone(className: string): string {
  const c = className.toLowerCase();
  if (c.includes("compliance")) return "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300";
  if (c.includes("commercial") || c.includes("deal")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300";
  if (c.includes("channel") || c.includes("relationship")) return "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300";
  if (c.includes("marketing") || c.includes("operational")) return "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300";
  return "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300";
}

function AskCard({ ask, client }: { ask: DecisionAsk; client: string }) {
  return (
    <details className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 group">
      <summary className="cursor-pointer p-4 list-none">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">
                {ask.id}
              </span>
              <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${classTone(ask.className)}`}>
                {ask.className}
              </span>
              <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${urgencyTone(ask.urgency)}`}>
                {ask.urgency}
              </span>
            </div>
            <div className="font-semibold text-sm mt-1.5 leading-snug">{ask.ask}</div>
          </div>
          <div className="text-[11px] font-mono text-ink-400 flex-shrink-0">
            <span className="group-open:hidden">expand ▾</span>
            <span className="hidden group-open:inline">collapse ▴</span>
          </div>
        </div>
        <div className="text-[11px] font-mono text-ink-400 mt-2 flex flex-wrap gap-x-3">
          <span>by {ask.submitter}</span>
          <span>· {ask.submittedAt}</span>
          <span>· {ask.sla}</span>
        </div>
      </summary>
      <div className="px-4 pb-4 pt-0 border-t border-ink-100 dark:border-ink-800 space-y-3 text-sm">
        {ask.recommendation && (
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-ink-400 mb-0.5">
              recommendation
            </div>
            <div className="text-ink-700 dark:text-ink-300 leading-relaxed">{ask.recommendation}</div>
          </div>
        )}
        {ask.alternatives && (
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-ink-400 mb-0.5">
              alternatives considered
            </div>
            <div className="text-ink-600 dark:text-ink-400 leading-relaxed">{ask.alternatives}</div>
          </div>
        )}
        {ask.evidence && (
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-ink-400 mb-0.5">
              evidence
            </div>
            <div className="text-ink-500 leading-relaxed font-mono text-xs">{ask.evidence}</div>
          </div>
        )}
        <SignDecisionAsk client={client} askId={ask.id} />
      </div>
    </details>
  );
}

export default function DecisionAsksQueue({
  asks,
  client,
}: {
  asks: ParsedDecisionAsks;
  client: string;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Decision-asks queue</h2>
          <p className="text-xs text-ink-500 mt-0.5">
            {asks.pending.length} pending · {asks.recentlySigned.length} signed last 7 days
          </p>
        </div>
        <div className="text-xs font-mono text-ink-400">{asks.date}</div>
      </div>

      <div className="space-y-2">
        {asks.pending.map((a) => (
          <AskCard key={a.id} ask={a} client={client} />
        ))}
      </div>

      {asks.recentlySigned.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-500 mb-2">
            Recently signed (audit trail)
          </h3>
          <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/30">
                  <th className="text-left font-mono uppercase tracking-wider text-ink-400 px-3 py-2">id</th>
                  <th className="text-left font-mono uppercase tracking-wider text-ink-400 px-3 py-2">submitted</th>
                  <th className="text-left font-mono uppercase tracking-wider text-ink-400 px-3 py-2">decision</th>
                  <th className="text-left font-mono uppercase tracking-wider text-ink-400 px-3 py-2">decided</th>
                </tr>
              </thead>
              <tbody>
                {asks.recentlySigned.map((s) => (
                  <tr key={s.id} className="border-b border-ink-100 dark:border-ink-800 last:border-0">
                    <td className="px-3 py-2 font-mono text-ink-400">{s.id}</td>
                    <td className="px-3 py-2 text-ink-500">{s.submitted}</td>
                    <td className="px-3 py-2">{s.decision}</td>
                    <td className="px-3 py-2 text-ink-500">
                      {s.decidedBy} · {s.decidedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
