---
name: vvip-protocol-uae
description: Protocol framework for VVIP-tier counterparties in the UAE — ruling families (federal + emirate-level), ministerial / cabinet-level officials, Their Excellencies, senior judiciary, senior military, and foreign heads of state / diplomatic principals. Distinct from .claude/skills/aml-kyc-uae-real-estate.md (operational screening) and from .claude/skills/regulatory-disclosure-language.md (claim language). Used by vvip-channel-enablement (primary), wealth-vvip-manager (oversight), vip-relationship-manager (adjacent HNW principals), legal-liaison (NDA + bespoke confidentiality framework), content-pr-specialist (no-mention enforcement), and events (protocol-aware event coordination). Framework only — protocol-specific guidance per principal verified per use through the developer's chief-of-protocol or named human equivalent.
scope: UAE VVIP protocol + discretion-channel + gatekeeper-map
maintained_by: vvip-channel-enablement + chief-commercial-officer (writes via knowledge agent)
---

# UAE VVIP protocol framework

> **Read this first.** Protocol is the medium; gatekeepers are the channel; relationship (rarely transaction) is the outcome. Specific protocol arrangements per principal — title usage, seating, gift register, communication channels, attendance confirmation — are confirmed per case via the developer's chief-of-protocol or named human equivalent. This skill captures the *framework* of how to operate; specific arrangements always route to the human protocol contact.

## VVIP perimeter

For UAE-based developer engagements, "VVIP" typically includes:

- **Ruling families** — federal-level (Al Nahyan in Abu Dhabi, Al Maktoum in Dubai, Al Qasimi in Sharjah, Al Sharqi in Fujairah, Al Mualla in Umm Al Quwain, Al Nuaimi in Ajman, Al Qasimi in Ras Al Khaimah) and their immediate / extended families
- **Federal cabinet** — Their Excellencies the Ministers, Ministers of State, Chairs of major federal authorities
- **Emirate-level senior officials** — Crown Prince's Court, Executive Council members, Heads of major emirate-level departments
- **Senior judiciary** — Federal Supreme Court justices, equivalent emirate-level senior judges
- **Senior military** — flag officers and equivalent
- **Foreign heads of state, royalty, ministerial-level diplomats** in the UAE
- **Their immediate spouses, principal advisors, chief-of-staff equivalents** — gatekeepers in the protocol sense

## The gatekeeper map

You almost never communicate directly with a VVIP principal. You communicate through gatekeepers:

| Gatekeeper class | Typical role | Where they fit |
|---|---|---|
| **Chief of staff / Director of office** | Day-to-day calendar + decision routing | Primary channel for substantive matters |
| **Personal advisor / Mustasher** | Trusted advisor on specific topics | Channel for advice-bearing topics (investment, philanthropy) |
| **Protocol officer** | Event attendance + diplomatic correspondence | Channel for events + ceremonial matters |
| **Private office** | Family-side family arrangements | Channel for family-protocol matters (children, residence, household) |
| **Wealth manager / family-office principal** | Investment + financial decisions | Channel for commercial-touching matters; overlaps with `wealth-channel-enablement` |
| **Court / royal-protocol staff** | Royal-protocol-specific arrangements | Channel for ruling-family-specific matters |

Per principal, the developer's chief-of-protocol maintains the gatekeeper map. POLYAI agents reference; they do not maintain.

## Communication register

| Register | When | Notes |
|---|---|---|
| **Formal English** | Default in written correspondence with senior officials | Title usage exact; honorifics correct; signature-line of correspondent matches the recipient's level |
| **Formal Arabic** | When the principal's preference is Arabic, or when the matter is ceremonial | Substantive equivalence — translation drift risk per `.claude/skills/regulatory-disclosure-language.md` doctrine |
| **Bilingual** | Common for ministerial / royal correspondence | Arabic as the primary; English as the courtesy |
| **Discreet informal** | When a long-tenure relationship has established a more direct channel; only with chief-of-protocol's confirmation | Never assumed |
| **No direct correspondence** | When the protocol stance for that principal is "all communication through gatekeeper only" | Default for many ruling-family principals |

## Title usage (framework — verify exact title per principal)

- **HH Sheikh / HH Sheikha** — Their Highness, ruling-family senior members
- **HE / Mrs HE** — His/Her Excellency, ministerial / ambassadorial / equivalent senior official rank
- **Sheikh / Sheikha** — extended ruling-family members, traditional tribal leaders
- **Maj Gen / Lt Gen / Gen** — military, exact rank as appointed
- **Hon Justice** — senior judiciary
- **Chairman / Director General** — federal authority heads where higher honorific does not apply

**Critical:** The exact correct title usage per principal is verified per case with the developer's chief-of-protocol. A mistitled correspondence is not just embarrassing; it can be relationship-ending in some contexts.

## The no-mention list

Every client engagement that involves VVIP-touching counterparties maintains a `clients/<client>/vvip-channel/no-mention-list.md` curated by `vvip-channel-enablement`. This list:

- Names every principal for whom public reference is prohibited
- Includes their immediate family + close associates per the protocol stance
- Includes any property reference (unit, floor, tower) that would imply principal identity (e.g., "the principal's penthouse on the top floor of Tower B")
- Is restricted-access — only the named team

**Enforcement:** Every customer-facing artifact from any agent (`creative`, `social-media`, `content-pr-specialist`, `email-lifecycle`, `brand-design`) must cross-reference the no-mention list before ship. Any hit blocks until `vvip-channel-enablement` clears.

