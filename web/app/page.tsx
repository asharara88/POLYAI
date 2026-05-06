import Link from "next/link";
import { Card, StatCard } from "@/components/Card";
import { getAgents, getClients, getStats, getVerticals } from "@/lib/content";

export default function Page() {
  const stats = getStats();
  const clients = getClients();
  const agents = getAgents();
  const verticals = getVerticals();

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Control plane</h1>
        <p className="text-ink-500 dark:text-ink-400 mt-2 max-w-2xl">
          Browse the multi-agent team's clients, agent roster, vertical playbooks, and handoff schemas.
          Read-only today; the next iteration will let you trigger agents and approve human-gated actions.
        </p>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Active clients" value={stats.realClients} />
        <StatCard label="Examples" value={stats.exampleClients} />
        <StatCard label="Agents" value={stats.agents} />
        <StatCard label="Verticals" value={stats.verticals} />
        <StatCard label="Schemas" value={stats.schemas} />
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
