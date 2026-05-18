# Flow

**The CCO operating system for UAE real-estate developers.** A multi-agent commercial team — marketing, sales, CRM, and wealth/VVIP channels — orchestrated by a Chief Commercial Officer agent. One coherent dashboard for the human CCO's morning brief, decisions queue, launch tracker, and broker / wealth / VVIP channel surfaces.

For the elevator pitch and what's in scope, read `PRODUCT.md`. For the agent architecture, read `ARCHITECTURE.md`. For phase-by-phase history, read `CHANGELOG.md`.

## What this is

Flow is built for the Chief Commercial Officer of a UAE master-developer — Abu Dhabi or Dubai anchored, multi-emirate portfolio, AED-billion-class. The agent team knows DLD, RERA, ADREC, ADGM, CBUAE, PDPL, off-plan launch mechanics, broker tier mechanics, wealth-channel discretion, and VVIP protocol.

The architecture is **core + packs**: a universal four-pod commercial core that runs on every deployment, plus optional industry packs that activate specialist agents for specific verticals. Today the shipping pack is `real-estate-uae`. Other packs are scaffolded in the architecture but not built.

## The core team (every deployment)

Four pods, one CCO. The chief-commercial-officer agent orchestrates; pod managers route to specialists; specialists do the work.

**C-level (orchestration)**
- `chief-commercial-officer` — decomposes goals, dispatches to pods, runs the handoff cadence, escalates blockers
- `client-onboarding` — scaffolds a new client workspace from intake brief + matched pack
- `cco-morning-brief` — daily 07:00 synthesis (pipeline, channel mix, marketing pacing, CRM health, decisions)
- `horizon-scanner` — daily 06:00 outward scan for commercially-material signal
- `risk-register-curator` — live commercial risk register
- `decision-router` — classifies and routes decision-asks per client `approval_gates`

**Marketing pod** (`marketing-manager`)
- `strategy` · `research` · `creative` · `brand-design` · `seo` · `social-media` · `email-lifecycle` · `analytics` · `content-pr-specialist` · `martech-ops-specialist` · `agency-liaison` · `events` · `marketing-procurement` · `marketing-financial-manager`

**Sales pod** (`sales-manager`)
- `sdr` · `inbound-qualifier` · `account-executive` · `proposal` · `account-manager` · `forecasting` · `deal-desk-analyst` · `secondary-market-specialist`

**CRM pod** (`crm-manager`)
- `email-lifecycle` (CRM-side) · `voc` · `service-recovery-specialist` · `data-quality-steward`

**Wealth / VVIP pod** (`wealth-vvip-manager`)
- `broker-enablement` · `wealth-channel-enablement` · `vvip-channel-enablement` · `vip-relationship-manager` · `aml-kyc-compliance-specialist`

**Cross-cutting** (no pod manager)
- `review` (final QA) · `compliance` (claims, policy, privacy) · `project-manager` · `knowledge` (memory curator) · `competitive-intel` · `localization` · `regulatory-research-specialist` · `legal-liaison` · `data-room-curator` · `partnerships`

## Industry pack — `real-estate-uae` (shipping)

The pack a UAE master-developer engagement activates on top of the core team. Folder: `verticals/real-estate/`. See `verticals/real-estate/pack-manifest.md` for the canonical activation list — pack-specific agents, skills, runbooks, compliance flags, and approval-gate defaults.

Highlights:
- **14 pack runbooks** at `verticals/real-estate/runbooks/`: RERA exposure, Trakheesi permit lifecycle, NOC resale, PEP/sanctions hit, broker collapse, construction delay, handover snagging, UHNW press-sensitive, AML/KYC integration go-live, international roadshow, regulator inquiry, project safety crisis, inbound HNW private bank, broker onboarding to first deal.
- **12 pack skills** at `verticals/real-estate/skills/`: UAE real-estate regulatory framework, AML/KYC UAE real-estate, broker operations, wealth-channel operations, VVIP protocol UAE, off-plan launch mechanics, payment-plan structures, dispute resolution UAE, regulatory disclosure language, diaspora corridor marketing, project fact pack, owner community governance.
- **One sub-vertical today** — `developer/`. Brokerage and portal sub-verticals are on the roadmap.

Packs on the roadmap but not built: `auto-retail`, `professional-services`, `f-and-b-multi-unit`, `b2b-saas`.

## Multi-client architecture

