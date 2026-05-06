---
name: wealth-channel-operations
description: Operational mechanics for the UAE wealth channel — private banks, family offices, independent wealth introducers — parallel to broker-operations but for a discretion-led, trust-based, agreement-mediated channel with a different bar on materials, communications, and KPIs. Covers introducer-agreement framework, ADGM-FSRA + DIFC-DFSA implications for licensed intermediaries, fee structures, principal-to-principal escalation, channel-development cadence (reactivation + new signings), and dispute escalation. Used by wealth-channel-enablement (primary), wealth-vvip-manager (oversight), aml-kyc-compliance-specialist (intermediary entity-level + UBO + roster screening), legal-liaison (introducer agreement + jurisdictional analysis), deal-desk-analyst (fee-structure analysis), data-quality-steward (attribution accuracy). Framework only — current per-jurisdiction requirements route to regulatory-research-specialist for confirmation per use.
scope: UAE wealth channel — private bank / family office / independent introducer
maintained_by: wealth-channel-enablement + regulatory-research-specialist (writes via knowledge agent)
---

# UAE wealth channel operations

> **Read this first.** Specific current ADGM-FSRA rulebook clauses, current DIFC-DFSA introducer-fee disclosure rules, current FCA / SAMA cross-border implications are confirmed per request via `regulatory-research-specialist`. The wealth channel sits at the intersection of UAE Federal AML/CFT (DNFBP for the developer-side) and the intermediary's own financial-services regulation (ADGM-FSRA / DIFC-DFSA / FCA / SAMA / equivalent). Do not quote a specific rule here as today's truth without verification.

## Channel taxonomy

| Channel sub-class | Examples | Regulatory framework | Typical fee mechanism |
|---|---|---|---|
| **UAE-onshore private banks** | Mashreq Private Banking, ENBD Private Banking, ADCB Private | CBUAE Banking Regulation; DNFBP-adjacent | Signed introducer agreement; 1.5–3.0% introducer fee |
| **DIFC-licensed wealth managers** | Major international private banks DIFC-presence | DFSA rulebook (financial advice + arranging deals) | Per agreement; DFSA disclosure rules |
| **ADGM-licensed wealth managers** | International + GCC wealth firms with ADGM presence | FSRA rulebook | Per agreement; FSRA disclosure rules |
| **International private banks (offshore booking)** | UBS, Julius Baer, EFG, J. Safra Sarasin, Pictet | Home jurisdiction (FINMA / FCA / FINMA / etc.) + introducer relationship with developer | Per signed introducer agreement; cross-border disclosure considerations |
| **Independent wealth introducers** | Boutique wealth advisory firms; concierge-style introducers | Per advisor's home jurisdiction | Per agreement; varies widely |
| **Single-family offices (SFOs)** | Family offices acting on behalf of the principal | DNFBP-adjacent; FO governance | Often no fee — direct principal relationship |
| **Multi-family offices (MFOs)** | Aggregator FOs serving multiple principals | DIFC-licensed FO regime where DIFC-based | Per agreement |

## Introducer-agreement framework

The signed introducer agreement is the foundational document. Maintained per intermediary at `clients/<client>/wealth-channels/<intermediary-slug>/agreement.md` (signed PDF reference + key-terms summary).

**Standard clauses (framework):**

1. **Scope** — what does "introduction" mean (a name + contact, a verified-interest principal, a meeting-attended principal); duration of the introduction window
2. **Fee structure** — introducer fee % of unit price; trigger (closed-won; deposit-received); claw-back conditions (rescission within cooling-off; non-completion)
3. **Exclusivity** — typically non-exclusive; specific principals may be flagged exclusive
4. **Confidentiality** — both directions; bilateral NDA may overlay for VVIP-touching
5. **AML/CFT** — both sides' obligations under their respective regimes; introducer warrants their own KYC compliance on the principal
6. **Disclosure** — introducer's disclosure obligation to the principal (FCA-style introducer-fee disclosure rules apply for UK-FCA-regulated intermediaries)
7. **Term + termination** — typically 12-24 months auto-renewing; termination on notice; in-flight introductions honored to natural conclusion
8. **Dispute resolution** — typically Dubai courts or DIFC arbitration depending on intermediary's jurisdiction
9. **Material adverse change** — if intermediary loses license, sanctions adjacency surfaces, etc.

