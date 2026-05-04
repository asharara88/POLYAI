import Link from "next/link";
import type { ParsedBrokers } from "@/lib/content";

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function BrokerRegistry({
  brokers,
  clientSlug,
  brokersWithProfile,
}: {
  brokers: ParsedBrokers;
  clientSlug: string;
  brokersWithProfile: string[];
}) {
  const total = brokers.tiers.reduce((acc, t) => acc + (t.count ?? 0), 0);

  return (
    <div className="space-y-8">
      {/* Tier overview */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400">
            Network — {total} firms across {brokers.tiers.length} tiers
          </h3>
          {brokers.speedToLeadSlaMinutes && (
            <span className="text-xs font-mono text-ink-500">
              SLA · speed-to-lead {brokers.speedToLeadSlaMinutes}m
            </span>
          )}
        </div>

        <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 space-y-3">
          {brokers.tiers.map((t) => (
            <div key={t.tier} className="grid grid-cols-12 gap-3 items-start">
              <div className="col-span-2">
                <div className="text-xs font-mono uppercase tracking-wider text-ink-400">
                  Tier {t.tier}
                </div>
                <div className="text-2xl font-semibold mt-0.5">{t.count ?? "—"}</div>
              </div>
              <div className="col-span-10">
                <div className="h-2 rounded bg-ink-100 dark:bg-ink-800 overflow-hidden">
                  <div
                    className={
                      t.tier === 1
                        ? "h-full bg-accent"
                        : t.tier === 2
                          ? "h-full bg-accent/60"
                          : "h-full bg-accent/30"
                    }
                    style={{ width: total ? `${((t.count ?? 0) / total) * 100}%` : "0%" }}
                  />
                </div>
                <div className="text-sm text-ink-500 dark:text-ink-400 mt-2">{t.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sample firms */}
      {brokers.sampleFirms.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">
            Tier-1 sample ({brokers.sampleFirms.length})
          </h3>
          <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left">
                <tr className="border-b border-ink-200/70 dark:border-ink-800">
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Firm</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Tier</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Specialization</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Languages</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">
                    Prior conv.
                  </th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Active</th>
                </tr>
              </thead>
              <tbody>
                {brokers.sampleFirms.map((f) => {
                  const fSlug = slugify(f.firm);
                  const hasProfile = brokersWithProfile.includes(fSlug);
                  return (
                  <tr
                    key={f.firm}
                    className={`border-b border-ink-100 dark:border-ink-800/50 last:border-0 ${
                      hasProfile ? "hover:bg-ink-50 dark:hover:bg-ink-800/40" : ""
                    }`}
                  >
                    <td className="px-3 py-2 font-medium">
                      {hasProfile ? (
                        <Link
                          href={`/clients/${clientSlug}/brokers/${fSlug}`}
                          className="text-accent hover:underline"
                        >
                          {f.firm}
                        </Link>
                      ) : (
                        f.firm
                      )}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{f.tier}</td>
                    <td className="px-3 py-2 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {f.specializations.map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{f.languages.join(" · ")}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs">
                      {f.priorLaunchConversion != null
                        ? `${(f.priorLaunchConversion * 100).toFixed(1)}%`
                        : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          f.active ? "bg-emerald-500" : "bg-ink-300"
                        }`}
                      />
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="text-xs text-ink-400">
        Source: <code className="font-mono">clients/&lt;slug&gt;/brokers/registry.md</code> · Owned by the
        <code className="font-mono mx-1">broker-enablement</code> agent.
      </div>
    </div>
  );
}
