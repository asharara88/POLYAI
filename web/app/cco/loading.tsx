import { SkeletonCard, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <header className="space-y-3">
        <Skeleton width="120px" height="0.75rem" />
        <Skeleton width="280px" height="2rem" />
        <div className="flex gap-3 pt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width="92px" height="1.75rem" />
          ))}
        </div>
      </header>

      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
