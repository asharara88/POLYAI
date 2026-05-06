# Runbook: Key RM / pod-manager departure

> Scenario: A Tier-1 Relationship Manager, a pod-manager, or another key human commercial team member departs (resignation, termination, gardening leave, sudden departure). The risk is twofold: (a) in-flight pipeline continuity, and (b) counterparty-relationship continuity (especially in wealth + VVIP channels where the relationship is principal-personal). Mishandled, the developer loses material pipeline + relationships; handled well, transitions are minimally disruptive.

## Trigger

Any of:
- Resignation notice received
- Termination decision made (per HR process)
- Gardening leave / non-compete activation
- Sudden departure (medical, personal emergency, abrupt resignation)
- Material reassignment (departure from current portfolio without leaving the firm)

## Owner

`chief-commercial-officer` charters end-to-end. The departing person's pod manager (`sales-manager` / `marketing-manager` / `crm-manager` / `wealth-vvip-manager`) owns operational hand-off. `data-quality-steward` audits in-flight attribution + access. `aml-kyc-compliance-specialist` checks AML/KYC currency on the in-flight Accounts. `vvip-channel-enablement` handles VVIP-touching reassignment. HR (human) handles the employment-side process — not in-scope for this runbook beyond coordination.

## Pre-flight

- Departing person's portfolio mapped (active + cultivating + dormant counterparties; in-flight opportunities)
- Pipeline data current (`data-quality-steward` daily scan)
- AML/KYC currency on in-flight Accounts assessed
- Per-RM tier-1 counterparty relationships visible (wealth-channel intermediaries; VVIP gatekeeper map; family-office principals)
- Reassignment capacity visible across remaining team
- Confidentiality posture: discretion is the contract; departure not communicated to counterparties before agreed timing

## Sequence

### Phase 1: Confirmation + planning (first 24 hours)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 1 | Pod manager + HR | Confirm departure; classify (notice-period / immediate / gardening-leave); confirm last-day | Departure confirmation | within 4h of notice |
| 2 | `chief-commercial-officer` | Awareness brief; confirms restricted-access stance: who knows internally, when communicated to counterparties | CCO awareness note | within 8h |
| 3 | `data-quality-steward` | Audit: all opportunities where departing person is owner / collaborator; all activities; all attribution | Portfolio audit | within 1 business day |
| 4 | Pod manager | Reassignment plan: which counterparties to which RM, in what sequence, with what handover format | Reassignment plan | within 2 business days |
| 5 | `aml-kyc-compliance-specialist` | AML/KYC currency check on in-flight Accounts in the portfolio: any verdicts > 30 days at proposal-stage requiring re-screen | Currency report | within 2 business days |
| 6 | `risk-register-curator` | Open / update operational-class entry "Key-RM departure"; severity per portfolio scale | Risk-register update | within 1 business day |
| 7 | `chief-commercial-officer` (decision-ask) | Approve reassignment plan + counterparty-communication timing | Decision memo via `decision-router` | within 3 business days |

### Phase 2: Hand-off (next 5-15 business days, depending on notice period)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 8 | Departing person + receiving RMs | Per-counterparty handover sessions: relationship history, current state, open threads, cultural notes, family composition (where appropriate), gift-history, communication preferences | Per-counterparty handover doc | iterative through notice period |
| 9 | `data-quality-steward` | CRM data hygiene: attribution updates, ownership changes, activity-log completeness | CRM updates | continuous |
| 10 (wealth-channel) | `wealth-channel-enablement` | Wealth-channel intermediary relationships: principal-direct vs. intermediary-mediated handover plan; some require principal awareness, some intermediary-only | Plan | iterative |
| 11 (VVIP) | `vvip-channel-enablement` | VVIP-counterparty handover: restricted-access; protocol office briefing via gatekeeper if any reassignment relevant; restricted to named team | Restricted-access handover | per VVIP-counterparty pace |
| 12 (broker) | `broker-enablement` | Broker-firm relationship continuity: per-firm communication; some firms have personal-trust elements with the departing RM | Per-firm communication | iterative |
| 13 (concierge — VIP-relationship-manager portfolio) | `vip-relationship-manager` (if departing person had concierge-relationships) | Profile-detail capture; in-flight requests rerouted; cultural preferences locked in | Concierge handover docs | iterative |

### Phase 3: Counterparty communication

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 14 | Pod manager + CCO | Communication template per channel: brokers, wealth, VVIP, family offices, individual buyers in-pipeline. Tone: continuity-first, departing-person-respected, new-RM-introduced | Per-channel templates | within 5 business days of departure |
| 15 | Receiving RM + departing RM (joint where possible) | Counterparty introduction: warm hand-off, joint call where relationship-warm; otherwise written introduction with signed-departing-RM endorsement | Per-counterparty introduction | iterative |
| 16 | `legal-liaison` (if non-compete or specific clause activates) | Coordinate non-compete monitoring; restricted-information protocol | Compliance log | per legal terms |

