"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Send,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui";

type Decision = "approve" | "approve-with-modifications" | "decline" | "send-back";

const DECISION_LABEL: Record<Decision, string> = {
  approve: "Approve",
  "approve-with-modifications": "Approve with modifications",
  decline: "Decline",
  "send-back": "Send back",
};

const DECISION_VARIANT: Record<Decision, "success" | "primary" | "danger" | "warning"> = {
  approve: "success",
  "approve-with-modifications": "primary",
  decline: "danger",
  "send-back": "warning",
};

const DECISION_ICON: Record<Decision, React.ReactNode> = {
  approve: <Check className="w-3.5 h-3.5" />,
  "approve-with-modifications": <CheckCircle2 className="w-3.5 h-3.5" />,
  decline: <XCircle className="w-3.5 h-3.5" />,
  "send-back": <Send className="w-3.5 h-3.5" />,
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

  const submit = async () => {
    if (!signer.trim()) {
      toast.error("Signer name required", {
        description: "Enter the human signer (e.g. CCO name).",
      });
      return;
    }
    setBusy(true);
    const toastId = toast.loading(`Signing ${askId}…`);
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
      const description = j.commitUrl ? (
        <span>
          Persisted via GitHub commit ·{" "}
          <a
            href={j.commitUrl}
            target="_blank"
            rel="noopener"
            className="underline hover:no-underline"
          >
            view commit ↗
          </a>
        </span>
      ) : j.note ? (
        j.note
      ) : (
        `Persisted to ${j.queuePath ?? "queue.md"}`
      );
      toast.success(`${askId}: ${j.decision}`, {
        id: toastId,
        description,
        duration: 8000,
      });
      setOpen(false);
      setComment("");
      setSigner("");
      // Refresh server data
      setTimeout(() => router.refresh(), 600);
    } catch (e) {
      toast.error(`Sign failed for ${askId}`, {
        id: toastId,
        description: (e as Error).message,
        duration: 10000,
      });
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <div className="flex items-center gap-2 pt-2 border-t border-ink-100 dark:border-ink-800">
        <Button
          size="sm"
          variant="success"
          startIcon={<Check className="w-3.5 h-3.5" />}
          onClick={() => setOpen(true)}
          aria-label={`Open sign form for ${askId}`}
        >
          Sign
        </Button>
        <span className="text-label-xs font-mono text-ink-400">
          opens form · POST /api/decision-ask/sign
        </span>
      </div>
    );
  }

  return (
    <div className="pt-3 border-t border-ink-100 dark:border-ink-800 space-y-3 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-body-xs">
          <div className="font-mono uppercase tracking-wider text-label-xs text-ink-400 mb-1">
            decision
          </div>
          <div className="relative">
            <select
              value={decision}
              onChange={(e) => setDecision(e.target.value as Decision)}
              disabled={busy}
              aria-label="Decision type"
              className="w-full appearance-none bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-md px-3 py-2 pr-8 text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              {(Object.keys(DECISION_LABEL) as Decision[]).map((d) => (
                <option key={d} value={d}>
                  {DECISION_LABEL[d]}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
          </div>
        </label>
        <label className="text-body-xs">
          <div className="font-mono uppercase tracking-wider text-label-xs text-ink-400 mb-1">
            signer
          </div>
          <input
            type="text"
            value={signer}
            onChange={(e) => setSigner(e.target.value)}
            disabled={busy}
            placeholder="e.g. CCO (Aldar)"
            aria-label="Signer name"
            className="w-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-md px-3 py-2 text-body-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </label>
      </div>
      <label className="text-body-xs block">
        <div className="font-mono uppercase tracking-wider text-label-xs text-ink-400 mb-1">
          comment (optional — appears in audit trail)
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={busy}
          placeholder="Reasoning, conditions, modifications…"
          rows={2}
          aria-label="Comment"
          className="w-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-md px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </label>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={DECISION_VARIANT[decision]}
          onClick={submit}
          disabled={!signer.trim()}
          loading={busy}
          startIcon={busy ? undefined : DECISION_ICON[decision]}
        >
          {DECISION_LABEL[decision]}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          startIcon={<X className="w-3.5 h-3.5" />}
          onClick={() => setOpen(false)}
          disabled={busy}
        >
          Cancel
        </Button>
        <span className="ml-auto text-label-xs font-mono text-ink-400 inline-flex items-center gap-1">
          <ExternalLink className="w-3 h-3" aria-hidden />
          server-resolved persistence
        </span>
      </div>
    </div>
  );
}
