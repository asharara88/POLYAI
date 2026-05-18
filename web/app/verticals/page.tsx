import { Card } from "@/components/Card";
import { getVerticals } from "@/lib/content";

export default function Page() {
  const verticals = getVerticals();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Industry packs</h1>
        <p className="text-ink-500 dark:text-ink-400 mt-2 max-w-2xl">
          Each pack adds specialist agents, skills, runbooks, and defaults on top of Flow&apos;s universal core. The shipping pack is real-estate-uae. Other packs (auto-retail, professional-services, f-and-b-multi-unit, b2b-saas) are not built yet.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-3">
        {verticals.map((v) => {
          const subtitle = [
            `${v.runbooks.length} runbooks`,
            `${v.skills.length} skills`,
            v.subVerticals.length > 0 ? `${v.subVerticals.length} sub-vertical${v.subVerticals.length === 1 ? "" : "s"}` : null,
          ]
            .filter(Boolean)
            .join(" · ");
          return (
            <Card
              key={v.name}
              href={`/verticals/${v.name}`}
              title={v.displayName}
              subtitle={subtitle || "Audience archetypes · trigger events · channel mix · KPI norms · compliance flags"}
            />
          );
        })}
      </div>
    </div>
  );
}
