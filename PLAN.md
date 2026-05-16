# PLAN.md — Change plan (Phase 3)

> Awaiting human approval. Do not execute until approved (full or selective).

## Executive summary

The repo has a substantive, well-architected multi-agent system (32 agents, 8 schemas, integration tier model, 3-layer memory, multi-tenant + sub-vertical pattern, working web layer, UAE Developments worked example). The strongest element is the architectural discipline: agents are generic, UAE specificity lives in the vertical and client layers, writes go through approval gates, the `knowledge` agent is the single curator. **It works. Most extension should be additive, not corrective.**

The **highest-leverage gap** is UAE-specific compliance and AML/KYC infrastructure — a `regulatory-research-specialist` + `aml-kyc-compliance-specialist` + `regulatory-disclosure-language` skill + `aml-kyc-uae-real-estate` skill. These are missing entirely and the existing `compliance` agent doesn't cover the DNFBP / Trakheesi / Oqood / CBUAE LTV / PDPL surface. For a real developer-class engagement this is the difference between safe and unsafe.

**Second-highest gap:** runbooks. The off-plan campaign workflow exists; the other nine cross-agent flows do not. These are the playbooks the team would pull off the shelf when something happens.

**Architectural decisions needed from you before I touch anything:**

1. **Manager tier yes/no.** The prompt names `sales-manager`, `crm-manager`, `marketing-manager`, `wealth-vvip-manager`. The repo today has the chief-commercial-officer routing directly to specialists. Adding managers is an architectural shift, not a gap-fill. (Default recommendation: do not add — chief-commercial-officer + specialists is a clean pattern.)
2. **`aldar-chief-of-staff` rename of chief-commercial-officer yes/no.** The repo's chief-commercial-officer is multi-tenant (works for any client). Renaming it ties it to one client. (Default recommendation: do not rename.)
3. **Skills as a new concept.** The repo has no `.claude/skills/` directory. Introducing one is fine but it's a new pattern. (Default recommendation: create the directory and seed the highest-leverage skills.)

---

## Change table (ordered by priority)

P1 = ship-blocking gap for a real UAE Developments engagement. P2 = high-value extension. P3 = nice-to-have / architectural debate.

