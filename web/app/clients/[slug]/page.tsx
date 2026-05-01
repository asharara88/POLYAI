import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "@/components/Markdown";
import InventoryDashboard from "@/components/InventoryDashboard";
import BrokerRegistry from "@/components/BrokerRegistry";
import WealthChannelRegistry from "@/components/WealthChannelRegistry";
import RoutingSimulator from "./RoutingSimulator";
import { getBrokers, getClient, getClients, getInventory, getWealthChannel } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getClients().map((c) => ({ slug: c.slug }));
}

type Tab =
  | "profile"
  | "icp"
  | "voice"
  | "decisions"
  | "results"
  | "inventory"
  | "brokers"
  | "wealth"
  | "routing";

const baseTabs: { key: Tab; label: string }[] = [
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

  const inventory = getInventory(slug);
  const brokers = getBrokers(slug);
  const wealth = getWealthChannel(slug);

  const tabs = [
    ...baseTabs,
    ...(inventory ? [{ key: "inventory" as Tab, label: "Inventory" }] : []),
    ...(brokers ? [{ key: "brokers" as Tab, label: "Brokers" }] : []),
    ...(wealth ? [{ key: "wealth" as Tab, label: "Wealth channel" }] : []),
    ...(brokers ? [{ key: "routing" as Tab, label: "Routing sim" }] : []),
  ];

  const activeTab = (tabs.find((t) => t.key === tabParam)?.key ?? "profile") as Tab;

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

        {activeTab === "profile" && <Markdown>{client.profile}</Markdown>}
        {activeTab === "icp" && <Markdown>{client.icp || "_No ICP defined yet._"}</Markdown>}
        {activeTab === "voice" && <Markdown>{client.brandVoice || "_No brand voice defined yet._"}</Markdown>}
        {activeTab === "decisions" && <Markdown>{client.decisions || "_No decisions logged yet._"}</Markdown>}
        {activeTab === "results" && <Markdown>{client.results || "_No results logged yet._"}</Markdown>}
        {activeTab === "inventory" && inventory && <InventoryDashboard inventory={inventory} />}
        {activeTab === "brokers" && brokers && <BrokerRegistry brokers={brokers} />}
        {activeTab === "wealth" && wealth && <WealthChannelRegistry channel={wealth} />}
        {activeTab === "routing" && brokers && (
          <div className="space-y-4">
            <p className="text-sm text-ink-500 dark:text-ink-400 max-w-3xl">
              Paste or shape a sample inbound lead. The orchestrator runs it through{" "}
              <code className="font-mono">broker-enablement</code>'s routing logic against this
              client's broker registry and returns the chosen firm with reasoning.
            </p>
            <RoutingSimulator clientSlug={slug} />
          </div>
        )}
      </section>
    </div>
  );
}
