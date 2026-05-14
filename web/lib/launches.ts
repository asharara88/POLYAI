import path from "node:path";
import fs from "node:fs";
import yaml from "js-yaml";

// Marketing-launches loader. A "launch" is a campaign attached to a project.
// Source of truth: clients/<slug>/campaigns/<campaignId>/campaign-brief.md
// — the structured ```yaml``` block inside that file.
//
// Reads every campaign under a client folder and returns parsed launch records
// for the /launches list and per-launch detail surfaces.

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

// Reuse the same client-folder resolution rule as content.ts: real client
// folder takes priority over examples folder, but examples are a valid fallback.
function findClientFolder(clientSlug: string): string | null {
  const direct = path.join(REPO_ROOT, "clients", clientSlug);
  if (exists(direct)) return direct;
  const example = path.join(REPO_ROOT, "clients", "_examples", clientSlug);
  if (exists(example)) return example;
  return null;
}

export type LaunchPhase =
  | "brief"
  | "creative"
  | "pre-launch"
  | "live"
  | "close-out"
  | "unknown";

export type LaunchMilestone = {
  date: string; // ISO date or descriptive string
  what: string;
};

export type LaunchChannel = {
  channel: string;
  weight: number; // 0..1
  rationale?: string;
};

export type LaunchSummary = {
  id: string;
  clientSlug: string;
  /** Display title — usually project name + " — " + launch label. */
  title: string;
  projectName: string;
  goal: string;
  primaryKpi: string;
  startDate: string | null;
  endDate: string | null;
  phase: LaunchPhase;
  /** Days until end_date; negative if past. */
  daysToClose: number | null;
  budgetTotal: string | null; // human display ("AED 165,000,000")
  budgetTotalAed: number | null; // numeric for charts / sorting
  ownerAgent: string;
  complianceFlags: string[];
};

export type Launch = LaunchSummary & {
  raw: string;
  briefBody: string;
  yaml: Record<string, unknown>;
  channels: LaunchChannel[];
  milestones: LaunchMilestone[];
  audience: Record<string, unknown> | null;
  positioning: Record<string, unknown> | null;
  budget: Record<string, unknown> | null;
  constraints: Record<string, unknown> | null;
  measurementPlan: Record<string, unknown> | null;
  dependencies: string[];
  humanApprovalRequired: string[];
  /** Other markdown files in the campaign folder — creative briefs etc. */
  briefFiles: string[];
};

function extractYamlBlock(raw: string): string | null {
  // Find a fenced ```yaml ... ``` block (case-insensitive)
  const m = raw.match(/```ya?ml\s*\n([\s\S]*?)```/i);
  return m ? m[1] : null;
}

