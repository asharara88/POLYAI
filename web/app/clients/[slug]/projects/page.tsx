import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Badge } from "@/components/ui";
import { getClient, getClients, getProjects } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getClients().map((c) => ({ slug: c.slug }));
}

const STATUS_TONE: Record<string, "success" | "warning" | "info" | "neutral"> = {
  "pre-launch": "warning",
  launching: "warning",
  sustain: "success",
  planning: "info",
  handover: "success",
  paused: "neutral",
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getClient(slug);
  if (!client) notFound();
  const projects = getProjects(slug);

  return (
    <div className="space-y-8">
      <header>
        <Breadcrumbs
          crumbs={[
            { label: "Clients", href: "/clients", icon: <Building2 className="w-3 h-3" /> },
            { label: client.summary.displayName ?? slug, href: `/clients/${slug}` },
            { label: "Projects" },
          ]}
        />
        <h1 className="text-display font-semibold tracking-tight mt-2">Projects</h1>
        <p className="text-body text-ink-600 dark:text-ink-300 mt-2 max-w-2xl">
          Each masterplan / development this workspace runs. Click into one to see
          its inventory, pipeline, events, and active campaigns.
        </p>
      </header>

      {projects.length === 0 ? (
        <div className="rounded-card border border-ink-200/70 dark:border-ink-800 dark:ring-1 dark:ring-white/[0.06] bg-ink-50/40 dark:bg-ink-950/40 p-6 text-center">
          <Building2 className="w-8 h-8 text-ink-400 mx-auto mb-2" aria-hidden />
          <p className="text-body text-ink-600 dark:text-ink-300">
            No projects scaffolded yet.
          </p>
          <p className="text-body-sm text-ink-500 dark:text-ink-400 mt-1">
            Add a project at <code className="font-mono">clients/{slug}/projects/&lt;id&gt;.md</code>.
          </p>
        </div>
      ) : (
        <section
          aria-label="Projects"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/clients/${slug}/projects/${p.id}`}
              className="group rounded-card border border-ink-200/70 dark:border-ink-800 dark:ring-1 dark:ring-white/[0.06] bg-white dark:bg-ink-900 p-5 shadow-card hover:shadow-card-hover hover:border-accent/40 dark:hover:border-accent/40 transition-all flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-title font-semibold tracking-tight inline-flex items-center gap-2">
                    {p.displayName}
                    <ArrowRight
                      className="w-4 h-4 text-ink-300 group-hover:text-accent group-hover:translate-x-0.5 transition-all"
                      aria-hidden
                    />
                  </h2>
                  {p.masterplan && (
                    <p className="text-body-sm text-ink-500 dark:text-ink-400 mt-0.5">
                      {p.masterplan}
                      {p.emirate ? ` · ${p.emirate}` : ""}
                    </p>
                  )}
                </div>
                {p.status && (
                  <Badge tone={STATUS_TONE[p.status] ?? "neutral"}>{p.status}</Badge>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-body-sm">
                {p.launchQuarter && (
                  <>
                    <dt className="text-ink-500 dark:text-ink-400">Launch</dt>
                    <dd className="text-ink-800 dark:text-ink-100 font-medium">
                      {p.launchQuarter}
                    </dd>
                  </>
                )}
                {typeof p.totalUnits === "number" && (
                  <>
                    <dt className="text-ink-500 dark:text-ink-400">Units</dt>
                    <dd className="text-ink-800 dark:text-ink-100 font-medium">
                      {p.totalUnits.toLocaleString()}
                    </dd>
                  </>
                )}
                {p.priceBandAed && (
                  <>
                    <dt className="text-ink-500 dark:text-ink-400">Price band</dt>
                    <dd className="text-ink-800 dark:text-ink-100 font-medium">
                      {p.priceBandAed}
                    </dd>
                  </>
                )}
                {p.assetClass && (
                  <>
                    <dt className="text-ink-500 dark:text-ink-400">Asset class</dt>
                    <dd className="text-ink-800 dark:text-ink-100 font-medium capitalize">
                      {p.assetClass.replace(/-/g, " ")}
                    </dd>
                  </>
                )}
              </dl>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
