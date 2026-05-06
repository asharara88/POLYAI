# Runbook: Quarterly executive brief

> Scenario: At the end of each commercial quarter, the developer's executive team (CMO + CCO + CFO + CEO + Board chair where relevant) needs a defensible, complete, evidence-backed read on commercial performance. The brief is not a sales pitch — it is the basis for the next quarter's resource decisions, channel-mix decisions, and strategic-bet decisions. Mishandled, leadership operates on vibes; handled well, decisions get made on signal.

## Trigger

Quarter-end (T-0 = last business day of the quarter). The runbook spans T-21 to T+14 — three weeks of preparation, brief delivered in the first two weeks of the new quarter.

## Owner

`chief-commercial-officer` charters and presents. `marketing-manager` orchestrates assembly. `forecasting`, `analytics`, `marketing-financial-manager`, `marketing-manager`, `crm-manager`, `wealth-vvip-manager`, `service-recovery-specialist`, `aml-kyc-compliance-specialist`, `regulatory-research-specialist`, and (where applicable) `legal-liaison` each contribute their section.

## Pre-flight

- Quarter-end Salesforce data current — `data-quality-steward` daily scans confirm no material divergence
- Forecasting calibration current — last-quarter actuals vs. last-quarter forecast captured
- All in-flight campaigns have current performance data
- Material risks tracked through the quarter cataloged
- VVIP-touching activity aggregated (no individual-counterparty detail surfaces in the brief per discretion stance)
- Last-quarter brief accessible for trend continuity

## Sequence

| Day | Who | What | Emits |
|---|---|---|---|
| T-21 | `chief-commercial-officer` | Charter the quarter-brief — confirm audience, format, length, decision-asks (if any) | Charter at `clients/<client>/exec-briefs/<quarter>/charter.md` |
| T-21 | `marketing-manager` | Section-owner kickoff — assign sections to owners with deadlines | Section-assignment matrix |
| T-21 to T-14 | All section owners | Section drafts produced per template (see Sections below) | Per-section drafts in `clients/<client>/exec-briefs/<quarter>/sections/` |
| T-14 | `marketing-manager` | Sections received + reviewed for completeness + cross-section consistency | Review notes |
| T-10 | `data-quality-steward` | Data-quality audit on every numeric in the brief — sources cited, calculations verified | Audit log |
| T-7 | `compliance` | Compliance check on any forward-looking language (per `.claude/skills/regulatory-disclosure-language.md` Template 7); forbidden-phrasing block | Compliance verdict |
| T-7 | `regulatory-research-specialist` | Currency check on any regulatory citation in the brief | Currency verdict |
| T-5 | `marketing-manager` | First full draft assembled; brief structured per audience preference | Full draft |
| T-3 | `chief-commercial-officer` | CCO review + revision | Revised draft |
| T-1 | `chief-commercial-officer` + executive presenter | Final review; rehearsal of decision-ask narrative | Final brief |
| T+0 to T+14 | `chief-commercial-officer` | Brief delivered (board / CMO / CFO / CEO per cadence) | Brief delivered |
| T+14 | `chief-commercial-officer` + `marketing-manager` | Post-brief decisions captured; route to relevant pods for action | Decision log at `clients/<client>/exec-briefs/<quarter>/decisions.md` |

## Brief sections (standard template)

### 1. Executive summary (1 page)
Owner: `chief-commercial-officer` writes the cover.
- Headline: where commercial performance landed vs. plan
- 3-5 key takeaways
- Decision-asks (if any)

### 2. Commercial performance — owned by `forecasting` + `marketing-financial-manager`
- Quarter actuals vs. plan: bookings, revenue-recognized, cash collected
- Pipeline-end-of-quarter: by stage, by channel, by emirate, by project
- Channel mix: direct / broker / wealth-channel / VVIP-channel split
- Per-project performance with VVIP-aggregated
- Forecast for next 1-2 quarters: commit / best-case / pipeline / omitted per `forecasting` agent's framework
- Calibration commentary: how previous-quarter forecast compared to actual; how this affects confidence on this-quarter's forecast

### 3. Channel performance — owned by `marketing-manager` + `analytics`
- Per-channel ROI per `.claude/skills/marketing-attribution.md` framework
- Per-channel volume + cost + cost-per-qualified-lead
- Per-corridor performance for international roadshow + diaspora activity
- Marketing-budget burn vs. plan
- Channel-mix recommendations for next quarter

### 4. Channel-development — owned by `wealth-vvip-manager`
- Broker-channel: active firms, new firms onboarded, dormant firms reactivated, disengaged firms (per `runbooks/broker-onboarding-to-first-deal.md` framework)
- Wealth-channel: active intermediaries, new intermediaries signed, performance per intermediary
- VVIP-channel: aggregated activity (no individual-counterparty detail per discretion)
- Channel-development activity in the quarter — events run, relationships built