Three layers of context, resolved most-specific first (per `CLAUDE.md`):

```
clients/<slug>/knowledge/...     ← client overrides (their ICP, voice, decisions, results)
verticals/<pack>/playbook.md     ← industry-pack defaults (audience, channel mix, KPIs)
knowledge/...                    ← team-level baseline (cross-client templates)
```

- **Per-client** folders hold the engagement's memory. Writes always go here.
- **Pack playbooks + skills + runbooks** capture patterns common across clients on that pack.
- **Root knowledge** is the lowest-priority fallback — templates that `client-onboarding` reads when scaffolding a new client.

Promotion (client → pack → root) requires the pattern to appear across 2+ clients, with `chief-commercial-officer` approval, executed by the `knowledge` agent.

## Integrations

Flow agents read from and (with human approval) write to the existing stack — Salesforce Real Estate Cloud, Salesforce Marketing Cloud, Property Finder, Sumsub (KYC/AML), Bynder (DAM), WhatsApp Business API, DocuSign, Tableau/Power BI, calendar (Google / M365), news + sanctions feeds. Every external write goes through an `integration-action` envelope (`schemas/integration-action.md`) with explicit approval until a per-client policy promotes it. See `INTEGRATIONS.md` for the tier system (A: read-only → D: autonomous) and rollout sequence.

## How a Flow engagement runs

1. **Onboard** — `client-onboarding` takes an intake brief, activates the `real-estate-uae` pack, scaffolds `clients/<slug>/`, seeds profile / ICP / brand-voice from the pack playbook + the intake.
2. **Orchestrate** — for any goal, `chief-commercial-officer` decomposes into a plan and dispatches to the relevant pod manager.
3. **Execute** — pod specialists run against structured briefs (`schemas/`) and emit structured outputs.
4. **Gate** — `review` + `compliance` + `aml-kyc-compliance-specialist` (when in scope) + `localization` (per market) gate every external artifact.
5. **Surface** — the `/cco` daily page surfaces the morning brief, decisions queue, risk register, horizon scan, and calendar for the human CCO.
6. **Learn** — `knowledge` captures decisions and results into the client folder, promotes cross-client patterns to the pack.

## Repo layout

```
.claude/agents/             # one .md per agent (Claude Code subagent format)
.claude/skills/             # core skills (KPI framework, CRM data model, attribution) — any pack
runbooks/                   # core runbooks (CCO daily, board prep, integration go-lives, strategic bet eval) — any pack
verticals/
  real-estate/              # `real-estate-uae` pack folder
    pack-manifest.md        # canonical activation list
    playbook.md             # pack-level patterns
    skills/                 # 12 pack-specific skills
    runbooks/               # 14 pack-specific runbooks
    sub-verticals/
      developer/            # sub-vertical playbook + channel-development plays
clients/
  _template/                # scaffold copied for new clients
  _examples/
    uae-developments/       # worked-example workspace (illustrative, not real data)
schemas/                    # shared templates for inter-agent handoffs
integrations/               # per-system specs + action contracts
knowledge/                  # team-level cross-client templates (lowest-priority fallback)
web/                        # Next.js operator surface — homepage, /cco, /clients, /launches, /agents
PRODUCT.md                  # what this product is (elevator pitch + walkthrough)
ARCHITECTURE.md             # handoff flows, approval gates, design choices
CLAUDE.md                   # project-wide rules every agent inherits
CHANGELOG.md                # versioned change log
```

## Onboarding a new client

Inside Claude Code, tell the orchestrator: *"Onboard a new client, slug `acme-developments`, real-estate-uae pack, off-plan launch in Q3."* `client-onboarding` will ask for the missing inputs (voice, integrations, approval gates, hard constraints), copy the template, seed the profile, and hand back to `chief-commercial-officer` with a recommended first piece of work.

## Touring the deployment

Open the web surface and walk:

1. `/` — positioning + pod structure
2. `/cco` — morning brief, top decision in the queue
3. `/launches` — pick the active Q3 launch, click into events & brokers depth
4. `/clients/uae-developments` — three macro-tabs (Workspace / Inventory & launches / Channels)
5. `/approvals` — inline sign-off with scope filtering
6. `/chat` — the CCO agent scoped to the active workspace
7. `/agents` — the full team by pod with hand-off matrices

See `PRODUCT.md` for the full 90-second walkthrough script.
