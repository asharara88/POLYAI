import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Flame,
  Gauge,
  LineChart,
  Minus,
  Newspaper,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Telescope,
  Wallet,
} from "lucide-react";
import type { ParsedBriefSection, ParsedMorningBrief } from "@/lib/content";

type Tone = "good" | "bad" | "neutral";

function classifySection(heading: string): SectionKind {
  const h = heading.toLowerCase();
  if (/attention/.test(h)) return "attention";
  if (/pipeline|forecast/.test(h)) return "pipeline";
  if (/channel.*mix/.test(h)) return "channel-mix";
  if (/calendar/.test(h)) return "calendar";
  if (/risk register/.test(h)) return "risk-tally";
  if (/horizon/.test(h)) return "horizon";
  if (/compliance/.test(h)) return "compliance";
  if (/aged threads/.test(h)) return "aged-threads";
  return "generic";
}

type SectionKind =
  | "attention"
  | "pipeline"
  | "channel-mix"
  | "calendar"
  | "risk-tally"
  | "horizon"
  | "compliance"
  | "aged-threads"
  | "generic";

export default function CcoMorningBrief({
  brief,
  clientName,
}: {
  brief: ParsedMorningBrief;
  clientName: string;
}) {
  const sources = parseSources(brief.raw);
  // Skip the "attention" section here — /cco already shows it in CcoNow above this brief.
  const sections = brief.sections.filter((s) => classifySection(s.heading) !== "attention");

  return (
    <article>
      <BriefHeader
        date={brief.date}
        clientName={clientName}
        assembledAt={brief.assembledAt}
      />

      <div className="mt-6 space-y-6">
        {sections.map((s) => (
          <BriefSection key={s.heading} section={s} />
        ))}
      </div>

      {sources.length > 0 && <SourcesFooter sources={sources} />}
    </article>
  );
}

// ---------- Header ----------

