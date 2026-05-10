type Props = {
  className?: string;
  size?: number;
};

/**
 * Aldar Developments wordmark — placeholder for the worked-example deployment.
 * Not a real Aldar Properties PJSC mark. The "WE" badge is a deliberate
 * "worked example" signal so the brand cannot be mistaken for production usage.
 */
export function AldarMark({ className = "", size = 26 }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Aldar Developments"
    >
      <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round">
        <path d="M 18 82 L 50 12 L 82 82 Z" />
      </g>
      <g fill="currentColor">
        <rect x="36" y="62" width="28" height="6" rx="1" />
      </g>
    </svg>
  );
}

export function AldarWordmark({
  className = "",
  size = 26,
  showSubtitle = false,
}: Props & { showSubtitle?: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 text-ink-900 dark:text-ink-50",
        className,
      ].join(" ")}
    >
      <span className="text-accent">
        <AldarMark size={size} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-semibold tracking-tight text-title-sm">
          Aldar Developments
        </span>
        {showSubtitle && (
          <span className="text-label-xs font-mono uppercase tracking-wider text-ink-400 mt-0.5">
            Worked example
          </span>
        )}
      </span>
    </span>
  );
}

export default AldarWordmark;
