import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";
import {
  isGithubConfigured,
  mutateFileOnGithub,
  persistenceMode,
} from "@/lib/github-write";

export const runtime = "nodejs";
export const maxDuration = 30;

const REPO_ROOT = path.resolve(process.cwd(), "..");

type SignBody = {
  client: string;
  askId: string;
  decision: "approve" | "approve-with-modifications" | "decline" | "send-back";
  comment: string;
  signer: string;
  date?: string;
};

const findClientFolder = (slug: string): string | null => {
  const direct = path.join(REPO_ROOT, "clients", slug);
  if (fs.existsSync(path.join(direct, "client-profile.md"))) return direct;
  const inExamples = path.join(REPO_ROOT, "clients", "_examples", slug);
  if (fs.existsSync(path.join(inExamples, "client-profile.md"))) return inExamples;
  return null;
};

const latestDateFolder = (root: string): string | null => {
  if (!fs.existsSync(root)) return null;
  const dates = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(d.name))
    .map((d) => d.name)
    .sort()
    .reverse();
  return dates[0] ?? null;
};

const decisionLabel = (d: SignBody["decision"]): string => {
  switch (d) {
    case "approve":
      return "Approve";
    case "approve-with-modifications":
      return "Approve with modifications";
    case "decline":
      return "Decline";
    case "send-back":
      return "Send back";
  }
};

/**
 * Pure mutation: given a queue.md, an ask id, a decision, a comment, and a signer,
 * returns the updated queue.md content. Throws if the ask is not found in pending.
 */
