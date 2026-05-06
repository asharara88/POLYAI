# Runbook: Complaint with RERA / ADREC exposure

> Scenario: A customer complaint has named, threatened, or filed at the RERA Rental Dispute Centre (Dubai), the ADREC equivalent (Abu Dhabi), or any UAE regulator with jurisdiction over the matter. The complaint is no longer a private resolution conversation; it has a regulatory dimension.

## Trigger

Any of:
- Customer explicitly threatens RERA / ADREC filing in writing or on a recorded call
- Regulator (RERA / ADREC / DLD / DMT) issues an inquiry to the developer
- Customer post on Bayut / Property Finder / social media references regulator filing intent
- Broker or wealth-channel intermediary forwards a buyer's regulator-filing intent

## Owner

`service-recovery-specialist` — runs the case end-to-end. Coordinates legal / regulatory / commercial / press dimensions. Reports daily to `crm-manager` and `chief-commercial-officer` until resolved.

## Pre-flight

- Original deal record located in `clients/<client>/sales/pipeline.md`
- Owner record in owner registry
- Original SPA + relevant addenda accessible
- All prior service-recovery cases on this customer pulled (pattern check)
- Compliance flags on client profile current
- `legal-liaison` (when added) availability confirmed; until then, named human Legal contact reachable
- `regulatory-research-specialist` available for current-process verification

## Sequence

| # | Who | What | Emits | Hand-off | SLA |
|---|---|---|---|---|---|
| 1 | `service-recovery-specialist` | Acknowledge complaint internally; open case file with regulator-exposure flag | Case file `clients/<client>/service-recovery/<case-id>/case.md` with `regulator-exposure: true` | self → step 2 | 1 business hour |
| 2 | `service-recovery-specialist` | Notify `legal-liaison` (or named Legal human) immediately; do not respond to customer until Legal aware | Legal-notification entry in case file | `legal-liaison` ack | 2 business hours |
| 3 | `service-recovery-specialist` | Acknowledge to customer (template-acknowledgment with no admission, no commitment beyond receipt) — only after Legal aware | Customer-acknowledgment artifact | self → step 4 | 4 business hours from intake |
| 4 | `service-recovery-specialist` | Triage: severity (impact × urgency × regulator-exposure level), category (snagging / payment / handover-delay / amenity / service-charge / other) | Triage entry in case file | self → step 5 | 1 business day |
| 5 | `service-recovery-specialist` | Root-cause investigation: pull all related operational records (snagging log, handover checklist, payment ledger, owner-association records) | Root-cause analysis in case file | self → step 6 | 2-3 business days |
| 6 | `regulatory-research-specialist` | Verify current RERA / ADREC dispute-process per the case's specific scenario (the rules differ for Rental Dispute Centre vs. Real Estate Dispute Resolution Centre vs. ADREC consumer-protection) | Process-verification memo | back to `service-recovery-specialist` | 2 business days |
| 7 | `service-recovery-specialist` + `legal-liaison` | Recovery-action design: financial (refund/credit), operational (defect-remedy), procedural (commitment to schedule), apology + closure | Recovery proposal in case file | `chief-commercial-officer` for above-threshold approval | 2-3 business days |
| 8 | `chief-commercial-officer` | Approve recovery action (or refer to executive committee for material exposure) | Approval recorded | back to `service-recovery-specialist` | 2 business days |
| 9 | `service-recovery-specialist` | Present recovery to customer; if accepted, document closure language; if not, the customer may file regardless | Customer-response artifact | self → step 10 OR step 11 | within case-by-case window |
| 10 (if accepted) | `service-recovery-specialist` | Execute recovery; close-loop with customer; update case file to closed | Closure note + customer confirmation | self → step 12 | per recovery action |
| 11 (if customer files) | `legal-liaison` + `service-recovery-specialist` | Manage the regulator process; provide responses + evidence per RERA / ADREC procedure | Filing-response packet | `legal-liaison` runs the regulator interface; `service-recovery-specialist` runs the customer interface | per regulator schedule |
| 12 | `service-recovery-specialist` | Pattern-match: is this the 2nd+ similar case in the quarter? If yes, route to `marketing-manager` (positioning) and / or `inventory-manager` (handover-quality) | Pattern alert | relevant pod | 5 business days post-closure |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `service-recovery-specialist` → `legal-liaison` | Regulator-exposure flag set | Escalate to `chief-commercial-officer` after 4h no-ack — Legal awareness is non-negotiable |
| `service-recovery-specialist` → `regulatory-research-specialist` | Current-process verification needed | Escalate to `chief-commercial-officer` after 24h |
| `service-recovery-specialist` → `chief-commercial-officer` | Recovery proposal ready | Default 2-day SLA; escalate to executive committee at 5 days |
| `service-recovery-specialist` → `content-pr-specialist` | Customer or matter surfaces in press / social | Immediate; reputation defense kicks in |
| `service-recovery-specialist` → `wealth-vvip-manager` | Customer is HNI/UHNI/VVIP-touching | Discretion stance applies; case file restricted-access |

## Compliance gates

1. **Legal awareness BEFORE customer acknowledgment.** No customer communication on a regulator-exposure case until `legal-liaison` is informed.
2. **No admission of liability.** Acknowledgment templates avoid admission; recovery offers are framed as "without prejudice / goodwill."
3. **VVIP discretion.** If customer is on the no-mention list, case file restricted to named team only.
4. **PDPL.** Customer PII in case file under retention rules; do not surface customer identity beyond the named team.
5. **No tipping-off** if AML/KYC adjacency surfaces (e.g., the complaint reveals a sanctions-issue with the buyer); switch to `pep-sanctions-hit.md` runbook silently.
6. **Forbidden-phrasing** in any customer-facing artifact remains in force per `.claude/skills/regulatory-disclosure-language.md`.

## Out-of-scope

- Underlying snagging / handover defect resolution — `inventory-manager` + operational owner (case file references but does not run that work)
- Regulator-relationship management at executive level — that's `chief-commercial-officer` + named human executive
- Press response operationalization — `content-pr-specialist` (case file references)
- Litigation strategy if matter goes to court — `legal-liaison` + external counsel; this runbook ends at regulator-resolution

## KPIs

- Acknowledgment time (target: ≤ 4 business hours)
- Legal-awareness time (target: ≤ 2 business hours from intake)
- Customer-confirmed closure rate (target: ≥ 80% pre-regulator filing)
- Regulator-filing rate (target: trending down — proxy for early-recovery effectiveness)
- Time-to-resolution by severity
- Recurrence-rate by category (target: trending down)
- Press-spike rate from regulator-exposure cases (target: 0)

## Close-out + learning

- Case file moves to `clients/<client>/service-recovery/closed/<year>/<case-id>/`
- Pattern alerts (3+ same-cause cases in a quarter) route to `marketing-manager` (positioning fix), `inventory-manager` (handover-quality fix), or relevant operational pod
- Material learnings routed via `knowledge` agent for `verticals/real-estate/sub-verticals/developer/playbook.md` update
- Quarterly regulator-exposure trend report to `chief-commercial-officer`

## Related runbooks

- Switch to `pep-sanctions-hit.md` if AML/KYC adjacency surfaces during root-cause
- Coordinate with `press-sensitive-uhnw-transaction.md` (P3) if customer / matter triggers press exposure
- Coordinate with `handover-snagging.md` (P3) if root-cause is in the snagging window
