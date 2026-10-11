# Flow

**A white-label multi-agent marketing, sales, and CRM agency.** Run your agency on a polyphonic AI team that plans, executes, and reviews every commercial brief for every client you serve — packaged so you can re-sell it under your own brand.

## What this is

Flow is a product for marketing agencies, GTM consultancies, and in-house commercial leaders who want the leverage of a 50-person commercial team without the headcount. The system is a **core of marketing, sales, and CRM agents** that ships with every deployment, plus **industry packs** that snap on for verticals that need them. The shipping pack today is `rak-media` — a government-mandated multi-surface media operator; auto-retail, professional-services, F&B-multi-unit, and B2B-SaaS packs are on the roadmap.

Three properties define the product:

1. **Multi-tenant by default** — one Flow instance serves many clients. Every artifact is scoped to a `client` slug and a `pack`.
2. **Core + packs** — the 3-pod commercial team is universal. Industry packs add the specialist agents and skills that a particular vertical demands.
3. **Re-sellable** — outputs, dashboards, decision queues, and the `/cco` daily surface are designed to be presented to your end-client. No Flow-branding leaks into the artifacts.

## The core product (every deployment ships with this)

The core is the **marketing + sales + CRM** commercial team, orchestrated by a Chief Commercial Officer agent and four pod managers.

**C-level (orchestration)**
- `chief-commercial-officer` — decomposes goals, dispatches to pods, runs the handoff cadence, escalates blockers
- `client-onboarding` — scaffolds a new client workspace from intake brief + matched industry pack
- `cco-morning-brief` — daily 07:00 synthesis of pipeline, revenue-line pacing, marketing throughput, CRM health, decisions due
- `horizon-scanner` — daily 06:00 outward scan for commercially-material signal
- `risk-register-curator` — live commercial risk register
- `decision-router` — classifies and routes decision-asks per client `approval_gates`

**Marketing pod** (orchestrated by `marketing-manager`)
- `strategy` · `research` · `creative` · `brand-design` · `seo` · `social-media` · `email-lifecycle` · `analytics` · `content-pr-specialist` · `martech-ops-specialist`

**Sales pod** (orchestrated by `sales-manager`)
- `sdr` · `inbound-qualifier` · `account-executive` · `proposal` · `account-manager` · `forecasting` · `deal-desk-analyst`

**CRM pod** (orchestrated by `crm-manager`)
- `email-lifecycle` (CRM-side) · `voc` · `service-recovery-specialist` · `data-quality-steward`

**Business development**
- `partnerships`

**Cross-cutting**
- `review` (final QA) · `compliance` (claims, policy, privacy) · `project-manager` · `knowledge` (memory curator) · `competitive-intel` · `localization`

## Industry packs (snap-on per client)

A pack adds the agents, skills, runbooks, and vertical playbook that a specific industry needs on top of the core. Packs are activated per client in `client-profile.md` — agents outside the active pack stay dormant.

### Pack: `rak-media` (shipping today)

The pack for a government-mandated multi-surface media operator in the UAE evolving from institutional comms into a commercial IP + partnership platform. Modelled on RAK Media's position ahead of Wynn Al Marjan (guided Sep 2027) and the 2028 hotel wave, with ADM and DMI as structural benchmarks.

**Commercial-sales specialists**
- `partnerships-director` — category-exclusive Official Partner positions (Expo-style, 6 slots)
- `sponsorship-manager` — title sponsors on franchises + tentpole events
- `ad-sales-director` — spot inventory (hard-ceiling fourth revenue line); card-rate discipline; Dubai desk
- `commercial-intelligence-analyst` — signal-to-revenue pipeline from filings, launches, agency moves

**Content + IP specialists**
- `franchise-ip-manager` — named IP franchises (Destination RAK, Jebel Jais, Heart of RAK) extended across radio + social + YouTube + podcast (Majid pattern)
- `multi-platform-producer` — one engine, one calendar, one rights framework across the four surfaces
- `rights-licensing-coordinator` — gates every commercial package; UAE Media Council licensing; Ruler-touching content refusal

**Audience + stakeholder specialists**
- `audience-measurement-analyst` — PwC/Nielsen-style currency; the operator cannot sell what this agent cannot measure
- `government-stakeholder-manager` — Ruler's Court, GSEC, federal counterparts, visiting delegations; protocol gating

**Skills loaded with the pack** — uae-media-regulation · media-sales-currency · partnership-position-pricing · franchise-ip-mechanics · government-stakeholder-protocol · adm-dmi-structural-lessons · wynn-opening-run-in.

