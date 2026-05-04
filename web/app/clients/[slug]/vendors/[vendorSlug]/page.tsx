import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "@/components/Markdown";
import {
  getClient,
  getClients,
  getVendorDetail,
  listVendorProfiles,
} from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { slug: string; vendorSlug: string }[] = [];
  for (const c of getClients()) {
    for (const v of listVendorProfiles(c.slug)) {
      params.push({ slug: c.slug, vendorSlug: v });
    }
  }
  return params;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; vendorSlug: string }>;
}) {
  const { slug, vendorSlug } = await params;
  const client = getClient(slug);
  const detail = getVendorDetail(slug, vendorSlug);
  if (!client || !detail) notFound();

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-2 text-xs font-mono text-ink-400">
          <Link href="/clients" className="hover:underline">clients</Link>
          <span>/</span>
          <Link href={`/clients/${slug}`} className="hover:underline">{slug}</Link>
          <span>/</span>
          <Link href={`/clients/${slug}?tab=vendors`} className="hover:underline">vendors</Link>
          <span>/</span>
          <span>{vendorSlug}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">{vendorSlug}</h1>
      </header>

      <section className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
        <Markdown>{detail.raw}</Markdown>
      </section>
    </div>
  );
}