| # | Target | Current state | Proposed action | Effort | Risk if skipped |
|---|---|---|---|---|---|
| **P1** | aml-kyc-compliance-specialist agent | 🔴 Missing | **Create** at `.claude/agents/aml-kyc-compliance-specialist.md`. Owns PEP screening, sanctions screening, source-of-funds documentation, Golden Visa thresholds, KYC-provider integration plumbing. Coordinates with `compliance` (claims) and `vvip-channel-enablement` (screening cadence). | M | High — actual regulatory exposure on every UHNW transaction |
| **P1** | regulatory-research-specialist agent | 🔴 Missing | **Create** at `.claude/agents/regulatory-research-specialist.md`. Tracks DLD/RERA/ADREC/CBUAE/PDPL circulars, produces evidence-backed updates with citations, feeds `compliance` + `strategy`. | M | High — without this, `compliance` works from generic guidance and outdated assumptions |
| **P1** | aml-kyc-uae-real-estate skill | 🔴 Missing | **Create** at `.claude/skills/aml-kyc-uae-real-estate.md` (introduces skills directory). UAE Federal AML/CFT DNFBP obligations, identity verification (EIDA), source-of-funds documentation, sanctions list cadence (UN/OFAC/UK/EU/DFAT/GCC), Sumsub / World-Check integration shape. | M | High — same regulatory exposure |
| **P1** | regulatory-disclosure-language skill | 🔴 Missing | **Create** at `.claude/skills/regulatory-disclosure-language.md`. Approved disclosure templates: RERA off-plan, ADREC equivalent, financial-promotion footers, "no guaranteed return" language, payment-plan disclosure boilerplate, escrow reference. | S | High — every public-facing artifact needs these |
| **P1** | uae-real-estate-regulatory skill | 🟡 Light | **Create** consolidated skill at `.claude/skills/uae-real-estate-regulatory.md` referencing DLD / RERA / ADREC / DMT / CBUAE LTV caps / PDPL / Oqood / Trustee Account / NOC / Abu Dhabi Law No. 3 of 2015. Does NOT duplicate the vertical playbook — it's a citation-bearing reference for `compliance`, `regulatory-research-specialist`, `aml-kyc-compliance-specialist`. | M | High — single source for all UAE regulatory references |
| **P1** | `compliance` agent — UAE pointer block | 🟠 Drift (UAE-light) | **Extend** with a UAE-specific section pointing to the new skills + `regulatory-research-specialist` agent. **Minimum edit; do not rewrite.** | S | Medium — partial UAE coverage exists in vertical playbook today |
| **P2** | service-recovery-specialist agent | 🔴 Missing | **Create**. Owns complaint handling, RERA escalation pathway, reputation defense, root-cause-to-prevention loop. Coordinates with `compliance`, `voc`, `account-manager`, `pr` (when added). | M | Medium — without this, complaints route ad-hoc |
| **P2** | data-quality-steward agent | 🔴 Missing | **Create**. Salesforce data hygiene: deduplication, missing-field surfacing, stage-progression discipline, broker-attribution accuracy. Coordinates with `crm` integration + `forecasting`. | M | Medium — bad CRM data poisons forecasting + attribution |
| **P2** | content-pr-specialist agent | 🔴 Missing | **Create**. Press across architecture / lifestyle / financial / institutional press; embargo strategy; spokesperson scheduling; coordinates with `creative`, `events`, `vvip-channel-enablement` (no-mention list). | M | Medium — developer-scale clients need active press desk |
| **P2** | deal-desk-analyst agent | 🔴 Missing | **Create**. Discount approval analysis, margin protection, custom-term review, multi-unit / floor / building deal commercial terms. Distinct from `proposal` (which generates documents). Coordinates with `account-executive`, `marketing-financial-manager`, `wealth-channel-enablement`. opus model. | M | Medium |
| **P2** | secondary-market-specialist agent | 🔴 Missing | **Create**. UAE secondary-market resale, NOC flow, RERA Form-F transfer, Oqood-to-title progression. Coordinates with `account-manager`, `compliance`, `legal-liaison` (if added). | M | Low for off-plan focus; Medium if UAE Developments runs a resale arm |
| **P2** | Salesforce integration spec | 🔴 Missing (specced in INTEGRATIONS.md) | **Create** `integrations/salesforce/spec.md` + `schema-mapping.md` + 2–3 `actions/` (activity-log, stage-advance, score-update). Tier A → B per the existing pattern. | L | High when actually integrating; Low while specs alone |
| **P2** | KYC-provider (Sumsub) integration spec | 🔴 Missing | **Create** `integrations/sumsub/spec.md` + 1 `actions/` (run-check). Pairs with the AML/KYC agent. | M | High when actually integrating |
| **P2** | DLD / Trakheesi integration spec | 🔴 Missing | **Create** `integrations/trakheesi/spec.md`. Advertising-permit lifecycle for Dubai-side ads. (ADREC equivalent for AD-side as a sibling spec — note in plan, defer creation until needed.) | M | High once a campaign goes live in Dubai |
| **P2** | Off-plan launch runbook | 🟡 Light | **Extend** `verticals/real-estate/sub-verticals/developer/campaign-workflow.md` with regulatory milestones (Trakheesi permit application timing, Oqood registration, Trustee Account opening, ADREC pre-approval where applicable). Reframe windows to T-90 / T-30 / T+30 alongside existing T-16/T-12/etc. so both terminologies are present. | S | Medium |
| **P2** | Resale with NOC runbook | 🔴 Missing | **Create** `runbooks/resale-with-noc.md`. NOC process steps + RERA Form-F + buyer/seller/developer roles + agent assignments. Introduces `runbooks/` directory (new pattern). | M | Low for a launch-focused engagement; Medium if resale is in scope |
| **P2** | Complaint with RERA exposure runbook | 🔴 Missing | **Create** `runbooks/complaint-rera-exposure.md`. Triage → resolution → RERA filing path → reputation defense. | M | Medium |
| **P2** | PEP/sanctions hit runbook | 🔴 Missing | **Create** `runbooks/pep-sanctions-hit.md`. Immediate freeze → escalation → legal → reporting path. Pairs with the AML/KYC agent. | S | High if one happens and there's no playbook |
| **P3** | concierge-coordinator agent | 🔴 Missing | **Create** OR **absorb into** `vvip-channel-enablement`. Decision needed. UHNW concierge ops (private viewings, F1 access, school intros). | S | Low |
| **P3** | legal-liaison agent | 🔴 Missing | **Create**. Counsel-facing role: SPA redlines, escrow disputes, regulatory complaint pathway. Distinct from `compliance` (claims). | M | Low for routine; Medium for any unusual transaction |
| **P3** | data-room-curator agent | 🔴 Missing | **Create**. Owner / investor / counterparty data-room management. | S | Low |
| **P3** | martech-ops-specialist agent | 🔴 Missing | **Create**. Marketing-tech stack health, identity resolution, consent management, deliverability monitoring. | M | Low at the playbook stage; Medium when integrations go live |
| **P3** | International roadshow runbook | 🔴 Missing | **Create**. 14-day post-roadshow cadence in buyer's local time zone with jurisdiction-specific Golden Visa messaging. | M | Low |
| **P3** | Inbound HNW from private bank runbook | 🔴 Missing | **Create**. Discreet response, KYC pre-clearance, principal-to-principal escalation. | S | Low–Medium |
| **P3** | Broker onboarding to first deal runbook | 🔴 Missing | **Create**. Extends the new-firm-signing play to first-allocation-approved. | S | Low |
| **P3** | Handover snagging cycle runbook | 🔴 Missing | **Create**. Owner experience during the snagging window; CSAT capture. | S | Low (post-handover horizon) |
| **P3** | Quarterly executive brief runbook | 🔴 Missing | **Create**. Brief cadence + format + data sources for board / CMO / CFO. | S | Low |
| **P3** | Press-sensitive UHNW transaction runbook | 🔴 Missing | **Create**. Discretion-first; coordinates `vvip-channel-enablement`, `content-pr-specialist`, `legal-liaison`. | S | Medium for one-off occurrences |
| **P3** | crm-data-model skill | 🟡 Light | **Extend** `schemas/deal-record.md` OR **create** `.claude/skills/crm-data-model.md` mapping Salesforce / Dynamics objects to the deal-record schema. | M | Medium when CRM integration is wired |
| **P3** | broker-operations skill | 🟡 Light | **Create** `.claude/skills/broker-operations.md`. Form-F flow, commission grid mechanics, RERA broker-license verification, dispute escalation steps. | S | Low |
| **P3** | marketing-attribution skill | 🟡 Light | **Create** `.claude/skills/marketing-attribution.md`. Multi-touch / position-based / data-driven specifics for real-estate funnel. | M | Low–Medium |
| **P3** | aldar-project-fact-pack skill | 🟡 Light | **Create** `.claude/skills/project-fact-pack.md` (generic, not client-specific to keep multi-tenancy). Consolidates client-profile + inventory + sub-vertical context into a single pull. | S | Low |
| **P3** | vvip-protocol skill | 🟡 Light | **Promote** the worked-example `protocol-library.md` into a skill at `.claude/skills/vvip-protocol-uae.md`. | S | Low |
| **P3** | account-manager UAE-developer flavor | 🟡 Light | **Extend** the agent prompt with a one-paragraph UAE-developer pointer (handover-window, owner-community ops, schools-adjacent family events) referencing the developer sub-vertical playbook. **Minimum edit.** | S | Low |
| **P3** | partnerships developer-class flavor | 🟠 Drift (mild) | **Extend** with a one-line note on hospitality JV / education partner / asset-class JV scope. | S | Low |

