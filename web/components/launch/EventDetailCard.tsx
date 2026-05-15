import {
  Bot,
  CalendarClock,
  ClipboardList,
  Crown,
  MapPin,
  UserCheck,
  Users,
  UsersRound,
} from "lucide-react";
import {
  STATUS_LABEL,
  STATUS_TONE,
  TIER_LABEL,
  TIER_TONE,
  type LaunchEvent,
  type ProtocolTier,
} from "@/lib/launches";
import { deadlineLabel, eventLabel } from "@/lib/format-dates";

const TONE_CHIP: Record<string, string> = {
  success: "bg-success-100 text-success-700 dark:bg-success-950/40 dark:text-success-300 border-success-200 dark:border-success-900/50",
  warning: "bg-warning-100 text-warning-700 dark:bg-warning-950/40 dark:text-warning-300 border-warning-200 dark:border-warning-900/50",
  info: "bg-info-100 text-info-700 dark:bg-info-950/40 dark:text-info-300 border-info-200 dark:border-info-900/50",
  accent: "bg-accent/15 text-accent border-accent/30",
  neutral: "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300 border-ink-200 dark:border-ink-700",
};

const TIER_BAR: Record<string, string> = {
  purple: "bg-purple-500",
  accent: "bg-accent",
  info: "bg-info-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  neutral: "bg-ink-400",
};

const TIER_TEXT: Record<string, string> = {
  purple: "text-purple-700 dark:text-purple-300",
  accent: "text-accent",
  info: "text-info-700 dark:text-info-300",
  success: "text-success-700 dark:text-success-300",
  warning: "text-warning-700 dark:text-warning-300",
  neutral: "text-ink-700 dark:text-ink-300",
};

function tierIcon(tier: ProtocolTier) {
  if (tier === "vvip" || tier === "vip") return Crown;
  if (tier === "broker") return UsersRound;
  if (tier === "wealth-channel") return UserCheck;
  return Users;
}

