---
name: regulatory-disclosure-language
description: Approved disclosure templates for UAE real-estate marketing artifacts. Used by creative, brand-design, agency-liaison, compliance, and content-pr-specialist when an artifact needs a regulator-required disclosure, a financial-promotion footer, or a "no guaranteed return" treatment. All templates are framework — current per-regulator approved wording route through regulatory-research-specialist for confirmation per use.
scope: UAE real-estate (Dubai DLD/RERA + Abu Dhabi ADREC) + financial-promotion language + escrow / payment-plan disclosures + Golden Visa / yield language
maintained_by: regulatory-research-specialist + compliance (writes via knowledge agent)
---

# Regulatory disclosure language — UAE real-estate

> **Read this first.** Every template here is a *framework* — the structural shape of an approved disclosure. **Specific wording approved by the current regulator (RERA Trakheesi-approved language for Dubai ads, ADREC equivalent for Abu Dhabi) must be confirmed per use via `regulatory-research-specialist`** because regulators update their required wording without notice. Using a template from this file directly without verification risks regulatory action and reputational exposure.

## Categories of disclosure

1. **Off-plan / pre-construction disclosure** — the project is not yet built; specifications and delivery are subject to change
2. **Financial-promotion disclaimer** — any yield, ROI, capital-appreciation, or rental-income claim
3. **Payment-plan disclosure** — the structure, the escrow protection, the regulator-protected nature of buyer funds
4. **Permit / registration display** — the Trakheesi permit (Dubai), the ADREC equivalent (Abu Dhabi), the RERA project registration
5. **Golden Visa eligibility** — when the property purchase qualifies for a Golden Visa; the applicant pathway
6. **Image / rendering disclaimer** — that renderings are artist's impressions, not guarantees of final delivery
7. **Forward-looking / projection language** — when discussing future appreciation or rental projections

## Template 1 — Off-plan disclosure

**Purpose:** Required on every off-plan customer-facing artifact (landing page, brochure, ad, microsite, broker pack).

**Framework wording (verify current with `regulatory-research-specialist`):**

> This project is sold off-plan. Construction completion and handover are scheduled for [DATE], subject to construction progress and regulatory approvals. Specifications, finishes, and floor plans are indicative and may be modified without notice. Buyer funds are held in escrow under [Dubai Law 8/2007 / Abu Dhabi Law No. 3 of 2015 — verify current applicable law per project location]. Project registered with [RERA project registration number — Dubai / ADREC equivalent — Abu Dhabi].

**Placement:** Above-the-fold or immediately adjacent to any unit-specific or pricing reference. Must be legible (no microcopy, no contrast-trick).

**Frequency:** Every artifact — not "in the brochure once."

## Template 2 — Financial-promotion disclaimer (yield / appreciation / ROI)

**Purpose:** Required on any artifact making a yield, ROI, rental-income, or capital-appreciation claim.

**Framework wording:**

> Projected yield / appreciation figures are based on [METHODOLOGY — comparables / historic performance / third-party study]. Past performance is not a reliable indicator of future results. Returns are not guaranteed. This is not investment advice; consult an independent financial advisor licensed in your jurisdiction.

**Forbidden phrasing — do not use under any circumstance:**
- "Guaranteed yield"
- "Guaranteed appreciation"
- "Guaranteed return"
- "Risk-free"
- "Best ROI in [market]" (superlative without substantiation)

**When in doubt — drop the number.** A defensible "AED X service charge per sqft per annum, capped 5 years post-handover" beats a defensible-sounding-but-prosecutable "5–7% projected yield" in headline copy. Reserve yield projections for the investor pack with full disclosure footers, not the hero landing page.

## Template 3 — Payment-plan disclosure

**Framework wording:**

> Payment plan: [STRUCTURE, e.g. 60% during construction / 40% on handover]. Buyer payments are held in an escrow account under [Dubai Law 8/2007 / Abu Dhabi Law No. 3 of 2015 — applicable]. Trustee Account: [TRUSTEE BANK NAME], escrow account number [NUMBER]. Failure to complete construction triggers buyer-protection provisions per the applicable escrow law.

**Placement:** Must be visible before form submission on any landing page that references a payment plan. Not behind a click.

## Template 4 — Permit / registration display

### Dubai (RERA / DLD)

**Framework wording:**

> RERA Permit: [TRAKHEESI PERMIT NUMBER]. Project Registration: [RERA project number]. Developer: [DEVELOPER NAME, RERA registration number].

**Where:** On every Dubai-side public-facing ad — paid digital, OOH, print, broker collateral. The Trakheesi permit number is the gating requirement; without it the ad cannot lawfully run in Dubai.

### Abu Dhabi (ADREC)

**Framework wording (verify current ADREC requirements per request):**

> Project registered with ADREC. Project registration number: [NUMBER]. Developer: [DEVELOPER NAME].

**Where:** Per ADREC current rules — verify with `regulatory-research-specialist` for the current Trakheesi-equivalent advertising-permit regime.

## Template 5 — Golden Visa eligibility

**Framework wording:**

> Property purchase of AED 2,000,000 or above may qualify the buyer for a UAE Golden Visa under current Federal regulations. Eligibility is subject to the buyer's application and conditions including [CURRENT CONDITIONS — verify with regulatory-research-specialist]. This is not a guarantee of visa issuance; consult an authorized immigration consultant.

**Forbidden:** Marketing copy that implies Golden Visa is guaranteed by the purchase. Visa issuance is at the UAE government's discretion.

## Template 6 — Image / rendering disclaimer

**Framework wording:**

> Images, renderings, and floor plans are artist's impressions intended for illustrative purposes. Final delivery may vary. Furniture and styling shown are not included in the purchase unless explicitly stated.

**Placement:** On every artifact featuring renderings or stylized photography. Footer-acceptable; needs to be legible.

## Template 7 — Forward-looking / projection language

**Framework wording (footer):**

> Forward-looking statements regarding project completion timelines, market conditions, and projected returns are based on current information and reasonable assumptions. Actual results may differ materially. The developer makes no representation as to future market conditions.

**Use:** Investor packs, sustain-phase performance updates to existing owners, board / institutional materials.

## Cross-language considerations

- **Arabic translations** must be substantively equivalent — not paraphrased. Disclosure-language drift between EN and AR is a material risk. Loop `localization` for the AR translation, then re-route through `compliance` for substantive-equivalence check.
- **Diaspora languages** (Hindi / Urdu / Russian) for diaspora corridors — same standard.

## Review path for any artifact carrying these disclosures

1. `creative` (or `agency-liaison` for agency-supplied) drafts the artifact with the framework wording.
2. `compliance` reviews — does the artifact carry the right disclosures for its category + jurisdiction?
3. `regulatory-research-specialist` confirms the current regulator-approved wording for the specific use.
4. `localization` produces non-default-language variants (substantive equivalence).
5. `compliance` re-reviews translations.
6. `review` final QA against this skill + brand-voice + brief.
7. Human sign-off (CMO + legal where required).
8. Ship.

## What this skill does NOT cover

- Specific Trakheesi permit-application mechanics — see `runbooks/trakheesi-permit.md` (when added) or coordinate via `agency-liaison` + `compliance`
- ADREC-specific permit mechanics for Abu Dhabi-side — same
- Cross-jurisdiction press-release wording (UK FCA, US SEC framing) — route to `regulatory-research-specialist` + `legal-liaison`
- Specific commission-disclosure wording for broker channel — see `.claude/skills/broker-operations.md` (when added)
