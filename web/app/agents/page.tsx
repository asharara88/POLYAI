import { Card } from "@/components/Card";
import { getAgents } from "@/lib/content";

type GroupKind = "core" | "pack" | "cross-cutting";

const groups: {
  label: string;
  blurb?: string;
  kind: GroupKind;
  pack?: string;
  match: (name: string) => boolean;
}[] = [
  {
    label: "Orchestration",
    blurb:
      "C-level orchestrator and the daily-cadence loop that turns pod output into a single CCO surface.",
    kind: "core",
    match: (n) =>
      [
        "chief-commercial-officer",
        "client-onboarding",
        "cco-morning-brief",
        "horizon-scanner",
        "risk-register-curator",
        "decision-router",
      ].includes(n),
  },
  {
    label: "Pod managers",
    blurb: "Manager tier between the CCO and pod specialists. Route, escalate, run the pod cadence.",
    kind: "core",
    match: (n) =>
      ["marketing-manager", "sales-manager", "crm-manager", "wealth-vvip-manager"].includes(n),
  },
  {
    label: "Marketing pod",
    blurb: "Strategy → creative → channel execution → analytics. Managed by marketing-manager.",
    kind: "core",
    match: (n) =>
      [
        "strategy",
        "research",
        "creative",
        "brand-design",
        "seo",
        "social-media",
        "email-lifecycle",
        "analytics",
        "content-pr-specialist",
        "martech-ops-specialist",
      ].includes(n),
  },
  {
    label: "Sales pod",
    blurb: "Outbound + inbound + AE + proposal + AM + forecast. Managed by sales-manager.",
    kind: "core",
    match: (n) =>
      [
        "sdr",
        "inbound-qualifier",
        "account-executive",
        "proposal",
        "account-manager",
        "forecasting",
        "deal-desk-analyst",
      ].includes(n),
  },
  {
    label: "CRM pod",
    blurb: "Lifecycle, VOC, retention, service-recovery, data hygiene. Managed by crm-manager.",
    kind: "core",
    match: (n) =>
      ["voc", "service-recovery-specialist", "data-quality-steward"].includes(n),
  },
  {
    label: "Business development",
    blurb: "Partner identification, co-marketing, co-sell motions.",
    kind: "core",
    match: (n) => n === "partnerships",
  },
  {
    label: "Cross-cutting",
    blurb: "Used by every pod and every pack. Gating, memory, intel, and project tracking.",
    kind: "cross-cutting",
    match: (n) =>
      [
        "review",
        "compliance",
        "competitive-intel",
        "localization",
        "knowledge",
        "project-manager",
      ].includes(n),
  },
  {
    label: "Pack — real-estate-uae · Channels",
    blurb:
      "Broker, wealth, VVIP-protocol, VIP-concierge channel agents. Active only for clients on the real-estate-uae pack.",
    kind: "pack",
    pack: "real-estate-uae",
    match: (n) =>
      [
        "broker-enablement",
        "wealth-channel-enablement",
        "vvip-channel-enablement",
        "vip-relationship-manager",
        "agency-liaison",
      ].includes(n),
  },
  {
    label: "Pack — real-estate-uae · Inventory & commercial structure",
    blurb: "Inventory truth, non-standard commercial structures, secondary-market resale.",
    kind: "pack",
    pack: "real-estate-uae",
    match: (n) =>
      ["inventory-manager", "secondary-market-specialist"].includes(n),
  },
  {
    label: "Pack — real-estate-uae · Regulatory, compliance & legal",
    blurb: "DLD / RERA / ADREC / CBUAE / AML-KYC / panel-counsel interface.",
    kind: "pack",
    pack: "real-estate-uae",
    match: (n) =>
      [
        "regulatory-research-specialist",
        "aml-kyc-compliance-specialist",
        "legal-liaison",
      ].includes(n),
  },
  {
    label: "Pack — real-estate-uae · Events, procurement & finance",
    blurb: "Sales-gallery launches, vendor procurement, marketing-budget governance, data-room curation.",
    kind: "pack",
    pack: "real-estate-uae",
    match: (n) =>
      [
        "events",
        "marketing-procurement",
        "marketing-financial-manager",
        "data-room-curator",
      ].includes(n),
  },
];

const KIND_STYLES: Record<GroupKind, { chip: string; label: string }> = {
  core: {
    chip:
      "inline-flex items-center gap-1 rounded-full bg-accent-50 dark:bg-accent-950/40 text-accent px-2 py-0.5 text-label-xs font-medium",
    label: "Core",
  },
  "cross-cutting": {
    chip:
      "inline-flex items-center gap-1 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200 px-2 py-0.5 text-label-xs font-medium",
    label: "Cross-cutting",
  },
  pack: {
    chip:
      "inline-flex items-center gap-1 rounded-full border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-300 px-2 py-0.5 text-label-xs",
    label: "Pack",
  },
};

export default function Page() {
  const agents = getAgents();

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Agent team</h1>
        <p className="text-ink-600 dark:text-ink-300 max-w-3xl">
          Flow ships a universal marketing/sales/CRM core that every deployment runs. Industry packs add specialist agents per client — they're activated by the client&apos;s <code className="font-mono text-body-xs bg-ink-100 dark:bg-ink-800 px-1 py-0.5 rounded">pack</code> field and stay dormant otherwise. Briefs flow between agents via structured handoffs (see{" "}
          <a href="/schemas" className="text-accent hover:underline">schemas</a>).
        </p>
      </header>

      {groups.map((g) => {
        const matched = agents.filter((a) => g.match(a.name));
        if (matched.length === 0) return null;
        const style = KIND_STYLES[g.kind];
        return (
          <section key={g.label}>
            <div className="flex items-baseline gap-3 mb-1">
              <h2 className="text-sm font-mono uppercase tracking-wider text-ink-500 dark:text-ink-300">
                {g.label}
              </h2>
              <span className={style.chip}>{style.label}</span>
            </div>
            {g.blurb && (
              <p className="text-body-sm text-ink-500 dark:text-ink-400 mb-3 max-w-3xl">{g.blurb}</p>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {matched.map((a) => (
                <Card
                  key={a.name}
                  href={`/agents/${a.name}`}
                  title={a.name}
                  subtitle={a.description}
                  meta={a.model}
                />
              ))}
            </div>
          </section>
        );
      })}

      {(() => {
        const known = new Set(agents.flatMap((a) => (groups.some((g) => g.match(a.name)) ? [a.name] : [])));
        const ungrouped = agents.filter((a) => !known.has(a.name));
        if (ungrouped.length === 0) return null;
        return (
          <section>
            <h2 className="text-sm font-mono uppercase tracking-wider text-ink-500 dark:text-ink-300 mb-3">
              Other
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ungrouped.map((a) => (
                <Card key={a.name} href={`/agents/${a.name}`} title={a.name} subtitle={a.description} meta={a.model} />
              ))}
            </div>
          </section>
        );
      })()}
    </div>
  );
}
