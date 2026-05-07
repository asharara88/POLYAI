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
          <span className="font-mono uppercase tracking-wider text-label-xs text-ink-400 mr-1">
            mitigation
          </span>
          {risk.currentMitigation}
        </div>
      )}
      {risk.escalationThreshold && (
        <div className="text-body-xs text-ink-600 dark:text-ink-400">
          <span className="font-mono uppercase tracking-wider text-label-xs text-ink-400 mr-1">
            threshold
          </span>
          {risk.escalationThreshold}
        </div>
      )}
      <div className="text-label-xs font-mono text-ink-400 pt-1.5 border-t border-ink-100 dark:border-ink-800/80 flex flex-wrap gap-x-3 gap-y-0.5">
        {risk.ownerAgent && <span>agent: {risk.ownerAgent}</span>}
        {risk.ownerHuman && <span>human: {risk.ownerHuman}</span>}
        {risk.opened && <span>opened: {risk.opened}</span>}
        {risk.lastReviewed && <span>reviewed: {risk.lastReviewed}</span>}
      </div>
    </div>
  );
}

export default function RiskRegister({ register }: { register: ParsedRiskRegister }) {
  const reds = register.open.filter((r) => statusKey(r.status) === "red");
  const ambers = register.open.filter((r) => statusKey(r.status) === "amber");
  const greens = register.open.filter((r) => statusKey(r.status) === "green");

  return (
    <Stack gap="6">
      <Section
        title="Risk register"
        description={`${reds.length} red · ${ambers.length} amber · ${greens.length} green`}
        meta={<span>updated {register.lastUpdated ?? "—"}</span>}
      >
        <Stack gap="6">
          {reds.length > 0 && (
            <section>
              <SectionHeader tone="danger">
                <span className="inline-flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5" aria-hidden />
                  Red — escalation triggered
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
                <span className="inline-flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" aria-hidden />
                  Amber — actively monitored
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
            <section>
              <SectionHeader tone="success">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
                  Green — mitigation in place
                </span>
              </SectionHeader>
              <Stack gap="3">
                {greens.map((r) => (
                  <RiskCard key={r.title} risk={r} />
                ))}
              </Stack>
            </section>
          )}
        </Stack>
      </Section>

      {register.watchlist.length > 0 && (
        <section>
          <SectionHeader>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" aria-hidden />
              Watchlist (not yet a risk)
            </span>
          </SectionHeader>
          <Card padded={false}>
            <ul className="px-4 py-3 text-body-sm text-ink-600 dark:text-ink-400 space-y-1.5">
              {register.watchlist.map((w, i) => (
                <li key={i} className="leading-snug">
                  {w}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </Stack>
  );
}
