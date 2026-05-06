# Runbook: Integration go-live — news + regulator scan

> Scenario: Activate scheduled daily ingestion from named press outlets + regulator press-release feeds + sanctions-list watchers. Feeds `horizon-scanner` for daily curation; ultimately surfaces in CCO morning brief and on `/cco`.

## Trigger

Per-engagement greenlight to activate horizon-scan ingestion at production cadence (daily 05:30 client-local).

## Owner

`chief-commercial-officer` charters; `horizon-scanner` agent is the consumer; named human MarTech lead owns ingestion runtime; `legal-liaison` validates source-licensing (paid subscriptions vs. open access); `regulatory-research-specialist` validates regulator-source-list completeness.

## Pre-flight

- Source list approved per `clients/<client>/client-profile.md` press tier list (default: FT, Bloomberg, The National, Gulf News, Khaleej Times, Construction Week ME, MEED, Property Finder Insights, Bayut Insights)
- Regulator-source list per `.claude/skills/uae-real-estate-regulatory.md` (DLD, RERA, ADREC, ADGM-FSRA, DIFC-DFSA, CBUAE, UAE FIU, PDPL Authority)
- Sanctions-source list per `.claude/skills/aml-kyc-uae-real-estate.md` (UN SC, OFAC SDN, UK HMT OFSI, EU Consolidated, DFAT)
- Corridor-source list per `.claude/skills/diaspora-corridor-marketing.md` (RBI for India, SAMA for KSA, FCA for UK, CBN for Nigeria, SBP for Pakistan, etc.)
- Subscriptions / API access provisioned where required (FT, Bloomberg, etc.)
- Ingestion runtime deployed (cron + WebFetch/WebSearch via `horizon-scanner` agent)
- `clients/<client>/horizon-scan/` folder structure ready

## Sequence

### Phase 1: Source-mix calibration (1 week)

| Step | Who | What |
|---|---|---|
| 1 | `horizon-scanner` (sandbox) | First scan against full source list; emit; review for noise vs. signal |
| 2 | `chief-commercial-officer` + `marketing-manager` | Calibrate: which sources surfaced action-relevant items, which were pure noise; trim source list accordingly |
| 3 | `regulatory-research-specialist` | Verify regulator-source-list completeness; add any missed regulators; verify URL stability |
| 4 | `aml-kyc-compliance-specialist` | Verify sanctions-source-list coverage; confirm regime-currency |

### Phase 2: Production go-live (gated on Phase 1 calibration)

| Step | Who | What |
|---|---|---|
| 5 | `chief-commercial-officer` (decision-ask) | Approve production-cadence go-live |
| 6 | Named human MarTech lead | Production cron activated at 05:30 client-local; `horizon-scanner` runs daily |
| 7 | `cco-morning-brief` | Consumes daily scan output starting next morning |
| 8 | `chief-commercial-officer` | First-week review: scan quality vs. expectations; adjust if needed |

### Phase 3: Continuous operation

| Step | Who | What | Cadence |
|---|---|---|---|
| 9 | `horizon-scanner` | Daily scan → curated items → daily brief feed | Daily 05:30 |
| 10 | `chief-commercial-officer` | Quarterly: pattern review of "discarded as noise" vs. "missed events"; adjust source list | Quarterly |
| 11 | `regulatory-research-specialist` | Annual: regulator-source-list refresh (new regulators, deprecated sources) | Annually |
| 12 | `aml-kyc-compliance-specialist` | Quarterly: sanctions-source-list refresh (regime updates, new authorities) | Quarterly |

## Compliance gates

1. **Source-licensing** — paid sources (FT, Bloomberg) require active subscription; never scrape unauthorized
2. **No fabrication** — every cited item has verifiable URL + retrieval timestamp per `.claude/agents/horizon-scanner.md`
3. **No regulator paraphrase** — extract verbatim and link
4. **VVIP discretion** — items touching VVIP counterparties route via `wealth-vvip-manager` for discretion check before surfacing
5. **No-tipping-off** on sanctions-related items
6. **PDPL** — counterparty identities in scan items per retention rules
7. **Same-day-effective regulator action** triggers immediate escalation off-cadence per `runbooks/horizon-scan-daily.md`

## Rollback path

Phase 1 (sandbox calibration) → no production exposure.
Phase 2 (production go-live) → if scan quality unacceptable, halt; revert to manual horizon-monitoring; re-calibrate.
Phase 3 (continuous) → if specific source becomes unreliable or paid-sub lapses, drop from list temporarily; brief CCO on coverage gap; restore on resolution.

## Out-of-scope

- Deep competitive analysis on surfaced items — `competitive-intel`
- Per-request regulator-rule confirmation — `regulatory-research-specialist`
- Operational AML/KYC screening — `aml-kyc-compliance-specialist`
- Press posture / response — `content-pr-specialist`
- General market research — `research`

## KPIs

- Sandbox calibration cycle (target: ≤ 1 week)
- Daily scan completion (target: by 06:00 client-local; ≥ 99% of business days)
- Action-relevance precision (target: < 5% CCO-flagged "not relevant")
- Action-relevance recall (target: < 1 missed-event per quarter)
- Source-licensing compliance (target: 100%)
- Same-day-effective escalation latency (target: ≤ 15 minutes from detection)

## Related runbooks

- `runbooks/horizon-scan-daily.md` — operational choreography this integration enables
- `runbooks/cco-daily-brief.md` — downstream consumer
- `runbooks/pep-sanctions-hit.md` — sanctions-class scan items
- `runbooks/regulator-inquiry-non-complaint.md` — regulator-class scan items
- `.claude/skills/uae-real-estate-regulatory.md` + `.claude/skills/aml-kyc-uae-real-estate.md` + `.claude/skills/diaspora-corridor-marketing.md`

## Sign-off

`chief-commercial-officer` decision-memo + named human MarTech lead concurrence + `legal-liaison` source-licensing verification.
