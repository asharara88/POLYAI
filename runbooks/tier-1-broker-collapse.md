# Runbook: Tier-1 broker collapse

> Scenario: A Tier-1 broker firm experiences a material event that compromises their continuity — license revocation, principal departure, firm-level bankruptcy, regulatory investigation, or sudden corporate dissolution. Tier-1 firms typically account for 20-50% of allocation flow; a sudden gap is a material commercial event that requires same-week response.

## Trigger

Any of:
- RERA / ADREC license suspension or revocation surfaces
- Public announcement of firm dissolution / acquisition / restructuring with material continuity implication
- Material principal departure (named senior partner leaves) at a Tier-1 firm
- Sanctions adjacency surfaces at the firm (entity or UBO level) per `runbooks/pep-sanctions-hit.md`
- Risk-register "Tier-1 broker concentration" entry crosses amber → red

## Owner

`chief-commercial-officer` charters. `broker-enablement` owns relationship-side end-to-end. `legal-liaison` owns agreement-termination + license-status analysis. `data-quality-steward` owns in-flight-attribution audit. `marketing-financial-manager` owns commission-claw-back analysis if applicable. `aml-kyc-compliance-specialist` owns sanctions / UBO follow-up. `wealth-vvip-manager` informed for relationship-channel implications.

## Pre-flight

- Tier-1 firm registry entry current
- Master broker agreement on file
- All in-flight allocations attributed to the firm visible in pipeline
- All closed-won deals with first-touch attribution to firm visible (commission ledger)
- AML/KYC entity + UBO + roster screening recent (≤ 30 days)
- Tier-2 firm capacity visible for over-allocation feasibility

## Sequence

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 1 | `broker-enablement` | Confirm trigger event: pull license-status, public-announcement, internal intelligence; classify as collapse vs. stress | Trigger-confirmation note | 4 business hours |
| 2 | `risk-register-curator` | Open / elevate counterparty-risk entry to red; notify CCO immediately | Risk-register update | 1 business hour |
| 3 | `data-quality-steward` | Audit: all in-flight opportunities with firm-attribution; commission-attribution lock-in by stage | In-flight audit | 1 business day |
| 4 | `legal-liaison` | License-status analysis + master broker agreement review (continuity clauses, termination-without-cause provisions, claw-back triggers) | Legal memo | 1 business day |
| 5 | `aml-kyc-compliance-specialist` (if sanctions adjacency or UBO concern) | Re-screen entity + UBO + roster; coordinate with `runbooks/pep-sanctions-hit.md` if RED | Re-screening verdict | 2 business days |
| 6 | `marketing-financial-manager` | Commission claw-back analysis: any deals at risk-of-rescission per SPA cooling-off; commission-disbursement halt if applicable | Financial memo | 2 business days |
| 7 | `chief-commercial-officer` (decision-ask) | Approve immediate posture: suspend allocation flow / freeze commission disbursement / continue with elevated cadence / terminate agreement | Decision memo via `decision-router` | within 48h |
| 8 (if suspend / freeze) | `broker-enablement` | Communication to firm's named senior contact: discreet, factual, no commitments beyond "in review"; loop `legal-liaison` on language | Communication record | 1 business day post-decision |
| 9 | `broker-enablement` | Tier-2 over-allocation capacity briefing for the affected demand pool; per `.claude/skills/broker-operations.md` allocation mechanics | Tier-2 briefing pack | 3 business days |
| 10 | `account-manager` (if affecting closed-won pipeline) | Buyer-side relationship-continuity calls on deals where the firm's individual broker was the relationship lead | Activity log | Continuous from decision |
| 11 | `wealth-channel-enablement` | If Tier-1 firm overlapped with wealth-channel introductions: brief intermediary RMs on continuity; principal-touchpoint via gatekeeper if VVIP-adjacent | Wealth briefing | Same day as decision |
| 12 | `content-pr-specialist` | Press posture: no-comment default; reactive only if firm announces publicly and inquiries arrive | Press posture pack | Continuous |
| 13 | `vvip-channel-enablement` | If VVIP counterparties affected (introduced by firm), restricted-access communications via principal protocol office | Restricted-access communications | Same day as decision |
| 14 (recovery) | `broker-enablement` | New-firm-signing playbook activation per `verticals/real-estate/sub-verticals/developer/playbooks/broker-channel-new-firm-signing.md` if structural Tier-1 gap | Channel-development plan | 2-4 weeks recovery cycle |
| 15 (closure) | `chief-commercial-officer` | Confirm new equilibrium; risk-register update; lessons captured | Closure memo | per recovery state |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `broker-enablement` → `risk-register-curator` | Trigger confirmed | Within 1h |
| `broker-enablement` → `legal-liaison` | Confirmation | Within 4h |
| `broker-enablement` → `data-quality-steward` | Confirmation | Within 4h |
| `broker-enablement` → `aml-kyc-compliance-specialist` | Sanctions/UBO concern surface | Per `runbooks/pep-sanctions-hit.md` immediate |
| `chief-commercial-officer` → CCO decision-ask | Within 48h of trigger | Non-negotiable |
| Per channel manager → counterparty briefings | Same day as decision | Discretion respected |
| `broker-enablement` → `runbooks/broker-channel-new-firm-signing.md` | Recovery activation | When approved |

## Compliance gates

1. **License-status verification** before any communication that implies continuity assumption
2. **Master agreement clauses** consulted before decision (termination, continuity, claw-back)
3. **No-tipping-off** if AML adjacency surfaces — restricted-channel only
4. **VVIP discretion** — VVIP-touching counterparty implications restricted-access
5. **Press posture** — no-comment default; never characterize the firm publicly
6. **Commission claw-back** only when SPA cooling-off triggers; otherwise per master-agreement clause; never punitive without basis
7. **Buyer-side communication** must not characterize the firm; focus on continuity of buyer relationship

## Out-of-scope

- Firm's internal recovery — their problem
- Litigation if dispute escalates — `legal-liaison` + external counsel
- Industry-wide commentary — never; `content-pr-specialist` no-comment
- New broker-firm signing operational mechanics — separate playbook

## KPIs

- Trigger confirmation latency (target: ≤ 4 business hours)
- Risk-register elevation latency (target: ≤ 1 business hour from confirmation)
- CCO decision latency (target: ≤ 48 business hours from confirmation)
- In-flight allocation re-attribution completeness (target: 100%)
- Tier-2 over-allocation activation latency (target: ≤ 3 business days)
- Commercial impact (lost / re-attributed AED) tracked per closure
- Press-spike incidents (target: 0)
- Sanctions-adjacency lapse (target: 0 — non-negotiable)

## Close-out + learning

- Case file at `clients/<client>/brokers/<firm-slug>/collapse/case.md` (restricted if AML adjacency)
- Closure memo captures: financial impact, time-to-recovery, learnings
- Pattern alerts: if 2+ Tier-1 collapses in 18 months, structural concentration review with `chief-commercial-officer`
- Material learnings feed `.claude/skills/broker-operations.md` updates via `knowledge`

## Related runbooks

- `runbooks/risk-register-update.md` — counterparty-risk handling
- `runbooks/pep-sanctions-hit.md` — if AML adjacency surfaces
- `runbooks/complaint-rera-exposure.md` — if buyer complaints escalate
- `runbooks/press-sensitive-uhnw-transaction.md` — VVIP-counterparty-affected overlay
- `verticals/real-estate/sub-verticals/developer/playbooks/broker-channel-new-firm-signing.md` — recovery playbook
- `verticals/real-estate/sub-verticals/developer/playbooks/broker-channel-reactivation.md` — Tier-1-fill alternative path
