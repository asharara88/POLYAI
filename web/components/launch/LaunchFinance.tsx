import { TrendingUp, Wallet } from "lucide-react";
import type { Launch } from "@/lib/launches";

const CHANNEL_LABELS: Record<string, string> = {
  portals: "Portals",
  paid_search: "Paid search",
  meta: "Meta",
  linkedin: "LinkedIn",
  whatsapp_ops: "WhatsApp ops",
  pr: "PR",
  diaspora_portals: "Diaspora portals",
  email_crm: "Email / CRM",
  events: "Events",
  service_recovery: "Service recovery",
  referral_incentive: "Referral incentive",
  crm_ops: "CRM ops",
  wealth_channel_ops: "Wealth channel",
  broker_ops: "Broker ops",
};

function aedHuman(n: number): string {
  if (n >= 1_000_000_000) return `AED ${(n / 1_000_000_000).toFixed(1)}bn`;
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `AED ${(n / 1_000).toFixed(0)}K`;
  return `AED ${n}`;
}

function labelFor(key: string): string {
  return (
    CHANNEL_LABELS[key] ??
    key
      .split("_")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ")
  );
}

export default function LaunchFinance({ launch }: { launch: Launch }) {
  const budget = launch.budget as { total?: string | number; by_channel?: Record<string, number> } | null;
  if (!budget || !budget.by_channel) {
    return (
      <div className="rounded-card border border-dashed border-ink-200 dark:border-ink-800 p-8 text-center text-body-sm text-ink-500 dark:text-ink-400">
        No budget breakdown declared in the brief yet.
      </div>
    );
  }

  const byChannel = Object.entries(budget.by_channel)
    .filter(([, v]) => typeof v === "number" && v > 0)
    .map(([k, v]) => ({ key: k, label: labelFor(k), amount: v as number }))
    .sort((a, b) => b.amount - a.amount);
  const total = byChannel.reduce((s, r) => s + r.amount, 0);

  // Synthetic burn-to-date based on launch phase (illustrative)
  const burnRatio =
    launch.phase === "live"
      ? 0.6
      : launch.phase === "pre-launch"
        ? 0.35
        : launch.phase === "creative"
          ? 0.18
          : launch.phase === "close-out"
            ? 0.92
            : 0.05;
  const burned = total * burnRatio;
  const remaining = total - burned;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-title-sm font-semibold tracking-tight">
          Marketing finance
        </h2>
        <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5">
          Allocated budget by channel + illustrative burn-to-date.
        </p>
      </header>

      {/* Top-line KPIs */}
      <div className="grid sm:grid-cols-3 gap-3">
        <KpiCard
          label="Total allocated"
          value={typeof budget.total === "string" ? budget.total : aedHuman(total)}
          icon={<Wallet className="w-4 h-4" />}
        />
        <KpiCard
          label="Spent to date"
          value={aedHuman(burned)}
          subtext={`${(burnRatio * 100).toFixed(0)}% of allocation`}
          icon={<TrendingUp className="w-4 h-4" />}
          tone="info"
        />
        <KpiCard
          label="Remaining"
          value={aedHuman(remaining)}
          subtext={`${((1 - burnRatio) * 100).toFixed(0)}% of allocation`}
          tone={remaining < total * 0.1 ? "warning" : "neutral"}
        />
      </div>

      {/* Allocation bar */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <h3 className="text-body-sm font-semibold tracking-tight">
            Allocation by channel
          </h3>
          <span className="text-label-xs font-mono text-ink-400 tabular-nums">
            {byChannel.length} channels
          </span>
        </div>
        <div className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card divide-y divide-ink-100 dark:divide-ink-800 overflow-hidden">
          {byChannel.map((r) => {
            const pct = (r.amount / total) * 100;
            return (
              <div key={r.key} className="px-5 py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <span className="text-body-sm font-medium text-ink-800 dark:text-ink-100 truncate">
                      {r.label}
                    </span>
                    <span className="text-body-sm font-semibold tabular-nums text-ink-900 dark:text-ink-50 flex-shrink-0">
                      {aedHuman(r.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
                      <span
                        className="block h-full bg-accent rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-label-xs font-mono text-ink-400 tabular-nums min-w-[2.5rem] text-right">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-body-xs text-ink-500 dark:text-ink-400 italic leading-relaxed">
        Burn-to-date is illustrative and inferred from launch phase. Production
        wires this from <code className="font-mono text-label-xs px-1 rounded bg-ink-100 dark:bg-ink-800">marketing-budget.md</code>{" "}
        actuals via marketing-financial-manager.
      </p>
    </div>
  );
}

function KpiCard({
  label,
  value,
  subtext,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  subtext?: string;
  icon?: React.ReactNode;
  tone?: "neutral" | "info" | "warning";
}) {
  const valueClass =
    tone === "info"
      ? "text-info-700 dark:text-info-300"
      : tone === "warning"
        ? "text-warning-700 dark:text-warning-300"
        : "text-ink-900 dark:text-ink-50";
  return (
    <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-ink-50/30 dark:bg-ink-950/30 p-4">
      <div className="flex items-center gap-1.5 text-label-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {icon && <span className="text-ink-400" aria-hidden>{icon}</span>}
        <span>{label}</span>
      </div>
      <div className={["mt-2 text-title-sm font-semibold tracking-tight tabular-nums", valueClass].join(" ")}>
        {value}
      </div>
      {subtext && (
        <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-1 leading-snug">
          {subtext}
        </p>
      )}
    </div>
  );
}
