import type { ParsedWealthChannel } from "@/lib/content";

const SEGMENT_LABEL: Record<string, string> = {
  "private-banks": "Private banks",
  "family-offices": "Family offices",
  introducers: "Introducers",
};

const STATUS_COLOR: Record<string, string> = {
  active: "bg-emerald-500",
  dormant: "bg-amber-500",
  "target-new": "bg-blue-500",
  unknown: "bg-ink-300",
};

export default function WealthChannelRegistry({ channel }: { channel: ParsedWealthChannel }) {
  const grouped = (segment: string) => channel.counterparties.filter((c) => c.segment === segment);

  return (
    <div className="space-y-8">
      {/* Health summary */}
      {channel.summaries.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">
            Engagement health
          </h3>
          <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left">
                <tr className="border-b border-ink-200/70 dark:border-ink-800">
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Sub-channel</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">Active</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">Dormant</th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">
                    New target
                  </th>
                </tr>
              </thead>
              <tbody>
                {channel.summaries.map((s) => (
                  <tr
                    key={s.segment}
                    className="border-b border-ink-100 dark:border-ink-800/50 last:border-0"
                  >
                    <td className="px-3 py-2 font-medium">{SEGMENT_LABEL[s.segment] ?? s.segment}</td>
                    <td className="px-3 py-2 text-right font-mono">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 align-middle" />
                      {s.active ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-right font-mono">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2 align-middle" />
                      {s.dormant ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-right font-mono">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2 align-middle" />
                      {s.newTarget ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* By segment */}
      {(["private-banks", "family-offices", "introducers"] as const).map((segment) => {
        const items = grouped(segment);
        if (items.length === 0) return null;
        return (
          <section key={segment}>
            <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">
              {SEGMENT_LABEL[segment]} ({items.length})
            </h3>
            <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left">
                  <tr className="border-b border-ink-200/70 dark:border-ink-800">
                    <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Name</th>
                    <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Status</th>
                    {segment !== "private-banks" && (
                      <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Type</th>
                    )}
                    <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Geo</th>
                    {segment === "private-banks" && (
                      <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Fiduciary</th>
                    )}
                    {segment === "introducers" && (
                      <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">
                        Commission
                      </th>
                    )}
                    <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">
                      Intros
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((c, i) => (
                    <tr
                      key={`${c.name}-${i}`}
                      className="border-b border-ink-100 dark:border-ink-800/50 last:border-0"
                    >
                      <td className="px-3 py-2 font-medium">
                        {c.name}
                        {c.notes && (
                          <div className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
                            {c.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-1.5 align-middle ${
                            STATUS_COLOR[c.status] ?? STATUS_COLOR.unknown
                          }`}
                        />
                        <span className="text-xs">{c.status}</span>
                      </td>
                      {segment !== "private-banks" && (
                        <td className="px-3 py-2 text-xs font-mono text-ink-500">
                          {c.type ?? "—"}
                        </td>
                      )}
                      <td className="px-3 py-2 text-xs font-mono text-ink-500">
                        {c.geography?.join(" · ") ?? "—"}
                      </td>
                      {segment === "private-banks" && (
                        <td className="px-3 py-2 text-xs">
                          {c.fiduciaryRestricted ? "yes" : "no"}
                        </td>
                      )}
                      {segment === "introducers" && (
                        <td className="px-3 py-2 text-xs text-ink-500 max-w-xs">
                          {c.commissionStructure ?? "—"}
                        </td>
                      )}
                      <td className="px-3 py-2 text-right font-mono text-xs">
                        {c.priorIntroductions ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      <div className="text-xs text-ink-400">
        Source: <code className="font-mono">clients/&lt;slug&gt;/wealth-channels/registry.md</code> · Owned by the
        <code className="font-mono mx-1">wealth-channel-enablement</code> agent · Confidential — named-recipient counterparties.
      </div>
    </div>
  );
}