---

## Files I will CREATE (if approved — full set)

Subject to your approval, ordered by priority bucket:

**P1 (5 files):**
- `.claude/agents/aml-kyc-compliance-specialist.md`
- `.claude/agents/regulatory-research-specialist.md`
- `.claude/skills/aml-kyc-uae-real-estate.md`
- `.claude/skills/regulatory-disclosure-language.md`
- `.claude/skills/uae-real-estate-regulatory.md`

**P2 (15 files):**
- `.claude/agents/service-recovery-specialist.md`
- `.claude/agents/data-quality-steward.md`
- `.claude/agents/content-pr-specialist.md`
- `.claude/agents/deal-desk-analyst.md` (model: opus)
- `.claude/agents/secondary-market-specialist.md`
- `integrations/salesforce/spec.md`
- `integrations/salesforce/schema-mapping.md`
- `integrations/salesforce/actions/activity-log.md`
- `integrations/salesforce/actions/stage-advance.md`
- `integrations/sumsub/spec.md`
- `integrations/sumsub/actions/run-check.md`
- `integrations/trakheesi/spec.md`
- `runbooks/README.md` (introduces the runbooks directory)
- `runbooks/resale-with-noc.md`
- `runbooks/complaint-rera-exposure.md`
- `runbooks/pep-sanctions-hit.md`

**P3 (12+ files):** see change table.

## Files I will MODIFY (if approved)

