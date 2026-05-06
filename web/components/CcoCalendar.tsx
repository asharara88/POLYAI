import type { ParsedCcoCalendar, CalendarEntry } from "@/lib/content";

function CalendarTable({ entries, label }: { entries: CalendarEntry[]; label: string }) {
  if (entries.length === 0) return null;
  return (
    <section>
      <h3 className="text-sm font-mono uppercase tracking-wider text-ink-500 mb-2">{label}</h3>
      <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/30">
              <th className="text-left font-mono uppercase tracking-wider text-ink-400 px-3 py-2">date · time</th>
              <th className="text-left font-mono uppercase tracking-wider text-ink-400 px-3 py-2">event</th>
              <th className="text-left font-mono uppercase tracking-wider text-ink-400 px-3 py-2">counterparty</th>
              <th className="text-left font-mono uppercase tracking-wider text-ink-400 px-3 py-2">decision</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => {
              const decision = e.decisionNeeded.toLowerCase();
              const isYes = decision.startsWith("yes") || (decision !== "none" && decision !== "" && decision !== "—");
              return (
                <tr key={i} className="border-b border-ink-100 dark:border-ink-800 last:border-0">
                  <td className="px-3 py-2 font-mono text-ink-500 whitespace-nowrap">
                    <div>{e.date}</div>
                    <div className="text-[10px] text-ink-400">{e.time}</div>
                  </td>
                  <td className="px-3 py-2">{e.event}</td>
                  <td className="px-3 py-2 text-ink-600 dark:text-ink-400">{e.counterparty}</td>
                  <td className="px-3 py-2">
                    {isYes ? (
                      <span className="inline-block bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300 text-[10px] font-mono px-1.5 py-0.5 rounded">
                        {e.decisionNeeded}
                      </span>
                    ) : (
                      <span className="text-ink-400 text-[11px]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function CcoCalendar({ calendar }: { calendar: ParsedCcoCalendar }) {
  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-semibold">Calendar</h2>
        <div className="text-xs font-mono text-ink-400">
          updated {calendar.lastUpdated ?? "—"}
        </div>
      </div>

      <CalendarTable entries={calendar.thisWeek} label="This week" />
      <CalendarTable entries={calendar.nextWeek} label="Next week" />

      {calendar.deadlines.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-500 mb-2">
            Upcoming decision-deadlines (90 days)
          </h3>
          <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/30">
                  <th className="text-left font-mono uppercase tracking-wider text-ink-400 px-3 py-2">deadline</th>
                  <th className="text-left font-mono uppercase tracking-wider text-ink-400 px-3 py-2">what</th>
                  <th className="text-left font-mono uppercase tracking-wider text-ink-400 px-3 py-2">owner</th>
                </tr>
              </thead>
              <tbody>
                {calendar.deadlines.map((d, i) => (
                  <tr key={i} className="border-b border-ink-100 dark:border-ink-800 last:border-0">
                    <td className="px-3 py-2 font-mono text-ink-500 whitespace-nowrap">{d.deadline}</td>
                    <td className="px-3 py-2">{d.what}</td>
                    <td className="px-3 py-2 text-ink-600 dark:text-ink-400">{d.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {calendar.standing.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-500 mb-2">
            Standing items (recurring)
          </h3>
          <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/30">
                  <th className="text-left font-mono uppercase tracking-wider text-ink-400 px-3 py-2">cadence</th>
                  <th className="text-left font-mono uppercase tracking-wider text-ink-400 px-3 py-2">item</th>
                  <th className="text-left font-mono uppercase tracking-wider text-ink-400 px-3 py-2">owner</th>
                </tr>
              </thead>
              <tbody>
                {calendar.standing.map((s, i) => (
                  <tr key={i} className="border-b border-ink-100 dark:border-ink-800 last:border-0">
                    <td className="px-3 py-2 font-mono text-ink-500 whitespace-nowrap">{s.cadence}</td>
                    <td className="px-3 py-2">{s.item}</td>
                    <td className="px-3 py-2 text-ink-600 dark:text-ink-400">{s.owner}</td>
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
