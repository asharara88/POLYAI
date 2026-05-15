import { Crown, ShieldCheck, Users } from "lucide-react";
import type { BrokerFirm, BrokerTier } from "@/lib/content";

const TIER_PRESENTATION: Record<
  number,
  { label: string; chip: string; bar: string; barMuted: string; Icon: typeof Crown }
> = {
  1: {
    label: "Tier 1",
    chip: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900/50",
    bar: "bg-purple-500",
    barMuted: "bg-purple-200 dark:bg-purple-900/40",
    Icon: Crown,
  },
  2: {
    label: "Tier 2",
    chip: "bg-info-100 text-info-700 dark:bg-info-950/40 dark:text-info-300 border-info-200 dark:border-info-900/50",
    bar: "bg-info-500",
    barMuted: "bg-info-200 dark:bg-info-900/40",
    Icon: ShieldCheck,
  },
  3: {
    label: "Tier 3",
    chip: "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300 border-ink-200 dark:border-ink-700",
    bar: "bg-ink-500",
    barMuted: "bg-ink-200 dark:bg-ink-700",
    Icon: Users,
  },
};

export default function TierMapHeader({
  tiers,
  firms,
}: {
  tiers: BrokerTier[];
  firms: BrokerFirm[];
}) {
  return (
    <section aria-labelledby="tier-map">
      <h2
        id="tier-map"
        className="text-label-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-3"
      >
        Tier map
      </h2>
      <div className="grid sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((tierNum) => {
          const tierMeta = tiers.find((t) => t.tier === tierNum);
          const firmsInTier = firms.filter((f) => f.tier === tierNum);
          const activeFirms = firmsInTier.filter((f) => f.active && !f.dormant);
          const dormantFirms = firmsInTier.filter((f) => f.dormant);
          const conversions = firmsInTier
            .map((f) => f.priorLaunchConversion)
            .filter((c): c is number => c != null && c > 0);
          const avgConv =
            conversions.length > 0
              ? conversions.reduce((a, b) => a + b, 0) / conversions.length
              : null;
          const maxConv = Math.max(0.08, ...conversions);
          const pres = TIER_PRESENTATION[tierNum];
          const Icon = pres.Icon;
          const sampleSize = firmsInTier.length;
          const totalForTier = tierMeta?.count ?? sampleSize;

          return (
            <article
              key={tierNum}
              className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card p-4 space-y-3"
            >
              <header className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-ink-500 dark:text-ink-400" aria-hidden />
                  <span
                    className={[
                      "inline-flex items-center px-2 py-0.5 rounded text-label-xs font-mono uppercase tracking-wider border",
                      pres.chip,
                    ].join(" ")}
                  >
                    {pres.label}
                  </span>
                </div>
                <span className="text-title-sm font-semibold tabular-nums">
                  {totalForTier}
                </span>
              </header>

              <p className="text-body-xs text-ink-500 dark:text-ink-400 leading-snug min-h-[2.5rem]">
                {tierMeta?.description ?? "—"}
              </p>

              <div className="grid grid-cols-2 gap-2 text-label-xs font-mono text-ink-500 dark:text-ink-400">
                <div>
                  <div className="text-ink-400">In registry</div>
                  <div className="text-ink-900 dark:text-ink-50 text-body-sm font-semibold tabular-nums">
                    {sampleSize} <span className="text-ink-400 font-normal">sampled</span>
                  </div>
                </div>
                <div>
                  <div className="text-ink-400">Active</div>
                  <div className="text-ink-900 dark:text-ink-50 text-body-sm font-semibold tabular-nums">
                    {activeFirms.length}
                    {dormantFirms.length > 0 && (
                      <span className="text-warning-600 dark:text-warning-400 font-normal">
                        {" · "}
                        {dormantFirms.length} dormant
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-ink-400">Avg prior-launch conversion</div>
                  <div className="text-ink-900 dark:text-ink-50 text-body-sm font-semibold tabular-nums">
                    {avgConv != null ? `${(avgConv * 100).toFixed(1)}%` : "—"}
                  </div>
                </div>
              </div>

              {conversions.length > 0 && (
                <div>
                  <div className="text-label-xs font-mono text-ink-400 mb-1">
                    Per-firm conversion
                  </div>
                  <div className="flex items-end gap-0.5 h-6">
                    {firmsInTier.map((f, i) => {
                      const conv = f.priorLaunchConversion ?? 0;
                      const pct = conv > 0 ? Math.max(8, (conv / maxConv) * 100) : 4;
                      return (
                        <span
                          key={`${f.firm}-${i}`}
                          title={`${f.firm}: ${(conv * 100).toFixed(1)}%`}
                          className={[
                            "flex-1 rounded-t",
                            f.dormant ? pres.barMuted : pres.bar,
                          ].join(" ")}
                          style={{ height: `${pct}%`, minHeight: "2px" }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
