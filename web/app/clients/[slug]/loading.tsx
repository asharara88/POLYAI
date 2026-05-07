import { SkeletonCard, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton width="200px" height="0.75rem" />
        <Skeleton width="320px" height="1.75rem" />
        <Skeleton width="240px" height="0.875rem" />
      </div>
      <div className="flex gap-1 border-b border-ink-200/70 dark:border-ink-800 pb-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} width="84px" height="1.75rem" />
        ))}
      </div>
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
