---
name: owner-community-governance
description: Post-handover governance framework for UAE residential real-estate — owners' associations under Dubai Law 27/2007 (Jointly-Owned Property), Abu Dhabi Law No. 3/2015 (real estate law) and applicable AD jointly-owned-property regulation, service-charge transparency, OAM (Owners' Association Management) operations, AGM cadence, voting rights, and the developer-side touchpoints in the years post-handover. Consolidates handover-window community lifecycle that's currently in handover-snagging runbook. Used by account-manager, vip-relationship-manager, service-recovery-specialist, events, email-lifecycle, secondary-market-specialist, and content-pr-specialist (where community-narrative). Framework only — current per-emirate jointly-owned-property regulation routes through regulatory-research-specialist per use.
scope: UAE owners' association + jointly-owned property post-handover governance
maintained_by: regulatory-research-specialist + account-manager (writes via knowledge agent)
---

# Owner-community governance framework

> **Read this first.** Specific current jointly-owned-property regulation, current OAM-licensing requirements, current service-charge formula caps, current AGM-quorum thresholds verify per request via `regulatory-research-specialist`. The two emirate frameworks (Dubai Law 27/2007 in Dubai; AD Law No. 3 of 2015 + applicable AD jointly-owned regulations in Abu Dhabi) are foundational; per-tower / per-development governing documents (the JOPD — Jointly Owned Property Declaration in Dubai; AD equivalent) layer on top.

## Foundational legal framework

### Dubai

- **Dubai Law 27/2007 — Concerning Ownership of Jointly-Owned Properties in the Emirate of Dubai** — foundational law
- **DLD / RERA bylaws + circulars** — operational interpretation; updated frequently
- **Mollak system** — DLD's centralized service-charge collection + transparency platform; operational since 2018+
- **Per-development JOPD (Jointly Owned Property Declaration)** — bespoke governing document approved by RERA pre-handover; defines unit boundaries, common areas, voting rights, service-charge formulas

### Abu Dhabi

- **Abu Dhabi Law No. 3 of 2015 — Real Estate Law** — foundational law
- **DMT / ADREC regulations + circulars** — operational interpretation
- **Per-development governing document** — equivalent to JOPD; verify current AD-side terminology and approval body per request

## Owners' association (OA) — what it is

The OA is the legal entity representing unit owners' collective interest in the common areas of a jointly-owned property. Key facts (Dubai-framework — verify AD per request):

- Formed automatically upon handover of the first unit (in some interpretations) or upon a defined trigger per JOPD
- Members = unit owners
- Board = elected representatives
- Powers = budget approval, OAM appointment, common-area decisions, special assessments
- Limits = subject to JOPD and applicable law; certain decisions require super-majority

## Service-charge framework

| Dimension | Framework |
|---|---|
| **Formula** | AED per sq ft per annum, set per JOPD; reviewed annually; subject to RERA / ADREC review for material increases |
| **Components** | Master community charges, building services, common-area maintenance, sinking fund, OAM fee, security, insurance |
| **Collection** | Via Mollak (Dubai) or AD equivalent; quarterly billing typical |
| **Transparency** | Owners entitled to itemized breakdown; AGM reviews actuals vs. budget |
| **Enforcement** | Non-payment triggers escalation per Mollak + applicable law; ultimately RERA Rental Dispute Centre or AD equivalent |
| **Sinking fund** | Long-term capital reserve for major maintenance; mandatory per most JOPD; typically 10-30% of annual charge |

## OAM (Owners' Association Management) operations

The OAM is the licensed manager appointed by the OA to operate the building day-to-day. Key facts:

- Must be RERA-licensed (Dubai) — verify current ADREC-equivalent for Abu Dhabi
- Appointed by OA vote; contract typically 1-3 years
- Responsibilities: budget proposal, service-charge collection coordination, building maintenance, vendor management, AGM coordination, owner-facing operations
- Developer-side relationship: developer is typically the initial OAM (or appoints initial) for handover-window + 1-2 years; transitions to OA-elected management

## AGM (Annual General Meeting) framework

| Aspect | Framework |
|---|---|
| **Cadence** | Annual minimum; extraordinary meetings on petition |
| **Quorum** | Per JOPD; typical 25-40% of voting units |
| **Voting** | Per JOPD; typical proportional to unit area |
| **Standing items** | Budget approval, OAM appointment / renewal, board election, audit-report review, capital projects |
| **Owner notification** | 14-30 days notice typical; per JOPD |
| **Minutes** | Recorded + circulated; submitted to RERA / ADREC per current rule |

## Developer-side post-handover touchpoint cadence

Per `runbooks/handover-snagging.md` for T-30 to T+90 immediate handover; ongoing thereafter:

