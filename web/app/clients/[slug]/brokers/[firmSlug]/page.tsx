import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "@/components/Markdown";
import {
  getBrokerDetail,
  getBrokers,
  getClient,
  getClients,
  listBrokerProfiles,
} from "@/lib/content";
import FirmLaunchHistory from "@/components/broker/FirmLaunchHistory";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { slug: string; firmSlug: string }[] = [];
  for (const c of getClients()) {
    for (const f of listBrokerProfiles(c.slug)) {
      params.push({ slug: c.slug, firmSlug: f });
    }
  }
  return params;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; firmSlug: string }>;
}) {
  const { slug, firmSlug } = await params;
  const client = getClient(slug);
  const detail = getBrokerDetail(slug, firmSlug);
  if (!client || !detail) notFound();

  // Match the firm-slug back to its display name in the registry so the
  // reverse-link lookup works (allocation files reference the display
  // name, not the slug).
  const brokers = getBrokers(slug);
  const firmName =
    brokers?.sampleFirms.find(
      (f) => f.firm.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === firmSlug,
    )?.firm ?? firmSlug;

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-2 text-xs font-mono text-ink-400">
          <Link href="/clients" className="hover:underline">clients</Link>
          <span>/</span>
          <Link href={`/clients/${slug}`} className="hover:underline">{slug}</Link>
          <span>/</span>
          <Link href={`/clients/${slug}/brokers`} className="hover:underline">brokers</Link>
          <span>/</span>
          <span>{firmSlug}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">{firmName}</h1>
      </header>

      <section className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
        <Markdown>{detail.raw}</Markdown>
      </section>

      <FirmLaunchHistory clientSlug={slug} firmName={firmName} />
    </div>
  );
}