function BriefHeader({
  date,
  clientName,
  assembledAt,
}: {
  date: string;
  clientName: string;
  assembledAt: string | null;
}) {
  const assembledTime = assembledAt ? extractTime(assembledAt) : null;
  return (
    <header className="flex items-start gap-3 flex-wrap">
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-card bg-accent/10 text-accent flex-shrink-0">
        <FileText className="w-5 h-5" aria-hidden />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-label-xs font-mono uppercase tracking-wider text-ink-400">
          Morning brief · {clientName}
        </div>
        <h2 className="text-title font-semibold tracking-tight mt-1">{date}</h2>
        <div className="flex items-center gap-2 mt-1.5 text-body-xs text-ink-500 dark:text-ink-400">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden />
            ~90 second read
          </span>
          {assembledTime && (
            <>
              <span aria-hidden className="text-ink-300 dark:text-ink-700">·</span>
              <span>Assembled {assembledTime}</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function extractTime(iso: string): string | null {
  const m = iso.match(/T(\d{2}:\d{2})/);
  return m ? m[1] : null;
}

// ---------- Section router ----------

function BriefSection({ section }: { section: ParsedBriefSection }) {
  const kind = classifySection(section.heading);
  switch (kind) {
    case "pipeline":
      return <PipelineSection heading={section.heading} body={section.body} />;
    case "channel-mix":
      return <ChannelMixSection heading={section.heading} body={section.body} />;
    case "calendar":
      return <CalendarSection heading={section.heading} body={section.body} />;
    case "risk-tally":
      return <RiskTallySection heading={section.heading} body={section.body} />;
    case "horizon":
      return <HorizonSection heading={section.heading} body={section.body} />;
    case "compliance":
      return <ComplianceSection heading={section.heading} body={section.body} />;
    case "aged-threads":
      return <AgedThreadsSection heading={section.heading} body={section.body} />;
    default:
      return <GenericSection heading={section.heading} body={section.body} />;
  }
}

function SectionFrame({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ink-100 dark:border-ink-800 pt-6 first:border-t-0 first:pt-0">
      <header className="flex items-center gap-2.5 mb-4">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-accent/10 text-accent flex-shrink-0">
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="text-body-sm font-semibold tracking-tight text-ink-800 dark:text-ink-100">
            {title}
          </h3>
          {subtitle && (
            <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </header>
      <div>{children}</div>
    </section>
  );
}

// ---------- Pipeline + forecast ----------

type Kpi = {
  label: string;
  value: string;
  delta?: string;
  context?: string;
  tone: Tone;
};

const KPI_ICONS: Record<string, React.ReactNode> = {
  bookings: <Wallet className="w-4 h-4" />,
  pipeline: <LineChart className="w-4 h-4" />,
  expected: <CheckCircle2 className="w-4 h-4" />,
  coverage: <Gauge className="w-4 h-4" />,
};

function pipelineIcon(label: string): React.ReactNode {
  const l = label.toLowerCase();
  if (l.includes("booking")) return KPI_ICONS.bookings;
  if (l.includes("pipeline") && !l.includes("coverage")) return KPI_ICONS.pipeline;
  if (l.includes("close") || l.includes("expected")) return KPI_ICONS.expected;
  if (l.includes("coverage")) return KPI_ICONS.coverage;
  return <LineChart className="w-4 h-4" />;
}

function PipelineSection({ heading, body }: { heading: string; body: string }) {
  const { kpis, slipping } = parsePipeline(body);
  return (
    <SectionFrame
      icon={<LineChart className="w-4 h-4" />}
      title="Pipeline + forecast"
      subtitle={extractParenthetical(heading) ?? "delta vs. last Monday"}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => (
          <KpiCard key={i} kpi={kpi} icon={pipelineIcon(kpi.label)} />
        ))}
      </div>
      {slipping && (
        <div className="mt-4 rounded-md border border-warning-200 dark:border-warning-900/40 bg-warning-50/60 dark:bg-warning-950/30 px-4 py-3 flex items-start gap-2.5">
          <AlertTriangle
            className="w-4 h-4 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5"
            aria-hidden
          />
          <div className="text-body-sm text-warning-900 dark:text-warning-100 leading-relaxed">
            <span className="font-semibold">Slipping deals — </span>
            <span>{slipping}</span>
          </div>
        </div>
      )}
    </SectionFrame>
  );
}

function KpiCard({ kpi, icon }: { kpi: Kpi; icon: React.ReactNode }) {
  return (
    <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-ink-50/30 dark:bg-ink-950/30 p-4">
      <div className="flex items-center gap-1.5 text-label-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
        <span className="text-ink-400" aria-hidden>{icon}</span>
        <span className="truncate">{kpi.label}</span>
      </div>
      <div className="mt-2 text-display-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50 tabular-nums">
        {kpi.value}
      </div>
      {kpi.delta && <DeltaPill text={kpi.delta} tone={kpi.tone} />}
      {kpi.context && (
        <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-1.5 leading-snug">
          {kpi.context}
        </p>
      )}
    </div>
  );
}

function DeltaPill({ text, tone }: { text: string; tone: Tone }) {
  const Icon = tone === "good" ? ArrowUpRight : tone === "bad" ? ArrowDownRight : Minus;
  const styles =
    tone === "good"
      ? "bg-success-100 text-success-700 dark:bg-success-950/40 dark:text-success-300"
      : tone === "bad"
        ? "bg-danger-100 text-danger-700 dark:bg-danger-950/40 dark:text-danger-300"
        : "bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300";
  return (
    <span
      className={[
        "mt-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-label-xs font-mono",
        styles,
      ].join(" ")}
    >
      <Icon className="w-3 h-3" aria-hidden />
      <span>{text}</span>
    </span>
  );
}

function parsePipeline(body: string): { kpis: Kpi[]; slipping: string | null } {
  const lines = body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-"));
  const kpis: Kpi[] = [];
  let slipping: string | null = null;
  for (const line of lines) {
    const m = line.match(/^-\s+\*\*(.+?):\*\*\s+(.+)$/);
    if (!m) continue;
    const label = m[1].trim();
    const rest = m[2].trim();
    if (/slipping/i.test(label)) {
      slipping = rest;
      continue;
    }
    const { value, delta, context, tone } = splitValueDelta(label, rest);
    kpis.push({ label, value, delta, context, tone });
  }
  return { kpis, slipping };
}

function splitValueDelta(
  label: string,
  rest: string,
): { value: string; delta?: string; context?: string; tone: Tone } {
  // Pattern: "AED 142M (-AED 18M week-over-week; tracking +6% vs. monthly plan)"
  // Pattern: "3.6× — within target band"
  const paren = rest.match(/^(.+?)\s*\((.+)\)\s*$/);
  if (paren) {
    const value = paren[1].trim();
    const inside = paren[2];
    // First clause = delta; remainder after ; or , becomes context
    const parts = inside.split(/;\s*/);
    const delta = parts[0].trim();
    const context = parts.slice(1).join("; ").trim() || undefined;
    return { value, delta, context, tone: deltaTone(label, delta) };
  }
  const dashSplit = rest.match(/^(.+?)\s*[—–-]\s*(.+)$/);
  if (dashSplit) {
    return {
      value: dashSplit[1].trim(),
      context: dashSplit[2].trim(),
      tone: "neutral",
    };
  }
  return { value: rest, tone: "neutral" };
}

function deltaTone(label: string, delta: string): Tone {
  const isCount = /coverage|×|x$/i.test(label);
  if (isCount) return "neutral";
  // pp deltas: + good, - bad, "flat" neutral
  if (/^flat$/i.test(delta)) return "neutral";
  const sign = delta.match(/^([+−-])/)?.[1];
  if (!sign) return "neutral";
  // For bookings/pipeline: + is good, - is bad
  if (sign === "+") return "good";
  return "bad";
}

function extractParenthetical(heading: string): string | null {
  const m = heading.match(/\((.+)\)/);
  return m ? m[1] : null;
}

// ---------- Channel mix ----------

type Channel = {
  name: string;
  bookings: string;
  share: number;
  shareLabel: string;
  delta: string;
};

const CHANNEL_TONE: Record<string, string> = {
  direct: "bg-accent",
  broker: "bg-info-500",
  wealth: "bg-purple-500",
  vvip: "bg-warning-500",
};

function channelKey(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("direct")) return "direct";
  if (n.includes("broker")) return "broker";
  if (n.includes("wealth")) return "wealth";
  if (n.includes("vvip")) return "vvip";
  return "direct";
}

function ChannelMixSection({ heading: _h, body }: { heading: string; body: string }) {
  const { rows, note } = parseChannelMix(body);
  return (
    <SectionFrame
      icon={<Scale className="w-4 h-4" />}
      title="Channel mix"
      subtitle="this week vs. plan"
    >
      <div className="space-y-4">
        {/* Stacked share bar */}
        <div
          aria-label="Channel share"
          className="flex h-3 rounded-full overflow-hidden bg-ink-100 dark:bg-ink-800"
        >
          {rows.map((r) => (
            <span
              key={r.name}
              title={`${r.name} — ${r.shareLabel}`}
              style={{ width: `${r.share}%` }}
              className={[CHANNEL_TONE[channelKey(r.name)], "h-full"].join(" ")}
            />
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {rows.map((r) => (
            <ChannelChip key={r.name} channel={r} />
          ))}
        </div>

        {note && (
          <p className="text-body-xs text-ink-500 dark:text-ink-400 leading-relaxed border-l-2 border-ink-200 dark:border-ink-700 pl-3">
            {note}
          </p>
        )}
      </div>
    </SectionFrame>
  );
}

function ChannelChip({ channel }: { channel: Channel }) {
  const dotClass = CHANNEL_TONE[channelKey(channel.name)];
  const tone = channelDeltaTone(channel.delta);
  return (
    <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 px-3 py-2.5">
      <div className="flex items-center gap-2 min-w-0">
        <span
          aria-hidden
          className={["w-2 h-2 rounded-full flex-shrink-0", dotClass].join(" ")}
        />
        <span className="text-body-xs font-medium text-ink-700 dark:text-ink-200 truncate">
          {channel.name}
        </span>
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className="text-body-sm font-semibold tabular-nums text-ink-900 dark:text-ink-50">
          {channel.bookings}
        </span>
        <span className="text-label-xs font-mono text-ink-400 tabular-nums">
          {channel.shareLabel}
        </span>
      </div>
      <DeltaPill text={channel.delta} tone={tone} />
    </div>
  );
}

function channelDeltaTone(delta: string): Tone {
  if (/^flat$/i.test(delta)) return "neutral";
  if (delta.startsWith("+")) return "good";
  if (/^[−-]/.test(delta)) return "bad";
  return "neutral";
}

function parseChannelMix(body: string): { rows: Channel[]; note: string | null } {
  const rows: Channel[] = [];
  let note: string | null = null;
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (line.startsWith(">")) {
      note = (note ? note + " " : "") + line.replace(/^>\s*/, "").trim();
      continue;
    }
    if (!line.startsWith("|")) continue;
    if (/^\|\s*-+/.test(line)) continue;
    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter((_, i, arr) => i > 0 && i < arr.length - 1);
    if (cells.length < 4) continue;
    if (/^channel$/i.test(cells[0])) continue;
    const shareNum = Number(cells[2].replace(/[^\d.]/g, "")) || 0;
    rows.push({
      name: cells[0],
      bookings: cells[1],
      share: shareNum,
      shareLabel: cells[2],
      delta: cells[3],
    });
  }
  return { rows, note };
}

// ---------- Calendar ----------

type CalendarRow = {
  time: string;
  title: string;
  counterparty: string;
  decision: string;
};

function CalendarSection({ heading: _h, body }: { heading: string; body: string }) {
  const rows = parseCalendar(body);
  return (
    <SectionFrame
      icon={<CalendarClock className="w-4 h-4" />}
      title="Today's calendar"
      subtitle={`${rows.length} item${rows.length === 1 ? "" : "s"}`}
    >
      <ol className="divide-y divide-ink-100 dark:divide-ink-800 -my-3">
        {rows.map((r, i) => (
          <li key={i} className="py-3 flex items-start gap-4">
            <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-accent/10 text-accent text-label-sm font-mono tabular-nums flex-shrink-0">
              {r.time}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-body-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50 leading-snug">
                {r.title}
              </div>
              <div className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5 leading-snug">
                {r.counterparty}
              </div>
            </div>
            <DecisionBadge decision={r.decision} />
          </li>
        ))}
      </ol>
    </SectionFrame>
  );
}

function DecisionBadge({ decision }: { decision: string }) {
  const lower = decision.toLowerCase();
  const hasDecision = /^yes/i.test(decision) || /\bda-/i.test(lower);
  if (!hasDecision) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-label-xs font-mono text-ink-400 bg-ink-100/60 dark:bg-ink-800/60 flex-shrink-0">
        No decision
      </span>
    );
  }
  const ref = decision.match(/(DA-[\w-]+)/i)?.[1];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-label-xs font-mono bg-accent/15 text-accent flex-shrink-0">
      <CheckCircle2 className="w-3 h-3" aria-hidden />
      {ref ?? "Decision"}
    </span>
  );
}

function parseCalendar(body: string): CalendarRow[] {
  const out: CalendarRow[] = [];
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (!line.startsWith("|")) continue;
    if (/^\|\s*-+/.test(line)) continue;
    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter((_, i, arr) => i > 0 && i < arr.length - 1);
    if (cells.length < 4) continue;
    if (/^time$/i.test(cells[0])) continue;
    out.push({
      time: cells[0],
      title: cells[1],
      counterparty: cells[2],
      decision: cells[3],
    });
  }
  return out;
}

// ---------- Risk tally ----------

type RiskTally = {
  red: { count: number; detail: string };
  amber: { count: number; detail: string };
  green: { count: number; detail: string };
  hotItem: string | null;
};

function RiskTallySection({ heading: _h, body }: { heading: string; body: string }) {
  const t = parseRiskTally(body);
  return (
    <SectionFrame
      icon={<ShieldAlert className="w-4 h-4" />}
      title="Risk register"
      subtitle="aged"
    >
      <div className="grid grid-cols-3 gap-2.5">
        <SeverityCount
          label="Red"
          subLabel=">14d"
          count={t.red.count}
          tone="red"
          detail={t.red.detail}
        />
        <SeverityCount
          label="Amber"
          subLabel=">7d"
          count={t.amber.count}
          tone="amber"
          detail={t.amber.detail}
        />
        <SeverityCount
          label="Green"
          subLabel="open"
          count={t.green.count}
          tone="green"
          detail={t.green.detail}
        />
      </div>
      {t.hotItem && (
        <div className="mt-4 rounded-md border border-warning-200 dark:border-warning-900/40 bg-warning-50/60 dark:bg-warning-950/30 px-4 py-3 flex items-start gap-2.5">
          <Flame
            className="w-4 h-4 text-warning-600 dark:text-warning-400 flex-shrink-0 mt-0.5"
            aria-hidden
          />
          <div className="text-body-sm text-warning-900 dark:text-warning-100 leading-relaxed">
            <span className="font-semibold">Hot item — </span>
            <span>{t.hotItem}</span>
          </div>
        </div>
      )}
    </SectionFrame>
  );
}

function SeverityCount({
  label,
  subLabel,
  count,
  tone,
  detail,
}: {
  label: string;
  subLabel: string;
  count: number;
  tone: "red" | "amber" | "green";
  detail: string;
}) {
  const styles =
    tone === "red"
      ? "border-danger-200 bg-danger-50/60 text-danger-700 dark:border-danger-900/50 dark:bg-danger-950/30 dark:text-danger-300"
      : tone === "amber"
        ? "border-warning-200 bg-warning-50/60 text-warning-700 dark:border-warning-900/50 dark:bg-warning-950/30 dark:text-warning-300"
        : "border-success-200 bg-success-50/60 text-success-700 dark:border-success-900/50 dark:bg-success-950/30 dark:text-success-300";
  return (
    <div className={["rounded-md border p-3", styles].join(" ")}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-label-xs font-mono uppercase tracking-wider">{label}</span>
        <span className="text-label-xs font-mono opacity-70">{subLabel}</span>
      </div>
      <div className="text-display-sm font-semibold tracking-tight tabular-nums mt-1">
        {count}
      </div>
      {detail && (
        <p className="text-body-xs leading-snug mt-1 opacity-80">{detail}</p>
      )}
    </div>
  );
}

function parseRiskTally(body: string): RiskTally {
  const out: RiskTally = {
    red: { count: 0, detail: "" },
    amber: { count: 0, detail: "" },
    green: { count: 0, detail: "" },
    hotItem: null,
  };
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    const m = line.match(/^-\s+\*\*(.+?):\*\*\s+(.+)$/);
    if (!m) continue;
    const label = m[1].toLowerCase();
    const rest = m[2].trim();
    if (label.startsWith("red")) {
      out.red = parseTallyValue(rest);
    } else if (label.startsWith("amber")) {
      out.amber = parseTallyValue(rest);
    } else if (label.startsWith("green")) {
      out.green = parseTallyValue(rest);
    } else if (label.includes("hot item")) {
      out.hotItem = rest;
    }
  }
  return out;
}

