# AUDIT.md — Aldar Multi-Agent System (Phase 1)

> Phase 1 deliverable. Inventory, architectural read, and quality read of the existing repo before any extension. Phase 2 coverage matrix lives in `GAPS.md`. Phase 3 change plan lives in `PLAN.md`.

## 1.1 Inventory

### 1.1.1 Agents — `.claude/agents/` (32 files)

All agent files use the same kebab-case naming. Frontmatter pattern: `name`, `description`, `tools` (comma-separated allowlist), `model` (sonnet by default, `chief-commercial-officer` is opus). No division prefix (it's just `compliance`, not `marketing-compliance`).

**Executive (2)**
| Agent | Mission (one line) | Tools | Model |
|---|---|---|---|
| `chief-commercial-officer` | CEO of the marketing/sales/BD team. Decomposes goals, assigns work, runs handoffs, authors new agents. | Read, Write, Edit, Bash, Agent, TodoWrite | opus |
| `client-onboarding` | Intake → workspace scaffolding for new client engagements; populates client-profile, ICP, brand-voice from brief + vertical defaults. | Read, Write, Edit, Bash | sonnet |

**Marketing pod (8)**
| Agent | Mission | Tools | Model |
|---|---|---|---|
| `strategy` | Marketing/GTM strategist; owns campaign briefs, channel/budget split, measurement plans, CRM/lifecycle strategy. | Read, Write, Edit | sonnet |
| `research` | Outward-looking researcher with citations and confidence levels — never opinions. | Read, Write, Edit, WebFetch, WebSearch | sonnet |
| `creative` | Copy and messaging — from a populated creative brief, refuses without one. | Read, Write, Edit | sonnet |
| `brand-design` | Visual direction and brand consistency; pairs with creative. | Read, Write, Edit | sonnet |
| `seo` | Organic search and SEM; on-page briefs, paid-search structure, tracking. | Read, Write, Edit, WebFetch, WebSearch | sonnet |
| `social-media` | Platform-native adaptation, cadence, community signals, trend-jacks. | Read, Write, Edit, WebFetch, WebSearch | sonnet |
| `email-lifecycle` | Segments, drip/nurture/retention sequences, deliverability, lifecycle map. | Read, Write, Edit | sonnet |
| `analytics` | Inward-looking data agent: KPIs, attribution, A/B test design + readouts, dashboards. | Read, Write, Edit, Bash | sonnet |

**Sales pod (6)**
| Agent | Mission | Tools | Model |
|---|---|---|---|
| `sdr` | Outbound prospecting and cold sequencing; ICP-driven account lists, enrichment, sequences, meeting bookings. | Read, Write, Edit, WebFetch, WebSearch | sonnet |
| `inbound-qualifier` | Speed-to-lead routing; scores fit + intent, routes qualified to AE, weak to nurture. | Read, Write, Edit | sonnet |
| `account-executive` | Owns qualified opportunities through close; discovery, demos, multi-threading, deal-record curator. | Read, Write, Edit | sonnet |
| `proposal` | Quote/SOW/proposal generator from populated deal-record; tailors from a pricing/offer library. | Read, Write, Edit | sonnet |
| `account-manager` | Post-sale ownership; onboarding handoffs, expansion/upsell, renewals, churn-risk, save plays. | Read, Write, Edit | sonnet |
| `forecasting` | Pipeline rollup, deal-categorization (commit/best-case/pipeline/omit), slip detection. | Read, Write, Edit | sonnet |

**BD (1)**
| Agent | Mission | Tools | Model |
|---|---|---|---|
| `partnerships` | Partner identification, qualification, co-marketing/co-sell design, lifecycle. | Read, Write, Edit, WebFetch, WebSearch | sonnet |

**Cross-cutting (7)**
| Agent | Mission | Tools | Model |
|---|---|---|---|
| `review` | Final QA gate before any external artifact ships; ship/revise/block verdict. | Read, Write, Edit | sonnet |
| `compliance` | Compliance/legal review: claims vetting, regulated language, ad-platform policy, privacy disclosures, required clauses. | Read, Write, Edit, WebFetch | sonnet |
| `project-manager` | Timelines, dependencies, blockers, ownership; produces status updates, surfaces risk. | Read, Write, Edit, TodoWrite | sonnet |
| `knowledge` | Shared-memory/decision-log curator. **Only agent permitted to write to `knowledge/`.** | Read, Write, Edit | sonnet |
| `competitive-intel` | Competitor pricing/launches/messaging/hiring/ad-creative; battle cards. | Read, Write, Edit, WebFetch, WebSearch | sonnet |
| `voc` | Mines tickets, interviews, transcripts, reviews; surfaces verbatim customer language by theme. | Read, Write, Edit | sonnet |
| `localization` | Multi-language and multi-region adaptation; pre-publication wrap. | Read, Write, Edit | sonnet |

**Sub-vertical specialists — loaded per `client-profile.md` (8)**
| Agent | Mission | Tools | Model |
|---|---|---|---|
| `agency-liaison` | External-agency relationship manager (brand, media, digital production, PR); briefs, deliverables, approval routing, performance. | Read, Write, Edit | sonnet |
| `broker-enablement` | Broker-channel manager: registry, materials, allocation processing, channel development (reactivation + new signings), performance, disputes. **Explicitly does NOT route direct-marketing leads to brokers.** | Read, Write, Edit | sonnet |
| `wealth-channel-enablement` | Parallel HNI / UHNI channel: private banks, family offices, independent introducers; confidential materials, principal-to-principal, multi-unit/floor/building deals. | Read, Write, Edit | sonnet |
| `vvip-channel-enablement` | Ruling families, ministers, senior officials, foreign dignitaries, sovereign-institution principals; protocol, gatekeepers, discretion, PEP/sanctions/FCPA screening. | Read, Write, Edit | sonnet |
| `inventory-manager` | Source-of-truth for unit/allocation availability, pricing tiers, payment plans, hold/reserved/sold; gates customer-facing artifacts that reference inventory. | Read, Write, Edit | sonnet |
| `events` | End-to-end event ownership: planning, scheduling, headcount, invitations, RSVPs, partner/sponsor, comms; coordinates external event agency + internal events team + 3 channel agents. | Read, Write, Edit | sonnet |
| `marketing-procurement` | Vendor selection, RFP/RFQ/sole-source, SOWs, contract terms, performance scorecards, renewals. | Read, Write, Edit | sonnet |
| `marketing-financial-manager` | Budget allocation, PO issuance, accruals, period-close, three-way invoice match, variance, CFO/FP&A reporting. | Read, Write, Edit | sonnet |

### 1.1.2 Skills — `.claude/skills/`

**Does not exist.** No skills concept in the repo. Closest equivalents: vertical playbook + client-profile fields + sub-vertical playbook + per-channel registries.

### 1.1.3 Integrations — `integrations/` (2 specs)

| Path | Status |
|---|---|
| `integrations/canva/spec.md` | Complete — auth model, tool catalogue with risk tiers (A → D), data flow, failure modes |
| `integrations/canva/actions/comment-on-design.md` | Complete — canonical Tier-B write action |
| `integrations/miro/spec.md` | Complete — auth, tool catalogue, three usage patterns |
| `integrations/miro/actions/create-campaign-board.md` | Complete — canonical Tier-C action |

`INTEGRATIONS.md` (root) lists 18 target systems with tier mappings (Salesforce, Tableau, Snowflake, Property Finder/Bayut, diaspora portals, Meta/Google/LinkedIn Ads, HubSpot/Pardot/Marketo, WhatsApp Business API, Email, DocuSign, Bynder, Slack/Teams, Asana/Monday/Jira, Canva, Miro, GitHub) — but only Canva + Miro have spec folders. The other 16 are documented architecturally, not built.

### 1.1.4 Runbooks — `runbooks/`

**Does not exist as a directory.** The closest existing artifact is `verticals/real-estate/sub-verticals/developer/campaign-workflow.md` — a 16-week off-plan campaign workflow with phase-by-phase agent assignments (T-16 pre-brief through T+ongoing construction marketing). This covers a substantial portion of the "new off-plan launch (T-90 to T+30)" runbook intent. No other cross-agent workflow documents exist.

### 1.1.5 Schemas — `schemas/` (8 files)

| Schema | Purpose |
|---|---|
| `handoff-envelope.md` | Inter-agent message wrapper; mandates `client`, `vertical`, `sub_vertical`, `intent`, `payload` shape |
| `client-profile.md` | Canonical client config — created by `client-onboarding`, updated only by `knowledge` |
| `campaign-brief.md` | Strategy → creative/seo/social/email/analytics |
| `creative-brief.md` | Strategy → creative + brand-design |
| `research-brief.md` | Two shapes: request to research, report from research |
| `deal-record.md` | Shared deal state across the sales pod, append-only `activity` log |
| `qa-checklist.md` | Review's exit criteria |
| `integration-action.md` | Wraps every external-system write with risk tier, approval, lifecycle, audit, rollback |

### 1.1.6 Architectural docs (root)

| File | Stated intent (summary) |
|---|---|
| `CLAUDE.md` | Project-wide rules every agent inherits: mandatory client+vertical, three-layer path resolution (client → vertical → root), writes only to client folder, approval gates respect client overrides, compliance flags are sticky, no fabrication |
| `README.md` | Roster + onboarding flow + supported verticals (real-estate only after the recent automotive removal) |
| `ARCHITECTURE.md` | Multi-tenant principles, context resolution, marketing campaign + sales motion flows, approval gates, schema list, shared-memory layers, instructions for adding agents/verticals |
| `INTEGRATIONS.md` | Tier system, 18-system mapping, phased rollout, credential policy |

### 1.1.7 Vertical content — `verticals/`

- `verticals/real-estate/playbook.md` — UAE-flavored real-estate base playbook (Property Finder, Bayut, RERA mentioned)
- `verticals/real-estate/monitoring.yml` — public-source monitoring config
- `verticals/real-estate/sub-verticals/developer/playbook.md` — developer-specific overlay
- `verticals/real-estate/sub-verticals/developer/campaign-workflow.md` — 16-week off-plan workflow
- 6 channel-development playbooks under `sub-verticals/developer/playbooks/`:
  - `broker-channel-reactivation`, `broker-channel-new-firm-signing`
  - `wealth-channel-reactivation`, `wealth-channel-new-relationship-signing`
  - `vvip-channel-cultivation`, `vvip-channel-dormant-refresh`

### 1.1.8 Worked example — `clients/_examples/aldar-developments/`

34 files across: client-profile, knowledge (icp/brand-voice/decisions/results/playbooks), inventory (current + snapshot), brokers (registry + 1 firm profile), agencies (Memac Ogilvy + Havas MENA), wealth-channels/registry, vvip-channel/registry + protocol-library, reciprocity-ledger, marketing-budget, sales (rm-team + allocation-rules + pipeline), vendors (registry + 1 vendor profile), events (4 events), campaigns (1 campaign with brief + creative-brief).

### 1.1.9 Web layer — `web/`

Next.js 16 + React 19 + Tailwind + Anthropic SDK. Reads markdown content from the repo root at build time. Surfaces 14 client-detail tabs + per-event/per-vendor/per-broker detail pages + chat (Claude Sonnet 4.5 with chief-commercial-officer system prompt) + 3-mode simulator (direct-lead → in-house RM, broker allocation request, broker overflow exception) + new-client form + approvals (open-PR feed). 

**The web layer is dynamic against the repo content** — `lib/content.ts` walks directories. Adding/renaming agents, verticals, or playbooks does not require code changes.

### 1.1.10 Other infrastructure

- `.github/workflows/monitoring.yml` — nightly monitoring scrape via `monitoring/scan.mjs`
- `.github/workflows/web-ci.yml` — `next build` on PRs touching repo content
- `monitoring/scan.mjs` — public-source scraper that commits findings to `clients/<slug>/knowledge/monitoring/<date>.md`

---

## 1.2 Architectural Read (the repo's own pattern)

- **Orchestrator:** `chief-commercial-officer` (frontmatter is `model: opus`). It is the top-level router and CEO. It dispatches `handoff-envelope` payloads to specialists. It can author new agents.
- **Manager tier:** No explicit "manager" tier exists. The chief-commercial-officer routes directly to specialists. Some specialists (e.g. `events`, `agency-liaison`, `broker-enablement`, `wealth-channel-enablement`, `vvip-channel-enablement`, `inventory-manager`, `marketing-procurement`, `marketing-financial-manager`) are themselves coordinators that talk to multiple sub-agents and external counterparties — they function as managers in practice without being labeled as such.
- **Specialist tier:** All other agents (creative, brand-design, sdr, account-executive, etc.).
- **Hand-off mechanism:** `schemas/handoff-envelope.md`. Every inter-agent message is a structured payload (not prose) with `client`, `vertical`, optional `sub_vertical`, `intent`, `references`, `schema`, `payload`, `needs_human_approval`, `deadline`, `priority`. Five canonical schemas (campaign-brief / creative-brief / research-brief / deal-record / qa-checklist) plus one envelope (integration-action) for any write to an external system.
- **Logging / audit:** Implicit through git on the markdown layer; `decisions.md` and `results.md` are append-only by convention; `integration-action` envelopes carry `audit` fields (trace_id, retention_days, rollback). No explicit per-run agent log directory.
- **Naming convention:** kebab-case across agents, schemas, runbook playbooks, and folders. Underscored conventions only inside YAML keys (e.g. `engagement_id`, `pep_screening_status`). No division prefix. Folder convention: `_template/`, `_examples/`, `_shared/` (the underscore prefix marks non-real engagements).
- **Multi-tenant + multi-vertical:** Three-layer context resolution (`clients/<slug>/knowledge/...` → `verticals/<vertical>/sub-verticals/<sub>/playbook.md` → `verticals/<vertical>/playbook.md` → root `knowledge/`). Writes always go to the client folder; promotion to vertical or root requires `knowledge` agent + chief-commercial-officer approval. Sub-vertical exists for `real-estate/developer`.
- **Approval-gate model:** Per-client `approval_gates` block in `client-profile.md` overrides the global defaults in `ARCHITECTURE.md`. Four risk tiers in INTEGRATIONS.md: A (read-only), B (explicit human), C (policy-based), D (autonomous after observation).

---

## 1.3 Quality Read (per agent, against the §3 template in the prompt)

The §3 template specifies 11 body sections. Most existing agents cover 1–5 well; most are light or absent on 6–11. Below: per-agent verdict against the template + UAE-grounding + drift signals.

### Solid (✅ — no action)

None of the existing agents fully meet the §3 template (none have all 11 sections, none have example invocations, almost none have a tabular handoff matrix). However, several are *operationally solid* and their gaps are mostly the template's "9. Compliance guardrails (UAE-specific)" and "11. Example invocations" — additions, not corrections. The prompt's spirit ("leave it alone if it works") suggests treating these as ✅ unless extension is approved.

`chief-commercial-officer`, `client-onboarding`, `events`, `agency-liaison`, `broker-enablement`, `wealth-channel-enablement`, `vvip-channel-enablement`, `inventory-manager`, `marketing-procurement`, `marketing-financial-manager`, `knowledge`, `forecasting` — these have substantive missions, clear in/out-of-scope, KPIs, and escalation rules. They are "solid in mission, light in template-conformance."

### Light (🟡 — extend without rewriting)

Every existing agent is light against the §3 template on at least these items:
- **Section 9 (UAE-specific compliance guardrails)** — most agents reference compliance generically. None mention DLD, ADGM, ADREC, CBUAE LTV caps, PDPL, AML/CFT DNFBP obligations, Oqood/Trustee Account/NOC flows, or Abu Dhabi Law No. 3 of 2015 directly. The Aldar `client-profile.md` flags some (`ADGM`, `RERA`, `PEP`, `sanctions-screening`) and the developer playbook touches RERA + financial-promotion, but the agent prompts themselves are vertical-agnostic (by design — multi-tenant) and rely on the client profile + vertical playbook to inject UAE context. **This is a deliberate design choice**: the agents stay generic, the UAE specificity lives in the vertical and client layers. The prompt's "UAE-grounded" quality bar can be met by **strengthening the vertical and per-agent UAE-pertinent compliance pointers**, not by hard-coding UAE rules into every agent.
- **Section 11 (Example invocations)** — none have these.
- **Section 7 (Handoff matrix as a table)** — most prose-form their handoff rules.
- **Tools usage rules** — most agents declare tools in frontmatter and put restrictions in the "What you do NOT do" section. The §3 template wants this called out separately.

### Drift (🟠 — minimum correction)

- `compliance` — generic; mentions "GDPR, CCPA, CASL, CAN-SPAM, region-specific consent" but not UAE specifics (PDPL, DLD/RERA off-plan disclosure, ADGM-FSRA, Trakheesi advertising approval). For an Aldar engagement this is a meaningful gap. **Proposed correction:** add a UAE-specific pointer block referencing the vertical playbook + a per-jurisdiction rules table; do NOT rewrite the agent.
- `account-manager` — uses generic "customer success" language. For a developer client, "post-sale" means owners during the construction-to-handover window (24–48 months), not SaaS-style retention. The agent's prose is correct in spirit but doesn't speak the developer-context vocabulary. **Proposed correction:** light edit to acknowledge the sub-vertical pattern via the vertical playbook resolution.
- `proposal` — focuses on SOW/quote/proposal generation. For real-estate, "proposal" is closer to reservation form / SPA-precursor / payment-plan customization. The agent body acknowledges this in a real-estate-specific paragraph but it's secondary. **No change needed if `deal-desk-analyst` is added** — the deal-desk concept is what the §3 prompt is asking for.
- `partnerships` — frames "partner" as co-marketing partner. For Aldar, "partnerships" includes things like Aldar Education school partnerships, hospitality operator JVs, asset-class partners (data-center JV, London Square subsidiary). Drift is mild and the agent's framework adapts.

### Missing (🔴 — propose creating)

The target roster in the prompt names ~28 agents across sales, CRM, marketing, wealth/VVIP/brokers, and cross-cutting. ~14 have direct equivalents under different (or same) names. ~14 are missing or absorbed into adjacent agents. Specific missing-or-light list moves to `GAPS.md`.

### Not applicable

- The "manager / specialist" two-tier structure implied by the prompt's roster (sales-manager, crm-manager, marketing-manager, wealth-vvip-manager) is **not how this repo is wired**. The chief-commercial-officer routes directly to specialists. Adding a per-pod manager tier is possible but it's an architectural change, not a gap-fill. Worth flagging for human decision.

---

## 1.4 Inheritance from this repo's design (constraints for any extension)

These are non-negotiable from CLAUDE.md + ARCHITECTURE.md and bind any new agent / skill / runbook:

1. **Multi-tenant.** No agent embeds client-specific data. Aldar specifics live in `clients/_examples/aldar-developments/` and `verticals/real-estate/sub-verticals/developer/`.
2. **Three-layer context resolution.** Any new agent must use the same path-resolution rule.
3. **Knowledge agent is the only writer to `knowledge/`.** New agents that learn must route updates through it.
4. **Writes outside the client folder need promotion.** Vertical-level playbook edits via `knowledge` + chief-commercial-officer approval, never directly.
5. **External writes wrapped in integration-action.** Tier-A default, promote one tier at a time.
6. **No fabrication.** TODO markers + escalation, not invented details.
7. **Naming.** kebab-case files, kebab-case agent names, no division prefix unless it's a managerial layer that the user explicitly approves.

These constraints will shape PLAN.md.
