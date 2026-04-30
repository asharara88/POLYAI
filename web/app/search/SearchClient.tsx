"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Hit = { kind: string; title: string; href: string; snippet: string };

const kindBadge = (k: string) =>
  ({
    agent: "bg-accent/15 text-accent",
    client: "bg-ink-200/60 dark:bg-ink-800 text-ink-700 dark:text-ink-200",
    vertical: "bg-ink-200/60 dark:bg-ink-800 text-ink-700 dark:text-ink-200",
    schema: "bg-ink-200/60 dark:bg-ink-800 text-ink-700 dark:text-ink-200",
  })[k] ?? "bg-ink-200/60 text-ink-600";

export default function SearchClient() {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setHits([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const j = await r.json();
        setHits(j.hits ?? []);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="space-y-4">
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="search…"
        className="w-full rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 px-4 py-3 text-sm font-mono"
      />

      <div className="text-xs font-mono text-ink-400">
        {loading ? "searching…" : q ? `${hits.length} ${hits.length === 1 ? "hit" : "hits"}` : "type to search"}
      </div>

      <div className="space-y-2">
        {hits.map((h, i) => (
          <Link
            key={i}
            href={h.href}
            className="block rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-accent/60 px-4 py-3"
          >
            <div className="flex items-baseline gap-2">
              <span className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${kindBadge(h.kind)}`}>
                {h.kind}
              </span>
              <span className="font-medium text-sm">{h.title}</span>
            </div>
            <div className="text-xs text-ink-500 dark:text-ink-400 mt-1.5 line-clamp-2">{h.snippet}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
