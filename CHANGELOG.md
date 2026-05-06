# Changelog

All notable changes to POLYAI. Most-recent first. Each entry references the commit that landed it.

## 2026-05-06 — Audit, gap-analyze, surgical extension

The repo was audited end-to-end (`AUDIT.md`), gaps identified (`GAPS.md`), priorities ranked (`PLAN.md`), and a four-phase extension executed in priority order. The headline shift: from a 32-agent, 2-integration, no-skills, no-runbooks system into a 41-agent, 5-integration-spec'd (3 newly added), 7-skill, 10-runbook system with a manager-tier added between the CCO and specialists.

### Phase 4A — Manager tier + CCO rename · `6f407e4`

- **Renamed** `orchestrator` → `chief-commercial-officer` via `git mv` to preserve history. Repositioned as the C-level commercial orchestrator with siblings (CHRO, CPO, CFO-agent) reserved for future cross-department expansion.
- **Added 4 pod managers** between CCO and specialists, each with full §3 template:
  - `sales-manager` (sales pod)
  - `crm-manager` (CRM + lifecycle)
  - `marketing-manager` (marketing pod)
  - `wealth-vvip-manager` (relationship channels — broker, wealth, VVIP, future vip-relationship-manager, AML/KYC coordination)
- Specialists' escalation rules now point to `chief-commercial-officer` (replacing all prior orchestrator references) via bulk rename. The TS variable name in `web/app/api/chat/route.ts` had to be manually corrected (hyphen invalid in JS identifier) — renamed to `cco`.
- `web/app/agents/page.tsx` reorganized: pod groupings now reflect the manager tier + planned P1/P2/P3 additions.

### Phase 4B — P1: regulatory + AML/KYC infrastructure · `89c19cb`

The highest-leverage gap from `GAPS.md`. For an Aldar-class engagement, this is the difference between safe and unsafe.

- **Added `aml-kyc-compliance-specialist`** [opus] — DNFBP operational screening: PEP, sanctions (UN/OFAC/UK HMT/EU/DFAT + GCC), source-of-funds, EDD coordination, STR drafting (with legal-liaison), Russia/CIS pre-commercial-conversation mandatory.
- **Added `regulatory-research-specialist`** [opus] — single source of truth for "what does the regulator currently say"; tracks DLD/RERA/ADREC/ADGM/DIFC/CBUAE/PDPL/federal AML circulars; returns citation-bearing answers; never invents citations.
- **Introduced `.claude/skills/` directory** (new pattern in the repo) with three framework skills:
  - `uae-real-estate-regulatory.md` — federal + Dubai (DLD/RERA/Trakheesi/Oqood) + Abu Dhabi (ADREC/DMT/ADGM-FSRA) + DIFC-DFSA + sanctions / PEP regimes + foreign-buyer corridors + Golden Visa
  - `aml-kyc-uae-real-estate.md` — DNFBP operational framework: counterparty risk-rating, screening checklist, EDD triggers, STR triggers, re-screening cadence, KYC-provider integration shape, cross-border corridor specifics
  - `regulatory-disclosure-language.md` — approved disclosure templates: off-plan, financial-promotion, payment-plan, Trakheesi/ADREC permit display, Golden Visa eligibility, image/rendering disclaimer, forward-looking statement; forbidden phrasing block list
- **Extended `compliance.md`** additively (preserving original prompt) with a "UAE-specific guardrails" section: routes current-rule questions to `regulatory-research-specialist`, AML/PEP to `aml-kyc-compliance-specialist`, uses templates from `regulatory-disclosure-language`, **Trakheesi gate** (block until permit) for Dubai-side ads, forbidden-phrasing block list, Arabic substantive-equivalence requirement, VVIP discretion stance.

### Phase 4C — P2: specialists + integrations + runbooks · `46a8847`

- **Added 5 P2 agents:**
  - `service-recovery-specialist` — complaint triage + RERA/ADREC pathway (reports to crm-manager)
  - `data-quality-steward` — Salesforce hygiene, dedup, stage-evidence diff, attribution accuracy (reports to crm-manager)
  - `content-pr-specialist` — press tier matrix, embargo, spokesperson briefing, no-mention enforcement (reports to marketing-manager)
  - `deal-desk-analyst` [opus] — non-standard commercial structure analysis (reports to sales-manager)
  - `secondary-market-specialist` — NOC + Form-F/ADREC + Oqood-to-title + Trustee Account release
- **Added Salesforce integration spec set** (specs only — wiring activates per-client when credentials configured):
  - `integrations/salesforce/spec.md`
  - `integrations/salesforce/schema-mapping.md`
  - `integrations/salesforce/actions/activity-log.md`
  - `integrations/salesforce/actions/stage-advance.md` — **never auto-promotes past Tier B** (deliberate guardrail)
