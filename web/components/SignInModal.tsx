"use client";

import { useMemo, useState } from "react";
import { LogIn, X } from "lucide-react";
import { Button } from "@/components/ui";
import { useIdentity, type Role } from "@/lib/identity";
import { PODS, agentLabel } from "@/lib/roles";
import { AldarMark } from "@/components/AldarMark";
import { FlowMark } from "@/components/FlowLogo";

/**
 * Role choice — flat list shaped from the .claude/agents tree.
 * Each entry is either a leadership role (no agentSlug) or a specific
 * manager/specialist agent (agentSlug required, used by Phase 17 chat persona).
 */
type RoleChoice =
  | { kind: "cco"; label: string }
  | { kind: "manager"; agentSlug: string; label: string; podLabel: string }
  | { kind: "specialist"; agentSlug: string; label: string; podLabel: string }
  | { kind: "viewer"; label: string };

function buildChoices(): RoleChoice[] {
  const out: RoleChoice[] = [];
  out.push({ kind: "cco", label: "Chief Commercial Officer" });
  for (const pod of PODS) {
    if (pod.managerAgent) {
      out.push({
        kind: "manager",
        agentSlug: pod.managerAgent,
        label: `${pod.label} manager`,
        podLabel: pod.label,
      });
    }
  }
  for (const pod of PODS) {
    for (const slug of pod.specialists) {
      out.push({
        kind: "specialist",
        agentSlug: slug,
        label: agentLabel(slug),
        podLabel: pod.label,
      });
    }
  }
  out.push({ kind: "viewer", label: "Viewer (read-only)" });
  return out;
}

function choiceId(c: RoleChoice): string {
  if (c.kind === "cco") return "cco";
  if (c.kind === "viewer") return "viewer";
  return `${c.kind}:${c.agentSlug}`;
}

function choiceToIdentity(c: RoleChoice): { role: Role; agentSlug?: string } {
  if (c.kind === "cco") return { role: "cco" };
  if (c.kind === "viewer") return { role: "viewer" };
  return { role: c.kind, agentSlug: c.agentSlug };
}

export default function SignInModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { signIn } = useIdentity();
  const choices = useMemo(() => buildChoices(), []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [selectedId, setSelectedId] = useState<string>("cco");

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const choice = choices.find((c) => choiceId(c) === selectedId) ?? choices[0];
    const { role, agentSlug } = choiceToIdentity(choice);
    signIn({
      name: name.trim(),
      email: email.trim() || undefined,
      organization: organization.trim() || undefined,
      role,
      agentSlug,
    });
    onClose();
  };

  // Group choices for the picker
  const leadership = choices.filter((c) => c.kind === "cco");
  const managers = choices.filter((c) => c.kind === "manager");
  const specialistsByPod = new Map<string, RoleChoice[]>();
  for (const c of choices) {
    if (c.kind !== "specialist") continue;
    const list = specialistsByPod.get(c.podLabel) ?? [];
    list.push(c);
    specialistsByPod.set(c.podLabel, list);
  }
  const viewers = choices.filter((c) => c.kind === "viewer");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 animate-fade-in"
    >
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-card bg-white dark:bg-ink-900 shadow-popover border border-ink-200/70 dark:border-ink-800 overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        <header className="px-5 py-4 border-b border-ink-100 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-950/40 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-accent">
              <AldarMark size={22} />
            </span>
            <h2 id="signin-title" className="text-title-sm font-semibold tracking-tight">
              Sign in to Aldar Developments
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <form onSubmit={submit} className="px-5 py-4 space-y-4 overflow-y-auto">
          <p className="text-body-sm text-ink-500 dark:text-ink-400">
            Pick the role you operate as. Identity attributes decision-ask
            signatures and shapes what you see across the workspace. Stored
            locally on this device (demo mode).
          </p>

          <label className="block">
            <span className="text-label-xs font-mono uppercase tracking-wider text-ink-400">
              Name *
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder="e.g. Jane Doe"
              className="mt-1 w-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-md px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>

          <label className="block">
            <span className="text-label-xs font-mono uppercase tracking-wider text-ink-400">
              Email (optional)
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@aldar.ae"
              className="mt-1 w-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-md px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>

          <label className="block">
            <span className="text-label-xs font-mono uppercase tracking-wider text-ink-400">
              Organization (optional)
            </span>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Aldar Developments"
              className="mt-1 w-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-md px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>

          <div>
            <span className="text-label-xs font-mono uppercase tracking-wider text-ink-400">
              Role
            </span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="mt-1 w-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-md px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <optgroup label="Leadership">
                {leadership.map((c) => (
                  <option key={choiceId(c)} value={choiceId(c)}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Pod managers">
                {managers.map((c) => (
                  <option key={choiceId(c)} value={choiceId(c)}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
              {Array.from(specialistsByPod.entries()).map(([pod, list]) => (
                <optgroup key={pod} label={`${pod} specialists`}>
                  {list.map((c) => (
                    <option key={choiceId(c)} value={choiceId(c)}>
                      {c.label}
                    </option>
                  ))}
                </optgroup>
              ))}
              <optgroup label="Read-only">
                {viewers.map((c) => (
                  <option key={choiceId(c)} value={choiceId(c)}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
            </select>
            <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-1.5 leading-snug">
              Managers can sign decisions in their pod. Specialists comment
              and route up. The CCO sees and signs across all pods.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              startIcon={<LogIn className="w-3.5 h-3.5" />}
              disabled={!name.trim()}
            >
              Sign in
            </Button>
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>

        <footer className="px-5 py-3 border-t border-ink-100 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-950/40 flex items-center justify-between gap-3 text-body-xs text-ink-500 dark:text-ink-400 flex-shrink-0">
          <span className="leading-snug">
            Worked example — illustrative. Not real Aldar Properties PJSC data.
          </span>
          <span className="inline-flex items-center gap-1.5 flex-shrink-0">
            Built on
            <span className="text-accent">
              <FlowMark size={12} />
            </span>
            <span className="font-medium text-ink-600 dark:text-ink-300">Flow</span>
          </span>
        </footer>
      </div>
    </div>
  );
}
