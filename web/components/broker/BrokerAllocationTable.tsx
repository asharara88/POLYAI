import Link from "next/link";
import { UsersRound } from "lucide-react";
import {
  getBrokerAllocations,
  phaseColumns,
  humanizePhaseKey,
} from "@/lib/broker-allocations";
import { listBrokerProfiles, slugify } from "@/lib/content";

const TIER_CHIP: Record<number, string> = {
  1: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900/50",
  2: "bg-info-100 text-info-700 dark:bg-info-950/40 dark:text-info-300 border-info-200 dark:border-info-900/50",
  3: "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300 border-ink-200 dark:border-ink-700",
};

export default function BrokerAllocationTable({
  clientSlug,
  launchId,
}: {
  clientSlug: string;
  launchId: string;
}) {
  const allocations = getBrokerAllocations(clientSlug, launchId);
  if (allocations.length === 0) return null;

  const cols = phaseColumns(allocations);
  const profiles = new Set(listBrokerProfiles(clientSlug));
  const totals = cols.map((phase) =>
    allocations.reduce(
      (acc, a) => acc + (a.slots.find((s) => s.phase === phase)?.count ?? 0),
      0,
    ),
  );
  const grandTotal = totals.reduce((a, b) => a + b, 0);

  return (
    <section aria-labelledby="broker-firms-allocated">
      <div className="flex items-baseline justify-between mb-3">
        <h3
          id="broker-firms-allocated"
          className="text-body-sm font-semibold tracking-tight flex items-center gap-2"
        >
          <UsersRound
            className="w-4 h-4 text-info-600 dark:text-info-400"
            aria-hidden
          />
          Broker firms allocated
        </h3>
        <span className="text-label-xs font-mono text-ink-400 tabular-nums">
          {allocations.length} firms · {grandTotal} slots total
        </span>
      </div>

      <div className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="bg-ink-50/60 dark:bg-ink-950/40 border-b border-ink-200/70 dark:border-ink-800">
                <th className="text-left px-3 py-2 text-label-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  Firm
                </th>
                <th className="text-left px-2 py-2 text-label-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400 w-14">
                  Tier
                </th>
                {cols.map((phase) => (
                  <th
                    key={phase}
                    className="text-right px-2 py-2 text-label-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400"
                  >
                    {humanizePhaseKey(phase)}
                  </th>
                ))}
                <th className="text-right px-3 py-2 text-label-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((a) => {
                const firmSlug = slugify(a.firmName);
                const hasProfile = profiles.has(firmSlug);
                return (
                  <tr
                    key={a.firmName}
                    className="border-b border-ink-100 dark:border-ink-800/60 last:border-b-0"
                  >
                    <td className="px-3 py-2 text-ink-900 dark:text-ink-50">
                      {hasProfile ? (
                        <Link
                          href={`/clients/${clientSlug}/brokers/${firmSlug}`}
                          className="font-medium hover:text-accent transition-colors"
                        >
                          {a.firmName}
                        </Link>
                      ) : (
                        <span className="font-medium">{a.firmName}</span>
                      )}
                      {a.notes && (
                        <div className="text-body-xs text-ink-500 dark:text-ink-400 leading-snug mt-0.5">
                          {a.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2 align-top">
                      <span
                        className={[
                          "inline-flex items-center px-1.5 py-0.5 rounded text-label-xs font-mono uppercase tracking-wider border",
                          TIER_CHIP[a.tier] ?? TIER_CHIP[3],
                        ].join(" ")}
                      >
                        T{a.tier}
                      </span>
                    </td>
                    {cols.map((phase) => {
                      const count = a.slots.find((s) => s.phase === phase)?.count ?? 0;
                      return (
                        <td
                          key={phase}
                          className={[
                            "px-2 py-2 text-right tabular-nums align-top",
                            count > 0
                              ? "text-ink-900 dark:text-ink-50 font-medium"
                              : "text-ink-300 dark:text-ink-600",
                          ].join(" ")}
                        >
                          {count > 0 ? count : "—"}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-right tabular-nums font-semibold text-ink-900 dark:text-ink-50 align-top">
                      {a.totalSlots}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-ink-50/60 dark:bg-ink-950/40 border-t border-ink-200/70 dark:border-ink-800">
                <td
                  colSpan={2}
                  className="px-3 py-2 text-label-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400"
                >
                  Phase totals
                </td>
                {totals.map((t, i) => (
                  <td
                    key={i}
                    className="px-2 py-2 text-right tabular-nums font-semibold text-ink-900 dark:text-ink-50"
                  >
                    {t}
                  </td>
                ))}
                <td className="px-3 py-2 text-right tabular-nums font-bold text-ink-900 dark:text-ink-50">
                  {grandTotal}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}
