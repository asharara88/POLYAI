import { notFound } from "next/navigation";
import Link from "next/link";
import { Building2, ScrollText, BookOpen, Layers } from "lucide-react";
import Markdown from "@/components/Markdown";
import { getVertical, getVerticals } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getVerticals().map((v) => ({ name: v.name }));
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const vertical = getVertical(name);
  if (!vertical) notFound();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-ink-400">
          <Link href="/verticals" className="hover:underline">verticals</Link>
          <span>/</span>
          <span>{vertical.name}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Pack — <span className="font-mono">{vertical.displayName}</span>
        </h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 max-w-2xl">
          Pack folder <code className="font-mono text-xs bg-ink-100 dark:bg-ink-800 px-1.5 py-0.5 rounded">verticals/{vertical.name}/</code>. Activates per-client via{" "}
          <code className="font-mono text-xs">pack: {vertical.displayName}</code> (or legacy{" "}
          <code className="font-mono text-xs">vertical: {vertical.name}</code>) in the client profile.
        </p>
      </header>

      <div className="grid sm:grid-cols-3 gap-3">
        <StatCard icon={<ScrollText className="w-4 h-4" />} label="Runbooks" count={vertical.runbooks.length} />
        <StatCard icon={<BookOpen className="w-4 h-4" />} label="Skills" count={vertical.skills.length} />
        <StatCard icon={<Layers className="w-4 h-4" />} label="Sub-verticals" count={vertical.subVerticals.length} />
      </div>

      {vertical.manifest && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Pack manifest</h2>
          <div className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
            <Markdown>{vertical.manifest}</Markdown>
          </div>
        </section>
      )}

      {(vertical.runbooks.length > 0 || vertical.skills.length > 0) && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Pack contents</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {vertical.runbooks.length > 0 && (
              <ListCard
                icon={<ScrollText className="w-4 h-4" />}
                title="Runbooks"
                subtitle={`verticals/${vertical.name}/runbooks/`}
                items={vertical.runbooks}
              />
            )}
            {vertical.skills.length > 0 && (
              <ListCard
                icon={<BookOpen className="w-4 h-4" />}
                title="Skills"
                subtitle={`verticals/${vertical.name}/skills/`}
                items={vertical.skills}
              />
            )}
          </div>
        </section>
      )}

      {vertical.subVerticals.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Sub-verticals</h2>
          <div className="flex flex-wrap gap-2">
            {vertical.subVerticals.map((sv) => (
              <span
                key={sv}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-ink-200/70 dark:border-ink-800 text-sm font-mono"
              >
                <Building2 className="w-3.5 h-3.5 text-ink-400" />
                {sv}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Pack playbook</h2>
        <div className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
          <Markdown>{vertical.body}</Markdown>
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