- `.claude/agents/compliance.md` — append a UAE-pointer section. **No rewrite.**
- `.claude/agents/account-manager.md` — append a UAE-developer paragraph pointer. **No rewrite.**
- `.claude/agents/partnerships.md` — append a one-line developer-class scope note. **No rewrite.**
- `verticals/real-estate/sub-verticals/developer/campaign-workflow.md` — add regulatory-milestone overlay (Trakheesi / Oqood / Trustee Account / ADREC). **Append, not rewrite.**
- `README.md` — add new agents + skills directory + runbooks directory to the roster sections. **Add lines, do not rewrite.**
- `ARCHITECTURE.md` — add one paragraph noting the new directories (`.claude/skills/`, `runbooks/`). **Append.**
- `CHANGELOG.md` — **create** if it doesn't exist; one entry per modified or created file.

## Files I considered changing and will LEAVE ALONE (with reason)

- All ✅ solid agents (`chief-commercial-officer`, `social-media`, `events`, `partnerships` modulo the one-liner, `broker-enablement`, `vvip-channel-enablement`, the `creative` + `brand-design` pair) — they work, the §3-template gaps (Section 9 UAE-specifics, Section 11 examples) can be addressed via the new vertical-level skills + the regulatory-research-specialist agent's outputs without touching agent prompts.
- `client-onboarding` — works as-is; UAE specifics live in the vertical playbook it reads.
- `proposal` — covered conceptually by the new `deal-desk-analyst` (different concern: generation vs. negotiation). Leave proposal alone.
- `agency-liaison`, `inventory-manager`, `marketing-procurement`, `marketing-financial-manager`, `events`, `forecasting`, `knowledge` — all solid and operational.
- `creative` and `brand-design` — keep the two-agent split per the §3 prompt's "do not rename for cosmetic conformity"; a merged `brand-creative-specialist` would dilute.
- `voc` and `analytics` — keep the split per the same rule.
- `wealth-channel-enablement` — keep absorbing private-banking-liaison + family-office-specialist; splitting them doubles management surface for marginal gain.
- The chief-commercial-officer is **NOT** renamed to `aldar-chief-of-staff`. Multi-tenancy preserved.
- No managerial tier added unless explicitly approved.
- Existing tools allowlists — not narrowed; agent operations depend on them.

## Questions blocking confident execution

1. **Manager tier (sales-manager, crm-manager, marketing-manager, wealth-vvip-manager).** Add a managerial layer between chief-commercial-officer and specialists? My recommendation: NO (the chief-commercial-officer + specialists pattern is clean and the prompt's "leave it alone if it works" rule applies). But the prompt names them, so I want explicit confirmation either way.
2. **Skills as a new pattern.** Confirm OK to introduce `.claude/skills/` as a new directory. Default skills shape: kebab-case markdown files with frontmatter (name, description, scope), citation-bearing references for regulatory skills.
3. **Runbooks as a new directory.** Confirm OK to introduce `runbooks/` at the repo root. Runbook shape: kebab-case markdown with `## Trigger / ## Owner / ## Sequence / ## Hand-offs / ## Compliance gates / ## KPIs`.
4. **`aldar-chief-of-staff`.** Confirm: do NOT rename `chief-commercial-officer`. (My strong recommendation.)
5. **Concierge.** Separate `concierge-coordinator` agent OR absorb into `vvip-channel-enablement`? My lean: absorb (lower management surface).
6. **Scope of approval.** Approve P1 only? P1+P2? Everything? Selective list?
7. **Real UAE Developments regulatory citations.** When I write the `uae-real-estate-regulatory` skill and `regulatory-disclosure-language` skill, do you want me to include actual citations (DLD circular numbers, ADGM regulation references, CBUAE Mortgage Regulation 31/2013 LTV caps), or stay abstract and route specifics to `regulatory-research-specialist` for confirmation? My lean: include known citations with confidence-level markers, but flag any uncertain reference and route to `regulatory-research-specialist`.

---

## What happens after approval

I will:

1. Create `CHANGELOG.md` and add an entry header for the approved batch.
2. Create the approved files in priority order, conforming to the §3 per-agent template (or skill / runbook shape).
3. For each new agent, model selection per the §3 rule (opus for compliance / VVIP / deal-desk; sonnet for the rest). The new opus agents would be: `aml-kyc-compliance-specialist`, `deal-desk-analyst`. `regulatory-research-specialist` could go either way; my lean is opus for citation accuracy.
4. Apply the minimum-edit modifications to the listed existing files.
5. Update `README.md` and `ARCHITECTURE.md` to reflect the new directories and roster.
6. Run the standard verification (build + tsc + grep for any orphan references).
7. Commit + push.
8. Produce `REVIEW.md`: what changed, what was deliberately left alone, top 5 items for human validation.

**Stopping here. Awaiting approval.**
