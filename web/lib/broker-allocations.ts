import path from "node:path";
import fs from "node:fs";
import yaml from "js-yaml";
import { getLaunches, type LaunchPhase } from "@/lib/launches";

// Broker-allocation loader.
//
// Source of truth: clients/<slug>/campaigns/<launchId>/broker-allocations.md
// — one or more fenced ```yaml``` blocks each holding an array of firm
// records:
//
//   - firm: "Driven Properties"
//     tier: 1
//     slots:
//       pre_launch: 6
//       launch_week: 12
//       post_launch: 18
//     notes: ...
//
// Phase keys are author-defined per launch (pre_launch / launch_week /
// post_launch on standard launches, pre_handover / handover_window /
// post_handover on the Yas Acres closed-launch). The loader preserves
// the phase keys in document order so the UI can render them as columns.

const REPO_ROOT = path.resolve(process.cwd(), "..");

const exists = (p: string) => {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
};

const readFileSafe = (p: string): string | null => {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
};

function findClientFolder(clientSlug: string): string | null {
  const direct = path.join(REPO_ROOT, "clients", clientSlug);
  if (exists(direct)) return direct;
  const example = path.join(REPO_ROOT, "clients", "_examples", clientSlug);
  if (exists(example)) return example;
  return null;
}

export type BrokerSlot = { phase: string; count: number };

export type BrokerAllocation = {
  launchId: string;
  clientSlug: string;
  firmName: string;
  tier: number;
  slots: BrokerSlot[];
  totalSlots: number;
  notes?: string;
};

function parseAllocationsFile(raw: string): Omit<BrokerAllocation, "launchId" | "clientSlug">[] {
  const blocks = raw.match(/```yaml[\s\S]*?```/g) ?? [];
  const out: Omit<BrokerAllocation, "launchId" | "clientSlug">[] = [];
  for (const block of blocks) {
    const cleaned = block.replace(/```yaml|```/g, "");
    let parsed: unknown;
    try {
      parsed = yaml.load(cleaned);
    } catch {
      continue;
    }
    if (!Array.isArray(parsed)) continue;
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const obj = item as Record<string, unknown>;
      const firmName = typeof obj.firm === "string" ? obj.firm.trim() : "";
      if (!firmName) continue;
      const tier = Number(obj.tier);
      const slotsObj =
        obj.slots && typeof obj.slots === "object"
          ? (obj.slots as Record<string, unknown>)
          : {};
      const slots: BrokerSlot[] = Object.entries(slotsObj).map(([phase, count]) => ({
        phase,
        count: Number(count) || 0,
      }));
      const totalSlots = slots.reduce((acc, s) => acc + s.count, 0);
      out.push({
        firmName,
        tier: Number.isFinite(tier) ? tier : 0,
        slots,
        totalSlots,
        notes: typeof obj.notes === "string" ? obj.notes.trim() : undefined,
      });
    }
  }
  return out;
}

export function getBrokerAllocations(
  clientSlug: string,
  launchId: string,
): BrokerAllocation[] {
  const folder = findClientFolder(clientSlug);
  if (!folder) return [];
  const filePath = path.join(folder, "campaigns", launchId, "broker-allocations.md");
  const raw = readFileSafe(filePath);
  if (!raw) return [];
  return parseAllocationsFile(raw).map((a) => ({
    ...a,
    launchId,
    clientSlug,
  }));
}

/**
 * Collect the unique phase keys across an allocation set, preserving the
 * document order of the first appearance. Used by the table renderer to
 * decide which columns to show.
 */
export function phaseColumns(allocations: BrokerAllocation[]): string[] {
  const seen = new Set<string>();
  const cols: string[] = [];
  for (const a of allocations) {
    for (const s of a.slots) {
      if (!seen.has(s.phase)) {
        seen.add(s.phase);
        cols.push(s.phase);
      }
    }
  }
  return cols;
}

export type LaunchForFirm = {
  launchId: string;
  title: string;
  phase: LaunchPhase;
  totalSlots: number;
  tier: number;
};

/**
 * Reverse-lookup: every launch a firm has any allocation on. Used by the
 * firm-detail page to render "Launches this firm is on".
 */
export function getLaunchesForFirm(
  clientSlug: string,
  firmName: string,
): LaunchForFirm[] {
  const launches = getLaunches(clientSlug);
  const out: LaunchForFirm[] = [];
  const needle = firmName.trim().toLowerCase();
  for (const launch of launches) {
    const allocations = getBrokerAllocations(clientSlug, launch.id);
    const hit = allocations.find((a) => a.firmName.trim().toLowerCase() === needle);
    if (hit) {
      out.push({
        launchId: launch.id,
        title: launch.title || launch.projectName || launch.id,
        phase: launch.phase,
        totalSlots: hit.totalSlots,
        tier: hit.tier,
      });
    }
  }
  return out;
}

export const PHASE_LABEL_HUMAN: Record<string, string> = {
  pre_launch: "Pre-launch",
  launch_week: "Launch week",
  post_launch: "Post-launch",
  pre_handover: "Pre-handover",
  handover_window: "Handover",
  post_handover: "Post-handover",
};

export function humanizePhaseKey(key: string): string {
  if (PHASE_LABEL_HUMAN[key]) return PHASE_LABEL_HUMAN[key];
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
