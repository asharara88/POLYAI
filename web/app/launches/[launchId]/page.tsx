import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  CalendarClock,
  CheckSquare,
  ClipboardList,
  FileText,
  Megaphone,
  Scale,
  UsersRound,
  Wallet,
} from "lucide-react";
import { getLaunch, PHASE_LABEL, PHASE_TONE, type Launch } from "@/lib/launches";
import { deadlineLabel } from "@/lib/format-dates";

const WORKSPACE = "uae-developments";
import Breadcrumbs from "@/components/Breadcrumbs";
import ReadinessBoard from "@/components/launch/ReadinessBoard";
import LaunchBriefView from "@/components/launch/LaunchBriefView";
import LaunchChannelMix from "@/components/launch/LaunchChannelMix";
import LaunchFinance from "@/components/launch/LaunchFinance";
import LaunchEventsBrokers from "@/components/launch/LaunchEventsBrokers";
import LaunchDecisionsRisks from "@/components/launch/LaunchDecisionsRisks";

export const dynamic = "force-static";

type Tab =
  | "readiness"
  | "brief"
  | "channels"
  | "finance"
  | "events"
  | "decisions";

const TABS: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "readiness", label: "Readiness", icon: CheckSquare },
  { key: "brief", label: "Brief", icon: FileText },
  { key: "channels", label: "Channel mix", icon: Scale },
  { key: "finance", label: "Finance", icon: Wallet },
  { key: "events", label: "Events & brokers", icon: UsersRound },
  { key: "decisions", label: "Decisions & risks", icon: AlertTriangle },
];

const TONE_CHIP: Record<string, string> = {
  success: "bg-success-100 text-success-700 dark:bg-success-950/40 dark:text-success-300 border-success-200 dark:border-success-900/50",
  warning: "bg-warning-100 text-warning-700 dark:bg-warning-950/40 dark:text-warning-300 border-warning-200 dark:border-warning-900/50",
  info: "bg-info-100 text-info-700 dark:bg-info-950/40 dark:text-info-300 border-info-200 dark:border-info-900/50",
  accent: "bg-accent/15 text-accent border-accent/30",
  neutral: "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300 border-ink-200 dark:border-ink-700",
};

export default async function LaunchPage({
  params,
  searchParams,
}: {
  params: Promise<{ launchId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { launchId } = await params;
  const { tab: tabParam } = await searchParams;
  const launch = getLaunch(WORKSPACE, launchId);
  if (!launch) {
    notFound();
  }

  const activeTab = (TABS.find((t) => t.key === tabParam)?.key ?? "readiness") as Tab;

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Breadcrumbs
          crumbs={[
            { label: "Launches", href: "/launches", icon: <Megaphone className="w-3 h-3" /> },
            { label: launch.projectName },
          ]}
        />
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={[
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded text-label-xs font-mono uppercase tracking-wider border",
                  TONE_CHIP[PHASE_TONE[launch.phase]],
                ].join(" ")}
              >
                {PHASE_LABEL[launch.phase]}
              </span>
              {launch.endDate && (
                <span className="inline-flex items-center gap-1 text-label-xs font-mono text-ink-500 dark:text-ink-400">
                  <CalendarClock className="w-3 h-3" aria-hidden />
                  {deadlineLabel(launch.endDate)}
                </span>
              )}
            </div>
            <h1 className="text-display font-semibold tracking-tight mt-2">
              {launch.projectName}
            </h1>
            <p className="text-body text-ink-600 dark:text-ink-300 mt-1.5 max-w-3xl leading-relaxed">
              {launch.goal}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-label-xs font-mono uppercase tracking-wider text-ink-400">
              Budget
            </div>
            <div className="text-title-sm font-semibold tabular-nums tracking-tight">
              {launch.budgetTotal ?? "—"}
            </div>
          </div>
        </div>

        <nav
          aria-label="Launch sections"
          className="flex flex-wrap gap-0.5 border-b border-ink-200/70 dark:border-ink-800"
        >
          {TABS.map((t) => {
            const active = activeTab === t.key;
            const Icon = t.icon;
            return (
              <Link
                key={t.key}
                href={t.key === "readiness" ? `/launches/${launchId}` : `/launches/${launchId}?tab=${t.key}`}
                aria-current={active ? "page" : undefined}
                className={[
                  "inline-flex items-center gap-1.5 px-3 py-2 text-body-sm border-b-2 transition-colors",
                  active
                    ? "border-accent text-ink-900 dark:text-ink-50 font-medium"
                    : "border-transparent text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 hover:border-accent/40",
                ].join(" ")}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden />
                {t.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <div>
        {activeTab === "readiness" && <ReadinessBoard launch={launch} />}
        {activeTab === "brief" && <LaunchBriefView launch={launch} />}
        {activeTab === "channels" && <LaunchChannelMix launch={launch} />}
        {activeTab === "finance" && <LaunchFinance launch={launch} />}
        {activeTab === "events" && <LaunchEventsBrokers launch={launch} />}
        {activeTab === "decisions" && (
          <LaunchDecisionsRisks launch={launch as Launch} />
        )}
      </div>
    </div>
  );
}