function mutateQueue({
  raw,
  askId,
  decision,
  comment,
  signer,
}: {
  raw: string;
  askId: string;
  decision: SignBody["decision"];
  comment: string;
  signer: string;
}): { next: string; auditRow: string; decidedAt: string; submittedDate: string } {
  // Locate the ### <askId> ... block (ends at next ### , next ## , or EOF)
  const escaped = askId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const blockRe = new RegExp(`### ${escaped}[\\s\\S]+?(?=\\n### |\\n## |$)`);
  const blockMatch = raw.match(blockRe);
  if (!blockMatch) {
    throw new Error(`ask ${askId} not found in pending queue`);
  }
  const askBlock = blockMatch[0];

  const submittedAtMatch = askBlock.match(/^-\s+\*\*Submitted:\*\*\s+(\S+)/m);
  const submittedAt = submittedAtMatch ? submittedAtMatch[1] : "";
  const submittedDate = submittedAt.split("T")[0] || "—";

  const decidedAt = new Date().toISOString().slice(0, 16);
  const decisionText = decisionLabel(decision);
  const commentSuffix = comment ? ` — ${comment.replace(/\|/g, "/").replace(/\n/g, " ")}` : "";
  const auditRow = `| ${askId} | ${submittedDate} | ${decisionText}${commentSuffix} | ${signer} | ${decidedAt} |`;

  // Remove the ask block + collapse triple newlines
  let next = raw.replace(askBlock, "").replace(/\n{3,}/g, "\n\n");

  // Insert audit row in Recently signed table
  const recentSectionRe = /## Recently signed[^\n]*\n[\s\S]*?(?=\n## |$)/;
  const recentMatch = next.match(recentSectionRe);
  if (recentMatch) {
    const recentSection = recentMatch[0];
    const tableHeaderRe = /(\| -+ \|[\s\S]*?)(?=\n\n|$)/;
    const tableMatch = recentSection.match(tableHeaderRe);
    if (tableMatch) {
      const updatedSection = recentSection.replace(
        tableMatch[1],
        tableMatch[1].trimEnd() + "\n" + auditRow,
      );
      next = next.replace(recentSection, updatedSection);
    } else {
      const sectionWithTable = recentSection.replace(
        /(## Recently signed[^\n]*\n)/,
        `$1\n| Decision-Ask ID | Submitted | Decision | Decided by | Decided at |\n|---|---|---|---|---|\n${auditRow}\n`,
      );
      next = next.replace(recentSection, sectionWithTable);
    }
  } else {
    next +=
      `\n## Recently signed (last 7 days — audit trail)\n\n` +
      `| Decision-Ask ID | Submitted | Decision | Decided by | Decided at |\n` +
      `|---|---|---|---|---|\n` +
      `${auditRow}\n`;
  }

  return { next, auditRow, decidedAt, submittedDate };
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Partial<SignBody>;
  const { client, askId, decision, comment, signer } = body;
  const date = body.date;

  if (!client || !askId || !decision || !signer) {
    return Response.json(
      { error: "client, askId, decision, signer required" },
      { status: 400 },
    );
  }

  const mode = persistenceMode();
  const decisionText = decisionLabel(decision);

  // GitHub mode: read from GitHub, mutate, commit back.
  if (mode === "github") {
    const folder = findClientFolder(client);
    if (!folder) {
      return Response.json(
        { error: `client ${client} not found in repo` },
        { status: 404 },
      );
    }

    // Date discovery: when github mode + no override, infer from local FS
    // (the deployed snapshot reflects the structure at deploy time; date folders
    // are stable post-creation).
    const root = path.join(folder, "cco", "decision-asks");
    const targetDate = date ?? latestDateFolder(root);
    if (!targetDate) {
      return Response.json({ error: "no decision-asks queue date found" }, { status: 404 });
    }

    const repoRelativePath = path.relative(REPO_ROOT, path.join(root, targetDate, "queue.md"));

    try {
      const result = await mutateFileOnGithub({
        filePath: repoRelativePath,
        mutate: (raw) =>
          mutateQueue({ raw, askId, decision, comment: comment ?? "", signer }).next,
        message: `CCO sign: ${askId} — ${decisionText} by ${signer}\n\nDecision: ${decisionText}\nSigner: ${signer}\nClient: ${client}\nDecided at: ${new Date().toISOString()}\nComment: ${(comment ?? "").trim() || "—"}\n\nvia decision-router · POST /api/decision-ask/sign`,
      });
      return Response.json({
        ok: true,
        mode: "github",
        askId,
        decision: decisionText,
        signer,
        commitSha: result.commitSha,
        commitUrl: result.commitUrl,
        note:
          "Persisted via GitHub commit. Page refresh after a moment will show updated queue (read-time depends on next deploy / static-revalidation cadence).",
      });
    } catch (e) {
      return Response.json(
        {
          error: "GitHub write-back failed",
          detail: (e as Error).message,
          mode: "github",
        },
        { status: 500 },
      );
    }
  }

  // Local-FS mode: read + write filesystem.
  const folder = findClientFolder(client);
  if (!folder) {
    return Response.json({ error: `client ${client} not found` }, { status: 404 });
  }

  const root = path.join(folder, "cco", "decision-asks");
  const targetDate = date ?? latestDateFolder(root);
  if (!targetDate) {
    return Response.json({ error: "no decision-asks queue found" }, { status: 404 });
  }
  const queuePath = path.join(root, targetDate, "queue.md");
  if (!fs.existsSync(queuePath)) {
    return Response.json({ error: `queue not found at ${queuePath}` }, { status: 404 });
  }

  const raw = fs.readFileSync(queuePath, "utf8");
  let mutated;
  try {
    mutated = mutateQueue({ raw, askId, decision, comment: comment ?? "", signer });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 404 });
  }

  try {
    fs.writeFileSync(queuePath, mutated.next, "utf8");
  } catch (e) {
    return Response.json(
      {
        error: "filesystem write failed",
        detail: (e as Error).message,
        mode: "local",
        note: isGithubConfigured()
          ? "GITHUB_TOKEN is set — set PERSISTENCE_MODE=github to use durable GitHub write-back."
          : "Set GITHUB_TOKEN + PERSISTENCE_MODE=github (or auto) for durable persistence.",
      },
      { status: 500 },
    );
  }

  return Response.json({
    ok: true,
    mode: "local",
    askId,
    decision: decisionText,
    signer,
    decidedAt: mutated.decidedAt,
    queuePath: queuePath.replace(REPO_ROOT, ""),
    note:
      process.env.VERCEL && !isGithubConfigured()
        ? "Vercel filesystem is ephemeral — sign will not persist after this request. Set GITHUB_TOKEN to enable durable GitHub write-back."
        : undefined,
  });
}
