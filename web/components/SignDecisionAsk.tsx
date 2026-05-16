"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  LogIn,
  Send,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useIdentity } from "@/lib/identity";
import { canSignClass, scopeFor } from "@/lib/role-scope";
import SignInModal from "@/components/SignInModal";

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
  className,
}: {
  client: string;
  askId: string;
  className?: string;
}) {
  const router = useRouter();
  const { identity, hydrated } = useIdentity();
  const scope = scopeFor(identity?.role ?? "cco", identity?.agentSlug);
  // Sign gating: if the identity's scope doesn't cover this decision class,
  // disable the Sign action with a tooltip explaining why.
  const canSign = !hydrated || !className || canSignClass(scope, className);
  const blockedReason = !canSign
    ? identity?.role === "specialist"
      ? "Specialists comment and route up — only managers sign."
      : identity?.role === "viewer"
        ? "Viewers can read; sign requires a manager or CCO role."
        : `This decision is outside your pod's scope. CCO or the owning pod manager can sign.`
    : null;
  const [open, setOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [decision, setDecision] = useState<Decision>("approve");
  const [comment, setComment] = useState("");
  const [signer, setSigner] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    // Prefer authenticated identity; fall back to free-text signer (demo mode)
    const effectiveSigner = identity
      ? `${identity.name}${identity.organization ? ` (${identity.organization})` : ""}`
      : signer.trim();
    if (!effectiveSigner) {
      toast.error("Signer required", {
        description: "Sign in or enter a signer name to attribute this decision.",
      });
      return;
    }
    setBusy(true);
    const toastId = toast.loading(`Signing ${askId}…`);
    try {
      const res = await fetch("/api/decision-ask/sign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ client, askId, decision, comment, signer: effectiveSigner }),
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

  // Inline sign-in: a signed-out user clicking Sign opens the sign-in modal
  // with a "pending sign" flag. Once an identity hydrates, the form opens
  // automatically and the modal closes — no second click needed.
  const pendingOpenRef = useRef(false);
  useEffect(() => {
    if (pendingOpenRef.current && identity) {
      pendingOpenRef.current = false;
      setOpen(true);
      setSignInOpen(false);
    }
  }, [identity]);

  const handleSignClick = () => {
    if (!identity) {
      pendingOpenRef.current = true;
      setSignInOpen(true);
      return;
    }
    setOpen(true);
  };

  if (!open) {
    return (
      <>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="success"
            startIcon={<Check className="w-3.5 h-3.5" />}
            onClick={handleSignClick}
            disabled={!canSign}
            aria-label={`Sign decision ${askId}`}
            title={blockedReason ?? undefined}
          >
            {identity ? "Sign" : "Sign in to sign"}
          </Button>
          {identity && (
            <span className="text-label-xs font-mono text-ink-400 inline-flex items-center gap-1">
              <span
                className={[
                  "w-1.5 h-1.5 rounded-full",
                  canSign ? "bg-success-500" : "bg-warning-500",
                ].join(" ")}
                aria-hidden
              />
              {identity.name}
            </span>
          )}
          {blockedReason && (
            <span className="text-label-xs text-warning-700 dark:text-warning-300 leading-snug max-w-md">
              {blockedReason}
            </span>
          )}
        </div>
        <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      </>
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
            signer {identity && <span className="text-success-600 dark:text-success-400 normal-case">· authenticated</span>}
          </div>
          {identity ? (
            <div className="w-full bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-md px-3 py-2 text-body-sm font-mono text-ink-700 dark:text-ink-200 truncate">
              {identity.name}
              {identity.organization && (
                <span className="text-ink-400"> · {identity.organization}</span>
              )}
            </div>
          ) : (
            <input
              type="text"
              value={signer}
              onChange={(e) => setSigner(e.target.value)}
              disabled={busy}
              placeholder="e.g. CCO (UAE Developments) — or sign in to autofill"
              aria-label="Signer name"
              className="w-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-md px-3 py-2 text-body-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          )}
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

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          size="sm"
          variant={DECISION_VARIANT[decision]}
          onClick={submit}
          disabled={!identity && !signer.trim()}
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
