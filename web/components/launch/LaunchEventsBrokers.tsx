import { CalendarClock, Crown, UsersRound } from "lucide-react";
import {
  getLaunchEvents,
  type Launch,
  type LaunchMilestone,
} from "@/lib/launches";
import { eventLabel, deadlineLabel } from "@/lib/format-dates";
import EventDetailCard from "@/components/launch/EventDetailCard";
import BrokerAllocationTable from "@/components/broker/BrokerAllocationTable";

// Words too generic to count toward dedup-overlap signal.
const DEDUP_STOPWORDS = new Set([
  "the", "and", "for", "with", "from", "into", "onto", "over", "this", "that",
  "live", "first", "final", "begin", "begins", "next", "open", "opens", "opening",
  "tier", "event", "events", "phase", "stage", "step", "day", "days", "week",
  "weeks", "month", "months", "year", "years", "launch", "campaign",
]);

function dedupTokens(text: string): Set<string> {
  // Lowercase, strip non-alphanumerics, keep tokens length ≥ 4 that aren't stopwords.
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !DEDUP_STOPWORDS.has(w)),
  );
}

function tokenOverlap(a: Set<string>, b: Set<string>): number {
  let count = 0;
  for (const w of a) if (b.has(w)) count++;
  return count;
}

/**
 * Events & brokers tab.
 *
 * Two sources of events:
 * 1. Authored event files at clients/<slug>/campaigns/<id>/events/*.md —
 *    rendered as full EventDetailCard with attendance funnel + invitee
 *    slate by protocol tier.
 * 2. Timeline milestones from the campaign brief — rendered as a compact
 *    fallback list for events without their own file.
 *
 * Below the events: broker / wealth channel allocation from the channel
 * mix, plus pod assignments from the brief dependencies.
 */

type FallbackEvent = {
  date: string;
  title: string;
  audience: "wealth" | "broker" | "investor" | "owner" | "public" | "internal";
};

const AUDIENCE_LABEL: Record<FallbackEvent["audience"], string> = {
  wealth: "Wealth-channel intermediaries",
  broker: "Tier-1 brokers",
  investor: "Invitation-only investors",
  owner: "Existing owners",
  public: "Public",
  internal: "Internal",
};

const AUDIENCE_TONE: Record<FallbackEvent["audience"], string> = {
  wealth: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900/50",
  broker: "bg-info-100 text-info-700 dark:bg-info-950/40 dark:text-info-300 border-info-200 dark:border-info-900/50",
  investor: "bg-accent/15 text-accent border-accent/30",
  owner: "bg-success-100 text-success-700 dark:bg-success-950/40 dark:text-success-300 border-success-200 dark:border-success-900/50",
  public: "bg-warning-100 text-warning-700 dark:bg-warning-950/40 dark:text-warning-300 border-warning-200 dark:border-warning-900/50",
  internal: "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300 border-ink-200 dark:border-ink-700",
};

function classifyAudience(text: string): FallbackEvent["audience"] {
  const t = text.toLowerCase();
  if (/wealth|family[- ]office|private bank|intermediary/.test(t)) return "wealth";
  if (/broker|dyad/.test(t)) return "broker";
  if (/invitation|invite|investor pack|investor/.test(t)) return "investor";
  if (/owner|loyalty|community|reception|garden/.test(t)) return "owner";
  if (/public|launch|gallery|ribbon|ceremony/.test(t)) return "public";
  return "internal";
}

type AuthoredFingerprint = { date: string; tokens: Set<string> };

function fallbackEventsFromMilestones(
  milestones: LaunchMilestone[],
  authored: AuthoredFingerprint[],
): FallbackEvent[] {
  return milestones
    .filter((m) =>
      /event|viewing|gallery|reception|ribbon|ceremony|preview|launch|briefing/i.test(m.what),
    )
    .filter((m) => {
      // Suppress only when an authored event has BOTH the same date AND
      // shares ≥ 2 meaningful tokens with the milestone text. Same-date
      // collisions on unrelated moments (broker night + paid-creative-live
      // on 2026-06-10) and same-name different-date occurrences (the Sept-14
      // and Sept-28 private viewings) are both preserved.
      const milestoneTokens = dedupTokens(m.what);
      return !authored.some(
        (a) => a.date === m.date && tokenOverlap(milestoneTokens, a.tokens) >= 2,
      );
    })
    .map((m) => ({
      date: m.date,
      title: m.what,
      audience: classifyAudience(m.what),
    }));
}

