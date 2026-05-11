"use client";

import type { ParsedRiskRegister, ParsedRiskEntry } from "@/lib/content";
import { statusKey } from "@/lib/design-tokens";
import {
  Section,
  SectionHeader,
  Stack,
  Card,
  ClassBadge,
  SeverityBadge,
  StatusPill,
} from "@/components/ui";
import { AlertOctagon, AlertTriangle, ShieldCheck, Eye } from "lucide-react";
import { useIdentity } from "@/lib/identity";
import { inScope, scopeFor } from "@/lib/role-scope";
import { useCcoDedupe } from "@/lib/cco-dedupe-context";

const STATUS_BORDER: Record<string, string> = {
  red: "border-l-4 border-l-danger-500",
  amber: "border-l-4 border-l-warning-500",
  green: "border-l-4 border-l-success-500",
  neutral: "border-l-4 border-l-ink-300",
};

function RiskCard({ risk }: { risk: ParsedRiskEntry }) {
  const sk = statusKey(risk.status);
  return (
    <div
      className={[
        "rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 space-y-2 shadow-card",
        STATUS_BORDER[sk],
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="font-semibold text-body leading-snug min-w-0">{risk.title}</div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <ClassBadge value={risk.class} />
          <SeverityBadge value={risk.severity} />
          <StatusPill status={risk.status} ageDays={risk.ageDays} />
        </div>
      </div>
      <p className="text-body-sm text-ink-700 dark:text-ink-300 leading-relaxed">
        {risk.description}
      </p>
      {risk.currentMitigation && (
        <div className="text-body-xs text-ink-600 dark:text-ink-400">
          <span className="font-semibold text-ink-700 dark:text-ink-200 mr-1">
            What we're doing:
          </span>
          {risk.currentMitigation}
        </div>
      )}
      {risk.escalationThreshold && (
        <div className="text-body-xs text-ink-600 dark:text-ink-400">
          <span className="font-semibold text-ink-700 dark:text-ink-200 mr-1">
            Escalates if:
          </span>
          {risk.escalationThreshold}
        </div>
      )}
      <div className="text-body-xs text-ink-500 dark:text-ink-400 pt-1.5 border-t border-ink-100 dark:border-ink-800/80 flex flex-wrap gap-x-3 gap-y-0.5">
        {risk.ownerHuman && <span>Owner: {risk.ownerHuman}</span>}
        {risk.opened && <span>· Opened {risk.opened}</span>}
        {risk.lastReviewed && <span>· Reviewed {risk.lastReviewed}</span>}
      </div>
    </div>
  );
}

export default function RiskRegister({ register }: { register: ParsedRiskRegister }) {
  const { identity, hydrated } = useIdentity();
  const scope = scopeFor(identity?.role ?? "cco", identity?.agentSlug);
  const { excluded } = useCcoDedupe();
  const scopedOpen = !hydrated || scope.seesAll
    ? register.open
    : register.open.filter((r) => inScope(scope, r.class ?? ""));
  // Dedupe: drop the risk that CcoNow already surfaced
  const visible = scopedOpen.filter((r) => !excluded.risk.has(r.title));
  const reds = visible.filter((r) => statusKey(r.status) === "red");
  const ambers = visible.filter((r) => statusKey(r.status) === "amber");
  const greens = visible.filter((r) => statusKey(r.status) === "green");

  return (
    <Stack gap="6">
      <Section
        title="Risks to watch"
        description={
          reds.length > 0
            ? `${reds.length} need attention · ${ambers.length} watching · ${greens.length} on track`
            : ambers.length > 0
              ? `${ambers.length} watching · ${greens.length} on track`
              : `${greens.length} on track`
        }
        meta={<span>updated {register.lastUpdated ?? "—"}</span>}
      >
        <Stack gap="6">
          {reds.length > 0 && (
            <section>
              <SectionHeader tone="danger">
                <span className="inline-flex items-center gap-1.5 normal-case tracking-normal">
                  <AlertOctagon className="w-3.5 h-3.5" aria-hidden />
                  Need attention now
                </span>
              </SectionHeader>
              <Stack gap="3">
                {reds.map((r) => (
                  <RiskCard key={r.title} risk={r} />
                ))}
              </Stack>
            </section>
          )}
          {ambers.length > 0 && (
            <section>
              <SectionHeader tone="warning">
                <span className="inline-flex items-center gap-1.5 normal-case tracking-normal">
                  <AlertTriangle className="w-3.5 h-3.5" aria-hidden />
                  Watching
                </span>
              </SectionHeader>
              <Stack gap="3">
                {ambers.map((r) => (
                  <RiskCard key={r.title} risk={r} />
                ))}
              </Stack>
            </section>
          )}
          {greens.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer list-none inline-flex items-center gap-1.5 text-body-sm text-success-600 dark:text-success-400 hover:text-success-700 dark:hover:text-success-300 transition-colors">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
                <span>{greens.length} on track</span>
                <span className="text-ink-400 group-open:hidden">· show</span>
                <span className="text-ink-400 hidden group-open:inline">· hide</span>
              </summary>
              <Stack gap="3" className="mt-3">
                {greens.map((r) => (
                  <RiskCard key={r.title} risk={r} />
                ))}
              </Stack>
            </details>
          )}
        </Stack>
      </Section>

      {register.watchlist.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer list-none inline-flex items-center gap-1.5 text-body-sm text-ink-500 hover:text-ink-700 dark:hover:text-ink-200 transition-colors">
            <Eye className="w-3.5 h-3.5" aria-hidden />
            <span>{register.watchlist.length} on the watchlist</span>
            <span className="text-ink-400 group-open:hidden">· show</span>
            <span className="text-ink-400 hidden group-open:inline">· hide</span>
          </summary>
          <Card padded={false} className="mt-3">
            <ul className="px-4 py-3 text-body-sm text-ink-600 dark:text-ink-300 space-y-1.5">
              {register.watchlist.map((w, i) => (
                <li key={i} className="leading-snug">
                  {w}
                </li>
              ))}
            </ul>
          </Card>
        </details>
      )}
    </Stack>
  );
}