- **Added Sumsub integration spec** (KYC/AML provider):
  - `integrations/sumsub/spec.md`
  - `integrations/sumsub/actions/run-check.md`
- **Added Trakheesi integration spec** (Dubai DLD advertising-permit system):
  - `integrations/trakheesi/spec.md` — record-keeping + verification, no public DLD API yet
- **Introduced `runbooks/` directory** (new pattern) with 4 runbooks:
  - `runbooks/README.md` — catalog + authoring rules
  - `runbooks/resale-with-noc.md` — full secondary-market choreography
  - `runbooks/complaint-rera-exposure.md` — regulator-exposure complaint, no admission, Legal-first
  - `runbooks/pep-sanctions-hit.md` — no-tipping-off, restricted-channels, STR pathway
- **Extended** `verticals/real-estate/sub-verticals/developer/campaign-workflow.md` with a regulatory-milestone overlay (T-90 escrow → T0 launch sign-off → T+ongoing re-screening) layered over the existing T-16/T-12 marketing-clock cadence.

### Phase 4D — P3: long tail · `4381750`

- **Added 4 P3 agents:**
  - `vip-relationship-manager` — HNW/UHNW concierge layer (distinct from VVIP protocol; reports to wealth-vvip-manager)
  - `legal-liaison` — counsel-facing triage; SPA, escrow, regulator, broker-agreement template; distinct from compliance and regulatory-research-specialist
  - `data-room-curator` — institutional / JV / lender / regulator data rooms; distinct from project-fact-pack
  - `martech-ops-specialist` — tag governance, identity resolution, deliverability, consent, attribution-pipeline integrity
- **Added 4 P3 skills:**
  - `broker-operations.md` — RERA/ADREC license verification, Form-F mechanics, commission-grid framework, attribution doctrine, dispute escalation
  - `marketing-attribution.md` — 4-class decision framework (budget vs. per-deal vs. tactical vs. strategic), channel taxonomy, window doctrine, identity-resolution layer
  - `project-fact-pack.md` — current-state snapshot template (facts not narrative), audience-adaptation, cadence + sources
  - `vvip-protocol-uae.md` — gatekeeper map, register, no-mention list mechanics, bespoke-arrangement coordination, foreign-VVIP corridor, gift + event protocol
- **Added 6 P3 runbooks:**
  - `runbooks/international-roadshow.md` — 14-day post-event cadence in buyer's local time-zone
  - `runbooks/inbound-hnw-private-bank.md` — wealth-channel-mediated principal flow
  - `runbooks/broker-onboarding-to-first-deal.md` — 90-day onboarding-to-activation
  - `runbooks/handover-snagging.md` — T-30 to T+90 owner experience
  - `runbooks/quarterly-exec-brief.md` — 3-week assembly cycle, 8-section template
  - `runbooks/press-sensitive-uhnw-transaction.md` — discretion-overlay across the entire transaction lifecycle
- **Minimum-edit extensions** (preserving original prompt):
  - `account-manager.md` — appended UAE-developer note (handover, owner-community, schools, resale, referral, VVIP)
  - `partnerships.md` — appended Aldar-class scope note (hospitality JV, education, asset-class JV, lifestyle, wellness, financial)

### Phase 4E — Documentation refresh

- `README.md` — added C-level + Pod-managers + Compliance/legal/data sections to roster; expanded repo layout with `.claude/skills/`, `integrations/`, `runbooks/`, `CHANGELOG.md`.
- `ARCHITECTURE.md` — added paragraphs documenting the new directories (`.claude/skills/`, `runbooks/`) and the pod-manager tier.
- `CLAUDE.md` — added rules 7-10: skills are framework not current truth; runbooks have a single owner; pod-manager routing; discretion stance.
- `CHANGELOG.md` — created (this file).
- `REVIEW.md` — created (what changed, what was deliberately left alone, top 5 validation items for the human).

---

## Pre-audit milestones (for context)

The repo prior to the audit had been built up across many phases with the following major milestones (most-recent first):

- `c265202` — redirect `/verticals/automotive` → `/verticals` (no 404 for the removed route)
- `446b428` — remove automotive vertical (narrow scope to real-estate)
- `bb3d728` — replace meridian-residences with Aldar Developments worked example
- `55488cb` — pipeline dashboard, budget burn-down chart, reciprocity staging form
- `1249b38` — RSVP staging form + cross-channel reciprocity ledger
- `12557b7` — RSVP log + debrief templates and per-vendor / per-broker detail pages
- `e451384` — channel-development playbooks (6) + per-event detail page

(Older history accessible via `git log`.)
