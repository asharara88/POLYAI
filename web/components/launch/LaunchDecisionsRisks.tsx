import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { getDecisionAsks, getRiskRegister } from "@/lib/content";
import type { Launch } from "@/lib/launches";
import { plainLanguage } from "@/lib/strip-jargon";

const WORKSPACE = "uae-developments";

/**
 * Decisions + Risks scoped to this launch. We don't have an explicit
 * launchId field on decision-asks or risks today; we filter heuristically
 * by matching the launch's project name or campaign id against the ask
 * text / risk title / description.
 */

function matchesLaunch(text: string, launch: Launch): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  const project = launch.projectName.toLowerCase();
  if (t.includes(project)) return true;
  // Match by campaign id tokens (e.g. "q3-tower-launch" → "q3", "tower", "launch")
  const tokens = launch.id.split("-").filter((w) => w.length > 2);
  return tokens.some((w) => t.includes(w));
}

export default function LaunchDecisionsRisks({ launch }: { launch: Launch }) {
  const asks = getDecisionAsks(WORKSPACE);
  const risks = getRiskRegister(WORKSPACE);
  const scopedAsks = asks
    ? asks.pending.filter(
        (a) => matchesLaunch(a.ask, launch) || matchesLaunch(a.recommendation ?? "", launch),
      )
    : [];
  const scopedRisks = risks
    ? risks.open.filter(
        (r) =>
          matchesLaunch(r.title, launch) ||
          matchesLaunch(r.description, launch),
      )
    : [];

  return (
    <div className="space-y-8">
      <section aria-labelledby="launch-decisions">
        <header className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
          <h2
            id="launch-decisions"
            className="text-title-sm font-semibold tracking-tight"
          >
            Decisions waiting on this launch
          </h2>
          <span className="text-label-xs font-mono text-ink-400 tabular-nums">
            {scopedAsks.length}
          </span>
        </header>
        {scopedAsks.length === 0 ? (
          <div className="rounded-card border border-dashed border-ink-200 dark:border-ink-800 p-6 text-center text-body-sm text-ink-500 dark:text-ink-400">
            No pending decisions tagged to this launch.
          </div>
        ) : (
          <div className="space-y-2.5">
            {scopedAsks.map((a) => (
              <article
                key={a.id}
                className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card p-4 space-y-2"
              >
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <h3 className="text-body font-semibold tracking-tight leading-snug min-w-0">
                    {a.ask}
                  </h3>
                  <span className="text-label-xs font-mono text-ink-400 tabular-nums flex-shrink-0">
                    {a.sla}
                  </span>
                </div>
                {a.recommendation && (
                  <p className="text-body-sm text-ink-700 dark:text-ink-200 leading-relaxed">
                    <span className="font-semibold">Recommendation:</span>{" "}
                    {plainLanguage(a.recommendation)}
                  </p>
                )}
                <div className="text-label-xs font-mono text-ink-400">
                  {a.id} · {a.className} · {a.urgency}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="launch-risks">
        <header className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
          <h2
            id="launch-risks"
            className="text-title-sm font-semibold tracking-tight"
          >
            Risks on this launch
          </h2>
          <span className="text-label-xs font-mono text-ink-400 tabular-nums">
            {scopedRisks.length}
          </span>
        </header>
        {scopedRisks.length === 0 ? (
          <div className="rounded-card border border-dashed border-ink-200 dark:border-ink-800 p-6 text-center text-body-sm text-ink-500 dark:text-ink-400 inline-flex items-center justify-center gap-2 w-full">
            <CheckCircle2 className="w-4 h-4 text-success-600 dark:text-success-400" aria-hidden />
            No open risks tagged to this launch.
          </div>
        ) : (
          <div className="space-y-2.5">
            {scopedRisks.map((r) => (
              <article
                key={r.title}
                className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card p-4 space-y-2"
              >
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <h3 className="text-body font-semibold tracking-tight leading-snug min-w-0 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning-600 dark:text-warning-400 flex-shrink-0" aria-hidden />
                    {r.title}
                  </h3>
                  <span className="text-label-xs font-mono text-ink-400 tabular-nums flex-shrink-0">
                    {r.severity} · {r.status}
                  </span>
                </div>
                <p className="text-body-sm text-ink-700 dark:text-ink-200 leading-relaxed">
                  {plainLanguage(r.description)}
                </p>
                <div className="text-label-xs font-mono text-ink-400">
                  Owner: {r.ownerHuman ?? r.ownerAgent ?? "—"}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
