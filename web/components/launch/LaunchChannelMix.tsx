import type { Launch, LaunchChannel } from "@/lib/launches";
import Sparkline from "@/components/viz/Sparkline";

const CHANNEL_COLORS: { match: RegExp; bg: string }[] = [
  { match: /portal|finder|bayut|magicbrick|rightmove/i, bg: "bg-info-500" },
  { match: /paid search|google ads|search/i, bg: "bg-accent" },
  { match: /meta|instagram|facebook/i, bg: "bg-purple-500" },
  { match: /linkedin/i, bg: "bg-info-600" },
  { match: /whatsapp|broker|wealth/i, bg: "bg-success-500" },
  { match: /pr|press|earned|content/i, bg: "bg-warning-500" },
  { match: /diaspora/i, bg: "bg-pink-500" },
  { match: /email|crm|owner/i, bg: "bg-ink-500" },
  { match: /event/i, bg: "bg-warning-600" },
  { match: /service|recovery/i, bg: "bg-info-400" },
  { match: /referral/i, bg: "bg-success-600" },
];

function colorFor(channel: string): string {
  const m = CHANNEL_COLORS.find((c) => c.match.test(channel));
  return m ? m.bg : "bg-ink-400";
}

function syntheticSeries(weight: number): number[] {
  // 8-point trend, amplitude scaled to channel weight
  const base = 50;
  const amp = Math.max(8, weight * 60);
  return Array.from({ length: 8 }, (_, i) => base + Math.sin(i * 0.9) * amp + (i * weight * 4));
}

export default function LaunchChannelMix({ launch }: { launch: Launch }) {
  const channels = [...launch.channels].sort((a, b) => b.weight - a.weight);
  const totalWeight = channels.reduce((s, c) => s + c.weight, 0);

  if (channels.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-ink-200 dark:border-ink-800 p-8 text-center text-body-sm text-ink-500 dark:text-ink-400">
        No channel mix declared in the brief yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-title-sm font-semibold tracking-tight">
          Channel allocation
        </h2>
        <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5">
          Weight per channel from the campaign brief — share of focus, not absolute spend.
        </p>
      </header>

      {/* Stacked share bar */}
      <div className="space-y-2">
        <div
          aria-label="Channel share"
          className="flex h-3 rounded-full overflow-hidden bg-ink-100 dark:bg-ink-800"
        >
          {channels.map((c) => (
            <span
              key={c.channel}
              title={`${c.channel} — ${(c.weight * 100).toFixed(0)}%`}
              style={{ width: `${(c.weight / totalWeight) * 100}%` }}
              className={[colorFor(c.channel), "h-full"].join(" ")}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-label-xs font-mono text-ink-500 dark:text-ink-400">
          <span>Sum: {(totalWeight * 100).toFixed(0)}%</span>
          <span>{channels.length} channels</span>
        </div>
      </div>

      {/* Per-channel rows */}
      <div className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card divide-y divide-ink-100 dark:divide-ink-800 overflow-hidden">
        {channels.map((c) => (
          <ChannelRow key={c.channel} channel={c} totalWeight={totalWeight} />
        ))}
      </div>
    </div>
  );
}

function ChannelRow({
  channel,
  totalWeight,
}: {
  channel: LaunchChannel;
  totalWeight: number;
}) {
  const sharePct = (channel.weight / totalWeight) * 100;
  return (
    <div className="px-5 py-4 flex items-start gap-4">
      <span
        aria-hidden
        className={[
          "w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0",
          colorFor(channel.channel),
        ].join(" ")}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h3 className="text-body-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50">
            {channel.channel}
          </h3>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Sparkline
              values={syntheticSeries(channel.weight)}
              width={60}
              height={18}
              tone="accent"
              ariaLabel={`${channel.channel} pacing`}
            />
            <span className="text-body-sm font-semibold tabular-nums text-ink-900 dark:text-ink-50 min-w-[3.5rem] text-right">
              {sharePct.toFixed(0)}%
            </span>
          </div>
        </div>
        {channel.rationale && (
          <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-1 leading-snug">
            {channel.rationale}
          </p>
        )}
      </div>
    </div>
  );
}
