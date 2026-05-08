"use client";

import { ReactNode, useMemo } from "react";
import { Filter, X } from "lucide-react";
import { useSavedState } from "@/lib/use-saved-state";
import { urgencyKey, classKeyToTone, toneBadge } from "@/lib/design-tokens";

type Filters = {
  urgency: "all" | "high" | "medium" | "low";
  classFilter: string; // "all" or specific class
  client: string; // "all" or slug
};

const URGENCY_LABEL: Record<Filters["urgency"], string> = {
  all: "Any urgency",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export default function ApprovalsFilters({
  children,
  available,
}: {
  children: (
    filtered: { client: string; urgency: string; className: string }[],
    state: { count: number; total: number; reset: () => void; isFiltered: boolean },
  ) => ReactNode;
  available: { client: string; urgency: string; className: string }[];
}) {
  const [filters, setFilters] = useSavedState<Filters>("flow-approvals-filters", {
    urgency: "all",
    classFilter: "all",
    client: "all",
  });

  const classOptions = useMemo(() => {
    const set = new Set<string>();
    for (const a of available) if (a.className) set.add(a.className);
    return Array.from(set).sort();
  }, [available]);

  const clientOptions = useMemo(() => {
    const set = new Set<string>();
    for (const a of available) if (a.client) set.add(a.client);
    return Array.from(set).sort();
  }, [available]);

  const filtered = available.filter((a) => {
    if (filters.urgency !== "all" && urgencyKey(a.urgency) !== filters.urgency) return false;
    if (filters.classFilter !== "all" && a.className !== filters.classFilter) return false;
    if (filters.client !== "all" && a.client !== filters.client) return false;
    return true;
  });

  const isFiltered =
    filters.urgency !== "all" || filters.classFilter !== "all" || filters.client !== "all";

  const reset = () =>
    setFilters({ urgency: "all", classFilter: "all", client: "all" });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-label-xs font-mono uppercase tracking-wider text-ink-400">
          <Filter className="w-3.5 h-3.5" aria-hidden />
          filters
        </span>

        {/* Urgency */}
        <div className="inline-flex rounded-md border border-ink-200/70 dark:border-ink-800 overflow-hidden">
          {(Object.keys(URGENCY_LABEL) as Filters["urgency"][]).map((u) => {
            const active = filters.urgency === u;
            return (
              <button
                key={u}
                type="button"
                onClick={() => setFilters({ ...filters, urgency: u })}
                aria-pressed={active}
                className={[
                  "px-2.5 py-1 text-label-xs font-mono uppercase tracking-wider transition-colors",
                  active
                    ? "bg-accent text-white"
                    : "text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800",
                ].join(" ")}
              >
                {URGENCY_LABEL[u]}
              </button>
            );
          })}
        </div>

        {/* Class */}
        {classOptions.length > 1 && (
          <select
            value={filters.classFilter}
            onChange={(e) => setFilters({ ...filters, classFilter: e.target.value })}
            aria-label="Class filter"
            className="bg-white dark:bg-ink-900 border border-ink-200/70 dark:border-ink-800 rounded-md px-2 py-1 text-label-xs font-mono uppercase tracking-wider text-ink-700 dark:text-ink-200"
          >
            <option value="all">Any class</option>
            {classOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        {/* Client */}
        {clientOptions.length > 1 && (
          <select
            value={filters.client}
            onChange={(e) => setFilters({ ...filters, client: e.target.value })}
            aria-label="Client filter"
            className="bg-white dark:bg-ink-900 border border-ink-200/70 dark:border-ink-800 rounded-md px-2 py-1 text-label-xs font-mono uppercase tracking-wider text-ink-700 dark:text-ink-200"
          >
            <option value="all">Any client</option>
            {clientOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        {isFiltered && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 text-label-xs font-mono uppercase tracking-wider text-ink-500 hover:text-accent transition-colors"
          >
            <X className="w-3 h-3" aria-hidden />
            clear
          </button>
        )}

        <span className="ml-auto text-label-xs font-mono text-ink-400">
          {filtered.length} of {available.length}
        </span>
      </div>

      {children(filtered, {
        count: filtered.length,
        total: available.length,
        reset,
        isFiltered,
      })}
    </div>
  );
}