### Phase 4: Post-departure (first 90 days)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 17 | Receiving RMs | Elevated cadence with reassigned counterparties first 30 days; weekly check-ins with high-relationship-warmth principals; reassurance | Activity log | continuous |
| 18 | `forecasting` | Track pipeline-conversion rates on reassigned portfolio; any material deterioration vs. baseline = early-warning signal | Pipeline trend | weekly |
| 19 | `voc` | Post-departure sentiment: did counterparties experience the transition well? feedback themes | VoC entries | continuous, surfaced at 30 + 60 + 90 days |
| 20 | `wealth-channel-enablement` (intermediary-touchpoint review) | Intermediary RMs interviewed at 30 + 60 days re: principal sentiment | Intermediary feedback | per cadence |
| 21 (closure) | Pod manager + CCO | Confirm transition stable; close runbook; lessons captured | Closure memo | at 90 days |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| Pod manager → CCO | Departure confirmed | Within 8h; non-negotiable |
| Pod manager → `data-quality-steward` | Confirmation | Within 1 business day |
| Pod manager → `aml-kyc-compliance-specialist` | Confirmation | Within 1 business day |
| `chief-commercial-officer` → decision-ask (reassignment plan) | Plan ready | Within 3 business days |
| Pod manager → receiving RMs | Reassignment approved | Per agreed sequence |
| Departing RM → counterparties | Per agreed timing | Discretion respected; no premature signaling |
| `wealth-channel-enablement` → wealth intermediaries | VVIP/HNI principals affected | Restricted-channel respected |
| `vvip-channel-enablement` → protocol offices | VVIP-touching | Restricted-channel; never general-team awareness |

## Compliance gates

1. **Discretion until agreed timing** — never communicate departure to counterparties before plan-approved
2. **Confidentiality of departing person** — terms of departure not discussed beyond named team
3. **PDPL** — counterparty data access revoked per HR process; CRM access removed last-day; restricted folder access removed last-day
4. **Non-compete monitoring** if applicable — `legal-liaison` per legal terms
5. **AML/KYC currency** — re-screen in-flight Accounts where verdict > 30 days at proposal-stage
6. **VVIP discretion** — VVIP-counterparty handover restricted to named team; gatekeeper-mediated communication
7. **Reciprocity-ledger transition** — outstanding favors / debts updated per `clients/<client>/reciprocity-ledger.md`
8. **Press posture** — no-comment if departure becomes press-relevant (rare); never characterize the person publicly

## Out-of-scope

- HR / employment process — separate discipline
- Compensation negotiation — HR + Finance
- Litigation if dispute escalates (non-compete breach, claimed-account theft) — `legal-liaison` + external counsel
- Cultural-fit interviews with replacement candidate — HR
- Re-onboarding the replacement RM — separate playbook (per pod-manager standard onboarding)

## KPIs

- Departure-to-CCO-awareness latency (target: ≤ 8h from notice)
- Portfolio audit completeness (target: 100% within 1 business day)
- Reassignment plan turnaround (target: ≤ 2 business days)
- AML/KYC re-screen completion (target: 100% pre-relevant-stage-progression for in-flight Accounts)
- Counterparty-introduction completion (target: 100% within first 30 days post-departure)
- 30-day post-departure pipeline-conversion vs. baseline (target: ≥ 90% — degradation > 10% triggers retention review)
- Counterparty-departure rate post-RM-departure (target: ≤ 5% of portfolio churns within 90 days)
- VoC sentiment at 30 / 60 / 90 days (target: positive-net trend)
- Discretion incidents (target: 0)
- Non-compete-breach incidents (target: 0)

## Close-out + learning

- Case file at `clients/<client>/hr-coordination/key-rm-departures/<period>/` (HR-coordinated)
- Closure memo captures: portfolio-impact, retention rate, learnings, process-adjustments
- Pattern alerts: 2+ Tier-1 RM departures in 12 months → retention-strategy review with `chief-commercial-officer`
- Material learnings feed `verticals/real-estate/sub-verticals/developer/playbook.md` via `knowledge`
- If departure surfaces a structural issue (compensation gap, role-design issue), HR + CCO planning cycle

## Related runbooks

- `runbooks/risk-register-update.md` — risk-register state management
- `runbooks/cco-daily-brief.md` — surfaces transition state in daily brief during transition
- `runbooks/quarterly-exec-brief.md` — aggregated trend if pattern emerges
- `runbooks/inbound-hnw-private-bank.md` — in-flight HNW pipeline coordination
- `verticals/real-estate/sub-verticals/developer/playbooks/wealth-channel-reactivation.md` — if intermediary relationships need refreshing post-departure
