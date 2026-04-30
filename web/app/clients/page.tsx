import { Card } from "@/components/Card";
import { getClients } from "@/lib/content";

export default function Page() {
  const clients = getClients();
  const real = clients.filter((c) => !c.isExample);
  const examples = clients.filter((c) => c.isExample);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        <p className="text-ink-500 dark:text-ink-400 mt-2">
          Each client is a folder under <code className="font-mono text-sm">clients/&lt;slug&gt;/</code> with their
          profile, ICP, brand voice, decisions, results, and active campaigns.
        </p>
      </header>

      <section>
        <h2 className="text-sm font-mono uppercase tracking-wider text-ink-400">Active</h2>
        {real.length === 0 ? (
          <p className="mt-3 text-sm text-ink-500">
            No active clients yet. Onboarding scaffolds <code className="font-mono">clients/&lt;slug&gt;/</code> from a brief plus the matching vertical.
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
          <h2 className="text-sm font-mono uppercase tracking-wider text-ink-400">Examples</h2>
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