### 5. Customer + owner-community — owned by `crm-manager` + `voc` + `account-manager`
- Active CRM size, segmentation health (per `email-lifecycle`)
- Owner-community size, T+60 NPS by project cohort
- VoC themes — top emerging themes, recurring themes, resolved themes
- Service-recovery activity (count by severity, regulator-exposure incidents per `runbooks/complaint-rera-exposure.md`)
- Snagging metrics for projects in handover-window

### 6. Compliance + risk — owned by `aml-kyc-compliance-specialist` + `regulatory-research-specialist` + `legal-liaison`
- AML/KYC throughput: pre-clearance volume, EDD volume, PEP-flagged accounts active, sanctions-screening activity
- Material regulatory developments in the quarter (DLD / RERA / ADREC / ADGM / DIFC / federal)
- Active regulator inquiries (anonymized count)
- Material legal matters (anonymized; redacted detail to legal-privileged appendix where needed)
- Risk register update

### 7. Strategic recommendations — owned by `chief-commercial-officer` + `marketing-manager`
- 3-5 strategic recommendations for next quarter
- Each backed by data from sections 2-6
- Decision-asks framed: option A / option B / option C with consequences

### 8. Appendix
- Source citations
- Calculation methodology where novel
- Definitions
- Last-quarter brief reference

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `marketing-manager` → section owners (kickoff) | T-21 | Escalate to `chief-commercial-officer` if any owner non-responsive within 5 days |
| Section owners → `marketing-manager` (drafts) | T-14 | Escalate to `chief-commercial-officer` if any section missing or materially incomplete |
| `marketing-manager` → `data-quality-steward` (audit) | T-10 | Audit must complete before T-7 compliance review |
| `marketing-manager` → `compliance` (review) | T-7 | Block on any forbidden phrasing; `compliance` may demand revisions; cycle back |
| `marketing-manager` → `regulatory-research-specialist` (currency) | T-7 | Block on any stale citation |
| `chief-commercial-officer` → executive audience | T+0 to T+14 | Per leadership calendar |
| `chief-commercial-officer` → relevant pods (decisions) | T+14 | Decisions logged; action items assigned |

## Compliance gates

1. **Forbidden phrasing block** — no "guaranteed yield", "guaranteed appreciation", "risk-free" anywhere in the brief, even in internal-audience contexts (the brief leaves the building eventually; the standard is the same).
2. **Forward-looking language** — any next-quarter projection carries the forward-looking-statement framing per `.claude/skills/regulatory-disclosure-language.md` Template 7.
3. **VVIP discretion** — VVIP-touching activity surfaces only as aggregated count + value; no counterparty identification; no unit/floor/tower reference that would imply identification.
4. **AML/KYC restricted detail** — pattern-level statistics only; no individual-counterparty PII; restricted-access detail in legal-privileged appendix where needed.
5. **Legal-privileged content** — flagged at the file-level; restricted access to named human team.
6. **Numeric integrity** — every number in the brief has a verified source citation. `data-quality-steward` audits.
7. **Regulatory currency** — every regulatory citation is current per `regulatory-research-specialist` confirmation as of T-7.

## Out-of-scope

- Strategic planning (the brief informs planning; doesn't replace it) — that's a separate `marketing-manager` + `chief-commercial-officer` cycle
- Per-deal commercial detail (deals are aggregated; individual-deal review happens elsewhere)
- HR / operational / finance company-wide reporting (this is the commercial brief specifically)
- Investor-relations communication (separate discipline; route via `chief-commercial-officer` to human IR lead)

## KPIs

- Brief delivery on calendar (target: T+0 to T+14 per CCO+executive cadence)
- Section-owner deadline compliance (target: 100%)
- Data-quality audit pass on first attempt (target: ≥ 95% — drift indicates upstream data-quality issue)
- Compliance review pass on first attempt (target: ≥ 95% — drift indicates section-author needs `compliance` partnering earlier)
- Currency verdict pass on first attempt (target: 100% — stale citation is unacceptable)
- Decision-action conversion rate (% of decision-asks that result in actioned decisions; target: ≥ 80%)
- Year-on-year section consistency (proxy for cumulative-trend visibility)

## Close-out + learning

- Brief archived at `clients/<client>/exec-briefs/<quarter>/final-brief.md`
- Decision log at `clients/<client>/exec-briefs/<quarter>/decisions.md`
- Action items routed to relevant pods with owners + deadlines
- Cross-quarter trends in section-owner pain-points (e.g., a section consistently late) routed to `marketing-manager` for process improvement
- Material strategic shifts (e.g., a channel deprioritized) routed via `knowledge` for `verticals/real-estate/sub-verticals/developer/playbook.md` update

## Related runbooks

- Coordinate with `international-roadshow.md` if next-quarter roadshow plan is part of a decision-ask
- Coordinate with `broker-onboarding-to-first-deal.md` if channel-development pace is a decision-ask
- Coordinate with `complaint-rera-exposure.md` cumulative metrics for regulator-exposure trend reporting
- Coordinate with `pep-sanctions-hit.md` aggregated-throughput statistics for compliance section
