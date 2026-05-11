"use client";

import Link from "next/link";
import {
  AlertOctagon,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import type {
  ParsedDecisionAsks,
  ParsedRiskRegister,
  ParsedCcoCalendar,
  CalendarEntry,
  DecisionAsk,
  ParsedRiskEntry,
} from "@/lib/content";
import { statusKey } from "@/lib/design-tokens";
import { ClassBadge, UrgencyBadge, SeverityBadge, StatusPill } from "@/components/ui";
import { useEffect } from "react";
import { useIdentity } from "@/lib/identity";
import { inScope, scopeFor } from "@/lib/role-scope";
import { useCcoDedupe } from "@/lib/cco-dedupe-context";
import AskAnchor from "@/components/ask/AskAnchor";
import AskInlineThread from "@/components/ask/AskInlineThread";

type Props = {
  asks: ParsedDecisionAsks | null;
  risks: ParsedRiskRegister | null;
  calendar: ParsedCcoCalendar | null;
};

function pickTopAsk(asks: ParsedDecisionAsks | null): DecisionAsk | null {
  if (!asks || asks.pending.length === 0) return null;
  // Already priority-ordered in queue.md; trust that
  return asks.pending[0];
}

function pickTopRisk(risks: ParsedRiskRegister | null): ParsedRiskEntry | null {
  if (!risks) return null;
  const red = risks.open.find((r) => statusKey(r.status) === "red");
  if (red) return red;
  const amber = risks.open.find((r) => statusKey(r.status) === "amber");
  return amber ?? null;
}

function pickTopCalendar(calendar: ParsedCcoCalendar | null): CalendarEntry | null {
  if (!calendar) return null;
  return calendar.thisWeek[0] ?? calendar.nextWeek[0] ?? null;
}

export default function CcoNow({ asks, risks, calendar }: Props) {
  const { identity, hydrated } = useIdentity();
  const scope = scopeFor(identity?.role ?? "cco", identity?.agentSlug);

  // Scope filter — managers/specialists see only their pod's items.
  // Pre-hydration we render unfiltered to avoid a flash; once hydrated, scope kicks in.
  const scopedAsks: ParsedDecisionAsks | null = (() => {
    if (!asks) return null;
    if (!hydrated || scope.seesAll) return asks;
    return { ...asks, pending: asks.pending.filter((a) => inScope(scope, a.className ?? "")) };
  })();
  const scopedRisks: ParsedRiskRegister | null = (() => {
    if (!risks) return null;
    if (!hydrated || scope.seesAll) return risks;
    return { ...risks, open: risks.open.filter((r) => inScope(scope, r.class ?? "")) };
  })();

  const topAsk = pickTopAsk(scopedAsks);
  const topRisk = pickTopRisk(scopedRisks);
  const topCal = pickTopCalendar(calendar);

  // Register the picked IDs so DecisionAsksQueue / RiskRegister / CcoCalendar
  // below can dedupe them — kills the 2–3× duplication on /cco.
  const { registerExcluded } = useCcoDedupe();
  useEffect(() => {
    registerExcluded("ask", topAsk ? [topAsk.id] : []);
  }, [topAsk?.id, registerExcluded]);
  useEffect(() => {
    registerExcluded("risk", topRisk ? [topRisk.title] : []);
  }, [topRisk?.title, registerExcluded]);
  useEffect(() => {
    registerExcluded("calendar", topCal ? [`${topCal.date}|${topCal.time}|${topCal.event}`] : []);
  }, [topCal?.date, topCal?.time, topCal?.event, registerExcluded]);

  const items: { kind: "ask" | "risk" | "cal"; node: React.ReactNode; key: string }[] = [];

  if (topAsk) {
    items.push({
      kind: "ask",
      key: topAsk.id,
      node: <NowAskCard ask={topAsk} pendingCount={scopedAsks?.pending.length ?? 0} />,
    });
  }
  if (topRisk) {
    items.push({
      kind: "risk",
      key: topRisk.title,
      node: <NowRiskCard risk={topRisk} totalOpen={scopedRisks?.open.length ?? 0} />,
    });
  }
  if (topCal) {
    items.push({
      kind: "cal",
      key: topCal.event,
      node: <NowCalendarCard entry={topCal} />,
    });
  }

  if (items.length === 0) {
    return (
      <section
        aria-label="What needs you now"
        className="rounded-card border border-ink-200/70 dark:border-ink-800 dark:ring-1 dark:ring-white/[0.06] bg-success-50 dark:bg-success-950/30 p-6 text-center"
      >
        <CheckCircle2
          className="w-8 h-8 text-success-600 dark:text-success-400 mx-auto mb-2"
          aria-hidden
        />
        <p className="text-body font-medium text-ink-800 dark:text-ink-100">
          You're all caught up.
        </p>
        <p className="text-body-sm text-ink-600 dark:text-ink-300 mt-1">
          No decisions waiting, no red risks, no urgent calendar items.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="What needs you now" className="space-y-4">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h2 className="text-title font-semibold tracking-tight">
          What needs you now
        </h2>
        <span className="text-body-xs text-ink-500 dark:text-ink-400">
          Top {items.length} {items.length === 1 ? "item" : "items"} · everything else below
        </span>
      </div>
      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.kind + ":" + it.key}>{it.node}</div>
        ))}
      </div>
    </section>
  );
}

