# Runbook: Horizon scan — daily

> Scenario: Every business day at 06:00, the horizon scanner sweeps the regulator + press + sanctions + corridor + competitor surfaces and curates the items material to the CCO's day. This runbook is that single-owner choreography.

## Trigger

Daily at 06:00 client-local time (scheduler) — or on-demand when a known event warrants an off-cadence pull.

## Owner

`horizon-scanner` agent end-to-end. Coordinates with `regulatory-research-specialist` for currency confirmation on flagged regulator items, `aml-kyc-compliance-specialist` for sanctions-list deltas, `competitive-intel` for material competitive-launch follow-up.

## Pre-flight

- `clients/<client>/client-profile.md` current (markets, corridors, named competitors, press tier list)
- `.claude/skills/uae-real-estate-regulatory.md` regulator authority list current
- `.claude/skills/aml-kyc-uae-real-estate.md` sanctions authority list current
- `.claude/skills/diaspora-corridor-marketing.md` corridor-regulatory authority list current
- Prior 7 days of `clients/<client>/horizon-scan/` accessible (de-duplication)

## Sequence

| Time (client-local) | Who | What | Emits | SLA |
|---|---|---|---|---|
| 05:30 | scheduler | Triggers `horizon-scanner` | — | — |
| 05:30 → 05:50 | `horizon-scanner` | Regulator surface scan: DLD/RERA/ADREC/ADGM/DIFC/CBUAE/PDPL/UAE FIU | regulator-feed.md (interim) | ≤ 20 min |
| 05:50 → 06:00 | `horizon-scanner` | Press surface scan: per-client press tier list + default outlets | press-feed.md (interim) | ≤ 10 min |
| 05:30 → 06:00 (parallel) | `horizon-scanner` | Sanctions cadence scan: UN/OFAC/UK HMT/EU/DFAT | sanctions-feed.md (interim) | ≤ 30 min |
| 05:30 → 06:00 (parallel) | `horizon-scanner` | Corridor regulatory scan: per active buyer corridor | corridor-feed.md (interim) | ≤ 30 min |
| 06:00 | `horizon-scanner` | De-duplicate; curate; apply action-relevance test | curated items | by 06:00 |
| 06:00 | `horizon-scanner` | Emit `clients/<client>/horizon-scan/<YYYY-MM-DD>/scan.md` | scan.md | by 06:00 |
| 06:00 | `cco-morning-brief` | Reads scan.md as input | — | — |
| Immediate (off-cycle) | `horizon-scanner` | Any same-day-effective regulator action escalates immediately to `compliance` + `chief-commercial-officer`; does not wait for next-morning brief | escalation note | ≤ 15 min from detection |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `horizon-scanner` → `regulatory-research-specialist` | Regulator item flagged for action-relevance | If currency confirmation ≥ 4h, route to watchlist with note |
| `horizon-scanner` → `aml-kyc-compliance-specialist` | Sanctions delta affects active counterparty | Immediate per `runbooks/pep-sanctions-hit.md` |
| `horizon-scanner` → `content-pr-specialist` | Press item names developer or counterparty | Immediate; do not wait for next-morning brief |
| `horizon-scanner` → `competitive-intel` | Material competitive-launch info | Within same business day |
| `horizon-scanner` → `cco-morning-brief` | scan.md emitted | If scan.md missing by 06:30, brief notes "horizon scan unavailable" |

## Compliance gates

1. **No fabrication** — every cited item carries verifiable URL + retrieval timestamp
2. **No paraphrase of regulator quotes** — extract verbatim and link
3. **VVIP discretion** — items that touch VVIP counterparties route via `wealth-vvip-manager` for discretion check before surfacing
4. **PDPL** — counterparty identities in scan items handled per retention rules
5. **No-tipping-off** — sanctions-related items handled via restricted channel

## Out-of-scope

- Deep competitive analysis — `competitive-intel` per its own SOP
- Per-request regulator-rule confirmation — `regulatory-research-specialist`
- Operational AML/KYC screening — `aml-kyc-compliance-specialist`
- Press posture / response — `content-pr-specialist`
- General market research — `research`

## KPIs

- **Scan completion** (target: by 06:00 client-local, 100% of business days)
- **Action-relevance precision** (target: < 5% CCO-flagged "not relevant" rate)
- **Action-relevance recall** (target: < 1 missed-event per quarter)
- **Source-citation completeness** (target: 100%)
- **Same-day-effective escalation latency** (target: ≤ 15 minutes from detection)

## Close-out + learning

- Scan files accumulate at `clients/<client>/horizon-scan/<YYYY-MM-DD>/`; retain per audit policy
- Quarterly: pattern review of scanned categories that consistently surface "discarded as noise" → remove from scan scope
- Quarterly: pattern review of "missed events" surfaced via other channels → add to scan scope
- Routes via `knowledge` for `.claude/agents/horizon-scanner.md` updates if the framework needs adjustment

## Related runbooks

- `runbooks/cco-daily-brief.md` — consumes this runbook's output
- `runbooks/pep-sanctions-hit.md` — when sanctions delta hits an active counterparty
- `runbooks/complaint-rera-exposure.md` — when regulator inquiry surfaces
- `runbooks/press-sensitive-uhnw-transaction.md` — when press item touches VVIP
