import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Repo root: when running `next build` from web/, the parent directory holds
// clients/, verticals/, .claude/agents/, schemas/, knowledge/.
export const REPO_ROOT = path.resolve(process.cwd(), "..");

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

const listDirs = (p: string): string[] => {
  if (!exists(p)) return [];
  return fs
    .readdirSync(p, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .map((d) => d.name);
};

const listFiles = (p: string, ext: string): string[] => {
  if (!exists(p)) return [];
  return fs
    .readdirSync(p, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith(ext))
    .map((d) => d.name);
};

// ---------- Clients ----------

export type ClientSummary = {
  slug: string;
  isExample: boolean;
  isTemplate: boolean;
  displayName?: string;
  vertical?: string;
  status?: string;
  primaryMarket?: string;
  campaigns: string[];
};

const CLIENT_ROOT = path.join(REPO_ROOT, "clients");

const readClientFolder = (folder: string, slug: string): ClientSummary => {
  const profilePath = path.join(folder, "client-profile.md");
  const profile = readFileSafe(profilePath);
  const yamlBlock = profile?.match(/```yaml([\s\S]*?)```/)?.[1] ?? "";

  const grab = (key: string): string | undefined => {
    const re = new RegExp(`^${key}:\\s*(.+)$`, "m");
    const m = yamlBlock.match(re);
    if (!m) return undefined;
    return m[1].trim().replace(/^['"]|['"]$/g, "");
  };

  const grabNested = (parent: string, key: string): string | undefined => {
    const re = new RegExp(`^${parent}:[\\s\\S]*?^\\s+${key}:\\s*(.+)$`, "m");
    const m = yamlBlock.match(re);
    if (!m) return undefined;
    return m[1].trim().replace(/^['"]|['"]$/g, "");
  };

  return {
    slug,
    isExample: folder.includes("/_examples/"),
    isTemplate: slug === "_template",
    displayName: grab("display_name") ?? slug,
    vertical: grab("vertical"),
    status: grab("status"),
    primaryMarket: grabNested("markets", "primary"),
    campaigns: listDirs(path.join(folder, "campaigns")).filter((c) => c !== "archive"),
  };
};

export const getClients = (): ClientSummary[] => {
  const out: ClientSummary[] = [];

  // Real clients (top-level dirs in clients/, excluding _template + _examples)
  for (const slug of listDirs(CLIENT_ROOT)) {
    if (slug === "_template" || slug === "_examples") continue;
    out.push(readClientFolder(path.join(CLIENT_ROOT, slug), slug));
  }

  // Examples
  const examplesRoot = path.join(CLIENT_ROOT, "_examples");
  for (const slug of listDirs(examplesRoot)) {
    out.push(readClientFolder(path.join(examplesRoot, slug), slug));
  }

  return out.sort((a, b) => Number(a.isExample) - Number(b.isExample) || a.slug.localeCompare(b.slug));
};

const findClientFolder = (slug: string): string | null => {
  const direct = path.join(CLIENT_ROOT, slug);
  if (exists(path.join(direct, "client-profile.md"))) return direct;
  const inExamples = path.join(CLIENT_ROOT, "_examples", slug);
  if (exists(path.join(inExamples, "client-profile.md"))) return inExamples;
  return null;
};

export const getClient = (slug: string) => {
  const folder = findClientFolder(slug);
  if (!folder) return null;
  return {
    summary: readClientFolder(folder, slug),
    folder,
    profile: readFileSafe(path.join(folder, "client-profile.md")) ?? "",
    icp: readFileSafe(path.join(folder, "knowledge", "icp.md")) ?? "",
    brandVoice: readFileSafe(path.join(folder, "knowledge", "brand-voice.md")) ?? "",
    decisions: readFileSafe(path.join(folder, "knowledge", "decisions.md")) ?? "",
    results: readFileSafe(path.join(folder, "knowledge", "results.md")) ?? "",
  };
};

export const getCampaign = (clientSlug: string, campaignSlug: string) => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return null;
  const dir = path.join(folder, "campaigns", campaignSlug);
  if (!exists(dir)) return null;
  const files = listFiles(dir, ".md").map((f) => ({
    name: f,
    body: readFileSafe(path.join(dir, f)) ?? "",
  }));
  return { clientSlug, campaignSlug, files };
};

// ---------- Inventory ----------

export type InventoryTotals = {
  total: number | null;
  available: number | null;
  onHold: number | null;
  reserved: number | null;
  sold: number | null;
  withdrawn: number | null;
};

export type InventoryUnitTypeRow = {
  type: string;
  count: number;
  avgAedPerSqft: number | null;
  rangeAed: string;
  planDefault: string;
};

export type InventoryUnit = {
  unitId: string;
  type: string;
  floor: number | null;
  view: string;
  areaSqft: number | null;
  priceAed: number | null;
  paymentPlan: string;
  status: string;
};

export type ParsedInventory = {
  raw: string;
  totals: InventoryTotals;
  unitTypes: InventoryUnitTypeRow[];
  sampleUnits: InventoryUnit[];
};

const num = (s: string | undefined | null): number | null => {
  if (s == null) return null;
  const m = s.replace(/[, ]/g, "").match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
};

const parseInventoryMarkdown = (raw: string): ParsedInventory => {
  const totals: InventoryTotals = {
    total: null,
    available: null,
    onHold: null,
    reserved: null,
    sold: null,
    withdrawn: null,
  };
  const totalsBlock = raw.match(/## Project totals[\s\S]+?(?=\n## |$)/)?.[0] ?? "";
  totals.total = num(totalsBlock.match(/Total units:\s*(.+)/)?.[1]);
  totals.available = num(totalsBlock.match(/Available:\s*(.+)/)?.[1]);
  totals.onHold = num(totalsBlock.match(/On-hold:\s*(.+)/)?.[1]);
  totals.reserved = num(totalsBlock.match(/Reserved:\s*(.+)/)?.[1]);
  totals.sold = num(totalsBlock.match(/Sold:\s*(.+)/)?.[1]);
  totals.withdrawn = num(totalsBlock.match(/Withdrawn:\s*(.+)/)?.[1]);

  // Unit-type breakdown table
  const unitTypes: InventoryUnitTypeRow[] = [];
  const tableBlock = raw.match(/## Unit-type breakdown[\s\S]+?(?=\n## |$)/)?.[0] ?? "";
  const rows = tableBlock.split("\n").filter((l) => l.startsWith("|") && !l.includes("---"));
  for (const r of rows.slice(1)) {
    const cells = r.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length < 5) continue;
    const [type, count, avg, range, plan] = cells;
    if (type.toLowerCase() === "type") continue;
    unitTypes.push({
      type,
      count: num(count) ?? 0,
      avgAedPerSqft: num(avg),
      rangeAed: range,
      planDefault: plan,
    });
  }

  // Sample units in YAML
  const sampleUnits: InventoryUnit[] = [];
  const yamlBlocks = raw.match(/```yaml[\s\S]*?```/g) ?? [];
  for (const block of yamlBlocks) {
    const cleaned = block.replace(/```yaml|```/g, "");
    const items = cleaned.split(/\n-\s+/).map((s) => s.trim()).filter(Boolean);
    for (const item of items) {
      if (!item.includes("unit_id:")) continue;
      const grab = (k: string) => {
        const m = item.match(new RegExp(`^\\s*${k}:\\s*(.+)$`, "m"));
        return m ? m[1].trim().replace(/^['"]|['"]$/g, "").replace(/\s*#.*$/, "") : "";
      };
      sampleUnits.push({
        unitId: grab("unit_id"),
        type: grab("type"),
        floor: num(grab("floor")),
        view: grab("view"),
        areaSqft: num(grab("area_sqft")),
        priceAed: num(grab("price_aed")),
        paymentPlan: grab("payment_plan"),
        status: grab("status"),
      });
    }
  }

  return { raw, totals, unitTypes, sampleUnits };
};

export const getInventory = (clientSlug: string): ParsedInventory | null => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return null;
  const filePath = path.join(folder, "inventory", "current.md");
  const raw = readFileSafe(filePath);
  if (!raw) return null;
  return parseInventoryMarkdown(raw);
};

// ---------- Brokers ----------

export type BrokerTier = {
  tier: 1 | 2 | 3;
  count: number | null;
  description: string;
};

export type BrokerFirm = {
  firm: string;
  tier: number;
  specializations: string[];
  languages: string[];
  priorLaunchConversion: number | null;
  active: boolean;
};

export type ParsedBrokers = {
  raw: string;
  tiers: BrokerTier[];
  sampleFirms: BrokerFirm[];
  speedToLeadSlaMinutes: number | null;
};

const parseBrokerRegistryMarkdown = (raw: string): ParsedBrokers => {
  const tiers: BrokerTier[] = [];
  const tierBlock = raw.match(/## Tier structure[\s\S]+?(?=\n## |$)/)?.[0] ?? "";
  for (const line of tierBlock.split("\n")) {
    const m = line.match(/\*\*Tier\s+(\d)\s*\((\d+)\s*firms?\):\*\*\s*(.+)/i);
    if (m) {
      tiers.push({
        tier: Number(m[1]) as 1 | 2 | 3,
        count: Number(m[2]),
        description: m[3].trim(),
      });
    }
  }

  const sampleFirms: BrokerFirm[] = [];
  const yamlBlocks = raw.match(/```yaml[\s\S]*?```/g) ?? [];
  for (const block of yamlBlocks) {
    const cleaned = block.replace(/```yaml|```/g, "");
    const items = cleaned.split(/\n-\s+/).map((s) => s.trim()).filter(Boolean);
    for (const item of items) {
      if (!item.includes("firm:")) continue;
      const firm = item.match(/^\s*firm:\s*"?(.+?)"?\s*$/m)?.[1]?.trim() ?? "";
      const tier = num(item.match(/^\s*tier:\s*(.+)$/m)?.[1] ?? "");
      const specStr = item.match(/^\s*specializations:\s*\[(.*?)\]/m)?.[1] ?? "";
      const langStr = item.match(/^\s*languages:\s*\[(.*?)\]/m)?.[1] ?? "";
      const conv = num(item.match(/^\s*prior_launch_conversion:\s*(.+)$/m)?.[1] ?? "");
      const active = (item.match(/^\s*active:\s*(true|false)/m)?.[1] ?? "true") === "true";
      if (!firm) continue;
      sampleFirms.push({
        firm,
        tier: tier ?? 0,
        specializations: specStr.split(",").map((s) => s.trim()).filter(Boolean),
        languages: langStr.split(",").map((s) => s.trim()).filter(Boolean),
        priorLaunchConversion: conv,
        active,
      });
    }
  }

  // Speed to lead SLA — try both broker registry and client profile
  const slaMatch = raw.match(/(?:speed[-_ ]?to[-_ ]?lead|sla)[^0-9]*(\d+)\s*(?:min|minute)/i);
  const speedToLeadSlaMinutes = slaMatch ? Number(slaMatch[1]) : null;

  return { raw, tiers, sampleFirms, speedToLeadSlaMinutes };
};

export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getBrokerDetail = (
  clientSlug: string,
  firmSlug: string,
): { firmName: string; raw: string } | null => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return null;
  // Try firm-slug folder match
  const dir = path.join(folder, "brokers", firmSlug);
  const profilePath = path.join(dir, "profile.md");
  const raw = readFileSafe(profilePath);
  if (raw) {
    return { firmName: firmSlug, raw };
  }
  return null;
};

export const listBrokerProfiles = (clientSlug: string): string[] => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return [];
  const dir = path.join(folder, "brokers");
  return listDirs(dir);
};

export const getBrokers = (clientSlug: string): ParsedBrokers | null => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return null;
  const filePath = path.join(folder, "brokers", "registry.md");
  const raw = readFileSafe(filePath);
  if (!raw) return null;
  return parseBrokerRegistryMarkdown(raw);
};

// ---------- Agents ----------

export type AgentSummary = {
  name: string;
  description: string;
  model?: string;
  tools?: string;
  body: string;
};

const AGENTS_DIR = path.join(REPO_ROOT, ".claude", "agents");

export const getAgents = (): AgentSummary[] => {
  return listFiles(AGENTS_DIR, ".md")
    .map((f) => {
      const raw = readFileSafe(path.join(AGENTS_DIR, f)) ?? "";
      const parsed = matter(raw);
      return {
        name: (parsed.data.name as string) ?? f.replace(/\.md$/, ""),
        description: (parsed.data.description as string) ?? "",
        model: parsed.data.model as string | undefined,
        tools: parsed.data.tools as string | undefined,
        body: parsed.content,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const getAgent = (name: string): AgentSummary | null => {
  return getAgents().find((a) => a.name === name) ?? null;
};

// ---------- Verticals ----------

export type VerticalSummary = {
  name: string;
  body: string;
};

const VERTICALS_DIR = path.join(REPO_ROOT, "verticals");

export const getVerticals = (): VerticalSummary[] =>
  listDirs(VERTICALS_DIR)
    .map((name) => ({
      name,
      body: readFileSafe(path.join(VERTICALS_DIR, name, "playbook.md")) ?? "",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

export const getVertical = (name: string): VerticalSummary | null =>
  getVerticals().find((v) => v.name === name) ?? null;

// ---------- Schemas ----------

export type SchemaSummary = {
  name: string;
  body: string;
};

const SCHEMAS_DIR = path.join(REPO_ROOT, "schemas");

export const getSchemas = (): SchemaSummary[] =>
  listFiles(SCHEMAS_DIR, ".md")
    .map((f) => ({
      name: f.replace(/\.md$/, ""),
      body: readFileSafe(path.join(SCHEMAS_DIR, f)) ?? "",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

export const getSchema = (name: string): SchemaSummary | null =>
  getSchemas().find((s) => s.name === name) ?? null;

// ---------- Wealth channels ----------

export type WealthCounterparty = {
  segment: "private-banks" | "family-offices" | "introducers";
  name: string;
  status: string;
  type?: string;
  geography?: string[];
  notes?: string;
  fiduciaryRestricted?: boolean;
  priorIntroductions?: number | null;
  commissionStructure?: string;
};

export type WealthChannelSummary = {
  segment: "private-banks" | "family-offices" | "introducers";
  active: number | null;
  dormant: number | null;
  newTarget: number | null;
};

export type ParsedWealthChannel = {
  raw: string;
  summaries: WealthChannelSummary[];
  counterparties: WealthCounterparty[];
};

const parseWealthChannelMarkdown = (raw: string): ParsedWealthChannel => {
  // Engagement health summary table
  const summaries: WealthChannelSummary[] = [];
  const summaryBlock = raw.match(/## Engagement health summary[\s\S]+?(?=\n## |$)/)?.[0] ?? "";
  for (const line of summaryBlock.split("\n")) {
    if (!line.startsWith("|")) continue;
    if (line.includes("---")) continue;
    const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length < 4) continue;
    const [seg, active, dormant, newTarget] = cells;
    if (/sub.?channel/i.test(seg)) continue;
    let key: WealthChannelSummary["segment"];
    if (/private banks?/i.test(seg)) key = "private-banks";
    else if (/family offices?/i.test(seg)) key = "family-offices";
    else if (/introducer/i.test(seg)) key = "introducers";
    else continue;
    summaries.push({
      segment: key,
      active: num(active),
      dormant: num(dormant),
      newTarget: num(newTarget),
    });
  }

  // Counterparties — parse YAML blocks under each section
  const counterparties: WealthCounterparty[] = [];

  const sectionFor = (header: string, segment: WealthCounterparty["segment"]) => {
    const block = raw.match(new RegExp(`##\\s+${header}[\\s\\S]+?(?=\\n## |$)`, "i"))?.[0] ?? "";
    const yamlBlocks = block.match(/```yaml[\s\S]*?```/g) ?? [];
    for (const yb of yamlBlocks) {
      const cleaned = yb.replace(/```yaml|```/g, "");
      const items = cleaned.split(/\n-\s+/).map((s) => s.trim()).filter(Boolean);
      for (const item of items) {
        if (!/(name|firm):/.test(item)) continue;
        const name =
          item.match(/^\s*name:\s*"?(.+?)"?\s*$/m)?.[1]?.trim() ??
          item.match(/^\s*firm:\s*"?(.+?)"?\s*$/m)?.[1]?.trim() ??
          "";
        if (!name) continue;
        const status = item.match(/^\s*status:\s*(.+)$/m)?.[1]?.trim() ?? "unknown";
        const type = item.match(/^\s*type:\s*(.+)$/m)?.[1]?.trim();
        const geoStr = item.match(/^\s*geography:\s*\[?(.+?)\]?\s*$/m)?.[1] ?? "";
        const geography = geoStr
          .split(",")
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
          .filter((s) => s && s !== "");
        const fiduciary = item.match(/^\s*fiduciary_restricted:\s*(true|false)/m)?.[1];
        const conv = num(item.match(/^\s*prior_introductions:\s*(.+)$/m)?.[1] ?? "");
        const commission = item.match(/^\s*commission_structure:\s*"?(.+?)"?\s*$/m)?.[1]?.trim();
        const notes = item.match(/^\s*notes:\s*"?(.+?)"?\s*$/m)?.[1]?.trim();
        counterparties.push({
          segment,
          name,
          status,
          type,
          geography: geography.length ? geography : undefined,
          fiduciaryRestricted: fiduciary === "true",
          priorIntroductions: conv,
          commissionStructure: commission,
          notes,
        });
      }
    }
  };

  sectionFor("Private banks", "private-banks");
  sectionFor("Family offices", "family-offices");
  sectionFor("Independent introducers", "introducers");

  return { raw, summaries, counterparties };
};

export const getWealthChannel = (clientSlug: string): ParsedWealthChannel | null => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return null;
  const filePath = path.join(folder, "wealth-channels", "registry.md");
  const raw = readFileSafe(filePath);
  if (!raw) return null;
  return parseWealthChannelMarkdown(raw);
};

// ---------- Events ----------

export type EventPlan = {
  eventId: string;
  campaign?: string;
  type?: string;
  phase?: string;
  status?: string;
  date?: string;
  venue?: string;
  audience?: string;
  capacity?: number | null;
  invited?: number | null;
  rsvpYes?: number | null;
  rsvpNo?: number | null;
  rsvpPending?: number | null;
  expectedShow?: number | null;
  actual?: number | null;
  plannedAed?: number | null;
  committedAed?: number | null;
  actualAed?: number | null;
  remainingAed?: number | null;
  vendorCount?: number;
  risks?: string[];
  raw: string;
};

const parseEventPlan = (raw: string, eventId: string): EventPlan => {
  const grab = (k: string): string | undefined => {
    const m = raw.match(new RegExp(`^${k}:\\s*(.+)$`, "m"));
    if (!m) return undefined;
    return m[1].trim().replace(/^['"]|['"]$/g, "").replace(/\s*#.*$/, "");
  };
  const grabNested = (parent: string, k: string): string | undefined => {
    const re = new RegExp(`^${parent}:[\\s\\S]*?^\\s+${k}:\\s*(.+)$`, "m");
    const m = raw.match(re);
    if (!m) return undefined;
    return m[1].trim().replace(/^['"]|['"]$/g, "").replace(/\s*#.*$/, "");
  };

  const vendorBlock = raw.match(/^vendors:[\s\S]+?(?=^[a-z_]+:|^\s*$)/m)?.[0] ?? "";
  const vendorCount = (vendorBlock.match(/^\s+\w+:/gm)?.length ?? 1) - 1;

  const risksBlock = raw.match(/^risks:\s*\n([\s\S]+?)(?=^[a-z_]+:|$)/m)?.[1] ?? "";
  const risks = risksBlock
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-"))
    .map((l) => l.replace(/^-\s*/, "").replace(/^['"]|['"]$/g, ""));

  return {
    eventId,
    campaign: grab("campaign"),
    type: grab("type"),
    phase: grab("phase"),
    status: grab("status"),
    date: grab("date"),
    venue: grab("venue"),
    audience: grab("audience"),
    capacity: numLoose(grabNested("headcount", "capacity")),
    invited: numLoose(grabNested("headcount", "invited")),
    rsvpYes: numLoose(grabNested("headcount", "rsvp_yes")),
    rsvpNo: numLoose(grabNested("headcount", "rsvp_no")),
    rsvpPending: numLoose(grabNested("headcount", "rsvp_pending")),
    expectedShow: numLoose(grabNested("headcount", "expected_show")),
    actual: numLoose(grabNested("headcount", "actual")),
    plannedAed: numLoose(grabNested("budget", "planned_aed")),
    committedAed: numLoose(grabNested("budget", "committed_aed")),
    actualAed: numLoose(grabNested("budget", "actual_aed")),
    remainingAed: numLoose(grabNested("budget", "remaining_aed")),
    vendorCount: vendorCount > 0 ? vendorCount : 0,
    risks,
    raw,
  };
};

const numLoose = (s: string | undefined | null): number | null => {
  if (s == null) return null;
  if (s.trim() === "null" || s.trim() === "") return null;
  return num(s);
};

export const getEvents = (clientSlug: string): EventPlan[] => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return [];
  const eventsDir = path.join(folder, "events");
  const out: EventPlan[] = [];
  for (const eventId of listDirs(eventsDir)) {
    const planPath = path.join(eventsDir, eventId, "plan.md");
    const raw = readFileSafe(planPath);
    if (raw) out.push(parseEventPlan(raw, eventId));
  }
  return out.sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
};

export type EventDetail = {
  eventId: string;
  plan: EventPlan;
  invitationList: string | null;
  rsvpLog: string | null;
  runOfShow: string | null;
  debrief: string | null;
};

export const getEventDetail = (clientSlug: string, eventId: string): EventDetail | null => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return null;
  const dir = path.join(folder, "events", eventId);
  const planRaw = readFileSafe(path.join(dir, "plan.md"));
  if (!planRaw) return null;
  return {
    eventId,
    plan: parseEventPlan(planRaw, eventId),
    invitationList: readFileSafe(path.join(dir, "invitation-list.md")),
    rsvpLog: readFileSafe(path.join(dir, "rsvp-log.md")),
    runOfShow: readFileSafe(path.join(dir, "run-of-show.md")),
    debrief: readFileSafe(path.join(dir, "debrief.md")),
  };
};

// ---------- Vendors (marketing-procurement) ----------

export type VendorEntry = {
  category: string;
  name: string;
  status: string;
  tier?: string;
  engagedFor?: string;
  contractThrough?: string;
  sowValueAed?: number | null;
  annualValueAed?: number | null;
  totalSpendAedYtd?: number | null;
  onSpecRate?: number | null;
  onTimeRate?: number | null;
  disputeCount?: number | null;
  notes?: string;
};

export type ParsedVendors = {
  raw: string;
  vendors: VendorEntry[];
};

const parseVendorRegistry = (raw: string): ParsedVendors => {
  const vendors: VendorEntry[] = [];
  const yamlBlocks = raw.match(/```yaml[\s\S]*?```/g) ?? [];
  for (const block of yamlBlocks) {
    const cleaned = block.replace(/```yaml|```/g, "");

    // Find each "- category: X" header and its child "vendors:" list
    const catRegex = /^- category:\s*(.+)$/gm;
    const catMatches = [...cleaned.matchAll(catRegex)];

    for (let i = 0; i < catMatches.length; i++) {
      const category = catMatches[i][1].trim();
      const start = catMatches[i].index ?? 0;
      const end = i + 1 < catMatches.length ? (catMatches[i + 1].index ?? cleaned.length) : cleaned.length;
      const segment = cleaned.slice(start, end);
      // Each "    - name:" entry inside this category
      const entries = segment.split(/\n\s+-\s+name:/).slice(1);
      for (const entry of entries) {
        const item = "name:" + entry;
        const grab = (k: string) => {
          const m = item.match(new RegExp(`^\\s*${k}:\\s*"?(.+?)"?\\s*$`, "m"));
          return m ? m[1].trim().replace(/\s*#.*$/, "") : undefined;
        };
        const name = grab("name");
        if (!name) continue;
        vendors.push({
          category,
          name,
          status: grab("status") ?? "unknown",
          tier: grab("tier"),
          engagedFor: grab("engaged_for"),
          contractThrough: grab("contract_through"),
          sowValueAed: numLoose(grab("sow_value_aed")),
          annualValueAed: numLoose(grab("annual_value_aed")),
          totalSpendAedYtd: numLoose(grab("total_spend_aed_ytd")),
          onSpecRate: numLoose(grab("on_spec_rate")),
          onTimeRate: numLoose(grab("on_time_rate")),
          disputeCount: numLoose(grab("dispute_count")),
          notes: grab("notes"),
        });
      }
    }
  }
  return { raw, vendors };
};

export const getVendors = (clientSlug: string): ParsedVendors | null => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return null;
  const filePath = path.join(folder, "vendors", "registry.md");
  const raw = readFileSafe(filePath);
  if (!raw) return null;
  return parseVendorRegistry(raw);
};

export const getVendorDetail = (
  clientSlug: string,
  vendorSlug: string,
): { vendorName: string; raw: string } | null => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return null;
  const dir = path.join(folder, "vendors", vendorSlug);
  const profilePath = path.join(dir, "profile.md");
  const raw = readFileSafe(profilePath);
  if (raw) {
    return { vendorName: vendorSlug, raw };
  }
  return null;
};

export const listVendorProfiles = (clientSlug: string): string[] => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return [];
  return listDirs(path.join(folder, "vendors"));
};

// ---------- Marketing budget ----------

export type BudgetTopline = {
  fiscalYear?: string;
  totalPlannedAed: number | null;
  totalCommittedAed: number | null;
  totalActualAed: number | null;
  totalRemainingAed: number | null;
  nextClose?: string;
};

export type BudgetRow = {
  dimension: "campaign" | "channel" | "event";
  name: string;
  plannedAed: number | null;
  committedAed: number | null;
  actualAed: number | null;
  remainingAed: number | null;
  notes?: string;
};

export type VarianceFlag = {
  dimension: string;
  item: string;
  variancePct: number | null;
  status: string;
  note?: string;
};

export type ParsedBudget = {
  raw: string;
  topline: BudgetTopline;
  byCampaign: BudgetRow[];
  byChannel: BudgetRow[];
  byEvent: BudgetRow[];
  variances: VarianceFlag[];
};

const parseBudgetSection = (raw: string, header: string, dim: BudgetRow["dimension"]): BudgetRow[] => {
  const block = raw.match(new RegExp(`##\\s+${header}[\\s\\S]+?(?=\\n## |$)`, "i"))?.[0] ?? "";
  const yamlBlock = block.match(/```yaml([\s\S]*?)```/)?.[1] ?? "";
  const items = yamlBlock.split(/\n-\s+/).map((s) => s.trim()).filter(Boolean);
  const rows: BudgetRow[] = [];
  for (const item of items) {
    if (!item.includes("name:")) continue;
    const grab = (k: string) => {
      const m = item.match(new RegExp(`^\\s*${k}:\\s*"?(.+?)"?\\s*$`, "m"));
      return m ? m[1].trim().replace(/\s*#.*$/, "") : undefined;
    };
    const name = grab("name");
    if (!name) continue;
    rows.push({
      dimension: dim,
      name,
      plannedAed: numLoose(grab("planned_aed")),
      committedAed: numLoose(grab("committed_aed")),
      actualAed: numLoose(grab("actual_aed")),
      remainingAed: numLoose(grab("remaining_aed")),
      notes: grab("notes"),
    });
  }
  return rows;
};

const parseBudget = (raw: string): ParsedBudget => {
  const toplineBlock = raw.match(/##\s+Top-line[\s\S]+?(?=\n## |$)/)?.[0] ?? "";
  const grabTopline = (k: string) => {
    const m = toplineBlock.match(new RegExp(`^${k}:\\s*(.+)$`, "m"));
    return m ? m[1].trim().replace(/\s*#.*$/, "") : undefined;
  };
  const grabToplineNested = (parent: string, k: string) => {
    const re = new RegExp(`^${parent}:[\\s\\S]*?^\\s+${k}:\\s*(.+)$`, "m");
    const m = toplineBlock.match(re);
    return m ? m[1].trim().replace(/\s*#.*$/, "") : undefined;
  };

  const topline: BudgetTopline = {
    fiscalYear: grabTopline("fiscal_year"),
    totalPlannedAed: numLoose(grabTopline("total_planned_aed")),
    totalCommittedAed: numLoose(grabTopline("total_committed_aed")),
    totalActualAed: numLoose(grabTopline("total_actual_aed")),
    totalRemainingAed: numLoose(grabTopline("total_remaining_aed")),
    nextClose: grabToplineNested("period_close", "next_close"),
  };

  const variances: VarianceFlag[] = [];
  const varBlock = raw.match(/##\s+Variance flags[\s\S]+?(?=\n## |$)/)?.[0] ?? "";
  const yamlBlock = varBlock.match(/```yaml([\s\S]*?)```/)?.[1] ?? "";
  const items = yamlBlock.split(/\n-\s+/).map((s) => s.trim()).filter(Boolean);
  for (const item of items) {
    if (!item.includes("dimension:")) continue;
    const grab = (k: string) => {
      const m = item.match(new RegExp(`^\\s*${k}:\\s*"?(.+?)"?\\s*$`, "m"));
      return m ? m[1].trim().replace(/\s*#.*$/, "") : undefined;
    };
    variances.push({
      dimension: grab("dimension") ?? "",
      item: grab("item") ?? "",
      variancePct: numLoose(grab("variance_pct")),
      status: grab("status") ?? "",
      note: grab("note"),
    });
  }

  return {
    raw,
    topline,
    byCampaign: parseBudgetSection(raw, "By campaign", "campaign"),
    byChannel: parseBudgetSection(raw, "By channel[^\\n]*", "channel"),
    byEvent: parseBudgetSection(raw, "By event[^\\n]*", "event"),
    variances,
  };
};

export const getBudget = (clientSlug: string): ParsedBudget | null => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return null;
  const raw = readFileSafe(path.join(folder, "marketing-budget.md"));
  if (!raw) return null;
  return parseBudget(raw);
};

// ---------- Sales (RM team + allocation rules) ----------

export type RmEntry = {
  rmId: string;
  name: string;
  tier: string;
  specializations: string[];
  languages: string[];
  currentLoad: number | null;
  capacity: number | null;
  priorQuarterCloseRate: number | null;
  active: boolean;
};

export type ParsedRmTeam = {
  raw: string;
  rms: RmEntry[];
};

const parseRmTeamMarkdown = (raw: string): ParsedRmTeam => {
  const rms: RmEntry[] = [];
  const yamlBlocks = raw.match(/```yaml[\s\S]*?```/g) ?? [];
  for (const block of yamlBlocks) {
    const cleaned = block.replace(/```yaml|```/g, "");
    const items = cleaned.split(/\n-\s+/).map((s) => s.trim()).filter(Boolean);
    for (const item of items) {
      if (!item.includes("rm_id:")) continue;
      const grab = (k: string) =>
        item.match(new RegExp(`^\\s*${k}:\\s*"?(.+?)"?\\s*$`, "m"))?.[1]?.trim();
      const arr = (k: string) => {
        const m = item.match(new RegExp(`^\\s*${k}:\\s*\\[(.*?)\\]`, "m"));
        return m
          ? m[1]
              .split(",")
              .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
              .filter(Boolean)
          : [];
      };
      const rmId = grab("rm_id") ?? "";
      if (!rmId) continue;
      rms.push({
        rmId,
        name: grab("name") ?? "",
        tier: grab("tier") ?? "",
        specializations: arr("specializations"),
        languages: arr("languages"),
        currentLoad: num(grab("current_load") ?? ""),
        capacity: num(grab("capacity") ?? ""),
        priorQuarterCloseRate: num(grab("prior_quarter_close_rate") ?? ""),
        active: (grab("active") ?? "true") === "true",
      });
    }
  }
  return { raw, rms };
};

export const getRmTeam = (clientSlug: string): ParsedRmTeam | null => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return null;
  const filePath = path.join(folder, "sales", "rm-team.md");
  const raw = readFileSafe(filePath);
  if (!raw) return null;
  return parseRmTeamMarkdown(raw);
};

export const getAllocationRules = (clientSlug: string): string | null => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return null;
  return readFileSafe(path.join(folder, "sales", "allocation-rules.md"));
};

// ---------- VVIP channel ----------

export type VvipEntity = {
  segment: "ruling-families" | "government-officials" | "foreign-dignitaries" | "sovereign-institutions";
  entityId: string;
  household?: string;
  role?: string;
  institution?: string;
  primaryPrincipalAnonymized: string;
  preferredFormOfAddress?: string;
  status: string;
  primaryGatekeeper?: string;
  pepScreeningStatus?: string;
  notes?: string;
};

export type VvipSummary = {
  segment: VvipEntity["segment"];
  active: number | null;
  dormant: number | null;
  cultivating: number | null;
};

export type ParsedVvip = {
  raw: string;
  summaries: VvipSummary[];
  entities: VvipEntity[];
};

const parseVvipMarkdown = (raw: string): ParsedVvip => {
  const summaries: VvipSummary[] = [];
  const summaryBlock = raw.match(/## Engagement health summary[\s\S]+?(?=\n## |$)/)?.[0] ?? "";
  for (const line of summaryBlock.split("\n")) {
    if (!line.startsWith("|")) continue;
    if (line.includes("---")) continue;
    const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length < 4) continue;
    const [seg, active, dormant, cultivating] = cells;
    if (/sub.?channel/i.test(seg)) continue;
    let key: VvipSummary["segment"];
    if (/ruling/i.test(seg)) key = "ruling-families";
    else if (/government/i.test(seg)) key = "government-officials";
    else if (/foreign|dignitar/i.test(seg)) key = "foreign-dignitaries";
    else if (/sovereign/i.test(seg)) key = "sovereign-institutions";
    else continue;
    summaries.push({
      segment: key,
      active: num(active),
      dormant: num(dormant),
      cultivating: num(cultivating),
    });
  }

  const entities: VvipEntity[] = [];
  const sectionFor = (headerPattern: string, segment: VvipEntity["segment"]) => {
    const block = raw.match(new RegExp(`##\\s+${headerPattern}[\\s\\S]+?(?=\\n## |$)`, "i"))?.[0] ?? "";
    const yamlBlocks = block.match(/```yaml[\s\S]*?```/g) ?? [];
    for (const yb of yamlBlocks) {
      const cleaned = yb.replace(/```yaml|```/g, "");
      const items = cleaned.split(/\n-\s+/).map((s) => s.trim()).filter(Boolean);
      for (const item of items) {
        if (!item.includes("entity_id:")) continue;
        const grab = (k: string) =>
          item.match(new RegExp(`^\\s*${k}:\\s*"?(.+?)"?\\s*$`, "m"))?.[1]?.trim();
        const entityId = grab("entity_id") ?? "";
        if (!entityId) continue;
        entities.push({
          segment,
          entityId,
          household: grab("household"),
          role: grab("role"),
          institution: grab("institution"),
          primaryPrincipalAnonymized: grab("primary_principal_anonymized") ?? "",
          preferredFormOfAddress: grab("preferred_form_of_address"),
          status: grab("status") ?? "unknown",
          primaryGatekeeper: grab("primary_gatekeeper"),
          pepScreeningStatus: grab("pep_screening_status"),
          notes: grab("notes"),
        });
      }
    }
  };

  sectionFor("Ruling families[^\\n]*", "ruling-families");
  sectionFor("Government officials[^\\n]*", "government-officials");
  sectionFor("Foreign dignitaries[^\\n]*", "foreign-dignitaries");
  sectionFor("Sovereign[^\\n]*", "sovereign-institutions");

  return { raw, summaries, entities };
};

export const getVvipChannel = (clientSlug: string): ParsedVvip | null => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return null;
  const filePath = path.join(folder, "vvip-channel", "registry.md");
  const raw = readFileSafe(filePath);
  if (!raw) return null;
  return parseVvipMarkdown(raw);
};

// ---------- Reciprocity ledger ----------

export type ReciprocityEntry = {
  entryId: string;
  date: string;
  counterpartyId: string;
  counterpartyName: string;
  channel: "vvip" | "wealth" | "other";
  direction: "outbound" | "inbound";
  type: string;
  description: string;
  valueImplied?: string;
  status: string;
  recordedBy?: string;
  notes?: string;
};

export type ReciprocityCounterpartySummary = {
  counterpartyId: string;
  counterpartyName: string;
  channel: string;
  inbound: number;
  outbound: number;
  net: number; // outbound - inbound; negative means we owe
  pendingAcknowledge: number;
  pendingReciprocate: number;
  lastTouchDate: string;
};

export type ParsedReciprocity = {
  raw: string;
  entries: ReciprocityEntry[];
  summaries: ReciprocityCounterpartySummary[];
};

const parseReciprocity = (raw: string): ParsedReciprocity => {
  const entries: ReciprocityEntry[] = [];
  const yamlBlocks = raw.match(/```yaml[\s\S]*?```/g) ?? [];
  for (const block of yamlBlocks) {
    const cleaned = block.replace(/```yaml|```/g, "");
    const items = cleaned.split(/\n-\s+/).map((s) => s.trim()).filter(Boolean);
    for (const item of items) {
      if (!item.includes("entry_id:")) continue;
      const grab = (k: string) => {
        const m = item.match(new RegExp(`^\\s*${k}:\\s*"?(.+?)"?\\s*$`, "m"));
        return m ? m[1].trim().replace(/\s*#.*$/, "") : undefined;
      };
      const entryId = grab("entry_id") ?? "";
      if (!entryId) continue;
      entries.push({
        entryId,
        date: grab("date") ?? "",
        counterpartyId: grab("counterparty_id") ?? "",
        counterpartyName: grab("counterparty_name") ?? "",
        channel: (grab("channel") as ReciprocityEntry["channel"]) ?? "other",
        direction: (grab("direction") as ReciprocityEntry["direction"]) ?? "inbound",
        type: grab("type") ?? "",
        description: grab("description") ?? "",
        valueImplied: grab("value_implied"),
        status: grab("status") ?? "",
        recordedBy: grab("recorded_by"),
        notes: grab("notes"),
      });
    }
  }

  // Build per-counterparty summaries
  const map: Record<string, ReciprocityCounterpartySummary> = {};
  for (const e of entries) {
    const key = e.counterpartyId || e.counterpartyName;
    if (!map[key]) {
      map[key] = {
        counterpartyId: e.counterpartyId,
        counterpartyName: e.counterpartyName,
        channel: e.channel,
        inbound: 0,
        outbound: 0,
        net: 0,
        pendingAcknowledge: 0,
        pendingReciprocate: 0,
        lastTouchDate: e.date,
      };
    }
    const s = map[key];
    if (e.direction === "inbound") s.inbound++;
    else s.outbound++;
    if (e.status === "pending-acknowledge") s.pendingAcknowledge++;
    if (e.status === "pending-reciprocate") s.pendingReciprocate++;
    if (e.date > s.lastTouchDate) s.lastTouchDate = e.date;
  }
  const summaries = Object.values(map).map((s) => ({
    ...s,
    net: s.outbound - s.inbound,
  }));
  // Sort: most-debt first (net most negative), then by last-touch desc
  summaries.sort((a, b) => a.net - b.net || b.lastTouchDate.localeCompare(a.lastTouchDate));

  return { raw, entries, summaries };
};

export const getReciprocity = (clientSlug: string): ParsedReciprocity | null => {
  const folder = findClientFolder(clientSlug);
  if (!folder) return null;
  const raw = readFileSafe(path.join(folder, "reciprocity-ledger.md"));
  if (!raw) return null;
  return parseReciprocity(raw);
};

// ---------- Stats ----------

export const getStats = () => {
  const clients = getClients();
  return {
    realClients: clients.filter((c) => !c.isExample && !c.isTemplate).length,
    exampleClients: clients.filter((c) => c.isExample).length,
    agents: getAgents().length,
    verticals: getVerticals().length,
    schemas: getSchemas().length,
  };
};
