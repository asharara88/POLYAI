---
name: broker-operations
description: Operational mechanics for the UAE real-estate broker channel — RERA broker-license verification (Dubai) + ADREC equivalent (Abu Dhabi), Form-F transfer mechanics, commission-grid mechanics, broker-firm onboarding documentation, dispute-escalation steps. Used by broker-enablement (primary), data-quality-steward (attribution accuracy), secondary-market-specialist (Form-F coordination), and legal-liaison (broker-agreement framework). Framework only — current per-jurisdiction requirements route to regulatory-research-specialist for confirmation per use.
scope: UAE real-estate broker channel mechanics
maintained_by: broker-enablement + regulatory-research-specialist (writes via knowledge agent)
---

# UAE real-estate broker operations

> **Read this first.** Specific current registration thresholds, current commission-disclosure rules, current Form-F process steps are confirmed per request via `regulatory-research-specialist`. Brokerage regulation in Dubai (RERA) and Abu Dhabi (ADREC) update circulars frequently. Do not quote a specific number from this file as today's truth without verification.

## Broker-license verification

### Dubai (RERA)

Every individual broker operating in Dubai must hold a current RERA broker registration card. Every brokerage firm must hold a valid RERA brokerage license. Both expire and renew on cycle.

**Verification steps (framework — verify current per use):**
1. Confirm the brokerage firm holds an active RERA license (firm-level)
2. Confirm the named individual broker holds a current registration card with the firm (individual-level)
3. Confirm the registration card has not expired
4. Confirm the broker is listed under the firm's roster on the RERA / DLD-side authoritative source
5. Cross-reference the named individual against the Trakheesi system if they will personally be associated with permit-display (typically firm-level rather than individual)

**Where to verify:** the Dubai REST app + DLD's broker-search facility are the typical operational tools at the time of writing; verify current via `regulatory-research-specialist`.

### Abu Dhabi (ADREC)

Equivalent regime under ADREC. Verify current verification process per use via `regulatory-research-specialist` — ADREC absorbed real-estate-regulation functions from the former DMT and the operational systems are evolving.

## Broker-firm onboarding documentation (developer-side)

When `broker-enablement` signs a new firm or reactivates a dormant one, the master file at `clients/<client>/brokers/<firm-slug>/onboarding/` typically contains:

- **Brokerage license evidence** — RERA license (Dubai) or ADREC equivalent (Abu Dhabi) — current and verified
- **Trade license** (DED or equivalent corporate-licensing authority)
- **AML/KYC entity-level screening verdict** — per `aml-kyc-compliance-specialist` workflow; routed via Sumsub or equivalent
- **UBO identification** at the firm — corporate ownership ≥ 25% — and screened individuals
- **Master broker agreement** (signed) — per template owned by `legal-liaison`
- **Commission-grid letter** (signed) — per the per-firm tier negotiated by `broker-enablement`
- **Authorized-signatories list** — who can sign allocation requests, confirm transactions
- **Bank-account details** for commission disbursement (verified via separate channel for fraud prevention)
- **Tax registration** (TRN where applicable)
- **Authorized broker roster** — individuals who can introduce buyers under this firm; each individual screened separately under DNFBP rules at the broker-level if they are themselves DNFBPs (most are firm-employed, screened at firm)

## Form-F transfer mechanics (Dubai-side resale)

Form-F is the standard DLD form used to record a property transfer in the Dubai resale market. The broker (or the parties direct) lodge it with DLD. The mechanics of the form, the fees, and the appointment-booking process are operationally owned by `secondary-market-specialist` per `runbooks/resale-with-noc.md`.

**Form-F prerequisites (framework):**
- Developer's NOC issued (per `runbooks/resale-with-noc.md`)
- Buyer-side and seller-side broker licenses both current
- Buyer's AML/KYC `cleared` (per `aml-kyc-compliance-specialist`)
- Trustee Account release coordinated where applicable (off-plan still in escrow)
- DLD transfer-fee paid (typically 4% of property value — buyer side; verify current)
- Title deed (or Oqood for off-plan) prepared for transfer

**Form-F appointment:** booked through DLD's appointment system; both parties (or authorized broker) attend. Verify current process via `regulatory-research-specialist`.

### Abu Dhabi equivalent

ADREC's transfer process is operationally similar but distinct in form-name and appointment mechanics. Verify current per case via `regulatory-research-specialist`.

## Commission-grid mechanics

Commission rates are negotiated per-firm by `broker-enablement` based on:
- Volume tier (annual transaction count or value threshold)
- Strategic value (corridor reach, channel-development capacity)
- Performance (conversion-rate, dispute-rate, customer-experience scores)
- Exclusivity arrangements (where applicable)

**Standard commission framework (framework — actual rates per firm in their commission-grid letter):**

