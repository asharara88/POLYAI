"use client";

import { useEffect, useMemo, useState } from "react";

const REPO = "asharara88/polyai";

type Entry = {
  id: string;
  timestamp: string;
  attendee: string;
  cohort: string;
  response: "yes" | "no" | "pending" | "tentative";
  plusOne: number;
  notes: string;
  source: string;
};

const EMPTY: Omit<Entry, "id" | "timestamp"> = {
  attendee: "",
  cohort: "tier-1-broker",
  response: "yes",
  plusOne: 0,
  notes: "",
  source: "email-form",
};

const yamlEntry = (e: Entry) =>
  [
    `- timestamp: ${e.timestamp}`,
    `  attendee: "${e.attendee}"`,
    `  cohort: ${e.cohort}`,
    `  response: ${e.response}`,
    e.plusOne ? `  +1: ${e.plusOne}` : null,
    e.notes ? `  notes: "${e.notes}"` : null,
    `  source: ${e.source}`,
  ]
    .filter(Boolean)
    .join("\n");

export default function RsvpStaging({
  clientSlug,
  eventId,
  filePath,
}: {
  clientSlug: string;
  eventId: string;
  filePath: string;
}) {
  const storageKey = `polyai:rsvp-staging:${clientSlug}:${eventId}`;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState<Omit<Entry, "id" | "timestamp">>(EMPTY);

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setEntries(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(entries));
    } catch {}
  }, [entries, storageKey]);

  const counts = useMemo(() => {
    const c = { yes: 0, no: 0, pending: 0, tentative: 0 };
    for (const e of entries) c[e.response]++;
    return c;
  }, [entries]);

  const add = () => {
    if (!draft.attendee.trim()) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const timestamp = new Date().toISOString().slice(0, 16);
    setEntries((prev) => [...prev, { ...draft, id, timestamp }]);
    setDraft(EMPTY);
  };

  const remove = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const clearAll = () => {
    if (!confirm(`Clear all ${entries.length} staged entries?`)) return;
    setEntries([]);
  };

  const yamlBlock = entries.map(yamlEntry).join("\n");

  const githubEditUrl = `https://github.com/${REPO}/edit/main/${filePath}`;

  return (
    <div className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 p-5 mt-6 space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-500">
            Staged RSVP entries
          </h3>
          <p className="text-xs text-ink-500 mt-1 max-w-2xl">
            Add entries here as RSVPs come in. Persisted in this browser. When ready, click "Open in
            GitHub to commit" — the YAML below is appended into <code className="font-mono">{filePath}</code>'s
            response log section.
          </p>
        </div>
        {entries.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-mono text-ink-400 hover:text-red-600"
          >
            clear all
          </button>
        )}
      </div>

      {/* Live counts */}
      {entries.length > 0 && (
        <div className="grid grid-cols-4 gap-2 text-sm">
          <Pill label="yes" value={counts.yes} color="bg-emerald-500" />
          <Pill label="no" value={counts.no} color="bg-red-500" />
          <Pill label="pending" value={counts.pending} color="bg-amber-500" />
          <Pill label="tentative" value={counts.tentative} color="bg-blue-500" />
        </div>
      )}

      {/* Add entry form */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        <Field label="attendee (anonymized)">
          <input
            value={draft.attendee}
            onChange={(e) => setDraft({ ...draft, attendee: e.target.value })}
            placeholder="invitation slot or hashed id"
            className={INPUT}
          />
        </Field>
        <Field label="cohort">
          <select
            value={draft.cohort}
            onChange={(e) => setDraft({ ...draft, cohort: e.target.value })}
            className={INPUT}
          >
            {[
              "tier-1-broker",
              "tier-2-broker",
              "tier-3-broker",
              "prior-tower-owner",
              "wealth-channel",
              "vvip",
              "press",
              "internal",
              "other",
            ].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="response">
          <select
            value={draft.response}
            onChange={(e) =>
              setDraft({
                ...draft,
                response: e.target.value as Entry["response"],
              })
            }
            className={INPUT}
          >
            {["yes", "no", "pending", "tentative"].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
        <Field label="+1 count">
          <input
            type="number"
            min={0}
            value={draft.plusOne}
            onChange={(e) =>
              setDraft({ ...draft, plusOne: Math.max(0, Number(e.target.value)) })
            }
            className={INPUT}
          />
        </Field>
        <Field label="source">
          <select
            value={draft.source}
            onChange={(e) => setDraft({ ...draft, source: e.target.value })}
            className={INPUT}
          >
            {["email-form", "direct-reply", "phone", "in-person", "gatekeeper", "whatsapp"].map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ),
            )}
          </select>
        </Field>
        <div className="col-span-2 sm:col-span-3">
          <Field label="notes (dietary / mobility / language / role)">
            <input
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              className={INPUT}
            />
          </Field>
        </div>
      </div>

      <button
        onClick={add}
        disabled={!draft.attendee.trim()}
        className="rounded-md bg-accent text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        Stage entry
      </button>

      {/* Staged entries list */}
      {entries.length > 0 && (
        <div className="space-y-2 mt-4">
          <div className="text-xs font-mono uppercase tracking-wider text-ink-400">
            staged ({entries.length})
          </div>
          <ul className="space-y-1 text-sm font-mono">
            {entries.map((e) => (
              <li
                key={e.id}
                className="flex items-baseline gap-2 px-2 py-1 rounded hover:bg-ink-100 dark:hover:bg-ink-900"
              >
                <span className="text-xs text-ink-400 w-32 shrink-0">
                  {e.timestamp.replace("T", " ")}
                </span>
                <span className="text-ink-700 dark:text-ink-300 truncate flex-1">
                  {e.cohort} · {e.response}
                  {e.plusOne ? ` +${e.plusOne}` : ""} · {e.attendee}
                  {e.notes ? ` — ${e.notes}` : ""}
                </span>
                <button
                  onClick={() => remove(e.id)}
                  className="text-xs text-ink-400 hover:text-red-600"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Commit-ready YAML + GitHub edit deep-link */}
      {entries.length > 0 && (
        <div className="border-t border-ink-200/70 dark:border-ink-800 pt-4 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-ink-400">
            ready to commit
          </div>
          <pre className="text-xs font-mono p-3 rounded bg-white dark:bg-ink-900 border border-ink-200/70 dark:border-ink-800 overflow-auto max-h-72 whitespace-pre-wrap">
            {yamlBlock}
          </pre>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => navigator.clipboard.writeText(yamlBlock)}
              className="text-xs font-mono px-2 py-1 rounded border border-ink-200/70 dark:border-ink-800 hover:border-accent/60"
            >
              copy yaml
            </button>
            <a
              href={githubEditUrl}
              target="_blank"
              rel="noopener"
              className="rounded-md bg-accent text-white px-4 py-2 text-sm font-medium"
            >
              Open in GitHub to commit →
            </a>
            <span className="text-xs text-ink-500">
              paste under the "Response log" section, then commit
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const INPUT =
  "w-full rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 px-3 py-2 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-mono text-ink-400">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Pill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 px-3 py-2">
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">{label}</span>
      </div>
      <div className="font-semibold mt-0.5">{value}</div>
    </div>
  );
}
