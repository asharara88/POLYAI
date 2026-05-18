import { notFound } from "next/navigation";
import { ScrollText, BookOpen, Layers } from "lucide-react";
import Markdown from "@/components/Markdown";
import { getVertical } from "@/lib/content";

export const dynamic = "force-static";

const PACK_NAME = "real-estate-uae";

export default function Page() {
  const pack = getVertical(PACK_NAME);
  if (!pack) notFound();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="text-xs font-mono text-ink-400">about</div>
        <h1 className="text-2xl font-semibold tracking-tight">
          About the <span className="font-mono">real-estate-uae</span> pack
        </h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 max-w-2xl">
          Flow ships with one pack today. It activates the agents, runbooks, skills, and approval-gate defaults a UAE master-developer engagement needs. The repo path is{" "}
          <code className="font-mono text-xs bg-ink-100 dark:bg-ink-800 px-1.5 py-0.5 rounded">verticals/{pack.name}/</code>; clients activate it with{" "}
          <code className="font-mono text-xs">pack: {pack.name}</code> (or legacy{" "}
          <code className="font-mono text-xs">vertical: {pack.name}</code>) in their client profile.
        </p>
      </header>

      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard icon={<ScrollText className="w-4 h-4" />} label="Runbooks" count={pack.runbooks.length} />
        <StatCard icon={<BookOpen className="w-4 h-4" />} label="Skills" count={pack.skills.length} />
        <StatCard icon={<Layers className="w-4 h-4" />} label="Sub-verticals" count={pack.subVerticals.length} />
      </div>

      {pack.manifest && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Pack manifest</h2>
          <div className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
            <Markdown>{pack.manifest}</Markdown>
          </div>
        </section>
      )}

      {(pack.runbooks.length > 0 || pack.skills.length > 0) && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Pack contents</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {pack.runbooks.length > 0 && (
              <ListCard
                icon={<ScrollText className="w-4 h-4" />}
                title="Runbooks"
                subtitle={`verticals/${pack.name}/runbooks/`}
                items={pack.runbooks}
              />
            )}
            {pack.skills.length > 0 && (
              <ListCard
                icon={<BookOpen className="w-4 h-4" />}
                title="Skills"
                subtitle={`verticals/${pack.name}/skills/`}
                items={pack.skills}
              />
            )}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Pack playbook</h2>
        <div className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
          <Markdown>{pack.body}</Markdown>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) {
  return (
    <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-medium text-ink-700 dark:text-ink-200">
        <span className="text-accent">{icon}</span>
        {label}
      </div>
      <span className="text-xl font-semibold tabular-nums">{count}</span>
    </div>
  );
}

function ListCard({
  icon,
  title,
  subtitle,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 space-y-3">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="text-accent">{icon}</span>
          {title}
          <span className="text-label-xs font-mono text-ink-400 tabular-nums">{items.length}</span>
        </div>
        <div className="text-label-xs font-mono text-ink-400 mt-0.5">{subtitle}</div>
      </div>
      <ul className="space-y-1 text-sm">
        {items.map((slug) => (
          <li key={slug} className="font-mono text-body-xs text-ink-600 dark:text-ink-300">
            {slug}
          </li>
        ))}
      </ul>
    </div>
  );
}
