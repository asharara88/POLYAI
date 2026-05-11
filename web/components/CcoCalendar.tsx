"use client";

import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Flag,
  Repeat,
} from "lucide-react";
import type {
  CalendarEntry,
  DeadlineEntry,
  ParsedCcoCalendar,
  StandingEntry,
} from "@/lib/content";
import { useCcoDedupe } from "@/lib/cco-dedupe-context";

function calKey(e: CalendarEntry): string {
  return `${e.date}|${e.time}|${e.event}`;
}

export default function CcoCalendar({ calendar }: { calendar: ParsedCcoCalendar }) {
  const { excluded } = useCcoDedupe();
  const thisWeek = calendar.thisWeek.filter((e) => !excluded.calendar.has(calKey(e)));
  const nextWeek = calendar.nextWeek.filter((e) => !excluded.calendar.has(calKey(e)));
  const view: ParsedCcoCalendar = { ...calendar, thisWeek, nextWeek };
  const hasThisWeek = view.thisWeek.length > 0;
  const hasNextWeek = view.nextWeek.length > 0;
  const hasDeadlines = view.deadlines.length > 0;
  const hasStanding = view.standing.length > 0;

  return (
    <div className="space-y-5">
      <header className="flex items-baseline justify-between gap-3 flex-wrap">
        <div className="inline-flex items-center gap-2">
          <span className="text-accent">
            <CalendarClock className="w-5 h-5" aria-hidden />
          </span>
          <h2 className="text-title-sm font-semibold tracking-tight">Calendar</h2>
        </div>
        <span className="text-label-xs font-mono text-ink-400">
          updated {view.lastUpdated ?? "—"}
        </span>
      </header>

      {hasThisWeek && (
        <CalendarFrame
          label="This week"
          icon={<Clock className="w-4 h-4" />}
          count={view.thisWeek.length}
        >
          <Timeline entries={view.thisWeek} />
        </CalendarFrame>
      )}

      {hasNextWeek && (
        <CalendarFrame
          label="Next week"
          icon={<Clock className="w-4 h-4" />}
          count={view.nextWeek.length}
        >
          <Timeline entries={view.nextWeek} />
        </CalendarFrame>
      )}

      {hasDeadlines && (
        <CalendarFrame
          label="Decision deadlines"
          icon={<Flag className="w-4 h-4" />}
          count={view.deadlines.length}
          subtitle="next 90 days"
        >
          <DeadlineList items={view.deadlines} />
        </CalendarFrame>
      )}

      {hasStanding && (
        <CalendarFrame
          label="Standing items"
          icon={<Repeat className="w-4 h-4" />}
          count={view.standing.length}
          subtitle="recurring"
        >
          <StandingList items={view.standing} />
        </CalendarFrame>
      )}

      {!hasThisWeek && !hasNextWeek && !hasDeadlines && !hasStanding && (
        <div className="rounded-card border border-dashed border-ink-200 dark:border-ink-800 p-6 text-center text-body-sm text-ink-500 dark:text-ink-400">
          No calendar entries.
        </div>
      )}
    </div>
  );
}

function CalendarFrame({
  label,
  icon,
  count,
  subtitle,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  count: number;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ink-100 dark:border-ink-800 pt-6 first-of-type:border-t-0 first-of-type:pt-0">
      <header className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-accent/10 text-accent flex-shrink-0">
            {icon}
          </span>
          <h3 className="text-body-sm font-semibold tracking-tight text-ink-800 dark:text-ink-100 truncate">
            {label}
          </h3>
          {subtitle && (
            <span className="text-label-xs font-mono text-ink-400 truncate hidden sm:inline">
              {subtitle}
            </span>
          )}
        </div>
        <span className="text-label-xs font-mono text-ink-400 tabular-nums flex-shrink-0">
          {count}
        </span>
      </header>
      <div>{children}</div>
    </section>
  );
}

function Timeline({ entries }: { entries: CalendarEntry[] }) {
  return (
    <ol className="divide-y divide-ink-100 dark:divide-ink-800 -my-3">
      {entries.map((e, i) => (
        <li key={i} className="py-3 flex items-start gap-4">
          <div className="flex flex-col items-center flex-shrink-0 min-w-[3.5rem]">
            <span className="text-label-xs font-mono text-ink-400 tabular-nums uppercase tracking-wider">
              {shortDate(e.date)}
            </span>
            <span className="mt-0.5 inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-accent/10 text-accent text-label-sm font-mono tabular-nums">
              {e.time || "—"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-body-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50 leading-snug">
              {e.event}
            </div>
            {e.counterparty && (
              <div className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5 leading-snug">
                {e.counterparty}
              </div>
            )}
            {e.briefOwner && (
              <div className="text-label-xs font-mono text-ink-400 mt-1">
                brief · {e.briefOwner}
              </div>
            )}
          </div>
          <DecisionBadge decision={e.decisionNeeded} />
        </li>
      ))}
    </ol>
  );
}

function DecisionBadge({ decision }: { decision: string }) {
  const value = (decision ?? "").trim();
  const lower = value.toLowerCase();
  const hasDecision =
    /^yes/.test(lower) || /\bda-/i.test(value) || (lower !== "none" && lower !== "" && lower !== "—");
  if (!hasDecision) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-label-xs font-mono text-ink-400 bg-ink-100/60 dark:bg-ink-800/60 flex-shrink-0">
        No decision
      </span>
    );
  }
  const ref = value.match(/(DA-[\w-]+)/i)?.[1];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-label-xs font-mono bg-accent/15 text-accent flex-shrink-0">
      <CheckCircle2 className="w-3 h-3" aria-hidden />
      {ref ?? "Decision"}
    </span>
  );
}

function DeadlineList({ items }: { items: DeadlineEntry[] }) {
  return (
    <ul className="divide-y divide-ink-100 dark:divide-ink-800 -my-3">
      {items.map((d, i) => (
        <li key={i} className="py-3 flex items-start gap-4">
          <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-warning-50 dark:bg-warning-950/40 text-warning-700 dark:text-warning-300 text-label-sm font-mono tabular-nums flex-shrink-0 min-w-[5.5rem]">
            {d.deadline || "—"}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-body-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50 leading-snug">
              {d.what}
            </div>
            {(d.owner || d.reference) && (
              <div className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5 leading-snug">
                {d.owner}
                {d.owner && d.reference && (
                  <span aria-hidden className="mx-1.5 text-ink-300 dark:text-ink-700">·</span>
                )}
                {d.reference && (
                  <span className="font-mono text-label-xs text-ink-400">{d.reference}</span>
                )}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function StandingList({ items }: { items: StandingEntry[] }) {
  return (
    <ul className="divide-y divide-ink-100 dark:divide-ink-800 -my-3">
      {items.map((s, i) => (
        <li key={i} className="py-3 flex items-start gap-4">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-label-xs font-mono uppercase tracking-wider flex-shrink-0 min-w-[5.5rem]">
            <Repeat className="w-3 h-3" aria-hidden />
            {s.cadence || "—"}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-body-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50 leading-snug">
              {s.item}
            </div>
            {(s.owner || s.notes) && (
              <div className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5 leading-snug">
                {s.owner}
                {s.owner && s.notes && (
                  <span aria-hidden className="mx-1.5 text-ink-300 dark:text-ink-700">·</span>
                )}
                {s.notes}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function shortDate(date: string): string {
  if (!date) return "";
  // Accept "2026-05-06" → "May 06"; otherwise pass through.
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return date;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[Number(m[2]) - 1] ?? m[2];
  return `${month} ${m[3]}`;
}
