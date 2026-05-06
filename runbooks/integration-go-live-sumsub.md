# Runbook: Integration go-live — Sumsub (KYC/AML provider)

> Scenario: A per-client engagement is ready to wire Sumsub from spec-only (per `integrations/sumsub/spec.md`) to live operational. Sumsub handles all AML/KYC screening; documents stay with the provider; verdicts + audit IDs flow to the developer.

## Trigger

Per-engagement greenlight to activate Sumsub-mediated screening.

## Owner

`chief-commercial-officer` charters; `aml-kyc-compliance-specialist` owns end-to-end operational; `legal-liaison` validates DNFBP-record-retention and PDPL compliance; named human Compliance Officer maintains the customer-side relationship with Sumsub.

## Pre-flight

- `integrations/sumsub/spec.md` reviewed
- `clients/<slug>/integrations/sumsub/config.md` populated (app token, secret key as env vars; applicant-level mapping by counterparty type; webhook URL; re-screen cadence; sanctions-list-coverage confirmation)
- Sumsub-side configuration: levels created, webhooks configured, sanctions-list coverage verified for all 5 primary regimes (UN/OFAC/UK HMT/EU/DFAT) plus GCC where applicable
- Sandbox + production environments separated
- Webhook endpoint deployed in Vercel
- `aml-kyc-compliance-specialist` capacity ready for incoming verdict-review load

## Sequence

### Phase 1: Sandbox (1-2 weeks)

| Step | Who | What | Emits |
|---|---|---|---|
| 1 | Named human Compliance Officer | Sandbox levels created per applicant-type taxonomy in spec | Sandbox config |
| 2 | `aml-kyc-compliance-specialist` | Synthetic-applicant smoke test: create applicant, send onboarding link to test email, complete verification flow, receive verdict via webhook | Test log |
| 3 | `aml-kyc-compliance-specialist` | RED-outcome simulation: trigger a synthetic sanctions-list match; confirm `runbooks/pep-sanctions-hit.md` activation per protocol; confirm restricted-channel routing | Test log |
| 4 | `aml-kyc-compliance-specialist` | PEP-EDD path simulation: synthetic PEP-flagged applicant; confirm EDD case file workflow; confirm senior-management-approval recording | Test log |
| 5 | `aml-kyc-compliance-specialist` | Re-screening cadence test: synthetic applicant aged to re-screen-due; confirm provider-side delta detection | Test log |

### Phase 2: Production go-live (gated on Phase 1 pass)

| Step | Who | What | Emits |
|---|---|---|---|
| 6 | `chief-commercial-officer` (decision-ask) | Approve production go-live | Decision memo |
| 7 | Named human Compliance Officer | Production credentials verified; webhook endpoint live and authenticated | Auth log |
| 8 | `aml-kyc-compliance-specialist` | First production applicants: handle live; close-loop with audit-ID storage in `clients/<slug>/wealth-channels/screening/<id>/` (or analogous) per `.claude/skills/aml-kyc-uae-real-estate.md` audit-trail expectations | Audit logs |
| 9 | `aml-kyc-compliance-specialist` | Re-screen cadence activated for cleared counterparties per per-client config | Cadence active |

### Phase 3: Continuous operation

| Step | Who | What | Cadence |
|---|---|---|---|
| 10 | `aml-kyc-compliance-specialist` | Monthly throughput review (cleared / hold-pending-EDD / declined counts) | Monthly |
| 11 | `aml-kyc-compliance-specialist` | Quarterly sanctions-list-coverage audit (confirm provider-side updates current) | Quarterly |
| 12 | Named human Compliance Officer | Annual provider relationship review: SLA, feature requests, contract renewal | Annually |

## Compliance gates

1. **Documents stay with Sumsub** — never migrated to repo
2. **Audit-IDs reference only** — repo holds verdicts + IDs + dates; PII does not migrate
3. **No-tipping-off** on RED outcomes — restricted-channel; never signal counterparty
4. **PDPL retention** — per applicable retention rule (typically 7 years per DNFBP)
5. **Senior-management approval** for PEP-EDD continuation recorded
6. **Cross-regime sanctions coverage** — all 5 primary regimes verified active
7. **Webhook authentication** — verified; replay-attack protection active

## Rollback path

Phase 1 (sandbox-only) → no production exposure.
Phase 2 (production go-live) → halt new applicant creation; existing applicants continue per provider; named human Compliance Officer operates manually; investigate; re-test sandbox.
Phase 3 (continuous) → if provider SLA breach or feature gap surfaces, contingency: alternative-provider evaluation per `marketing-procurement` framework; until then, manual + provider parallel.

## Out-of-scope

- Per-applicant decisioning beyond auto-verdict — `aml-kyc-compliance-specialist` per case
- STR submission via goAML — human FIU liaison per UAE FIU process
- Tax / FATCA / CRS reporting — separate counsel discipline
- Sumsub's own service-quality (provider-side concern)

## KPIs

- Sandbox pass rate first attempt (target: ≥ 90%)
- Webhook reliability (target: ≥ 99.5%)
- Verdict turnaround (target: ≤ 5 business days standard; ≤ 14 for EDD)
- Tipping-off incidents (target: 0 — non-negotiable)
- Document-migration incidents (target: 0)
- Audit-trail completeness (target: 100%)

## Related runbooks

- `runbooks/pep-sanctions-hit.md` — RED outcome handling
- `runbooks/inbound-hnw-private-bank.md` — primary application surface
- `runbooks/resale-with-noc.md` — secondary-market application surface
- `runbooks/broker-onboarding-to-first-deal.md` — broker-firm screening surface
- `integrations/sumsub/spec.md` + `integrations/sumsub/actions/run-check.md`

## Sign-off

Production go-live requires `chief-commercial-officer` approval per Phase 2 decision-memo + named human Compliance Officer concurrence.
