import { getAgents, getClients, getRunbooks, getSchemas, getSkills, getVerticals } from "@/lib/content";
import type { PaletteEntry } from "@/components/CommandPalette";

export function buildPaletteEntries(): PaletteEntry[] {
  const out: PaletteEntry[] = [];

  for (const c of getClients()) {
    out.push({
      id: `client-${c.slug}`,
      label: c.displayName ?? c.slug,
      hint: c.isExample ? "example" : c.vertical,
      group: "Clients",
      href: `/clients/${c.slug}`,
      kind: "client",
    });
  }
  for (const a of getAgents()) {
    out.push({
      id: `agent-${a.name}`,
      label: a.name,
      hint: a.model ?? "agent",
      group: "Agents",
      href: `/agents/${a.name}`,
      kind: "agent",
    });
  }
  for (const r of getRunbooks()) {
    out.push({
      id: `runbook-${r.slug}`,
      label: r.title,
      hint: "runbook",
      group: "Runbooks",
      href: `/runbooks/${r.slug}`,
      kind: "runbook",
    });
  }
  for (const s of getSkills()) {
    out.push({
      id: `skill-${s.slug}`,
      label: s.title,
      hint: "skill",
      group: "Skills",
      href: `/skills/${s.slug}`,
      kind: "skill",
    });
  }
  for (const s of getSchemas()) {
    out.push({
      id: `schema-${s.name}`,
      label: s.name,
      hint: "schema",
      group: "Schemas",
      href: `/schemas/${s.name}`,
      kind: "schema",
    });
  }
  for (const v of getVerticals()) {
    out.push({
      id: `vertical-${v.name}`,
      label: v.name,
      hint: "vertical",
      group: "Verticals",
      href: `/verticals/${v.name}`,
      kind: "vertical",
    });
  }

  return out;
}
