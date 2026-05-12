/**
 * Per-role / per-agent scope predicates.
 *
 * Used by:
 * - /cco data filtering — which decision asks, risks, calendar items are
 *   relevant to the active identity
 * - SignDecisionAsk gating — can this identity sign this decision class
 * - Nav shaping — which nav items show
 *
 * Scope is keyed by the agent's pod (sales / marketing / crm / wealth-vvip).
 * The CCO and admin see everything. Specialists see their pod's surface but
 * can't sign decisions by default — they comment and route up.
 */

import type { Role } from "@/lib/identity";
import { podForAgent, type PodId } from "@/lib/roles";

/**
 * Decision-ask `class` strings observed in clients/<slug>/decision-asks/queue.md.
 * Lowercased substring matching is used in `classMatchesPod` because the source
 * data is human-authored and uses phrases like "commercial / deal-desk",
 * "marketing / channel", etc.
 */
const POD_CLASS_HINTS: Record<PodId, string[]> = {
  sales: [
    "commercial",
    "deal-desk",
    "sales",
    "pipeline",
    "broker",
    "account",
    "secondary-market",
    "channel",
  ],
  marketing: [
    "marketing",
    "campaign",
    "brand",
    "creative",
    "channel-mix",
    "events",
    "press",
    "pr",
    "seo",
    "content",
    "research",
    "analytics",
  ],
  crm: [
    "crm",
    "lifecycle",
    "loyalty",
    "complaint",
    "service-recovery",
    "customer",
    "voc",
    "retention",
    "email",
    "data-quality",
  ],
  "wealth-vvip": [
    "wealth",
    "vvip",
    "broker",
    "relationship",
    "channel",
    "private-bank",
    "family-office",
    "aml",
    "kyc",
    "sanctions",
    "pep",
  ],
  "cco-direct": [
    "compliance",
    "regulatory",
    "legal",
    "risk",
    "horizon",
  ],
};

/** True if a free-text class label "looks like" it belongs to the given pod. */
export function classMatchesPod(classLabel: string, podId: PodId): boolean {
  if (!classLabel) return false;
  const lc = classLabel.toLowerCase();
  return POD_CLASS_HINTS[podId].some((hint) => lc.includes(hint));
}

export type Scope = {
  /** True = sees every decision/risk/calendar item regardless of pod attribution. */
  seesAll: boolean;
  /** Pods this identity cares about. Used to filter when seesAll is false. */
  pods: PodId[];
  /** True if this identity can sign decision asks (vs just comment / route up). */
  canSign: boolean;
};

/**
 * Compute scope from a role + agentSlug. Defaults to a safe read-only scope.
 */
export function scopeFor(role: Role, agentSlug?: string): Scope {
  if (role === "admin" || role === "cco") {
    return { seesAll: true, pods: [], canSign: true };
  }
  if (role === "viewer") {
    return { seesAll: true, pods: [], canSign: false };
  }
  if (role === "manager") {
    if (!agentSlug) return { seesAll: false, pods: [], canSign: false };
    const pod = podForAgent(agentSlug);
    return {
      seesAll: false,
      pods: pod ? [pod.id] : [],
      canSign: true,
    };
  }
  if (role === "specialist") {
    if (!agentSlug) return { seesAll: false, pods: [], canSign: false };
    const pod = podForAgent(agentSlug);
    return {
      seesAll: false,
      pods: pod ? [pod.id] : [],
      // Specialists comment by default; only managers sign.
      canSign: false,
    };
  }
  return { seesAll: false, pods: [], canSign: false };
}

/**
 * Predicate: does a free-text class label fall within this identity's scope?
 * Used to filter decision asks, risks, etc. on /cco.
 */
export function inScope(scope: Scope, classLabel: string): boolean {
  if (scope.seesAll) return true;
  if (!classLabel) return false;
  return scope.pods.some((p) => classMatchesPod(classLabel, p));
}

/**
 * Predicate: can this identity sign a decision with the given class label?
 */
export function canSignClass(scope: Scope, classLabel: string): boolean {
  if (!scope.canSign) return false;
  if (scope.seesAll) return true;
  return inScope(scope, classLabel);
}

/**
 * Role-shaped nav items. Returns the visible primary nav for the active
 * identity. Common base: Today / Decisions / Projects / Ask. Admin adds
 * Operator. Specialists add their agent profile link.
 */
export type NavItem = {
  href: string;
  label: string;
  iconKey: "today" | "decisions" | "projects" | "ask" | "operator" | "agent" | "pod" | "launches";
};

export function navItemsFor(
  role: Role,
  agentSlug: string | undefined,
): NavItem[] {
  const base: NavItem[] = [
    { href: "/launches", label: "Launches", iconKey: "launches" },
    { href: "/cco", label: "Today", iconKey: "today" },
    { href: "/approvals", label: "Decisions", iconKey: "decisions" },
    { href: "/chat", label: "Ask", iconKey: "ask" },
  ];
  if (role === "admin") {
    return [...base, { href: "/operator", label: "Operator", iconKey: "operator" }];
  }
  if ((role === "manager" || role === "specialist") && agentSlug) {
    const pod = podForAgent(agentSlug);
    const podLabel = pod && pod.id !== "cco-direct" ? `${pod.label} pod` : "My agent";
    return [
      ...base,
      { href: `/agents/${agentSlug}`, label: podLabel, iconKey: role === "manager" ? "pod" : "agent" },
    ];
  }
  return base;
}
