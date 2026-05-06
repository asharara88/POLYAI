# Integration: Sumsub (KYC / AML screening provider)

## Purpose

Sumsub is the operational AML/KYC screening surface for any new counterparty (buyer, broker, wealth-channel intermediary, family office, VVIP). POLYAI does not run the screening logic itself — it orchestrates intake, calls Sumsub for verification, and consumes the verdict for downstream gating.

The screening evidence (passport scans, EIDA, source-of-funds documents) **lives in Sumsub's audit log, not in this repo**. The repo holds verdicts, audit reference IDs, and the operational decisions made on top of those verdicts.

## Auth

Sumsub API key + secret per environment, stored in Vercel env vars (production + sandbox separately). Per-client Sumsub level/applicant-flow IDs in `clients/<slug>/integrations/sumsub/config.md`. The Sumsub MCP (when wired) provides tool surface; otherwise direct REST.

## Tier model

| Operation class | Tier | Default policy |
|---|---|---|
| Read applicant status | A — read | Auto |
| Read verification result | A — read | Auto |
| Create applicant | B — write | Per-client |
| Submit applicant for review | B — write | Per-client |
| Trigger re-screening (sanctions / PEP delta) | B — write | Auto-eligible per cadence in `.claude/skills/aml-kyc-uae-real-estate.md` |
| Manual override of automated decision | D — autonomous prohibited | Human-only |
| Delete applicant data | D — autonomous prohibited | Human + legal-liaison + data-protection officer |

## Used by

- `aml-kyc-compliance-specialist` — primary user. Initiates checks, consumes verdicts, manages re-screening cadence.
- `inbound-qualifier` — for HNW inbound, may initiate pre-clearance via the AML/KYC agent.
- `wealth-channel-enablement` — for new wealth-channel intermediary onboarding.
- `vvip-channel-enablement` — for VVIP screening (with discretion stance enforced).
- `broker-enablement` — for new broker-firm registration.
- `secondary-market-specialist` — for incoming-buyer screening on resale transactions.

## Data flow

```
New counterparty enters any registry
    ↓
aml-kyc-compliance-specialist creates Sumsub applicant via integration-action
    ↓ (Tier B)
Sumsub onboarding link sent to counterparty (via human RM, or via wealth-channel intermediary)
    ↓
counterparty completes verification flow (ID, selfie/liveness, source-of-funds upload)
    ↓
Sumsub runs: identity check, document validation, PEP screen, sanctions screen against UN/OFAC/UK/EU/DFAT/GCC, adverse-media screen
    ↓
Sumsub webhook → integration runtime
    ↓
aml-kyc-compliance-specialist consumes verdict
    ↓
- "GREEN" → cleared verdict written to Salesforce Account, low-risk rating
- "RED — PEP / adverse-media / partial doc" → hold-pending-EDD, EDD workflow triggered
- "RED — sanctions hit" → halt, immediate escalation to legal-liaison + chief-commercial-officer; do not signal to counterparty (tipping-off)
    ↓
Re-screening cadence per risk-rating set in clients/<slug>/wealth-channels/screening/<id>/calendar.md
```

## What we read regularly

- New verification completions (webhook + polling fallback)
- Re-screening hits (daily/continuous sanctions list updates per Sumsub side)
- Applicant status (in-progress, pending-review, approved, rejected)
- Audit-log reference IDs (for our own evidence chain — not the documents themselves)

## What we write (each through integration-action envelope)

See `integrations/sumsub/actions/`:

- `run-check.md` — create applicant + initiate verification flow

(Future actions as needed: `re-screen.md`, `update-applicant.md`, `request-additional-document.md`)

## What we do NOT do

- We do not store source documents in this repo. They live in Sumsub's audit log, accessible via the audit reference ID.
- We do not override Sumsub's automated decision via integration. Manual overrides are human-only with legal sign-off.
- We do not delete applicant data — UAE PDPL retention rules apply, and DNFBP record-retention is typically 5+ years per the AML/CFT Federal Decree-Law.
- We do not signal a sanctions hit to the counterparty (tipping-off offense). The verdict triggers internal escalation only.
- We do not bulk-export PII. Per-applicant queries with audit trail only.

## Per-client config

`clients/<slug>/integrations/sumsub/config.md`:

```yaml
sumsub_app_token:            # production token (env var ref)
sumsub_secret_key:           # env var ref
applicant_levels:            # Sumsub level IDs per counterparty type
  individual-buyer:          # standard individual KYC + sanctions/PEP
  hnw-individual-buyer:      # enhanced — adds source-of-wealth narrative
  uhnw-individual-buyer:     # full EDD level
  corporate-buyer:           # entity verification + UBO ≥ 25%
  trust-or-fo-buyer:         # complex entity layering
  broker-firm:               # corporate verification + license check
  wealth-intermediary:       # enhanced corporate + principal screening
webhook_url:                 # endpoint in Vercel deployment
default_re_screen_cadence:   # per risk-rating
  low: annual
  medium: semi-annual
  high: quarterly
sanctions_list_coverage:     # confirm Sumsub configured for all five primary regimes
  UN: true
  OFAC: true
  HMT: true
  EU: true
  DFAT: true
  GCC: true   # confirm with provider
adverse_media_screening: true
pep_definition_scope: extended   # includes immediate family + close associates per FATF
```

## Failure modes to handle

- **Webhook missed** — daily polling reconciliation against Sumsub applicant list.
- **Counterparty stalls verification** — auto-reminder cadence (24h, 72h, 7d), then RM intervention.
- **Sumsub list-update lag** — sanctions list updates have a daily cadence at Sumsub; for high-velocity periods (Russia/CIS sanctions surface), supplement with manual checks per `regulatory-research-specialist` guidance.
- **Discrepancy between verdict and other-source intelligence** (e.g., adverse media surfaces in `competitive-intel` after verdict) — re-screen + escalate to `aml-kyc-compliance-specialist`.
- **Applicant re-uses identity across multiple counterparty profiles** (e.g., buyer + broker + wealth-channel) — Sumsub deduplicates; we surface the link to `data-quality-steward`.

## Status

Spec live. Wiring activates when Sumsub credentials are configured per-client. Until then, screening proceeds via human Compliance Officer with manual log entries; the integration-action envelope is used as the documentation shape.
