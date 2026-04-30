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