| Period | Touchpoint | Owner |
|---|---|---|
| **T-30 to T+30** | Pre-handover communication, handover ceremony, snagging window setup | `account-manager` + `inventory-manager` per `runbooks/handover-snagging.md` |
| **T+30 to T+90** | Snagging resolution, owner-portal onboarding, OA setup | Same |
| **T+90 to T+365 (year 1)** | Quarterly community email updates, first AGM, building-amenity programming via `events`, owner CSAT surveys via `voc` | `account-manager` (lead) + `email-lifecycle` + `events` |
| **Year 2+** | Reduced cadence: bi-monthly community update; annual AGM; referral-program activation; resale touchpoints | `account-manager` + `email-lifecycle` |
| **Continuous** | Service-recovery as needed | `service-recovery-specialist` |

## VVIP overlay

VVIP-occupied buildings (or VVIP-occupied floors within a building) have an overlay per `.claude/skills/vvip-protocol-uae.md`:

- Restricted-access communications about the building's events / amenity programming
- AGM attendance + voting handled per principal's protocol office (often via gatekeeper proxy)
- Community-event invitations follow no-mention list discipline
- Building staff trained on protocol per `vvip-channel-enablement` guidance

## Service-charge transparency materials (developer-side)

Owners-facing materials that the developer prepares pre-handover and updates annually:

- Service-charge breakdown by line item with current-year rates
- Annual budget summary
- Audit report summary (where applicable per JOPD)
- AGM minutes archive
- Building-services SLA reference
- Common-area-rules summary
- Vendor + OAM directory
- Escalation pathway (in-house → OAM → OA board → developer escalation → regulator)

These materials live at `clients/<client>/owner-community/<project-slug>/governance-pack/` and refresh annually.

## Common owner-friction sources (catalog)

| Friction | Resolution path |
|---|---|
| Service-charge increase year-over-year > expected | AGM transparency; JOPD reference; regulator review if material; route to `service-recovery-specialist` if escalates |
| Snagging-resolution SLA breach | `runbooks/handover-snagging.md` + `service-recovery-specialist` |
| Common-area amenity change (pool reno, gym upgrade, etc.) | Capital-project AGM approval; OAM communication |
| OAM service-quality decline | OA board review; OAM contract review; in extreme cases re-procurement |
| Owner-association governance dispute (board election, budget vote) | OA board mediation; per JOPD; regulator pathway if material |
| Sub-leasing rule changes | Per JOPD; per RERA / ADREC short-term-let regulations (verify current) |
| Building-side third-party noise / disturbance | OAM operational; OA board; regulator if material |
| Developer-side snagging warranty period expiry | Communicated pre-expiry; owner-side responsibility post-expiry per SPA + applicable law |

## Dispute escalation

| Dispute type | First responder | Escalation |
|---|---|---|
| Routine snagging | `inventory-manager` + operational team | `service-recovery-specialist` if SLA breach |
| Service-charge dispute | `account-manager` (explanation) → OAM | RERA RDC (Dubai) / ADREC equivalent (Abu Dhabi) per `runbooks/complaint-rera-exposure.md` |
| OA governance dispute | OA board | RERA / ADREC arbitration; `legal-liaison` for developer-side |
| Snagging-warranty dispute | `service-recovery-specialist` + `legal-liaison` | RERA RDC pathway |
| OAM service-quality | OA board (OAM contract review) | OA-led re-procurement |
| Cross-owner dispute (noise, sub-leasing, etc.) | OAM | OA mediation; courts if material |

## Reactivation + referral motion

Existing owners are the highest-converting source for next-launch acquisition (per `verticals/real-estate/sub-verticals/developer/playbook.md`). Mechanics:

- **Owner-priority preview** — first access window for next-launch tower
- **Referral incentive program** — defined per launch; transparent terms; documented per `legal-liaison` review
- **Referral attribution** — captured at qualified-lead stage; honored at closed-won per program terms
- **Owner-event programming** — `events` runs cadence; coordinates with `partnerships` for hospitality + lifestyle layer
- **VIP / concierge layer for HNW owners** — `vip-relationship-manager` per `.claude/skills/vvip-protocol-uae.md` adjacency where applicable

## What this skill does NOT cover

- Pre-handover construction / launch — see `.claude/skills/off-plan-launch-mechanics.md`
- Secondary-market resale mechanics — see `runbooks/resale-with-noc.md` + `secondary-market-specialist`
- VVIP protocol — see `.claude/skills/vvip-protocol-uae.md`
- Operational AML/KYC on new buyers entering via owner referral — see `.claude/skills/aml-kyc-uae-real-estate.md`
- Specific RERA / ADREC dispute filings — see `.claude/skills/dispute-resolution-uae.md` + `runbooks/complaint-rera-exposure.md`
- Insurance frameworks for buildings (master policy, public liability) — separate domain
