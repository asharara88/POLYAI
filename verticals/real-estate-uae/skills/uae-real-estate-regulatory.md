---
name: uae-real-estate-regulatory
description: Citation-bearing reference for UAE real-estate regulatory framework. Used by compliance, aml-kyc-compliance-specialist, marketing-manager, and any agent needing to know the rule of the day. Citations are framework-level (regulator + general rule scope); current circular numbers and clause-level details route to regulatory-research-specialist for confirmation per request.
scope: UAE federal + Dubai (DLD/RERA) + Abu Dhabi (ADREC, ADGM) + sanctions / PEP regimes affecting buyers
maintained_by: regulatory-research-specialist (writes via knowledge agent)
---

# UAE real-estate regulatory framework

> **Read this first.** This skill captures the *framework* — what regulators exist, what they govern, how the layers interact. **Specific circular numbers, current LTV percentages, current Trakheesi forms, and effective-date language route to `regulatory-research-specialist` for per-request verification.** Do not assume a specific number from this file is current. If a downstream agent is about to ship a customer-facing artifact, that agent must confirm the specific rule cited here is still in force *as of today*.

## Federal UAE

| Regulator | Scope | Reference (framework) | Re-verify cadence |
|---|---|---|---|
| Federal Tax Authority (FTA) | VAT (5% standard), corporate tax (9% > AED 375k profit), Real Estate VAT treatment | tax.gov.ae | Annual |
| Central Bank of the UAE (CBUAE) | Mortgage Regulation governing LTV caps for residents and non-residents (loan-to-value ratios differ by buyer category, property value, primary vs. additional property) | centralbank.ae · CBUAE Mortgage Regulation 31/2013 + subsequent amendments | Annual + on regulatory amendment |
| UAE Federal AML/CFT | Federal Decree-Law 20/2018 + Cabinet Decision 10/2019 (executive regulations) + Cabinet Decision 24/2022. Real-estate developers + brokers are DNFBP under these rules. | uaefiu.gov.ae · mof.gov.ae | Quarterly + on FATF cycle |
| UAE Personal Data Protection Law (PDPL) | Federal Decree-Law 45/2021. Applies to processing of personal data including buyer records, marketing-list data, CRM contacts. | uae-pdpl reference materials | Annual + on regulatory guidance |
| Ministry of Foreign Affairs (MOFA) | Sanctions list management (UAE alignment with UN, plus UAE-specific designations) | mofaic.gov.ae | Weekly+ |
| UAE Financial Intelligence Unit (UAE FIU) | STR submission portal + DNFBP reporting | goAML platform | Per event |

## Dubai (Emirate)

| Regulator | Scope | Reference | Notes |
|---|---|---|---|
| Dubai Land Department (DLD) | All Dubai property transactions: ownership registration, title deed, Trustee Account oversight, fee schedules | dubailand.gov.ae | Primary Dubai authority |
| Real Estate Regulatory Agency (RERA) — under DLD | Developer + broker licensing, project escrow, off-plan registration (Oqood), advertising approvals (Trakheesi), broker code of conduct, dispute resolution (Rental Dispute Centre is parallel) | RERA bylaws + circulars via dubailand.gov.ae | Issues circulars frequently — re-verify any specific rule per request |
| Trakheesi | DLD/RERA's permit system. **Every public-facing real-estate ad in Dubai requires a Trakheesi permit.** Per-ad / per-flight permitting. Display the permit number on the ad. | trakheesi.dubailand.gov.ae | Per-campaign |
| Oqood | Off-plan property registration system. Reservations and SPAs for off-plan units register here. | dubailand.gov.ae/oqood | Per-transaction |
| Dubai Law 8/2007 | Escrow accounts for off-plan projects | (foundational law) | Foundational — read for context |
| Dubai Law 13/2008 | Interim real-estate registry (off-plan title equivalents) | (foundational) | Foundational |
| Dubai Law 27/2007 | Owners' associations + jointly-owned property | (foundational) | Foundational for handover-phase governance |

## Abu Dhabi (Emirate)

