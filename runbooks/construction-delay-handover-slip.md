# Runbook: Construction delay / handover slip

> Scenario: A material construction delay or projected handover-slip surfaces — typically driven by supply-chain pressure, MEP procurement timeline, contractor capacity, regulatory inspection blockers, or force majeure. Buyer-notification obligations under Dubai Law 8/2007 (Dubai) or Abu Dhabi Law No. 3 of 2015 (Abu Dhabi) may apply. Mishandled, the delay becomes a buyer-trust crisis + regulator escalation; handled well, it's a manageable commercial-impact and relationship event.

## Trigger

Any of:
- Project-delivery team flags a material delay risk to scheduled milestones
- Construction-progress milestone slips by ≥ 3 weeks
- Material-disclosure obligation under applicable real-estate law fires
- Risk-register entry crosses amber → red on a delay-class risk
- Buyer or broker inquiry references handover-date concern publicly

## Owner

`chief-commercial-officer` charters end-to-end. `inventory-manager` owns inventory-side communications and unit-readiness coordination. `account-manager` owns owner-community communications. `legal-liaison` owns the buyer-notification obligation analysis. `marketing-financial-manager` owns commercial-impact modeling. `service-recovery-specialist` owns owner-complaint surface. `content-pr-specialist` owns press posture if exposure surfaces.

## Pre-flight

- Construction-progress data current per third-party verification
- SPA + applicable real-estate law (Dubai Law 8/2007 or Abu Dhabi Law No. 3/2015) accessible
- Trustee Bank coordination contact reachable
- Owner registry current (`clients/<client>/owner-community/registry.md`)
- Risk register entry already opened by `risk-register-curator`
- Insurance policy + warranty pack referenced

## Sequence

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 1 | `inventory-manager` + project-delivery (human) | Confirm material delay; quantify weeks of slip; identify root cause | Internal delay assessment | 1 business day |
| 2 | `marketing-financial-manager` | Model commercial impact: revenue-recognition deferral, escrow-coverage adequacy, cash-flow shape; coordinate with Trustee Bank if escrow-impact material | Commercial impact memo | 2 business days |
| 3 | `legal-liaison` | Buyer-notification obligation analysis: does the slip trigger material-disclosure under applicable law? if yes, what is the required notification window + content? | Legal-liaison memo | 2 business days |
| 4 | `risk-register-curator` | Update risk-register entry to red status; notify CCO immediately per `runbooks/risk-register-update.md` | risk-register update | 1 business hour from CCO awareness |
| 5 | `chief-commercial-officer` | Convenes executive review: project-delivery + CMO + CFO + CEO + legal-liaison + Head of Sales | Executive review minutes | 3 business days from delay confirmation |
| 6 | `chief-commercial-officer` (decision-ask) | Approve buyer-notification approach + recovery posture | Decision memo via `decision-router` | per CCO calendar |
| 7 (if buyer-notification required) | `legal-liaison` + `account-manager` + `email-lifecycle` | Drafted owner-notification per legal-required template + voice; cross-loop `compliance` for Template 7 forward-looking-statement framing per `.claude/skills/regulatory-disclosure-language.md` | Owner-notification artifact | 2-5 business days post-decision |
| 8 | `chief-commercial-officer` + `content-pr-specialist` | Press posture: no-comment default; if regulator-mediated public statement required, prepared per template | Press posture pack | Within decision window |
| 9 | `account-manager` | Owner-comms cadence elevated for affected cohort (weekly construction-progress update, dedicated escalation contact) | Communication plan | Continuous from notification |
| 10 | `service-recovery-specialist` | Triage incoming owner-complaints; cluster patterns; escalate per `runbooks/complaint-rera-exposure.md` if regulator-exposure surfaces | Service-recovery cases | Continuous |
| 11 | `broker-enablement` | Broker-channel briefing: what brokers can say, can't say, must escalate | Broker-channel pack | Same day as owner-notification |
| 12 | `wealth-channel-enablement` | Wealth-channel intermediary briefing: discreet update with talking points; intermediary RM communicates to principal | Briefing pack | Same day as owner-notification |
| 13 | `vvip-channel-enablement` | VVIP-touching communications: restricted-channel; principal protocol office briefed via gatekeeper per `.claude/skills/vvip-protocol-uae.md` | Restricted-access pack | Same day as owner-notification |
| 14 (recovery) | `chief-commercial-officer` + project-delivery | Recovery actions: alternate-supplier qualification, schedule-acceleration measures, contractor over-resourcing, regulator coordination on inspection windows | Recovery plan | 2-week milestone reviews |
| 15 (closure) | `chief-commercial-officer` | Confirm new timeline; communicate revised handover schedule; update risk-register | Closure memo | per project state |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `inventory-manager` → `risk-register-curator` | Material delay confirmed | Within 4h; escalate to CCO if no ack |
| `inventory-manager` → `marketing-financial-manager` | Delay confirmed | Within 1 business day |
| `inventory-manager` → `legal-liaison` | Delay confirmed | Within 1 business day |
| `chief-commercial-officer` → executive review | Within 3 business days of confirmation | Non-negotiable; escalate to CEO if blocked |
| `legal-liaison` → `chief-commercial-officer` (decision-ask) | Buyer-notification obligation analysis ready | Within 2 business days; per `decision-router` SLA |
| Per channel manager → counterparty briefings | Same day as owner-notification | Counterparty discretion respected |
| `service-recovery-specialist` → `runbooks/complaint-rera-exposure.md` | Owner-complaint with regulator-exposure flag | Immediate switch to that runbook |

