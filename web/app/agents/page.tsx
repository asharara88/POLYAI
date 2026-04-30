import { Card } from "@/components/Card";
import { getAgents } from "@/lib/content";

const groups: { label: string; match: (name: string) => boolean }[] = [
  { label: "Executive", match: (n) => ["orchestrator", "client-onboarding"].includes(n) },
  {
    label: "Marketing",
    match: (n) =>
      ["strategy", "research", "creative", "brand-design", "seo", "social-media", "email-lifecycle", "analytics"].includes(n),
  },
  {
    label: "Sales",
    match: (n) =>
      ["sdr", "inbound-qualifier", "account-executive", "proposal", "account-manager", "forecasting"].includes(n),
  },
  { label: "BD", match: (n) => n === "partnerships" },
  {
    label: "Cross-cutting",
    match: (n) =>
      ["review", "compliance", "project-manager", "knowledge", "competitive-intel", "voc", "localization"].includes(n),
  },
];

export default function Page() {
  const agents = getAgents();

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
        <p className="text-ink-500 dark:text-ink-400 mt-2 max-w-2xl">
          Each agent has one job. Briefs flow between them via structured handoffs (see{" "}
          <a href="/schemas" className="text-accent hover:underline">schemas</a>).
        </p>
      </header>

      {groups.map((g) => {
        const matched = agents.filter((a) => g.match(a.name));
        if (matched.length === 0) return null;
        return (
          <section key={g.label}>
            <h2 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">{g.label}</h2>
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
            <h2 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-3">Other</h2>
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