function parseTallyValue(rest: string): { count: number; detail: string } {
  // "0" or "2 (MEP procurement timeline 14d; ...)"
  const numMatch = rest.match(/^(\d+)/);
  const count = numMatch ? Number(numMatch[1]) : 0;
  const paren = rest.match(/\((.+)\)/);
  return { count, detail: paren ? paren[1] : "" };
}

// ---------- Horizon scan ----------

type HorizonItem = {
  title: string;
  body: string;
  kind: "regulator" | "competitor" | "sanctions" | "market";
};

function HorizonSection({ heading: _h, body }: { heading: string; body: string }) {
  const items = parseHorizon(body);
  return (
    <SectionFrame
      icon={<Telescope className="w-4 h-4" />}
      title="Horizon scan"
      subtitle="overnight"
    >
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((it, i) => (
          <HorizonCard key={i} item={it} />
        ))}
      </div>
    </SectionFrame>
  );
}

function HorizonCard({ item }: { item: HorizonItem }) {
  const tone =
    item.kind === "regulator"
      ? { ring: "border-info-200 dark:border-info-900/40", chip: "bg-info-100 text-info-700 dark:bg-info-950/40 dark:text-info-300" }
      : item.kind === "competitor"
        ? { ring: "border-purple-200 dark:border-purple-900/40", chip: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" }
        : item.kind === "sanctions"
          ? { ring: "border-danger-200 dark:border-danger-900/40", chip: "bg-danger-100 text-danger-700 dark:bg-danger-950/40 dark:text-danger-300" }
          : { ring: "border-ink-200 dark:border-ink-800", chip: "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300" };
  const Icon =
    item.kind === "regulator"
      ? Scale
      : item.kind === "competitor"
        ? Building2
        : item.kind === "sanctions"
          ? ShieldAlert
          : Newspaper;
  const kindLabel =
    item.kind === "regulator"
      ? "regulator"
      : item.kind === "competitor"
        ? "competitor"
        : item.kind === "sanctions"
          ? "sanctions"
          : "market";
  return (
    <div className={["rounded-md border p-4", tone.ring].join(" ")}>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded text-ink-500 dark:text-ink-400 flex-shrink-0">
          <Icon className="w-3.5 h-3.5" aria-hidden />
        </span>
        <span className={["text-label-xs font-mono uppercase tracking-wider px-1.5 py-0.5 rounded", tone.chip].join(" ")}>
          {kindLabel}
        </span>
      </div>
      <div className="mt-2 text-body-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50 leading-snug">
        {item.title}
      </div>
      <p className="text-body-xs text-ink-600 dark:text-ink-300 mt-1 leading-relaxed">
        {item.body}
      </p>
    </div>
  );
}

function classifyHorizonKind(text: string): HorizonItem["kind"] {
  const t = text.toLowerCase();
  if (/cbuae|dld|rera|adrec|adgm|difc|consultation|circular|regulator/.test(t)) return "regulator";
  if (/ofac|sanction|sdn|aml|fatf|pep/.test(t)) return "sanctions";
  if (/emaar|damac|nakheel|sobha|meraas|launch|competitor/.test(t)) return "competitor";
  return "market";
}

function parseHorizon(body: string): HorizonItem[] {
  const out: HorizonItem[] = [];
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    const m = line.match(/^\d+\.\s+\*\*(.+?)\*\*\s*[—–-]\s*(.+)$/);
    if (!m) continue;
    const title = m[1].trim();
    const restBody = m[2].trim();
    out.push({
      title,
      body: restBody,
      kind: classifyHorizonKind(`${title} ${restBody}`),
    });
  }
  return out;
}

