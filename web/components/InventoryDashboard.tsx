import type { ParsedInventory } from "@/lib/content";

const fmtAed = (n: number | null) => (n == null ? "—" : `AED ${n.toLocaleString()}`);
const pct = (n: number, total: number) => (total > 0 ? Math.round((n / total) * 1000) / 10 : 0);

const STATUS_COLORS: Record<string, string> = {
  available: "bg-emerald-500",
  "on-hold": "bg-amber-500",
  reserved: "bg-blue-500",
  sold: "bg-ink-700",
  withdrawn: "bg-red-500",
};

export default function InventoryDashboard({ inventory }: { inventory: ParsedInventory }) {
  const t = inventory.totals;
  const total = t.total ?? 0;
  const buckets = [
    { key: "available", count: t.available ?? 0 },
    { key: "on-hold", count: t.onHold ?? 0 },
    { key: "reserved", count: t.reserved ?? 0 },
    { key: "sold", count: t.sold ?? 0 },
    { key: "withdrawn", count: t.withdrawn ?? 0 },
  ];

  const maxTypeCount = Math.max(1, ...inventory.unitTypes.map((u) => u.count));

  return (
    <div className="space-y-8">
      {/* Status overview */}
      <section>
        <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">
          Status — {total} units total
        </h3>

        <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4">
          {/* Stacked bar */}
          <div className="flex h-6 rounded overflow-hidden">
            {buckets.map((b) =>
              b.count > 0 ? (
                <div
                  key={b.key}
                  className={`${STATUS_COLORS[b.key]}`}
                  style={{ width: `${pct(b.count, total)}%` }}
                  title={`${b.key}: ${b.count} (${pct(b.count, total)}%)`}
                />
              ) : null,
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
            {buckets.map((b) => (
              <div key={b.key}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${STATUS_COLORS[b.key]}`} />
                  <div className="text-xs font-mono uppercase tracking-wider text-ink-400">
                    {b.key}
                  </div>
                </div>
                <div className="font-medium mt-1 text-base">{b.count}</div>
                <div className="text-xs text-ink-400">{pct(b.count, total)}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unit-type breakdown */}
      {inventory.unitTypes.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">
            By unit type
          </h3>
          <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4">
            <div className="space-y-3">
              {inventory.unitTypes.map((u) => (
                <div key={u.type} className="grid grid-cols-12 gap-3 items-center text-sm">
                  <div className="col-span-2 font-mono">{u.type}</div>
                  <div className="col-span-5">
                    <div className="h-4 rounded bg-ink-100 dark:bg-ink-800 overflow-hidden">
                      <div
                        className="h-full bg-accent"
                        style={{ width: `${(u.count / maxTypeCount) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="col-span-1 text-right font-medium">{u.count}</div>
                  <div className="col-span-2 text-right text-ink-500 text-xs font-mono">
                    {u.avgAedPerSqft ? `${u.avgAedPerSqft.toLocaleString()}/sqft` : "—"}
                  </div>
                  <div className="col-span-2 text-right text-ink-500 text-xs">{u.rangeAed}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sample units */}
      {inventory.sampleUnits.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">
            Sample units ({inventory.sampleUnits.length} of {total})
          </h3>
          <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left">
                <tr className="border-b border-ink-200/70 dark:border-ink-800">
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Unit</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Type</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">View</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">Sqft</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">Price</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Plan</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.sampleUnits.map((u) => (
                  <tr key={u.unitId} className="border-b border-ink-100 dark:border-ink-800/50 last:border-0">
                    <td className="px-3 py-2 font-mono text-xs">{u.unitId}</td>
                    <td className="px-3 py-2">{u.type}</td>
                    <td className="px-3 py-2 text-ink-500">{u.view}</td>
                    <td className="px-3 py-2 text-right font-mono">{u.areaSqft ?? "—"}</td>
                    <td className="px-3 py-2 text-right font-mono">{fmtAed(u.priceAed)}</td>
                    <td className="px-3 py-2 font-mono text-xs text-ink-500">{u.paymentPlan}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1.5 align-middle ${
                          STATUS_COLORS[u.status] ?? "bg-ink-300"
                        }`}
                      />
                      <span className="text-xs">{u.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="text-xs text-ink-400">
        Source: <code className="font-mono">clients/&lt;slug&gt;/inventory/current.md</code> · Owned by the
        <code className="font-mono mx-1">inventory-manager</code> agent · Refresh: weekly during launch, daily during sustain.
      </div>
    </div>
  );
}
