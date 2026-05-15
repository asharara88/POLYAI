import Link from "next/link";
import { ArrowUpRight, Languages, MoonStar } from "lucide-react";
import type { BrokerFirm } from "@/lib/content";
import { slugify } from "@/lib/content";

const TIER_CHIP: Record<number, string> = {
  1: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900/50",
  2: "bg-info-100 text-info-700 dark:bg-info-950/40 dark:text-info-300 border-info-200 dark:border-info-900/50",
  3: "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300 border-ink-200 dark:border-ink-700",
};

export default function FirmCard({
  firm,
  clientSlug,
  hasProfile,
}: {
  firm: BrokerFirm;
  clientSlug: string;
  hasProfile: boolean;
}) {
  const firmSlug = slugify(firm.firm);
  const href = hasProfile ? `/clients/${clientSlug}/brokers/${firmSlug}` : null;

  const body = (
    <article
      className={[
        "h-full rounded-card border bg-white dark:bg-ink-900 shadow-card p-4 space-y-2 transition-colors",
        firm.dormant
          ? "border-ink-200/50 dark:border-ink-800/50 opacity-60"
          : "border-ink-200/70 dark:border-ink-800",
        href ? "group-hover:border-accent/40 group-hover:shadow-md" : "",
      ].join(" ")}
    >
      <header className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50 truncate">
          {firm.firm}
        </h3>
        <span
          className={[
            "inline-flex items-center px-1.5 py-0.5 rounded text-label-xs font-mono uppercase tracking-wider border flex-shrink-0",
            TIER_CHIP[firm.tier] ?? TIER_CHIP[3],
          ].join(" ")}
        >
          T{firm.tier}
        </span>
      </header>

      {firm.dormant && (
        <div className="inline-flex items-center gap-1 text-label-xs font-mono text-warning-700 dark:text-warning-300">
          <MoonStar className="w-3 h-3" aria-hidden />
          dormant{firm.dormantSince ? ` · since ${firm.dormantSince}` : ""}
        </div>
      )}

      {firm.specializations.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {firm.specializations.slice(0, 3).map((s) => (
            <span
              key={s}
              className="inline-flex items-center px-1.5 py-0.5 rounded bg-ink-50 dark:bg-ink-950/50 text-ink-600 dark:text-ink-300 text-label-xs font-mono border border-ink-200/60 dark:border-ink-800/60"
            >
              {s}
            </span>
          ))}
          {firm.specializations.length > 3 && (
            <span className="text-label-xs font-mono text-ink-400">
              +{firm.specializations.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-1">
        {firm.languages.length > 0 && (
          <div className="inline-flex items-center gap-1 text-label-xs font-mono text-ink-500 dark:text-ink-400">
            <Languages className="w-3 h-3" aria-hidden />
            {firm.languages.join(" · ")}
          </div>
        )}
        {firm.priorLaunchConversion != null && (
          <div className="text-label-xs font-mono text-ink-500 dark:text-ink-400 tabular-nums">
            <span className="text-ink-900 dark:text-ink-50 font-semibold">
              {(firm.priorLaunchConversion * 100).toFixed(1)}%
            </span>
            <span className="text-ink-400"> prior conv.</span>
          </div>
        )}
      </div>

      {href && (
        <div className="pt-1 inline-flex items-center gap-1 text-label-xs font-mono text-accent group-hover:gap-1.5 transition-all">
          View profile
          <ArrowUpRight className="w-3 h-3" aria-hidden />
        </div>
      )}
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="group block">
        {body}
      </Link>
    );
  }
  return body;
}
