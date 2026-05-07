import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

export type Crumb = {
  label: string;
  href?: string;
  icon?: ReactNode;
};

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 text-body-xs font-mono text-ink-400 flex-wrap"
    >
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        const node = (
          <span className="inline-flex items-center gap-1">
            {c.icon && (
              <span className="text-ink-400" aria-hidden>
                {c.icon}
              </span>
            )}
            <span className={last ? "text-ink-700 dark:text-ink-200 font-medium" : ""}>
              {c.label}
            </span>
          </span>
        );
        return (
          <span key={i} className="inline-flex items-center gap-1">
            {c.href && !last ? (
              <Link
                href={c.href}
                className="hover:text-ink-700 dark:hover:text-ink-200 transition-colors"
              >
                {node}
              </Link>
            ) : (
              node
            )}
            {!last && <ChevronRight className="w-3 h-3 text-ink-300" aria-hidden />}
          </span>
        );
      })}
    </nav>
  );
}
