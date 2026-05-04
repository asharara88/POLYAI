import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "@/components/Markdown";
import RsvpStaging from "./RsvpStaging";
import { getClient, getClients, getEventDetail, getEvents } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { slug: string; eventId: string }[] = [];
  for (const c of getClients()) {
    for (const e of getEvents(c.slug)) {
      params.push({ slug: c.slug, eventId: e.eventId });
    }
  }
  return params;
}

type Tab = "plan" | "invitations" | "rsvps" | "run-of-show" | "debrief";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; eventId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { slug, eventId } = await params;
  const { tab: tabParam } = await searchParams;
  const client = getClient(slug);
  const detail = getEventDetail(slug, eventId);
  if (!client || !detail) notFound();

  const tabs: { key: Tab; label: string; available: boolean }[] = [
    { key: "plan", label: "Plan", available: true },
    { key: "invitations", label: "Invitation list", available: !!detail.invitationList },
    { key: "rsvps", label: "RSVP log", available: !!detail.rsvpLog },
    { key: "run-of-show", label: "Run of show", available: !!detail.runOfShow },
    { key: "debrief", label: "Debrief", available: !!detail.debrief },
  ];
  const visible = tabs.filter((t) => t.available);
  const activeTab = (visible.find((t) => t.key === tabParam)?.key ?? "plan") as Tab;

  const content =
    activeTab === "plan"
      ? detail.plan.raw
      : activeTab === "invitations"
        ? detail.invitationList
        : activeTab === "rsvps"
          ? detail.rsvpLog
          : activeTab === "run-of-show"
            ? detail.runOfShow
            : detail.debrief;

  const e = detail.plan;

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-2 text-xs font-mono text-ink-400">
          <Link href="/clients" className="hover:underline">clients</Link>
          <span>/</span>
          <Link href={`/clients/${slug}`} className="hover:underline">{slug}</Link>
          <span>/</span>
          <Link href={`/clients/${slug}?tab=events`} className="hover:underline">events</Link>
          <span>/</span>
          <span>{eventId}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">{e.type ?? eventId}</h1>
        <div className="text-sm text-ink-500 dark:text-ink-400 mt-1">
          {[e.date, e.venue, e.status].filter(Boolean).join(" · ")}
        </div>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="capacity" value={e.capacity ?? "—"} />
        <Stat label="invited" value={e.invited ?? "—"} />
        <Stat label="RSVP yes" value={e.rsvpYes ?? "—"} />
        <Stat label="expected" value={e.expectedShow ?? "—"} />
      </section>

      {e.plannedAed != null && (
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat
            label="planned (AED)"
            value={e.plannedAed?.toLocaleString() ?? "—"}
            small
          />
          <Stat
            label="committed (AED)"
            value={e.committedAed?.toLocaleString() ?? "—"}
            small
          />
          <Stat
            label="actual (AED)"
            value={e.actualAed?.toLocaleString() ?? "—"}
            small
          />
          <Stat
            label="remaining (AED)"
            value={e.remainingAed?.toLocaleString() ?? "—"}
            small
          />
        </section>
      )}

      <section>
        <div className="flex flex-wrap gap-1 border-b border-ink-200/70 dark:border-ink-800 mb-5">
          {visible.map((t) => {
            const isActive = t.key === activeTab;
            return (
              <Link
                key={t.key}
                href={`/clients/${slug}/events/${eventId}?tab=${t.key}`}
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
        {content ? <Markdown>{content}</Markdown> : <p className="text-sm text-ink-500">No content.</p>}

        {activeTab === "rsvps" && detail.rsvpLog && (
          <RsvpStaging
            clientSlug={slug}
            eventId={eventId}
            filePath={`clients/${client.summary.isExample ? "_examples/" : ""}${slug}/events/${eventId}/rsvp-log.md`}
          />
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  small,
}: {
  label: string;
  value: number | string;
  small?: boolean;
}) {
  return (
    <div className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4">
      <div className="text-xs uppercase tracking-wider text-ink-400 font-mono">{label}</div>
      <div className={`mt-1 font-semibold ${small ? "text-base" : "text-2xl"}`}>{value}</div>
    </div>
  );
}
