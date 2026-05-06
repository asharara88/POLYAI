# Runbook: Risk register — update

> Scenario: An agent (any agent) detects a material risk and needs to flag it to the central risk register. This runbook is the single-owner choreography for receiving the flag, classifying, opening / updating, aging, and (when threshold tripped) escalating.

## Trigger

Any of:
- An agent emits a risk-flag input (typed: agent name + risk class + summary + evidence + proposed mitigation)
- Daily 06:00 cron — `risk-register-curator` ages all open risks + recomputes status
- Weekly review cycle — full register review with `chief-commercial-officer`
- On material-mitigation event — proposed closure with rationale

## Owner

`risk-register-curator` agent end-to-end. Coordinates with `chief-commercial-officer` (escalation + closure sign-off), the four pod managers (per-class mitigation oversight), `legal-liaison` (privilege flagging), `aml-kyc-compliance-specialist` (counterparty class), `content-pr-specialist` (reputational class), `regulatory-research-specialist` (regulatory class).

## Pre-flight

- `clients/<client>/risk-register.md` accessible
- Risk-flag input from emitting agent meets minimum-quality bar (class + summary + evidence + proposed mitigation)
- Per-class threshold defaults known (per `.claude/skills/cco-kpi-framework.md` + per-client overrides if any)

## Sequence

### Path A — New risk-flag input

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 1 | (emitting agent) | Risk-flag emitted with class + summary + evidence + proposed mitigation | risk-flag input | — |
| 2 | `risk-register-curator` | Validate input completeness; reject + feedback if incomplete | validation note | ≤ 4h |
| 3 | `risk-register-curator` | Classify per taxonomy (commercial / regulatory / reputational / operational / counterparty); assign initial severity (material / significant / minor); set initial threshold per-class default or per-client override | classification | ≤ 4h |
| 4 | `risk-register-curator` | Open new entry in `clients/<client>/risk-register.md` with all fields populated; compute initial status (typically green) | risk-register.md updated | ≤ 4h |
| 5 (if material) | `risk-register-curator` → `chief-commercial-officer` | Material severity → CCO awareness within 4 hours | restricted alert | ≤ 4h |
| 6 (if class-specific routing needed) | `risk-register-curator` → relevant agent | Per handoff matrix | routing | ≤ 4h |

### Path B — Daily aging cycle (06:00)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 1 | `risk-register-curator` | For each open risk, recompute age + status per threshold | updated risk-register.md | ≤ 06:00 |
| 2 | `risk-register-curator` | Identify risks crossing amber → red overnight | escalation list | ≤ 06:00 |
| 3 | `risk-register-curator` → `chief-commercial-officer` | Red-status escalation alerts | restricted alert | ≤ 06:30 |
| 4 | `risk-register-curator` → `cco-morning-brief` | Risk-register hot items feed into morning brief | input handoff | by 06:00 |

### Path C — Closure proposal

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 1 | `risk-register-curator` (or owner agent) | Stability achieved for 30 days; mitigation documented | closure proposal | as observed |
| 2 | `risk-register-curator` | Validate stability claim against evidence | validation | ≤ 1 day |
| 3 | `risk-register-curator` → `chief-commercial-officer` | Closure proposal for sign-off | proposal | per CCO calendar |
| 4 | `chief-commercial-officer` | Approve closure / send back for further mitigation | decision | per CCO calendar |
| 5 | `risk-register-curator` | If approved: move entry from "Open" to "Closed (recent)" section with rationale + lessons-captured pointer | risk-register.md updated | ≤ 1 day from approval |

### Path D — Weekly full review

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 1 | `risk-register-curator` | Pre-meeting summary: all open risks + recent closures + watchlist | summary | weekly |
| 2 | `chief-commercial-officer` + `risk-register-curator` | Joint review (informal) | decisions on any reclassification or closure | weekly |
| 3 | `risk-register-curator` | Apply review outcomes | risk-register.md updated | weekly |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| Any agent → `risk-register-curator` | Risk-flag input | Curator response within 4h; emitting agent escalates to pod manager if no response |
| `risk-register-curator` → `chief-commercial-officer` | Material severity OR red status crossed | Within 4h (material) / immediate (red); escalate to executive committee if CCO unreachable > 8h |
| `risk-register-curator` → `legal-liaison` | Regulatory class or privilege-relevant | Same business day |
| `risk-register-curator` → `aml-kyc-compliance-specialist` | Counterparty class with sanctions/PEP adjacency | Per `runbooks/pep-sanctions-hit.md` immediate |
| `risk-register-curator` → `content-pr-specialist` | Reputational class with press surface | Same business day |
| `risk-register-curator` → `cco-morning-brief` | Daily, after aging | Implicit via file-update; brief reads file directly |

## Compliance gates

1. **No fabrication** — every entry has documented evidence
2. **No silent closure** — closure requires rationale + sign-off
3. **No silent aging-to-red** — every red transition triggers escalation
4. **VVIP discretion** — VVIP-counterparty risks aggregated by class; never named
5. **Privilege** — legal-counsel-prepared risk content tagged for legal privilege; restricted-access at file level
6. **No-tipping-off** — AML-adjacent risks via restricted channel
7. **PDPL** — counterparty PII per retention rules

## Out-of-scope

- Per-incident response — relevant runbooks own that
- Per-deal slip detection — `forecasting`
- Per-complaint resolution — `service-recovery-specialist`
- Per-counterparty AML/KYC tracking — `aml-kyc-compliance-specialist`
- Strategic risk analysis (multi-quarter scenarios) — `chief-commercial-officer` strategic-planning cycles

## KPIs

- **Curator response time** to new input (target: ≤ 4 business hours)
- **Aging accuracy** (target: 100%)
- **Red-escalation latency** (target: ≤ 1 business hour from threshold trip)
- **Closure stability** (target: < 5% of closed risks reopen within 90 days)
- **Source-evidence completeness** (target: 100%)

## Close-out + learning

- Closed entries persist in the register's "Closed (recent)" section for 90 days; archive thereafter per retention policy
- Quarterly trend feeds `runbooks/quarterly-exec-brief.md` compliance + risk section
- Pattern alerts (3+ same-class risks in a quarter) → `chief-commercial-officer` for systemic-review

## Related runbooks

- `runbooks/cco-daily-brief.md` — consumes this runbook's output
- `runbooks/pep-sanctions-hit.md` — counterparty-class subset
- `runbooks/complaint-rera-exposure.md` — regulatory + reputational subset
- `runbooks/quarterly-exec-brief.md` — quarterly trend reporting
