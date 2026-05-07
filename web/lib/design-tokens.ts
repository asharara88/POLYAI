// Single source of truth for semantic color + typography tokens used across UI components.
// Components consume these via the helpers below rather than hardcoding Tailwind classes.
// When the design system evolves, change tokens here once.

export type StatusKey = "red" | "amber" | "green" | "neutral";
export type SeverityKey = "material" | "significant" | "minor";
export type UrgencyKey = "high" | "medium" | "low";
export type ToneKey =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "pink";

const STATUS_TONE: Record<StatusKey, string> = {
  red: "border-danger-300 bg-danger-50 text-danger-800 dark:border-danger-900/60 dark:bg-danger-950/40 dark:text-danger-300",
  amber:
    "border-warning-300 bg-warning-50 text-warning-800 dark:border-warning-900/60 dark:bg-warning-950/40 dark:text-warning-300",
  green:
    "border-success-300 bg-success-50 text-success-800 dark:border-success-900/60 dark:bg-success-950/40 dark:text-success-300",
  neutral:
    "border-ink-200 bg-ink-50 text-ink-700 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-300",
};

const TONE_BADGE: Record<ToneKey, string> = {
  neutral: "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300",
  accent: "bg-accent/15 text-accent dark:bg-accent/20 dark:text-accent-300",
  success: "bg-success-100 text-success-700 dark:bg-success-950/30 dark:text-success-300",
  warning: "bg-warning-100 text-warning-700 dark:bg-warning-950/30 dark:text-warning-300",
  danger: "bg-danger-100 text-danger-700 dark:bg-danger-950/30 dark:text-danger-300",
  info: "bg-info-100 text-info-700 dark:bg-info-950/30 dark:text-info-300",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300",
  pink: "bg-pink-100 text-pink-700 dark:bg-pink-950/30 dark:text-pink-300",
};

const SEVERITY_TONE: Record<SeverityKey, ToneKey> = {
  material: "danger",
  significant: "warning",
  minor: "neutral",
};

const URGENCY_TONE: Record<UrgencyKey, ToneKey> = {
  high: "danger",
  medium: "warning",
  low: "info",
};

export function statusKey(status: string): StatusKey {
  const s = (status ?? "").toLowerCase();
  if (s.includes("red")) return "red";
  if (s.includes("amber")) return "amber";
  if (s.includes("green") || s.includes("ok") || s.includes("clear")) return "green";
  return "neutral";
}

export function severityKey(severity: string): SeverityKey {
  const s = (severity ?? "").toLowerCase();
  if (s.includes("material") || s.includes("critical")) return "material";
  if (s.includes("significant") || s.includes("high")) return "significant";
  return "minor";
}

export function urgencyKey(urgency: string): UrgencyKey {
  const u = (urgency ?? "").toLowerCase();
  if (u.includes("immediate") || u.includes("48h") || u.includes("same day")) return "high";
  if (u.includes("3 business") || u.includes("5 business") || u.includes("7 business"))
    return "medium";
  return "low";
}

export function classKeyToTone(className: string): ToneKey {
  const c = (className ?? "").toLowerCase();
  if (c.includes("compliance") || c.includes("regulatory") || c.includes("regulator")) return "purple";
  if (c.includes("commercial") || c.includes("deal-desk") || c.includes("counterparty"))
    return "success";
  if (c.includes("channel") || c.includes("relationship")) return "info";
  if (c.includes("marketing") || c.includes("operational")) return "warning";
  if (c.includes("reputational") || c.includes("press")) return "pink";
  if (c.includes("governance")) return "accent";
  return "neutral";
}

export function statusTone(status: string): string {
  return STATUS_TONE[statusKey(status)];
}

export function severityTone(severity: string): string {
  return TONE_BADGE[SEVERITY_TONE[severityKey(severity)]];
}

export function urgencyTone(urgency: string): string {
  return TONE_BADGE[URGENCY_TONE[urgencyKey(urgency)]];
}

export function classTone(className: string): string {
  return TONE_BADGE[classKeyToTone(className)];
}

export function toneBadge(tone: ToneKey): string {
  return TONE_BADGE[tone];
}

// Hashed-set status color for avatars / channel-mix bars / chart series.
const SERIES_PALETTE = [
  "bg-accent",
  "bg-info-500",
  "bg-success-500",
  "bg-warning-500",
  "bg-danger-500",
  "bg-purple-500",
  "bg-pink-500",
];

export function seriesColor(index: number): string {
  return SERIES_PALETTE[Math.abs(index) % SERIES_PALETTE.length];
}
