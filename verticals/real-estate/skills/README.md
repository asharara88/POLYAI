# Skills — real-estate-uae pack

These skills are framework-level reference materials that activate when a client has `pack: real-estate-uae` (or legacy `vertical: real-estate`). They are read by agents (compliance, regulatory-research-specialist, aml-kyc-compliance-specialist, etc.) when they need the pack-specific framework.

Core skills at `.claude/skills/` (root) are loaded for every client regardless of pack.

## Regulatory framework

- `uae-real-estate-regulatory.md` — DLD / RERA / ADREC / DMT / ADGM / DIFC / CBUAE / PDPL / federal AML/CFT framework. Citations refreshed by `regulatory-research-specialist`.
- `aml-kyc-uae-real-estate.md` — DNFBP framework, source-of-funds, sanctions cadence, STR triggers, Russia/CIS corridor specifics
- `regulatory-disclosure-language.md` — Approved disclosure templates: off-plan, financial-promotion footer, payment-plan, Trakheesi permit (Dubai), ADREC permit (Abu Dhabi), Golden Visa eligibility, rendering disclaimer, forward-looking statement
- `dispute-resolution-uae.md` — RDC (Rental Dispute Centre), ADREC dispute mechanisms, Trustee Account dispute path

## Channel + operations

- `broker-operations.md` — Tier-1/2/3 tier mechanics, speed-to-lead SLA, allocation rules, exclusive periods, dispute escalations
- `wealth-channel-operations.md` — Private-bank + family-office + introducer relationship lifecycle, materials standards, expected revenue share
- `vvip-protocol-uae.md` — Ruling-family / ministerial / TE / FED-level protocol, gatekeeper map, no-mention-list discipline
- `off-plan-launch-mechanics.md` — Pre-launch → public-launch → handover phase architecture for off-plan towers; allocation slates; broker + wealth + VVIP integration
- `payment-plan-structures.md` — Standard Structures A–D, post-handover plans, ADGM-aware variations, deal-desk exception escalation thresholds

## Customer + community

- `owner-community-governance.md` — Post-handover owner community discipline, OA governance, snagging window, service-charge dispute paths
- `project-fact-pack.md` — Per-project marketing-grade fact pack (developer-side) covering specs, partners, payment, unit-mix, KPIs

## Buyer + corridor

- `diaspora-corridor-marketing.md` — IN / RU / GB / EG / GCC corridor adaptation: language, materials, regulatory disclosures per corridor

## Authoring rules

Pack skills are **framework**, not current truth. Citations to specific circulars, threshold values, sanctions-list versions, or rule numbers are framework-level and must be confirmed per-request by `regulatory-research-specialist`.

Edits route through the `knowledge` agent with `chief-commercial-officer` sign-off. Do not edit a pack skill while a runbook references it in flight.