// ---------- Compliance state ----------

type ComplianceMetric = {
  label: string;
  value: string;
  detail?: string;
  tone: Tone;
};

function ComplianceSection({ heading: _h, body }: { heading: string; body: string }) {
  const metrics = parseCompliance(body);
  return (
    <SectionFrame
      icon={<ShieldCheck className="w-4 h-4" />}
      title="Compliance state"
      subtitle="last 24h"
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m, i) => (
          <ComplianceMetricCard key={i} metric={m} />
        ))}
      </div>
    </SectionFrame>
  );
}

function ComplianceMetricCard({ metric }: { metric: ComplianceMetric }) {
  const tone =
    metric.tone === "good"
      ? "text-success-700 dark:text-success-300"
      : metric.tone === "bad"
        ? "text-warning-700 dark:text-warning-300"
        : "text-ink-900 dark:text-ink-50";
  return (
    <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-ink-50/30 dark:bg-ink-950/30 p-3.5">
      <div className="text-label-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400 leading-snug">
        {metric.label}
      </div>
      <div className={["mt-1.5 text-title-sm font-semibold tracking-tight tabular-nums", tone].join(" ")}>
        {metric.value}
      </div>
      {metric.detail && (
        <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-1 leading-snug">
          {metric.detail}
        </p>
      )}
    </div>
  );
}

