import Link from "next/link";

export function Card({
  href,
  title,
  subtitle,
  meta,
  badges,
}: {
  href: string;
  title: string;
  subtitle?: string;
  meta?: string;
  badges?: string[];
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-accent/60 hover:shadow-sm transition-all p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium truncate">{title}</div>
          {subtitle && (
            <div className="text-sm text-ink-500 dark:text-ink-400 mt-1 line-clamp-2">{subtitle}</div>
          )}
        </div>
        {meta && (
          <span className="font-mono text-[11px] text-ink-400 shrink-0 mt-0.5">{meta}</span>
        )}
      </div>
      {badges && badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <span
              key={b}
              className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300"
            >
              {b}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

export function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4">
      <div className="text-xs uppercase tracking-wider text-ink-400 font-mono">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
