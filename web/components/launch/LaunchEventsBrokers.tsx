import { CalendarClock, Crown, MapPin, UsersRound } from "lucide-react";
import type { Launch, LaunchMilestone } from "@/lib/launches";
import { eventLabel, deadlineLabel } from "@/lib/format-dates";

/**
 * Events & brokers tab — surfaces the launch event series (sales gallery
 * preview, broker night, wealth-channel preview, public ribbon-cutting) +
 * the broker / wealth invitation slates pulled from the campaign brief
 * dependencies and channels.
 *
 * In production this would read a structured events.md / invitations.md
 * file per launch. Here we infer from the brief metadata.
 */

type LaunchEvent = {
  date: string;
  title: string;
  audience: "wealth" | "broker" | "investor" | "owner" | "public" | "internal";
  source: "milestone" | "brief";
};

const AUDIENCE_LABEL: Record<LaunchEvent["audience"], string> = {
  wealth: "Wealth-channel intermediaries",
  broker: "Tier-1 brokers",
  investor: "Invitation-only investors",
  owner: "Existing owners",
  public: "Public",
  internal: "Internal",
};

const AUDIENCE_TONE: Record<LaunchEvent["audience"], string> = {
  wealth: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900/50",
  broker: "bg-info-100 text-info-700 dark:bg-info-950/40 dark:text-info-300 border-info-200 dark:border-info-900/50",
  investor: "bg-accent/15 text-accent border-accent/30",
  owner: "bg-success-100 text-success-700 dark:bg-success-950/40 dark:text-success-300 border-success-200 dark:border-success-900/50",
  public: "bg-warning-100 text-warning-700 dark:bg-warning-950/40 dark:text-warning-300 border-warning-200 dark:border-warning-900/50",
  internal: "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300 border-ink-200 dark:border-ink-700",
};

function classifyAudience(text: string): LaunchEvent["audience"] {
  const t = text.toLowerCase();
  if (/wealth|family[- ]office|private bank|intermediary/.test(t)) return "wealth";
  if (/broker|dyad/.test(t)) return "broker";
  if (/invitation|invite|investor pack|investor/.test(t)) return "investor";
  if (/owner|loyalty|community|reception|garden/.test(t)) return "owner";
  if (/public|launch|gallery|ribbon|ceremony/.test(t)) return "public";
  return "internal";
}

function eventsFromMilestones(milestones: LaunchMilestone[]): LaunchEvent[] {
  return milestones
    .filter((m) =>
      /event|viewing|gallery|reception|ribbon|ceremony|preview|launch|briefing/i.test(m.what),
    )
    .map((m) => ({
      date: m.date,
      title: m.what,
      audience: classifyAudience(m.what),
      source: "milestone" as const,
    }));
}

export default function LaunchEventsBrokers({ launch }: { launch: Launch }) {
  const events = eventsFromMilestones(launch.milestones);

  // Broker / wealth signals from the channel mix
  const brokerChannels = launch.channels.filter((c) =>
    /broker|wealth|whatsapp|family[- ]office|intermediary/i.test(c.channel),
  );

  // Dependencies that reference broker / wealth / events agents
  const orgAssignments = launch.dependencies.filter((d) =>
    /broker|wealth|events|vvip|relationship/i.test(d),
  );

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-title-sm font-semibold tracking-tight">
          Launch events &amp; relationship channels
        </h2>
        <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5">
          Event series, broker dyads, wealth-channel briefings — the launch's
          high-touch surface.
        </p>
      </header>

      {/* Event timeline */}
      <section aria-labelledby="event-series">
        <h3 id="event-series" className="text-body-sm font-semibold tracking-tight mb-3">
          Event series
        </h3>
        {events.length === 0 ? (
          <div className="rounded-card border border-dashed border-ink-200 dark:border-ink-800 p-6 text-center text-body-sm text-ink-500 dark:text-ink-400">
            No event milestones declared in the brief yet.
          </div>
        ) : (
          <div className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card divide-y divide-ink-100 dark:divide-ink-800 overflow-hidden">
            {events.map((e, i) => (
              <div key={i} className="px-5 py-4 flex items-start gap-4">
                <div className="flex flex-col items-center flex-shrink-0 min-w-[4rem]">
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-accent/10 text-accent text-label-sm font-mono tabular-nums">
                    {eventLabel(e.date) || "—"}
                  </span>
                  <span className="text-label-xs font-mono text-ink-400 mt-0.5 tabular-nums">
                    {deadlineLabel(e.date)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-body-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50 leading-snug">
                    {e.title}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span
                      className={[
                        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-label-xs font-mono uppercase tracking-wider border",
                        AUDIENCE_TONE[e.audience],
                      ].join(" ")}
                    >
                      {AUDIENCE_LABEL[e.audience]}
                    </span>
                    <span className="inline-flex items-center gap-1 text-label-xs font-mono text-ink-400">
                      <MapPin className="w-3 h-3" aria-hidden />
                      {e.audience === "owner"
                        ? "On-community"
                        : e.audience === "wealth" || e.audience === "investor"
                          ? "Sales gallery — private"
                          : e.audience === "broker"
                            ? "Sales gallery — broker session"
                            : "Sales gallery"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Broker / wealth slate */}
      {brokerChannels.length > 0 && (
        <section aria-labelledby="broker-wealth">
          <h3 id="broker-wealth" className="text-body-sm font-semibold tracking-tight mb-3">
            Broker &amp; wealth-channel allocation
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {brokerChannels.map((c) => {
              const isWealth = /wealth|family[- ]office|intermediary/i.test(c.channel);
              return (
                <div
                  key={c.channel}
                  className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-ink-50/30 dark:bg-ink-950/30 p-4"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {isWealth ? (
                      <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden />
                    ) : (
                      <UsersRound className="w-4 h-4 text-info-600 dark:text-info-400" aria-hidden />
                    )}
                    <h4 className="text-body-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50">
                      {c.channel}
                    </h4>
                  </div>
                  <div className="text-label-xs font-mono text-ink-500 dark:text-ink-400 mb-2">
                    {(c.weight * 100).toFixed(0)}% of channel mix
                  </div>
                  {c.rationale && (
                    <p className="text-body-xs text-ink-600 dark:text-ink-300 leading-snug">
                      {c.rationale}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Org assignments */}
      {orgAssignments.length > 0 && (
        <section aria-labelledby="assignments">
          <h3 id="assignments" className="text-body-sm font-semibold tracking-tight mb-3">
            Pod assignments
          </h3>
          <ul className="text-body-sm text-ink-700 dark:text-ink-200 space-y-1.5">
            {orgAssignments.map((d, i) => (
              <li key={i} className="flex items-start gap-2">
                <CalendarClock className="w-3.5 h-3.5 text-ink-400 flex-shrink-0 mt-0.5" aria-hidden />
                <span className="leading-snug">{d}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
