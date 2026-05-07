import Link from "next/link";
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
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  FileText,
  Sparkles,
  Telescope,
} from "lucide-react";

export const dynamic = "force-static";

type Section = "brief" | "asks" | "risks" | "horizon" | "calendar";

const SECTIONS: {
  key: Section;
  label: string;
  anchor: string;
  icon: React.ReactNode;
}[] = [
  { key: "brief", label: "Morning brief", anchor: "brief", icon: <FileText className="w-3.5 h-3.5" /> },
  { key: "asks", label: "Decisions", anchor: "asks", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { key: "risks", label: "Risks", anchor: "risks", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  { key: "horizon", label: "Horizon", anchor: "horizon", icon: <Telescope className="w-3.5 h-3.5" /> },
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
            { label: "POLYAI", href: "/" },
            { label: "CCO Daily", icon: <Sparkles className="w-3 h-3" /> },
            { label: displayName },
          ]}
        />
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-display font-semibold tracking-tight flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-accent" aria-hidden />
              {displayName}
            </h1>
            <p className="text-body-sm text-ink-500 mt-1">
              CCO daily control plane · what needs your attention today
            </p>
          </div>
          <div className="flex items-center gap-3">
            {clientsWithCco.length > 1 && (
              <form className="flex items-center gap-2">
                <label htmlFor="client-switch" className="text-label-xs font-mono uppercase tracking-wider text-ink-400">
                  client
                </label>
                <select
                  id="client-switch"
                  name="client"
                  defaultValue={activeSlug}
                  className="bg-white dark:bg-ink-900 text-body-sm border border-ink-200 dark:border-ink-700 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  {clientsWithCco.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.displayName ?? c.slug}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="text-label-xs font-mono uppercase tracking-wider text-ink-500 hover:text-accent transition-colors"
                >
                  switch ›
                </button>
              </form>
            )}
            <Link
              href={`/clients/${activeSlug}`}
              className="text-label-xs font-mono uppercase tracking-wider text-ink-500 hover:text-accent transition-colors"
            >
              client workspace ›
            </Link>
          </div>
        </div>

        {/* Section nav */}
        <nav
          aria-label="CCO sections"
          className="flex flex-wrap gap-0.5 border-b border-ink-200/70 dark:border-ink-800 pb-0"
        >
          {SECTIONS.map((s) => (
            <a
              key={s.key}
              href={`#${s.anchor}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-label-sm font-mono uppercase tracking-wider text-ink-500 hover:text-ink-900 dark:hover:text-ink-100 border-b-2 border-transparent hover:border-accent transition-colors"
            >
              <span aria-hidden>{s.icon}</span>
              {s.label}
            </a>
          ))}
        </nav>
      </header>

      {/* Body */}
      <div className="space-y-12">
        <section id="brief" className="scroll-mt-20">
          {brief ? (
            <CcoMorningBrief brief={brief} clientName={displayName} />
          ) : (
            <EmptyCard label="No morning brief on file." />
          )}
        </section>

        <section id="asks" className="scroll-mt-20">
          {asks ? (
            <DecisionAsksQueue asks={asks} client={activeSlug} />
          ) : (
            <EmptyCard label="No decision-asks queued." />
          )}
        </section>

        <section id="risks" className="scroll-mt-20">
          {risks ? (
            <RiskRegister register={risks} />
          ) : (
            <EmptyCard label="Risk register empty." />
          )}
        </section>

        <section id="horizon" className="scroll-mt-20">
          {horizon ? (
            <HorizonScan scan={horizon} />
          ) : (
            <EmptyCard label="No horizon scan today." />
          )}
        </section>

        <section id="calendar" className="scroll-mt-20">
          {calendar ? (
            <CcoCalendar calendar={calendar} />
          ) : (
            <EmptyCard label="No calendar entries." />
          )}
        </section>
      </div>
    </div>
  );
}

function EmptyCard({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-dashed border-ink-200 dark:border-ink-800 p-8 text-center text-sm text-ink-400 font-mono">
      {label}
    </div>
  );
}
