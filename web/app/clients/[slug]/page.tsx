import { notFound } from "next/navigation";
import Link from "next/link";
import { Building2 } from "lucide-react";
import Markdown from "@/components/Markdown";
import Breadcrumbs from "@/components/Breadcrumbs";
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

type Tab = "workspace" | "launches" | "channels";

const TABS: { key: Tab; label: string; sublabel: string }[] = [
  { key: "workspace", label: "Workspace", sublabel: "Profile · ICP · voice · decisions · results · CCO daily" },
  { key: "launches", label: "Inventory & launches", sublabel: "Inventory · pipeline · events · vendors · budget · routing" },
  { key: "channels", label: "Channels", sublabel: "Brokers · wealth · VVIP · reciprocity" },
];

function SectionHeader({ id, title }: { id: string; title: string }) {
  return (
    <h2
      id={id}
      className="text-xl font-semibold tracking-tight text-ink-900 dark:text-ink-50 scroll-mt-24"
    >
      <a href={`#${id}`} className="hover:text-accent transition-colors">
        {title}
      </a>
    </h2>
  );
}

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

  const activeTab = (TABS.find((t) => t.key === tabParam)?.key ?? "workspace") as Tab;

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Breadcrumbs
          crumbs={[
            { label: "Operator", href: "/operator" },
            { label: "Workspaces", href: "/clients", icon: <Building2 className="w-3 h-3" /> },
            { label: client.summary.displayName ?? slug },
          ]}
        />
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-title-lg font-semibold tracking-tight flex items-center gap-2">
              {client.summary.displayName ?? slug}
              {client.summary.isExample && (
                <span className="text-label-xs font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-500">
                  example
                </span>
              )}
            </h1>
            <p className="text-body-sm text-ink-500 mt-1">
              {[client.summary.vertical, client.summary.primaryMarket, client.summary.status]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <Link
            href={`/cco?client=${slug}`}
            className="text-label-xs font-mono uppercase tracking-wider text-accent hover:underline"
          >
            CCO Daily ›
          </Link>
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
        <div className="flex flex-col sm:flex-row gap-0 border-b border-ink-200/70 dark:border-ink-800 mb-6">
          {TABS.map((t) => {
            const isActive = t.key === activeTab;
            return (
              <Link
                key={t.key}
                href={`/clients/${slug}?tab=${t.key}`}
                className={`flex-1 px-4 py-3 border-b-2 -mb-px transition-colors ${
                  isActive
                    ? "border-accent text-ink-900 dark:text-ink-50"
                    : "border-transparent text-ink-500 hover:text-ink-800 dark:hover:text-ink-200"
                }`}
              >
                <div className="text-sm font-semibold">{t.label}</div>
                <div className="text-label-xs text-ink-400 mt-0.5 hidden sm:block">{t.sublabel}</div>
              </Link>
            );
          })}
        </div>

        {activeTab === "workspace" && (
          <div className="space-y-14">
            <div className="space-y-3">
              <SectionHeader id="profile" title="Profile" />
              <Markdown>{client.profile}</Markdown>
            </div>
            <div className="space-y-3">
              <SectionHeader id="icp" title="ICP" />
              <Markdown>{client.icp || "_No ICP defined yet._"}</Markdown>
            </div>
            <div className="space-y-3">
              <SectionHeader id="voice" title="Brand voice" />
              <Markdown>{client.brandVoice || "_No brand voice defined yet._"}</Markdown>
            </div>
            <div className="space-y-3">
              <SectionHeader id="decisions" title="Decisions log" />
              <Markdown>{client.decisions || "_No decisions logged yet._"}</Markdown>
            </div>
            <div className="space-y-3">
              <SectionHeader id="results" title="Results" />
              <Markdown>{client.results || "_No results logged yet._"}</Markdown>
            </div>
            {hasCcoSurface && (
              <div className="space-y-6">
                <SectionHeader id="cco" title="CCO daily surface" />
                <p className="text-sm text-ink-500 dark:text-ink-400 max-w-2xl">
                  Scoped to this client. Open in full at{" "}
                  <Link href={`/cco?client=${slug}`} className="text-accent hover:underline">
                    /cco
                  </Link>
                  .
                </p>
                {ccoBrief && (
                  <CcoMorningBrief brief={ccoBrief} clientName={client.summary.displayName ?? slug} />
                )}
                {ccoAsks && <DecisionAsksQueue asks={ccoAsks} client={slug} />}
                {ccoRisks && <RiskRegister register={ccoRisks} />}
                {ccoHorizon && <HorizonScan scan={ccoHorizon} />}
                {ccoCalendar && <CcoCalendar calendar={ccoCalendar} />}
              </div>
            )}
          </div>
        )}

        {activeTab === "launches" && (
          <div className="space-y-14">
            {inventory && (
              <div className="space-y-3">
                <SectionHeader id="inventory" title="Inventory" />
                <InventoryDashboard inventory={inventory} />
              </div>
            )}
            {pipeline && (
              <div className="space-y-3">
                <SectionHeader id="pipeline" title="Pipeline" />
                <PipelineDashboard pipeline={pipeline} />
              </div>
            )}
            {events.length > 0 && (
              <div className="space-y-3">
                <SectionHeader id="events" title="Events" />
                <EventsDashboard events={events} clientSlug={slug} />
              </div>
            )}
            {vendors && (
              <div className="space-y-3">
                <SectionHeader id="vendors" title="Vendors" />
                <VendorsDashboard
                  vendors={vendors}
                  clientSlug={slug}
                  vendorsWithProfile={vendorsWithProfile}
                />
              </div>
            )}
            {budget && (
              <div className="space-y-3">
                <SectionHeader id="budget" title="Marketing budget" />
                <BudgetDashboard budget={budget} snapshots={budgetSnapshots} />
              </div>
            )}
            {brokers && (
              <div className="space-y-3">
                <SectionHeader id="routing" title="Sales routing simulators" />
                <p className="text-sm text-ink-500 dark:text-ink-400 max-w-3xl">
                  Three simulator modes for the developer&apos;s sales motion:{" "}
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
          </div>
        )}

        {activeTab === "channels" && (
          <div className="space-y-14">
            {brokers && (
              <div className="space-y-3">
                <SectionHeader id="brokers" title="Broker registry" />
                <BrokerRegistry
                  brokers={brokers}
                  clientSlug={slug}
                  brokersWithProfile={brokersWithProfile}
                />
              </div>
            )}
            {wealth && (
              <div className="space-y-3">
                <SectionHeader id="wealth" title="Wealth channel" />
                <WealthChannelRegistry channel={wealth} />
              </div>
            )}
            {vvip && (
              <div className="space-y-3">
                <SectionHeader id="vvip" title="VVIP channel" />
                <VvipChannelRegistry channel={vvip} />
              </div>
            )}
            {reciprocity && (
              <div className="space-y-3">
                <SectionHeader id="reciprocity" title="Reciprocity ledger" />
                <ReciprocityLedger ledger={reciprocity} />
                <ReciprocityStaging
                  clientSlug={slug}
                  isExample={client.summary.isExample}
                  existingSummaries={reciprocity.summaries}
                  knownCounterparties={knownCounterparties}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