## Bespoke arrangement coordination

VVIP transactions and engagements are typically *bespoke* — different from the standard playbook in commercial terms, in service experience, in confidentiality terms. The bespoke arrangement coordination involves:

- **Bespoke commercial terms** → `deal-desk-analyst` (analyzes margin + precedent) + `wealth-vvip-manager` (channel relationship) + `chief-commercial-officer` (sign-off)
- **Bespoke confidentiality (extended NDA, off-the-record undertakings)** → `legal-liaison` (template + redline) + `chief-commercial-officer` (sign-off)
- **Bespoke service experience (concierge, off-hours access, custom inclusions)** → `vip-relationship-manager` (operational delivery) + `events` (where event-touching)
- **Bespoke handover (private handover ceremony, family-only access window)** → `events` + `vip-relationship-manager` + `account-manager`
- **Bespoke financial structure (custom payment plan, alternative escrow arrangement)** → `marketing-financial-manager` + `legal-liaison` + `aml-kyc-compliance-specialist` (any structural variation must clear AML/KYC)

## Discretion stance

VVIP discretion is operationally maintained through:

- **Restricted-access case files** — VVIP-touching files in restricted folders; not visible to the general team
- **Restricted-access Salesforce records** — VVIP-flagged Accounts use a Salesforce sharing rule limiting visibility to the named team per `integrations/salesforce/schema-mapping.md`
- **Aggregated reporting** — fact packs, board reports, analytics all aggregate VVIP activity (e.g., "3 closings this quarter at the top tier") rather than naming
- **Zero direct press reference** — VVIP counterparties are not named in any press release, social post, byline, case study, awards submission
- **Communications via gatekeeper** — never bypass the gatekeeper for "speed" reasons
- **No tipping-off** on AML-adjacent matters per the standard framework

## AML/KYC + PEP framework

VVIP principals are by definition PEPs (per the FATF + UAE Federal AML/CFT definition — domestic PEPs include heads of state, senior politicians, senior judiciary, senior military). EDD applies:

- Senior-management approval before any commercial conversation
- Source-of-wealth corroboration appropriate to the principal's known role
- Quarterly minimum re-screening cadence
- Adjacency screening on immediate family and close associates

This is operationalized by `aml-kyc-compliance-specialist` per `.claude/skills/aml-kyc-uae-real-estate.md`. The discretion stance applies — screening verdicts and EDD packets stay with the named team.

## Foreign-VVIP corridor specifics

Where the principal is a foreign head of state, royalty, or ministerial-level diplomat in the UAE:

- **Vienna Convention diplomatic immunity** considerations apply to certain transactions; route to `legal-liaison` for case-by-case opinion
- **Cross-jurisdiction sanctions / PEP screening** applies — the full five-regime sanctions screen (UN, OFAC, UK HMT, EU, DFAT) plus the principal's own jurisdiction
- **Diplomatic-protocol overlay** — UAE Ministry of Foreign Affairs may need notification for certain engagements
- **Press-sensitivity** is amplified — most foreign-VVIP engagements operate under strict media-protocol restrictions

## Gift + hospitality protocol

Gifts and hospitality to PEPs are governed by the developer's anti-bribery / corporate-conduct policy + the principal's own jurisdictional rules:

- Senior-management approval required for any gift or hospitality above threshold (typically modest)
- Cultural-appropriate gifts only (Islamic protocol; recipient's specific cultural context)
- Hospitality at the principal's chosen establishment, not at vendor-funded venues
- Documented in restricted-access gift register per `vvip-channel-enablement`
- Coordinated with `vip-relationship-manager` for delivery; `marketing-procurement` for sourcing where new

## Event protocol — VVIP-attended

When a VVIP attends a developer event (sales gallery launch, ribbon-cutting, owner event):

- **Lead time** — 4-12 weeks typical for confirmation + protocol alignment via `events` + `vvip-channel-enablement`
- **Protocol officer present** — developer's chief-of-protocol or designated equivalent
- **Greeting line, seating, route plan** — all per principal's protocol office's confirmation
- **Press / photography** — only per principal's media-protocol; default is *no press* unless explicitly cleared
- **Other attendees** — managed list; any potential conflict (commercial competitor, political-sensitivity) cleared
- **Briefing pack for greeters** — title usage, family composition, anticipated topics, off-limits topics
- **Departure protocol** — equivalent to greeting protocol

## Where this skill lives in the workflow

- Every `vvip-channel-enablement` action references this skill for register + discretion stance
- `compliance` references the no-mention list (which this skill defines the framework for) on every customer-facing artifact
- `events` references this skill for VVIP-attended event protocol
- `legal-liaison` references this skill for bespoke-confidentiality template selection
- `aml-kyc-compliance-specialist` references this skill for PEP-class identification (domestic / foreign / international-organization / family / close associate)
- `vip-relationship-manager` references this skill for register-adjustment when their HNI principal is VVIP-adjacent

## What this skill does NOT cover

- Specific protocol per individual principal (that's the developer's chief-of-protocol per case)
- Operational AML/KYC mechanics (`.claude/skills/aml-kyc-uae-real-estate.md`)
- Regulatory disclosure language (`.claude/skills/regulatory-disclosure-language.md`)
- Press-sensitivity case management (`runbooks/press-sensitive-uhnw-transaction.md`)
- Foreign-jurisdiction protocol for specific countries (route to `legal-liaison` + relevant external counsel)