function NowAskCard({
  ask,
  pendingCount,
}: {
  ask: DecisionAsk;
  pendingCount: number;
}) {
  const anchor = {
    kind: "decision" as const,
    id: `ask-${ask.id}`,
    label: ask.ask,
    summary: ask.recommendation ?? undefined,
  };
  return (
    <article className="rounded-card border-l-4 border-l-accent border border-ink-200/70 dark:border-ink-800 dark:ring-1 dark:ring-white/[0.06] bg-white dark:bg-ink-900 p-5 shadow-card">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-body-xs font-semibold text-accent">
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
          A decision waits on you
        </span>
        <ClassBadge value={ask.className} />
        <UrgencyBadge value={ask.urgency} />
        <span className="ml-auto">
          <AskAnchor anchor={anchor} size="xs" />
        </span>
      </div>
      <h3 className="text-title-sm font-semibold tracking-tight mt-2 leading-snug">
        {ask.ask}
      </h3>
      {ask.recommendation && (
        <p className="text-body-sm text-ink-700 dark:text-ink-300 mt-2 leading-relaxed">
          <span className="font-semibold">Recommendation:</span> {ask.recommendation}
        </p>
      )}
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <Link
          href="#asks"
          className="inline-flex items-center justify-center gap-1.5 bg-accent text-white hover:bg-accent-600 font-medium text-body-sm px-4 py-2 rounded-md transition-colors"
        >
          Decide
          <ChevronRight className="w-3.5 h-3.5" aria-hidden />
        </Link>
        <span className="text-body-xs text-ink-500 dark:text-ink-400">
          {pendingCount > 1
            ? `+ ${pendingCount - 1} more pending`
            : "Only this one pending"}
        </span>
        <span className="text-body-xs text-ink-500 dark:text-ink-400 ml-auto">
          Decide by {ask.sla || "—"}
        </span>
      </div>
      <AskInlineThread anchor={anchor} />
    </article>
  );
}

