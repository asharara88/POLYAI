import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";
import { getLaunchesForFirm } from "@/lib/broker-allocations";
import { PHASE_LABEL, PHASE_TONE } from "@/lib/launches";

const TONE_CHIP: Record<string, string> = {
  success:
    "bg-success-100 text-success-700 dark:bg-success-950/40 dark:text-success-300 border-success-200 dark:border-success-900/50",
  warning:
    "bg-warning-100 text-warning-700 dark:bg-warning-950/40 dark:text-warning-300 border-warning-200 dark:border-warning-900/50",
  info: "bg-info-100 text-info-700 dark:bg-info-950/40 dark:text-info-300 border-info-200 dark:border-info-900/50",
  accent: "bg-accent/15 text-accent border-accent/30",
  neutral:
    "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300 border-ink-200 dark:border-ink-700",
};

export default function FirmLaunchHistory({
  clientSlug,
  firmName,
}: {
  clientSlug: string;
  firmName: string;
}) {
  const launches = getLaunchesForFirm(clientSlug, firmName);
  if (launches.length === 0) return null;

  return (
    <section
      aria-labelledby="firm-launch-history"
      className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card p-5"
    >
      <header className="mb-3">
        <h2
          id="firm-launch-history"
          className="text-body-sm font-semibold tracking-tight flex items-center gap-2"
        >
          <Building2
            className="w-4 h-4 text-ink-500 dark:text-ink-400"
            aria-hidden
          />
          Launches this firm is on
        </h2>
        <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5">
          From <code className="font-mono text-label-xs px-1 rounded bg-ink-100 dark:bg-ink-800">campaigns/&lt;id&gt;/broker-allocations.md</code>
        </p>
      </header>

      <ul className="divide-y divide-ink-100 dark:divide-ink-800">
        {launches.map((l) => (
          <li key={l.launchId}>
            <Link
              href={`/launches/${l.launchId}`}
              className="group flex items-center justify-between gap-3 py-2.5 hover:text-accent transition-colors"
            >
              <div className="min-w-0">
                <div className="text-body-sm font-medium text-ink-900 dark:text-ink-50 group-hover:text-accent truncate">
                  {l.title}
                </div>
                <div className="text-label-xs font-mono text-ink-500 dark:text-ink-400 tabular-nums">
                  {l.totalSlots} slot{l.totalSlots === 1 ? "" : "s"} · T{l.tier}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={[
                    "inline-flex items-center px-1.5 py-0.5 rounded text-label-xs font-mono uppercase tracking-wider border",
                    TONE_CHIP[PHASE_TONE[l.phase]],
                  ].join(" ")}
                >
                  {PHASE_LABEL[l.phase]}
                </span>
                <ArrowUpRight
                  className="w-3.5 h-3.5 text-ink-400 group-hover:text-accent"
                  aria-hidden
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
