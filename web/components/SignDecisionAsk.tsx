"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Decision = "approve" | "approve-with-modifications" | "decline" | "send-back";

const DECISION_LABEL: Record<Decision, string> = {
  approve: "Approve",
  "approve-with-modifications": "Approve with modifications",
  decline: "Decline",
  "send-back": "Send back",
};

const DECISION_TONE: Record<Decision, string> = {
  approve: "bg-emerald-600 hover:bg-emerald-700 text-white",
  "approve-with-modifications": "bg-blue-600 hover:bg-blue-700 text-white",
  decline: "bg-red-600 hover:bg-red-700 text-white",
  "send-back": "bg-amber-600 hover:bg-amber-700 text-white",
};

export default function SignDecisionAsk({
  client,
  askId,
}: {
  client: string;
  askId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [decision, setDecision] = useState<Decision>("approve");
  const [comment, setComment] = useState("");
  const [signer, setSigner] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    decision: string;
    mode?: string;
    commitUrl?: string;
    note?: string;
  } | null>(null);

  const submit = async () => {
    if (!signer.trim()) {
      setError("signer name required");
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/decision-ask/sign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ client, askId, decision, comment, signer }),
      });
      const j = await res.json();
      if (!res.ok) {
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      setSuccess({
        decision: j.decision,
        mode: j.mode,
        commitUrl: j.commitUrl,
        note: j.note,
      });
      // Refresh the route to re-read the queue
      setTimeout(() => router.refresh(), 800);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <div className="flex items-center gap-2 pt-2 border-t border-ink-100 dark:border-ink-800">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-medium transition-colors"
        >
          Sign
        </button>
        <span className="text-[10px] font-mono text-ink-400">
          opens form · POST /api/decision-ask/sign
        </span>
      </div>
    );
  }

  return (
    <div className="pt-3 border-t border-ink-100 dark:border-ink-800 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-xs">
          <div className="font-mono uppercase tracking-wider text-ink-400 mb-1">
            decision
          </div>
          <select
            value={decision}
            onChange={(e) => setDecision(e.target.value as Decision)}
            disabled={busy}
            className="w-full bg-transparent border border-ink-200 dark:border-ink-700 rounded px-2 py-1.5 text-sm"
          >
            {(Object.keys(DECISION_LABEL) as Decision[]).map((d) => (
              <option key={d} value={d}>
                {DECISION_LABEL[d]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          <div className="font-mono uppercase tracking-wider text-ink-400 mb-1">
            signer
          </div>
          <input
            type="text"
            value={signer}
            onChange={(e) => setSigner(e.target.value)}
            disabled={busy}
            placeholder="e.g. CCO (Aldar)"
            className="w-full bg-transparent border border-ink-200 dark:border-ink-700 rounded px-2 py-1.5 text-sm font-mono"
          />
        </label>
      </div>
      <label className="text-xs block">
        <div className="font-mono uppercase tracking-wider text-ink-400 mb-1">
          comment (optional — one line; will appear in audit trail)
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={busy}
          placeholder="Reasoning, conditions, modifications…"
          rows={2}
          className="w-full bg-transparent border border-ink-200 dark:border-ink-700 rounded px-2 py-1.5 text-sm"
        />
      </label>

      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 px-3 py-2 text-xs text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300 space-y-1">
          <div>
            <strong>Signed: {success.decision}</strong>
            {success.mode && (
              <span className="ml-1.5 font-mono text-[10px] opacity-80">
                · {success.mode === "github" ? "persisted via GitHub commit" : "filesystem write"}
              </span>
            )}
          </div>
          {success.commitUrl && (
            <div>
              <a
                href={success.commitUrl}
                target="_blank"
                rel="noopener"
                className="font-mono text-[11px] underline hover:no-underline"
              >
                view commit ›
              </a>
            </div>
          )}
          {success.note && (
            <div className="text-[11px] opacity-80">{success.note}</div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={busy || !signer.trim()}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${DECISION_TONE[decision]}`}
        >
          {busy ? "…" : DECISION_LABEL[decision]}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
            setSuccess(null);
          }}
          disabled={busy}
          className="rounded-md bg-ink-100 hover:bg-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-300 px-3 py-1.5 text-xs font-medium"
        >
          Cancel
        </button>
        <span className="ml-auto text-[10px] font-mono text-ink-400">
          persistence: server-resolved (local FS or GitHub)
        </span>
      </div>
    </div>
  );
}
