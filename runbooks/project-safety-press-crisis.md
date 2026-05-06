# Runbook: Project-safety / press crisis

> Scenario: A material adverse event occurs at a developer property — a construction-site incident, an owner-fatality on premises, a building-system failure (fire, structural, MEP), a security incident, or any reputation-affecting event that surfaces in press or social media. **Crisis-comms posture is the immediate concern**; commercial-impact mitigation follows. Distinct from `runbooks/press-sensitive-uhnw-transaction.md` (which handles ongoing UHNW-transaction discretion); this is incident-driven.

## Trigger

Any of:
- On-site incident reported via operational channels (construction-site safety event, building-incident on a handed-over property)
- Owner-fatality or owner-medical-event on premises
- Building-system material failure
- Security incident (theft, assault, public-safety)
- Press inquiry referencing an incident
- Social-media spike referencing an incident
- Regulator-initiated investigation per `runbooks/regulator-inquiry-non-complaint.md` driven by the incident

## Owner

`chief-commercial-officer` charters end-to-end. `content-pr-specialist` runs press posture. `legal-liaison` handles legal layer (incident-specific liability, regulator coordination, witness-management). `service-recovery-specialist` runs owner-side (if incident affects a handed-over property). `inventory-manager` + project-delivery handle operational layer (site-securing, incident report, evidence preservation). `risk-register-curator` opens reputational-class risk. CEO + Chairman informed if material.

## Pre-flight

- Crisis-comms response template library accessible
- 24/7 emergency-contact list current (CEO, CCO, legal lead, security lead, operational lead, PR agency on retainer)
- Internal-communication channel for crisis-team coordination ready
- Insurance contact reachable
- Operational evidence-preservation protocol per regulator + insurance requirements

## Sequence

### Phase 1: Immediate response (first 4 hours)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 1 | `chief-commercial-officer` (charters) | Convene crisis team: CCO + content-pr-specialist + legal-liaison + Head of Operations + Head of Communications + CEO awareness | Crisis-team activation | within 1h of trigger |
| 2 | Operational lead (human) | Site-secure: ensure no further incident risk; first-responder coordination if applicable; evidence preservation per insurance + regulator protocol | Site-secure confirmation | per incident, immediate |
| 3 | `legal-liaison` | Liability-and-statement analysis: what can / cannot be said publicly without prejudice; insurance-mandated communication restrictions | Legal posture memo | within 2h |
| 4 | `content-pr-specialist` | Press-posture lock: no-comment default with empathy-and-cooperation framing; reactive-only language preset | Press-posture brief | within 2h |
| 5 | `risk-register-curator` | Open reputational-class red-status entry immediately | Risk-register update | within 1h |

### Phase 2: First 24 hours

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 6 | `chief-commercial-officer` (decision-ask) | Approve immediate posture: silent-cooperation / on-the-record empathy statement / regulator-mediated statement | Decision memo via `decision-router` | within 8h |
| 7 (if owner-affected) | `service-recovery-specialist` + `account-manager` | Affected-owner family contact via human relationship lead; condolence + practical-support per cultural register; never via press channel | Family-contact log | within 8h of family-identification |
| 8 | `legal-liaison` | Insurance notification per policy; incident-report submission to relevant authorities (police if applicable, RERA / ADREC / DMT if applicable) | Notification log | per insurance + regulator window |
| 9 | `content-pr-specialist` | Press inquiry triage: who's calling, what they're asking, what answers are pre-cleared | Inquiry triage log | continuous |
| 10 | `chief-commercial-officer` + CEO | Public-statement decision: silence / empathy-statement / coordinated-comms; if statement: drafted by `content-pr-specialist` + `legal-liaison`, signed off by CEO | Public statement (if any) | within 24h |
| 11 | Internal communication (CEO or CCO) | All-hands internal: facts known, what's underway, who to refer external inquiries to | Internal comms | within 24h |

### Phase 3: First 7 days

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 12 | Crisis team | Daily standup; status review; press-cycle monitoring; social-media monitoring | Daily standup notes | daily, 7 days |
| 13 | `service-recovery-specialist` | Owner-community communication if incident affects building / project: factual update, support resources, escalation contact | Community update | within 48-72h |
| 14 | `aml-kyc-compliance-specialist` (if any sanctions/PEP-touching counterparty involved) | Restricted-access review; coordinate with `runbooks/pep-sanctions-hit.md` if applicable | Restricted memo | per case complexity |
| 15 | `vvip-channel-enablement` (if any VVIP-counterparty implicated, even tangentially) | Restricted-access communication via principal protocol office; press posture tightened | Restricted communications | continuous |
| 16 | `legal-liaison` | Continuing regulator coordination per any opened investigation; per `runbooks/regulator-inquiry-non-complaint.md` if formal inquiry surfaces | Continuing legal log | continuous |
| 17 | `content-pr-specialist` | Press cycle: respond to inquiries, monitor coverage, calibrate posture as facts evolve | Press log | continuous |

