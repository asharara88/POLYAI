import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
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
      <PackScope />
      <Surfaces />
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
        <span>CCO operating system for UAE developers</span>
      </div>
      <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight text-ink-950 dark:text-ink-50 leading-[1.05]">
        The CCO operating system
        <br />
        for <span className="text-accent">UAE real-estate developers</span>.
      </h1>
      <p className="text-lg lg:text-xl text-ink-600 dark:text-ink-300 max-w-3xl leading-relaxed">
        The morning brief, the decisions queue, the launch tracker, the broker / wealth / VVIP channel surfaces — run by a multi-agent commercial team that knows DLD, RERA, ADREC, off-plan launch mechanics, and the UAE buyer corridors. One coherent dashboard for the Chief Commercial Officer and their commercial pods.
      </p>
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          href="/cco"
          className="inline-flex items-center gap-2 rounded-md bg-accent text-accent-fg px-4 py-2.5 text-body-sm font-medium hover:bg-accent-600 transition-colors"
        >
          Open the CCO morning brief
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/launches"
          className="inline-flex items-center gap-2 rounded-md border border-ink-200 dark:border-ink-800 px-4 py-2.5 text-body-sm font-medium text-ink-800 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-ink-900 transition-colors"
        >
          See live launches
        </Link>
        <Link
          href="/clients/uae-developments"
          className="inline-flex items-center gap-2 rounded-md border border-ink-200 dark:border-ink-800 px-4 py-2.5 text-body-sm font-medium text-ink-800 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-ink-900 transition-colors"
        >
          Tour the workspace
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
      count: 13,
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Sales pod",
      manager: "sales-manager",
      blurb:
        "SDR outbound, inbound qualification, account-executive discovery, proposals, account-management, forecasting, deal-desk on non-standard structures, secondary-market specialist.",
      count: 8,
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "CRM pod",
      manager: "crm-manager",
      blurb:
        "Lifecycle email, voice-of-customer mining, service-recovery, data-quality stewardship. Owns retention, expansion, churn-save.",
      count: 4,
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Wealth · VVIP pod",
      manager: "wealth-vvip-manager",
      blurb:
        "Broker-enablement, wealth-channel-enablement, VVIP-channel-enablement, VIP relationship management, AML/KYC compliance. The discretion-led channels.",
      count: 5,
    },
  ];
  return (
    <section className="space-y-6">
      <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight">Four pods, one CCO</h2>
      <p className="text-body text-ink-600 dark:text-ink-300 max-w-3xl">
        Orchestration runs top-down through a <code className="font-mono text-body-xs bg-ink-100 dark:bg-ink-800 px-1.5 py-0.5 rounded">chief-commercial-officer</code> agent and four pod managers. Specialists report to their pod manager; cross-pod work escalates to the CCO. A morning brief synthesizes the entire team's overnight signal before the human CCO opens their laptop.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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

function PackScope() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight">What the team knows about UAE real-estate</h2>
      <p className="text-body text-ink-600 dark:text-ink-300 max-w-3xl">
        Flow is purpose-built for UAE developer engagements. The agents, runbooks, and skills are grounded in the regulatory and channel realities of the market — not retrofitted from a generic CRM template.
      </p>
      <div className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-6 space-y-3 shadow-card">
        <div className="inline-flex items-center gap-2 text-label-xs font-mono uppercase tracking-wider text-accent">
          <Building2 className="w-3.5 h-3.5" />
          Pack — real-estate-uae
        </div>
        <h3 className="text-xl font-semibold tracking-tight">UAE master-developer scope</h3>
        <ul className="text-body-sm text-ink-600 dark:text-ink-300 space-y-1.5 grid sm:grid-cols-2 gap-x-6">
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>Channels: broker-enablement, wealth-channel, VVIP, VIP-concierge — tier-aware allocations</span></li>
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>Regulatory: DLD / RERA / ADREC / CBUAE / PDPL / AML-KYC / Trakheesi / Oqood</span></li>
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>Launch mechanics: off-plan, pre-launch, public-launch, handover phases with broker + wealth + VVIP slates</span></li>
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>Inventory, deal-desk, secondary-market, events, marketing-procurement, data-room curation</span></li>
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>Buyer corridors: GCC investor, diaspora (IN / RU / GB / EG), AD-resident end-user upgrade</span></li>
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" /><span>25 operational runbooks covering RERA exposure, broker-collapse, handover-snagging, board prep</span></li>
        </ul>
      </div>
    </section>
  );
}

function Surfaces() {
  const surfaces = [
    { href: "/cco", label: "CCO daily", icon: <Sparkles className="w-4 h-4" />, blurb: "Morning brief, decisions, risks, horizon, calendar — the human CCO's first artifact of the day." },
    { href: "/launches", label: "Launches", icon: <LineChart className="w-4 h-4" />, blurb: "Live launch readiness across channel mix, finance, events, and broker ecosystem." },
    { href: "/clients/uae-developments", label: "Workspace", icon: <Building2 className="w-4 h-4" />, blurb: "Profile, ICP, voice, brokers, wealth, VVIP, inventory, campaigns — the operator's evidence file." },
    { href: "/approvals", label: "Decisions", icon: <ShieldCheck className="w-4 h-4" />, blurb: "Every external write routed through human approval until policy promotes it." },
    { href: "/agents", label: "Agent team", icon: <Users className="w-4 h-4" />, blurb: "The full team, grouped by pod, with hand-off matrices and runbook ownership." },
  ];
  return (
    <section className="space-y-6">
      <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight">Primary surfaces</h2>
      <p className="text-body text-ink-600 dark:text-ink-300 max-w-3xl">
        Five surfaces cover the CCO's day. Each is written in the operator's language and intended to be opened in front of the desk it serves.
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

function CTA() {
  return (
    <section className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-gradient-to-br from-white to-accent-50/30 dark:from-ink-900 dark:to-accent-950/30 p-8 lg:p-10 space-y-4">
      <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight">Walk the workspace.</h2>
      <p className="text-body text-ink-600 dark:text-ink-300 max-w-2xl">
        The demo workspace is a worked example of a UAE master-developer engagement — five emirates, 250-firm broker network, parallel wealth and VVIP channels, an active Q3 tower launch. Open the morning brief, then click through the launch.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/cco"
          className="inline-flex items-center gap-2 rounded-md bg-accent text-accent-fg px-4 py-2.5 text-body-sm font-medium hover:bg-accent-600 transition-colors"
        >
          Start with the morning brief
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/launches"
          className="inline-flex items-center gap-2 rounded-md border border-ink-200 dark:border-ink-800 px-4 py-2.5 text-body-sm font-medium text-ink-800 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-ink-900 transition-colors"
        >
          Walk through the Q3 launch
        </Link>
      </div>
    </section>
  );
}
