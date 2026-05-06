# REVIEW — what changed, what was left alone, what to validate

This document is the post-extension companion to `AUDIT.md` (pre-state), `GAPS.md` (deltas), `PLAN.md` (intent), and `CHANGELOG.md` (per-commit ledger). Read this if you are the human deciding whether the extension is fit-for-purpose.

## What changed (executive summary)

| Layer | Before | After | Delta |
|---|---|---|---|
| Agents | 32 | 41 | +9 (4 managers, 2 P1, 5 P2, 4 P3 — 1 was the rename, not net) |
| Skills | 0 | 7 | +7 (3 P1 + 4 P3) |
| Integrations (specs) | 2 (canva, miro) | 5 (canva, miro, salesforce, sumsub, trakheesi) | +3 |
| Runbooks | 0 | 10 (1 README + 9 scenarios) | +9 |
| Schemas | 8 | 8 | 0 (existing schemas were sound) |
| Verticals | 1 (real-estate) + 1 sub-vertical (developer) | unchanged | 0 |
| Web layer | 1 chat surface + dashboards + pages | unchanged structurally; pod groupings updated on agents page | content-only |

Total new files: 33. Total modified files: 6. Total deleted files: 0. All changes are reversible via `git revert` of the four phase commits (`6f407e4`, `89c19cb`, `46a8847`, `4381750`) plus the Phase 4E doc commit.

## What was deliberately LEFT ALONE (and why)

The audit found a substantively well-architected system. The extension principle was *additive, minimum-edit* — preserve what works, add what's missing.

| Component | Reason for leaving alone |
|---|---|
| `creative` + `brand-design` separation | Different concerns (copy vs. visuals); merging dilutes per the §3 rule "do not rename for cosmetic conformity" |
| `voc` + `analytics` separation | Outward (customer language) vs. inward (our metrics) — different sensibilities |
| `wealth-channel-enablement` absorbing private-banking-liaison + family-office-specialist | Splitting them doubles management surface for marginal gain |
| `chief-commercial-officer` (renamed from orchestrator) — kept multi-tenant, NOT renamed to `aldar-chief-of-staff` | Multi-tenancy preservation; the Aldar worked example is one tenant, not the system |
| Existing schemas (8 of them) | Sound; they shape the entire handoff discipline |
| Existing tools allowlists per agent | Narrowing them would break legitimate operations |
| Existing 3-layer context resolution (client → vertical → root) | Architecturally fundamental; kept verbatim with one paragraph addition for skills + runbooks in `ARCHITECTURE.md` |
| Existing approval-gates pattern | Kept; per-client overrides still win |
| `proposal` agent | Different concern from new `deal-desk-analyst` (document generation vs. analysis); both kept distinct |
| `client-onboarding` | Worked as-is; UAE specifics live in the vertical playbook it reads |
| `agency-liaison`, `inventory-manager`, `marketing-procurement`, `marketing-financial-manager`, `events`, `forecasting`, `knowledge` | Solid and operational |

## Top 5 things to validate before treating this as production-ready

### 1. Manager tier routing in practice

The 4 pod managers were added per your decision; specialists' escalation rules were rewritten (via bulk rename) to point to `chief-commercial-officer`. Verify in practice that:

- Specialists know to route day-to-day through their pod manager (the new agent prompts say so; the existing prompts inherit through the rename but were not individually rewritten)
- Pod managers' `handoff matrix` sections capture the right specialists in their pod
- The CCO is not flooded with routine routing requests that should land at the pod manager

**How to validate:** trace one full multi-step task through the team (e.g., a launch-campaign brief request) and confirm the routing topology matches the manager-tier intent. If specialists keep going direct to CCO, the manager tier needs reinforcement in the specialist prompts.

### 2. Regulatory citation discipline

The skills library deliberately stays framework-level — every regulatory citation routes to `regulatory-research-specialist` for current-rule confirmation per use. This is the right architecture **only if `regulatory-research-specialist` is consulted in practice**, not bypassed.

**How to validate:** pick one ship-blocking artifact (e.g., an off-plan launch landing page draft) and walk through the compliance flow: does `compliance` actually loop in `regulatory-research-specialist` for current-Trakheesi requirements, or does it use the framework wording from the skill directly? The latter is the failure mode the architecture is designed to prevent.

### 3. AML/KYC enforcement at workflow boundaries

The `aml-kyc-compliance-specialist` exists; the `runbooks/pep-sanctions-hit.md` exists; the `integrations/sumsub/spec.md` exists; multiple workflows reference the AML gate (e.g., `runbooks/resale-with-noc.md` step 4-5, `runbooks/inbound-hnw-private-bank.md` step 3, `integrations/salesforce/actions/stage-advance.md` precondition `aml_kyc_currency`). **Validate that these gates actually fire** — i.e., that `account-executive` cannot stage-advance an Opportunity with stale or missing AML/KYC verdict, and that `secondary-market-specialist` cannot progress a Form-F transfer with `hold-pending-edd` on the buyer.

