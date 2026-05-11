import {
  getCcoCalendar,
  getClients,
  getClient,
  getDecisionAsks,
  getHorizonScan,
  getMorningBrief,
  getRiskRegister,
} from "@/lib/content";
import CcoMorningBrief from "@/components/CcoMorningBrief";
import RiskRegister from "@/components/RiskRegister";
import HorizonScan from "@/components/HorizonScan";
import DecisionAsksQueue from "@/components/DecisionAsksQueue";
import CcoCalendar from "@/components/CcoCalendar";
import CcoNow from "@/components/CcoNow";
import Breadcrumbs from "@/components/Breadcrumbs";
import LivePulse from "@/components/LivePulse";
import { CcoDedupeProvider } from "@/lib/cco-dedupe-context";
import { AskProvider } from "@/lib/ask-context";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  FileText,
  Sparkles,
  Telescope,
} from "lucide-react";

export const dynamic = "force-static";

type Section = "now" | "asks" | "risks" | "brief" | "horizon" | "calendar";

const SECTIONS: {
  key: Section;
  label: string;
  anchor: string;
  icon: React.ReactNode;
}[] = [
  { key: "now", label: "Now", anchor: "now", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { key: "asks", label: "Decisions", anchor: "asks", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { key: "risks", label: "Risks", anchor: "risks", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  { key: "brief", label: "Brief", anchor: "brief", icon: <FileText className="w-3.5 h-3.5" /> },
  { key: "horizon", label: "What's new", anchor: "horizon", icon: <Telescope className="w-3.5 h-3.5" /> },
  { key: "calendar", label: "Calendar", anchor: "calendar", icon: <CalendarDays className="w-3.5 h-3.5" /> },
];

function clientWithCcoSurface(slug: string): boolean {
  return getMorningBrief(slug) !== null;
}

export default async function CcoPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client: clientParam } = await searchParams;
  const allClients = getClients();
  const clientsWithCco = allClients.filter((c) => clientWithCcoSurface(c.slug));
  const activeSlug =
    (clientParam && clientsWithCco.find((c) => c.slug === clientParam)?.slug) ??
    clientsWithCco[0]?.slug ??
    null;

  if (!activeSlug) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">CCO Daily</h1>
        <div className="mt-8 rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-8 text-center">
          <p className="text-ink-600 dark:text-ink-400">
            No client has a CCO daily surface yet. Populate{" "}
            <code className="font-mono text-xs bg-ink-100 dark:bg-ink-800 px-1 py-0.5 rounded">
              clients/&lt;slug&gt;/cco/briefs/
            </code>{" "}
            to surface here.
          </p>
        </div>
      </div>
    );
  }

  const client = getClient(activeSlug);
  const brief = getMorningBrief(activeSlug);
  const asks = getDecisionAsks(activeSlug);
  const risks = getRiskRegister(activeSlug);
  const horizon = getHorizonScan(activeSlug);
  const calendar = getCcoCalendar(activeSlug);

  const displayName = client?.summary.displayName ?? activeSlug;

  return (
    <div>
      {/* Header */}
      <header className="mb-8 space-y-3">
        <Breadcrumbs
          crumbs={[
            { label: "Today", icon: <Sparkles className="w-3 h-3" /> },
            { label: displayName },
          ]}
        />
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-display font-semibold tracking-tight">
              Today
            </h1>
            <p className="text-body text-ink-600 dark:text-ink-300 mt-1">
              What needs you today
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <LivePulse autoMs={120_000} label="brief" />
          </div>
        </div>

        {/* Jump-to nav */}
        <nav
          aria-label="Jump to section"
          className="flex flex-wrap gap-0.5 border-b border-ink-200/70 dark:border-ink-800 pb-0"
        >
          {SECTIONS.map((s) => (
            <a
              key={s.key}
              href={`#${s.anchor}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-body-sm text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 border-b-2 border-transparent hover:border-accent transition-colors"
            >
              <span aria-hidden>{s.icon}</span>
              {s.label}
            </a>
          ))}
        </nav>
      </header>

      {/* Body — Now hero first, then Decisions + Risks visible, dense sections collapsed */}
      <CcoDedupeProvider>
      <AskProvider>
      <div className="space-y-10">
        {/* Now: top items needing attention */}
        <section id="now" className="scroll-mt-20">
          <CcoNow asks={asks} risks={risks} calendar={calendar} />
        </section>

        {/* Decisions queue — primary actionable section */}
        <section id="asks" className="scroll-mt-20">
          {asks ? (
            <DecisionAsksQueue asks={asks} client={activeSlug} />
          ) : (
            <EmptyCard label="No decisions queued." />
          )}
        </section>

        {/* Risk register — primary monitoring section */}
        <section id="risks" className="scroll-mt-20">
          {risks ? (
            <RiskRegister register={risks} />
          ) : (
            <EmptyCard label="No risks tracked." />
          )}
        </section>

        {/* Below the fold: dense reading sections — collapsed by default */}
        <CollapsedSection
          id="brief"
          summary={
            brief
              ? `Today's brief — about 90 seconds to read`
              : "No morning brief on file."
          }
          disabled={!brief}
        >
          {brief && <CcoMorningBrief brief={brief} clientName={displayName} />}
        </CollapsedSection>

        <CollapsedSection
          id="horizon"
          summary={
            horizon
              ? `What's new — ${horizon.surfaced.length} surfaced item${horizon.surfaced.length === 1 ? "" : "s"}, ${horizon.watchlist.length} on watchlist`
              : "No horizon scan today."
          }
          disabled={!horizon}
        >
          {horizon && <HorizonScan scan={horizon} />}
        </CollapsedSection>

        <CollapsedSection
          id="calendar"
          summary={
            calendar
              ? `Calendar — ${calendar.thisWeek.length} this week, ${calendar.nextWeek.length} next week`
              : "No calendar entries."
          }
          disabled={!calendar}
        >
          {calendar && <CcoCalendar calendar={calendar} />}
        </CollapsedSection>
      </div>
      </AskProvider>
      </CcoDedupeProvider>
    </div>
  );
}

function CollapsedSection({
  id,
  summary,
  disabled = false,
  children,
}: {
  id: string;
  summary: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <section id={id} className="scroll-mt-20">
        <EmptyCard label={summary} />
      </section>
    );
  }
  return (
    <section id={id} className="scroll-mt-20">
      <details className="group rounded-card border border-ink-200/70 dark:border-ink-800 dark:ring-1 dark:ring-white/[0.06] bg-white dark:bg-ink-900 shadow-card overflow-hidden">
        <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between gap-3 hover:bg-ink-50/40 dark:hover:bg-ink-950/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
          <span className="text-body font-semibold text-ink-800 dark:text-ink-100">
            {summary}
          </span>
          <span className="inline-flex items-center gap-1 text-body-xs text-ink-500 dark:text-ink-400">
            <span className="group-open:hidden">Show</span>
            <span className="hidden group-open:inline">Hide</span>
            <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" aria-hidden />
          </span>
        </summary>
        <div className="px-5 py-5 border-t border-ink-100 dark:border-ink-800">
          {children}
        </div>
      </details>
    </section>
  );
}

function EmptyCard({ label }: { label: string }) {
  return (
    <div className="rounded-card border border-dashed border-ink-200 dark:border-ink-800 p-6 text-center text-body-sm text-ink-500 dark:text-ink-400">
      {label}
    </div>
  );
}
