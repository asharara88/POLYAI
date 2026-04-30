export const dynamic = "force-dynamic";
export const revalidate = 60;

const REPO = "asharara88/polyai";

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

export default async function Page() {
  const result = await fetchOpenPRs();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Approvals</h1>
        <p className="text-ink-500 dark:text-ink-400 mt-2 max-w-2xl text-sm">
          Open PRs on{" "}
          <a
            href={`https://github.com/${REPO}`}
            className="text-accent hover:underline"
            target="_blank"
            rel="noopener"
          >
            {REPO}
          </a>
          . The orchestrator opens PRs for human-gated work; review and merge there.
        </p>
      </header>

      {"error" in result ? (
        <div className="rounded-md border border-amber-300/40 bg-amber-50/40 dark:bg-amber-950/20 px-4 py-3 text-sm">
          {result.error}
        </div>
      ) : result.length === 0 ? (
        <div className="rounded-md border border-dashed border-ink-300/70 dark:border-ink-700 px-4 py-6 text-sm text-ink-500">
          No open PRs.
        </div>
      ) : (
        <ul className="space-y-2">
          {result.map((pr) => (
            <li
              key={pr.number}
              className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <a
                    href={pr.html_url}
                    target="_blank"
                    rel="noopener"
                    className="font-medium hover:underline"
                  >
                    #{pr.number} · {pr.title}
                  </a>
                  <div className="mt-1 text-xs font-mono text-ink-400">
                    {pr.user.login} · {pr.head.ref} → {pr.base.ref} · opened{" "}
                    {new Date(pr.created_at).toLocaleDateString()}
                    {pr.draft ? " · draft" : ""}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {pr.labels.map((l) => (
                    <span
                      key={l.name}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300"
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
    </div>
  );
}
