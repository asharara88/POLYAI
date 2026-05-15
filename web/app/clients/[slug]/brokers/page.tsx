import Link from "next/link";
import { notFound } from "next/navigation";
import { Crown, Megaphone, ShieldCheck, Users } from "lucide-react";
import {
  getBrokers,
  getClient,
  getClients,
  listBrokerProfiles,
  slugify,
} from "@/lib/content";
import TierMapHeader from "@/components/broker/TierMapHeader";
import FirmCard from "@/components/broker/FirmCard";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const c of getClients()) {
    if (getBrokers(c.slug)) {
      params.push({ slug: c.slug });
    }
  }
  return params;
}

const TIER_HEADING_ICON: Record<number, typeof Crown> = {
  1: Crown,
  2: ShieldCheck,
  3: Users,
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getClient(slug);
  const brokers = getBrokers(slug);
  if (!client || !brokers) notFound();

  const profileSlugs = new Set(listBrokerProfiles(slug));
  const tiersToShow = [1, 2, 3] as const;

  // Pull rough sections out of the raw registry MD for routing principles
  // and any disputes/performance footer — purely cosmetic.
  const routingMatch = brokers.raw.match(/## Routing principles[\s\S]+?(?=\n## |$)/);
  const routingText = routingMatch ? routingMatch[0].replace(/^## .*\n/, "").trim() : null;

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-2 text-xs font-mono text-ink-400">
          <Link href="/clients" className="hover:underline">
            clients
          </Link>
          <span>/</span>
          <Link href={`/clients/${slug}`} className="hover:underline">
            {slug}
          </Link>
          <span>/</span>
          <span>brokers</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">
          Broker registry — {client.summary.displayName ?? slug}
        </h1>
        <p className="text-body-sm text-ink-500 dark:text-ink-400 mt-1 max-w-3xl leading-snug">
          Tier-segmented broker network for this client. Tier-1 firms get
          private-event access and first-2-weeks exclusive on premium-tier
          units; Tier-2 opens at launch week; Tier-3 follows broad
          distribution after T1+T2 capacity is met.
        </p>
        {brokers.speedToLeadSlaMinutes != null && (
          <p className="text-label-xs font-mono text-ink-500 dark:text-ink-400 mt-2">
            <Megaphone className="w-3 h-3 inline mr-1" aria-hidden />
            Speed-to-lead SLA: {brokers.speedToLeadSlaMinutes} min
          </p>
        )}
      </header>

      <TierMapHeader tiers={brokers.tiers} firms={brokers.sampleFirms} />

      {tiersToShow.map((tierNum) => {
        const firmsInTier = brokers.sampleFirms.filter((f) => f.tier === tierNum);
        if (firmsInTier.length === 0) return null;
        const Icon = TIER_HEADING_ICON[tierNum];
        const tierMeta = brokers.tiers.find((t) => t.tier === tierNum);
        return (
          <section key={tierNum} aria-labelledby={`tier-${tierNum}-firms`}>
            <header className="flex items-baseline justify-between mb-3">
              <h2
                id={`tier-${tierNum}-firms`}
                className="text-body font-semibold tracking-tight flex items-center gap-2"
              >
                <Icon className="w-4 h-4 text-ink-500 dark:text-ink-400" aria-hidden />
                Tier {tierNum}
              </h2>
              <span className="text-label-xs font-mono text-ink-400 tabular-nums">
                {firmsInTier.length} shown
                {tierMeta?.count ? <span> · {tierMeta.count} in registry</span> : null}
              </span>
            </header>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {firmsInTier.map((f) => (
                <FirmCard
                  key={f.firm}
                  firm={f}
                  clientSlug={slug}
                  hasProfile={profileSlugs.has(slugify(f.firm))}
                />
              ))}
            </div>
          </section>
        );
      })}

      {routingText && (
        <section
          aria-labelledby="routing-principles"
          className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5"
        >
          <h2
            id="routing-principles"
            className="text-body-sm font-semibold tracking-tight mb-2"
          >
            Routing principles
          </h2>
          <pre className="whitespace-pre-wrap text-body-xs text-ink-700 dark:text-ink-200 font-sans leading-relaxed">
            {routingText}
          </pre>
        </section>
      )}
    </div>
  );
}
