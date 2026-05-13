import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Layers,
  LineChart,
  Mail,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { FlowMark } from "@/components/FlowLogo";

export const dynamic = "force-static";

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16 space-y-20">
      <Hero />
      <Pods />
      <CorePack />
      <Surfaces />
      <Roadmap />
      <CTA />
    </div>
  );
}

function Hero() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 text-label-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
        <FlowMark className="w-4 h-4" size={16} />
        <span>Flow</span>
        <span className="text-ink-300 dark:text-ink-600">/</span>
        <span>Multi-agent commercial agency</span>
      </div>
      <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 leading-[1.05]">
        A white-label multi-agent
        <br />
        <span className="text-accent">marketing, sales, and CRM</span> agency.
      </h1>
      <p className="text-lg lg:text-xl text-ink-600 dark:text-ink-300 max-w-3xl leading-relaxed">
        Run your agency on a polyphonic AI team that plans, executes, and reviews every commercial brief for every client you serve. Three pods — marketing, sales, CRM — orchestrated by a Chief Commercial Officer agent. Snap on industry packs when a vertical needs specialist depth.
      </p>
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          href="/cco"
          className="inline-flex items-center gap-2 rounded-md bg-accent text-accent-fg px-4 py-2.5 text-body-sm font-medium hover:bg-accent-600 transition-colors"
        >
          See the CCO daily surface
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/agents"
          className="inline-flex items-center gap-2 rounded-md border border-ink-200 dark:border-ink-800 px-4 py-2.5 text-body-sm font-medium text-ink-800 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-ink-900 transition-colors"
        >
          Browse the agent team
        </Link>
        <Link
          href="/clients"
          className="inline-flex items-center gap-2 rounded-md border border-ink-200 dark:border-ink-800 px-4 py-2.5 text-body-sm font-medium text-ink-800 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-ink-900 transition-colors"
        >
          Open a client workspace
        </Link>
      </div>
    </section>
  );
}

