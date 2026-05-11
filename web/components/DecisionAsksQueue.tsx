"use client";

import type { ParsedDecisionAsks, DecisionAsk } from "@/lib/content";
import { useIdentity } from "@/lib/identity";
import { inScope, scopeFor } from "@/lib/role-scope";
import SignDecisionAsk from "@/components/SignDecisionAsk";
import { Section, SectionHeader, Stack, Card, ClassBadge, UrgencyBadge } from "@/components/ui";
import { ChevronDown, ChevronUp, History, Inbox } from "lucide-react";

function AskCard({
  ask,
  client,
  defaultOpen = false,
}: {
  ask: DecisionAsk;
  client: string;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card overflow-hidden"
    >
      <summary className="cursor-pointer p-4 list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-card">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <ClassBadge value={ask.className} />
              <UrgencyBadge value={ask.urgency} />
            </div>
            <div className="font-semibold text-body mt-1.5 leading-snug">{ask.ask}</div>
          </div>
          <div className="text-body-xs text-ink-500 dark:text-ink-400 flex-shrink-0 inline-flex items-center gap-1">
            <span className="group-open:hidden inline-flex items-center gap-1">
              <ChevronDown className="w-3.5 h-3.5" aria-hidden />
              Show details
            </span>
            <span className="hidden group-open:inline-flex items-center gap-1">
              <ChevronUp className="w-3.5 h-3.5" aria-hidden />
              Hide details
            </span>
          </div>
        </div>
        <div className="text-body-xs text-ink-500 dark:text-ink-400 mt-2 flex flex-wrap gap-x-3">
          <span>by {ask.submitter}</span>
          <span>· {ask.submittedAt}</span>
          <span>· {ask.sla}</span>
        </div>
      </summary>
      <div className="px-4 pb-4 pt-0 border-t border-ink-100 dark:border-ink-800 space-y-3 text-body-sm">
        {ask.recommendation && (
          <div>
            <div className="text-body-xs font-semibold text-ink-700 dark:text-ink-200 mb-0.5">
              Recommendation
            </div>
            <div className="text-ink-700 dark:text-ink-300 leading-relaxed">
              {ask.recommendation}
            </div>
          </div>
        )}
        {ask.alternatives && (
          <div>
            <div className="text-body-xs font-semibold text-ink-700 dark:text-ink-200 mb-0.5">
              Alternatives considered
            </div>
            <div className="text-ink-600 dark:text-ink-400 leading-relaxed">
              {ask.alternatives}
            </div>
          </div>
        )}
        {ask.evidence && (
          <div>
            <div className="text-body-xs font-semibold text-ink-700 dark:text-ink-200 mb-0.5">
              Evidence
            </div>
            <div className="text-ink-600 dark:text-ink-400 leading-relaxed text-body-sm">
              {ask.evidence}
            </div>
          </div>
        )}
        <SignDecisionAsk client={client} askId={ask.id} className={ask.className} />
      </div>
    </details>
  );
}

export default function DecisionAsksQueue({
  asks,
  client,
}: {
  asks: ParsedDecisionAsks;
  client: string;
}) {
  const { identity, hydrated } = useIdentity();
  const scope = scopeFor(identity?.role ?? "cco", identity?.agentSlug);
  const pending = !hydrated || scope.seesAll
    ? asks.pending
    : asks.pending.filter((a) => inScope(scope, a.className ?? ""));
  const inScopeCount = pending.length;
  const outOfScopeCount = asks.pending.length - inScopeCount;

  return (
    <Stack gap="5">
      <Section
        title={
          <span className="inline-flex items-center gap-2">
            <Inbox className="w-5 h-5 text-ink-500" aria-hidden />
            Decisions to make
          </span>
        }
        description={
          inScopeCount === 0
            ? scope.seesAll
              ? `All caught up · ${asks.recentlySigned.length} signed in the last week`
              : `None in your scope · ${outOfScopeCount} waiting on other pods`
            : scope.seesAll
              ? `${inScopeCount} waiting on you · ${asks.recentlySigned.length} signed in the last week`
              : `${inScopeCount} in your scope · ${outOfScopeCount} on other pods`
        }
      >
        {inScopeCount === 0 ? (
          <Card padded className="text-center text-body-sm text-ink-500">
            {scope.seesAll
              ? "All caught up — no pending decisions."
              : "Nothing pending in your pod right now."}
          </Card>
        ) : (
          <Stack gap="2">
            {pending.map((a, i) => (
              <AskCard key={a.id} ask={a} client={client} defaultOpen={i === 0} />
            ))}
          </Stack>
        )}
      </Section>

      {asks.recentlySigned.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer list-none inline-flex items-center gap-1.5 text-body-sm text-ink-500 hover:text-ink-700 dark:hover:text-ink-200 transition-colors mb-3">
            <History className="w-3.5 h-3.5" aria-hidden />
            <span>{asks.recentlySigned.length} recently signed</span>
            <span className="text-ink-400 group-open:hidden">· show</span>
            <span className="text-ink-400 hidden group-open:inline">· hide</span>
          </summary>
          <Card padded={false} className="overflow-hidden">
            <table className="w-full text-body-xs">
              <thead>
                <tr className="border-b border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/30">
                  <th className="text-left text-body-xs font-semibold text-ink-600 dark:text-ink-300 px-3 py-2">
                    Reference
                  </th>
                  <th className="text-left text-body-xs font-semibold text-ink-600 dark:text-ink-300 px-3 py-2">
                    Submitted
                  </th>
                  <th className="text-left text-body-xs font-semibold text-ink-600 dark:text-ink-300 px-3 py-2">
                    Decision
                  </th>
                  <th className="text-left text-body-xs font-semibold text-ink-600 dark:text-ink-300 px-3 py-2">
                    Decided
                  </th>
                </tr>
              </thead>
              <tbody>
                {asks.recentlySigned.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-ink-100 dark:border-ink-800 last:border-0"
                  >
                    <td className="px-3 py-2 font-mono text-body-xs text-ink-500 dark:text-ink-400">{s.id}</td>
                    <td className="px-3 py-2 text-ink-500">{s.submitted}</td>
                    <td className="px-3 py-2">{s.decision}</td>
                    <td className="px-3 py-2 text-ink-500">
                      {s.decidedBy} · {s.decidedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </details>
      )}
    </Stack>
  );
}