export default function EventDetailCard({ event }: { event: LaunchEvent }) {
  const a = event.attendance;
  const invited = Math.max(a.invited, 1);
  const acceptPct = Math.round((a.accepted / invited) * 100);
  const declinePct = Math.round((a.declined / invited) * 100);
  const attendedPct = a.attended ? Math.round((a.attended / invited) * 100) : 0;

  return (
    <article className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card p-5 space-y-5">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={[
              "inline-flex items-center gap-1 px-2 py-0.5 rounded text-label-xs font-mono uppercase tracking-wider border",
              TONE_CHIP[STATUS_TONE[event.status]],
            ].join(" ")}
          >
            {STATUS_LABEL[event.status]}
          </span>
          {event.date && (
            <span className="inline-flex items-center gap-1 text-label-xs font-mono text-ink-500 dark:text-ink-400">
              <CalendarClock className="w-3 h-3" aria-hidden />
              {eventLabel(event.date)}
              {event.time && <span>· {event.time}</span>}
              <span className="text-ink-400">· {deadlineLabel(event.date)}</span>
            </span>
          )}
        </div>
        <h3 className="text-title-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50 leading-snug">
          {event.title}
        </h3>
        {event.venue && (
          <div className="inline-flex items-center gap-1.5 text-body-xs text-ink-500 dark:text-ink-400">
            <MapPin className="w-3 h-3" aria-hidden />
            {event.venue}
          </div>
        )}
      </header>

      {/* Attendance funnel */}
      <section aria-label="Attendance">
        <div className="flex items-baseline justify-between mb-2">
          <h4 className="text-label-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
            Attendance
          </h4>
          {event.capacity != null && (
            <span className="text-label-xs font-mono text-ink-400 tabular-nums">
              capacity {event.capacity}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Invited" value={a.invited} />
          <Stat
            label="Accepted"
            value={a.accepted}
            subtext={`${acceptPct}%`}
            tone="success"
          />
          <Stat
            label="Declined"
            value={a.declined}
            subtext={`${declinePct}%`}
            tone={declinePct > 25 ? "warning" : "neutral"}
          />
          <Stat
            label={event.status === "closed" ? "Attended" : "Pending"}
            value={event.status === "closed" ? a.attended : a.pending}
            subtext={
              event.status === "closed" ? `${attendedPct}%` : undefined
            }
            tone={event.status === "closed" ? "info" : "neutral"}
          />
        </div>

        {/* Stacked accepted/declined/pending bar */}
        <div className="mt-3">
          <div
            aria-label="Acceptance breakdown"
            className="flex h-2 rounded-full overflow-hidden bg-ink-100 dark:bg-ink-800"
          >
            <span
              title={`Accepted: ${a.accepted}`}
              className="h-full bg-success-500"
              style={{ width: `${(a.accepted / invited) * 100}%` }}
            />
            <span
              title={`Declined: ${a.declined}`}
              className="h-full bg-warning-500"
              style={{ width: `${(a.declined / invited) * 100}%` }}
            />
            <span
              title={`Pending: ${a.pending}`}
              className="h-full bg-ink-300 dark:bg-ink-700"
              style={{ width: `${(a.pending / invited) * 100}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-label-xs font-mono text-ink-500 dark:text-ink-400">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success-500" aria-hidden />
              accepted
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-warning-500" aria-hidden />
              declined
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-ink-300 dark:bg-ink-700" aria-hidden />
              pending
            </span>
          </div>
        </div>
      </section>

      {/* Invitee slate by protocol tier */}
      {event.invitees.length > 0 && (
        <section aria-label="Invitee slate">
          <h4 className="text-label-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-2">
            Invitee slate
          </h4>
          <div className="space-y-2.5">
            {event.invitees.map((b, i) => {
              const total = Math.max(b.invited, 1);
              const acc = (b.accepted / total) * 100;
              const dec = (b.declined / total) * 100;
              const tone = TIER_TONE[b.tier];
              const Icon = tierIcon(b.tier);
              return (
                <div key={`${b.tier}-${i}`} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Icon
                        className={["w-3.5 h-3.5 flex-shrink-0", TIER_TEXT[tone]].join(" ")}
                        aria-hidden
                      />
                      <span className="text-body-sm font-medium text-ink-800 dark:text-ink-100 truncate">
                        {b.label ?? TIER_LABEL[b.tier]}
                      </span>
                    </div>
                    <span className="text-label-xs font-mono text-ink-500 dark:text-ink-400 tabular-nums flex-shrink-0">
                      {b.accepted}/{b.invited} accepted
                      {b.attended != null && b.attended > 0 && (
                        <span className="text-ink-400"> · {b.attended} attended</span>
                      )}
                    </span>
                  </div>
                  <div
                    aria-label={`${TIER_LABEL[b.tier]} acceptance`}
                    className="flex h-1.5 rounded-full overflow-hidden bg-ink-100 dark:bg-ink-800"
                  >
                    <span
                      className={["h-full", TIER_BAR[tone]].join(" ")}
                      style={{ width: `${acc}%` }}
                    />
                    <span
                      className="h-full bg-warning-400/70"
                      style={{ width: `${dec}%` }}
                    />
                  </div>
                  {b.notes && (
                    <p className="text-body-xs text-ink-500 dark:text-ink-400 leading-snug">
                      {b.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer: owners + run-sheet + notes */}
      <footer className="border-t border-ink-100 dark:border-ink-800 pt-3 space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1 text-label-xs font-mono text-ink-500 dark:text-ink-400">
            <Bot className="w-3 h-3" aria-hidden />
            owner: {event.ownerAgent}
          </span>
          {event.coOwners.length > 0 && (
            <span className="inline-flex items-center gap-1 text-label-xs font-mono text-ink-400">
              co-owners: {event.coOwners.join(", ")}
            </span>
          )}
          {event.runSheetPath && (
            <span className="inline-flex items-center gap-1 text-label-xs font-mono text-ink-500 dark:text-ink-400">
              <ClipboardList className="w-3 h-3" aria-hidden />
              run-sheet linked
            </span>
          )}
        </div>
        {event.notes && (
          <p className="text-body-xs text-ink-600 dark:text-ink-300 leading-relaxed whitespace-pre-line">
            {event.notes}
          </p>
        )}
      </footer>
    </article>
  );
}

function Stat({
  label,
  value,
  subtext,
  tone = "neutral",
}: {
  label: string;
  value: number;
  subtext?: string;
  tone?: "neutral" | "success" | "warning" | "info";
}) {
  const valueClass =
    tone === "success"
      ? "text-success-700 dark:text-success-300"
      : tone === "warning"
        ? "text-warning-700 dark:text-warning-300"
        : tone === "info"
          ? "text-info-700 dark:text-info-300"
          : "text-ink-900 dark:text-ink-50";
  return (
    <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-ink-50/30 dark:bg-ink-950/30 p-2.5">
      <div className="text-label-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {label}
      </div>
      <div className={["mt-0.5 text-title-sm font-semibold tracking-tight tabular-nums", valueClass].join(" ")}>
        {value}
      </div>
      {subtext && (
        <div className="text-label-xs font-mono text-ink-400 tabular-nums">
          {subtext}
        </div>
      )}
    </div>
  );
}
