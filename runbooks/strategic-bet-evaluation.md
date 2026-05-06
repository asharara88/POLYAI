# Runbook: Strategic bet evaluation

> Scenario: A material strategic decision needs a structured evaluation — a new project launch, a new partnership (hospitality JV, education partner, asset-class JV), a new corridor expansion, an M&A opportunity, a structural channel investment, a major rebrand. The decision is large enough that ad-hoc analysis is insufficient; a structured evaluation reduces risk of post-decision regret and informs the right approval gate.

## Trigger

Any of:
- `chief-commercial-officer` initiates evaluation on an opportunity / commitment surface
- Inbound proposal from external party (JV partner, brand operator, educational institution, corridor introducer) requires structured assessment
- Strategic shift identified in `runbooks/annual-commercial-plan.md` cycle requires deeper evaluation before commit
- Competitive intelligence surfaces a development that warrants strategic response

## Owner

`chief-commercial-officer` charters end-to-end. `marketing-manager` orchestrates analysis. `deal-desk-analyst` runs commercial-structure analysis. `marketing-financial-manager` runs financial modeling. `regulatory-research-specialist` runs regulatory-overlay analysis. `legal-liaison` runs contractual + risk analysis. `partnerships` (if partnership-class) handles BD interface. `wealth-vvip-manager` (if channel-class) handles channel-implications. `data-room-curator` scaffolds the evaluation document surface.

## Pre-flight

- Charter document scoping the evaluation
- Decision-by date confirmed
- Counterparty (if external) materials collected
- Per-engagement strategic-context current
- `clients/<client>/strategic-bets/<bet-slug>/` folder structure prepared (restricted-access if material)

## Sequence

### Phase 1: Framing (1-2 weeks)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 1 | `chief-commercial-officer` | Charter the evaluation: scope, decision-by date, participants, expected output format | Charter at `clients/<client>/strategic-bets/<slug>/charter.md` | T-30 to T-21 |
| 2 | `marketing-manager` | Evaluation framework: what questions need answering, what evidence required, what alternatives in scope | Framework | T-28 |
| 3 | `data-room-curator` | Document surface scaffold; access policy; counterparty Q&A log if applicable | Data room | T-25 |

### Phase 2: Analysis (2-4 weeks)

Each strand runs in parallel; specialist agents produce per-strand memos.

#### Commercial-structure analysis
| Step | Who | What | Emits |
|---|---|---|---|
| 4a | `deal-desk-analyst` | Commercial-structure proposal: revenue model, margin shape, precedent comparison, sensitivity | Commercial memo |
| 5a | `marketing-financial-manager` | Financial modeling: P&L, cash-flow, IRR, sensitivity to corridor / channel / pricing assumptions | Financial model |

#### Regulatory + legal analysis
| Step | Who | What | Emits |
|---|---|---|---|
| 4b | `regulatory-research-specialist` | Regulatory overlay: applicable regimes, current rules, projected changes affecting decision | Regulatory memo |
| 5b | `legal-liaison` | Contract + dispute analysis: agreement terms, jurisdiction, exit provisions, IP, dispute mechanism, regulator consents required | Legal memo |

#### Market + competitive analysis
| Step | Who | What | Emits |
|---|---|---|---|
| 4c | `competitive-intel` | Competitive context: who else is doing this, positioning, scale, momentum | Competitive memo |
| 5c | `research` | Market sizing + dynamics: addressable market, growth, headwinds | Market memo |
| 6c | `voc` | Customer-side context if directly relevant: existing-owner sentiment, prior-engagement pattern | VoC themes |

#### Channel + relationship analysis
| Step | Who | What | Emits |
|---|---|---|---|
| 4d | `wealth-vvip-manager` | Channel-implications: broker / wealth / VVIP impact (positive or negative); conflicts to manage | Channel memo |
| 5d | `partnerships` (if partnership-class) | Partnership-specifics: fit / willingness / capacity / mutual incentive per partnership-qualification framework | Partnership memo |
| 6d | `vvip-channel-enablement` (if VVIP-touching) | VVIP-protocol implications; restricted-access overlay | Restricted memo |

#### Risk + compliance analysis
| Step | Who | What | Emits |
|---|---|---|---|
| 4e | `risk-register-curator` | Risk implications: new risks introduced, existing risks affected | Risk memo |
| 5e | `compliance` | Compliance posture: forbidden-phrasing in any externalization, claim review on any positioning | Compliance verdict |
| 6e | `aml-kyc-compliance-specialist` (if counterparty-touching) | AML/KYC framework: counterparty screening, corridor risk, structural-AML implications | AML memo |

