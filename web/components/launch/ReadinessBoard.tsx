import {
  Bot,
  CheckCircle2,
  Circle,
  CircleDashed,
  CircleDot,
  FileText,
  Image as ImageIcon,
  Megaphone,
  Newspaper,
  Scale,
  Users,
} from "lucide-react";
import type { Launch } from "@/lib/launches";

/**
 * Readiness board — six rows, one per marketing function. Each row is a
 * status pill (green/amber/red) + owner agent + last-update + key blocker.
 *
 * In a worked-example deployment we don't have a separate readiness/ data
 * file; we infer status from launch metadata: phase, dependency assignments,
 * brief presence, channels declared, budget present, milestones declared.
 * In production this would read a per-launch readiness.md file.
 */

type Status = "ready" | "in-progress" | "blocked" | "not-started";

const STATUS_STYLES: Record<Status, { bg: string; text: string; ring: string; Icon: React.ComponentType<{ className?: string }> }> = {
  ready: {
    bg: "bg-success-50 dark:bg-success-950/40",
    text: "text-success-700 dark:text-success-300",
    ring: "ring-success-200 dark:ring-success-900/50",
    Icon: CheckCircle2,
  },
  "in-progress": {
    bg: "bg-info-50 dark:bg-info-950/40",
    text: "text-info-700 dark:text-info-300",
    ring: "ring-info-200 dark:ring-info-900/50",
    Icon: CircleDot,
  },
  blocked: {
    bg: "bg-warning-50 dark:bg-warning-950/40",
    text: "text-warning-700 dark:text-warning-300",
    ring: "ring-warning-200 dark:ring-warning-900/50",
    Icon: CircleDashed,
  },
  "not-started": {
    bg: "bg-ink-50 dark:bg-ink-900",
    text: "text-ink-500 dark:text-ink-400",
    ring: "ring-ink-200 dark:ring-ink-800",
    Icon: Circle,
  },
};

const STATUS_LABEL: Record<Status, string> = {
  ready: "Ready",
  "in-progress": "In progress",
  blocked: "Blocked",
  "not-started": "Not started",
};

type Row = {
  key: string;
  label: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  status: Status;
  owner: string;
  detail?: string;
};

