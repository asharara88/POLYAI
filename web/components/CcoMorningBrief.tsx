import type { ParsedMorningBrief } from "@/lib/content";
import Markdown from "@/components/Markdown";

export default function CcoMorningBrief({
  brief,
  clientName,
}: {
  brief: ParsedMorningBrief;
  clientName: string;
}) {
  return (
    <article className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden">
      <header className="px-5 py-4 border-b border-ink-100 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-950/40">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-ink-400">
              CCO morning brief · {clientName}
            </div>
            <div className="text-xl font-semibold mt-0.5">{brief.date}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono uppercase tracking-wider text-ink-400">
              assembled
            </div>
            <div className="text-xs text-ink-500 mt-0.5">
              {brief.assembledAt ?? "—"}
            </div>
            <div className="text-[10px] font-mono text-ink-400 mt-1">
              ~90s read
            </div>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 space-y-6">
        {brief.sections.map((s) => (
          <section key={s.heading}>
            <h3 className="text-sm font-mono uppercase tracking-wider text-ink-500 mb-2">
              {s.heading}
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold">
              <Markdown>{s.body}</Markdown>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
