import Link from "next/link";
import { Card, StatCard } from "@/components/Card";
import { FlowMark } from "@/components/FlowLogo";
import { getAgents, getClients, getStats, getVerticals } from "@/lib/content";

export default function Page() {
  const stats = getStats();
  const clients = getClients();
  const agents = getAgents();
  const verticals = getVerticals();

  return (
    <div className="space-y-10">
      <section className="flex items-start gap-4 flex-wrap">
        <span className="text-accent flex-shrink-0 mt-1">
          <FlowMark size={48} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-label-xs font-mono uppercase tracking-wider text-accent">
            AI Driven Solutions
          </div>
          <h1 className="text-display font-semibold tracking-tight mt-0.5">
            Flow — control plane
          </h1>
          <p className="text-body text-ink-500 dark:text-ink-400 mt-2 max-w-2xl">
            Multi-agent commercial orchestration: marketing, sales, and BD. Browse
            the agent roster, client workspaces, vertical playbooks, runbooks,
            skills, and handoff schemas — and approve human-gated CCO decisions
            from a single control plane.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        <StatCard label="Active clients" value={stats.realClients} />
        <StatCard label="Examples" value={stats.exampleClients} />
        <StatCard label="Agents" value={stats.agents} />
        <StatCard label="Skills" value={stats.skills} />
        <StatCard label="Runbooks" value={stats.runbooks} />
      </section>

      <section>
        <SectionHeader title="Clients" href="/clients" />
        {clients.length === 0 ? (
          <EmptyState
            text="No client workspaces yet. The chief-commercial-officer will invoke client-onboarding when a new engagement begins."
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {clients.slice(0, 6).map((c) => (
              <Card
                key={c.slug}
                href={`/clients/${c.slug}`}
                title={c.displayName ?? c.slug}
                subtitle={[c.vertical, c.primaryMarket].filter(Boolean).join(" · ")}
                meta={c.isExample ? "example" : c.status}
                badges={c.campaigns}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="Agents" href="/agents" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {agents.slice(0, 6).map((a) => (
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

      <section>
        <SectionHeader title="Verticals" href="/verticals" />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {verticals.map((v) => (
            <Card key={v.name} href={`/verticals/${v.name}`} title={v.name} subtitle="Playbook with industry defaults" />
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Link href={href} className="text-sm text-accent hover:underline">
        View all →
      </Link>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-3 rounded-lg border border-dashed border-ink-300/70 dark:border-ink-700 p-6 text-sm text-ink-500">
      {text}
    </div>
  );
}