function parseCompliance(body: string): ComplianceMetric[] {
  const out: ComplianceMetric[] = [];
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (!line.startsWith("-")) continue;
    const stripped = line.replace(/^-\s+/, "");
    const colonIdx = stripped.indexOf(":");
    if (colonIdx < 0) continue;
    const label = stripped.slice(0, colonIdx).replace(/\*\*/g, "").trim();
    const rest = stripped.slice(colonIdx + 1).trim();
    // Extract a leading numeric / cleared / 100% value
    const valueMatch = rest.match(/^([\d.]+%?|\d+\s*\/\s*\d+\s*\/\s*\d+|\d+)/);
    const value = valueMatch ? valueMatch[1].trim() : rest;
    let detail = valueMatch ? rest.slice(valueMatch[0].length).replace(/^[\s—–,–]+/, "").trim() : "";
    if (detail.startsWith("(") && detail.endsWith(")")) detail = detail.slice(1, -1);
    let tone: Tone = "neutral";
    if (/100%|\b0\s+direct|\bcleared/i.test(rest)) tone = "good";
    if (/decline|hit|hold/i.test(label) && /[1-9]/.test(value)) tone = "bad";
    out.push({ label, value, detail: detail || undefined, tone });
  }
  return out;
}

// ---------- Aged threads ----------

