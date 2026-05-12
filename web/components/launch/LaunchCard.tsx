import Link from "next/link";
import { ArrowRight, CalendarClock, Target, Wallet } from "lucide-react";
import type { LaunchSummary } from "@/lib/launches";
import { PHASE_LABEL, PHASE_TONE } from "@/lib/launches";
import { deadlineLabel } from "@/lib/format-dates";

const TONE_CHIP: Record<string, string> = {
  success: "bg-success-100 text-success-700 dark:bg-success-950/40 dark:text-success-300 border-success-200 dark:border-success-900/50",
  warning: "bg-warning-100 text-warning-700 dark:bg-warning-950/40 dark:text-warning-300 border-warning-200 dark:border-warning-900/50",
  info: "bg-info-100 text-info-700 dark:bg-info-950/40 dark:text-info-300 border-info-200 dark:border-info-900/50",
  accent: "bg-accent/15 text-accent border-accent/30",
  neutral: "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300 border-ink-200 dark:border-ink-700",
};

export default function LaunchCard({ launch }: { launch: LaunchSummary }) {
  const phaseTone = PHASE_TONE[launch.phase];
  return (
    <Link
      href={`/launches/${launch.id}`}
      className="group block rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card hover:shadow-card-hover hover:border-accent/40 transition-all p-5 space-y-4"
    >
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={[
                "inline-flex items-center gap-1 px-2 py-0.5 rounded text-label-xs font-mono uppercase tracking-wider border",
                TONE_CHIP[phaseTone],
              ].join(" ")}
            >
              {PHASE_LABEL[launch.phase]}
            </span>
            {launch.daysToClose !== null && launch.daysToClose >= 0 && (
              <span className="inline-flex items-center gap-1 text-label-xs font-mono text-ink-500 dark:text-ink-400">
                <CalendarClock className="w-3 h-3" aria-hidden />
                {launch.endDate ? deadlineLabel(launch.endDate) : "—"}
              </span>
            )}
            {launch.daysToClose !== null && launch.daysToClose < 0 && (
              <span className="inline-flex items-center gap-1 text-label-xs font-mono text-ink-400">
                <CalendarClock className="w-3 h-3" aria-hidden />
                closed
              </span>
            )}
          </div>
          <h2 className="text-title-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50 mt-2 leading-snug">
            {launch.projectName}
          </h2>
          <div className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5">
            {launchLabelFromId(launch.id)}
          </div>
        </div>
        <ArrowRight
          className="w-4 h-4 text-ink-300 group-hover:text-accent group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1"
          aria-hidden
        />
      </header>

      {launch.goal && (
        <p className="text-body-sm text-ink-700 dark:text-ink-200 leading-relaxed line-clamp-2">
          {launch.goal}
        </p>
      )}

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-3 border-t border-ink-100 dark:border-ink-800">
        <div className="flex items-start gap-1.5 min-w-0">
          <Target className="w-3.5 h-3.5 text-ink-400 flex-shrink-0 mt-0.5" aria-hidden />
          <div className="min-w-0">
            <div className="text-label-xs font-mono uppercase tracking-wider text-ink-400">
              Primary KPI
            </div>
            <div className="text-body-xs text-ink-700 dark:text-ink-200 mt-0.5 leading-snug line-clamp-2">
              {launch.primaryKpi || "—"}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-1.5 min-w-0">
          <Wallet className="w-3.5 h-3.5 text-ink-400 flex-shrink-0 mt-0.5" aria-hidden />
          <div className="min-w-0">
            <div className="text-label-xs font-mono uppercase tracking-wider text-ink-400">
              Budget
            </div>
            <div className="text-body-sm font-semibold tabular-nums text-ink-900 dark:text-ink-50 mt-0.5">
              {launch.budgetTotal ?? "—"}
            </div>
          </div>
        </div>
      </div>

      {launch.complianceFlags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {launch.complianceFlags.slice(0, 4).map((f) => (
            <span
              key={f}
              className="inline-flex items-center px-1.5 py-0.5 rounded text-label-xs font-mono text-ink-500 dark:text-ink-400 bg-ink-50 dark:bg-ink-950/40 border border-ink-200/70 dark:border-ink-800"
            >
              {f}
            </span>
          ))}
          {launch.complianceFlags.length > 4 && (
            <span className="text-label-xs font-mono text-ink-400">
              +{launch.complianceFlags.length - 4}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

function launchLabelFromId(id: string): string {
  return id
    .split("-")
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}
