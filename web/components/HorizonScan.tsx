import type { ParsedHorizonScan, HorizonItem } from "@/lib/content";
import { Section, SectionHeader, Stack, Card } from "@/components/ui";
import {
  Building2,
  Eye,
  Gavel,
  Newspaper,
  ShieldAlert,
  Telescope,
  TrendingUp,
} from "lucide-react";

const CLASS_META: Record<
  string,
  { tone: string; icon: React.ReactNode; label: string }
> = {
  regulator: {
    tone: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-900/40",
    icon: <Gavel className="w-3.5 h-3.5" />,
    label: "regulator",
  },
  press: {
    tone: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-900/40",
    icon: <Newspaper className="w-3.5 h-3.5" />,
    label: "press",
  },
  sanctions: {
    tone: "bg-danger-100 text-danger-800 border-danger-200 dark:bg-danger-950/30 dark:text-danger-300 dark:border-danger-900/40",
    icon: <ShieldAlert className="w-3.5 h-3.5" />,
    label: "sanctions",
  },
  corridor: {
    tone: "bg-info-100 text-info-800 border-info-200 dark:bg-info-950/30 dark:text-info-300 dark:border-info-900/40",
    icon: <Building2 className="w-3.5 h-3.5" />,
    label: "corridor",
  },
  competitor: {
    tone: "bg-warning-100 text-warning-800 border-warning-200 dark:bg-warning-950/30 dark:text-warning-300 dark:border-warning-900/40",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    label: "competitor",
  },
};

function ScanItem({ item }: { item: HorizonItem }) {
  const meta =
    CLASS_META[item.class.toLowerCase()] ?? {
      tone: "bg-ink-100 text-ink-700 border-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:border-ink-700",
      icon: <Telescope className="w-3.5 h-3.5" />,
      label: item.class || "scan",
    };
  return (
    <Card padded className="space-y-2">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="font-semibold text-body leading-snug min-w-0">{item.title}</div>
        <span
          className={[
            "inline-flex items-center gap-1 text-label-xs font-mono uppercase px-1.5 py-0.5 rounded border",
            meta.tone,
          ].join(" ")}
        >
          <span aria-hidden>{meta.icon}</span>
          {meta.label}
        </span>
      </div>
      <div className="text-body-xs text-ink-500 font-mono">
        {item.source} · {item.date}
      </div>
      <p className="text-body-sm text-ink-700 dark:text-ink-300 leading-relaxed">
        {item.summary}
      </p>
      {item.whySurfaced && (
        <div className="text-body-xs text-ink-600 dark:text-ink-400">
          <span className="font-mono uppercase tracking-wider text-label-xs text-ink-400 mr-1">
            why surfaced
          </span>
          {item.whySurfaced}
        </div>
      )}
      {item.nextStep && (
        <div className="text-body-xs text-ink-600 dark:text-ink-400">
          <span className="font-mono uppercase tracking-wider text-label-xs text-ink-400 mr-1">
            next step
          </span>
          {item.nextStep}
        </div>
      )}
    </Card>
  );
}

export default function HorizonScan({ scan }: { scan: ParsedHorizonScan }) {
  return (
    <Stack gap="5">
      <Section
        title={
          <span className="inline-flex items-center gap-2">
            <Telescope className="w-5 h-5 text-ink-500" aria-hidden />
            Horizon scan
          </span>
        }
        description={`${scan.itemsCount ?? scan.surfaced.length} items surfaced · ${
          scan.sourcesCount ?? "—"
        } sources scanned`}
        meta={<span>{scan.scannedAt ?? scan.date}</span>}
      >
        <Stack gap="3">
          {scan.surfaced.map((it) => (
            <ScanItem key={it.title} item={it} />
          ))}
        </Stack>
      </Section>

      {scan.watchlist.length > 0 && (
        <section>
          <SectionHeader>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" aria-hidden />
              Watch list (no action yet)
            </span>
          </SectionHeader>
          <Card padded={false}>
            <ul className="px-4 py-3 text-body-sm text-ink-600 dark:text-ink-400 space-y-1.5">
              {scan.watchlist.map((w, i) => (
                <li key={i} className="leading-snug">
                  {w}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </Stack>
  );
}
