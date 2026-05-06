---
name: aml-kyc-uae-real-estate
description: Operational AML/KYC framework for UAE real-estate transactions under DNFBP rules. Provides the workflow shape; current rule details (specific list-update cadences, current EDD thresholds, current STR triggers) route to regulatory-research-specialist for confirmation. Used by aml-kyc-compliance-specialist as its operational SOP.
scope: UAE Federal AML/CFT for real-estate (DNFBP), screening + EDD + STR workflow
maintained_by: regulatory-research-specialist + aml-kyc-compliance-specialist (writes via knowledge agent)
---

# AML/KYC framework for UAE real-estate (DNFBP)

> **This is the operational skeleton.** Specific current thresholds, list-update cadences, and EDD triggers are confirmed per request via `regulatory-research-specialist` against the current UAE Federal Decree-Law 20/2018 + Cabinet Decisions 10/2019 and 24/2022 + UAE FIU guidance. Do not quote a number from this file as today's truth without that confirmation.

## DNFBP perimeter — who's bound

Under UAE Federal AML/CFT, **Designated Non-Financial Businesses and Professions (DNFBPs)** include:
- Real-estate developers
- Real-estate brokers
- Real-estate agents
- Auditors, lawyers, notaries (trust + corporate services)
- Dealers in precious metals + stones
- Trust + company service providers

Aldar Properties (developer) and any external broker firm in `clients/<client>/brokers/registry.md` is bound. The wealth-channel intermediaries (private banks) are bound under the parallel Financial Institutions regime — they screen on their side too, but our DNFBP obligations don't transfer to them.

## Counterparty risk-rating framework

| Risk | Profile | EDD required |
|---|---|---|
| **Low** | UAE-resident, EIDA-verified, clear source-of-funds (employment income / disclosed business), no PEP, no sanctions hit, low-risk corridor | No |
| **Medium** | Cross-border but well-documented, single jurisdiction, source-of-funds traceable, no PEP, no hit | No, standard due diligence sufficient |
| **High** | Any of: PEP designation (domestic / foreign / international-organization), high-risk-jurisdiction (FATF grey-list at time of transaction), partial source-of-funds documentation, complex entity layering, third-party payment proposed, single-cash-bulk transaction | **Yes — EDD per regulation** |

## Screening checklist — on counterparty entry

For every counterparty entering any registry (broker, wealth, vvip, direct-sales pipeline):

1. **Identity verification (KYC).** EIDA for UAE-resident; passport + secondary ID for non-resident. Provider: Sumsub or equivalent (see `integrations/sumsub/spec.md`).
2. **Beneficial ownership.** If a corporate / trust / FO entity, identify ultimate beneficial owner (UBO) at ≥ 25% (default; verify current threshold). Screen the UBO too.
3. **PEP screen.** Domestic + foreign + international-organization PEP definition + immediate family + close associates.
4. **Sanctions cross-check** against the five primary regimes:
   - UN Security Council
   - US OFAC SDN list
   - UK HMT consolidated list
   - EU consolidated list
   - DFAT consolidated list
   Plus GCC where applicable.
5. **Source-of-funds documentation.** For HNW: bank reference letter, audited financials, salary / income statements, asset disclosures. For UHNW: full source-of-wealth narrative + corroborating documentation.
6. **Risk-rate.** Per the framework above.
7. **Verdict.** `cleared` / `hold-pending-edd` / `declined`.

## EDD (Enhanced Due Diligence) — when triggered

EDD applies whenever:
- Counterparty is a PEP (any class)
- Counterparty resides in or transacts through a high-risk jurisdiction (per current FATF grey list — verify cadence-specific via `regulatory-research-specialist`)
- Source-of-funds documentation is partial or third-party
- Transaction structure is unusual (third-party payments, complex entity layering, unexplained cash)
- Counterparty's risk profile changes mid-relationship

EDD measures (current framework — verify current detail per request):
- Senior management approval before commercial conversation
- Additional source-of-funds + source-of-wealth corroboration
- Periodic enhanced re-screening (more frequent than annual)
- Closer monitoring of transaction patterns

## STR (Suspicious Transaction Report) triggers

Under UAE FIU rules, suspicion of money-laundering / terror-financing requires an STR (filed via the goAML platform). Common triggers in real-estate:

- Bulk cash payments (especially against a structured threshold)
- Third-party payments inconsistent with disclosed source-of-funds
- Buyer attempts to conceal beneficial ownership
- Buyer reluctance to provide ID or source-of-funds documentation
- Pattern of buy-then-rapidly-resell (potential layering)
- Sanctions-list adjacency surfaced post-clearance

Workflow: drafting agent (`aml-kyc-compliance-specialist`) → `legal-liaison` review → human FIU liaison submission. **Do not signal the suspicion to the counterparty** (tipping-off offense).

## Re-screening cadence

| Category | Default cadence | Notes |
|---|---|---|
| Active counterparty (low-risk) | Annual | Calendar-driven |
| Active counterparty (medium-risk) | Semi-annual | Calendar + on material change |
| Active counterparty (high-risk / PEP / EDD) | Quarterly | Calendar + event-driven |
| Sanctions watchlists (provider-side) | Daily / continuous | Per provider integration |
| Cultivating counterparty (not yet active) | At entry, then on activation | |
| Dormant relationship | Annual | Or on reactivation event |

## KYC-provider integration

Sumsub (or equivalent) integration spec at `integrations/sumsub/spec.md`. Credentials live in Vercel env vars or vault (per `INTEGRATIONS.md`). Audit IDs reference the provider's evidence; **do not store source documents in the repo** — they live in the provider's audit log.

## Golden Visa pathway (operational note)

When a buyer pursues a property-purchase Golden Visa:
- Verify current threshold (AED 2M typical at time of writing — confirm via `regulatory-research-specialist`)
- Property meets eligibility conditions (verify per request)
- Source-of-funds documentation is the same DNFBP screening, plus additional residency-application requirements
- Coordinate with legal / immigration consultant for the visa-application leg — that's outside DNFBP scope

## Cross-border corridor specifics

- **Russia/CIS:** Comprehensive sanctions surface; pre-commercial-conversation screening is mandatory. RM-05 in the meridian / aldar worked example is the corridor specialist with this note.
- **Iran-adjacent / Syria-adjacent / DPRK-adjacent / Venezuela / Cuba:** OFAC primary-sanctions surface; check whether secondary-sanctions exposure exists for the developer / broker as a non-US entity.
- **Pakistan / Nigeria:** Heightened FATF scrutiny segment; EDD by default for high-value purchases.
- **US persons / FATCA:** Different reporting regime — coordinate with US-counsel-savvy `legal-liaison`.

## Audit trail expectations

Every active counterparty has, in `clients/<client>/wealth-channels/screening/<id>/` or `clients/<client>/vvip-channel/screening/<id>/` or equivalent:

- Verdict + date
- Screening provider audit ID (not the documents themselves)
- Re-screening calendar entry
- Material-change log
- STR filings (when applicable, sanitized)

This file structure is replicated across the registries. The `data-quality-steward` agent can audit completeness.

## What this skill does NOT cover

- Tax / FATCA / CRS reporting — that's a distinct discipline (route to tax counsel)
- AML for cryptocurrency-funded transactions — separate guidance
- Legal advice on specific cases — `legal-liaison` + external counsel
- Marketing-claim review — `compliance`