type AgedThread = {
  label: string;
  count: string;
  detail: string;
  tone: Tone;
};

function AgedThreadsSection({ heading: _h, body }: { heading: string; body: string }) {
  const items = parseAgedThreads(body);
  return (
    <SectionFrame
      icon={<Clock className="w-4 h-4" />}
      title="Aged threads"
      subtitle="over SLA"
    >
      <ul className="divide-y divide-ink-100 dark:divide-ink-800 -my-3">
        {items.map((it, i) => (
          <li key={i} className="py-3 flex items-start gap-3">
            <span
              className={[
                "inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-md text-body-sm font-mono font-semibold tabular-nums flex-shrink-0",
                it.tone === "good"
                  ? "bg-success-100 text-success-700 dark:bg-success-950/40 dark:text-success-300"
                  : it.tone === "bad"
                    ? "bg-warning-100 text-warning-700 dark:bg-warning-950/40 dark:text-warning-300"
                    : "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300",
              ].join(" ")}
            >
              {it.count}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-body-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50 leading-snug">
                {it.label}
              </div>
              {it.detail && (
                <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5 leading-snug">
                  {it.detail}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}

function parseAgedThreads(body: string): AgedThread[] {
  const out: AgedThread[] = [];
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    const m = line.match(/^-\s+\*\*(.+?):\*\*\s+(.+)$/);
    if (!m) continue;
    const label = m[1].trim();
    const rest = m[2].trim();
    const numMatch = rest.match(/^(\d+)/);
    const count = numMatch ? numMatch[1] : "—";
    const detailRaw = numMatch ? rest.slice(numMatch[0].length).replace(/^[\s—–,]+/, "").trim() : rest;
    let detail = detailRaw;
    if (detail.startsWith("(") && detail.endsWith(")")) detail = detail.slice(1, -1);
    const n = Number(count);
    let tone: Tone = "neutral";
    if (!Number.isNaN(n)) {
      tone = n === 0 ? "good" : "bad";
    }
    out.push({ label, count, detail, tone });
  }
  return out;
}

// ---------- Generic fallback ----------

function GenericSection({ heading, body }: { heading: string; body: string }) {
  return (
    <SectionFrame icon={<Sparkles className="w-4 h-4" />} title={heading}>
      <div className="text-body-sm text-ink-700 dark:text-ink-200 whitespace-pre-line leading-relaxed">
        {body.trim()}
      </div>
    </SectionFrame>
  );
}

// ---------- Sources ----------

function parseSources(raw: string): string[] {
  const idx = raw.indexOf("Sources cited");
  if (idx < 0) return [];
  const tail = raw.slice(idx);
  return tail
    .split("\n")
    .filter((l) => l.trim().startsWith("-"))
    .map((l) => l.replace(/^-\s*/, "").trim())
    .filter(Boolean);
}

function SourcesFooter({ sources }: { sources: string[] }) {
  return (
    <div className="mt-8 pt-6 border-t border-ink-100 dark:border-ink-800">
      <details className="group">
        <summary className="cursor-pointer list-none flex items-center justify-between gap-3 hover:text-ink-900 dark:hover:text-ink-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded">
          <span className="inline-flex items-center gap-2 text-body-sm text-ink-600 dark:text-ink-300">
            <FileText className="w-4 h-4 text-ink-400" aria-hidden />
            <span>Sources cited</span>
            <span className="text-label-xs font-mono text-ink-400 tabular-nums">
              {sources.length}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 text-body-xs text-ink-500 dark:text-ink-400">
            <span className="group-open:hidden">Show</span>
            <span className="hidden group-open:inline">Hide</span>
            <ChevronDown
              className="w-3.5 h-3.5 transition-transform group-open:rotate-180"
              aria-hidden
            />
          </span>
        </summary>
        <div className="mt-3 flex flex-wrap gap-2">
          {sources.map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-label-xs font-mono bg-ink-50 dark:bg-ink-900 border border-ink-200/70 dark:border-ink-800 text-ink-600 dark:text-ink-300"
            >
              <ArrowRight className="w-3 h-3 text-ink-400" aria-hidden />
              {s}
            </span>
          ))}
        </div>
      </details>
    </div>
  );
}
