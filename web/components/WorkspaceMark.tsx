type Props = {
  className?: string;
  size?: number;
};

/**
 * UAE Developments wordmark — placeholder for the worked-example deployment.
 * Not a real UAE Developments mark. The "WE" badge is a deliberate
 * "worked example" signal so the brand cannot be mistaken for production usage.
 */
export function WorkspaceMark({ className = "", size = 26 }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="UAE Developments"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 22 80 L 50 22 L 78 80" />
        <path d="M 35 60 L 65 60" />
      </g>
    </svg>
  );
}

export function WorkspaceWordmark({
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
        <WorkspaceMark size={size} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-semibold tracking-tight text-title-sm">
          UAE Developments
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

export default WorkspaceWordmark;