function Pods() {
  const pods = [
    {
      icon: <Megaphone className="w-5 h-5" />,
      title: "Marketing pod",
      manager: "marketing-manager",
      blurb:
        "Strategy, research, creative, brand-design, SEO, social, email-lifecycle, analytics, content & PR, martech-ops. Briefs in, campaigns out, results learned.",
      count: 10,
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Sales pod",
      manager: "sales-manager",
      blurb:
        "SDR outbound, inbound qualification, account-executive discovery, proposals, account-management, forecasting, deal-desk on non-standard structures.",
      count: 7,
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "CRM pod",
      manager: "crm-manager",
      blurb:
        "Lifecycle email, voice-of-customer mining, service-recovery, data-quality stewardship. Owns retention, expansion, churn-save.",
      count: 4,
    },
  ];
  return (
    <section className="space-y-6">
      <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight">The core team — three pods, one CCO</h2>
      <p className="text-body text-ink-600 dark:text-ink-300 max-w-3xl">
        Every Flow deployment ships with the core team. Orchestration runs top-down through a <code className="font-mono text-body-xs bg-ink-100 dark:bg-ink-800 px-1.5 py-0.5 rounded">chief-commercial-officer</code> agent and three pod managers. Specialists report to their pod manager; cross-pod work escalates to the CCO.
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        {pods.map((p) => (
          <div
            key={p.title}
            className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 space-y-3 shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-accent-50 dark:bg-accent-950/40 text-accent">
                {p.icon}
              </span>
              <span className="text-label-xs font-mono text-ink-400 tabular-nums">
                {p.count} agents
              </span>
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
            <p className="text-body-sm text-ink-600 dark:text-ink-300">{p.blurb}</p>
            <div className="pt-1 text-label-xs font-mono text-ink-500 dark:text-ink-400">
              manager: {p.manager}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CorePack() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight">Core + industry packs</h2>
      <p className="text-body text-ink-600 dark:text-ink-300 max-w-3xl">
        The marketing/sales/CRM core is universal. Industry packs snap on per client to add the specialist agents, skills, and runbooks that a vertical demands — without bloating the deployment for clients that don't need them.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-6 space-y-3 shadow-card">
          <div className="inline-flex items-center gap-2 text-label-xs font-mono uppercase tracking-wider text-accent">
            <Layers className="w-3.5 h-3.5" />
            Core (always on)
          </div>
          <h3 className="text-xl font-semibold tracking-tight">Marketing · Sales · CRM</h3>
          <ul className="text-body-sm text-ink-600 dark:text-ink-300 space-y-1.5">
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>21 pod specialists across the three commercial pods</span></li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>CCO daily cadence: morning brief, decisions queue, risk register, horizon scan, calendar</span></li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>Cross-cutting: review · compliance · competitive-intel · localization · knowledge · project-manager</span></li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>Integrations tier system (read-only → autonomous) with per-client approval gates</span></li>
          </ul>
        </div>
        <div className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-6 space-y-3 shadow-card">
          <div className="inline-flex items-center gap-2 text-label-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
            <Building2 className="w-3.5 h-3.5" />
            Pack — real-estate-uae
          </div>
          <h3 className="text-xl font-semibold tracking-tight">UAE master-developer pack</h3>
          <ul className="text-body-sm text-ink-600 dark:text-ink-300 space-y-1.5">
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>Channels: broker-enablement, wealth-channel, VVIP, VIP-concierge (managed by <code className="font-mono text-body-xs">wealth-vvip-manager</code>)</span></li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>Regulatory + compliance: DLD / RERA / ADREC / CBUAE / AML-KYC / legal-liaison</span></li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>Inventory, deal-desk, secondary-market, events, marketing-procurement, data-room-curator</span></li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>12 framework skills loaded with the pack (off-plan launch, payment plans, VVIP protocol, etc.)</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Surfaces() {
  const surfaces = [
    { href: "/cco", label: "CCO daily", icon: <Sparkles className="w-4 h-4" />, blurb: "Morning brief, decisions, risks, horizon, calendar — the human CCO's first artifact of the day." },
    { href: "/agents", label: "Agent directory", icon: <Users className="w-4 h-4" />, blurb: "The full team, grouped by core pod and active industry pack." },
    { href: "/clients", label: "Client workspaces", icon: <Building2 className="w-4 h-4" />, blurb: "Per-client knowledge, campaigns, pipeline, and approval queues — your buyer's evidence file." },
    { href: "/launches", label: "Launches", icon: <LineChart className="w-4 h-4" />, blurb: "Live launch readiness across channel mix, finance, events, and broker ecosystem." },
    { href: "/approvals", label: "Approvals", icon: <ShieldCheck className="w-4 h-4" />, blurb: "Every external write routed through human approval until per-client policy promotes it." },
  ];
  return (
    <section className="space-y-6">
      <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight">Operator surfaces</h2>
      <p className="text-body text-ink-600 dark:text-ink-300 max-w-3xl">
        Built to be opened in front of the buyer. The surfaces are written in the buyer's language, not Flow's — what your end-client sees is their agency.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {surfaces.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 hover:border-accent/40 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-2 text-body-sm font-semibold text-ink-800 dark:text-ink-100">
                <span className="text-accent">{s.icon}</span>
                {s.label}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-ink-400 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-body-xs text-ink-600 dark:text-ink-300">{s.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Roadmap() {
  const packs = [
    { name: "real-estate-uae", state: "Shipping", note: "Master-developer engagements (Aldar / Emaar / Damac / Sobha class)" },
    { name: "auto-retail", state: "Next", note: "Dealer-network enablement, F&I desk, test-drive orchestration" },
    { name: "professional-services", state: "Roadmap", note: "Proposal-led sales, partner-managed funnels, fee-realization" },
    { name: "f-and-b-multi-unit", state: "Roadmap", note: "Local-marketing, loyalty, franchisee enablement" },
    { name: "b2b-saas", state: "Roadmap", note: "PLG instrumentation, expansion motions, usage-driven CRM" },
  ];
  return (
    <section className="space-y-6">
      <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight">Industry-pack roadmap</h2>
      <div className="rounded-card border border-ink-200/70 dark:border-ink-800 overflow-hidden">
        <table className="w-full text-body-sm">
          <thead className="bg-ink-50 dark:bg-ink-950/60 text-ink-600 dark:text-ink-300 text-left">
            <tr>
              <th className="px-4 py-2.5 font-medium">Pack</th>
              <th className="px-4 py-2.5 font-medium">State</th>
              <th className="px-4 py-2.5 font-medium">Scope</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
            {packs.map((p) => (
              <tr key={p.name} className="bg-white dark:bg-ink-900">
                <td className="px-4 py-2.5 font-mono text-body-xs">{p.name}</td>
                <td className="px-4 py-2.5">
                  <span
                    className={
                      p.state === "Shipping"
                        ? "inline-flex items-center gap-1 rounded-full bg-accent-50 dark:bg-accent-950/40 text-accent px-2 py-0.5 text-label-xs font-medium"
                        : p.state === "Next"
                          ? "inline-flex items-center gap-1 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200 px-2 py-0.5 text-label-xs font-medium"
                          : "inline-flex items-center gap-1 rounded-full border border-dashed border-ink-300 dark:border-ink-700 text-ink-500 px-2 py-0.5 text-label-xs"
                    }
                  >
                    {p.state}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-ink-600 dark:text-ink-300">{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-gradient-to-br from-white to-accent-50/30 dark:from-ink-900 dark:to-accent-950/30 p-8 lg:p-10 space-y-4">
      <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight">Run your agency on Flow.</h2>
      <p className="text-body text-ink-600 dark:text-ink-300 max-w-2xl">
        Bring your client roster. We bring the multi-agent commercial team, the daily cadence, and the operator surfaces. Onboard the first client in a 30-minute session — pick the pack, seed the profile, hand the team a goal.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/new-client"
          className="inline-flex items-center gap-2 rounded-md bg-accent text-accent-fg px-4 py-2.5 text-body-sm font-medium hover:bg-accent-600 transition-colors"
        >
          Onboard a new client
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/cco"
          className="inline-flex items-center gap-2 rounded-md border border-ink-200 dark:border-ink-800 px-4 py-2.5 text-body-sm font-medium text-ink-800 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-ink-900 transition-colors"
        >
          Walk through the Aldar demo
        </Link>
      </div>
    </section>
  );
}
