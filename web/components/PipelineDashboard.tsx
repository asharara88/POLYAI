import type { ParsedPipeline } from "@/lib/content";

const fmtAed = (n: number | null | undefined) =>
  n == null ? "—" : `AED ${(n / 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`;

const fmtAedFull = (n: number | null | undefined) =>
  n == null ? "—" : `AED ${n.toLocaleString()}`;

const STAGE_COLOR: Record<string, string> = {
  prospect: "bg-ink-300",
  qualified: "bg-blue-400",
  discovery: "bg-blue-500",
  evaluation: "bg-amber-500",
  proposal: "bg-emerald-500",
  negotiation: "bg-emerald-600",
};

const CHANNEL_BADGE: Record<string, string> = {
  direct: "bg-accent/15 text-accent",
  broker: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300",
  wealth: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300",
  vvip: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300",
};

export default function PipelineDashboard({ pipeline }: { pipeline: ParsedPipeline }) {
  const t = pipeline.topline;

  const targetPct = t.forecastVsTargetPct ?? 0;
  const targetTone =
    targetPct >= 90
      ? "text-emerald-600 dark:text-emerald-400"
      : targetPct >= 60
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  const maxStageValue = Math.max(1, ...pipeline.stages.map((s) => s.pipelineAed ?? 0));
  const maxChannelValue = Math.max(1, ...pipeline.channels.map((c) => c.pipelineAed ?? 0));
  const maxRmValue = Math.max(1, ...pipeline.rms.map((r) => r.pipelineAed ?? 0));

  return (
    <div className="space-y-8">
      {/* Topline */}
      <section className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-ink-400">
              snapshot · {t.snapshotDate ?? ""}
            </div>
            <div className="text-2xl font-semibold mt-1">
              {t.totalOpenDeals ?? "—"} open deals
            </div>
            <div className="text-xs text-ink-500 mt-0.5">
              {fmtAedFull(t.totalOpenPipelineAed)} total pipeline value
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono uppercase tracking-wider text-ink-400">
              forecast vs. target
            </div>
            <div className={`text-3xl font-semibold mt-1 ${targetTone}`}>{targetPct}%</div>
            <div className="text-xs text-ink-500 mt-0.5">
              {fmtAed(t.weightedForecastAed)} / {fmtAed(t.quarterlyTargetAed)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-ink-100 dark:border-ink-800 text-sm">
          <Stat label="weighted forecast" value={fmtAed(t.weightedForecastAed)} />
          <Stat label="quarterly target" value={fmtAed(t.quarterlyTargetAed)} />
          <Stat label="units in negotiation" value={t.unitsUnderActiveNegotiation ?? "—"} />
          <Stat label="units reserved" value={t.unitsReservedToDate ?? "—"} />
        </div>
      </section>

      {/* By stage */}
      {pipeline.stages.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">By stage</h3>
          <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 space-y-2">
            {pipeline.stages.map((s) => (
              <div key={s.stage} className="grid grid-cols-12 gap-3 items-center text-sm">
                <div className="col-span-2 font-mono text-xs uppercase tracking-wider text-ink-500">
                  {s.stage}
                </div>
                <div className="col-span-1 text-right font-medium">{s.count ?? "—"}</div>
                <div className="col-span-6">
                  <div
                    className={`h-3 rounded ${STAGE_COLOR[s.stage] ?? "bg-ink-300"}`}
                    style={{ width: `${((s.pipelineAed ?? 0) / maxStageValue) * 100}%` }}
                  />
                </div>
                <div className="col-span-2 text-right font-mono text-xs">
                  {fmtAed(s.pipelineAed)}
                </div>
                <div className="col-span-1 text-right text-xs text-ink-500">
                  {s.weightedCloseRate != null ? `${Math.round(s.weightedCloseRate * 100)}%` : "—"}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-ink-400 grid grid-cols-12 gap-3">
            <div className="col-span-2">stage</div>
            <div className="col-span-1 text-right">count</div>
            <div className="col-span-6">pipeline value</div>
            <div className="col-span-2 text-right">total AED</div>
            <div className="col-span-1 text-right">close %</div>
          </div>
        </section>
      )}

      {/* By channel */}
      {pipeline.channels.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">
            By channel
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {pipeline.channels.map((c) => (
              <div
                key={c.channel}
                className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4"
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      CHANNEL_BADGE[c.channel] ?? "bg-ink-100 text-ink-600"
                    }`}
                  >
                    {c.channel}
                  </span>
                  <span className="text-xs font-mono text-ink-400">{c.count ?? 0} deals</span>
                </div>
                <div className="mt-3 h-2 rounded bg-ink-100 dark:bg-ink-800 overflow-hidden">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${((c.pipelineAed ?? 0) / maxChannelValue) * 100}%` }}
                  />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-ink-400">pipeline</div>
                    <div className="font-medium">{fmtAed(c.pipelineAed)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-400">forecast</div>
                    <div className="font-medium">{fmtAed(c.weightedForecastAed)}</div>
                  </div>
                </div>
                {c.notes && (
                  <div className="mt-2 text-xs text-ink-500 italic">{c.notes}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* By RM */}
      {pipeline.rms.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">
            By in-house RM
          </h3>
          <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left">
                <tr className="border-b border-ink-200/70 dark:border-ink-800">
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">RM</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">
                    Open deals
                  </th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">
                    Pipeline value
                  </th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">
                    Pipeline AED
                  </th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">
                    Forecast AED
                  </th>
                </tr>
              </thead>
              <tbody>
                {pipeline.rms.map((r) => (
                  <tr
                    key={r.rmId}
                    className="border-b border-ink-100 dark:border-ink-800/50 last:border-0"
                  >
                    <td className="px-3 py-2">
                      <div className="font-medium text-sm">{r.rmName}</div>
                      <div className="font-mono text-[10px] text-ink-400">{r.rmId}</div>
                    </td>
                    <td className="px-3 py-2 text-right font-medium">{r.openDeals ?? "—"}</td>
                    <td className="px-3 py-2">
                      <div className="h-2 rounded bg-ink-100 dark:bg-ink-800 overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{ width: `${((r.pipelineAed ?? 0) / maxRmValue) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs">
                      {fmtAed(r.pipelineAed)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs text-accent">
                      {fmtAed(r.weightedForecastAed)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Slipping deals */}
      {pipeline.slipping.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">
            Slipping deals ({pipeline.slipping.length})
          </h3>
          <div className="space-y-2">
            {pipeline.slipping.map((d) => {
              const danger = (d.daysSinceLastActivity ?? 0) > 20;
              return (
                <div
                  key={d.dealId}
                  className={`rounded-md border ${
                    danger
                      ? "border-red-300/40 bg-red-50/30 dark:bg-red-950/15"
                      : "border-amber-300/40 bg-amber-50/20 dark:bg-amber-950/10"
                  } p-4`}
                >
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <div>
                      <div className="font-mono text-xs text-ink-400">{d.dealId}</div>
                      <div className="font-medium mt-0.5">{d.accountAnonymized}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs text-ink-500">
                        {d.stage} · {d.rmId}
                      </div>
                      <div className="font-mono text-sm text-accent mt-0.5">
                        {fmtAed(d.amountAed)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs font-mono">
                    <div>
                      <div className="text-[10px] text-ink-400">planned close</div>
                      <div>{d.closeDatePlanned ?? "—"}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-ink-400">revised close</div>
                      <div className="text-amber-600 dark:text-amber-400">
                        {d.closeDateRevised ?? "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-ink-400">days inactive</div>
                      <div className={danger ? "text-red-600 dark:text-red-400 font-semibold" : ""}>
                        {d.daysSinceLastActivity ?? "—"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs space-y-1.5">
                    <div>
                      <span className="text-ink-400">diagnosis: </span>
                      {d.diagnosis}
                    </div>
                    <div>
                      <span className="text-ink-400">recommended: </span>
                      <span className="text-ink-700 dark:text-ink-300">{d.recommendedAction}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="text-xs text-ink-400">
        Source: <code className="font-mono">clients/&lt;slug&gt;/sales/pipeline.md</code> · Owned by{" "}
        <code className="font-mono">forecasting</code> · Mock data until Salesforce read-only is wired (per{" "}
        <code className="font-mono">INTEGRATIONS.md</code>).
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-400">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}
