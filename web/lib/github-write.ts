// GitHub write-back helper for durable persistence beyond ephemeral filesystem.
// Used by /api/decision-ask/sign and any other route that mutates repo content
// from a serverless environment.
//
// Configuration (env vars):
//   GITHUB_TOKEN   — token with repo:contents:write scope (server-only)
//   GITHUB_REPO    — "owner/repo" (default: "asharara88/polyai")
//   GITHUB_BRANCH  — branch to commit to (default: "main")
//
// Read path: HTTP GET /repos/<repo>/contents/<path>?ref=<branch>
// Write path: HTTP PUT /repos/<repo>/contents/<path> with { message, content (base64), sha, branch }
// Conflict handling: refetch SHA + retry once on 409/412 (precondition failed)

const DEFAULT_REPO = "asharara88/polyai";
const DEFAULT_BRANCH = "main";

type GitHubFileResponse = {
  type: string;
  sha: string;
  content: string; // base64
  encoding: "base64";
  path: string;
  html_url: string;
  download_url: string;
};

type CommitResponse = {
  content: { sha: string; html_url: string; path: string };
  commit: { sha: string; html_url: string; message: string };
};

export type PersistenceMode = "local" | "github" | "auto";

export function persistenceMode(): "local" | "github" {
  const explicit = process.env.PERSISTENCE_MODE as PersistenceMode | undefined;
  if (explicit === "local") return "local";
  if (explicit === "github") return "github";
  // auto: github if token, else local
  return process.env.GITHUB_TOKEN ? "github" : "local";
}

export function isGithubConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

function repoSlug(): string {
  return process.env.GITHUB_REPO ?? DEFAULT_REPO;
}

function defaultBranch(): string {
  return process.env.GITHUB_BRANCH ?? DEFAULT_BRANCH;
}

function authHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");
  return {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${token}`,
    "x-github-api-version": "2022-11-28",
  };
}

export async function readFileFromGithub(
  filePath: string,
  branch?: string,
): Promise<{ content: string; sha: string; htmlUrl: string } | null> {
  const repo = repoSlug();
  const ref = branch ?? defaultBranch();
  const url = `https://api.github.com/repos/${repo}/contents/${encodeURI(filePath)}?ref=${encodeURIComponent(ref)}`;

  const r = await fetch(url, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (r.status === 404) return null;
  if (!r.ok) {
    throw new Error(`GitHub read ${r.status}: ${await r.text()}`);
  }
  const j = (await r.json()) as GitHubFileResponse;
  if (j.encoding !== "base64") {
    throw new Error(`unexpected encoding: ${j.encoding}`);
  }
  const content = Buffer.from(j.content, "base64").toString("utf8");
  return { content, sha: j.sha, htmlUrl: j.html_url };
}

export async function commitFileToGithub({
  filePath,
  newContent,
  message,
  branch,
  expectedSha,
}: {
  filePath: string;
  newContent: string;
  message: string;
  branch?: string;
  expectedSha: string;
}): Promise<{ commitSha: string; commitUrl: string; fileSha: string }> {
  const repo = repoSlug();
  const ref = branch ?? defaultBranch();
  const url = `https://api.github.com/repos/${repo}/contents/${encodeURI(filePath)}`;

  const body = {
    message,
    content: Buffer.from(newContent, "utf8").toString("base64"),
    sha: expectedSha,
    branch: ref,
  };

  const r = await fetch(url, {
    method: "PUT",
    headers: { ...authHeaders(), "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    throw new Error(`GitHub write ${r.status}: ${await r.text()}`);
  }
  const j = (await r.json()) as CommitResponse;
  return {
    commitSha: j.commit.sha,
    commitUrl: j.commit.html_url,
    fileSha: j.content.sha,
  };
}

/**
 * Read-mutate-write with optimistic concurrency: refetches + retries once on conflict.
 */
export async function mutateFileOnGithub({
  filePath,
  mutate,
  message,
  branch,
}: {
  filePath: string;
  mutate: (content: string) => string;
  message: string;
  branch?: string;
}): Promise<{ commitSha: string; commitUrl: string; before: string; after: string }> {
  const ref = branch ?? defaultBranch();
  let attempt = 0;
  while (attempt < 2) {
    attempt += 1;
    const current = await readFileFromGithub(filePath, ref);
    if (!current) {
      throw new Error(`file not found on GitHub: ${filePath}@${ref}`);
    }
    const before = current.content;
    const after = mutate(before);
    if (before === after) {
      return { commitSha: "", commitUrl: "", before, after };
    }
    try {
      const result = await commitFileToGithub({
        filePath,
        newContent: after,
        message,
        branch: ref,
        expectedSha: current.sha,
      });
      return {
        commitSha: result.commitSha,
        commitUrl: result.commitUrl,
        before,
        after,
      };
    } catch (e) {
      const msg = (e as Error).message;
      const isConflict = msg.includes("409") || msg.includes("412") || msg.includes("conflict");
      if (isConflict && attempt < 2) {
        // refetch + retry once
        continue;
      }
      throw e;
    }
  }
  throw new Error("mutateFileOnGithub: unreachable");
}

export function repoInfo() {
  return { repo: repoSlug(), branch: defaultBranch(), mode: persistenceMode() };
}
