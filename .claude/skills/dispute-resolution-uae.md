---
name: dispute-resolution-uae
description: UAE dispute-resolution pathway map for real-estate matters — RERA Rental Dispute Centre (Dubai), Real Estate Dispute Resolution Centre (Dubai), ADREC consumer-protection (Abu Dhabi), Trustee Account / escrow disputes, broker disputes, SPA disputes, owner-association disputes, and the regulator-vs-judiciary-vs-arbitration choice per matter type. Consolidates dispute-pathway knowledge currently spread across service-recovery-specialist, legal-liaison, secondary-market-specialist, broker-enablement, and runbooks/complaint-rera-exposure.md. Used by every agent that handles a dispute. Framework only — current per-emirate dispute-process steps and timelines verify per request via regulatory-research-specialist.
scope: UAE real-estate dispute-resolution pathway map
maintained_by: regulatory-research-specialist + legal-liaison (writes via knowledge agent)
---

# UAE real-estate dispute-resolution pathway map

> **Read this first.** Specific current Rental Dispute Centre filing fees, current Real Estate Dispute Resolution Centre process steps, current ADREC consumer-protection cadence, current arbitration thresholds verify per request via `regulatory-research-specialist`. Dispute pathways update as the UAE judicial + regulatory architecture evolves; do not quote a specific timing or fee from this file as today's truth without verification.

## The pathway-choice problem

In UAE real-estate, a dispute can route through any of:

| Pathway | When | Speed | Cost | Reversibility |
|---|---|---|---|---|
| **Internal resolution (developer ↔ counterparty)** | Always try first | Fastest (days-weeks) | Low | Highest |
| **OAM / OA mediation** | Owner-community matters | Medium (weeks) | Low | Medium |
| **Regulator pathway** (RERA / ADREC) | Matter falls within regulator's scope | Medium (weeks-months) | Low-medium | Medium-low |
| **Court (Dubai Courts / AD Courts)** | Civil or commercial dispute | Slow (months-years) | Medium-high | Low (judicial precedent) |
| **Arbitration (DIFC-LCIA, ADGM Arbitration Centre, ICC)** | Per arbitration clause in contract | Variable | High | Low (binding award) |

The right pathway depends on (a) matter type, (b) contractual arbitration clauses, (c) counterparty type, (d) speed-vs.-finality preference, (e) commercial-relationship preservation.

## Dubai pathway map

### RERA Rental Dispute Centre (RDC)

- **Scope:** Rental disputes between landlord and tenant in Dubai (including service-charge disputes between owner and OA / developer in some interpretations)
- **Filing:** Online + in-person; filing fee typically % of disputed value (verify current)
- **Process:** Mediation → arbitration / judgment (verify current)
- **Timeline:** Typical resolution within months (verify current)
- **Appeal:** Limited; per current RDC rules

### Real Estate Dispute Resolution Centre (REDRC) — formerly part of Dubai Courts

- **Scope:** Sale, off-plan, escrow disputes between buyer and developer
- **Filing:** Through Dubai Courts; specific real-estate-tribunal channel
- **Process:** Conciliation → judgment
- **Timeline:** Variable (verify current)
- **Appeal:** Per Dubai Courts framework

### Dubai Courts (general)

- **Scope:** Civil + commercial disputes outside specialized tribunals
- **Three tiers:** Court of First Instance → Court of Appeal → Court of Cassation
- **Language:** Arabic mandatory in court; translations of evidence required

### DIFC Courts

- **Scope:** Disputes within DIFC jurisdiction or where parties opted in
- **Common-law-based; English-language**
- **Three tiers:** Court of First Instance → Court of Appeal → DIFC Court of Cassation (where applicable)
- **Used by some wealth-channel intermediary disputes** where intermediary is DIFC-based

### DIFC-LCIA Arbitration Centre

- **Scope:** Commercial arbitration per arbitration clause
- **Speed + confidentiality favored** by international counterparties
- **Used in some bespoke off-plan SPAs** for international buyers (verify per case via `legal-liaison`)

## Abu Dhabi pathway map

### ADREC consumer-protection + dispute resolution

- **Scope:** Real-estate disputes involving consumers + developers in Abu Dhabi
- **Process:** Mediation → escalation per current ADREC framework (verify)

### Abu Dhabi Courts

- **Three tiers** parallel to Dubai Courts framework
- **Language:** Arabic mandatory

### ADGM Courts + ADGM Arbitration Centre

- **Scope:** Disputes within ADGM jurisdiction or where parties opted in
- **Common-law-based; English-language**
- **ADGM Arbitration Centre** for commercial arbitration

## Matter-type → pathway map

