import type { EventPlan } from "@/lib/content";

const STATUS_COLOR: Record<string, string> = {
  planning: "bg-blue-500",
  "in-flight": "bg-amber-500",
  ready: "bg-emerald-500",
  done: "bg-ink-500",
  cancelled: "bg-red-500",
};

const fmt = (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString());
const pct = (a: number | null | undefined, b: number | null | undefined) =>
  a != null && b != null && b > 0 ? Math.round((a / b) * 100) : null;

export default function EventsDashboard({ events }: { events: EventPlan[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-ink-300/70 dark:border-ink-700 px-4 py-6 text-sm text-ink-500">
        No events yet for this client.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {events.map((e) => {
          const rsvpPct = pct(e.rsvpYes, e.invited);
          const showPct = pct(e.expectedShow, e.capacity);
          const budgetCommittedPct = pct(e.committedAed, e.plannedAed);
          return (
            <div
              key={e.eventId}
              className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono text-ink-400">{e.eventId}</div>
                    <div className="text-base font-semibold mt-0.5">{e.type ?? "Event"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-ink-500">{e.date}</div>
                    <div className="mt-1 text-xs">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1.5 align-middle ${
                          STATUS_COLOR[e.status ?? ""] ?? "bg-ink-300"
                        }`}
                      />
                      {e.status}
                    </div>
                  </div>
                </div>
                {e.audience && (
                  <div className="text-sm text-ink-500 dark:text-ink-400 mt-2">{e.audience}</div>
                )}
                {e.venue && <div className="text-xs text-ink-400 mt-1">{e.venue}</div>}
              </div>

              {e.phase && (
                <div className="text-xs font-mono">
                  <span className="text-ink-400">phase: </span>
                  <span className="text-ink-700 dark:text-ink-300">{e.phase}</span>
                </div>
              )}

              {/* Headcount */}
              <div className="border-t border-ink-100 dark:border-ink-800 pt-3 space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-ink-400">
                  headcount
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <Stat label="capacity" value={fmt(e.capacity)} />
                  <Stat label="invited" value={fmt(e.invited)} />
                  <Stat label="RSVP yes" value={fmt(e.rsvpYes)} pct={rsvpPct} />
                  <Stat label="expected" value={fmt(e.expectedShow)} pct={showPct} />
                </div>
                {(e.rsvpPending ?? 0) > 0 && (
                  <div className="text-xs text-amber-600 dark:text-amber-400">
                    {e.rsvpPending} RSVP{e.rsvpPending === 1 ? "" : "s"} pending
                  </div>
                )}
              </div>

              {/* Budget */}
              {e.plannedAed != null && (
                <div className="border-t border-ink-100 dark:border-ink-800 pt-3 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div className="text-xs font-mono uppercase tracking-wider text-ink-400">
                      budget (AED)
                    </div>
                    <div className="text-xs font-mono text-ink-500">
                      {budgetCommittedPct != null ? `${budgetCommittedPct}% committed` : ""}
                    </div>
                  </div>
                  <div className="h-2 rounded bg-ink-100 dark:bg-ink-800 overflow-hidden flex">
                    <div
                      className="h-full bg-accent"
                      style={{
                        width: `${pct(e.actualAed, e.plannedAed) ?? 0}%`,
                      }}
                      title="actual"
                    />
                    <div
                      className="h-full bg-accent/40"
                      style={{
                        width: `${
                          ((budgetCommittedPct ?? 0) - (pct(e.actualAed, e.plannedAed) ?? 0)) > 0
                            ? (budgetCommittedPct ?? 0) - (pct(e.actualAed, e.plannedAed) ?? 0)
                            : 0
                        }%`,
                      }}
                      title="committed (not yet spent)"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                    <BudgetCell label="planned" value={e.plannedAed} />
                    <BudgetCell label="committed" value={e.committedAed} />
                    <BudgetCell label="actual" value={e.actualAed} />
                    <BudgetCell label="remaining" value={e.remainingAed} />
                  </div>
                </div>
              )}

              {/* Vendors + risks */}
              <div className="border-t border-ink-100 dark:border-ink-800 pt-3 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-ink-400">
                    vendors
                  </div>
                  <div className="text-sm mt-1">{e.vendorCount ?? 0} engaged</div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-ink-400">
                    risks
                  </div>
                  <div className="text-sm mt-1">
                    {e.risks && e.risks.length > 0 ? (
                      <span className="text-amber-600 dark:text-amber-400">
                        {e.risks.length} open
                      </span>
                    ) : (
                      <span className="text-ink-400">none</span>
                    )}
                  </div>
                </div>
              </div>

              {e.risks && e.risks.length > 0 && (
                <ul className="text-xs text-ink-500 dark:text-ink-400 space-y-1 ml-1">
                  {e.risks.map((r, i) => (
                    <li key={i}>· {r}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-xs text-ink-400">
        Source: <code className="font-mono">clients/&lt;slug&gt;/events/&lt;event-id&gt;/plan.md</code> · Owned by the
        <code className="font-mono mx-1">events</code> agent.
      </div>
    </div>
  );
}

function Stat({ label, value, pct }: { label: string; value: string; pct?: number | null }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-400">{label}</div>
      <div className="font-medium">{value}</div>
      {pct != null && <div className="text-[10px] text-ink-400">{pct}%</div>}
    </div>
  );
}

function BudgetCell({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-ink-400">{label}</div>
      <div className="text-ink-700 dark:text-ink-200 mt-0.5">{value != null ? value.toLocaleString() : "—"}</div>
    </div>
  );
}
