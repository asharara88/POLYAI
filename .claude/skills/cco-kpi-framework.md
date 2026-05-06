---
name: cco-kpi-framework
description: The canonical KPI taxonomy for the Chief Commercial Officer surface — what gets measured, how it's defined, what cadence it lives on, who owns the source, and what threshold flips to action. Used by cco-morning-brief (synthesis), chief-commercial-officer (interpretation), forecasting (commercial KPIs), marketing-manager (marketing KPIs), wealth-vvip-manager (channel KPIs), crm-manager (lifecycle KPIs), and the web layer's /cco surface. Framework — specific per-engagement targets live in clients/<client>/cco/kpi-targets.md (per-client overrides win).
scope: CCO KPI taxonomy + cadence + thresholds
maintained_by: chief-commercial-officer + marketing-manager (writes via knowledge agent)
---

# CCO KPI framework

> **Read this first.** This skill defines *what* gets measured, not *what the targets are*. Per-engagement targets live in `clients/<client>/cco/kpi-targets.md` and inherit defaults from `verticals/real-estate/sub-verticals/developer/playbook.md`. Specific per-quarter target negotiation happens in the annual + quarterly planning cycles, not here.

## The five KPI families

| Family | What it measures | Primary cadence | Owner agent |
|---|---|---|---|
| **Commercial** | Revenue, bookings, pipeline, channel-mix, conversion | Daily + weekly + monthly + quarterly | `forecasting` (rollup) |
| **Marketing performance** | Channel ROI, CAC, attribution, brand-tracker | Weekly + monthly + quarterly | `analytics` |
| **Customer + lifecycle** | Owner CSAT, NPS, snagging, retention, referral | Monthly + quarterly | `crm-manager` |
| **Compliance + risk** | AML/KYC throughput, regulator-event count, complaint-rate, risk-register state | Daily + weekly + quarterly | `aml-kyc-compliance-specialist` + `risk-register-curator` |
| **Channel-development** | Broker / wealth / VVIP relationship state | Weekly + monthly + quarterly | `wealth-vvip-manager` |

## Family 1 — Commercial KPIs

| KPI | Definition | Cadence | Threshold (default) | Source |
|---|---|---|---|---|
| **Bookings AED (period)** | Sum of `Amount` on opportunities at `closed-won` in period | Daily roll-up | per-period plan ± 10% | Salesforce / pipeline.md |
| **Revenue-recognized AED (period)** | Per finance-system rules; typically deposit-received basis | Monthly | per-period plan ± 5% | Finance system (read) |
| **Cash-collected AED (period)** | Buyer payments received to Trustee Account | Monthly | per-period plan ± 5% | Trustee Bank reports |
| **Qualified pipeline AED** | Sum of opportunities ≥ qualified stage | Daily | ≥ 4× monthly bookings target | pipeline.md |
| **Pipeline coverage** | Qualified pipeline / next-quarter target | Weekly | ≥ 3× | derived |
| **Stage conversion (per-stage)** | % of opportunities that advance from stage X to X+1 | Weekly + quarterly | per-vertical baseline | pipeline.md |
| **Average days in stage** | Median days at each stage | Weekly | per-stage threshold | pipeline.md |
| **Average deal size AED** | Mean of closed-won `Amount` | Weekly | per-segment baseline | pipeline.md |
| **Channel-mix (% direct / broker / wealth / VVIP / other)** | % of period bookings by `source_channel` | Weekly | per-quarter plan ± 5pp | pipeline.md + `.claude/skills/marketing-attribution.md` |
| **Slipping deals AED + count** | Opportunities with `expected_close_date` pushed in last 7 days | Daily | < 10% of active pipeline | `forecasting` |
| **Stage-evidence mismatch count** | Opportunities at stage X without required evidence per `crm-data-model` | Weekly | < 5% | `data-quality-steward` |
| **Forecast accuracy (last quarter)** | Actual closed-won / forecast as of quarter-start | Quarterly | within ±10% | `forecasting` |

## Family 2 — Marketing performance KPIs

| KPI | Definition | Cadence | Threshold (default) | Source |
|---|---|---|---|---|
| **Marketing-budget burn** | Spend in period / planned | Weekly | within plan ± 10% | marketing-budget.md |
| **CAC by channel** | Period spend / period qualified-pipeline-acquired | Monthly | per-channel baseline | derived |
| **Conversion: lead → qualified** | % of leads reaching qualified | Weekly | per-source baseline | pipeline.md |
| **Conversion: qualified → closed-won** | % of qualified reaching closed-won (cohort-based) | Quarterly | per-source baseline | pipeline.md |
| **Channel ROI** | Period revenue-attributed / period channel spend | Quarterly | per-channel baseline | `analytics` per `.claude/skills/marketing-attribution.md` |
| **Brand share-of-voice** | Period mentions vs. competitor set | Monthly | per-quarter target | `content-pr-specialist` |
| **Sentiment (placements)** | % neutral-to-positive | Monthly | ≥ 80% | `content-pr-specialist` |
| **Permit-display compliance** | % of in-flight artifacts with current Trakheesi / ADREC permit displayed | Weekly | 100% | `compliance` + `data-quality-steward` |
| **Forbidden-phrasing incidents** | Count of artifacts caught at compliance with forbidden phrases | Weekly | 0 | `compliance` |

## Family 3 — Customer + lifecycle KPIs

