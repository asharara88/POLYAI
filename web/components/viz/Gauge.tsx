type Props = {
  value: number;
  min?: number;
  max?: number;
  targetBand?: [number, number];
  size?: number;
  label?: string;
  valueLabel?: string;
  className?: string;
};

/**
 * Semicircular gauge with optional target-band shading.
 * - `value` is the actual reading.
 * - `targetBand` is the [low, high] of the acceptable range, shaded in success.
 * - `size` is total width; height is roughly size / 2.
 */
export default function Gauge({
  value,
  min = 0,
  max = 5,
  targetBand,
  size = 100,
  label,
  valueLabel,
  className = "",
}: Props) {
  const w = size;
  const h = Math.round(size * 0.62);
  const cx = w / 2;
  const cy = h - 6;
  const r = w / 2 - 6;

  // Map a value in [min, max] to an angle in [180°, 360°] (left to right semicircle).
  const angleFor = (v: number) => {
    const clamped = Math.min(Math.max(v, min), max);
    const t = (clamped - min) / (max - min || 1);
    return Math.PI + t * Math.PI;
  };
  const pointFor = (v: number, radius: number) => {
    const a = angleFor(v);
    return [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius] as const;
  };

  const arcPath = (vFrom: number, vTo: number, radius: number) => {
    const [x1, y1] = pointFor(vFrom, radius);
    const [x2, y2] = pointFor(vTo, radius);
    const sweep = vFrom < vTo ? 1 : 0;
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${radius} ${radius} 0 0 ${sweep} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  };

  const [nx, ny] = pointFor(value, r);
  const inTarget =
    targetBand && value >= targetBand[0] && value <= targetBand[1];

  return (
    <div className={["inline-flex flex-col items-center", className].join(" ")}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width={w}
        height={h}
        role="img"
        aria-label={label ? `${label}: ${valueLabel ?? value}` : `gauge: ${valueLabel ?? value}`}
      >
        {/* Track */}
        <path
          d={arcPath(min, max, r)}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className="stroke-ink-100 dark:stroke-ink-800"
        />
        {/* Target band */}
        {targetBand && (
          <path
            d={arcPath(targetBand[0], targetBand[1], r)}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className="stroke-success-200 dark:stroke-success-900/50"
          />
        )}
        {/* Value sweep */}
        <path
          d={arcPath(min, value, r)}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className={
            inTarget
              ? "stroke-success-500 dark:stroke-success-400"
              : value < (targetBand?.[0] ?? min)
                ? "stroke-warning-500 dark:stroke-warning-400"
                : "stroke-danger-500 dark:stroke-danger-400"
          }
        />
        {/* Needle dot */}
        <circle
          cx={nx}
          cy={ny}
          r="3.5"
          className={
            inTarget
              ? "fill-success-600 dark:fill-success-400"
              : value < (targetBand?.[0] ?? min)
                ? "fill-warning-600 dark:fill-warning-400"
                : "fill-danger-600 dark:fill-danger-400"
          }
        />
      </svg>
      {(valueLabel || label) && (
        <div className="-mt-1 text-center">
          {valueLabel && (
            <div className="text-body-sm font-semibold tabular-nums text-ink-900 dark:text-ink-50">
              {valueLabel}
            </div>
          )}
          {label && (
            <div className="text-label-xs font-mono uppercase tracking-wider text-ink-400">
              {label}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
