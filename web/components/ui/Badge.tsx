import { ReactNode } from "react";
import {
  toneBadge,
  type ToneKey,
  classTone,
  urgencyTone,
  severityTone,
  statusKey,
} from "@/lib/design-tokens";

type BadgeProps = {
  children: ReactNode;
  tone?: ToneKey;
  variant?: "soft" | "outline";
  size?: "xs" | "sm";
  className?: string;
  uppercase?: boolean;
};

const SIZE: Record<string, string> = {
  xs: "text-label-xs px-1.5 py-0.5",
  sm: "text-label-sm px-2 py-0.5",
};

export function Badge({
  children,
  tone = "neutral",
  variant = "soft",
  size = "xs",
  className = "",
  uppercase = true,
}: BadgeProps) {
  const base = "inline-flex items-center gap-1 font-mono rounded";
  const styles =
    variant === "outline"
      ? "border border-current bg-transparent " + toneBadge(tone).split(" ")[1]
      : toneBadge(tone);
  return (
    <span
      className={[
        base,
        SIZE[size],
        styles,
        uppercase ? "uppercase tracking-wider" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}

export function ClassBadge({ value }: { value: string }) {
  return (
    <span
      className={[
        "inline-flex items-center font-mono rounded text-label-xs px-1.5 py-0.5 uppercase tracking-wider",
        classTone(value),
      ].join(" ")}
    >
      {value}
    </span>
  );
}

export function UrgencyBadge({ value }: { value: string }) {
  return (
    <span
      className={[
        "inline-flex items-center font-mono rounded text-label-xs px-1.5 py-0.5 uppercase tracking-wider border",
        urgencyTone(value),
      ].join(" ")}
    >
      {value}
    </span>
  );
}

export function SeverityBadge({ value }: { value: string }) {
  return (
    <span
      className={[
        "inline-flex items-center font-mono rounded text-label-xs px-1.5 py-0.5 uppercase tracking-wider",
        severityTone(value),
      ].join(" ")}
    >
      {value}
    </span>
  );
}

const STATUS_DOT: Record<string, string> = {
  red: "bg-danger-500",
  amber: "bg-warning-500",
  green: "bg-success-500",
  neutral: "bg-ink-400",
};

export function StatusPill({
  status,
  ageDays,
}: {
  status: string;
  ageDays?: number | null;
}) {
  const sk = statusKey(status);
  const colorByKey: Record<string, string> = {
    red: "bg-danger-100 text-danger-800 border-danger-200 dark:bg-danger-950/40 dark:text-danger-300 dark:border-danger-900/60",
    amber:
      "bg-warning-100 text-warning-800 border-warning-200 dark:bg-warning-950/40 dark:text-warning-300 dark:border-warning-900/60",
    green:
      "bg-success-100 text-success-800 border-success-200 dark:bg-success-950/40 dark:text-success-300 dark:border-success-900/60",
    neutral: "bg-ink-100 text-ink-700 border-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:border-ink-700",
  };
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 font-mono rounded text-label-xs px-1.5 py-0.5 uppercase tracking-wider border",
        colorByKey[sk],
      ].join(" ")}
    >
      <span className={["w-1.5 h-1.5 rounded-full", STATUS_DOT[sk]].join(" ")} aria-hidden />
      {sk}
      {ageDays != null && <span className="opacity-70">· {ageDays}d</span>}
    </span>
  );
}
