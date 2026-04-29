import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "@/components/Markdown";
import { getCampaign, getClient, getClients } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { slug: string; campaign: string }[] = [];
  for (const c of getClients()) {
    for (const camp of c.campaigns) {
      params.push({ slug: c.slug, campaign: camp });
    }
  }
  return params;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; campaign: string }>;
}) {
  const { slug, campaign } = await params;
  const client = getClient(slug);
  const data = getCampaign(slug, campaign);
  if (!client || !data) notFound();

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-2 text-xs font-mono text-ink-400">
          <Link href="/clients" className="hover:underline">clients</Link>
          <span>/</span>
          <Link href={`/clients/${slug}`} className="hover:underline">{slug}</Link>
          <span>/</span>
          <span>campaigns</span>
          <span>/</span>
          <span>{campaign}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">{campaign}</h1>
        <div className="text-sm text-ink-500 dark:text-ink-400 mt-1">
          {client.summary.displayName} · {data.files.length} {data.files.length === 1 ? "brief" : "briefs"}
        </div>
      </header>

      {data.files.length === 0 ? (
        <p className="text-sm text-ink-500">No briefs yet in this campaign.</p>
      ) : (
        <div className="space-y-10">
          {data.files.map((f) => (
            <section key={f.name}>
              <h2 className="font-mono text-sm text-ink-500 mb-3">{f.name}</h2>
              <div className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
                <Markdown>{f.body}</Markdown>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