| Regulator | Scope | Reference | Notes |
|---|---|---|---|
| Abu Dhabi Real Estate Centre (ADREC) | The successor authority for Abu Dhabi real-estate regulation; absorbed real-estate functions from the former Department of Municipalities & Transport (DMT) | tamm.abudhabi (real-estate services) | Primary AD authority — re-verify scope and current circular numbers per request |
| Department of Municipalities and Transport (DMT) | Historical regulator for AD real-estate; some functions remain with DMT alongside ADREC | dmt.gov.ae | Verify current scope per request |
| Abu Dhabi Law No. 3 of 2015 | Real estate law for Abu Dhabi — governs escrow accounts, off-plan sales, developer obligations | (foundational law) | Foundational for AD-side projects |
| ADGM (Abu Dhabi Global Market) Financial Services Regulatory Authority (ADGM-FSRA) | Financial-services regulation within the ADGM free zone — applies to ADGM-licensed wealth managers, family offices, introducers | adgm.com | Annual + on FSRA rulebook update |

## DIFC (Dubai International Financial Centre)

| Regulator | Scope | Reference | Notes |
|---|---|---|---|
| Dubai Financial Services Authority (DFSA) | Financial-services regulation within DIFC — applies to DIFC-licensed wealth managers, FOs, introducers | difc.ae · dfsa.ae | Annual + on rulebook update |
| DIFC Data Protection Law 5/2020 | DIFC-specific data-protection regime (parallel to PDPL for DIFC entities) | difc.ae | Annual |

## Sanctions / PEP regimes (cross-border buyers)

| Regime | Authority | Cadence |
|---|---|---|
| UN Security Council sanctions | un.org/securitycouncil/sanctions | Weekly+ |
| US Office of Foreign Assets Control (OFAC) — SDN list | treasury.gov/ofac | Weekly+ (changes daily, batch-update typical) |
| UK HM Treasury (HMT) Office of Financial Sanctions Implementation (OFSI) — consolidated list | gov.uk/government/publications/financial-sanctions-consolidated-list-of-targets | Weekly+ |
| EU Consolidated List | finance.ec.europa.eu/eu-sanctions | Weekly+ |
| Australia DFAT (Department of Foreign Affairs and Trade) | dfat.gov.au/international-relations/security/sanctions | Weekly+ |
| GCC sanctions (where applicable) | per-state authority | Per-event |

PEP definition: per FATF + UAE Federal AML/CFT regulations, includes domestic PEPs, foreign PEPs, international-organization PEPs, plus their immediate family + close associates. EDD required for any PEP relationship.

## Foreign-buyer corridors (jurisdictional notes)

- **UK buyers:** FCA introducer-fee disclosure rules apply to UK-side IFAs; UK AML regs treat UAE property as a high-value-asset category
- **India buyers (NRI):** RBI Liberalised Remittance Scheme caps + property-purchase rules apply to outbound capital
- **KSA buyers:** SAMA capital-flow regulations; cross-border property purchase reporting
- **Russia/CIS buyers:** comprehensive sanctions surface (UN/OFAC/UK/EU/DFAT); pre-commercial-conversation screening mandatory
- **Egypt buyers:** Central Bank of Egypt outbound-capital restrictions vary; verify per transaction
- **Pakistan buyers:** SBP capital-flow rules; declared-asset implications
- **Nigeria buyers:** CBN regulations + heightened AML scrutiny in some segments
- **US buyers:** SEC private-placement rules where investment-product framing is used; FATCA reporting for US persons; FinCEN beneficial-ownership rules for any US-entity layer

## Golden Visa (UAE Federal)

Threshold (current): AED 2,000,000 property purchase (single property or aggregate; conditions apply on financing share, property type). **Re-verify the current threshold and conditions with `regulatory-research-specialist` before any client-facing commitment.**

## How to use this skill

- **Don't quote a specific number from this file as authoritative without re-verification.** This is framework, not current truth.
- **Route to `regulatory-research-specialist`** for: current LTV percentages, current Trakheesi form numbers, current ADGM-FSRA rulebook clauses, current sanctions-list updates, current Golden Visa thresholds, current FATF UAE status.
- **Route to `aml-kyc-compliance-specialist`** for: operational screening (run the check, return verdict).
- **Route to `compliance`** for: claim review against the rule.
- **Route to `legal-liaison`** for: legal opinion on interpretation.

## Update protocol

This skill updates only via `knowledge` agent. `regulatory-research-specialist` proposes additions (new authority, new framework rule); `knowledge` curates and merges with `chief-commercial-officer` approval.
