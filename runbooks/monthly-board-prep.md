# Runbook: Monthly board prep

> Scenario: Monthly cadence between full quarterly exec briefs. The board / CEO / CFO need a lighter-touch read on commercial state, material events, and decision-asks. Distinct from `runbooks/quarterly-exec-brief.md` (which is the deeper quarterly cycle) and from `runbooks/cco-daily-brief.md` (which is the daily 90-second read).

## Trigger

Calendar — typically the first Wednesday of each month (per the worked example's `clients/_examples/uae-developments/cco/calendar.md`). Cadence may differ per engagement.

## Owner

`chief-commercial-officer` charters and presents. `marketing-manager` orchestrates assembly. The four pod managers each contribute their pod's monthly summary. `forecasting` produces the commercial summary. `marketing-financial-manager` produces the financial summary. `risk-register-curator` produces the risks summary.

## Pre-flight

- Month-end commercial data current (closed-won, pipeline, conversion)
- Marketing-budget month-close per `marketing-financial-manager`
- Risk-register monthly review complete
- Material events of the month catalogued
- Decision-asks for the board surfaced via `decision-router`

## Sequence

| Day | Who | What | Emits | SLA |
|---|---|---|---|---|
| Day -7 (Wed prior to board) | `chief-commercial-officer` | Charter: confirm format, decision-asks, focus areas | Charter | T-7 |
| Day -7 to -5 | Pod managers | Pod-level monthly summaries | Per-pod summaries | T-5 |
| Day -5 | `forecasting` | Commercial summary: month-actuals vs. plan, pipeline shape, calibration | Commercial summary | T-5 |
| Day -5 | `marketing-financial-manager` | Financial summary: spend vs. plan, variance, accruals | Financial summary | T-5 |
| Day -5 | `risk-register-curator` | Risks summary: open + closed-this-month + new + watchlist | Risks summary | T-5 |
| Day -3 | `marketing-manager` | Brief assembly per template (below) | Brief draft | T-3 |
| Day -2 | `compliance` + `data-quality-steward` | Compliance + data-quality audit | Audit verdicts | T-2 |
| Day -1 | `chief-commercial-officer` | Final review + revision | Final brief | T-1 |
| Day 0 (board prep meeting) | `chief-commercial-officer` | Present brief; capture decisions + action items | Decision log | T-0 |
| Day +3 | `chief-commercial-officer` | Decisions cascaded to relevant pods | Action items routed | T+3 |

## Brief sections (template — lighter than quarterly)

### 1. Executive summary (1 page)
Owner: `chief-commercial-officer`.
- 3-5 takeaways from the month
- Decision-asks for the board (typically 1-3)
- Any material risks crossing thresholds since last month

### 2. Commercial — owned by `forecasting` + `marketing-financial-manager`
- Month actuals vs. plan: bookings, revenue-recognized, cash-collected
- Pipeline shape (period-end snapshot)
- Channel-mix this month vs. last month vs. plan
- Forecast for next 1-2 months
- Calibration commentary

### 3. Marketing performance — owned by `marketing-manager` + `analytics`
- Active campaign performance (per-campaign in market)
- Channel ROI delta vs. last month
- Marketing-budget burn this month vs. plan

### 4. Channel + customer — owned by `wealth-vvip-manager` + `crm-manager`
- Channel-development this month: new firms / intermediaries; tier movements; reactivations
- Owner-community + service-recovery summary: complaint count, NPS movement, snagging-resolution rate
- VoC themes emerging this month

### 5. Compliance + risk — owned by `aml-kyc-compliance-specialist` + `risk-register-curator` + `legal-liaison`
- AML/KYC throughput this month
- Risk-register: red + amber count; closed this month
- Open regulator interactions
- Any new material legal matters (anonymized)

### 6. Decision-asks for the board
Per `schemas/decision-memo.md`. Typically 1-3 per month.

### 7. Look-ahead next month
Per pod-manager input.

### 8. Appendix
Sources cited; calculation methodology where novel.

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| Pod managers → `marketing-manager` | Monthly summaries due T-5 | Escalate to CCO if missed |
| `marketing-manager` → `compliance` + `data-quality-steward` | Draft assembled T-3 | Audit must complete by T-2 |
| `chief-commercial-officer` → board | T-0 | Per board calendar |
| `chief-commercial-officer` → relevant pods | Decisions captured | T+3 |

## Compliance gates

1. **Forbidden phrasing** block per `.claude/skills/regulatory-disclosure-language.md`
2. **Forward-looking statement** framing on projections per Template 7
3. **VVIP discretion** — aggregated counts only
4. **Privilege** — legal-counsel-prepared content in legal-privileged appendix only
5. **Numeric integrity** — every number in the brief carries a verified source

## Out-of-scope

- Annual planning — `runbooks/annual-commercial-plan.md`
- Quarterly deeper cycle — `runbooks/quarterly-exec-brief.md`
- Daily situational awareness — `runbooks/cco-daily-brief.md`
- Strategic-bet evaluation — `runbooks/strategic-bet-evaluation.md`
- Crisis response — relevant crisis runbook

## KPIs

- Brief delivery on calendar (target: T-0 every month)
- Pod-manager input deadline compliance (target: 100%)
- Compliance + numeric audit pass on first attempt (target: ≥ 95%)
- Decision-action conversion rate (target: ≥ 80% of decision-asks actioned within 30 days)

## Close-out + learning

- Brief archived at `clients/<client>/exec-briefs/<YYYY-MM>/board-brief.md`
- Decision log + action items routed
- Lessons captured for next month's brief
- Material learnings feed `runbooks/monthly-board-prep.md` via `knowledge`

## Related runbooks

- `runbooks/quarterly-exec-brief.md` — quarterly deeper cycle
- `runbooks/annual-commercial-plan.md` — annual cycle
- `runbooks/cco-daily-brief.md` — daily cadence
- Any operational-crisis runbook (if material event occurred during month)
