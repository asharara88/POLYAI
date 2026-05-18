# Runbooks — real-estate-uae pack

All 25 runbooks for the shipping `real-estate-uae` pack live here. Pack runbooks are loaded for every client with `pack: real-estate-uae` (or legacy `vertical: real-estate-uae`) in their `client-profile.md`.

## Catalog

### CCO daily + cadenced reporting

- `cco-daily-brief.md` — Daily 06:00 → 07:00 morning-brief synthesis choreography
- `horizon-scan-daily.md` — Daily 06:00 horizon-scan for `cco-morning-brief`
- `risk-register-update.md` — Risk-register receive / age / escalate / close cycle
- `monthly-board-prep.md` — Monthly board-prep brief (8-section template)
- `quarterly-exec-brief.md` — Quarterly board / CMO / CFO brief cadence
- `annual-commercial-plan.md` — Annual planning cycle (Q4 → Q1)

### Regulatory + counterparty crisis

- `resale-with-noc.md` — Secondary-market resale: NOC → AML/KYC pre-clearance → RERA Form-F / ADREC equivalent → Trustee Account release → owner-record update
- `complaint-rera-exposure.md` — Customer complaint that names or threatens RERA Rental Dispute Centre filing
- `pep-sanctions-hit.md` — A counterparty surfaces as a PEP (any class) or as a sanctions-list match
- `regulator-inquiry-non-complaint.md` — Regulator opens inquiry / audit / thematic review without underlying buyer complaint

### Operational crisis

- `construction-delay-handover-slip.md` — Material construction delay with buyer-notification obligation analysis
- `tier-1-broker-collapse.md` — Tier-1 broker firm experiences material continuity event
- `project-safety-press-crisis.md` — On-premises incident (safety / fatality / system-failure) with crisis-comms posture
- `key-rm-departure.md` — Key Relationship Manager / pod-manager departure with portfolio + relationship continuity

### Customer + channel lifecycle

- `international-roadshow.md` — 14-day post-roadshow cadence in buyer's local time-zone with jurisdiction-specific Golden Visa messaging
- `inbound-hnw-private-bank.md` — Discreet inbound from private bank: KYC pre-clearance, principal-to-principal escalation
- `broker-onboarding-to-first-deal.md` — From signed broker agreement to first allocation approved
- `handover-snagging.md` — Owner experience during the snagging window; CSAT capture
- `press-sensitive-uhnw-transaction.md` — Discretion-first; coordinates vvip-channel-enablement, content-pr-specialist, legal-liaison

### Regulatory operations

- `trakheesi-permit.md` — Dubai DLD/RERA advertising-permit lifecycle: application initiation (T-45) → issuance → creative integration → launch → sustain audit → renewal → pull-down

### Strategic-bet evaluation

- `strategic-bet-evaluation.md` — Structured evaluation for new launch / partnership / corridor / M&A / structural channel investment

### Integration go-live (per-integration gate)

- `integration-go-live-salesforce.md` — Salesforce wiring per `integrations/salesforce/spec.md`
- `integration-go-live-sumsub.md` — Sumsub (KYC/AML) wiring per `integrations/sumsub/spec.md`
- `integration-go-live-calendar.md` — CCO-personal calendar OAuth (Google / Microsoft 365)
- `integration-go-live-news-scan.md` — Daily news + regulator + sanctions feed ingestion for `horizon-scanner`

## Runbook shape

Each runbook follows this template:

```
# Runbook: <scenario name>

## Trigger          What event makes this the right runbook
## Owner            Single agent or named human accountable
## Pre-flight       Records / compliance flags / authorizations
## Sequence         Numbered steps: WHO / WHAT / EMIT / NEXT / SLA
## Hand-offs        Named transitions with failure modes
## Compliance gates Where compliance / AML-KYC / regulatory-research signs off
## Out-of-scope     What this runbook does NOT cover
## KPIs             Quantitative success criteria
## Close-out        How the case file closes, what feeds back into knowledge
## Related runbooks When to switch mid-flight
```

## Authoring rules

1. **One owner.** Every runbook has a single accountable agent or human role.
2. **Compliance gates are explicit.** Don't assume the actor will route to compliance; the runbook tells them when.
3. **Hand-off SLAs.** Every hand-off has a target time. Without it, the runbook stalls invisibly.
4. **Out-of-scope is named.** Runbook drift is the most common failure mode; protect against it.
5. **Updates via `knowledge` agent + `chief-commercial-officer` approval.** Do not edit a runbook in flight; mark version + date.
6. **Citations are framework, not current truth.** UAE regulators issue circulars frequently; specific citations route through `regulatory-research-specialist` for per-request confirmation.
7. **Per-client variations** live at `clients/<slug>/runbooks/<scenario>-overrides.md` and override the pack runbook when present.