function parseYaml(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    const parsed = yaml.load(raw, { schema: yaml.JSON_SCHEMA });
    return (parsed && typeof parsed === "object") ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function asString(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  return "";
}

function asNumber(v: unknown): number | null {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^\d.-]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function asObject(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
}

function parseMilestones(raw: unknown): LaunchMilestone[] {
  const arr = asArray(raw);
  const out: LaunchMilestone[] = [];
  for (const entry of arr) {
    if (typeof entry === "string") {
      // Pattern "2026-05-13: Pre-launch teaser to existing CRM"
      const m = entry.match(/^(\S+):\s*(.+)$/);
      if (m) {
        out.push({ date: m[1], what: m[2].trim() });
        continue;
      }
      out.push({ date: "", what: entry });
      continue;
    }
    if (entry && typeof entry === "object") {
      const obj = entry as Record<string, unknown>;
      const keys = Object.keys(obj);
      // YAML inline mapping: { "2026-05-13": "..." }
      if (keys.length === 1) {
        const k = keys[0];
        out.push({ date: k, what: asString(obj[k]) });
        continue;
      }
    }
  }
  return out;
}

function parseChannels(raw: unknown): LaunchChannel[] {
  return asArray(raw)
    .map((entry): LaunchChannel | null => {
      if (!entry || typeof entry !== "object") return null;
      const obj = entry as Record<string, unknown>;
      const channel = asString(obj.channel);
      if (!channel) return null;
      const weight = typeof obj.weight === "number" ? obj.weight : Number(obj.weight ?? 0) || 0;
      return {
        channel,
        weight,
        rationale: asString(obj.rationale) || undefined,
      };
    })
    .filter((c): c is LaunchChannel => c !== null);
}

function inferPhase(
  startDate: string | null,
  endDate: string | null,
  now: Date = new Date(),
): LaunchPhase {
  if (!startDate && !endDate) return "unknown";
  const start = startDate ? new Date(startDate + "T00:00:00") : null;
  const end = endDate ? new Date(endDate + "T00:00:00") : null;
  if (start && now < start) {
    const days = (start.getTime() - now.getTime()) / 86_400_000;
    if (days > 28) return "brief";
    if (days > 14) return "creative";
    return "pre-launch";
  }
  if (end && now > end) return "close-out";
  return "live";
}

function daysFromNow(iso: string | null, now: Date = new Date()): number | null {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return null;
  return Math.round((d.getTime() - now.getTime()) / 86_400_000);
}

function aedHuman(n: number | null): string | null {
  if (n == null) return null;
  if (n >= 1_000_000_000) return `AED ${(n / 1_000_000_000).toFixed(1)}bn`;
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `AED ${(n / 1_000).toFixed(0)}K`;
  return `AED ${n}`;
}

function buildSummary(
  clientSlug: string,
  campaignId: string,
  yamlObj: Record<string, unknown>,
  rawBody: string,
): LaunchSummary {
  const projectName = asString(yamlObj.project_name) || campaignId;
  const goal = asString(yamlObj.goal);
  const primaryKpi = asString(yamlObj.primary_kpi);
  const timeline = asObject(yamlObj.timeline);
  const startDate = timeline ? asString(timeline.start_date) || null : null;
  const endDate = timeline ? asString(timeline.end_date) || null : null;
  const budget = asObject(yamlObj.budget);
  const budgetTotalRaw = budget ? budget.total : null;
  const budgetTotalAed = asNumber(budgetTotalRaw);
  const budgetTotal = typeof budgetTotalRaw === "string"
    ? budgetTotalRaw
    : aedHuman(budgetTotalAed);
  const constraints = asObject(yamlObj.constraints);
  const complianceFlags = constraints ? asArray<string>(constraints.compliance_flags).map(String) : [];

  // Owner agent: try to read the "Owned by `agent-name`" line above the YAML
  const ownerMatch = rawBody.match(/Owned by\s+`([^`]+)`/);
  const ownerAgent = ownerMatch ? ownerMatch[1] : "strategy";

  return {
    id: campaignId,
    clientSlug,
    title: `${projectName} — ${displayLaunchSlug(campaignId)}`,
    projectName,
    goal,
    primaryKpi,
    startDate,
    endDate,
    phase: inferPhase(startDate, endDate),
    daysToClose: daysFromNow(endDate),
    budgetTotal: budgetTotal ?? null,
    budgetTotalAed,
    ownerAgent,
    complianceFlags,
  };
}

function displayLaunchSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export function getLaunch(clientSlug: string, launchId: string): Launch | null {
  const folder = findClientFolder(clientSlug);
  if (!folder) return null;
  const dir = path.join(folder, "campaigns", launchId);
  if (!exists(dir)) return null;
  const briefPath = path.join(dir, "campaign-brief.md");
  const raw = readFileSafe(briefPath);
  if (!raw) return null;
  const yamlBlock = extractYamlBlock(raw);
  const yamlObj = parseYaml(yamlBlock);
  const summary = buildSummary(clientSlug, launchId, yamlObj, raw);

  // Other md files in this campaign folder — creative briefs etc.
  let briefFiles: string[] = [];
  try {
    briefFiles = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile() && d.name.endsWith(".md") && d.name !== "campaign-brief.md")
      .map((d) => d.name);
  } catch {}

  // Strip the YAML block from the brief body so the prose section is rendered cleanly
  const briefBody = raw.replace(/```ya?ml\s*\n[\s\S]*?```/i, "").trim();

  return {
    ...summary,
    raw,
    briefBody,
    yaml: yamlObj,
    channels: parseChannels(yamlObj.channels),
    milestones: parseMilestones(asObject(yamlObj.timeline)?.milestones),
    audience: asObject(yamlObj.audience),
    positioning: asObject(yamlObj.positioning),
    budget: asObject(yamlObj.budget),
    constraints: asObject(yamlObj.constraints),
    measurementPlan: asObject(yamlObj.measurement_plan),
    dependencies: asArray<string>(yamlObj.dependencies).map(String),
    humanApprovalRequired: asArray<string>(yamlObj.human_approval_required).map(String),
    briefFiles,
  };
}

export function getLaunches(clientSlug: string): LaunchSummary[] {
  const folder = findClientFolder(clientSlug);
  if (!folder) return [];
  const campaignsRoot = path.join(folder, "campaigns");
  if (!exists(campaignsRoot)) return [];
  const launchDirs = fs
    .readdirSync(campaignsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "archive" && !d.name.startsWith("."))
    .map((d) => d.name);

  const out: LaunchSummary[] = [];
  for (const id of launchDirs) {
    const briefPath = path.join(campaignsRoot, id, "campaign-brief.md");
    const raw = readFileSafe(briefPath);
    if (!raw) continue;
    const yamlObj = parseYaml(extractYamlBlock(raw));
    out.push(buildSummary(clientSlug, id, yamlObj, raw));
  }
  // Active launches first (live / pre-launch / creative / brief), close-out last
  const phaseOrder: Record<LaunchPhase, number> = {
    live: 0,
    "pre-launch": 1,
    creative: 2,
    brief: 3,
    "close-out": 4,
    unknown: 5,
  };
  return out.sort((a, b) => {
    const dp = phaseOrder[a.phase] - phaseOrder[b.phase];
    if (dp !== 0) return dp;
    return (a.daysToClose ?? 9999) - (b.daysToClose ?? 9999);
  });
}

export const PHASE_LABEL: Record<LaunchPhase, string> = {
  brief: "Brief",
  creative: "Creative",
  "pre-launch": "Pre-launch",
  live: "Live",
  "close-out": "Close-out",
  unknown: "—",
};

export const PHASE_TONE: Record<LaunchPhase, "neutral" | "info" | "accent" | "success" | "warning"> = {
  brief: "neutral",
  creative: "info",
  "pre-launch": "warning",
  live: "success",
  "close-out": "neutral",
  unknown: "neutral",
};

// ---------- Authored launch events ----------
//
// Events live one-per-file under
//   clients/<slug>/campaigns/<launchId>/events/<eventId>.md
// with a fenced ```yaml``` block at the top. Each file is one event the
// launch is running (sales-gallery preview, broker night, wealth-channel
// preview, public ribbon-cutting, owner reception, etc).
//
// Compared to the milestone-derived events on launch.milestones, authored
// events carry attendance state, an invitee slate broken down by protocol
// tier, the run-sheet pointer, and the owning agent — i.e. the surface a
// real event-ops thread runs against.

export type EventStatus = "planning" | "confirmed" | "live" | "closed";

export type ProtocolTier =
  | "vvip"
  | "vip"
  | "wealth-channel"
  | "broker"
  | "press"
  | "investor"
  | "owner"
  | "internal";

export type EventInviteeBlock = {
  tier: ProtocolTier;
  /** Display label for the tier (overrides the default per-tier label). */
  label?: string;
  invited: number;
  accepted: number;
  declined: number;
  pending: number;
  attended?: number;
  notes?: string;
};

export type LaunchEvent = {
  id: string;
  launchId: string;
  clientSlug: string;
  title: string;
  date: string;
  time?: string;
  venue?: string;
  status: EventStatus;
  ownerAgent: string;
  coOwners: string[];
  capacity?: number;
  runSheetPath?: string;
  attendance: {
    invited: number;
    accepted: number;
    declined: number;
    pending: number;
    attended: number;
  };
  invitees: EventInviteeBlock[];
  notes?: string;
};

function totalsFromInvitees(blocks: EventInviteeBlock[]): LaunchEvent["attendance"] {
  return blocks.reduce(
    (acc, b) => ({
      invited: acc.invited + (b.invited || 0),
      accepted: acc.accepted + (b.accepted || 0),
      declined: acc.declined + (b.declined || 0),
      pending: acc.pending + (b.pending || 0),
      attended: acc.attended + (b.attended || 0),
    }),
    { invited: 0, accepted: 0, declined: 0, pending: 0, attended: 0 },
  );
}

function parseInviteeBlocks(raw: unknown): EventInviteeBlock[] {
  return asArray(raw)
    .map((entry): EventInviteeBlock | null => {
      const obj = asObject(entry);
      if (!obj) return null;
      const tierRaw = asString(obj.tier).toLowerCase();
      const allowed: ProtocolTier[] = [
        "vvip",
        "vip",
        "wealth-channel",
        "broker",
        "press",
        "investor",
        "owner",
        "internal",
      ];
      const tier = (allowed as string[]).includes(tierRaw)
        ? (tierRaw as ProtocolTier)
        : ("internal" as ProtocolTier);
      return {
        tier,
        label: asString(obj.label) || undefined,
        invited: asNumber(obj.invited) ?? 0,
        accepted: asNumber(obj.accepted) ?? 0,
        declined: asNumber(obj.declined) ?? 0,
        pending: asNumber(obj.pending) ?? 0,
        attended: asNumber(obj.attended) ?? undefined,
        notes: asString(obj.notes) || undefined,
      };
    })
    .filter((b): b is EventInviteeBlock => b !== null);
}

export function getLaunchEvents(clientSlug: string, launchId: string): LaunchEvent[] {
  const folder = findClientFolder(clientSlug);
  if (!folder) return [];
  const eventsDir = path.join(folder, "campaigns", launchId, "events");
  if (!exists(eventsDir)) return [];

  let entries: string[] = [];
  try {
    entries = fs
      .readdirSync(eventsDir, { withFileTypes: true })
      .filter((d) => d.isFile() && d.name.endsWith(".md"))
      .map((d) => d.name);
  } catch {
    return [];
  }

  const out: LaunchEvent[] = [];
  for (const file of entries) {
    const raw = readFileSafe(path.join(eventsDir, file));
    if (!raw) continue;
    const yamlObj = parseYaml(extractYamlBlock(raw));
    if (!yamlObj || Object.keys(yamlObj).length === 0) continue;

    const id = asString(yamlObj.event_id) || file.replace(/\.md$/, "");
    const invitees = parseInviteeBlocks(yamlObj.invitees);

    // Attendance: prefer explicit `attendance:` block, else derive from invitees.
    const explicitAttendance = asObject(yamlObj.attendance);
    const attendance = explicitAttendance
      ? {
          invited: asNumber(explicitAttendance.invited) ?? 0,
          accepted: asNumber(explicitAttendance.accepted) ?? 0,
          declined: asNumber(explicitAttendance.declined) ?? 0,
          pending: asNumber(explicitAttendance.pending) ?? 0,
          attended: asNumber(explicitAttendance.attended) ?? 0,
        }
      : totalsFromInvitees(invitees);

    const statusRaw = asString(yamlObj.status).toLowerCase();
    const status: EventStatus = (
      ["planning", "confirmed", "live", "closed"].includes(statusRaw)
        ? statusRaw
        : "planning"
    ) as EventStatus;

    out.push({
      id,
      launchId,
      clientSlug,
      title: asString(yamlObj.title) || id,
      date: asString(yamlObj.date),
      time: asString(yamlObj.time) || undefined,
      venue: asString(yamlObj.venue) || undefined,
      status,
      ownerAgent: asString(yamlObj.owner_agent) || "events",
      coOwners: asArray<string>(yamlObj.co_owners).map(String),
      capacity: asNumber(yamlObj.capacity) ?? undefined,
      runSheetPath: asString(yamlObj.run_sheet) || undefined,
      attendance,
      invitees,
      notes: asString(yamlObj.notes) || undefined,
    });
  }

  // Sort by date ascending (events without a date sink to the bottom).
  return out.sort((a, b) => {
    if (a.date && b.date) return a.date.localeCompare(b.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return a.title.localeCompare(b.title);
  });
}

export const TIER_LABEL: Record<ProtocolTier, string> = {
  vvip: "VVIP — royal & ministerial",
  vip: "VIP — HNI & family-office principals",
  "wealth-channel": "Wealth-channel intermediaries",
  broker: "Tier-1 brokers",
  press: "Press",
  investor: "Invitation-only investors",
  owner: "Existing owners",
  internal: "Internal — sales gallery & ops",
};

export const TIER_TONE: Record<ProtocolTier, string> = {
  vvip: "purple",
  vip: "accent",
  "wealth-channel": "info",
  broker: "info",
  press: "warning",
  investor: "accent",
  owner: "success",
  internal: "neutral",
};

export const STATUS_LABEL: Record<EventStatus, string> = {
  planning: "Planning",
  confirmed: "Confirmed",
  live: "Live now",
  closed: "Closed",
};

export const STATUS_TONE: Record<EventStatus, "neutral" | "info" | "accent" | "success" | "warning"> = {
  planning: "neutral",
  confirmed: "info",
  live: "warning",
  closed: "success",
};