**How to validate:** simulate a stage-advance attempt with no AML/KYC field populated and confirm it would block at precondition-check; simulate an NOC issuance flow with a sanctions-flagged buyer and confirm it routes to `runbooks/pep-sanctions-hit.md` rather than continuing.

### 4. Discretion-stance enforcement on VVIP-touching artifacts

The `vvip-channel-enablement` agent maintains the no-mention list; the `compliance` agent now references it as a block-on-sight; `content-pr-specialist`, `creative`, `social-media`, `email-lifecycle`, `events` all need to cross-reference it before ship. The `runbooks/press-sensitive-uhnw-transaction.md` overlays restricted-access discipline on the entire transaction lifecycle.

**How to validate:** introduce a fake VVIP counterparty into a campaign brief and confirm it gets blocked at compliance review; verify the per-client `vvip-channel/no-mention-list.md` is populated for any client with VVIP-touching activity (the worked-example Aldar client should have one; check it).

### 5. Integration specs are unwired

All three new integration specs (Salesforce, Sumsub, Trakheesi) are **specs only**. They are not actually wired to live systems. Agents that reference them (`account-executive`, `aml-kyc-compliance-specialist`, `compliance`, etc.) will produce well-shaped `integration-action` envelopes per `schemas/integration-action.md`, but there is no integration runtime currently picking them up.

**How to validate:** decide per-engagement which integrations to wire first. Salesforce + Sumsub are typically the highest-leverage. Trakheesi is record-keeping + verification (no DLD API yet); it activates immediately on entry of permit numbers into the per-client folder. Until wiring happens, the specs serve as the documentation shape and the team's procedural discipline; per-action envelopes accumulate as proposed-but-not-executed for human review.

## Architectural decisions worth re-confirming

These were embedded in execution per your `1. yes 2. ok 3. ok 4. CCO 5. yes vip-relationship-manager 6. order 7. per regulatory-research-specialist` confirmation. Surfacing them so they aren't quietly assumed:

- **Manager tier is in.** 4 pod managers between CCO and specialists. Reversible by deleting the 4 manager agent files + reverting specialist escalation pointers.
- **Skills directory is in.** New pattern at `.claude/skills/`. 7 skills seeded.
- **Runbooks directory is in.** New pattern at `runbooks/`. 10 runbooks seeded.
- **Orchestrator → Chief Commercial Officer rename is in.** Sibling C-level orchestrators (CHRO, CPO, CFO-agent) reserved for future expansion to other departments.
- **`vip-relationship-manager` is the concierge agent name.** Separate from `vvip-channel-enablement` (which manages royal/ministerial protocol).
- **Regulatory citations stay framework-level in skills.** Current per-use confirmation routes to `regulatory-research-specialist`. The skill doctrine is "what the regulator regulates and how the rule generally works," not "what the rule says today."

## What this extension does NOT solve

For honesty, here are gaps the extension intentionally did not close:

1. **Live integration wiring.** Specs are written; runtime is not. Decision: per-engagement, when actual systems are connected.
2. **ADREC-equivalent integration spec.** Trakheesi spec exists for Dubai; the Abu Dhabi advertising-permit equivalent is referenced but not separately specced. Add when first AD-side campaign goes live.
3. **Per-jurisdiction sanctions corridor specifics beyond UAE.** The corridor list in `.claude/skills/aml-kyc-uae-real-estate.md` covers the major surface but is not exhaustive. Extend per-engagement as needed.
4. **Future C-level orchestrators (CHRO, CPO, CFO-agent).** Reserved per your decision; not authored.
5. **Per-client `runbooks-overrides/` files.** Pattern documented in `ARCHITECTURE.md`; client-specific overrides authored as needed when worked-example engagements identify drift.
6. **Tax / FATCA / CRS reporting.** Out of marketing/sales/BD scope; route to tax counsel.

## Reviewer notes

- All commits sign with the standard `https://claude.ai/code/...` trailer per repo convention.
- All new agent files follow the §3 template (mission, in-scope, out-of-scope, inputs, outputs, SOP, tool rules, handoff matrix, KPIs, compliance guardrails, escalation triggers, example invocations).
- All new skills follow framework-only doctrine + `What this skill does NOT cover` section.
- All new runbooks follow `runbooks/README.md` template (trigger, owner, pre-flight, sequence with SLA, hand-offs, compliance gates, KPIs, close-out, related runbooks).
- All new integration files follow `schemas/integration-action.md` envelope shape.
- No existing agent prompt was rewritten beyond the bulk orchestrator → chief-commercial-officer rename + minimum-edit additive extensions on `compliance.md`, `account-manager.md`, `partnerships.md`.

If this REVIEW reads as the right shape of the work, the recommended next step is to validate the top-5 items above against a live-fire scenario (run one full campaign brief through the team end-to-end, with one VVIP-touching counterparty injected to test the discretion stance, and one PEP-flagged buyer injected to test the AML gate).
