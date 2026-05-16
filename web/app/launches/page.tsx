import { Megaphone, Sparkles } from "lucide-react";
import { getLaunches } from "@/lib/launches";
import LaunchCard from "@/components/launch/LaunchCard";

export const dynamic = "force-static";

// Single-tenant deployment — workspace pinned to UAE Developments. The runtime cookie
// stays the source of truth for non-static surfaces.
const WORKSPACE = "uae-developments";

export default function LaunchesPage() {
  const launches = getLaunches(WORKSPACE);
  const live = launches.filter((l) => l.phase === "live" || l.phase === "pre-launch");
  const upstream = launches.filter((l) => l.phase === "creative" || l.phase === "brief");
  const closing = launches.filter((l) => l.phase === "close-out");

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <div className="text-label-xs font-mono uppercase tracking-wider text-accent">
              <span className="inline-flex items-center gap-1.5">
                <Megaphone className="w-3 h-3" aria-hidden /> Marketing
              </span>
            </div>
            <h1 className="text-display font-semibold tracking-tight mt-1">
              Launches
            </h1>
            <p className="text-body text-ink-600 dark:text-ink-300 mt-1.5 max-w-2xl">
              Active and upcoming campaigns by project. Each launch consolidates the brief, channel mix, finance, events &amp; brokers, decisions and risks for that campaign.
            </p>
          </div>
          <div className="text-label-xs font-mono text-ink-400 tabular-nums">
            {launches.length} {launches.length === 1 ? "campaign" : "campaigns"}
          </div>
        </div>
      </header>

      {live.length > 0 && (
        <LaunchGroup label="Active" subtitle="Live or in pre-launch window" launches={live} />
      )}
      {upstream.length > 0 && (
        <LaunchGroup
          label="In creative"
          subtitle="Briefing, asset production, channel planning"
          launches={upstream}
        />
      )}
      {closing.length > 0 && (
        <LaunchGroup
          label="Closing out"
          subtitle="Past public launch — measurement &amp; learning capture"
          launches={closing}
        />
      )}

      {launches.length === 0 && (
        <div className="rounded-card border border-dashed border-ink-200 dark:border-ink-800 p-8 text-center">
          <Sparkles className="w-8 h-8 text-ink-300 mx-auto mb-2" aria-hidden />
          <p className="text-body text-ink-600 dark:text-ink-300">
            No campaigns configured yet.
          </p>
          <p className="text-body-sm text-ink-500 dark:text-ink-400 mt-1.5">
            Add a campaign brief at{" "}
            <code className="font-mono text-label-xs px-1 py-0.5 rounded bg-ink-100 dark:bg-ink-800">
              clients/&lt;slug&gt;/campaigns/&lt;id&gt;/campaign-brief.md
            </code>
            .
          </p>
        </div>
      )}
    </div>
  );
}

function LaunchGroup({
  label,
  subtitle,
  launches,
}: {
  label: string;
  subtitle: string;
  launches: ReturnType<typeof getLaunches>;
}) {
  return (
    <section aria-label={label} className="space-y-4">
      <header className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-title-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50">
            {label}
          </h2>
          <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5">
            {subtitle}
          </p>
        </div>
        <span className="text-label-xs font-mono text-ink-400 tabular-nums">
          {launches.length}
        </span>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {launches.map((l) => (
          <LaunchCard key={l.id} launch={l} />
        ))}
      </div>
    </section>
  );
}
