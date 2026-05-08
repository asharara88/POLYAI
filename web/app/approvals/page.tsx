import Link from "next/link";
import { ExternalLink, GitPullRequest } from "lucide-react";
import { getClients, getDecisionAsks } from "@/lib/content";
import ApprovalsClientView from "@/components/ApprovalsClientView";
import LivePulse from "@/components/LivePulse";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const REPO = process.env.GITHUB_REPO ?? "asharara88/polyai";

type GhPR = {
  number: number;
  title: string;
  html_url: string;
  user: { login: string };
  created_at: string;
  draft: boolean;
  labels: { name: string; color: string }[];
  head: { ref: string };
  base: { ref: string };
};

async function fetchOpenPRs(): Promise<GhPR[] | { error: string }> {
  try {
    const headers: Record<string, string> = { accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const r = await fetch(
      `https://api.github.com/repos/${REPO}/pulls?state=open&per_page=50`,
      { headers, next: { revalidate: 60 } },
    );
    if (!r.ok) {
      if (r.status === 404 || r.status === 403) {
        return { error: "Repo is private or rate-limited. Add GITHUB_TOKEN as a Vercel env var to enable." };
      }
      return { error: `GitHub API ${r.status}` };
    }
    return (await r.json()) as GhPR[];
  } catch (e) {
    return { error: (e as Error).message };
  }
}

function clientsWithPendingAsks() {
  return getClients()
    .map((c) => ({ client: c, asks: getDecisionAsks(c.slug) }))
    .filter((x) => x.asks && x.asks.pending.length > 0)
    .map((x) => ({
      client: { slug: x.client.slug, displayName: x.client.displayName },
      asks: x.asks!,
    }));
}

export default async function Page() {
  const ghResult = await fetchOpenPRs();
  const ccoQueues = clientsWithPendingAsks();

  return (
    <div className="space-y-12">
      {/* CCO native queue (top) */}
      <section className="space-y-5">
        <header>
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-title-lg font-semibold tracking-tight">
                CCO decision-asks
              </h1>
              <p className="text-body-sm text-ink-500 dark:text-ink-400 mt-1.5 max-w-2xl">
                Decisions routed to the CCO by{" "}
                <code className="font-mono text-body-xs">decision-router</code> per client{" "}
                <code className="font-mono text-body-xs">approval_gates</code>. Filters
                persist per device. Sign action commits via GitHub when{" "}
                <code className="font-mono text-body-xs">GITHUB_TOKEN</code> is set.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <LivePulse autoMs={60_000} label="queue" />
              <Link
                href="/cco"
                className="text-label-xs font-mono uppercase tracking-wider text-accent hover:underline"
              >
                CCO Daily ›
              </Link>
            </div>
          </div>
        </header>

        <ApprovalsClientView groups={ccoQueues} />
      </section>

      {/* GitHub PRs (bottom — code-side approvals) */}
      <section className="space-y-4">
        <header>
          <h2 className="text-title font-semibold tracking-tight inline-flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-ink-500" aria-hidden />
            Code-side approvals (GitHub)
          </h2>
          <p className="text-body-sm text-ink-500 dark:text-ink-400 mt-1.5 max-w-2xl">
            Open PRs on{" "}
            <a
              href={`https://github.com/${REPO}`}
              className="text-accent hover:underline inline-flex items-center gap-1"
              target="_blank"
              rel="noopener"
            >
              {REPO}
              <ExternalLink className="w-3 h-3" aria-hidden />
            </a>{" "}
            for changes to agents, skills, runbooks, schemas, or web layer.
          </p>
        </header>

        {"error" in ghResult ? (
          <div className="rounded-card border border-warning-300/40 bg-warning-50/40 dark:bg-warning-950/20 px-4 py-3 text-body-sm">
            {ghResult.error}
          </div>
        ) : ghResult.length === 0 ? (
          <div className="rounded-card border border-dashed border-ink-300/70 dark:border-ink-700 px-4 py-6 text-body-sm text-ink-500">
            No open PRs.
          </div>
        ) : (
          <ul className="space-y-2">
            {ghResult.map((pr) => (
              <li
                key={pr.number}
                className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 px-4 py-3 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <a
                      href={pr.html_url}
                      target="_blank"
                      rel="noopener"
                      className="font-medium hover:underline inline-flex items-center gap-1"
                    >
                      #{pr.number} · {pr.title}
                      <ExternalLink className="w-3 h-3 text-ink-400" aria-hidden />
                    </a>
                    <div className="mt-1 text-label-xs font-mono text-ink-400">
                      {pr.user.login} · {pr.head.ref} → {pr.base.ref} · opened{" "}
                      {new Date(pr.created_at).toLocaleDateString()}
                      {pr.draft ? " · draft" : ""}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    {pr.labels.map((l) => (
                      <span
                        key={l.name}
                        className="text-label-xs font-mono px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300"
                      >
                        {l.name}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
