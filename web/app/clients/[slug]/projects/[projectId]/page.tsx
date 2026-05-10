import { notFound } from "next/navigation";
import Link from "next/link";
import { Building2 } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Markdown from "@/components/Markdown";
import { Badge, Card, CardHeader, CardBody } from "@/components/ui";
import {
  getClient,
  getClients,
  getProject,
  getProjects,
} from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { slug: string; projectId: string }[] = [];
  for (const c of getClients()) {
    for (const p of getProjects(c.slug)) {
      params.push({ slug: c.slug, projectId: p.id });
    }
  }
  return params;
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
  params: Promise<{ slug: string; projectId: string }>;
}) {
  const { slug, projectId } = await params;
  const client = getClient(slug);
  const project = getProject(slug, projectId);
  if (!client || !project) notFound();

  const p = project.summary;

  return (
    <div className="space-y-8">
      <header>
        <Breadcrumbs
          crumbs={[
            { label: "Clients", href: "/clients", icon: <Building2 className="w-3 h-3" /> },
            { label: client.summary.displayName ?? slug, href: `/clients/${slug}` },
            { label: "Projects", href: `/clients/${slug}/projects` },
            { label: p.displayName },
          ]}
        />
        <div className="flex items-start justify-between gap-3 flex-wrap mt-2">
          <div>
            <h1 className="text-display font-semibold tracking-tight">
              {p.displayName}
            </h1>
            {p.masterplan && (
              <p className="text-body text-ink-600 dark:text-ink-300 mt-1">
                {p.masterplan}
                {p.emirate ? ` · ${p.emirate}` : ""}
              </p>
            )}
          </div>
          {p.status && (
            <Badge tone={STATUS_TONE[p.status] ?? "neutral"}>{p.status}</Badge>
          )}
        </div>
      </header>

      <Card padded>
        <CardHeader>
          <h2 className="text-title-sm font-semibold tracking-tight">Snapshot</h2>
        </CardHeader>
        <CardBody>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 text-body-sm">
            {p.launchQuarter && (
              <div>
                <dt className="text-ink-500 dark:text-ink-400">Launch</dt>
                <dd className="text-ink-800 dark:text-ink-100 font-medium mt-0.5">
                  {p.launchQuarter}
                </dd>
              </div>
            )}
            {typeof p.totalUnits === "number" && (
              <div>
                <dt className="text-ink-500 dark:text-ink-400">Total units</dt>
                <dd className="text-ink-800 dark:text-ink-100 font-medium mt-0.5">
                  {p.totalUnits.toLocaleString()}
                </dd>
              </div>
            )}
            {p.priceBandAed && (
              <div>
                <dt className="text-ink-500 dark:text-ink-400">Price band</dt>
                <dd className="text-ink-800 dark:text-ink-100 font-medium mt-0.5">
                  {p.priceBandAed}
                </dd>
              </div>
            )}
            {p.assetClass && (
              <div>
                <dt className="text-ink-500 dark:text-ink-400">Asset class</dt>
                <dd className="text-ink-800 dark:text-ink-100 font-medium mt-0.5 capitalize">
                  {p.assetClass.replace(/-/g, " ")}
                </dd>
              </div>
            )}
          </dl>
        </CardBody>
      </Card>

      {p.campaigns.length > 0 && (
        <Card padded>
          <CardHeader>
            <h2 className="text-title-sm font-semibold tracking-tight">
              Active campaigns
            </h2>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2">
              {p.campaigns.map((c) => (
                <li key={c}>
                  <Link
                    href={`/clients/${slug}/campaigns/${c}`}
                    className="text-accent hover:underline text-body-sm"
                  >
                    {c.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {project.body && (
        <Card padded>
          <CardBody>
            <Markdown>{project.body}</Markdown>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
