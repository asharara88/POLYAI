---
name: project-fact-pack
description: Standard format for an evidence-grade, current-state snapshot of a developer project — the everyday workhorse document for sales-gallery briefings, broker-pack updates, internal stand-ups, executive reads, and any moment when "what's the current state of project X" needs to be answered cleanly. Used by every commercial pod. Distinct from data-room-curator (which manages persistent counterparty surfaces) and from creative-led brochures (which are positioned marketing assets). Framework + assembly process; per-project fact pack lives at clients/<client>/projects/<project-slug>/fact-pack-<period>.md.
scope: per-project current-state snapshot
maintained_by: marketing-manager + inventory-manager (writes via knowledge agent)
---

# Project fact pack — assembly framework

> **Read this first.** A fact pack is *facts*, not *narrative*. Marketing-narrative belongs in brochures; investor-narrative belongs in data rooms; this is the source of truth that every other artifact references. If a fact in a customer-facing artifact contradicts the fact pack, the fact pack wins, not the artifact.

## Purpose

When `account-executive` briefs a buyer, when `broker-enablement` updates a broker pack, when `chief-commercial-officer` reads project status, when `forecasting` calibrates expected close-dates against project milestones — they all read from the same current fact pack. The discipline is one source of truth, refreshed on cadence, with every fact traceable.

## Cadence

- **Refresh cadence:** weekly during launch + sustain phases; bi-weekly during construction phase; monthly post-handover
- **Effective-date stamp:** every fact pack carries a "Facts current as of <YYYY-MM-DD>" header; consumers cite this date when they cite a fact
- **Owner:** `marketing-manager` orchestrates assembly; `inventory-manager` owns inventory section; `regulatory-research-specialist` confirms regulatory section currency

## Standard sections

### 1. Header

- Project name + project code
- Developer (always — multi-developer JV projects must be explicit)
- Location (emirate + district + community)
- Project class (off-plan / sustain / handover-window / post-handover)
- Project phase (launch / sustain / construction / handover / post-handover-managed)
- Facts current as of <date>
- Pack version
- Pack assembled by: `marketing-manager`
- Sources cited at end

### 2. Inventory snapshot — owned by `inventory-manager`

- Total units (by type, by floor-band, by view-orientation)
- Sold (with confirmation — registered + paid-deposit count)
- Reserved (with hold-window)
- Available (by configuration)
- Indicative price ranges (per current published grid; **never** quote yield or appreciation projections in the fact pack — see `.claude/skills/regulatory-disclosure-language.md`)
- Payment-plan options (current published structures)
- Allocation status by broker tier where applicable (per `.claude/skills/broker-operations.md` allocation mechanics)

### 3. Construction / progress — for off-plan projects

- Current construction-progress percentage (per third-party verification)
- Last verification date + verifier
- Major milestones completed (foundation, structure, façade, MEP, interiors, snagging-readiness, handover)
- Next major milestone + target date
- Any disclosed delays (with regulatory-disclosure status per Abu Dhabi Law No. 3/2015 / Dubai Law 8/2007 — verify current via `regulatory-research-specialist`)

### 4. Regulatory snapshot — owned by `regulatory-research-specialist` (currency) + `compliance` (capture)

- RERA project registration number (Dubai) or ADREC equivalent (Abu Dhabi)
- Trustee Account / escrow account active reference (per applicable law)
- Active Trakheesi permit numbers + validity windows (Dubai-side ads)
- Active ADREC permit numbers + validity windows (Abu Dhabi-side ads, if applicable)
- Oqood registration status (off-plan, Dubai)
- Owners-association status (post-handover, per Dubai Law 27/2007 if applicable)
- Any regulator inquiry / dispute open (with `legal-liaison` + `service-recovery-specialist` reference)

### 5. Commercial snapshot — owned by `forecasting` + `marketing-financial-manager`

- Sales rate (units / week trailing 4 weeks; AED-value / week trailing 4 weeks)
- Sales rate vs. plan
- Pipeline summary (qualified, proposal-sent, negotiation, expected close-this-month, expected close-next-month) — categories per `forecasting` agent
- Channel split (direct / broker / wealth-channel / VVIP-channel) for trailing 90 days
- Active campaigns (campaign-slug references)
- Marketing-budget burn vs. plan
- Notable wins / losses in the period (anonymized for VVIP per discretion stance)

### 6. Marketing snapshot — owned by `marketing-manager`

- Active media-channel mix (paid-search, paid-social, OOH, portals, etc.) for the project
- Active permits per channel (cross-reference to regulatory snapshot)
- Pipeline of upcoming creative / campaign milestones
- Press placements in trailing period (with `content-pr-specialist`)
- Events in trailing + upcoming periods (with `events`)

### 7. Customer / owner-community snapshot — for handover + post-handover projects

- Owners count
- Owners-association governance status
- Service-charge transparency status
- Snagging-resolution metrics (open + closed in period; median resolution time)
- Owner-community feedback themes (per `voc`)
- Active complaints (count by severity; per `service-recovery-specialist`)

### 8. Risks + watches — owned by `chief-commercial-officer`

- Material risks (regulatory, commercial, reputational, operational) with current mitigation
- Watch items (not yet risks but trending)
- Pattern alerts (e.g., 3+ same-cause complaints; AML/KYC corridor flag; channel-conflict surface)

### 9. Sources

- Every fact in the pack cites the source:
  - Inventory facts → `clients/<client>/inventory/units.md` as of <date>
  - Regulatory facts → `regulatory-research-specialist` confirmation memo of <date>
  - Commercial facts → Salesforce report of <date> + `forecasting` rollup of <date>
  - Marketing facts → campaign briefs in `clients/<client>/campaigns/`
- Where a fact is stale (older than the pack effective-date), the pack flags it with a "as of <prior date>" note and a refresh action item

## Discretion stance

- VVIP-counterparty references are **not** in the fact pack; aggregated counts only (e.g., "3 units sold this period" not "Sheikh X bought Penthouse 4001")
- Wealth-channel intermediary identities are aggregated unless the pack is restricted-access for a specific audience
- Buyer-PII never appears in the fact pack

## Audience adaptation

The same fact pack feeds multiple audiences, who each get tailored views:

| Audience | View | Owner |
|---|---|---|
| `account-executive` for buyer briefing | Sections 1, 2, 3, 5 (commercial parts removed), 7 if relevant | `account-executive` per buyer |
| `broker-enablement` for broker pack | Sections 1, 2, 3, regulatory permit info, allocation status | `broker-enablement` per pack |
| `chief-commercial-officer` weekly read | All sections, executive-summary front-page | `marketing-manager` orchestrates |
| Board / CMO monthly read | All sections, trended over time | `marketing-manager` + `analytics` |
| Press / external read | Sanitized — no commercial detail, no risks section, no VVIP | `content-pr-specialist` |

## Update protocol

1. `marketing-manager` initiates refresh per cadence
2. Section owners (above) update their section by deadline
3. `marketing-manager` assembles + reviews
4. `compliance` checks for forbidden phrasing (none should be present in a facts pack, but verify)
5. `regulatory-research-specialist` confirms regulatory section currency
6. Pack version increments; effective-date stamp updates
7. Notification to consumers (the routing list)
8. Prior version archived

## What this skill does NOT cover

- Marketing brochures or buyer-pitch decks (positioned marketing assets — `creative` + `brand-design`)
- Investor data rooms (persistent, access-controlled — `data-room-curator`)
- Press materials (curated narrative — `content-pr-specialist`)
- Per-buyer briefing notes (per-account, per-meeting — `account-executive`)
- Per-campaign post-mortem (`analytics`)
