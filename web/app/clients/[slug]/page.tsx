import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "@/components/Markdown";
import InventoryDashboard from "@/components/InventoryDashboard";
import BrokerRegistry from "@/components/BrokerRegistry";
import WealthChannelRegistry from "@/components/WealthChannelRegistry";
import VvipChannelRegistry from "@/components/VvipChannelRegistry";
import EventsDashboard from "@/components/EventsDashboard";
import VendorsDashboard from "@/components/VendorsDashboard";
import BudgetDashboard from "@/components/BudgetDashboard";
import ReciprocityLedger from "@/components/ReciprocityLedger";
import ReciprocityStaging from "@/components/ReciprocityStaging";
import PipelineDashboard from "@/components/PipelineDashboard";
import CcoMorningBrief from "@/components/CcoMorningBrief";
import RiskRegister from "@/components/RiskRegister";
import HorizonScan from "@/components/HorizonScan";
import DecisionAsksQueue from "@/components/DecisionAsksQueue";
import CcoCalendar from "@/components/CcoCalendar";
import RoutingSimulator from "./RoutingSimulator";
import {
  getBrokers,
  getBudget,
  getBudgetSnapshots,
  getCcoCalendar,
  getClient,
  getClients,
  getDecisionAsks,
  getEvents,
  getHorizonScan,
  getInventory,
  getMorningBrief,
  getPipeline,
  getReciprocity,
  getRiskRegister,
  getVendors,
  getVvipChannel,
  getWealthChannel,
  listBrokerProfiles,
  listVendorProfiles,
} from "@/lib/content";

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
  | "cco"
  | "inventory"
  | "brokers"
  | "wealth"
  | "vvip"
  | "reciprocity"
  | "events"
  | "vendors"
  | "budget"
  | "pipeline"
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
  const brokersWithProfile = listBrokerProfiles(slug);
  const wealth = getWealthChannel(slug);
  const vvip = getVvipChannel(slug);
  const events = getEvents(slug);
  const vendors = getVendors(slug);
  const vendorsWithProfile = listVendorProfiles(slug);
  const budget = getBudget(slug);
  const budgetSnapshots = getBudgetSnapshots(slug);
  const reciprocity = getReciprocity(slug);
  const pipeline = getPipeline(slug);
  const ccoBrief = getMorningBrief(slug);
  const ccoRisks = getRiskRegister(slug);
  const ccoHorizon = getHorizonScan(slug);
  const ccoAsks = getDecisionAsks(slug);
  const ccoCalendar = getCcoCalendar(slug);
  const hasCcoSurface = Boolean(ccoBrief || ccoRisks || ccoAsks);

  const tabs = [
    ...baseTabs,
    ...(hasCcoSurface ? [{ key: "cco" as Tab, label: "CCO Daily" }] : []),
    ...(inventory ? [{ key: "inventory" as Tab, label: "Inventory" }] : []),
    ...(brokers ? [{ key: "brokers" as Tab, label: "Brokers" }] : []),
    ...(wealth ? [{ key: "wealth" as Tab, label: "Wealth channel" }] : []),
    ...(vvip ? [{ key: "vvip" as Tab, label: "VVIP" }] : []),
    ...(reciprocity ? [{ key: "reciprocity" as Tab, label: "Reciprocity" }] : []),
    ...(events.length > 0 ? [{ key: "events" as Tab, label: "Events" }] : []),
    ...(vendors ? [{ key: "vendors" as Tab, label: "Vendors" }] : []),
    ...(budget ? [{ key: "budget" as Tab, label: "Budget" }] : []),
    ...(pipeline ? [{ key: "pipeline" as Tab, label: "Pipeline" }] : []),
    ...(brokers ? [{ key: "routing" as Tab, label: "Simulators" }] : []),
  ];

  // Build known counterparties list for the reciprocity staging form
  const knownCounterparties = [
    ...(wealth?.counterparties.map((c) => ({
      id: c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      name: c.name,
      channel: "wealth",
    })) ?? []),
    ...(vvip?.entities.map((e) => ({
      id: e.entityId,
      name: e.primaryPrincipalAnonymized,
      channel: "vvip",
    })) ?? []),
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
        {activeTab === "cco" && hasCcoSurface && (
          <div className="space-y-12">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <div>
                <p className="text-sm text-ink-500 dark:text-ink-400 max-w-2xl">
                  CCO daily surface scoped to this client. Open in full at{" "}
                  <Link
                    href={`/cco?client=${slug}`}
                    className="text-accent hover:underline"
                  >
                    /cco
                  </Link>
                  .
                </p>
              </div>
            </div>
            {ccoBrief && (
              <CcoMorningBrief brief={ccoBrief} clientName={client.summary.displayName ?? slug} />
            )}
            {ccoAsks && <DecisionAsksQueue asks={ccoAsks} />}
            {ccoRisks && <RiskRegister register={ccoRisks} />}
            {ccoHorizon && <HorizonScan scan={ccoHorizon} />}
            {ccoCalendar && <CcoCalendar calendar={ccoCalendar} />}
          </div>
        )}
        {activeTab === "inventory" && inventory && <InventoryDashboard inventory={inventory} />}
        {activeTab === "brokers" && brokers && (
          <BrokerRegistry
            brokers={brokers}
            clientSlug={slug}
            brokersWithProfile={brokersWithProfile}
          />
        )}
        {activeTab === "wealth" && wealth && <WealthChannelRegistry channel={wealth} />}
        {activeTab === "vvip" && vvip && <VvipChannelRegistry channel={vvip} />}
        {activeTab === "reciprocity" && reciprocity && (
          <>
            <ReciprocityLedger ledger={reciprocity} />
            <ReciprocityStaging
              clientSlug={slug}
              isExample={client.summary.isExample}
              existingSummaries={reciprocity.summaries}
              knownCounterparties={knownCounterparties}
            />
          </>
        )}
        {activeTab === "pipeline" && pipeline && <PipelineDashboard pipeline={pipeline} />}
        {activeTab === "events" && events.length > 0 && (
          <EventsDashboard events={events} clientSlug={slug} />
        )}
        {activeTab === "vendors" && vendors && (
          <VendorsDashboard
            vendors={vendors}
            clientSlug={slug}
            vendorsWithProfile={vendorsWithProfile}
          />
        )}
        {activeTab === "budget" && budget && (
          <BudgetDashboard budget={budget} snapshots={budgetSnapshots} />
        )}
        {activeTab === "routing" && brokers && (
          <div className="space-y-4">
            <p className="text-sm text-ink-500 dark:text-ink-400 max-w-3xl">
              Three simulator modes for the developer's sales motion:{" "}
              <code className="font-mono">direct lead → in-house RM</code> (default for
              direct-marketing leads),{" "}
              <code className="font-mono">broker allocation request</code> (default for
              broker-originated buyers), and{" "}
              <code className="font-mono">overflow → broker</code> (exception when in-house
              capacity is exceeded).
            </p>
            <RoutingSimulator clientSlug={slug} />
          </div>
        )}
      </section>
    </div>
  );
}