### Packs on the roadmap

- `auto-retail` — dealer-network enablement, F&I desk, test-drive orchestration, JATO/AutoData feeds
- `professional-services` — proposal-led sales, partner-managed funnels, fee-realization analytics
- `f-and-b-multi-unit` — local-marketing, loyalty, franchisee enablement
- `b2b-saas` — PLG instrumentation, expansion motions, usage-driven CRM

Clients in industries no pack covers yet run on `_default` plus their own client overrides. The pack is a sharpener, not a prerequisite.

## Multi-client architecture

Three layers of context, resolved most-specific first:

```
clients/<slug>/knowledge/...     ← client overrides (their ICP, voice, decisions, results)
verticals/<pack>/playbook.md     ← industry-pack defaults (audience, revenue lines, KPIs)
knowledge/...                    ← team-level baseline (cross-client, cross-pack)
```

- **Per-client** folders hold the engagement's memory. Writes always go here.
- **Industry-pack playbooks** capture patterns common across most clients in that pack — audience segments, revenue lines, trigger events, channel mix, KPI norms, compliance flags.
- **Root knowledge** is the operator's cross-client baseline (your agency's house style, your retainer playbooks).

Promotion (client → pack → root) happens only when a pattern appears across 2+ clients, with `chief-commercial-officer` approval, executed by the `knowledge` agent.

## Integrations

Flow agents read from and (with human approval) write to your existing stack — Salesforce, HubSpot, Meta / Google Ads, LinkedIn, WhatsApp Business, DocuSign, Snowflake, Looker, plus pack-specific integrations (audience-currency panels, UAE Media Council systems for `rak-media`). Every external write goes through an `integration-action` envelope (`schemas/integration-action.md`) with explicit human approval until a per-client policy promotes it. See `INTEGRATIONS.md` for the tier system (A: read-only → D: autonomous) and the phased rollout.

## How a Flow engagement runs

1. **Onboard** — `client-onboarding` takes an intake brief, picks the right industry pack (or `_default`), scaffolds `clients/<slug>/`, seeds `client-profile.md`, `icp.md`, `brand-voice.md`.
2. **Orchestrate** — for any goal, `chief-commercial-officer` decomposes into a plan and dispatches to `marketing-manager`, `sales-manager`, or `crm-manager`.
3. **Execute** — pod specialists run against structured briefs (`schemas/`) and emit structured outputs.
4. **Gate** — `review` + `compliance` + (when needed) `localization` + pack-specific gates (`rights-licensing-coordinator` for `rak-media`) gate every external artifact.
5. **Surface** — the `/cco` daily page surfaces the morning brief, decisions queue, risk register, horizon scan, and calendar for the human CCO to act on.
6. **Learn** — `knowledge` captures decisions and results into the client folder and promotes cross-client patterns up to the pack playbook.

See `ARCHITECTURE.md` for handoff flows, approval gates, and resolution rules.

## Repo layout

```
.claude/agents/        # one .md per agent (Claude Code subagent format)
.claude/skills/        # framework + reference skills loaded by agents and packs
schemas/               # shared templates for inter-agent handoffs
clients/               # per-client engagements (one folder per slug)
  _template/           # scaffold copied for new clients
  _examples/           # demo clients (e.g. rak-media)
verticals/             # industry-pack playbooks
  rak-media/           # government-mandated multi-surface media operator pack
integrations/          # per-system specs + action contracts
runbooks/              # multi-agent choreography for recurring scenarios
knowledge/             # team-level cross-client baseline
web/                   # Next.js operator surface — landing, /cco, /clients, /agents
ARCHITECTURE.md        # handoff flows, approval gates, design choices
CLAUDE.md              # project-wide rules every agent inherits
CHANGELOG.md           # versioned change log
```

## Onboarding a new client

Inside Claude Code, tell the orchestrator: *"Onboard a new client, slug `rak-media`, rak-media pack, government-mandated multi-surface operator ahead of Wynn opening."* `client-onboarding` will ask for the missing inputs (voice, integrations, approval gates, hard constraints), copy the template, seed the profile, and hand back to `chief-commercial-officer` with a recommended first piece of work.

## Pitching Flow to your end-clients

The `/cco` surface is built to be opened in front of the buyer. The morning brief, decisions queue, risk register, horizon scan, and calendar are written in the buyer's language — never in Flow's language. The `/agents` directory shows the team that's working their account. The `/clients/<slug>` workspace is their evidence file.

Branding, voice, and disclosure are per-client overrides in `client-profile.md`. Run Flow as your agency; the buyer sees their agency.