function NowRiskCard({
  risk,
  totalOpen,
}: {
  risk: ParsedRiskEntry;
  totalOpen: number;
}) {
  const sk = statusKey(risk.status);
  const isRed = sk === "red";
  const anchor = {
    kind: "risk" as const,
    id: `risk-${risk.title}`,
    label: risk.title,
    summary: risk.description,
  };
  return (
    <article
      className={[
        "rounded-card border border-ink-200/70 dark:border-ink-800 dark:ring-1 dark:ring-white/[0.06] bg-white dark:bg-ink-900 p-5 shadow-card",
        isRed ? "border-l-4 border-l-danger-500" : "border-l-4 border-l-warning-500",
      ].join(" ")}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={[
            "inline-flex items-center gap-1.5 text-body-xs font-semibold",
            isRed
              ? "text-danger-600 dark:text-danger-400"
              : "text-warning-600 dark:text-warning-400",
          ].join(" ")}
        >
          {isRed ? (
            <AlertOctagon className="w-3.5 h-3.5" aria-hidden />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden />
          )}
          {isRed ? "A red risk needs attention" : "An amber risk to watch"}
        </span>
        <ClassBadge value={risk.class} />
        <SeverityBadge value={risk.severity} />
        <StatusPill status={risk.status} ageDays={risk.ageDays} />
        <span className="ml-auto">
          <AskAnchor anchor={anchor} size="xs" />
        </span>
      </div>
      <h3 className="text-title-sm font-semibold tracking-tight mt-2 leading-snug">
        {risk.title}
      </h3>
      <p className="text-body-sm text-ink-700 dark:text-ink-300 mt-1.5 leading-relaxed line-clamp-3">
        {risk.description}
      </p>
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <Link
          href="#risks"
          className="inline-flex items-center justify-center gap-1.5 bg-ink-100 hover:bg-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700 text-ink-800 dark:text-ink-100 font-medium text-body-sm px-4 py-2 rounded-md transition-colors"
        >
          Review
          <ChevronRight className="w-3.5 h-3.5" aria-hidden />
        </Link>
        <span className="text-body-xs text-ink-500 dark:text-ink-400">
          {totalOpen > 1 ? `+ ${totalOpen - 1} more open` : "Only this one open"}
        </span>
        {risk.ownerHuman && (
          <span className="text-body-xs text-ink-500 dark:text-ink-400 ml-auto">
            Owner: {risk.ownerHuman}
          </span>
        )}
      </div>
      <AskInlineThread anchor={anchor} />
    </article>
  );
}

function NowCalendarCard({ entry }: { entry: CalendarEntry }) {
  const anchor = {
    kind: "calendar-event" as const,
    id: `cal-${entry.date}-${entry.time}-${entry.event}`,
    label: entry.event,
    summary: `${entry.date}${entry.time ? ` · ${entry.time}` : ""}${entry.counterparty ? ` · ${entry.counterparty}` : ""}${entry.decisionNeeded && entry.decisionNeeded !== "—" ? ` · Decision: ${entry.decisionNeeded}` : ""}`,
  };
  return (
    <article className="rounded-card border-l-4 border-l-info-500 border border-ink-200/70 dark:border-ink-800 dark:ring-1 dark:ring-white/[0.06] bg-white dark:bg-ink-900 p-5 shadow-card">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-body-xs font-semibold text-info-600 dark:text-info-400">
          <CalendarDays className="w-3.5 h-3.5" aria-hidden />
          Up next on your calendar
        </span>
        <span className="ml-auto">
          <AskAnchor anchor={anchor} size="xs" />
        </span>
      </div>
      <h3 className="text-title-sm font-semibold tracking-tight mt-2 leading-snug">
        {entry.event}
      </h3>
      <p className="text-body-sm text-ink-700 dark:text-ink-300 mt-1 leading-relaxed">
        {entry.date}
        {entry.time ? ` · ${entry.time}` : ""}
        {entry.counterparty ? ` · ${entry.counterparty}` : ""}
      </p>
      {entry.decisionNeeded && entry.decisionNeeded !== "—" && (
        <p className="text-body-sm text-ink-600 dark:text-ink-400 mt-2">
          <span className="font-semibold">Decision needed:</span> {entry.decisionNeeded}
        </p>
      )}
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <Link
          href="#calendar"
          className="inline-flex items-center justify-center gap-1.5 bg-ink-100 hover:bg-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700 text-ink-800 dark:text-ink-100 font-medium text-body-sm px-4 py-2 rounded-md transition-colors"
        >
          Open calendar
          <ChevronRight className="w-3.5 h-3.5" aria-hidden />
        </Link>
        {entry.briefOwner && (
          <span className="text-body-xs text-ink-500 dark:text-ink-400 ml-auto">
            Prep owner: {entry.briefOwner}
          </span>
        )}
      </div>
      <AskInlineThread anchor={anchor} />
    </article>
  );
}