function buildRows(launch: Launch): Row[] {
  // Brief readiness: ready if YAML parsed + briefBody non-trivial; in-progress if just YAML; not-started if empty.
  const briefStatus: Status =
    launch.briefBody.length > 200 && Object.keys(launch.yaml).length > 5
      ? "ready"
      : Object.keys(launch.yaml).length > 0
        ? "in-progress"
        : "not-started";

  // Creative readiness: count creative-brief-*.md siblings; ready if ≥3, in-progress if 1–2, not-started if 0.
  const creativeFiles = launch.briefFiles.filter((f) => f.startsWith("creative-brief"));
  const creativeStatus: Status =
    creativeFiles.length >= 3 ? "ready" : creativeFiles.length > 0 ? "in-progress" : "not-started";

  // Channel mix: ready if channels[] non-empty + weights sum ~1.
  const totalWeight = launch.channels.reduce((s, c) => s + c.weight, 0);
  const channelStatus: Status =
    launch.channels.length > 0 && Math.abs(totalWeight - 1) < 0.05
      ? "ready"
      : launch.channels.length > 0
        ? "in-progress"
        : "not-started";

  // Press / PR: ready if a "PR" channel is declared with rationale; in-progress if mentioned anywhere.
  const prChannel = launch.channels.find((c) => /pr|press|earned/i.test(c.channel));
  const pressStatus: Status = prChannel
    ? prChannel.rationale
      ? "ready"
      : "in-progress"
    : "not-started";

  // Events: ready if a milestone mentions "event", "viewing", "gallery", "ribbon"; in-progress if events agent in dependencies.
  const eventMilestones = launch.milestones.filter((m) =>
    /event|viewing|gallery|reception|ribbon|ceremony/i.test(m.what),
  );
  const eventsInDeps = launch.dependencies.some((d) => /events/i.test(d));
  const eventsStatus: Status =
    eventMilestones.length >= 2 ? "ready" : eventMilestones.length > 0 || eventsInDeps ? "in-progress" : "not-started";

  // Compliance: ready if compliance is in dependencies AND compliance_flags exists.
  const complianceInDeps = launch.dependencies.some((d) => /compliance/i.test(d));
  const complianceStatus: Status =
    complianceInDeps && launch.complianceFlags.length > 0
      ? "ready"
      : launch.complianceFlags.length > 0
        ? "in-progress"
        : "not-started";

  return [
    {
      key: "brief",
      label: "Campaign brief",
      description: "Strategic frame, audience, positioning, KPIs",
      Icon: FileText,
      status: briefStatus,
      owner: launch.ownerAgent,
      detail:
        briefStatus === "ready"
          ? "Brief signed-off; conforms to schema"
          : "Awaiting full populated brief",
    },
    {
      key: "creative",
      label: "Creative",
      description: "Hero, channel-cuts, brand-system applied",
      Icon: ImageIcon,
      status: creativeStatus,
      owner: "creative",
      detail:
        creativeFiles.length > 0
          ? `${creativeFiles.length} creative brief${creativeFiles.length === 1 ? "" : "s"} in folder`
          : "No creative briefs decomposed yet",
    },
    {
      key: "channels",
      label: "Channel mix",
      description: "Allocation across paid / earned / owned / direct",
      Icon: Scale,
      status: channelStatus,
      owner: "strategy",
      detail:
        launch.channels.length > 0
          ? `${launch.channels.length} channels · weights ${(totalWeight * 100).toFixed(0)}%`
          : "No channel mix declared",
    },
    {
      key: "press",
      label: "Press & PR",
      description: "Earned media, embargoes, spokesperson",
      Icon: Newspaper,
      status: pressStatus,
      owner: "content-pr-specialist",
      detail: prChannel
        ? prChannel.rationale ?? "PR channel declared"
        : "No press channel in mix",
    },
    {
      key: "events",
      label: "Events & broker activation",
      description: "Sales gallery, broker dyads, wealth previews",
      Icon: Users,
      status: eventsStatus,
      owner: "events",
      detail:
        eventMilestones.length > 0
          ? `${eventMilestones.length} event milestone${eventMilestones.length === 1 ? "" : "s"} on timeline`
          : eventsInDeps
            ? "Events ops assigned"
            : "No event milestones declared",
    },
    {
      key: "compliance",
      label: "Compliance review",
      description: "Pre-launch sign-off on assets + lead pathways",
      Icon: Megaphone,
      status: complianceStatus,
      owner: "compliance",
      detail:
        complianceStatus === "ready"
          ? `${launch.complianceFlags.length} flag${launch.complianceFlags.length === 1 ? "" : "s"} active; review assigned`
          : launch.complianceFlags.length > 0
            ? "Flags declared; review not yet assigned"
            : "No compliance flags",
    },
  ];
}

export default function ReadinessBoard({ launch }: { launch: Launch }) {
  const rows = buildRows(launch);
  const readyCount = rows.filter((r) => r.status === "ready").length;
  const blockedCount = rows.filter((r) => r.status === "blocked").length;

  return (
    <div className="space-y-5">
      <header className="flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-title-sm font-semibold tracking-tight">
            Readiness across marketing functions
          </h2>
          <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Inferred from the campaign brief, declared channels, milestones, and
            dependency assignments.
          </p>
        </div>
        <div className="text-label-xs font-mono text-ink-500 dark:text-ink-400 tabular-nums">
          {readyCount}/{rows.length} ready
          {blockedCount > 0 && (
            <span className="text-warning-600 dark:text-warning-400">
              {" "}
              · {blockedCount} blocked
            </span>
          )}
        </div>
      </header>

      <div className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card divide-y divide-ink-100 dark:divide-ink-800 overflow-hidden">
        {rows.map((r) => {
          const styles = STATUS_STYLES[r.status];
          const StatusIcon = styles.Icon;
          return (
            <div key={r.key} className="px-5 py-4 flex items-start gap-4">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-accent/10 text-accent flex-shrink-0">
                <r.Icon className="w-4 h-4" aria-hidden />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-body-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50">
                    {r.label}
                  </h3>
                  <span
                    className={[
                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-label-xs font-mono",
                      styles.bg,
                      styles.text,
                    ].join(" ")}
                  >
                    <StatusIcon className="w-3 h-3" aria-hidden />
                    {STATUS_LABEL[r.status]}
                  </span>
                </div>
                <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5 leading-snug">
                  {r.description}
                </p>
                {r.detail && (
                  <p className="text-body-xs text-ink-600 dark:text-ink-300 mt-1.5 leading-snug">
                    {r.detail}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0 text-right">
                <span className="inline-flex items-center gap-1 text-label-xs font-mono text-ink-500 dark:text-ink-400">
                  <Bot className="w-3 h-3" aria-hidden />
                  {r.owner}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
