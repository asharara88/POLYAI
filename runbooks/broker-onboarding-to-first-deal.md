# Runbook: Broker firm onboarding → first allocation approved

> Scenario: A new brokerage firm is being signed by `broker-enablement` (channel development outcome — either reactivation of a dormant firm or signing of a new firm not previously on the developer's roster). The runbook covers the transition from "agreement signed" to "first allocation approved" — typically the first 60-90 days. The success criterion is not just signing — it's first deal closed, because firms that don't transact in their first 90 days disengage.

## Trigger

Either:
- New brokerage firm signs the master broker agreement
- Dormant firm reactivates and re-signs

## Owner

`broker-enablement` charters and owns end-to-end. Coordinates with `aml-kyc-compliance-specialist` (entity-level + UBO + roster screening), `legal-liaison` (template currency), `inventory-manager` (allocation availability), `marketing-financial-manager` (commission disbursement readiness), `data-quality-steward` (registry update).

## Pre-flight

- Master broker agreement template current per `.claude/skills/broker-operations.md`
- Commission-grid letter template ready (tier proposed by `broker-enablement` based on firm's strategic value + expected volume)
- Firm's RERA brokerage license (Dubai) or ADREC equivalent (Abu Dhabi) verified active per `.claude/skills/broker-operations.md` verification framework
- Firm's trade license (DED or equivalent) verified
- AML/KYC capacity for entity-level + UBO + initial roster screening — `aml-kyc-compliance-specialist` available
- Inventory baseline current — what's actually allocatable to a Tier 2/3 (typical entry tier) firm in the next 60-90 days

## Sequence

| Phase | Day | Who | What | Emits |
|---|---|---|---|---|
| **Onboarding** | Day 0 | `broker-enablement` | Open onboarding case file at `clients/<client>/brokers/<firm-slug>/onboarding/case.md` | Case file open |
| | Day 0-3 | `broker-enablement` | Collect firm documentation per `.claude/skills/broker-operations.md` onboarding-documentation list | Document index in case file |
| | Day 0-3 | `aml-kyc-compliance-specialist` | Entity-level Sumsub run-check; UBO ≥ 25% identification + screening; initial-roster screening (named individual brokers) | Verdicts per individual + entity |
| | Day 3-5 | `legal-liaison` | Master broker agreement + commission-grid letter signed by both sides | Signed agreement artifacts |
| | Day 5 | `broker-enablement` | Add firm to `clients/<client>/brokers/registry.md` — status: `active` | Registry update via `data-quality-steward` |
| | Day 5 | `marketing-financial-manager` | Set up commission-disbursement profile (bank account verified via separate channel for fraud prevention) | Disbursement profile recorded |
| **Enablement** | Day 7-14 | `broker-enablement` + `creative` | Tailored enablement pack delivered: project portfolio, factsheets, payment-plan calculators, current-permit reference (Trakheesi-aware), commission-grid letter, escalation contacts | Enablement pack at `clients/<client>/brokers/<firm-slug>/enablement-pack-v1/` |
| | Day 7-14 | `broker-enablement` | First-touch training session (1-2h) — webinar or in-person at sales gallery; covers product, process, allocation mechanics, dispute escalation, compliance | Session log + attendee list |
| | Day 7-14 | `compliance` | Confirm firm understands forbidden-phrasing list per `.claude/skills/regulatory-disclosure-language.md` and Trakheesi requirements per `integrations/trakheesi/spec.md` | Compliance briefing log |
| | Day 14 | `broker-enablement` | Sales-gallery walkthrough scheduled for firm's named senior brokers — see units, see show-units, meet developer-side senior RM | Walkthrough confirmed |
| **Activation** | Day 14-30 | `broker-enablement` | Firm's first allocation request invited (proactive, not reactive — call the firm, ask what they're working on, what their pipeline looks like) | Allocation request submitted |
| | Day 14-30 | `inventory-manager` + `broker-enablement` | First allocation approved (or counter-proposed if requested unit is not Tier-2/3 appropriate) | Allocation approval per `clients/<client>/brokers/allocations/<request-id>/` |
| | Day 14-30 | `account-executive` | Allocation reservation activates buyer-side workflow — buyer's AML/KYC pre-clearance per standard intake | Buyer-side intake initiated |
| **First close** | Day 30-90 | `account-executive` + `broker-enablement` | First deal progresses through stages → `closed-won` per `integrations/salesforce/actions/stage-advance.md` | Stage advances |
| | Day 30-90 | `data-quality-steward` | Attribution-tagging confirmed at every stage — first-touch broker confirmed; broker-attribution accurate | Attribution audit per deal |
| | At close | `marketing-financial-manager` | First commission accrued + scheduled per disbursement profile | Commission accrual entry |
| | Day 90 | `broker-enablement` | First-90-day review with firm's named senior contact — feedback on enablement, communication, allocation experience; identify what needs to improve for activation-velocity | Review note |
| **Post-activation** | Quarterly | `broker-enablement` | Firm enters standard performance-tracking — volume, conversion, dispute-rate, customer-experience scores — with tier-progression eligibility on track-record | Performance scorecard |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `broker-enablement` → `aml-kyc-compliance-specialist` (entity + UBO + roster) | Documentation collected | Within 5 days; escalate to `wealth-vvip-manager` if blocked |
| `broker-enablement` → `legal-liaison` (agreement) | KYC cleared | Within 5 days; escalate to `chief-commercial-officer` if blocked |
| `broker-enablement` → `data-quality-steward` (registry update) | Agreement signed | Within 24h |
| `broker-enablement` → `marketing-financial-manager` (disbursement profile) | Agreement signed | Within 5 days |
| `broker-enablement` → firm (first allocation invitation) | Day 14 enablement complete | Within 7 days; if no firm pipeline, schedule check-in for Day 30 |
| `broker-enablement` → firm (Day 90 review) | 90 days post-onboarding | Non-negotiable; activation-velocity is the leading metric |

## Compliance gates

1. **AML/KYC must clear at entity + UBO + initial-roster level before agreement signing.** No agreement is signed pending screening.
2. **License-currency verified** — RERA / ADREC license active at agreement signing; re-verification cadence set (typically annual + on event).
3. **Forbidden-phrasing briefing** before any firm-distributed material is allowed in market.
4. **Trakheesi awareness** — firm understands no Dubai-side ad runs without permit number displayed; reference current campaigns' permit numbers in their material.
5. **Sanctions / PEP-firm** — if any UBO or principal screens as PEP or sanctions-adjacent, switch to `runbooks/pep-sanctions-hit.md`; firm onboarding pauses pending Legal + EDD.
6. **No-tipping-off** if AML adversely surfaces — communicate as standard onboarding pause language, not as flag.

## Out-of-scope

- Buyer-side experience after allocation → reservation → closing (that's `account-executive` standard)
- Long-term broker performance tracking (post-90-day) — that's `broker-enablement` standard
- Firm's broker-side marketing campaigns (firm-internal; we provide the materials)
- Tier-promotion to Tier 1 (separate process based on track-record + strategic-value)

## KPIs

- Onboarding completion time (target: ≤ 14 days from agreement-signed to enablement-complete)
- Activation rate (% of new firms with first allocation request within 30 days; target: ≥ 70%)
- First-deal-close rate (% of new firms with first closed-won within 90 days; target: ≥ 50%)
- 90-day-review attendance rate (target: 100% — non-negotiable for relationship maintenance)
- Per-firm pipeline within 90 days (volume + value)
- Disengagement rate (firms inactive within 90 days; target: ≤ 15% — feeds reactivation playbook)

## Close-out + learning

- Onboarding case file moves to `clients/<client>/brokers/<firm-slug>/onboarding/closed.md` after Day 90 review
- Per-firm performance enters quarterly tracking
- Patterns: corridors / firm-types with low activation rates routed to `broker-enablement` for channel-development strategy adjustment
- Material learnings (e.g., enablement-pack section that consistently underdelivers) routed via `knowledge` for `.claude/skills/broker-operations.md` update

## Related runbooks

- Switch to `pep-sanctions-hit.md` if AML/KYC returns RED on any UBO or principal
- Coordinate with `inbound-hnw-private-bank.md` if firm proves to be a high-quality intro source for HNW (in which case wealth-channel-enablement may layer on)
