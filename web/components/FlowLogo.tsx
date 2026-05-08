type Props = {
  className?: string;
  size?: number;
  withWordmark?: boolean;
  inverse?: boolean;
};

/**
 * Flow logo — a stylised circuit-flow icon: 3 concentric arcs with terminal +
 * intermediate dots (filled & open), evoking signal flowing through layered
 * orchestration. Uses currentColor so it adapts to brand-accent or text-color
 * depending on the surrounding scope.
 */
export function FlowMark({ className = "", size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Flow"
    >
      {/* Concentric arcs (counter-clockwise sweep, gap on right) */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        {/* Outer arc — sweep ~270° starting top, ending bottom-right */}
        <path d="M 50 10 A 40 40 0 1 0 78 78" />
        {/* Middle arc */}
        <path d="M 50 22 A 28 28 0 1 0 70 70" />
        {/* Inner arc */}
        <path d="M 50 36 A 14 14 0 1 0 62 62" />
      </g>

      {/* Filled dots — terminal points + accents */}
      <g fill="currentColor">
        <circle cx="50" cy="10" r="2.6" />
        <circle cx="78" cy="78" r="2.6" />
        <circle cx="50" cy="22" r="2.4" />
        <circle cx="70" cy="70" r="2.4" />
        <circle cx="50" cy="36" r="2.2" />
        <circle cx="62" cy="62" r="2.2" />
        <circle cx="22" cy="50" r="2.4" />
        <circle cx="36" cy="50" r="2.2" />
        <circle cx="50" cy="90" r="2.4" />
      </g>

      {/* Open dots — intermediate points */}
      <g fill="white" stroke="currentColor" strokeWidth="1.6">
        <circle cx="80" cy="32" r="2" />
        <circle cx="68" cy="20" r="2" />
        <circle cx="38" cy="22" r="2" />
        <circle cx="22" cy="68" r="2" />
        <circle cx="32" cy="34" r="2" />
        <circle cx="68" cy="86" r="2" />
        <circle cx="40" cy="78" r="2" />
        <circle cx="58" cy="46" r="1.6" />
      </g>
    </svg>
  );
}

export function FlowLogo({
  className = "",
  size = 28,
  withWordmark = true,
  inverse = false,
}: Props) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2",
        inverse ? "text-white" : "text-accent",
        className,
      ].join(" ")}
    >
      <FlowMark size={size} />
      {withWordmark && (
        <span
          className={[
            "font-semibold tracking-tight text-title-sm",
            inverse ? "text-white" : "text-ink-900 dark:text-ink-50",
          ].join(" ")}
        >
          Flow
        </span>
      )}
    </span>
  );
}

export default FlowLogo;
