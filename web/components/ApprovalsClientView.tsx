"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Filter, X } from "lucide-react";
import { useSavedState } from "@/lib/use-saved-state";
import { urgencyKey } from "@/lib/design-tokens";
import DecisionAsksQueue from "@/components/DecisionAsksQueue";
import type { ParsedDecisionAsks } from "@/lib/content";

type Group = {
  client: { slug: string; displayName?: string };
  asks: ParsedDecisionAsks;
};

type Filters = {
  urgency: "all" | "high" | "medium" | "low";
  classFilter: string;
  client: string;
};

const URGENCY_LABEL: Record<Filters["urgency"], string> = {
  all: "Any urgency",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export default function ApprovalsClientView({ groups }: { groups: Group[] }) {
  const [filters, setFilters] = useSavedState<Filters>("flow-approvals-filters", {
    urgency: "all",
    classFilter: "all",
    client: "all",
  });

  const allAsks = groups.flatMap((g) =>
    g.asks.pending.map((a) => ({ ...a, _client: g.client.slug })),
  );

  const classOptions = useMemo(() => {
    const set = new Set<string>();
    for (const a of allAsks) if (a.className) set.add(a.className);
    return Array.from(set).sort();
  }, [allAsks]);

  const clientOptions = useMemo(
    () => groups.map((g) => ({ slug: g.client.slug, label: g.client.displayName ?? g.client.slug })),
    [groups],
  );

  const passes = (ask: { urgency: string; className: string }, clientSlug: string) => {
    if (filters.urgency !== "all" && urgencyKey(ask.urgency) !== filters.urgency) return false;
    if (filters.classFilter !== "all" && ask.className !== filters.classFilter) return false;
    if (filters.client !== "all" && clientSlug !== filters.client) return false;
    return true;
  };

  const filteredGroups = groups
    .map((g) => ({
      client: g.client,
      asks: {
        ...g.asks,
        pending: g.asks.pending.filter((a) => passes(a, g.client.slug)),
      },
    }))
    .filter((g) => g.asks.pending.length > 0);

  const totalAsks = allAsks.length;
  const visibleAsks = filteredGroups.reduce((acc, g) => acc + g.asks.pending.length, 0);
  const isFiltered =
    filters.urgency !== "all" || filters.classFilter !== "all" || filters.client !== "all";
  const reset = () => setFilters({ urgency: "all", classFilter: "all", client: "all" });

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap rounded-card border border-ink-200/70 dark:border-ink-800 bg-white/40 dark:bg-ink-950/40 px-3 py-2">
        <span className="inline-flex items-center gap-1.5 text-label-xs font-mono uppercase tracking-wider text-ink-400">
          <Filter className="w-3.5 h-3.5" aria-hidden />
          filters
        </span>

        <div
          role="group"
          aria-label="Urgency"
          className="inline-flex rounded-md border border-ink-200/70 dark:border-ink-800 overflow-hidden"
        >
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

        {clientOptions.length > 1 && (
          <select
            value={filters.client}
            onChange={(e) => setFilters({ ...filters, client: e.target.value })}
            aria-label="Client filter"
            className="bg-white dark:bg-ink-900 border border-ink-200/70 dark:border-ink-800 rounded-md px-2 py-1 text-label-xs font-mono uppercase tracking-wider text-ink-700 dark:text-ink-200"
          >
            <option value="all">Any client</option>
            {clientOptions.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
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
          {visibleAsks} of {totalAsks}
        </span>
      </div>

      {/* Filtered queue groups */}
      {filteredGroups.length === 0 ? (
        <div className="rounded-card border border-dashed border-ink-300/70 dark:border-ink-700 px-4 py-12 text-center text-body-sm text-ink-500">
          {isFiltered
            ? "No decision-asks match the current filters."
            : "No pending CCO decision-asks across active clients."}
          {isFiltered && (
            <button
              type="button"
              onClick={reset}
              className="block mx-auto mt-3 text-label-xs font-mono uppercase tracking-wider text-accent hover:underline"
            >
              clear filters
            </button>
          )}
        </div>
      ) : (
        filteredGroups.map((g) => (
          <div key={g.client.slug} className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-title-sm font-semibold tracking-tight">
                {g.client.displayName ?? g.client.slug}
              </h2>
              <Link
                href={`/cco?client=${g.client.slug}`}
                className="text-label-xs font-mono uppercase tracking-wider text-ink-400 hover:text-accent transition-colors"
              >
                open in CCO Daily ›
              </Link>
            </div>
            <DecisionAsksQueue asks={g.asks} client={g.client.slug} />
          </div>
        ))
      )}
    </div>
  );
}