export default function LaunchEventsBrokers({ launch }: { launch: Launch }) {
  const authored = getLaunchEvents(launch.clientSlug, launch.id);
  const authoredFingerprints: AuthoredFingerprint[] = authored
    .filter((e) => e.date)
    .map((e) => ({ date: e.date, tokens: dedupTokens(e.title) }));
  const fallback = fallbackEventsFromMilestones(launch.milestones, authoredFingerprints);

  // Broker / wealth signals from the channel mix
  const brokerChannels = launch.channels.filter((c) =>
    /broker|wealth|whatsapp|family[- ]office|intermediary/i.test(c.channel),
  );

  // Dependencies that reference broker / wealth / events agents
  const orgAssignments = launch.dependencies.filter((d) =>
    /broker|wealth|events|vvip|relationship/i.test(d),
  );

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-title-sm font-semibold tracking-tight">
          Launch events &amp; relationship channels
        </h2>
        <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5">
          Event-by-event attendance, invitee slate by protocol tier, and the
          broker / wealth channel allocation feeding them.
        </p>
      </header>

      {/* Authored events — full detail cards */}
      {authored.length > 0 && (
        <section aria-labelledby="event-cards" className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h3 id="event-cards" className="text-body-sm font-semibold tracking-tight">
              Event series
            </h3>
            <span className="text-label-xs font-mono text-ink-400 tabular-nums">
              {authored.length} authored
              {fallback.length > 0 && (
                <span className="text-ink-400"> · +{fallback.length} planned</span>
              )}
            </span>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {authored.map((e) => (
              <EventDetailCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {/* Fallback: milestones without an authored event file */}
      {fallback.length > 0 && (
        <section aria-labelledby="planned-events">
          <h3
            id="planned-events"
            className="text-body-sm font-semibold tracking-tight mb-3"
          >
            {authored.length > 0 ? "Other planned moments" : "Event series"}
          </h3>
          <div className="rounded-card border border-dashed border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 divide-y divide-ink-100 dark:divide-ink-800 overflow-hidden">
            {fallback.map((e, i) => (
              <div key={i} className="px-5 py-3 flex items-start gap-4">
                <div className="flex flex-col items-center flex-shrink-0 min-w-[4rem]">
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 text-label-sm font-mono tabular-nums">
                    {eventLabel(e.date) || "—"}
                  </span>
                  <span className="text-label-xs font-mono text-ink-400 mt-0.5 tabular-nums">
                    {deadlineLabel(e.date)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-body-sm font-medium tracking-tight text-ink-800 dark:text-ink-100 leading-snug">
                    {e.title}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span
                      className={[
                        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-label-xs font-mono uppercase tracking-wider border",
                        AUDIENCE_TONE[e.audience],
                      ].join(" ")}
                    >
                      {AUDIENCE_LABEL[e.audience]}
                    </span>
                    <span className="inline-flex items-center gap-1 text-label-xs font-mono text-ink-400">
                      <CalendarClock className="w-3 h-3" aria-hidden />
                      no event file yet
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-2 italic leading-relaxed">
            Add{" "}
            <code className="font-mono text-label-xs px-1 rounded bg-ink-100 dark:bg-ink-800">
              clients/&lt;slug&gt;/campaigns/{launch.id}/events/&lt;event-id&gt;.md
            </code>{" "}
            to promote a planned moment into a full event with attendance + invitee slate.
          </p>
        </section>
      )}

      {authored.length === 0 && fallback.length === 0 && (
        <div className="rounded-card border border-dashed border-ink-200 dark:border-ink-800 p-6 text-center text-body-sm text-ink-500 dark:text-ink-400">
          No events declared in the brief or events folder yet.
        </div>
      )}

      {/* Authored broker-firm allocations (campaigns/<id>/broker-allocations.md) */}
      <BrokerAllocationTable clientSlug={launch.clientSlug} launchId={launch.id} />

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
