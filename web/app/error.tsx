"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Flow error boundary]", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card padded className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-10 h-10 rounded-full bg-danger-100 dark:bg-danger-950/40 text-danger-600 dark:text-danger-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="text-title font-semibold tracking-tight">
              Something went wrong
            </h1>
            <p className="text-body-sm text-ink-500 mt-1">
              An unexpected error occurred while rendering this page. The error has
              been logged. Try the recovery actions below.
            </p>
          </div>
        </div>

        {error.message && (
          <details className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/40 px-3 py-2 text-body-xs font-mono text-ink-600 dark:text-ink-300">
            <summary className="cursor-pointer text-label-sm uppercase tracking-wider text-ink-400">
              error detail
            </summary>
            <div className="mt-2 whitespace-pre-wrap break-words">
              {error.message}
              {error.digest && (
                <div className="mt-1 opacity-70">digest: {error.digest}</div>
              )}
            </div>
          </details>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent text-white px-3 py-1.5 text-body-sm font-medium hover:bg-accent-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200 px-3 py-1.5 text-body-sm font-medium hover:bg-ink-200 dark:hover:bg-ink-700 transition-colors"
          >
            <Home className="w-3.5 h-3.5" aria-hidden />
            Back to overview
          </Link>
        </div>
      </Card>
    </div>
  );
}
