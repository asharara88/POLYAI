import type { BudgetRow, ParsedBudget } from "@/lib/content";

const fmtAed = (n: number | null | undefined) =>
  n == null ? "—" : `AED ${(n / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k`;

const fmtAedFull = (n: number | null | undefined) =>
  n == null ? "—" : `AED ${n.toLocaleString()}`;

const pct = (a: number | null | undefined, b: number | null | undefined) =>
  a != null && b != null && b > 0 ? Math.round((a / b) * 100) : 0;

export default function BudgetDashboard({ budget }: { budget: ParsedBudget }) {
  const t = budget.topline;
  const totalCommittedPct = pct(t.totalCommittedAed, t.totalPlannedAed);
  const totalActualPct = pct(t.totalActualAed, t.totalPlannedAed);

  return (
    <div className="space-y-8">
      {/* Topline */}
      <section className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-ink-400">
              fiscal year {t.fiscalYear ?? ""}
            </div>
            <div className="text-2xl font-semibold mt-1">{fmtAedFull(t.totalPlannedAed)}</div>
            <div className="text-xs text-ink-500 mt-0.5">total planned</div>
          </div>
          {t.nextClose && (
            <div className="text-right text-xs font-mono text-ink-500">
              next close: {t.nextClose}
            </div>
          )}
        </div>

        <div className="h-3 rounded bg-ink-100 dark:bg-ink-800 overflow-hidden flex">
          <div className="h-full bg-accent" style={{ width: `${totalActualPct}%` }} />
          <div
            className="h-full bg-accent/40"
            style={{ width: `${Math.max(0, totalCommittedPct - totalActualPct)}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3 text-sm">
          <ToplineCell label="planned" value={t.totalPlannedAed} />
          <ToplineCell label="committed" value={t.totalCommittedAed} muted />
          <ToplineCell label="actual" value={t.totalActualAed} accent />
          <ToplineCell label="remaining" value={t.totalRemainingAed} />
        </div>
      </section>

      {/* Variance flags */}
      {budget.variances.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">
            Variance flags
          </h3>
          <div className="space-y-2">
            {budget.variances.map((v, i) => {
              const tone =
                v.status === "on-track"
                  ? "border-emerald-300/40 bg-emerald-50/30 dark:bg-emerald-950/15"
                  : v.status === "under-pacing" || v.status === "over-pacing"
                    ? "border-amber-300/40 bg-amber-50/30 dark:bg-amber-950/15"
                    : "border-red-300/40 bg-red-50/30 dark:bg-red-950/15";
              return (
                <div key={i} className={`rounded-md border ${tone} px-4 py-3 text-sm`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs text-ink-400">{v.dimension}/</span>
                      <span className="font-medium">{v.item}</span>
                    </div>
                    <div className="font-mono text-xs">
                      {v.variancePct != null ? `${v.variancePct > 0 ? "+" : ""}${v.variancePct}%` : ""} ·{" "}
                      {v.status}
                    </div>
                  </div>
                  {v.note && <div className="text-xs text-ink-500 mt-1">{v.note}</div>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* By campaign */}
      {budget.byCampaign.length > 0 && (
        <BudgetSection title="By campaign" rows={budget.byCampaign} />
      )}

      {/* By channel */}
      {budget.byChannel.length > 0 && (
        <BudgetSection title="By channel (Q3 launch)" rows={budget.byChannel} />
      )}

      {/* By event */}
      {budget.byEvent.length > 0 && (
        <BudgetSection title="By event (Q3 launch)" rows={budget.byEvent} />
      )}

      <div className="text-xs text-ink-400">
        Source: <code className="font-mono">clients/&lt;slug&gt;/marketing-budget.md</code> · Owned by the
        <code className="font-mono mx-1">marketing-financial-manager</code> agent.
      </div>
    </div>
  );
}

function BudgetSection({ title, rows }: { title: string; rows: BudgetRow[] }) {
  const maxPlanned = Math.max(1, ...rows.map((r) => r.plannedAed ?? 0));
  return (
    <section>
      <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">{title}</h3>
      <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 space-y-3">
        {rows.map((r) => {
          const actualPct = pct(r.actualAed, r.plannedAed);
          const committedPct = pct(r.committedAed, r.plannedAed);
          const planWidth = ((r.plannedAed ?? 0) / maxPlanned) * 100;
          return (
            <div key={r.name} className="grid grid-cols-12 gap-3 items-center text-sm">
              <div className="col-span-3 font-medium truncate">{r.name}</div>
              <div className="col-span-6">
                <div
                  className="h-3 rounded bg-ink-100 dark:bg-ink-800 overflow-hidden flex"
                  style={{ width: `${planWidth}%` }}
                  title={`planned ${fmtAedFull(r.plannedAed)}`}
                >
                  <div className="h-full bg-accent" style={{ width: `${actualPct}%` }} />
                  <div
                    className="h-full bg-accent/40"
                    style={{ width: `${Math.max(0, committedPct - actualPct)}%` }}
                  />
                </div>
              </div>
              <div className="col-span-3 text-right text-xs font-mono">
                <div>{fmtAed(r.actualAed)} / {fmtAed(r.plannedAed)}</div>
                <div className="text-ink-400">{actualPct}% spent</div>
              </div>
              {r.notes && (
                <div className="col-span-12 text-[11px] text-ink-500 italic ml-1">{r.notes}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ToplineCell({
  label,
  value,
  muted,
  accent,
}: {
  label: string;
  value: number | null;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-400">{label}</div>
      <div
        className={`mt-0.5 ${
          accent ? "font-semibold text-accent" : muted ? "text-ink-500" : "font-medium"
        }`}
      >
        {fmtAedFull(value)}
      </div>
    </div>
  );
}