### Phase 4: First 30 days + ongoing

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 18 | `service-recovery-specialist` + `account-manager` | Owner-community sentiment monitoring; dedicated escalation contact maintained; building-services adjustments as needed | Sentiment + adjustments log | continuous |
| 19 | `marketing-manager` | Marketing posture: pause / continue / adjust active campaigns; consult `compliance` for any sensitivity issues | Campaign-posture decision | within 7 days |
| 20 | `chief-commercial-officer` (decision-ask) | Long-term posture: when to resume normal communications cadence; what (if any) preventive-investment narrative emerges | Decision memo | within 30 days |
| 21 (closure) | `chief-commercial-officer` + crisis team | Confirm regulator-state; confirm legal-state; confirm sentiment; close case | Closure memo + lessons | per investigation state |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| Operational lead → CCO | Trigger detected | Within 1 hour; non-negotiable |
| `chief-commercial-officer` → CEO + executive committee | Material crisis | Within 2 hours; non-negotiable |
| `chief-commercial-officer` → `content-pr-specialist` + `legal-liaison` | Crisis-team activation | Within 1 hour |
| `service-recovery-specialist` → affected-owner family | Identification | Within 8 hours |
| `chief-commercial-officer` → `runbooks/regulator-inquiry-non-complaint.md` | Regulator opens inquiry | Switch to that runbook for regulator side |
| `vvip-channel-enablement` activation | VVIP-counterparty implication | Immediate; restricted-access |

## Compliance gates

1. **No-fault, no-admission language** in any external communication until `legal-liaison` confirms; insurance-mandated typically
2. **No buyer / counterparty identification** in any public communication; PDPL + cultural-respect baseline
3. **Cooperation-and-empathy framing** as default; never defensive, never minimizing
4. **VVIP discretion** — restricted-access; never name; press posture tightened if VVIP-counterparty even tangentially involved
5. **No-tipping-off** if AML-adjacency surfaces — restricted-channel
6. **Regulator-coordination first** if regulator-investigation opens; statements gated by regulator process
7. **Insurance-policy compliance** — communication restrictions per policy
8. **Press posture sign-off** — every public statement signed by CEO + `legal-liaison`
9. **Internal communication discipline** — facts only, no speculation, all-hands referral protocol clear
10. **Restricted-access** — case files restricted to crisis team only

## Out-of-scope

- Operational incident response (firefighting, medical, structural shoring) — operational team + emergency services
- Insurance-claim adjustment — insurance-counsel discipline
- Long-term reputation rebuild — `marketing-manager` + `content-pr-specialist` ongoing post-closure
- Litigation — `legal-liaison` + external counsel
- Industry-wide commentary — never

## KPIs

- Crisis-team activation latency (target: ≤ 1 hour from trigger)
- CCO + CEO awareness latency (target: ≤ 2 hours)
- First press-inquiry response latency (target: ≤ 30 minutes; no-comment is a response)
- Affected-owner family contact latency (target: ≤ 8 hours)
- Press-spike duration (track; pattern-detect)
- Regulator-investigation-opening rate (target: trended; not per-case actionable)
- Insurance-policy-compliance incidents (target: 0)
- Privilege-breach incidents (target: 0)
- VVIP-discretion incidents (target: 0 — non-negotiable)
- Misinformation-correction count post-event (track; pattern-detect)

## Close-out + learning

- Crisis case file at `clients/<client>/service-recovery/crisis/<case-id>/` (restricted-access)
- Closure memo captures: incident chronology, response cadence, lessons, prevention recommendations
- Crisis-team retrospective: what worked, what didn't, what process to update
- Material learnings feed `knowledge` for `runbooks/project-safety-press-crisis.md` updates
- If preventive-investment narrative warrants it, `marketing-manager` + `content-pr-specialist` plan a long-cycle posture
- Pattern alerts: 2+ material incidents in 24 months → systemic operational review

## Related runbooks

- `runbooks/regulator-inquiry-non-complaint.md` — when regulator opens inquiry
- `runbooks/complaint-rera-exposure.md` — when buyer-complaint dimension emerges
- `runbooks/pep-sanctions-hit.md` — if any sanctions-adjacency surfaces
- `runbooks/press-sensitive-uhnw-transaction.md` — VVIP-counterparty overlay
- `runbooks/risk-register-update.md` — risk-register state management
- `runbooks/handover-snagging.md` — if incident is in handover-window
