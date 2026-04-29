import { Card } from "@/components/Card";
import { getVerticals } from "@/lib/content";

export default function Page() {
  const verticals = getVerticals();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Verticals</h1>
        <p className="text-ink-500 dark:text-ink-400 mt-2 max-w-2xl">
          Industry defaults inherited by every client in the vertical. Override at the client level when their
          situation differs from the industry pattern.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-3">
        {verticals.map((v) => (
          <Card
            key={v.name}
            href={`/verticals/${v.name}`}
            title={v.name}
            subtitle="Audience archetypes · trigger events · channel mix · KPI norms · compliance flags"
          />
        ))}
      </div>
    </div>
  );
}
