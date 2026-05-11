type Cell = {
  label: string;
  subLabel?: string;
  count: number;
  tone: "red" | "amber" | "green" | "neutral";
};

const TONE_BG: Record<Cell["tone"], string> = {
  red: "bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-950/40 dark:text-danger-300 dark:border-danger-900/50",
  amber:
    "bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-950/40 dark:text-warning-300 dark:border-warning-900/50",
  green:
    "bg-success-50 text-success-700 border-success-200 dark:bg-success-950/40 dark:text-success-300 dark:border-success-900/50",
  neutral:
    "bg-ink-50 text-ink-700 border-ink-200 dark:bg-ink-900 dark:text-ink-300 dark:border-ink-800",
};

const TONE_INTENSE: Record<Cell["tone"], string> = {
  red: "bg-danger-500 dark:bg-danger-400",
  amber: "bg-warning-500 dark:bg-warning-400",
  green: "bg-success-500 dark:bg-success-400",
  neutral: "bg-ink-300 dark:bg-ink-600",
};

/**
 * Compact severity row — N cells (typically 3: Red / Amber / Green) with
 * count and label. Intensity dot on each cell amplifies the color signal.
 */
export default function SeverityHeatmap({
  cells,
  className = "",
}: {
  cells: Cell[];
  className?: string;
}) {
  return (
    <div className={["grid gap-2", className].join(" ")} style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}>
      {cells.map((c) => (
        <div
          key={c.label}
          className={["rounded-md border px-3 py-2 flex items-center gap-2.5", TONE_BG[c.tone]].join(" ")}
        >
          <span
            aria-hidden
            className={["w-2 h-2 rounded-full flex-shrink-0", TONE_INTENSE[c.tone]].join(" ")}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-title-sm font-semibold tabular-nums leading-none">
                {c.count}
              </span>
              <span className="text-label-xs font-mono uppercase tracking-wider opacity-80 truncate">
                {c.label}
              </span>
            </div>
            {c.subLabel && (
              <div className="text-label-xs font-mono opacity-60 mt-0.5 truncate">
                {c.subLabel}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
