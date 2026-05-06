# Runbook: Annual commercial plan

> Scenario: The developer's commercial leadership runs an annual planning cycle (typically Q4 → Q1) that produces: market scan, target-setting, channel-mix planning, marketing-budget allocation, board-approval gate. This runbook is that single-owner choreography.

## Trigger

Calendar — typically Q4 (October-December) of the year preceding plan year. Some clients run on a fiscal-year that's not calendar — adjust accordingly.

## Owner

`chief-commercial-officer` charters end-to-end. `marketing-manager` orchestrates the marketing-side analysis. `forecasting` produces commercial baselines. `marketing-financial-manager` produces budget framework. `analytics` produces channel-mix retrospective. `wealth-vvip-manager` produces channel-development outlook. `regulatory-research-specialist` produces regulatory-horizon update. CFO + CEO + Board are decision-makers at the gate.

## Pre-flight

- Trailing 12-month performance data current per `forecasting` rollup
- Channel-attribution data per `.claude/skills/marketing-attribution.md` framework
- Budget-actuals reconciled per `marketing-financial-manager` quarterly close
- Risk-register comprehensively reviewed per `runbooks/risk-register-update.md`
- Regulatory-horizon scan refreshed per `regulatory-research-specialist`
- Per-client `kpi-targets.md` accessible from prior year

## Sequence

### Phase 1: Inputs assembly (4-6 weeks before board-decision-gate)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 1 | `chief-commercial-officer` | Charter the planning cycle: confirm decision-gate date; confirm participants; confirm scope (which engagements / projects in flight) | Charter at `clients/<client>/annual-plans/<year>/charter.md` | T-42 |
| 2 | `forecasting` | Trailing 12-month commercial retrospective: actuals vs. last-year-plan, calibration, slip patterns | Commercial retrospective | T-35 |
| 3 | `analytics` (with `marketing-manager`) | Channel-mix retrospective: per-channel ROI, per-corridor performance, attribution-pattern shifts | Channel retrospective | T-35 |
| 4 | `marketing-financial-manager` | Budget retrospective + opening framework: budget envelope from CFO; cost-per-channel run-rates | Budget framework | T-35 |
| 5 | `wealth-vvip-manager` | Channel-development outlook: broker / wealth / VVIP relationships state; new-relationship pipeline | Channel-development outlook | T-35 |
| 6 | `regulatory-research-specialist` | Regulatory-horizon update: known + likely changes for plan year; impact on channel-mix, payment-plan structures, AML capacity | Regulatory-horizon memo | T-35 |
| 7 | `risk-register-curator` | Comprehensive risk review: open + closed-recent + watchlist; what new risks expected for plan year | Risk-register annual review | T-35 |
| 8 | `voc` (with `crm-manager`) | Customer + owner-community sentiment: themes, NPS trend, snagging patterns, recurring-complaint themes | VoC annual themes | T-35 |
| 9 | `competitive-intel` | Competitive landscape: known + projected competitive launches, pricing trends, channel-mix shifts in the market | Competitive landscape | T-35 |
| 10 | `inventory-manager` | Inventory outlook: launches in plan year, sustain-phase carryover, handover-window load | Inventory outlook | T-35 |

### Phase 2: Synthesis + targets (3-4 weeks before)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 11 | `marketing-manager` | First-pass plan synthesis: market context, channel-mix recommendation, marketing investment, target-volumes per project | Plan draft v1 | T-28 |
| 12 | `chief-commercial-officer` | Strategic-direction-setting: which corridors to prioritize, which channels to invest, which structural moves | Strategic-direction memo | T-21 |
| 13 | `marketing-financial-manager` | Budget allocation by channel + by project + by corridor | Budget allocation v1 | T-21 |
| 14 | `forecasting` | Target-setting: revenue + bookings + cash-collected per quarter; per-project | Target framework v1 | T-21 |
| 15 | `chief-commercial-officer` (decision-ask) | Approve plan-direction + targets v1 | Decision memo | T-14 |

