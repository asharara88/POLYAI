import { NextRequest } from "next/server";
import { getAgents, getClients, getSchemas, getVerticals, getClient } from "@/lib/content";

export const runtime = "nodejs";

type Hit = { kind: string; title: string; href: string; snippet: string };

const trimSnippet = (text: string, q: string, len = 140) => {
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text.slice(0, len) + (text.length > len ? "…" : "");
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + q.length + 80);
  return (start > 0 ? "…" : "") + text.slice(start, end).replace(/\s+/g, " ").trim() + (end < text.length ? "…" : "");
};

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (!q) return Response.json({ hits: [] });

  const ql = q.toLowerCase();
  const hits: Hit[] = [];

  for (const a of getAgents()) {
    const hay = `${a.name}\n${a.description}\n${a.body}`;
    if (hay.toLowerCase().includes(ql)) {
      hits.push({ kind: "agent", title: a.name, href: `/agents/${a.name}`, snippet: trimSnippet(hay, q) });
    }
  }
  for (const v of getVerticals()) {
    if (`${v.name}\n${v.body}`.toLowerCase().includes(ql)) {
      hits.push({ kind: "vertical", title: v.name, href: `/verticals/${v.name}`, snippet: trimSnippet(v.body, q) });
    }
  }
  for (const s of getSchemas()) {
    if (`${s.name}\n${s.body}`.toLowerCase().includes(ql)) {
      hits.push({ kind: "schema", title: s.name, href: `/schemas/${s.name}`, snippet: trimSnippet(s.body, q) });
    }
  }
  for (const c of getClients()) {
    const full = getClient(c.slug);
    if (!full) continue;
    const hay = [c.slug, c.displayName, full.profile, full.icp, full.brandVoice, full.decisions, full.results].join("\n");
    if (hay.toLowerCase().includes(ql)) {
      hits.push({
        kind: "client",
        title: c.displayName ?? c.slug,
        href: `/clients/${c.slug}`,
        snippet: trimSnippet(hay, q),
      });
    }
  }

  return Response.json({ hits: hits.slice(0, 50) });
}
