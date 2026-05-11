import { ReactNode } from "react";

export type TimelineEvent = {
  id: string;
  time: string; // HH:MM
  title: string;
  subtitle?: string;
  decisionRef?: string; // e.g. "DA-2026-05-06-001" — renders as accent pill
  trailing?: ReactNode; // e.g. AskAnchor button
};

const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_HEIGHT = 38; // px per hour

function parseHHMM(s: string): number | null {
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (Number.isNaN(h) || Number.isNaN(min)) return null;
  return h + min / 60;
}

/**
 * Vertical hour-block timeline. Hours 08:00–20:00 on a left rail, events
 * positioned by parsed start time. Falls back to a plain list if any event
 * lacks a parseable HH:MM time.
 */
export default function TimelineRuler({
  events,
  className = "",
}: {
  events: TimelineEvent[];
  className?: string;
}) {
  if (events.length === 0) return null;

  const parsed = events
    .map((e) => ({ ...e, hr: parseHHMM(e.time) }))
    .filter((e): e is TimelineEvent & { hr: number } => e.hr !== null);

  if (parsed.length !== events.length) {
    // Fallback: plain list
    return (
      <ul className={["divide-y divide-ink-100 dark:divide-ink-800", className].join(" ")}>
        {events.map((e) => (
          <li key={e.id} className="py-2.5 flex items-start gap-3">
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-accent/10 text-accent text-label-sm font-mono tabular-nums flex-shrink-0">
              {e.time}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-body-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50 leading-snug">
                {e.title}
              </div>
              {e.subtitle && (
                <div className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5 leading-snug">
                  {e.subtitle}
                </div>
              )}
            </div>
            {e.decisionRef && <DecisionRefPill ref_={e.decisionRef} />}
            {e.trailing}
          </li>
        ))}
      </ul>
    );
  }

  const totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

  return (
    <div className={["relative", className].join(" ")} style={{ height: totalHeight }}>
      {/* Hour rail */}
      <div className="absolute inset-y-0 left-0 w-12 border-r border-ink-100 dark:border-ink-800">
        {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => {
          const hr = START_HOUR + i;
          const top = i * HOUR_HEIGHT;
          return (
            <div
              key={hr}
              className="absolute right-2 -mt-2 text-label-xs font-mono text-ink-400 tabular-nums"
              style={{ top }}
            >
              {String(hr).padStart(2, "0")}:00
            </div>
          );
        })}
      </div>

      {/* Hour grid lines */}
      <div className="absolute inset-y-0 left-12 right-0 pointer-events-none">
        {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-ink-100/60 dark:border-ink-800/60"
            style={{ top: i * HOUR_HEIGHT }}
          />
        ))}
      </div>

      {/* Event pills */}
      <div className="absolute inset-y-0 left-12 right-0 pl-3">
        {parsed.map((e) => {
          const offset = (e.hr - START_HOUR) * HOUR_HEIGHT;
          if (offset < 0 || offset > totalHeight) return null;
          return (
            <div
              key={e.id}
              className="absolute left-3 right-2 flex items-start gap-3 group"
              style={{ top: offset }}
            >
              <span className="inline-flex items-center justify-center px-2 py-0.5 mt-0.5 rounded-md bg-accent/10 text-accent text-label-xs font-mono tabular-nums flex-shrink-0">
                {e.time}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-body-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50 leading-snug">
                  {e.title}
                </div>
                {e.subtitle && (
                  <div className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5 leading-snug">
                    {e.subtitle}
                  </div>
                )}
              </div>
              {e.decisionRef && <DecisionRefPill ref_={e.decisionRef} />}
              {e.trailing}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DecisionRefPill({ ref_ }: { ref_: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-label-xs font-mono bg-accent/15 text-accent flex-shrink-0">
      {ref_}
    </span>
  );
}
