import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";
import { FlowMark } from "@/components/FlowLogo";
import { getClients, getDecisionAsks } from "@/lib/content";

type CTA = {
  href: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  hint?: string;
};

export default function Page() {
  const clients = getClients().filter((c) => !c.isTemplate);
  const totalPending = clients.reduce((acc, c) => {
    const asks = getDecisionAsks(c.slug);
    return acc + (asks?.pending.length ?? 0);
  }, 0);
  const activeClients = clients.length;

  const ctas: CTA[] = [
    {
      href: "/cco",
      icon: <Sparkles className="w-6 h-6" aria-hidden />,
      title: "Today",
      body: "What needs you today — your morning brief, key risks, and what's new.",
      hint: "Start here every morning",
    },
    {
      href: "/approvals",
      icon: <CheckCircle2 className="w-6 h-6" aria-hidden />,
      title: "Decisions",
      body: "Sign or send back the decisions waiting on you.",
      hint:
        totalPending > 0
          ? `${totalPending} waiting on you`
          : "All caught up",
    },
    {
      href: "/clients",
      icon: <Building2 className="w-6 h-6" aria-hidden />,
      title: "Clients",
      body: "Open a client workspace — pipeline, channels, events, and more.",
      hint:
        activeClients > 0
          ? `${activeClients} ${activeClients === 1 ? "client" : "clients"}`
          : undefined,
    },
  ];

  return (
    <div className="space-y-10">
      <section className="flex items-start gap-4 flex-wrap">
        <span className="text-accent flex-shrink-0 mt-1">
          <FlowMark size={56} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-label-xs font-medium tracking-wider text-accent uppercase">
            AI-driven solutions
          </div>
          <h1 className="text-display-lg font-semibold tracking-tight mt-1">
            Welcome to Flow
          </h1>
          <p className="text-body-lg text-ink-600 dark:text-ink-300 mt-3 max-w-2xl leading-relaxed">
            Your commercial control plane. Decide what matters, run your day,
            and ask Flow anything — from one place.
          </p>
        </div>
      </section>

      <section
        aria-label="Primary actions"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {ctas.map((cta) => (
          <Link
            key={cta.href}
            href={cta.href}
            className="group rounded-card border border-ink-200/70 dark:border-ink-800 dark:ring-1 dark:ring-white/[0.06] bg-white dark:bg-ink-900 p-6 shadow-card hover:shadow-card-hover hover:border-accent/40 dark:hover:border-accent/40 transition-all flex flex-col gap-3"
          >
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-card bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
              {cta.icon}
            </span>
            <div>
              <h2 className="text-title font-semibold tracking-tight inline-flex items-center gap-2">
                {cta.title}
                <ArrowRight className="w-4 h-4 text-ink-300 group-hover:text-accent group-hover:translate-x-0.5 transition-all" aria-hidden />
              </h2>
              <p className="text-body-sm text-ink-600 dark:text-ink-300 mt-1.5 leading-relaxed">
                {cta.body}
              </p>
              {cta.hint && (
                <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-2">
                  {cta.hint}
                </p>
              )}
            </div>
          </Link>
        ))}
      </section>

      <section className="rounded-card border border-ink-200/70 dark:border-ink-800 dark:ring-1 dark:ring-white/[0.06] bg-ink-50/40 dark:bg-ink-950/40 p-5 sm:p-6 flex items-start gap-3">
        <MessageSquare className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden />
        <div className="flex-1 min-w-0">
          <h3 className="text-title-sm font-semibold tracking-tight">Have a question?</h3>
          <p className="text-body-sm text-ink-600 dark:text-ink-300 mt-1 leading-relaxed">
            Ask Flow anything — pipeline, risks, channel mix, or have it draft a
            brief. Try{" "}
            <Link href="/chat?q=What%20needs%20me%20today%3F" className="text-accent hover:underline">
              "What needs me today?"
            </Link>
          </p>
        </div>
        <Link
          href="/chat"
          className="text-body-sm font-medium text-accent hover:underline whitespace-nowrap inline-flex items-center gap-1"
        >
          Open Ask
          <ArrowRight className="w-3.5 h-3.5" aria-hidden />
        </Link>
      </section>
    </div>
  );
}
