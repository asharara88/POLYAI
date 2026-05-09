import { Card } from "@/components/Card";
import { getClients } from "@/lib/content";
import NonAdminRedirect from "@/components/NonAdminRedirect";

export default function Page() {
  const clients = getClients();
  const real = clients.filter((c) => !c.isExample);
  const examples = clients.filter((c) => c.isExample);

  return (
    <div className="space-y-10">
      <NonAdminRedirect to="/workspace" />
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Workspaces</h1>
        <p className="text-ink-500 dark:text-ink-400 mt-2">
          One workspace per developer engagement. Switch between them or open
          one to see its pipeline, channels, events, and decisions.
        </p>
      </header>

      <section>
        <h2 className="text-title-sm font-semibold tracking-tight">Active</h2>
        {real.length === 0 ? (
          <p className="mt-3 text-body-sm text-ink-500 dark:text-ink-400">
            No active engagements yet. New engagements are scaffolded from a
            brief plus the matching vertical playbook.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {real.map((c) => (
              <Card
                key={c.slug}
                href={`/clients/${c.slug}`}
                title={c.displayName ?? c.slug}
                subtitle={[c.vertical, c.primaryMarket].filter(Boolean).join(" · ")}
                meta={c.status}
                badges={c.campaigns}
              />
            ))}
          </div>
        )}
      </section>

      {examples.length > 0 && (
        <section>
          <h2 className="text-title-sm font-semibold tracking-tight">Examples</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {examples.map((c) => (
              <Card
                key={c.slug}
                href={`/clients/${c.slug}`}
                title={c.displayName ?? c.slug}
                subtitle={[c.vertical, c.primaryMarket].filter(Boolean).join(" · ")}
                meta="example"
                badges={c.campaigns}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