## Compliance gates

1. **Material-disclosure analysis is mandatory.** Don't assume the slip doesn't trigger notification obligation; `legal-liaison` analyzes per applicable law.
2. **Forward-looking statement framing** on every revised-timeline communication per `.claude/skills/regulatory-disclosure-language.md` Template 7.
3. **Forbidden phrasing** — no "guaranteed completion" or implied certainty in revised-timeline language.
4. **VVIP discretion** — VVIP-occupied units' affected-status restricted-access; communications via gatekeeper.
5. **PDPL** — owner contact data per retention rules.
6. **Trustee Bank coordination** — if escrow-coverage adequacy is challenged, regulatory-mediated review.
7. **Press exposure** — `content-pr-specialist` posture is no-comment unless regulator mandates statement.

## Out-of-scope

- Construction operational recovery — project-delivery + contractor; runbook tracks but doesn't run
- Vendor / contractor commercial dispute — separate dispute-resolution path per `.claude/skills/dispute-resolution-uae.md`
- Insurance claim if applicable — insurance counsel
- Long-term schedule recovery beyond next-milestone — separate strategic planning

## KPIs

- Material-delay confirmation latency (target: ≤ 1 business day from project-delivery flag)
- Commercial-impact memo turnaround (target: ≤ 2 business days)
- Buyer-notification turnaround if required (target: per legal SLA, typically ≤ 14 business days from material-disclosure trigger)
- Owner-complaint volume post-notification (track; pattern-detect via `service-recovery-specialist`)
- Regulator-escalation conversion rate (target: ≤ 1% of affected owners)
- Press-spike incidents (target: 0)

## Close-out + learning

- Case file at `clients/<client>/service-recovery/cases/construction-delay-<period>/` with all artifacts
- Closure memo from CCO captures lessons + revised process
- Pattern alerts (3+ delay-class events in 18 months) → systemic-review with project-delivery + procurement
- Material learnings (e.g., supplier-tier diversification need) feed `knowledge` for `verticals/real-estate/sub-verticals/developer/playbook.md` updates

## Related runbooks

- `runbooks/risk-register-update.md` — risk-register state management
- `runbooks/complaint-rera-exposure.md` — when owner-complaint escalates
- `runbooks/handover-snagging.md` — when slip cascades into snagging-window
- `runbooks/press-sensitive-uhnw-transaction.md` — VVIP-touching communications overlay
- `runbooks/cco-daily-brief.md` — surfaces in daily brief throughout
