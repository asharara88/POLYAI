"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReciprocityCounterpartySummary } from "@/lib/content";

const REPO = "asharara88/polyai";

type StagedEntry = {
  id: string;
  date: string;
  counterpartyId: string;
  counterpartyName: string;
  channel: "vvip" | "wealth" | "other";
  direction: "outbound" | "inbound";
  type: string;
  description: string;
  valueImplied: "low" | "medium" | "high";
  status: "complete" | "pending-acknowledge" | "pending-reciprocate" | "not-applicable";
  notes: string;
};

const EMPTY: Omit<StagedEntry, "id"> = {
  date: new Date().toISOString().slice(0, 10),
  counterpartyId: "",
  counterpartyName: "",
  channel: "wealth",
  direction: "outbound",
  type: "courtesy",
  description: "",
  valueImplied: "medium",
  status: "complete",
  notes: "",
};

const yamlEntry = (e: StagedEntry, idx: number) =>
  [
    `- entry_id: rcp-staged-${String(idx + 1).padStart(3, "0")}`,
    `  date: ${e.date}`,
    `  counterparty_id: ${e.counterpartyId}`,
    `  counterparty_name: "${e.counterpartyName}"`,
    `  channel: ${e.channel}`,
    `  direction: ${e.direction}`,
    `  type: ${e.type}`,
    `  description: "${e.description.replace(/"/g, '\\"')}"`,
    `  value_implied: ${e.valueImplied}`,
    `  status: ${e.status}`,
    `  recorded_by: human-via-staging`,
    e.notes ? `  notes: "${e.notes.replace(/"/g, '\\"')}"` : null,
  ]
    .filter(Boolean)
    .join("\n");

const debtTone = (net: number) =>
  net <= -3
    ? "text-red-600 dark:text-red-400"
    : net < 0
      ? "text-amber-600 dark:text-amber-400"
      : net > 5
        ? "text-blue-600 dark:text-blue-400"
        : "text-emerald-600 dark:text-emerald-400";

