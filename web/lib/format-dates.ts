/**
 * Single source of truth for date / time formatting on user-facing surfaces.
 *
 * Three formats:
 * - relTime(iso)        — "just now" / "2h ago" / "yesterday" / "3d ago"
 * - eventLabel(date,t)  — "Today · 09:30" / "Tomorrow · 14:00" / "May 6 · 09:30"
 * - deadlineLabel(iso)  — "today" / "tomorrow" / "in 12 days" / "overdue · 3d"
 *
 * No ISO 8601 strings should appear in rendered output. No "T-45" jargon.
 */

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

function daysBetween(a: Date, b: Date): number {
  const ms = startOfDay(b).getTime() - startOfDay(a).getTime();
  return Math.round(ms / 86_400_000);
}

function parseLoose(input: string | null | undefined): Date | null {
  if (!input) return null;
  // Strict ISO with time
  let d = new Date(input);
  if (!Number.isNaN(d.getTime())) return d;
  // Date-only YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    d = new Date(input + "T00:00:00");
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}

/**
 * Relative time, anchored to a `now` (defaults to current time).
 * Examples: "just now", "5m ago", "2h ago", "yesterday", "3d ago", "2w ago"
 */
export function relTime(input: string | null | undefined, now: Date = new Date()): string {
  const d = parseLoose(input);
  if (!d) return "—";
  const diffMs = now.getTime() - d.getTime();
  if (diffMs < 0) return "just now"; // future timestamps shouldn't happen here; collapse
  const sec = Math.floor(diffMs / 1000);
  if (sec < 45) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = daysBetween(d, now);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return shortDate(d);
}

/**
 * Short month-day label. E.g. "May 6".
 */
export function shortDate(input: string | Date | null | undefined): string {
  const d = typeof input === "string" ? parseLoose(input) : input ?? null;
  if (!d) return "—";
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Composite event label: relative day name + optional time.
 * Examples: "Today · 09:30", "Tomorrow", "Wed · May 6 · 14:00".
 */
export function eventLabel(
  date: string | Date | null | undefined,
  time?: string | null,
  now: Date = new Date(),
): string {
  const d = typeof date === "string" ? parseLoose(date) : date ?? null;
  if (!d) return time ?? "—";
  const days = daysBetween(now, d);
  let head: string;
  if (days === 0) head = "Today";
  else if (days === 1) head = "Tomorrow";
  else if (days === -1) head = "Yesterday";
  else if (days > 0 && days < 7) head = `${shortDate(d)}`;
  else head = shortDate(d);
  return time ? `${head} · ${time}` : head;
}

/**
 * Deadline label: relative days, with "today" / "tomorrow" / "overdue" forms.
 * Examples: "today", "tomorrow", "in 12 days", "overdue · 3d".
 */
export function deadlineLabel(
  input: string | Date | null | undefined,
  now: Date = new Date(),
): string {
  const d = typeof input === "string" ? parseLoose(input) : input ?? null;
  if (!d) return "—";
  const days = daysBetween(now, d);
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "overdue · 1d";
  if (days < 0) return `overdue · ${Math.abs(days)}d`;
  if (days < 7) return `in ${days} days`;
  if (days < 14) return `in 1 week`;
  if (days < 60) return `in ${Math.round(days / 7)} weeks`;
  return shortDate(d);
}

/**
 * Time-only HH:MM extraction from an ISO or HH:MM input.
 */
export function timeOnly(input: string | null | undefined): string {
  if (!input) return "";
  const isoTime = input.match(/T(\d{2}:\d{2})/);
  if (isoTime) return isoTime[1];
  const hhmm = input.match(/^(\d{1,2}:\d{2})/);
  if (hhmm) return hhmm[1];
  return "";
}