| Matter type | First-line pathway | Escalation pathway |
|---|---|---|
| **Buyer ↔ developer SPA dispute** (off-plan delay, spec change, payment-plan) | Internal recovery → REDRC (Dubai) / ADREC (AD) | DIFC-LCIA / ADGM arbitration if SPA arbitration clause |
| **Buyer ↔ developer escrow / Trustee Account dispute** | Internal recovery → REDRC (Dubai) / ADREC (AD) | DLD / RERA escalation; courts |
| **Owner ↔ developer service-charge dispute** | OAM / OA → developer escalation → RERA RDC (Dubai) / ADREC (AD) | Courts |
| **Owner ↔ OA dispute** (governance, voting, common-area) | OA board → OAM mediation | RERA / ADREC pathway; courts |
| **Owner ↔ OAM dispute** (service-quality) | OA board (OAM contract review) | OA-led re-procurement; OAM regulatory complaint to RERA / ADREC |
| **Owner ↔ owner dispute** (noise, sub-letting, common-area use) | OAM mediation | OA board; courts if material |
| **Buyer ↔ broker dispute** (commission disclosure, mis-representation) | Broker firm internal → developer-side mediation | RERA broker-conduct complaint; courts |
| **Developer ↔ broker dispute** (commission attribution, claw-back) | Internal mediation per `.claude/skills/broker-operations.md` dispute escalation | RERA arbitration; courts |
| **Developer ↔ wealth-channel intermediary dispute** (introducer fee, attribution) | Internal mediation per `.claude/skills/wealth-channel-operations.md` | DIFC arbitration where DIFC-licensed intermediary; courts otherwise |
| **Developer ↔ agency dispute** (creative, media, scope) | Internal mediation per agency-liaison | Arbitration per signed SOW; courts |
| **Developer ↔ vendor dispute** (any other commercial) | Internal mediation | Per signed contract dispute clause |
| **Snagging warranty dispute** | `service-recovery-specialist` → `legal-liaison` | RERA RDC |
| **AML/CFT-adjacent matter** | NOT a dispute pathway — `runbooks/pep-sanctions-hit.md`; STR if warranted; **never** signal to counterparty |
| **Sanctions hit on counterparty** | NOT a dispute pathway — Legal + halt + STR per AML framework |
| **Press / reputation dispute** | `content-pr-specialist` + `legal-liaison`; courts only if defamation actionable |
| **Regulator inquiry** (DLD / RERA / ADREC / DMT directly inquires of developer) | `legal-liaison` immediate; per `runbooks/complaint-rera-exposure.md` |

## Discretion overlay (VVIP-touching disputes)

When a dispute touches a VVIP or VVIP-adjacent counterparty per `.claude/skills/vvip-protocol-uae.md`:

- **Internal resolution preferred regardless of merit** — the cost of public dispute often exceeds the cost of resolution
- **DIFC arbitration favored over courts** where contractual; confidentiality + finality
- **Press exposure pre-empted** via `content-pr-specialist` + no-comment defense
- **Restricted-access** case files; named team only
- **Coordinate with `vvip-channel-enablement`** before any external escalation

## Internal-resolution-first principle

For every dispute, the first move is internal resolution, not pathway escalation. Per `runbooks/complaint-rera-exposure.md`:

1. **Acknowledge fast** — within 4 business hours
2. **Triage** — severity × urgency × regulator-exposure × discretion
3. **Root-cause** — don't refund a problem you don't understand
4. **Recovery design** — match the action to the cause + customer framing
5. **Customer-confirmed closure** — most disputes resolve at this stage when handled well
6. **Pathway escalation only when internal resolution fails** — and even then, with `legal-liaison` strategy

## Time-and-cost tradeoffs

| Pathway | Typical timeline | Typical cost (relative) | Outcome certainty |
|---|---|---|---|
| Internal recovery | Days-weeks | Low | High when handled well |
| OAM / OA mediation | Weeks | Low | Medium |
| RERA RDC (rental) | Months | Low-medium | Medium |
| REDRC (sale / off-plan) | Months | Medium | Medium |
| Dubai / AD Courts | 12-36 months | Medium-high | Variable |
| DIFC / ADGM Courts | 6-18 months | High | Higher (common-law clarity) |
| DIFC-LCIA / ADGM arbitration | 6-18 months | High | High (binding, confidential) |

## Limitation periods (framework — verify per case)

| Matter | Typical limitation | Notes |
|---|---|---|
| Contract claim under UAE Civil Code | 15 years | Subject to specific agreement clauses |
| Tort claim | 3 years from knowledge | Per Civil Code |
| Real-estate-specific claims | Per specific real-estate law (Law 8/2007, Law 27/2007, AD Law 3/2015) | Verify per case |
| Arbitration claims | Per arbitration clause + applicable rules | Verify |

`legal-liaison` confirms current limitation periods per matter; do not rely on this table as current truth.

## Costs the developer typically bears

| Dispute outcome | Cost type |
|---|---|
| Successful internal recovery | Recovery action cost (refund, credit, fix) + relationship investment |
| Successful regulator-mediation outcome | Filing cost (typically not borne by developer if developer prevails) + recovery action |
| Adverse regulator-tribunal judgment | Recovery action + costs + reputation impact |
| Adverse court judgment | Recovery action + costs + interest + reputation impact |
| Arbitration award against | Recovery action + arbitration costs (typically loser-pays) + reputation impact |
| Settlement | Negotiated; may be confidential per arbitration / NDA |

## Reporting + learning

- Every dispute case (internal or pathway-escalated) generates a case file in `clients/<client>/service-recovery/cases/<case-id>/` (routine) or `clients/<client>/legal/cases/<case-id>/` (legal-mediated)
- Quarterly aggregated trend reporting via `runbooks/quarterly-exec-brief.md`
- Pattern alerts (3+ same-cause cases) feed `marketing-manager` (positioning) or `inventory-manager` (handover-quality) for prevention
- Material learnings feed `knowledge` for `verticals/real-estate/sub-verticals/developer/playbook.md` update

## What this skill does NOT cover

- Specific filing mechanics (RDC online portal step-by-step, REDRC fee-schedule, ADREC submission process) — operational; route to `regulatory-research-specialist` per case
- Legal-strategy decisions — `legal-liaison` + external counsel
- Tax-related disputes (FTA, customs) — separate counsel discipline
- Employment disputes — outside scope
- Criminal matters — outside scope; `legal-liaison` immediate to `chief-commercial-officer` if surfaces
- Cross-border enforcement of awards / judgments — verify per jurisdiction with `legal-liaison` + relevant external counsel