| Tier | Typical commission | Notes |
|---|---|---|
| Tier 1 — strategic | 3.5–5.0% of unit price | Includes strategic, exclusivity, or volume-based incentives |
| Tier 2 — established | 2.5–3.5% | Standard for active established brokers |
| Tier 3 — opportunistic | 2.0–2.5% | Occasional referrers; lower volume; standard floor |
| Wealth-channel introducer fee | 1.5–3.0% | Distinct mechanism — introducer fee for wealth-channel intermediaries (not broker commission); regulated under ADGM-FSRA / DIFC-DFSA where the intermediary is so-licensed |

**Commission disclosure:** Per UAE regulation, brokers must disclose commission arrangements to their client. Developer-side, the commission-disclosure framework is operationalized in `clients/<client>/brokers/registry.md` per firm. Current rule details verify via `regulatory-research-specialist`.

**Commission accrual:** Triggered at `closed-won` stage advance per `integrations/salesforce/actions/stage-advance.md` post-flight; coordinated with `marketing-financial-manager` for disbursement scheduling.

**Commission claw-back:** Triggered if the buyer rescinds within the cooling-off window (where applicable) or if the deal is reversed for any reason; documented in the master broker agreement.

## Attribution doctrine

The default attribution rule across direct, broker, wealth-channel, and VVIP-channel-introduced deals:

1. **First-touch wins** when sources are independent (broker A introduces; in-house lead form was never touched by buyer)
2. **In-house wins** when buyer was already in the developer's CRM at active-prospect stage before broker first-touch
3. **Wealth-channel wins** when the wealth-channel intermediary made the introduction even if a broker was later involved at transaction-mechanics level
4. **VVIP-channel wins** when introduction came via VVIP gatekeeper map even if a wealth-channel was nominally involved
5. **Time-window for first-touch** — typically 90 days; conservation of attribution requires evidence of continued engagement

**Disputes:** Routed through `data-quality-steward` (evidence chain) → `broker-enablement` (channel side) + `crm-manager` (in-house side) → `chief-commercial-officer` for ruling on novel cases. Material disputes (> AED 1M attribution value) go to `legal-liaison` for legal opinion.

## Allocation mechanics

For oversubscribed launches (where unit demand exceeds supply at launch window), allocation requests from brokers are processed through `broker-enablement` per a documented allocation policy:

- **Tier-based allocation** — Tier 1 brokers receive priority access window; Tier 2 receive standard window; Tier 3 receive remaining inventory
- **Unit-mix allocation** — high-demand unit types may be capped per firm to prevent any single firm dominating
- **Volume-based bonus allocation** — firms exceeding annual volume thresholds receive enhanced allocation in subsequent launches
- **Allocation-request audit trail** — every request, every approval, every decline is logged per `clients/<client>/brokers/allocations/<request-id>/`

This mechanism is **distinct from** routing the developer's direct-marketing leads to brokers (which generally does not happen — direct-marketing leads go to in-house RMs).

## Dispute escalation

| Dispute type | First responder | Escalation path |
|---|---|---|
| Attribution dispute (in-house vs. broker) | `data-quality-steward` (evidence) → `broker-enablement` (relationship) | `crm-manager` → `chief-commercial-officer` (if material) |
| Commission calculation dispute | `marketing-financial-manager` (math) → `broker-enablement` (relationship) | `legal-liaison` (if material) |
| Allocation dispute | `broker-enablement` (policy) | `chief-commercial-officer` (if material) |
| RERA / ADREC complaint involving broker | `legal-liaison` + `service-recovery-specialist` | Per `runbooks/complaint-rera-exposure.md` |
| Broker-side Form-F obstruction | `secondary-market-specialist` (case-side) + `broker-enablement` (relationship) | `legal-liaison` (if material) |
| Sanctions / PEP hit on broker firm or principal | `aml-kyc-compliance-specialist` per `runbooks/pep-sanctions-hit.md` | `legal-liaison` + `chief-commercial-officer` |
| License-lapse or license-revocation surfaced | `broker-enablement` (immediate suspension); `data-quality-steward` (in-flight deal audit) | `chief-commercial-officer` (if material in-flight exposure) |

## Operational documents the broker channel touches (per developer)

- `clients/<client>/brokers/registry.md` — master roster
- `clients/<client>/brokers/<firm-slug>/onboarding/` — per-firm onboarding pack
- `clients/<client>/brokers/<firm-slug>/commission-grid-letter.md` — per-firm signed terms
- `clients/<client>/brokers/<firm-slug>/screening/` — AML/KYC at entity + UBO + roster level
- `clients/<client>/brokers/allocations/<request-id>/` — per-allocation audit trail
- `clients/<client>/brokers/disputes/<dispute-id>/` — dispute case files
- `clients/<client>/brokers/performance/<period>/` — performance scorecards (volume, conversion, dispute-rate, customer-experience)

## What this skill does NOT cover

- Broker-side marketing materials (those follow the standard `creative` + `compliance` + Trakheesi flow)
- Buyer-side experience after broker introduction (that's `account-executive` once the lead is engaged)
- Tax-treatment of commissions (that's developer's tax counsel)
- Broker training content design (that's `broker-enablement` + `creative`)
