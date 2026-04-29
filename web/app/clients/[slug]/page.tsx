import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "@/components/Markdown";
import { getClient, getClients } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getClients().map((c) => ({ slug: c.slug }));
}

type Tab = "profile" | "icp" | "voice" | "decisions" | "results";

const tabs: { key: Tab; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "icp", label: "ICP" },
  { key: "voice", label: "Brand voice" },
  { key: "decisions", label: "Decisions" },
  { key: "results", label: "Results" },
];

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { slug } = await params;
  const { tab: tabParam } = await searchParams;
  const client = getClient(slug);
  if (!client) notFound();

  const activeTab = (tabs.find((t) => t.key === tabParam)?.key ?? "profile") as Tab;
  const content =
    activeTab === "profile"
      ? client.profile
      : activeTab === "icp"
      ? client.icp
      : activeTab === "voice"
      ? client.brandVoice
      : activeTab === "decisions"
      ? client.decisions
      : client.results;

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-2 text-xs font-mono text-ink-400">
          <Link href="/clients" className="hover:underline">clients</Link>
          <span>/</span>
          <span>{slug}</span>
          {client.summary.isExample && (
            <span className="ml-2 px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-500">
              example
            </span>
          )}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">
          {client.summary.displayName ?? slug}
        </h1>
        <div className="text-sm text-ink-500 dark:text-ink-400 mt-1">
          {[client.summary.vertical, client.summary.primaryMarket, client.summary.status]
            .filter(Boolean)
            .join(" · ")}
        </div>
      </header>

      {client.summary.campaigns.length > 0 && (
        <section>
          <h2 className="text-sm font-mono uppercase tracking-wider text-ink-400 mb-2">Campaigns</h2>
          <div className="flex flex-wrap gap-2">
            {client.summary.campaigns.map((c) => (
              <Link
                key={c}
                href={`/clients/${slug}/campaigns/${c}`}
                className="px-3 py-1.5 rounded-md border border-ink-200/70 dark:border-ink-800 text-sm hover:border-accent/60"
              >
                {c}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex flex-wrap gap-1 border-b border-ink-200/70 dark:border-ink-800 mb-5">
          {tabs.map((t) => {
            const isActive = t.key === activeTab;
            return (
              <Link
                key={t.key}
                href={`/clients/${slug}?tab=${t.key}`}
                className={`px-3 py-2 text-sm border-b-2 -mb-px transition-colors ${
                  isActive
                    ? "border-accent text-ink-900 dark:text-ink-50"
                    : "border-transparent text-ink-500 hover:text-ink-800 dark:hover:text-ink-200"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>

        {content ? (
          <Markdown>{content}</Markdown>
        ) : (
          <p className="text-sm text-ink-500">No content yet for this section.</p>
        )}
      </section>
    </div>
  );
}
