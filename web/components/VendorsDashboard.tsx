import Link from "next/link";
import type { ParsedVendors } from "@/lib/content";

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const STATUS_COLOR: Record<string, string> = {
  active: "bg-emerald-500",
  dormant: "bg-amber-500",
  "rfq-in-progress": "bg-blue-500",
  "off-boarded": "bg-ink-500",
  blocked: "bg-red-500",
};

const fmtPct = (n: number | null | undefined) =>
  n == null ? "—" : `${Math.round(n * 100)}%`;
const fmtAed = (n: number | null | undefined) =>
  n == null ? "—" : `AED ${n.toLocaleString()}`;

export default function VendorsDashboard({
  vendors,
  clientSlug,
  vendorsWithProfile,
}: {
  vendors: ParsedVendors;
  clientSlug: string;
  vendorsWithProfile: string[];
}) {
  // Group by category
  const byCategory: Record<string, typeof vendors.vendors> = {};
  for (const v of vendors.vendors) {
    if (!byCategory[v.category]) byCategory[v.category] = [];
    byCategory[v.category].push(v);
  }

  const totalActive = vendors.vendors.filter((v) => v.status === "active").length;
  const totalDormant = vendors.vendors.filter((v) => v.status === "dormant").length;
  const totalDisputes = vendors.vendors.reduce((acc, v) => acc + (v.disputeCount ?? 0), 0);
  const ytdSpend = vendors.vendors.reduce(
    (acc, v) => acc + (v.totalSpendAedYtd ?? 0),
    0,
  );

  return (
    <div className="space-y-8">
      {/* Summary */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryCell label="active vendors" value={totalActive} />
        <SummaryCell label="dormant" value={totalDormant} />
        <SummaryCell label="open disputes" value={totalDisputes} />
        <SummaryCell label="YTD spend" value={fmtAed(ytdSpend)} small />
      </section>

      {/* By category */}
      {Object.entries(byCategory).map(([category, list]) => (
        <section key={category}>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">
            {category} ({list.length})
          </h3>
          <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left">
                <tr className="border-b border-ink-200/70 dark:border-ink-800">
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Vendor</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Status</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">
                    On-spec
                  </th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">
                    On-time
                  </th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">
                    Disputes
                  </th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">
                    YTD spend
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((v) => {
                  const vSlug = slugify(v.name);
                  const hasProfile = vendorsWithProfile.includes(vSlug);
                  return (
                  <tr
                    key={v.name}
                    className={`border-b border-ink-100 dark:border-ink-800/50 last:border-0 ${
                      hasProfile ? "hover:bg-ink-50 dark:hover:bg-ink-800/40 cursor-pointer" : ""
                    }`}
                  >
                    <td className="px-3 py-2 font-medium">
                      {hasProfile ? (
                        <Link
                          href={`/clients/${clientSlug}/vendors/${vSlug}`}
                          className="text-accent hover:underline"
                        >
                          {v.name}
                        </Link>
                      ) : (
                        v.name
                      )}
                      {v.notes && (
                        <div className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
                          {v.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1.5 align-middle ${
                          STATUS_COLOR[v.status] ?? "bg-ink-300"
                        }`}
                      />
                      <span className="text-xs">{v.status}</span>
                      {v.tier && (
                        <span className="ml-2 text-[10px] font-mono px-1 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600">
                          {v.tier}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs">
                      {fmtPct(v.onSpecRate)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs">
                      {fmtPct(v.onTimeRate)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs">
                      {v.disputeCount ?? 0}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs">
                      {fmtAed(v.totalSpendAedYtd)}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <div className="text-xs text-ink-400">
        Source: <code className="font-mono">clients/&lt;slug&gt;/vendors/registry.md</code> · Owned by the
        <code className="font-mono mx-1">marketing-procurement</code> agent.
      </div>
    </div>
  );
}

function SummaryCell({
  label,
  value,
  small,
}: {
  label: string;
  value: number | string;
  small?: boolean;
}) {
  return (
    <div className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4">
      <div className="text-xs uppercase tracking-wider text-ink-400 font-mono">{label}</div>
      <div className={`mt-1 font-semibold ${small ? "text-base" : "text-2xl"}`}>{value}</div>
    </div>
  );
}