### Phase 3: Board-prep + decision (2 weeks before)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 16 | `marketing-manager` (orchestrates) | Board-deck assembly per `runbooks/quarterly-exec-brief.md` 8-section template, expanded for annual | Board-deck draft | T-10 |
| 17 | `compliance` + `regulatory-research-specialist` | Forbidden-phrasing block + regulatory-citation currency check | Compliance verdict | T-7 |
| 18 | `data-quality-steward` | Data-quality audit on every numeric in the deck | Audit log | T-7 |
| 19 | `chief-commercial-officer` + executive presenter | Final review + revision cycle | Final deck | T-3 |
| 20 | Board / CEO / CFO + CCO | Decision-gate meeting: targets approved / modified / sent-back | Board decision | T-0 |
| 21 | `chief-commercial-officer` | Plan finalized + signed by CCO + CFO + CEO | Signed plan at `clients/<client>/annual-plans/<year>/plan-final.md` | T+0 to T+3 |

### Phase 4: Cascade + activation (4 weeks after decision-gate)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 22 | `chief-commercial-officer` | Cascade plan to pod managers; per-pod sub-plans developed | Pod-level plans | T+7 to T+14 |
| 23 | Pod managers | Per-pod sub-plans: marketing-manager (campaigns), sales-manager (RM-team + pipeline), crm-manager (lifecycle), wealth-vvip-manager (channel-development) | Per-pod plans | T+7 to T+14 |
| 24 | `marketing-financial-manager` | Budget activated per channel + per project; PO + accrual workflow set | Budget activation | T+7 to T+14 |
| 25 | `chief-commercial-officer` | Per-engagement `kpi-targets.md` finalized + signed for plan year | kpi-targets.md updated | T+14 |
| 26 | All commercial pods | Plan-year operational; quarterly review cadence per `runbooks/quarterly-exec-brief.md` begins | Operational | T+14 onward |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `chief-commercial-officer` → all input owners | Charter | Within 5 days; escalate if non-responsive |
| Each input owner → `marketing-manager` (synthesis) | Inputs ready | T-28 deadline; escalate to CCO if late |
| `marketing-manager` → `chief-commercial-officer` | Plan draft v1 | T-21 |
| `chief-commercial-officer` → CCO decision-ask | Plan v1 ready | T-14 |
| `chief-commercial-officer` → board | Final deck | T-0 |
| Board → CCO | Decision | T-0 |
| `chief-commercial-officer` → pod managers | Cascade | T+7 |
| `marketing-financial-manager` → finance system | Budget activation | T+14 |

## Compliance gates

1. **Forbidden phrasing** in board deck — `compliance` audit; per `.claude/skills/regulatory-disclosure-language.md` block list
2. **Forward-looking statement** framing on all projections per Template 7
3. **Regulatory-currency** on every regulatory citation per `regulatory-research-specialist`
4. **Numeric integrity** — every number in the plan cites a verified source per `data-quality-steward`
5. **VVIP discretion** — VVIP-touching activity aggregated; never named in plan
6. **Privilege** — legal-counsel-prepared content tagged + restricted-access in legal-privileged appendix
7. **PDPL + corridor data-protection** — per-corridor handling per current rules

## Out-of-scope

- Quarterly cadence reviews — `runbooks/quarterly-exec-brief.md`
- Monthly board prep — `runbooks/monthly-board-prep.md`
- Per-launch campaign planning — `verticals/real-estate/sub-verticals/developer/campaign-workflow.md`
- Strategic-bet evaluation (M&A, new-corridor, new-asset-class) — `runbooks/strategic-bet-evaluation.md`
- Per-project investment-committee approvals — separate process

## KPIs

- Charter-to-board-decision cycle compliance (target: per agreed timeline)
- Input-owner deadline compliance (target: 100%)
- Compliance audit pass on first attempt (target: ≥ 95%)
- Numeric-integrity audit pass on first attempt (target: ≥ 98%)
- Board decision turnaround (target: at the calendared gate)
- Cascade-to-operational latency (target: ≤ 14 business days from board decision)
- Plan-year forecast accuracy (target: actuals within ±10% of plan)

## Close-out + learning

- Plan archived at `clients/<client>/annual-plans/<year>/plan-final.md`
- Quarterly progress vs. plan tracked per `runbooks/quarterly-exec-brief.md`
- Plan-year closure: forecast-accuracy retrospective informs next-year framework
- Material learnings feed `verticals/real-estate/sub-verticals/developer/playbook.md` via `knowledge`

## Related runbooks

- `runbooks/quarterly-exec-brief.md` — quarterly cadence within the plan year
- `runbooks/monthly-board-prep.md` — monthly cadence within the plan year
- `runbooks/strategic-bet-evaluation.md` — material strategic-bet evaluations within the plan year
- `runbooks/cco-daily-brief.md` — surfaces plan-progress in daily brief
