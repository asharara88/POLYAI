/**
 * Plain-language pass on user-facing copy.
 *
 * Strips/rewrites three classes of jargon:
 * - Runbook paths (`runbooks/pep-sanctions-hit.md`, `clients/<slug>/cco/briefs/...`)
 *   — internal authoring artifacts, not for executive readers
 * - "T-N" countdown shorthand → "in N days"
 * - Unexplained acronyms (EDD / PEP / OFAC / MTD / WoW / pp) — expanded on first
 *   appearance per call site
 *
 * Used by the brief renderer + decision-ask card descriptions. Pure functions,
 * no React.
 */

const RUNBOOK_PATH_RE = /\b(?:runbooks|schemas|clients\/[\w-]+(?:\/[\w./-]+)?)\/[\w./-]+\.md\b/g;
const T_MINUS_RE = /\bT[-−]\s*(\d+)\b/g;
const T_MINUS_WITH_UNIT_RE = /\bT[-−]\s*(\d+)\s*(day|days|d)\b/gi;
const BACKTICK_PATH_RE = /`runbooks\/[\w./-]+`/g;

/** Strip internal runbook / schema paths and backticked path refs. */
export function stripRunbookPaths(text: string): string {
  if (!text) return text;
  return text
    .replace(BACKTICK_PATH_RE, "")
    .replace(RUNBOOK_PATH_RE, "")
    // Collapse double spaces / orphan punctuation left behind
    .replace(/\s+([,;.])/g, "$1")
    .replace(/\(\s*\)/g, "")
    .replace(/\(\s*Path:\s*\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Replace "T-45", "T-45 days" with "in 45 days". */
export function rewriteCountdowns(text: string): string {
  if (!text) return text;
  return text
    .replace(T_MINUS_WITH_UNIT_RE, (_, n) => `in ${n} days`)
    .replace(T_MINUS_RE, (_, n) => `in ${n} days`);
}

const ACRONYM_EXPANSIONS: Array<[RegExp, string]> = [
  [/\bEDD\b/g, "EDD (enhanced due-diligence)"],
  [/\bPEP\b/g, "PEP (politically-exposed person)"],
  [/\bOFAC\b/g, "OFAC (US sanctions list)"],
  [/\bSDN\b/g, "SDN (US sanctions list)"],
  [/\bWoW\b/g, "WoW (week-over-week)"],
  [/\bMTD\b/g, "MTD (month-to-date)"],
  [/\bYoY\b/g, "YoY (year-over-year)"],
];

/**
 * Expand each acronym ONCE per call. Tracks which acronyms have already been
 * expanded inside the same text to avoid double-expansion.
 */
export function expandAcronymsOnce(text: string): string {
  if (!text) return text;
  let out = text;
  for (const [re, expansion] of ACRONYM_EXPANSIONS) {
    let firstSeen = false;
    out = out.replace(re, (match) => {
      if (firstSeen) return match;
      firstSeen = true;
      return expansion;
    });
  }
  return out;
}

/** Compose all three passes — the default scrub for user-facing copy. */
export function plainLanguage(text: string): string {
  if (!text) return text;
  return expandAcronymsOnce(rewriteCountdowns(stripRunbookPaths(text)));
}
