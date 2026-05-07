import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";

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

  // Locate the ask block
  const blockRe = new RegExp(`### ${askId.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}[\\s\\S]+?(?=\\n### |\\n## |$)`);
  const blockMatch = raw.match(blockRe);
  if (!blockMatch) {
    return Response.json(
      { error: `ask ${askId} not found in pending queue` },
      { status: 404 },
    );
  }
  const askBlock = blockMatch[0];

  // Extract submitted date for the audit row
  const submittedAtMatch = askBlock.match(/^-\s+\*\*Submitted:\*\*\s+(\S+)/m);
  const submittedAt = submittedAtMatch ? submittedAtMatch[1] : "";
  const submittedDate = submittedAt.split("T")[0] || "—";

  // Build the recently-signed audit row
  const decidedAt = new Date().toISOString().slice(0, 16).replace("T", "T");
  const decisionText = decisionLabel(decision);
  const auditRow = `| ${askId} | ${submittedDate} | ${decisionText}${comment ? ` — ${comment.replace(/\|/g, "/")}` : ""} | ${signer} | ${decidedAt} |`;

  // Remove the ask block from Pending decisions section
  let next = raw.replace(askBlock, "").replace(/\n{3,}/g, "\n\n");

  // Insert audit row into the Recently-signed table.
  // Find the table; if not present, create it.
  const recentSignedHeaderRe = /## Recently signed[^\n]*\n[\s\S]*?(?=\n## |$)/;
  const recentMatch = next.match(recentSignedHeaderRe);
  if (recentMatch) {
    // The table is inside this section. Insert auditRow after the existing rows.
    const recentSection = recentMatch[0];
    const tableRowsMatch = recentSection.match(/(\| -+ \|[\s\S]*?)(?=\n\n|$)/);
    if (tableRowsMatch) {
      const updatedSection = recentSection.replace(
        tableRowsMatch[1],
        tableRowsMatch[1].trimEnd() + "\n" + auditRow,
      );
      next = next.replace(recentSection, updatedSection);
    } else {
      // No table yet; create a fresh one with header
      const tableHeader = `\n| Decision-Ask ID | Submitted | Decision | Decided by | Decided at |\n|---|---|---|---|---|\n${auditRow}\n`;
      const sectionWithTable = recentSection.replace(
        /## Recently signed[^\n]*\n/,
        `$&\n| Decision-Ask ID | Submitted | Decision | Decided by | Decided at |\n|---|---|---|---|---|\n${auditRow}\n`,
      );
      next = next.replace(recentSection, sectionWithTable);
    }
  } else {
    // No recently-signed section; append one
    next +=
      `\n## Recently signed (last 7 days — audit trail)\n\n` +
      `| Decision-Ask ID | Submitted | Decision | Decided by | Decided at |\n` +
      `|---|---|---|---|---|\n` +
      `${auditRow}\n`;
  }

  // Persistence: filesystem write. Works in dev; ephemeral on Vercel until 5B-3 adds GitHub write-back.
  try {
    fs.writeFileSync(queuePath, next, "utf8");
  } catch (e) {
    return Response.json(
      {
        error: "filesystem write failed",
        detail: (e as Error).message,
        note: "production durable persistence requires GitHub write-back (Phase 5B-3)",
      },
      { status: 500 },
    );
  }

  return Response.json({
    ok: true,
    askId,
    decision: decisionText,
    signer,
    decidedAt,
    queuePath: queuePath.replace(REPO_ROOT, ""),
    note: process.env.VERCEL
      ? "Vercel filesystem is ephemeral; sign persists for this deploy only. Phase 5B-3 will add GitHub write-back."
      : undefined,
  });
}