## Channel-development cadence

Parallel to broker-channel development per `broker-operations.md` but with different rhythm and bar:

| Activity | Cadence | Owner |
|---|---|---|
| **New-relationship signing** | Strategic — typically 4-12 quarter pursuit | `wealth-channel-enablement` charters; `legal-liaison` on agreement; `aml-kyc-compliance-specialist` on entity + UBO screening |
| **Quarterly relationship review** | Per intermediary, quarterly | `wealth-channel-enablement` + named senior developer-side RM |
| **Annual joint planning** | Annually with each Tier-1 intermediary | `wealth-channel-enablement` + `chief-commercial-officer` |
| **Reactivation of dormant** | When 12+ months elapsed without introduction | `wealth-channel-enablement` per dormant-refresh playbook |
| **Joint event participation** | 2-4 per intermediary per year (intermediary's client events; developer's discretion-aware previews) | `wealth-channel-enablement` + `events` |
| **Joint principal-direct meetings** | Per principal opportunity | Named senior RM + intermediary's RM |

## Tier model

Wealth-channel intermediaries have their own tiering separate from broker-firm tiering:

| Tier | Profile | Typical contribution | Investment level |
|---|---|---|---|
| **Tier 1 — strategic** | Top global private bank; consistent introductions of qualified UHNI; multi-year relationship | 30%+ of wealth-channel-attributed deals | High — co-marketing, joint events, principal-direct partnerships |
| **Tier 2 — established** | Mid-tier or growing relationship; some track record | 5-15% individual contribution | Medium — quarterly review, reactive support |
| **Tier 3 — opportunistic** | Newer or transactional relationship | < 5% | Low — relationship maintenance only |

Tier promotion is earned via (a) introduction quality (close-won rate from introductions), (b) introduction value (per-deal average), (c) strategic value (corridor reach, brand fit), (d) communications discipline (timely, accurate, discretion-respecting).

## AML/KYC framework — wealth channel

The wealth-channel intermediary is a **DNFBP** under UAE Federal AML/CFT if they are not an FI (most international private banks ARE FIs under their home regulator; DIFC/ADGM-licensed advisors are FIs under their respective regulators). Either way:

- Developer-side: screen the intermediary entity + UBO + key roster per `.claude/skills/aml-kyc-uae-real-estate.md`
- Developer-side: do not waive principal-level screening on the intermediary's representation that "the bank has KYC'd them" — your DNFBP obligation is on you
- Communicate principal pre-clearance as standard process to the intermediary RM, not as a flag on the principal
- Any RED outcome on principal triggers `runbooks/pep-sanctions-hit.md` with discretion overlay

## Attribution doctrine — wealth channel

Per `.claude/skills/marketing-attribution.md` + `.claude/skills/broker-operations.md` doctrine:

