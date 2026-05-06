import type { ParsedHorizonScan, HorizonItem } from "@/lib/content";

const CLASS_TONE: Record<string, string> = {
  regulator: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-900/40",
  press: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-900/40",
  sanctions: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/40",
  corridor: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/40",
  competitor: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40",
};

function ScanItem({ item }: { item: HorizonItem }) {
  const tone = CLASS_TONE[item.class.toLowerCase()] ?? "bg-ink-100 text-ink-700 border-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:border-ink-700";
  return (
    <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 space-y-2">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="font-semibold text-sm leading-snug">{item.title}</div>
        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${tone}`}>
          {item.class}
        </span>
      </div>
      <div className="text-xs text-ink-500 font-mono">
        {item.source} · {item.date}
      </div>
      <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">{item.summary}</p>
      {item.whySurfaced && (
        <div className="text-xs text-ink-600 dark:text-ink-400">
          <span className="font-mono uppercase tracking-wider text-[10px] text-ink-400">why surfaced</span>{" "}
          {item.whySurfaced}
        </div>
      )}
      {item.nextStep && (
        <div className="text-xs text-ink-600 dark:text-ink-400">
          <span className="font-mono uppercase tracking-wider text-[10px] text-ink-400">next step</span>{" "}
          {item.nextStep}
        </div>
      )}
    </div>
  );
}

export default function HorizonScan({ scan }: { scan: ParsedHorizonScan }) {
  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Horizon scan</h2>
          <p className="text-xs text-ink-500 mt-0.5">
            {scan.itemsCount ?? scan.surfaced.length} items surfaced ·
            {" "}
            {scan.sourcesCount ?? "—"} sources scanned
          </p>
        </div>
        <div className="text-xs font-mono text-ink-400">
          {scan.scannedAt ?? scan.date}
        </div>
      </div>

      <div className="space-y-3">
        {scan.surfaced.map((it) => (
          <ScanItem key={it.title} item={it} />
        ))}
      </div>

      {scan.watchlist.length > 0 && (
        <section>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-500 mb-2">
            Watch list (no action yet)
          </h3>
          <ul className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 px-4 py-3 text-sm text-ink-600 dark:text-ink-400 space-y-1.5">
            {scan.watchlist.map((w, i) => (
              <li key={i} className="leading-snug">{w}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
