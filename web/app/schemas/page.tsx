import { Card } from "@/components/Card";
import { getSchemas } from "@/lib/content";

export default function Page() {
  const schemas = getSchemas();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Schemas</h1>
        <p className="text-ink-500 dark:text-ink-400 mt-2 max-w-2xl">
          Shared shapes for inter-agent handoffs. Briefs and deliverables conform to one of these so the
          receiving agent can parse, route, and respond consistently.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-3">
        {schemas.map((s) => (
          <Card key={s.name} href={`/schemas/${s.name}`} title={s.name} />
        ))}
      </div>
    </div>
  );
}
