type SkeletonProps = {
  className?: string;
  width?: string;
  height?: string;
};

export function Skeleton({ className = "", width, height }: SkeletonProps) {
  return (
    <div
      className={[
        "rounded-md bg-gradient-to-r from-ink-100 via-ink-200/60 to-ink-100 dark:from-ink-800 dark:via-ink-700/60 dark:to-ink-800",
        "animate-shimmer bg-[length:200%_100%]",
        className,
      ].join(" ")}
      style={{ width, height: height ?? "1rem" }}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={["space-y-2", className].join(" ")}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="0.875rem"
          width={i === lines - 1 ? "60%" : "100%"}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 space-y-3">
      <Skeleton height="1.25rem" width="40%" />
      <Skeleton height="0.875rem" width="100%" />
      <Skeleton height="0.875rem" width="85%" />
      <Skeleton height="0.875rem" width="70%" />
    </div>
  );
}
