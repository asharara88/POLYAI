---
name: off-plan-launch-mechanics
description: Operational mechanics of an off-plan launch in the UAE — Trustee Account opening (escrow), RERA project registration (Dubai) / ADREC project registration (Abu Dhabi), Oqood off-plan registration system enablement (Dubai), Trakheesi advertising-permit application (Dubai) / ADREC advertising-permit equivalent (Abu Dhabi), reservation form mechanics, payment-plan structuring, and the regulatory cadence layered over the marketing-clock cadence. Consolidates what's currently scattered across compliance, marketing-manager, agency-liaison, inventory-manager, and regulatory-research-specialist. Used by every commercial pod during launch; framework reference. Specific current process steps and form numbers route to regulatory-research-specialist per use.
scope: UAE off-plan launch — Dubai (DLD/RERA/Trakheesi/Oqood) + Abu Dhabi (ADREC) operational mechanics
maintained_by: regulatory-research-specialist + marketing-manager (writes via knowledge agent)
---

# Off-plan launch operational mechanics

> **Read this first.** Every milestone, form number, and SLA below is *framework reference*. Specific current steps and forms verified per use via `regulatory-research-specialist` because DLD / RERA / ADREC update circulars frequently. This skill captures the *shape* of the regulatory pre-launch sequence; it does not substitute for current-rule confirmation.

## The two clocks

A UAE off-plan launch runs on two clocks simultaneously:

- **Marketing clock** (T-16 to T-12 to T-10 to T0) — owned by `marketing-manager` per `verticals/real-estate/sub-verticals/developer/campaign-workflow.md`
- **Regulatory clock** (T-90 to T-60 to T-30 to T0) — owned by the developer's regulatory-operations team with `regulatory-research-specialist` providing currency

The two clocks must align. Mismatches (creative ready but Trakheesi permit not yet issued; permit issued but creative not localized; marketing brief approved but escrow account not yet open) are the most common launch-delay cause.

## Regulatory milestone sequence (Dubai)

| Reg-clock | Milestone | Owner | Without it |
|---|---|---|---|
| **T-120 to T-90** | **Project escrow / Trustee Account opened** under Dubai Law 8/2007 | Developer's regulatory-operations team + Trustee Bank (typical Trustees: ENBD, Mashreq, ADCB, FAB, RAKBANK — verify per project) | No public-facing payment-plan reference can ship; full launch blocks |
| **T-90 to T-60** | **RERA project registration** | Developer's regulatory-operations team via Dubai Land Department | No public-facing project reference can ship; project not lawful to market |
| **T-60** | **Oqood off-plan registration system enabled** for the project | Developer's regulatory-operations team + DLD | Reservations cannot be booked into the regulator-recognized system |
| **T-45 to T-30** | **Trakheesi advertising-permit application submitted** | `agency-liaison` (chase) + developer's regulatory-operations team | No Dubai-side ad can lawfully run; permit number must display on every ad per `.claude/skills/regulatory-disclosure-language.md` Template 4 |
| **T-30 to T-21** | **Trakheesi permit issued** (typical SLA — verify current via `regulatory-research-specialist`) | DLD/RERA | Per above |
| **T-21 to T-7** | **Sales gallery operational** with all required regulator-display materials (escrow reference, RERA registration, Trakheesi permit visible) | `inventory-manager` + sales-gallery operational team | Cannot open to public |
| **T-7** | **Permit-display verification** across all in-flight artifacts | `compliance` + `data-quality-steward` audit | Risk of pull-down post-launch if any artifact in-market without permit |
| **T0** | **Launch day** — reservations begin via Oqood-registered process; paid media live | All commercial pods | — |
| **T+30** | **First sustain-phase compliance audit** | `compliance` + `data-quality-steward` | Drift accumulates and surfaces as a regulator inquiry weeks later |
| **T+60 to T+90** | **Permit-renewal initiation** if applicable per `integrations/trakheesi/spec.md` | `agency-liaison` + developer's regulatory-operations team | Mid-flight permit expiry forces pull-down |

## Regulatory milestone sequence (Abu Dhabi)

Mirror sequence, owned by ADREC. Specific milestones and form numbers verify per use via `regulatory-research-specialist`:

- ADREC project registration
- Trustee Account / escrow opening per Abu Dhabi Law No. 3 of 2015
- ADREC advertising-permit equivalent
- ADREC-side reservation-form prerequisites
- Sales-gallery operational + ADREC-display materials

## Reservation form mechanics

The reservation form is the legal-binding-or-not-binding-or-grey instrument that converts a verbal interest into a recorded reservation in the regulator-recognized system. Mechanics:

| Step | What | Owner |
|---|---|---|
| 1. Buyer identification + KYC | Per `.claude/skills/aml-kyc-uae-real-estate.md` | `aml-kyc-compliance-specialist` |
| 2. Unit selection from current allocation grid | Per allocation policy in `clients/<client>/sales/allocation-rules.md` | `account-executive` + `inventory-manager` |
| 3. Payment plan selection | Per published grid or per `.claude/skills/payment-plan-structures.md` if bespoke | `account-executive`; bespoke routes to `deal-desk-analyst` |
| 4. Reservation deposit collected | To Trustee Account | Sales-gallery operational team + `marketing-financial-manager` |
| 5. Reservation form signed | With required disclosures per `.claude/skills/regulatory-disclosure-language.md` | `account-executive` + buyer |
| 6. Oqood registration (Dubai) / ADREC equivalent (Abu Dhabi) | Within regulator-mandated window post-reservation | Developer's regulatory-operations team |
| 7. SPA execution | Within regulator-mandated window post-Oqood | `account-executive` + `legal-liaison` (where redline) |
| 8. Stage advance to `closed-won` | Per `integrations/salesforce/actions/stage-advance.md` preconditions | `account-executive` (proposes) + approver per `approval_gates` |

## Trakheesi permit lifecycle

Detailed in `integrations/trakheesi/spec.md`. Key points:

- Per-campaign typical (one permit per campaign; specific high-impact assets may require their own)
- Per-flight where ad creative substantially changes
- Permit number displayed on every public-facing artifact
- Permit-renewal initiation per `permit_renewal_buffer_days` in per-client config
- ADREC-equivalent regime in Abu Dhabi (current process verified per request)

## Disclosure currency

At every step, `compliance` confirms the artifact carries the right disclosures per `.claude/skills/regulatory-disclosure-language.md`:

- **Off-plan disclosure** — Template 1
- **Financial-promotion** (any yield / appreciation / ROI claim) — Template 2; forbidden phrasing block
- **Payment-plan + escrow** — Template 3
- **Permit / registration display** — Template 4 (Trakheesi or ADREC equivalent)
- **Golden Visa eligibility** (where referenced) — Template 5
- **Image / rendering disclaimer** — Template 6
- **Forward-looking statement** (where construction timing referenced) — Template 7

Arabic substantive-equivalence per `localization` workflow; double-loop through `compliance` after AR translation.

## Channel + creative pre-clearance gate

No customer-facing artifact ships from `creative` / `brand-design` / `agency-liaison` without:

1. Permit number on file (Trakheesi for Dubai; ADREC equivalent for Abu Dhabi)
2. Project registration number captured
3. Trustee Account reference captured
4. Disclosure-language pass per `regulatory-disclosure-language.md` templates
5. Forbidden-phrasing block clear
6. VVIP no-mention list cross-reference clear (per `.claude/skills/vvip-protocol-uae.md`)
7. Compliance verdict: pass / pass-with-changes / block

## Common launch-delay causes (catalog)

| Cause | Frequency | Mitigation |
|---|---|---|
| Trakheesi permit issuance slower than planned | Common | Submit T-45; have buffer creative-change cycle T-30 to T-7 |
| RERA project registration paperwork incomplete | Occasional | Regulatory-operations early start at T-120 |
| Trustee Bank onboarding slower than planned | Occasional | T-120 initiation; have backup Trustee per relationship |
| Disclosure language drift post-creative-approval | Common | Re-loop `compliance` after every creative round |
| Arabic substantive-equivalence drift | Common | `localization` not bypassed; double-loop `compliance` |
| Inventory grid shifts post-creative (price changes, allocation re-cuts) | Common | `inventory-manager` gates artifact at T-7 |
| AML/KYC capacity insufficient at launch volume | Common | T-14 capacity check per `runbooks/international-roadshow.md` analog |
| Sales-gallery not-yet-operational at T0 | Occasional | T-21 readiness review |
| Trakheesi-permit-displayed-incorrectly on a single artifact | Common | T-7 audit by `data-quality-steward` |
| Cross-emirate ad runs with wrong permit (Dubai-permit on AD-side ad or vice versa) | Occasional | Per-channel permit assignment in campaign brief |

## What this skill does NOT cover

- Construction / handover mechanics — see `.claude/skills/owner-community-governance.md` (post-handover) + `runbooks/handover-snagging.md`
- Secondary-market mechanics — see `runbooks/resale-with-noc.md` + `secondary-market-specialist` agent
- VVIP-launch overlay — see `.claude/skills/vvip-protocol-uae.md` + `runbooks/press-sensitive-uhnw-transaction.md`
- Specific marketing campaign design — see `verticals/real-estate/sub-verticals/developer/campaign-workflow.md` + per-campaign brief
- Brand / creative direction — `creative` + `brand-design` agents
