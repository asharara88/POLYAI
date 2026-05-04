import type { ParsedReciprocity } from "@/lib/content";

const CHANNEL_BADGE: Record<string, string> = {
  vvip: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300",
  wealth: "bg-accent/15 text-accent",
  other: "bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300",
};

const STATUS_COLOR: Record<string, string> = {
  complete: "bg-emerald-500",
  "pending-acknowledge": "bg-amber-500",
  "pending-reciprocate": "bg-red-500",
  "not-applicable": "bg-ink-400",
};

const debtTone = (net: number) =>
  net <= -3
    ? "border-red-400/50 bg-red-50/40 dark:bg-red-950/20"
    : net < 0
      ? "border-amber-400/50 bg-amber-50/30 dark:bg-amber-950/15"
      : net > 5
        ? "border-blue-400/40 bg-blue-50/20 dark:bg-blue-950/10"
        : "border-ink-200/70 dark:border-ink-800";

const debtLabel = (net: number) =>
  net <= -3
    ? "outbound action urgently owed"
    : net === -2
      ? "outbound action approaching threshold"
      : net === -1
        ? "minor debt — track"
        : net === 0
          ? "balanced"
          : net <= 5
            ? "healthy outbound posture"
            : "over-investing — diagnose";

export default function ReciprocityLedger({ ledger }: { ledger: ParsedReciprocity }) {
  if (ledger.entries.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-ink-300/70 dark:border-ink-700 px-4 py-6 text-sm text-ink-500">
        No reciprocity entries yet.
      </div>
    );
  }

  const totalEntries = ledger.entries.length;
  const inbound = ledger.entries.filter((e) => e.direction === "inbound").length;
  const outbound = ledger.entries.filter((e) => e.direction === "outbound").length;
  const pendingAck = ledger.entries.filter((e) => e.status === "pending-acknowledge").length;
  const pendingRecip = ledger.entries.filter((e) => e.status === "pending-reciprocate").length;

  return (
    <div className="space-y-8">
      {/* Topline */}
      <section className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <SummaryCell label="entries" value={totalEntries} />
        <SummaryCell label="inbound" value={inbound} />
        <SummaryCell label="outbound" value={outbound} />
        <SummaryCell label="pending ack" value={pendingAck} highlight={pendingAck > 0} />
        <SummaryCell label="owed reciprocity" value={pendingRecip} highlight={pendingRecip > 0} />
      </section>

      {/* Per-counterparty debt summary */}
      <section>
        <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">
          Counterparty debt summary ({ledger.summaries.length})
        </h3>
        <div className="space-y-2">
          {ledger.summaries.map((s) => (
            <div
              key={s.counterpartyId || s.counterpartyName}
              className={`rounded-md border ${debtTone(s.net)} p-4`}
            >
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="text-xs font-mono text-ink-400">{s.counterpartyId}</div>
                  <div className="font-medium mt-0.5">{s.counterpartyName}</div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      CHANNEL_BADGE[s.channel] ?? CHANNEL_BADGE.other
                    }`}
                  >
                    {s.channel}
                  </span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
                <Stat label="inbound" value={s.inbound} />
                <Stat label="outbound" value={s.outbound} />
                <Stat
                  label="net"
                  value={`${s.net > 0 ? "+" : ""}${s.net}`}
                  emphasis={s.net <= -3 ? "danger" : s.net < 0 ? "warn" : undefined}
                />
                <Stat label="pending ack" value={s.pendingAcknowledge} />
                <Stat label="last touch" value={s.lastTouchDate || "—"} small />
              </div>
              <div className="text-xs text-ink-500 dark:text-ink-400 mt-2 italic">
                {debtLabel(s.net)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full entry log */}
      <section>
        <h3 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">
          Entry log ({ledger.entries.length})
        </h3>
        <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left">
              <tr className="border-b border-ink-200/70 dark:border-ink-800">
                <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Date</th>
                <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Counterparty</th>
                <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Channel</th>
                <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Dir</th>
                <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Type</th>
                <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Description</th>
                <th className="px-3 py-2 font-mono text-xs text-ink-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {ledger.entries
                .slice()
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((e) => (
                  <tr
                    key={e.entryId}
                    className="border-b border-ink-100 dark:border-ink-800/50 last:border-0"
                  >
                    <td className="px-3 py-2 font-mono text-xs text-ink-500">{e.date}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium text-xs">{e.counterpartyName}</div>
                      <div className="font-mono text-[10px] text-ink-400">{e.counterpartyId}</div>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          CHANNEL_BADGE[e.channel] ?? CHANNEL_BADGE.other
                        }`}
                      >
                        {e.channel}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {e.direction === "inbound" ? (
                        <span className="text-amber-600 dark:text-amber-400 font-mono text-xs">
                          ← in
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                          out →
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{e.type}</td>
                    <td className="px-3 py-2 text-xs max-w-md">
                      {e.description}
                      {e.notes && (
                        <div className="text-[11px] text-ink-500 italic mt-0.5">{e.notes}</div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1.5 align-middle ${
                          STATUS_COLOR[e.status] ?? "bg-ink-300"
                        }`}
                      />
                      <span className="text-xs">{e.status}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="text-xs text-ink-400">
        Source: <code className="font-mono">clients/&lt;slug&gt;/reciprocity-ledger.md</code> · Owned jointly by{" "}
        <code className="font-mono">wealth-channel-enablement</code> and{" "}
        <code className="font-mono">vvip-channel-enablement</code> · Confidential.
      </div>
    </div>
  );
}

function SummaryCell({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight
          ? "border-amber-300/50 bg-amber-50/30 dark:bg-amber-950/15"
          : "border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900"
      }`}
    >
      <div className="text-xs uppercase tracking-wider text-ink-400 font-mono">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Stat({
  label,
  value,
  emphasis,
  small,
}: {
  label: string;
  value: number | string;
  emphasis?: "warn" | "danger";
  small?: boolean;
}) {
  const cls =
    emphasis === "danger"
      ? "text-red-600 dark:text-red-400 font-semibold"
      : emphasis === "warn"
        ? "text-amber-600 dark:text-amber-400 font-semibold"
        : "";
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-400">{label}</div>
      <div className={`mt-0.5 ${small ? "text-xs font-mono" : "font-medium"} ${cls}`}>{value}</div>
    </div>
  );
}
