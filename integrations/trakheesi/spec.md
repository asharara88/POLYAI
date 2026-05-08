# Integration: Trakheesi (Dubai DLD/RERA advertising-permit system)

## Purpose

**Every public-facing real-estate advertisement in Dubai requires a Trakheesi permit.** Without the permit, the ad cannot lawfully run — and any agency, channel, or platform that publishes it without a displayed permit number is in violation. Trakheesi is operated by Dubai Land Department / RERA and gates the advertising surface for the entire emirate.

Flow does not own permit issuance — that's a developer-side regulatory operations function. Flow integrates so:

- `compliance` can verify a permit number is on file before approving any Dubai-side artifact for ship
- `agency-liaison` can chase the permit application status with the responsible team and the regulator
- `marketing-manager` can plan campaign go-live windows around expected permit issuance dates
- `data-quality-steward` can audit which artifacts in flight are permit-gated and which are clear

The Abu Dhabi equivalent (current ADREC permit regime) is a sibling spec — verify current with `regulatory-research-specialist` per request and create `integrations/adrec/spec.md` when needed.

## Auth

The Trakheesi system is operated by DLD; the developer's regulatory-operations team holds the credentials. Flow does not directly call Trakheesi APIs (which are limited and developer-portal-mediated). Instead:

- Permit numbers are recorded in the repo at `clients/<client>/regulatory/trakheesi/permits/<permit_number>.md`
- Application status is tracked manually by `agency-liaison` + the human regulatory-operations contact
- Permit display verification is done by `compliance` against the recorded permit number

When/if DLD opens an automated developer-portal API, this spec will extend to integrate directly. For now: record-keeping + verification, not direct calls.

## Tier model

Because there is no direct API call from Flow to Trakheesi, the tier model applies to internal write actions:

| Operation class | Tier | Default policy |
|---|---|---|
| Record permit application initiated | A — internal write only | Auto on `agency-liaison` initiation |
| Record permit issued (number + validity) | A — internal write only | Auto on documented receipt |
| Mark artifact permit-cleared | B — explicit `compliance` approval | Always explicit |
| Mark artifact ship-blocked pending permit | A | Auto on `compliance` block |

## Used by

- `compliance` — gating call before any Dubai-side artifact ships
- `agency-liaison` — chase + record permit status
- `marketing-manager` — campaign-window planning
- `data-quality-steward` — audit of in-flight artifacts
- `creative` + `brand-design` — informational (avoid producing artifacts that won't get permit-gated in time)

## Data flow

```
Dubai-side campaign brief is approved by marketing-manager
    ↓
agency-liaison initiates Trakheesi permit application via the developer's regulatory-operations team
    ↓
agency-liaison records "applied" status in clients/<client>/regulatory/trakheesi/permits/<application_id>.md
    ↓
DLD reviews + issues permit number (typically days; verify current SLA via regulatory-research-specialist)
    ↓
agency-liaison records "issued" status with permit number, validity dates, scope of artifacts covered
    ↓
creative produces artifact with permit number displayed per `.claude/skills/regulatory-disclosure-language.md` Template 4
    ↓
compliance verifies permit number matches a current valid permit on file before ship-clearance
    ↓ (if mismatch or absent: BLOCK)
artifact ships
    ↓
on permit expiry: agency-liaison initiates renewal; in-flight artifacts must transition to renewed permit number or be pulled
```

## What we read regularly

- Active permits (not expired)
- Pending applications (with submission date and expected issuance window)
- Artifacts in flight that reference permit numbers (cross-reference for currency)

## What we write (internal records only — no Trakheesi API calls)

- `clients/<client>/regulatory/trakheesi/permits/<permit_number>.md`:
  - permit number
  - issuance date + validity window
  - scope of artifacts covered (campaign, asset types, channels)
  - linked artifact references
  - renewal calendar entry
- `clients/<client>/regulatory/trakheesi/applications/<application_id>.md`:
  - application date
  - applied-for scope
  - expected issuance window
  - status updates (submitted, under-review, queries-from-DLD, issued, declined)

## What we do NOT do

- We do not call Trakheesi APIs directly (no public developer portal at the time of writing).
- We do not negotiate with DLD on the developer's behalf — the developer's regulatory-operations team owns that relationship.
- We do not approve artifacts as permit-cleared without a current valid permit number on file.
- We do not extend artifact ship windows past permit expiry.

## Per-client config

`clients/<client>/integrations/trakheesi/config.md`:

```yaml
regulatory_operations_contact:   # named human at the developer
  name:
  email:
  whatsapp:
typical_application_sla_days:    # historical median, for planning
default_artifact_scope:          # per campaign type
  off-plan-launch:
    artifacts: [landing-page, OOH, paid-social, paid-search, brochure, broker-pack]
    permit_per_artifact: false   # one permit per campaign typical
    permit_per_campaign: true
  brand:
    artifacts: [...]
permit_renewal_buffer_days: 30   # initiate renewal this many days before expiry
```

## Failure modes to handle

- **Permit takes longer than planned** — `agency-liaison` updates `marketing-manager` with revised go-live window; campaign brief moves to `awaiting-permit` status; no artifacts ship.
- **Permit issued but with restricted scope** — surfaces a mismatch to `creative` + `brand-design` (some planned artifacts now out-of-scope); options: re-scope artifacts, apply for additional permit, or pull the artifacts.
- **Permit expires mid-campaign** — `agency-liaison` should have initiated renewal per `permit_renewal_buffer_days`; if not, immediate ship-pause until renewal or pull-down.
- **DLD declines or queries the application** — `agency-liaison` + `compliance` + (if a substantive question) `regulatory-research-specialist` collaborate on response.
- **Artifact spotted in-market without a displayed permit number** — `compliance` immediate alert to `chief-commercial-officer` and human regulatory-operations; pull-down within 24h is the typical remediation.

## Status

Spec live. Operational from Phase 4C onward. Direct DLD API integration deferred until DLD publishes a developer portal; until then, this is a record-keeping + verification + workflow-coordination spec.
