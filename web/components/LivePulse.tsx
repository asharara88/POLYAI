"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

function relTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

type Props = {
  autoMs?: number;
  label?: string;
};

export default function LivePulse({ autoMs = 60_000, label = "fresh" }: Props) {
  const router = useRouter();
  const [lastSync, setLastSync] = useState<number>(() => Date.now());
  const [, setTick] = useState(0);
  const [busy, setBusy] = useState(false);

  // Tick once a second to keep the relative-time label fresh
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Auto-refresh every autoMs (default 60s)
  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
      setLastSync(Date.now());
    }, autoMs);
    return () => clearInterval(id);
  }, [autoMs, router]);

  const refresh = () => {
    if (busy) return;
    setBusy(true);
    router.refresh();
    setLastSync(Date.now());
    setTimeout(() => setBusy(false), 600);
  };

  const elapsed = Date.now() - lastSync;
  const isFresh = elapsed < 5000;

  return (
    <span className="inline-flex items-center gap-2 text-label-xs font-mono uppercase tracking-wider text-ink-400">
      <span
        className={[
          "inline-block w-1.5 h-1.5 rounded-full",
          isFresh ? "bg-success-500 animate-pulse" : "bg-ink-300 dark:bg-ink-600",
        ].join(" ")}
        aria-hidden
      />
      <span>
        {label} · {relTime(elapsed)}
      </span>
      <button
        type="button"
        onClick={refresh}
        disabled={busy}
        title="Refresh now"
        aria-label="Refresh"
        className={[
          "inline-flex items-center justify-center w-6 h-6 rounded hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors",
          busy ? "opacity-60" : "",
        ].join(" ")}
      >
        <RefreshCw
          className={["w-3.5 h-3.5", busy ? "animate-spin" : ""].join(" ")}
          aria-hidden
        />
      </button>
    </span>
  );
}