- **Wealth-channel introducer fee** triggers when the intermediary made the principal-introduction even if a broker was later involved at transaction-mechanics level
- **Time-window** typically per signed agreement (often 6-24 months from registered introduction to closed-won)
- **Cross-channel dispute** (e.g., principal also engaged via a roadshow or paid-search before intermediary's introduction): documented evidence chain wins; senior commercial leadership rules on novel cases per `deal-desk-analyst` analysis
- **Principal-direct walk-in after introduction** — does not invalidate the introducer fee within the agreement window; the introduction created the qualified prospect

## Communications framework

Wealth-channel communications operate at a different register from broker-channel:

| Aspect | Broker channel | Wealth channel |
|---|---|---|
| **Primary channel** | WhatsApp / portal / training events | Email / phone / in-person |
| **Tone** | Direct, transactional, performance-oriented | Reserved, advisor-to-advisor, relationship-oriented |
| **Materials** | Allocation-ready; high-volume | Bespoke briefings; per-principal customization |
| **Frequency** | Weekly during launch | Monthly + per-opportunity |
| **Format** | Standardized factsheets, allocation packs | Curated-narrative briefings; principal-specific |
| **Confidentiality** | Standard | Bespoke NDA where principal-touching |

## Dispute escalation

| Dispute type | First responder | Escalation |
|---|---|---|
| Introducer-fee calculation | `marketing-financial-manager` (math) → `wealth-channel-enablement` (relationship) | `legal-liaison` (if material) |
| Attribution dispute (intermediary vs. another channel) | `data-quality-steward` (evidence chain) → `wealth-channel-enablement` | `chief-commercial-officer` for ruling on novel cases |
| Principal-discretion breach allegation | `wealth-vvip-manager` immediate | `chief-commercial-officer` + `legal-liaison`; `runbooks/press-sensitive-uhnw-transaction.md` if material |
| Sanctions / PEP hit on intermediary entity / UBO / principal | `aml-kyc-compliance-specialist` per `runbooks/pep-sanctions-hit.md` | `legal-liaison` + `chief-commercial-officer` |
| Intermediary loses regulatory license | `wealth-channel-enablement` (immediate suspension); `data-quality-steward` (in-flight deal audit) | `chief-commercial-officer`; `legal-liaison` on agreement-termination |
| Introducer agreement redline / renewal | `legal-liaison` | `chief-commercial-officer` for material change |

## Foreign-jurisdiction overlay

| Intermediary's jurisdiction | Considerations |
|---|---|
| **UK FCA** | Introducer-fee disclosure to client mandatory; FCA fitness-and-propriety check on individuals; FCA AML rules apply to intermediary side |
| **Switzerland (FINMA)** | FINMA-licensed advisors have specific cross-border rules; local-rule-of-engagement varies by canton |
| **Saudi Arabia (SAMA)** | Cross-border capital-flow regulations; SAMA notification on outbound investment by Saudi nationals (varies) |
| **Singapore (MAS)** | MAS-licensed wealth advisors; MAS cross-border rules |
| **DIFC (DFSA)** | DFSA rulebook on arranging deals + financial advice; DIFC Data Protection Law 5/2020 overlay |
| **ADGM (FSRA)** | FSRA rulebook; ADGM data-protection regime |
| **US (SEC + state)** | Private-placement rules where investment-product framing used; FATCA reporting; state-level investment-advisor registration in some cases |

When intermediary jurisdiction is novel for the engagement, `legal-liaison` + `regulatory-research-specialist` produce a cross-jurisdiction memo before signing the introducer agreement.

## Operational documents (per intermediary)

- `clients/<client>/wealth-channels/registry.md` — master roster
- `clients/<client>/wealth-channels/<intermediary-slug>/profile.md` — intermediary profile
- `clients/<client>/wealth-channels/<intermediary-slug>/agreement.md` — signed agreement key terms
- `clients/<client>/wealth-channels/<intermediary-slug>/screening/` — entity + UBO + roster AML/KYC
- `clients/<client>/wealth-channels/<intermediary-slug>/introductions/<introduction-id>/` — per-introduction case file (restricted-access)
- `clients/<client>/wealth-channels/<intermediary-slug>/quarterly-reviews/<period>/` — relationship reviews
- `clients/<client>/wealth-channels/<intermediary-slug>/disputes/<dispute-id>/` — dispute case files

## What this skill does NOT cover

- Specific introducer-agreement legal language (`legal-liaison` template library)
- Per-principal commercial mechanics (`runbooks/inbound-hnw-private-bank.md`)
- VVIP protocol (`.claude/skills/vvip-protocol-uae.md`)
- Operational AML/KYC (`.claude/skills/aml-kyc-uae-real-estate.md`)
- Tax / FATCA / CRS implications for cross-border (route to tax counsel via `legal-liaison`)
