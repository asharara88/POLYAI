import type { ParsedRiskRegister, ParsedRiskEntry } from "@/lib/content";

const STATUS_TONE: Record<string, string> = {
  red: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/60",
  amber:
    "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60",
  green:
    "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60",
};

const SEVERITY_TONE: Record<string, string> = {
  material:
    "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300",
  significant:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
  minor:
    "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300",
};

const CLASS_BADGE: Record<string, string> = {
  commercial: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300",
  regulatory: "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300",
  reputational: "bg-pink-100 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300",
  operational: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300",
  counterparty: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300",
};

function statusKey(status: string): "red" | "amber" | "green" {
  const s = status.toLowerCase();
  if (s.includes("red")) return "red";
  if (s.includes("amber")) return "amber";
  return "green";
}

function severityKey(severity: string): "material" | "significant" | "minor" {
  const s = severity.toLowerCase();
  if (s.includes("material")) return "material";
  if (s.includes("significant")) return "significant";
  return "minor";
}

function RiskCard({ risk }: { risk: ParsedRiskEntry }) {
  const sk = statusKey(risk.status);
  const sevK = severityKey(risk.severity);
  const classBadge = CLASS_BADGE[risk.class.toLowerCase()] ?? "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300";
  return (
    <div className={`rounded-md border ${STATUS_TONE[sk]} p-4 space-y-2`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="font-semibold text-sm leading-snug">{risk.title}</div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${classBadge}`}>
            {risk.class}
          </span>
          <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${SEVERITY_TONE[sevK]}`}>
            {risk.severity}
          </span>
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border border-current">
            {sk} · {risk.ageDays ?? "—"}d
          </span>
        </div>
      </div>
      <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">{risk.description}</p>
      {risk.currentMitigation && (
        <div className="text-xs text-ink-600 dark:text-ink-400">
          <span className="font-mono uppercase tracking-wider text-[10px] text-ink-400">mitigation</span>{" "}
          {risk.currentMitigation}
        </div>
      )}
      {risk.escalationThreshold && (
        <div className="text-xs text-ink-600 dark:text-ink-400">
          <span className="font-mono uppercase tracking-wider text-[10px] text-ink-400">threshold</span>{" "}
          {risk.escalationThreshold}
        </div>
      )}
      <div className="text-[11px] font-mono text-ink-400 pt-1 border-t border-current/10 flex flex-wrap gap-x-3">
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
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Risk register</h2>
          <p className="text-xs text-ink-500 mt-0.5">
            {reds.length} red · {ambers.length} amber · {greens.length} green
          </p>
        </div>
        <div className="text-xs font-mono text-ink-400">
          updated {register.lastUpdated ?? "—"}
        </div>
      </div>

      {reds.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-red-600 dark:text-red-400 mb-3">
            Red — escalation triggered
          </h3>
          <div className="space-y-3">
            {reds.map((r) => (
              <RiskCard key={r.title} risk={r} />
            ))}
          </div>
        </section>
      )}

      {ambers.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3">
            Amber — actively monitored
          </h3>
          <div className="space-y-3">
            {ambers.map((r) => (
              <RiskCard key={r.title} risk={r} />
            ))}
          </div>
        </section>
      )}

      {greens.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
            Green — mitigation in place
          </h3>
          <div className="space-y-3">
            {greens.map((r) => (
              <RiskCard key={r.title} risk={r} />
            ))}
          </div>
        </section>
      )}

      {register.watchlist.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-500 mb-2">
            Watchlist (not yet a risk)
          </h3>
          <ul className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 px-4 py-3 text-sm text-ink-600 dark:text-ink-400 space-y-1.5">
            {register.watchlist.map((w, i) => (
              <li key={i} className="leading-snug">{w}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
