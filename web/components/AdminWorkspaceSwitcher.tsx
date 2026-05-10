"use client";

import { Check } from "lucide-react";
import { useIdentity } from "@/lib/identity";

type Workspace = { slug: string; name: string; isExample: boolean };

export default function AdminWorkspaceSwitcher({
  workspaces,
}: {
  workspaces: Workspace[];
}) {
  const { identity, hydrated, setWorkspace } = useIdentity();
  const current = identity?.workspace ?? null;

  if (!hydrated) {
    return (
      <div className="text-body-sm text-ink-500 dark:text-ink-400">Loading…</div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="text-body-sm text-ink-500 dark:text-ink-400">
        No workspaces configured.
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {workspaces.map((w) => {
        const active = current === w.slug;
        return (
          <button
            key={w.slug}
            type="button"
            onClick={() => setWorkspace(w.slug)}
            aria-pressed={active}
            className={[
              "w-full flex items-center gap-3 px-3 py-2 rounded-md border transition-colors text-left",
              active
                ? "border-accent/40 bg-accent/5 text-ink-900 dark:text-ink-50"
                : "border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-accent/30 hover:bg-ink-50/40 dark:hover:bg-ink-950/40 text-ink-700 dark:text-ink-200",
            ].join(" ")}
          >
            <span
              className={[
                "inline-flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0",
                active ? "bg-accent text-white" : "bg-ink-100 dark:bg-ink-800 text-transparent",
              ].join(" ")}
              aria-hidden
            >
              {active && <Check className="w-3.5 h-3.5" />}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-body-sm font-medium truncate">
                {w.name}
              </span>
              <span className="block text-label-xs font-mono text-ink-400 truncate">
                {w.slug}
              </span>
            </span>
            {w.isExample && (
              <span className="text-label-xs font-mono uppercase tracking-wider text-ink-400 flex-shrink-0">
                example
              </span>
            )}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => setWorkspace(null)}
        aria-pressed={current === null}
        className={[
          "w-full flex items-center gap-3 px-3 py-2 rounded-md border transition-colors text-left",
          current === null
            ? "border-accent/40 bg-accent/5 text-ink-900 dark:text-ink-50"
            : "border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-accent/30 hover:bg-ink-50/40 dark:hover:bg-ink-950/40 text-ink-700 dark:text-ink-200",
        ].join(" ")}
      >
        <span
          className={[
            "inline-flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0",
            current === null
              ? "bg-accent text-white"
              : "bg-ink-100 dark:bg-ink-800 text-transparent",
          ].join(" ")}
          aria-hidden
        >
          {current === null && <Check className="w-3.5 h-3.5" />}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-body-sm font-medium">
            Cross-engagement (all)
          </span>
          <span className="block text-label-xs font-mono text-ink-400">
            no workspace pinned
          </span>
        </span>
      </button>
    </div>
  );
}
