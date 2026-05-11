type Props = {
  values: number[];
  width?: number;
  height?: number;
  tone?: "neutral" | "good" | "bad" | "accent";
  fill?: boolean;
  className?: string;
  ariaLabel?: string;
};

const TONE_STROKE: Record<NonNullable<Props["tone"]>, string> = {
  neutral: "stroke-ink-400 dark:stroke-ink-500",
  good: "stroke-success-500 dark:stroke-success-400",
  bad: "stroke-danger-500 dark:stroke-danger-400",
  accent: "stroke-accent",
};

const TONE_FILL: Record<NonNullable<Props["tone"]>, string> = {
  neutral: "fill-ink-400/15 dark:fill-ink-500/15",
  good: "fill-success-500/15 dark:fill-success-400/15",
  bad: "fill-danger-500/15 dark:fill-danger-400/15",
  accent: "fill-accent/15",
};

export default function Sparkline({
  values,
  width = 80,
  height = 24,
  tone = "neutral",
  fill = true,
  className = "",
  ariaLabel,
}: Props) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);
  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - 2 - ((v - min) / range) * (height - 4);
    return [x, y] as const;
  });
  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const area = `${path} L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={["overflow-visible", className].join(" ")}
      role="img"
      aria-label={ariaLabel ?? "trend"}
    >
      {fill && <path d={area} className={TONE_FILL[tone]} />}
      <path
        d={path}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={TONE_STROKE[tone]}
      />
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r="1.8"
        className={TONE_STROKE[tone].replace("stroke-", "fill-")}
      />
    </svg>
  );
}