### Phase 3: Synthesis + recommendation (1 week)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 7 | `marketing-manager` (orchestrates) | Cross-strand synthesis: integrated view; remaining open questions | Synthesis memo | T-7 |
| 8 | `chief-commercial-officer` | Recommendation: go / no-go / conditional / send-back-for-additional-info; with rationale + dependencies | Recommendation memo | T-3 |
| 9 | `chief-commercial-officer` (decision-ask) | Route per `approval_gates` — likely board + CFO + CEO for material strategic bets | Decision memo via `decision-router` | T-1 |

### Phase 4: Decision + activation

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 10 | Board / CEO / CFO + CCO | Decision-gate; outcome: approve / approve-with-conditions / decline / defer | Decision recorded | T-0 |
| 11 (if approve) | `chief-commercial-officer` | Activation plan: execution lead, timeline, milestones, decision-checkpoints | Activation plan | T+7 |
| 12 (if approve) | Relevant pods | Activation per execution lead's plan | Operational | T+7 onward |
| 13 (if approve-with-conditions) | `chief-commercial-officer` | Conditions monitoring; reporting cadence to board | Conditions tracker | T+7 onward |
| 14 (if decline / defer) | `chief-commercial-officer` | Counterparty communication (if external); learnings captured | Communication + learnings | T+3 |
| 15 (closure of evaluation) | `chief-commercial-officer` | Evaluation closure memo | Closure at `clients/<client>/strategic-bets/<slug>/closure.md` | T+7 |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `chief-commercial-officer` → strand owners | Charter | Within 5 days; escalate if non-responsive |
| Strand owners → `marketing-manager` | Strand memos due | T-7 deadline |
| `marketing-manager` → `chief-commercial-officer` | Synthesis ready | T-3 |
| `chief-commercial-officer` → board / CEO / CFO | Recommendation ready | T-1 |
| Board → CCO | Decision | T-0 |
| `chief-commercial-officer` → execution lead | Activation | T+7 |

## Compliance gates

1. **Forbidden phrasing** in any externalization
2. **Forward-looking framing** on projections
3. **Regulatory currency** per `regulatory-research-specialist`
4. **VVIP discretion** if VVIP-touching — restricted-access throughout
5. **Privilege** — legal memos restricted-access
6. **PDPL + corridor data-protection** if corridor-expansion
7. **Counterparty AML/KYC** if external party — `aml-kyc-compliance-specialist`-cleared before commitment
8. **Decision-memo discipline** per `schemas/decision-memo.md` — material bets always go through formal memo

## Out-of-scope

- Per-launch campaign planning — `verticals/real-estate/sub-verticals/developer/campaign-workflow.md`
- Annual plan-year setting — `runbooks/annual-commercial-plan.md`
- Quarterly review — `runbooks/quarterly-exec-brief.md`
- Operational decisions within an existing strategy — pod-managers
- Litigation if dispute on terms — `legal-liaison` + external counsel

## KPIs

- Charter-to-decision cycle compliance (target: per agreed timeline)
- Strand-owner deadline compliance (target: 100%)
- Decision quality post-hoc (proxy: 12-month outcome vs. memo's stated assumptions; target: outcome within memo-projected range)
- Compliance audit pass on first attempt (target: ≥ 95%)
- Strategic-bet hit rate (target: tracked over time; not per-bet actionable)

## Close-out + learning

- Evaluation case file at `clients/<client>/strategic-bets/<slug>/` (restricted-access if material)
- Closure memo captures: decision rationale, assumptions, monitoring plan
- Outcome retrospective at 12 months: did the bet land where the memo projected?
- Pattern alerts: if 3+ strategic bets miss projections in same direction, framework adjustment review
- Material learnings feed `runbooks/strategic-bet-evaluation.md` via `knowledge`

## Related runbooks

- `runbooks/annual-commercial-plan.md` — strategic bets often surface in annual cycle
- `runbooks/quarterly-exec-brief.md` — strategic bet status surfaces in quarterly cycle
- `runbooks/cco-daily-brief.md` — surfaces strategic-bet milestones in daily brief
- Any partnership-specific or corridor-specific runbook activated by approval
