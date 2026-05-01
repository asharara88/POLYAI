import type { ParsedVvip } from "@/lib/content";

const SEGMENT_LABEL: Record<string, string> = {
  "ruling-families": "Ruling families / royal households",
  "government-officials": "Government officials",
  "foreign-dignitaries": "Foreign dignitaries",
  "sovereign-institutions": "Sovereign / quasi-sovereign institutions",
};

const STATUS_COLOR: Record<string, string> = {
  active: "bg-emerald-500",
  dormant: "bg-amber-500",
  cultivating: "bg-blue-500",
  unknown: "bg-ink-300",
};

export default function VvipChannelRegistry({ channel }: { channel: ParsedVvip }) {
  const grouped = (segment: string) => channel.entities.filter((e) => e.segment === segment);

  return (
    <div className="space-y-8">
      {/* Discretion notice */}
      <div className="rounded-md border border-amber-300/40 bg-amber-50/40 dark:bg-amber-950/20 px-4 py-3 text-sm">
        <strong>Discretion stance:</strong> entries are not for circulation outside marketing
        leadership. No public reference, no press, no social. Names below are anonymized in this
        worked example; real-client registries replace them with actual names but maintain the same
        treatment.
      </div>

      {/* Engagement summary */}
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
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">
                    Active
                  </th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">
                    Dormant
                  </th>
                  <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase text-right">
                    Cultivating
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
                      {s.cultivating ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Entities by segment */}
      {(["ruling-families", "government-officials", "foreign-dignitaries", "sovereign-institutions"] as const).map(
        (segment) => {
          const items = grouped(segment);
          if (items.length === 0) return null;
          return (
            <section key={segment}>
              <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">
                {SEGMENT_LABEL[segment]} ({items.length})
              </h3>
              <div className="space-y-2">
                {items.map((e) => (
                  <div
                    key={e.entityId}
                    className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs font-mono text-ink-400">{e.entityId}</div>
                        <div className="font-medium mt-0.5">{e.primaryPrincipalAnonymized}</div>
                        <div className="text-sm text-ink-500 dark:text-ink-400 mt-1">
                          {e.household ?? e.role ?? e.institution}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-1.5 align-middle ${
                              STATUS_COLOR[e.status] ?? STATUS_COLOR.unknown
                            }`}
                          />
                          {e.status}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                      {e.preferredFormOfAddress && (
                        <KV label="form of address" value={e.preferredFormOfAddress} />
                      )}
                      {e.primaryGatekeeper && <KV label="gatekeeper" value={e.primaryGatekeeper} />}
                      {e.pepScreeningStatus && (
                        <KV label="PEP / sanctions" value={e.pepScreeningStatus} />
                      )}
                    </div>
                    {e.notes && (
                      <div className="mt-3 text-xs text-ink-500 dark:text-ink-400 italic">
                        {e.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        },
      )}

      <div className="text-xs text-ink-400">
        Source: <code className="font-mono">clients/&lt;slug&gt;/vvip-channel/registry.md</code> · Owned by the
        <code className="font-mono mx-1">vvip-channel-enablement</code> agent · Sensitive — discretion stance applies.
      </div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="font-mono text-ink-400 uppercase text-[10px] tracking-wider w-32 shrink-0">
        {label}
      </span>
      <span className="text-ink-700 dark:text-ink-300">{value}</span>
    </div>
  );
}
