# POLYAI

Polyphonic multi-agent AI system — a marketing, sales, and business development team built as Claude Code subagents, designed to be **adapted per client and per vertical**.

## What this is

A team of specialized agents that plan, execute, and review marketing and sales work for *any* client in *any* supported vertical. Each agent lives in `.claude/agents/` as a Markdown file. The Orchestrator (CEO) routes work between them; vertical playbooks supply industry defaults; per-client folders hold each engagement's memory.

## Team roster

**Executive**
- `chief-commercial-officer` — CEO. Decomposes goals, assigns work, runs handoffs, can author new agents.
- `client-onboarding` — stands up a new client workspace from an intake brief plus the matching vertical playbook.

**Marketing pod**
- `strategy` — campaign plans, GTM, CRM strategy
- `research` — market, audience, trend research
- `creative` — copy and messaging
- `brand-design` — visual direction and brand consistency
- `seo` — organic search and SEM
- `social-media` — platform-native content and community
- `email-lifecycle` — segmentation, nurture, retention email
- `analytics` — KPIs, attribution, A/B test readouts

**Sales pod**
- `sdr` — outbound prospecting and cold sequences
- `inbound-qualifier` — inbound lead scoring and routing
- `account-executive` — discovery, demos, deal management
- `proposal` — quotes, SOWs, proposals
- `account-manager` — expansion, retention, renewals
- `forecasting` — pipeline rollup and deal-slip detection

**Business development**
- `partnerships` — partner identification, outreach, co-marketing

**Cross-cutting**
- `review` — final QA against brief and brand
- `compliance` — claims, regulated language, ad policy, privacy
- `project-manager` — timelines, dependencies, blockers
- `knowledge` — curates shared memory across clients and verticals
- `competitive-intel` — competitor pricing, launches, messaging, ads
- `voc` — voice-of-customer: support tickets, reviews, calls
- `localization` — multi-language, multi-region adaptation

**Sub-vertical specialists** (loaded per client based on `client-profile.md`)
- `agency-liaison` — manages external creative / media / digital / PR agencies (real-estate developer, larger B2C)
- `broker-enablement` — broker channel: registry, materials, allocations, channel development (reactivation + new signings), performance, disputes (real-estate developer, channel-led B2B)
- `wealth-channel-enablement` — parallel HNI / UHNI channel: private banks, family offices, independent introducers; confidential materials, principal-to-principal, multi-unit / floor / building deals (luxury / branded residences / ultra-prime)
- `vvip-channel-enablement` — ruling families, ministers, senior officials, foreign dignitaries, sovereign-institution principals; protocol, gatekeepers, discretion, PEP / sanctions / FCPA screening (high-end / government-adjacent engagements)
- `inventory-manager` — source-of-truth for unit / allocation availability, pricing, status; gates customer-facing artifacts that reference inventory (real-estate developer)
- `events` — end-to-end event ownership: planning, scheduling, headcount, invitations, RSVPs, partner / sponsor coordination, comms; coordinates external event agency + internal events team + channel agents for invitation lists; pairs with marketing-procurement and marketing-financial-manager for the commercial side
- `marketing-procurement` — vendor selection, RFP / RFQ / sole-source processes, SOWs, contract terms, performance scorecards, renewal management for everything marketing buys
- `marketing-financial-manager` — marketing-budget allocation, PO issuance + tracking, accruals, invoice approvals, period-close discipline, variance analysis, CFO / FP&A reporting

## Multi-client + multi-vertical model

POLYAI is a service operator. Three layers of context, resolved most-specific first:

```
clients/<slug>/knowledge/...     ← client overrides (their ICP, voice, decisions, results)
verticals/<vertical>/playbook.md ← industry defaults (real-estate, ...)
knowledge/...                    ← team-level baseline (cross-client, cross-vertical)
```

- **Per-client** folders hold the engagement's memory. Writes always go here.
- **Vertical playbooks** capture patterns that apply to most clients in an industry — audience archetypes, trigger events, channel mix, KPI norms, compliance flags, voice notes, common pitfalls.
- **Root knowledge** is the team's cross-client baseline.

Promotion (client → vertical → root) happens only when a pattern appears across 2+ clients, with `chief-commercial-officer` approval, executed by the `knowledge` agent.

## Supported verticals (today)

- `real-estate` — residential / investor / off-plan / commercial
  - `real-estate / developer` (sub-vertical) — master developers + project developers running off-plan launches with agency partners and broker networks (Aldar / Emaar / Damac / Sobha class)

Sub-verticals layer on top of their parent vertical. A client whose profile has `vertical: real-estate, sub_vertical: developer` inherits both the real-estate playbook and the developer overlay. See `ARCHITECTURE.md` for the resolution rules.

Adding a new vertical (or sub-vertical) means writing a `verticals/<name>/playbook.md` (or `verticals/<vertical>/sub-verticals/<sub-vertical>/playbook.md`) to the same shape as the existing one. The `chief-commercial-officer` can author one; you'd typically only do this when the second client in that industry needs different defaults than any existing vertical.

## Integrations

POLYAI agents can read from and (with human approval) write to your existing tooling — Salesforce, HubSpot, Meta / Google Ads, Property Finder, Tableau, WhatsApp Business, DocuSign, etc. Every external write goes through an `integration-action` envelope (see `schemas/integration-action.md`) with explicit human approval until a per-client policy promotes it. See `INTEGRATIONS.md` for the full architecture and phased rollout.

## How they work together

1. A new engagement starts with `client-onboarding` — intake brief in, populated `clients/<slug>/` workspace out.
2. For any goal, the **Orchestrator** identifies the active client + vertical, then decomposes into a sequenced plan.
3. Pod agents execute against structured briefs (see `schemas/`) and emit structured outputs.
4. **Review** + **Compliance** + (when relevant) **Localization** gate every external artifact.
5. **Knowledge** captures decisions and results into the client folder, and promotes cross-client patterns up to the vertical playbook.
6. **Project-manager** tracks who owes what to whom and surfaces blockers.

See `ARCHITECTURE.md` for handoff flows, approval gates, and the resolution rules.

## Repo layout

```
.claude/agents/        # one .md per agent (Claude Code subagent format)
schemas/               # shared templates for inter-agent handoffs
clients/               # per-client engagements (one folder per slug)
  _template/           # scaffold copied for new clients
verticals/             # industry defaults
  real-estate/
knowledge/             # team-level cross-client baseline
ARCHITECTURE.md        # handoff flows, approval gates, design choices
CLAUDE.md              # project-wide rules every agent inherits
```

## Onboarding a new client

Inside Claude Code, give the Orchestrator a goal mentioning a new client. It will invoke `client-onboarding` first. Onboarding will:

1. Ask for the minimum inputs (slug, vertical, what they sell, primary market, voice, integrations, approval gates, hard constraints).
2. Pick the matching `verticals/<vertical>/playbook.md` as defaults.
3. Copy `clients/_template/` to `clients/<slug>/` and seed `client-profile.md`, `icp.md`, `brand-voice.md`.
4. Hand back to the Orchestrator with a status summary and a recommended first piece of work.

## Using the team after onboarding

> "Plan a 6-week new-launch campaign for **acme-realty** — Q3 launch of an off-plan tower targeting investors in the GCC."

The Orchestrator stamps `client: acme-realty, vertical: real-estate` on every handoff. Strategy reads `clients/acme-realty/knowledge/icp.md` first, falls back to `verticals/real-estate/playbook.md` for trigger events and channel mix, and dispatches Creative + SEO + Social briefs from there. Compliance is auto-included because off-plan investor marketing has regulatory weight in most markets.
