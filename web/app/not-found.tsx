import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";
import { Card } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card padded className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-10 h-10 rounded-full bg-info-100 dark:bg-info-950/40 text-info-600 dark:text-info-400 flex items-center justify-center">
            <Compass className="w-5 h-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="text-title font-semibold tracking-tight">
              Not found
            </h1>
            <p className="text-body-sm text-ink-500 mt-1">
              The page you tried to reach doesn&rsquo;t exist or hasn&rsquo;t been built
              yet. If you arrived from a stale link, the underlying client / agent /
              runbook may have been renamed or moved.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md bg-accent text-white px-3 py-1.5 text-body-sm font-medium hover:bg-accent-600 transition-colors"
          >
            <Home className="w-3.5 h-3.5" aria-hidden />
            Back to overview
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200 px-3 py-1.5 text-body-sm font-medium hover:bg-ink-200 dark:hover:bg-ink-700 transition-colors"
          >
            <Search className="w-3.5 h-3.5" aria-hidden />
            Search
          </Link>
          <span className="ml-auto text-label-xs font-mono text-ink-400">
            tip: <kbd className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800">⌘ K</kbd> for command palette
          </span>
        </div>
      </Card>
    </div>
  );
}
