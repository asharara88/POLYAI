/**
 * Pod registry — maps the .claude/agents/ tree onto the role picker UX.
 *
 * Source of truth for the org structure surfaced in:
 * - SignInModal grouped picker
 * - AdminRoleSwitcher in /operator
 * - Per-pod scope helpers (role-scope.ts)
 *
 * Manager agents own a pod; specialists report up. Cross-cutting agents
 * (compliance, legal-liaison, regulatory-research-specialist, etc.) sit
 * directly under the CCO and don't have a managing pod.
 */

export type PodId =
  | "sales"
  | "marketing"
  | "crm"
  | "wealth-vvip"
  | "cco-direct";

export type Pod = {
  id: PodId;
  label: string;
  /** The manager-tier agent slug; null for cco-direct (specialists report straight to CCO). */
  managerAgent: string | null;
  /** Specialist agent slugs that report up. Used for the Specialist picker. */
  specialists: string[];
};

export const PODS: Pod[] = [
  {
    id: "sales",
    label: "Sales",
    managerAgent: "sales-manager",
    specialists: [
      "sdr",
      "inbound-qualifier",
      "account-executive",
      "proposal",
      "account-manager",
      "forecasting",
      "deal-desk-analyst",
      "secondary-market-specialist",
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    managerAgent: "marketing-manager",
    specialists: [
      "strategy",
      "research",
      "creative",
      "brand-design",
      "seo",
      "social-media",
      "analytics",
      "content-pr-specialist",
      "events",
      "partnerships",
      "competitive-intel",
      "martech-ops-specialist",
      "marketing-financial-manager",
      "marketing-procurement",
      "agency-liaison",
    ],
  },
  {
    id: "crm",
    label: "CRM",
    managerAgent: "crm-manager",
    specialists: [
      "email-lifecycle",
      "voc",
      "service-recovery-specialist",
      "data-quality-steward",
    ],
  },
  {
    id: "wealth-vvip",
    label: "Wealth & VVIP",
    managerAgent: "wealth-vvip-manager",
    specialists: [
      "broker-enablement",
      "wealth-channel-enablement",
      "vvip-channel-enablement",
      "vip-relationship-manager",
      "aml-kyc-compliance-specialist",
    ],
  },
  {
    id: "cco-direct",
    label: "CCO direct",
    managerAgent: null,
    specialists: [
      "compliance",
      "review",
      "legal-liaison",
      "regulatory-research-specialist",
      "risk-register-curator",
      "horizon-scanner",
      "decision-router",
      "data-room-curator",
      "inventory-manager",
      "project-manager",
      "knowledge",
      "client-onboarding",
      "localization",
      "cco-morning-brief",
    ],
  },
];

/** All manager-tier agent slugs (for sign-in modal Manager group + nav scoping). */
export const MANAGER_SLUGS: string[] = PODS.flatMap((p) =>
  p.managerAgent ? [p.managerAgent] : [],
);

/** All specialist agent slugs (flattened across pods). */
export const SPECIALIST_SLUGS: string[] = PODS.flatMap((p) => p.specialists);

/** Return the pod a given agent slug belongs to, or null if unknown. */
export function podForAgent(slug: string): Pod | null {
  for (const pod of PODS) {
    if (pod.managerAgent === slug) return pod;
    if (pod.specialists.includes(slug)) return pod;
  }
  return null;
}

/** Pretty-print an agent slug as a label (kebab → Title Case). */
export function agentLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w === "vvip" ? "VVIP" : w === "cco" ? "CCO" : w === "kyc" ? "KYC" : w === "aml" ? "AML" : w === "seo" ? "SEO" : w === "pr" ? "PR" : w === "voc" ? "VOC" : w[0]?.toUpperCase() + w.slice(1)))
    .join(" ");
}

/** True if the slug is a manager-tier agent (vs specialist). */
export function isManagerAgent(slug: string): boolean {
  return MANAGER_SLUGS.includes(slug);
}