export default function ReciprocityStaging({
  clientSlug,
  isExample,
  existingSummaries,
  knownCounterparties,
}: {
  clientSlug: string;
  isExample: boolean;
  existingSummaries: ReciprocityCounterpartySummary[];
  knownCounterparties: { id: string; name: string; channel: string }[];
}) {
  const storageKey = `flow:reciprocity-staging:${clientSlug}`;
  const [entries, setEntries] = useState<StagedEntry[]>([]);
  const [draft, setDraft] = useState<Omit<StagedEntry, "id">>(EMPTY);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setEntries(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(entries));
    } catch {}
  }, [entries, storageKey]);

  // Debt-recompute preview: combine existing summaries with staged entries
  const previewSummaries = useMemo(() => {
    const map: Record<string, ReciprocityCounterpartySummary> = {};
    for (const s of existingSummaries) {
      map[s.counterpartyId || s.counterpartyName] = { ...s };
    }
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
      s.net = s.outbound - s.inbound;
    }
    // Show only counterparties that staged entries touch
    const touched = new Set(
      entries.map((e) => e.counterpartyId || e.counterpartyName).filter(Boolean),
    );
    return Object.values(map).filter((s) =>
      touched.has(s.counterpartyId || s.counterpartyName),
    );
  }, [entries, existingSummaries]);

  const add = () => {
    if (!draft.counterpartyName.trim() || !draft.description.trim()) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setEntries((prev) => [...prev, { ...draft, id }]);
    setDraft({ ...EMPTY, date: draft.date, channel: draft.channel });
  };

  const remove = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));
  const clearAll = () => {
    if (!confirm(`Clear all ${entries.length} staged entries?`)) return;
    setEntries([]);
  };

  const yamlBlock = entries.map((e, i) => yamlEntry(e, i)).join("\n");
  const filePath = `clients/${isExample ? "_examples/" : ""}${clientSlug}/reciprocity-ledger.md`;
  const githubEditUrl = `https://github.com/${REPO}/edit/main/${filePath}`;

  // When user picks an existing counterparty, pre-fill name + channel
  const pickKnown = (id: string) => {
    if (!id) return;
    const k = knownCounterparties.find((c) => c.id === id);
    if (!k) return;
    setDraft({
      ...draft,
      counterpartyId: k.id,
      counterpartyName: k.name,
      channel: (k.channel as "vvip" | "wealth" | "other") ?? "other",
    });
  };

  return (
    <div className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-ink-50 dark:bg-ink-950 p-5 mt-8 space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-ink-500">
            Stage a reciprocity entry
          </h3>
          <p className="text-xs text-ink-500 mt-1 max-w-2xl">
            Add entries as touches happen. Persisted in this browser. The debt-recompute preview
            below shows what the affected counterparties' net would be if these entries commit.
            When ready, "Open in GitHub to commit" appends the YAML into{" "}
            <code className="font-mono">{filePath}</code>.
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <Field label="date">
          <input
            type="date"
            value={draft.date}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            className={INPUT}
          />
        </Field>
        <Field label="known counterparty (optional)">
          <select
            value={draft.counterpartyId}
            onChange={(e) => pickKnown(e.target.value)}
            className={INPUT}
          >
            <option value="">— ad-hoc —</option>
            {knownCounterparties.map((k) => (
              <option key={k.id} value={k.id}>
                {k.name} ({k.channel})
              </option>
            ))}
          </select>
        </Field>
        <Field label="counterparty id">
          <input
            value={draft.counterpartyId}
            onChange={(e) => setDraft({ ...draft, counterpartyId: e.target.value })}
            className={INPUT}
            placeholder="e.g. fo-london-multi-01 or ad-hoc:short-name"
          />
        </Field>
        <Field label="counterparty name (anonymized for VVIP)">
          <input
            value={draft.counterpartyName}
            onChange={(e) => setDraft({ ...draft, counterpartyName: e.target.value })}
            className={INPUT}
          />
        </Field>
        <Field label="channel">
          <select
            value={draft.channel}
            onChange={(e) =>
              setDraft({ ...draft, channel: e.target.value as StagedEntry["channel"] })
            }
            className={INPUT}
          >
            {(["vvip", "wealth", "other"] as const).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="direction">
          <select
            value={draft.direction}
            onChange={(e) =>
              setDraft({ ...draft, direction: e.target.value as StagedEntry["direction"] })
            }
            className={INPUT}
          >
            {(["outbound", "inbound"] as const).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>
        <Field label="type">
          <select
            value={draft.type}
            onChange={(e) => setDraft({ ...draft, type: e.target.value })}
            className={INPUT}
          >
            {[
              "introduction",
              "event-invited",
              "event-attended",
              "gift",
              "acknowledgment",
              "courtesy",
              "referral",
              "other",
            ].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="value implied">
          <select
            value={draft.valueImplied}
            onChange={(e) =>
              setDraft({ ...draft, valueImplied: e.target.value as StagedEntry["valueImplied"] })
            }
            className={INPUT}
          >
            {(["low", "medium", "high"] as const).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <div className="col-span-2 sm:col-span-2">
          <Field label="status">
            <select
              value={draft.status}
              onChange={(e) =>
                setDraft({ ...draft, status: e.target.value as StagedEntry["status"] })
              }
              className={INPUT}
            >
              {(
                [
                  "complete",
                  "pending-acknowledge",
                  "pending-reciprocate",
                  "not-applicable",
                ] as const
              ).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="col-span-2 sm:col-span-2">
          <Field label="description">
            <input
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className={INPUT}
              placeholder="one line"
            />
          </Field>
        </div>
        <div className="col-span-2 sm:col-span-4">
          <Field label="notes (optional)">
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
        disabled={!draft.counterpartyName.trim() || !draft.description.trim()}
        className="rounded-md bg-accent text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        Stage entry
      </button>

      {/* Debt-recompute preview */}
      {previewSummaries.length > 0 && (
        <div className="border-t border-ink-200/70 dark:border-ink-800 pt-4 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-ink-400">
            Debt-recompute preview (counterparties touched by staged entries)
          </div>
          <div className="space-y-1">
            {previewSummaries.map((s) => (
              <div
                key={s.counterpartyId || s.counterpartyName}
                className="flex items-baseline justify-between text-sm font-mono"
              >
                <span>
                  <span className="text-ink-700 dark:text-ink-300">{s.counterpartyName}</span>
                  <span className="text-ink-400 ml-2 text-xs">{s.counterpartyId}</span>
                </span>
                <span className={`${debtTone(s.net)}`}>
                  in {s.inbound} · out {s.outbound} · net {s.net > 0 ? "+" : ""}
                  {s.net}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staged entries list */}
      {entries.length > 0 && (
        <div className="space-y-2 mt-2">
          <div className="text-xs font-mono uppercase tracking-wider text-ink-400">
            staged ({entries.length})
          </div>
          <ul className="space-y-1 text-sm font-mono">
            {entries.map((e) => (
              <li
                key={e.id}
                className="flex items-baseline gap-2 px-2 py-1 rounded hover:bg-ink-100 dark:hover:bg-ink-900"
              >
                <span className="text-xs text-ink-400 w-24 shrink-0">{e.date}</span>
                <span className="text-ink-700 dark:text-ink-300 truncate flex-1">
                  {e.channel} · {e.direction} · {e.type} · {e.counterpartyName} —{" "}
                  {e.description}
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

      {/* Commit */}
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
              paste under the "Entries (append-only)" yaml block, then commit
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
