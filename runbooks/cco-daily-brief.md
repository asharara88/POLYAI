# Runbook: CCO daily brief

> Scenario: Every business day, the CCO needs a single scannable artifact at 07:00 client-local time covering what changed overnight, what needs attention today, and what's coming up. This runbook is the single-owner choreography that produces it.

## Trigger

Daily at 06:00 client-local time (cron / scheduler) — or on-demand when the CCO requests an ad-hoc refresh.

## Owner

`cco-morning-brief` agent end-to-end. Coordinates with `horizon-scanner`, `risk-register-curator`, `decision-router`, the four pod managers, and `data-quality-steward` for source-currency.

## Pre-flight

- `clients/<client>/risk-register.md` current (curated daily by `risk-register-curator`)
- `clients/<client>/horizon-scan/<YYYY-MM-DD>/scan.md` current (emitted by `horizon-scanner` 06:00)
- `clients/<client>/cco/decision-asks/<YYYY-MM-DD>/` populated (queued by `decision-router`)
- `clients/<client>/cco/calendar.md` current (per-engagement-cadence updated by named human + agent)
- The seven weekly cadenced reports accessible (most-recent under each pod-manager folder)
- `clients/<client>/sales/pipeline.md` + `marketing-budget.md` current

## Sequence

| Time (client-local) | Who | What | Emits | SLA |
|---|---|---|---|---|
| 06:00 | `horizon-scanner` | Daily scan completes; emits `clients/<client>/horizon-scan/<date>/scan.md` | scan.md | ≤ 06:00 |
| 06:00 | `risk-register-curator` | Daily age + status recompute on `clients/<client>/risk-register.md`; updates the file in place | risk-register.md updated | ≤ 06:00 |
| 06:00 | `decision-router` | Decision-asks queue snapshot for today | `clients/<client>/cco/decision-asks/<date>/` populated | ≤ 06:00 |
| 06:30 | `cco-morning-brief` | Pull all inputs; assemble brief per template | draft brief | by 06:55 |
| 06:55 | `cco-morning-brief` | Final read-through; cross-reference; emit | `clients/<client>/cco/briefs/<date>/morning-brief.md` | ≤ 07:00 |
| 07:00 | (web layer renders) | `web/app/cco/page.tsx` reads the latest brief; CCO opens; reads in 90 seconds | rendered page | — |
| 08:00 | (CCO + CCO chat) | CCO reads + acts; CCO chat presets surface deeper-dives on demand | actions taken | — |
| Ad-hoc | `cco-morning-brief` | If material event surfaces during the day, CCO requests a refresh; agent emits `<HH-MM>-update.md` in same day's brief folder | update brief | ≤ 30 min from request |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `horizon-scanner` → `cco-morning-brief` | scan.md emitted | If scan.md missing at 06:30, brief notes "horizon scan unavailable" and emits with that gap flagged |
| `risk-register-curator` → `cco-morning-brief` | risk-register updated | If update missing, brief uses prior-day register with currency flag |
| `decision-router` → `cco-morning-brief` | queue ready | If queue empty or unavailable, brief notes "no decision-asks queued" |
| `cco-morning-brief` → `chief-commercial-officer` | brief emitted | If by 07:30 brief still not emitted, CCO operates manually for the day; postmortem same day |

## Compliance gates

1. **VVIP discretion** — VVIP-counterparty references aggregated; never named in the brief
2. **PDPL** — counterparty PII not in the brief; aggregated counts only
3. **Forbidden phrasing** — none of `.claude/skills/regulatory-disclosure-language.md` blocked phrases appear, even internally
4. **Source-citation completeness** — every numeric in the brief carries an as-of timestamp citing source
5. **Restricted-access** — brief lives in folder readable by named CCO team only

## Out-of-scope

- Strategic interpretation — CCO does that on read
- Deep-dive on any one item — CCO chat presets ("Brief me on [item]") handle drill-down
- Long-form analysis — `runbooks/quarterly-exec-brief.md` is for that cadence
- Crisis runbooks — those have their own owner; brief surfaces crisis-state, not crisis-resolution

## KPIs

- **Delivery time** (target: by 07:00 client-local; 100% of business days)
- **Reading time** (target: ≤ 90 seconds for headline; ≤ 3 minutes full)
- **Source-citation completeness** (target: 100%)
- **CCO-flagged "this should have been in the brief"** (target: < 1 per quarter)
- **Fabrication incidents** (target: 0)
- **Ad-hoc refresh latency** (target: ≤ 30 minutes from request)

## Close-out + learning

- Briefs accumulate at `clients/<client>/cco/briefs/<YYYY-MM-DD>/` — each day a separate folder
- Weekly retro on brief-quality between `cco-morning-brief` agent + `chief-commercial-officer` (informal)
- Quarterly retro feeds `knowledge` for any framework adjustment to this runbook

## Related runbooks

- `runbooks/horizon-scan-daily.md` — feeds this runbook
- `runbooks/risk-register-update.md` — feeds this runbook
- `runbooks/quarterly-exec-brief.md` — quarterly deeper-cycle counterpart
- Any incident-runbook (e.g., `runbooks/pep-sanctions-hit.md`) — when a triggering event surfaces, the brief flags it; that runbook owns the resolution
