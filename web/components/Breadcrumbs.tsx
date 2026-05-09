"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

export type Crumb = {
  label: string;
  href?: string;
  icon?: ReactNode;
};

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const pathname = usePathname() ?? "";
  const isWorkspace = pathname.startsWith("/workspace");

  // When the URL is /workspace/* (middleware-rewritten from /clients/<slug>/*),
  // replace the "Clients > <slug>" prefix with a single "Workspace" crumb.
  let displayCrumbs = crumbs;
  if (
    isWorkspace &&
    crumbs.length > 0 &&
    (crumbs[0].label === "Clients" || crumbs[0].label === "Workspaces")
  ) {
    const skipSlugCrumb =
      crumbs.length > 1 && (crumbs[1].href ?? "").startsWith("/clients/");
    displayCrumbs = [
      { label: "Workspace", href: "/workspace", icon: crumbs[0].icon },
      ...crumbs.slice(skipSlugCrumb ? 2 : 1),
    ];
  }

  if (displayCrumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 text-body-xs text-ink-500 dark:text-ink-400 flex-wrap"
    >
      {displayCrumbs.map((c, i) => {
        const last = i === displayCrumbs.length - 1;
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
