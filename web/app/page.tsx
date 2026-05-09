import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { FlowMark } from "@/components/FlowLogo";
import HomeCTAs from "@/components/HomeCTAs";
import { getClients, getDecisionAsks } from "@/lib/content";

export default function Page() {
  const clients = getClients().filter((c) => !c.isTemplate);
  const totalPending = clients.reduce((acc, c) => {
    const asks = getDecisionAsks(c.slug);
    return acc + (asks?.pending.length ?? 0);
  }, 0);
  const activeClients = clients.length;

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

      <HomeCTAs pendingCount={totalPending} workspaceCount={activeClients} />

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
