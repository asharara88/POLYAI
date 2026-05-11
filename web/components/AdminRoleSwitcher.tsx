"use client";

import { useMemo } from "react";
import { Check, UserCircle2 } from "lucide-react";
import { useIdentity, type Role } from "@/lib/identity";
import { PODS, agentLabel } from "@/lib/roles";

/**
 * Admin-only role / agent switcher. Replaces the current identity in-place
 * (no sign-in friction) so a demo viewer can experience the workspace from
 * every perspective. Stays out of the public surface — mounted only in
 * /operator.
 */

type RoleChoice =
  | { kind: "admin"; label: string }
  | { kind: "cco"; label: string }
  | { kind: "manager"; agentSlug: string; label: string; podLabel: string }
  | { kind: "specialist"; agentSlug: string; label: string; podLabel: string }
  | { kind: "viewer"; label: string };

function buildChoices(): RoleChoice[] {
  const out: RoleChoice[] = [
    { kind: "admin", label: "Administrator" },
    { kind: "cco", label: "Chief Commercial Officer" },
  ];
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
  if (c.kind === "admin") return "admin";
  if (c.kind === "cco") return "cco";
  if (c.kind === "viewer") return "viewer";
  return `${c.kind}:${c.agentSlug}`;
}

function activeChoiceId(role: Role, agentSlug: string | undefined): string {
  if (role === "admin") return "admin";
  if (role === "cco") return "cco";
  if (role === "viewer") return "viewer";
  if ((role === "manager" || role === "specialist") && agentSlug)
    return `${role}:${agentSlug}`;
  return "cco";
}

function choiceToIdentity(c: RoleChoice): { role: Role; agentSlug?: string } {
  if (c.kind === "admin") return { role: "admin" };
  if (c.kind === "cco") return { role: "cco" };
  if (c.kind === "viewer") return { role: "viewer" };
  return { role: c.kind, agentSlug: c.agentSlug };
}

export default function AdminRoleSwitcher() {
  const { identity, hydrated, replaceIdentity } = useIdentity();
  const choices = useMemo(() => buildChoices(), []);

  if (!hydrated) {
    return (
      <div className="text-body-sm text-ink-500 dark:text-ink-400">Loading…</div>
    );
  }

  if (!identity) {
    return (
      <div className="text-body-sm text-ink-500 dark:text-ink-400">
        No identity. Visit /operator main entrypoint to grant admin first.
      </div>
    );
  }

  const activeId = activeChoiceId(identity.role, identity.agentSlug);

  const switchTo = (c: RoleChoice) => {
    const { role, agentSlug } = choiceToIdentity(c);
    replaceIdentity({
      name: identity.name,
      email: identity.email,
      organization: identity.organization,
      role,
      agentSlug,
      workspace: identity.workspace,
    });
  };

  // Group for display
  const leadership = choices.filter(
    (c) => c.kind === "admin" || c.kind === "cco",
  );
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
    <div className="space-y-5">
      <div className="rounded-md border border-ink-200/70 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-950/30 px-3 py-2.5 flex items-center gap-2.5">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent flex-shrink-0">
          <UserCircle2 className="w-4 h-4" aria-hidden />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-body-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50 truncate">
            {identity.name}
          </div>
          <div className="text-label-xs font-mono text-ink-500 dark:text-ink-400 truncate">
            {labelFor(activeId, choices)}
          </div>
        </div>
      </div>

      <SwitcherGroup label="Leadership" items={leadership} activeId={activeId} onPick={switchTo} />
      <SwitcherGroup label="Pod managers" items={managers} activeId={activeId} onPick={switchTo} />
      {Array.from(specialistsByPod.entries()).map(([pod, list]) => (
        <SwitcherGroup
          key={pod}
          label={`${pod} specialists`}
          items={list}
          activeId={activeId}
          onPick={switchTo}
        />
      ))}
      <SwitcherGroup label="Read-only" items={viewers} activeId={activeId} onPick={switchTo} />
    </div>
  );
}

function labelFor(id: string, choices: RoleChoice[]): string {
  const c = choices.find((c) => choiceId(c) === id);
  if (!c) return id;
  if (c.kind === "manager" || c.kind === "specialist") {
    return `${c.label} · ${c.podLabel}`;
  }
  return c.label;
}

function SwitcherGroup({
  label,
  items,
  activeId,
  onPick,
}: {
  label: string;
  items: RoleChoice[];
  activeId: string;
  onPick: (c: RoleChoice) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="text-label-xs font-mono uppercase tracking-wider text-ink-400 mb-1.5">
        {label}
      </div>
      <div className="grid sm:grid-cols-2 gap-1.5">
        {items.map((c) => {
          const id = choiceId(c);
          const active = id === activeId;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onPick(c)}
              aria-pressed={active}
              className={[
                "flex items-center gap-2.5 px-3 py-2 rounded-md border text-left transition-colors",
                active
                  ? "border-accent/40 bg-accent/5 text-ink-900 dark:text-ink-50"
                  : "border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-accent/30 hover:bg-ink-50/40 dark:hover:bg-ink-950/40 text-ink-700 dark:text-ink-200",
              ].join(" ")}
            >
              <span
                aria-hidden
                className={[
                  "inline-flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0",
                  active
                    ? "bg-accent text-white"
                    : "bg-ink-100 dark:bg-ink-800 text-transparent",
                ].join(" ")}
              >
                {active && <Check className="w-3 h-3" />}
              </span>
              <span className="text-body-sm font-medium truncate">
                {c.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
