"use client";

import type { ParsedDecisionAsks, DecisionAsk } from "@/lib/content";
import { useIdentity } from "@/lib/identity";
import { inScope, scopeFor } from "@/lib/role-scope";
import { useCcoDedupe } from "@/lib/cco-dedupe-context";
import { plainLanguage } from "@/lib/strip-jargon";
import SignDecisionAsk from "@/components/SignDecisionAsk";
import AskAnchor from "@/components/ask/AskAnchor";
import AskInlineThread from "@/components/ask/AskInlineThread";
import { Section, SectionHeader, Stack, Card, ClassBadge, UrgencyBadge } from "@/components/ui";
import { ChevronDown, History, Inbox } from "lucide-react";

function AskCard({
  ask,
  client,
}: {
  ask: DecisionAsk;
  client: string;
}) {
  const hasEvidence = Boolean(ask.alternatives || ask.evidence);
  const anchor = {
    kind: "decision" as const,
    id: `ask-${ask.id}`,
    label: ask.ask,
    summary: ask.recommendation ?? undefined,
  };
  return (
    <article className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card p-4 space-y-3">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <ClassBadge value={ask.className} />
            <UrgencyBadge value={ask.urgency} />
          </div>
          <h3 className="font-semibold text-body mt-1.5 leading-snug">
            {ask.ask}
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-label-xs font-mono text-ink-400 tabular-nums">
            {ask.sla}
          </span>
          <AskAnchor anchor={anchor} size="xs" />
        </div>
      </header>

      {ask.recommendation && (
        <p className="text-body-sm text-ink-700 dark:text-ink-200 leading-relaxed">
          <span className="font-semibold">Recommendation:</span>{" "}
          {plainLanguage(ask.recommendation)}
        </p>
      )}

      <SignDecisionAsk client={client} askId={ask.id} className={ask.className} />

      <AskInlineThread anchor={anchor} />

      {hasEvidence && (
        <details className="group">
          <summary className="cursor-pointer list-none inline-flex items-center gap-1 text-label-xs font-mono text-ink-500 hover:text-ink-700 dark:hover:text-ink-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded">
            <ChevronDown
              className="w-3 h-3 transition-transform group-open:rotate-180"
              aria-hidden
            />
            <span className="group-open:hidden">Show evidence</span>
            <span className="hidden group-open:inline">Hide evidence</span>
          </summary>
          <div className="mt-3 space-y-3 text-body-sm border-t border-ink-100 dark:border-ink-800 pt-3">
            {ask.alternatives && (
              <div>
                <div className="text-body-xs font-semibold text-ink-700 dark:text-ink-200 mb-0.5">
                  Alternatives considered
                </div>
                <div className="text-ink-600 dark:text-ink-400 leading-relaxed">
                  {plainLanguage(ask.alternatives)}
                </div>
              </div>
            )}
            {ask.evidence && (
              <div>
                <div className="text-body-xs font-semibold text-ink-700 dark:text-ink-200 mb-0.5">
                  Evidence
                </div>
                <div className="text-ink-600 dark:text-ink-400 leading-relaxed">
                  {plainLanguage(ask.evidence)}
                </div>
              </div>
            )}
            <div className="text-label-xs font-mono text-ink-400">
              by {ask.submitter}
            </div>
          </div>
        </details>
      )}
    </article>
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
  const { excluded } = useCcoDedupe();
  // First: scope filter. Second: dedupe (drop items already shown in CcoNow above).
  const scoped = !hydrated || scope.seesAll
    ? asks.pending
    : asks.pending.filter((a) => inScope(scope, a.className ?? ""));
  const pending = scoped.filter((a) => !excluded.ask.has(a.id));
  const inScopeCount = pending.length;
  const outOfScopeCount = asks.pending.length - inScopeCount - excluded.ask.size;
  const dedupedCount = scoped.length - pending.length;

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
            ? dedupedCount > 0
              ? `Top item shown above · ${asks.recentlySigned.length} signed in the last week`
              : scope.seesAll
                ? `All caught up · ${asks.recentlySigned.length} signed in the last week`
                : `None in your scope · ${outOfScopeCount} waiting on other pods`
            : scope.seesAll
              ? `${inScopeCount} more · ${asks.recentlySigned.length} signed in the last week`
              : `${inScopeCount} more in your scope · ${outOfScopeCount} on other pods`
        }
      >
        {inScopeCount === 0 ? (
          <Card padded className="text-center text-body-sm text-ink-500">
            {dedupedCount > 0
              ? "Top decision shown above — no others pending."
              : scope.seesAll
                ? "All caught up — no pending decisions."
                : "Nothing pending in your pod right now."}
          </Card>
        ) : (
          <Stack gap="2">
            {pending.map((a) => (
              <AskCard key={a.id} ask={a} client={client} />
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