| KPI | Definition | Cadence | Threshold (default) | Source |
|---|---|---|---|---|
| **Owner CSAT (rolling 90d)** | Aggregated CSAT score | Monthly | ≥ 80% positive | `voc` + post-handover surveys |
| **Owner NPS (rolling 90d)** | Net Promoter Score | Quarterly | per-segment baseline | `voc` |
| **Snagging-resolution within SLA** | % of snagging items resolved within published SLA | Monthly | ≥ 95% | `inventory-manager` |
| **Complaint-rate** | Complaints per 1000 active owners | Monthly | trending down | `service-recovery-specialist` |
| **Recurrence-rate by category** | % of complaints repeating category within 90 days | Quarterly | trending down | `service-recovery-specialist` |
| **Customer-confirmed closure rate** | % of complaints closed with customer confirmation | Monthly | ≥ 80% | `service-recovery-specialist` |
| **Referral conversion** | Closed-won where attribution is referral / existing-owner | Quarterly | per-quarter target | `email-lifecycle` + pipeline |
| **Email engagement (open + click) by segment** | Standard email metrics by `crm-manager` segment | Weekly | per-segment baseline | `email-lifecycle` |

## Family 4 — Compliance + risk KPIs

| KPI | Definition | Cadence | Threshold (default) | Source |
|---|---|---|---|---|
| **AML/KYC throughput** | Cleared / hold-pending-EDD / declined counts | Daily | per-launch capacity baseline | `aml-kyc-compliance-specialist` |
| **AML/KYC pre-clearance lag** | Median days from initiation to verdict | Weekly | ≤ 5 business days standard; ≤ 14 for EDD | Sumsub + audit |
| **PEP-flagged accounts active** | Count of PEP-flagged active counterparties | Daily | trended; flag any +N delta | Salesforce |
| **Sanctions-screening currency** | % of active counterparties screened ≤ 30 days | Daily | 100% | `aml-kyc-compliance-specialist` |
| **Open regulator inquiries** | Count + age | Daily | 0 ideal; flag any open | `legal-liaison` |
| **Regulator-event count (period)** | Trakheesi pulls, RERA inquiries, ADREC actions, etc. | Weekly | trending; pattern detection | `regulatory-research-specialist` |
| **Risk-register hot items** | Red + amber count | Daily | red ≤ 2; amber ≤ 5 | `risk-register-curator` |
| **Discretion incidents** | VVIP-no-mention-list breaches caught | Quarterly | 0 — non-negotiable | `vvip-channel-enablement` |
| **Forbidden-phrasing incidents** | (mirror of marketing family) | Weekly | 0 | `compliance` |
| **Permit-display compliance** | (mirror of marketing family) | Weekly | 100% | `compliance` |

## Family 5 — Channel-development KPIs

| KPI | Definition | Cadence | Threshold (default) | Source |
|---|---|---|---|---|
| **Active broker firms (Tier 1 + 2 + 3 split)** | Count by tier | Weekly | per-quarter target | `clients/<client>/brokers/registry.md` |
| **Broker activation rate** | New firms with first allocation request within 30 days of signing | Quarterly | ≥ 70% per `runbooks/broker-onboarding-to-first-deal.md` | `broker-enablement` |
| **Broker first-deal-close rate** | New firms with first closed-won within 90 days | Quarterly | ≥ 50% | `broker-enablement` |
| **Active wealth-channel intermediaries** | Count by tier | Weekly | per-quarter target | `clients/<client>/wealth-channels/registry.md` |
| **Wealth-channel introductions per quarter** | Count + value | Quarterly | per-target | `wealth-channel-enablement` |
| **Broker / wealth / VVIP channel-mix (% of bookings)** | (cross-references commercial family) | Weekly | per-plan | derived |
| **Reciprocity ledger net-debt** | Net inbound − outbound favors per counterparty | Monthly | balanced; flag persistent imbalance | `clients/<client>/reciprocity-ledger.md` |
| **VVIP-counterparty active count** | Count by class (aggregated; no naming) | Quarterly | per-engagement baseline | `vvip-channel-enablement` |

## Cadence-aware surfacing

| Cadence | Surface | Owner |
|---|---|---|
| **Daily** | `cco-morning-brief` | `cco-morning-brief` agent |
| **Weekly** | Pod-manager weekly status | each pod-manager |
| **Monthly** | `marketing-financial-manager` period close + `runbooks/monthly-board-prep.md` (5D) | as named |
| **Quarterly** | `runbooks/quarterly-exec-brief.md` | `marketing-manager` orchestrates |
| **Annual** | `runbooks/annual-commercial-plan.md` (5D) | `chief-commercial-officer` |

## Per-client target file

`clients/<client>/cco/kpi-targets.md` — per-engagement target negotiation outcome. Contains:
- Current quarter targets per KPI in the families above
- Threshold overrides where the per-client circumstances differ from default
- Sign-off (CCO + CFO + CEO) date

This file is updated only via the annual + quarterly planning cycles per `runbooks/annual-commercial-plan.md` (5D).

## Anti-patterns

- **Vanity KPIs** — count of impressions, count of brokers signed (not active). The framework intentionally privileges outcome over activity.
- **Lagging-only** — every family includes at least one leading indicator (pipeline coverage, AML/KYC throughput, snagging-resolution, channel activation rate).
- **Ungrounded thresholds** — every threshold default in this skill is overridable per-client; do not treat the defaults as eternally true.
- **Forbidden language** — KPI definitions never use the forbidden phrases per `.claude/skills/regulatory-disclosure-language.md` (e.g., "guaranteed yield" never appears in a KPI definition or in board reporting).

## What this skill does NOT cover

- Specific per-client targets — `clients/<client>/cco/kpi-targets.md`
- Strategic-narrative interpretation — `chief-commercial-officer` + `runbooks/quarterly-exec-brief.md`
- Specific platform measurement (GA4 setup, Meta CAPI) — `martech-ops-specialist`
- Per-deal commercial calculations — `marketing-financial-manager` + `forecasting`
- Brand-tracker methodology — separate brand-tracker discipline
