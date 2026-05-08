# Architecture

How Flow's agents are wired together.

## Design principles

1. **Multi-tenant by default.** Flow runs as a service for many clients across multiple verticals. Every artifact is tied to a `client` slug and a `vertical`.
2. **Three-layer context, resolved most-specific first.** Client overrides → vertical defaults → team baseline. See "Context resolution" below.
3. **Structured handoffs over prose.** Every agent-to-agent transfer is a populated template (`schemas/`). No "here's a paragraph, please figure it out."
4. **Shared memory is the spine.** Memory is layered (per client, per vertical, team-wide) and curated only by the `knowledge` agent. Other agents request updates through it.
5. **Review is layered, not terminal.** Lightweight peer checks at each handoff plus a final QA pass. Compliance is a separate gate before anything goes external.
6. **Human approval gates are explicit, with per-client overrides.** Defaults below; per-client `approval_gates` in `clients/<slug>/client-profile.md` win.
7. **The Orchestrator is top-down for campaigns, reactive for deals.** Marketing campaigns are decomposed and assigned by the CEO. Sales work is mostly triggered by deal-state changes.

## Context resolution

When any agent reads context, it consults sources in this order:

1. **`clients/<client>/knowledge/...`** — client-specific overrides (their ICP, voice, decisions, results, playbooks)
2. **`verticals/<vertical>/sub-verticals/<sub-vertical>/playbook.md`** — sub-vertical specialization (when set on the client profile)
3. **`verticals/<vertical>/playbook.md`** — industry defaults (audience archetypes, trigger events, channel mix, KPIs, compliance flags, voice notes, common pitfalls)
4. **`knowledge/...`** (root) — team-level cross-client baseline

Writes always go to `clients/<client>/...`. Promotion to `verticals/...` or root `knowledge/...` happens only when a pattern appears across 2+ clients, with `chief-commercial-officer` approval, executed by the `knowledge` agent.

This rule is also captured in `CLAUDE.md` so every agent inherits it as standing instruction.

## External-system writes

Any agent action that touches an external system (CRM, ad platform, email, messaging, e-signature, BI) is wrapped in an `integration-action` envelope per `schemas/integration-action.md`. See `INTEGRATIONS.md` for the full architecture, the tier system (A: read-only → D: autonomous), and the phased rollout for typical engagements.

## Pods

```
                       ┌────────────────────┐
                       │    Orchestrator    │  (CEO)
                       └─────────┬──────────┘
                                 │
                       ┌─────────┴──────────┐
                       │ client-onboarding  │  (intake → workspace)
                       └─────────┬──────────┘
            ┌────────────────────┼────────────────────┐
            ▼                    ▼                    ▼
      Marketing Pod         Sales Pod            BD Pod
            │                    │                    │
            ▼                    ▼                    ▼
    Cross-cutting: review · compliance · pm · knowledge · ci · voc · localization

  Memory layers (read by all):
    clients/<slug>/  →  verticals/<vertical>/  →  knowledge/  (root)
```

## Marketing campaign flow

```
Goal
 └─▶ Orchestrator
      ├─▶ Research        → audience + market brief        ──┐
      ├─▶ Competitive-intel → competitor snapshot          ──┤
      ├─▶ VoC              → customer-language themes      ──┤
      │                                                      ▼
      ├─▶ Strategy         → campaign plan (channels, KPIs, dates)
      │                          │
      │           ┌──────────────┼─────────────────┐
      │           ▼              ▼                 ▼
      ├─▶ Creative      ├─▶ Brand-design     ├─▶ SEO / Social / Email
      │     (copy)            (visuals)            (channel adaptation)
      │           │              │                 │
      │           └──────┬───────┴─────────────────┘
      │                  ▼
      ├─▶ Review              (against brief + brand)
      ├─▶ Compliance          (claims, privacy, ad policy)
      ├─▶ Localization        (region/language variants)
      │
      └─▶ Analytics (post-launch) → results back into Knowledge
```

## Sales motion flow

```
Lead source
 │
 ├─ Outbound: SDR ─────────┐
 │                          ▼
 ├─ Inbound: Inbound-qualifier ─▶ Lead scored & routed
 │                          │
 │                          ▼
 │                  Account-executive
 │                    │  ├─ runs discovery
 │                    │  ├─ demos / objections
 │                    │  └─ multi-thread stakeholders
 │                    ▼
 │                  Proposal ─▶ quote / SOW / contract
 │                    │
 │                    ▼
 │                  Compliance + human approval (terms, discount)
 │                    │
 │                    ▼
 │                  Closed-won
 │                    │
 │                    ▼
 │                  Account-manager (expansion, renewal, churn-save)
 │
 └─ Forecasting reads pipeline state continuously
```

## Approval gates (human-in-the-loop)

These actions always require human approval before they run:

- Sending email/LinkedIn to real prospects (any volume)
- Publishing to public channels (social, blog, PR)
- Spending ad budget or changing bid logic
- Sending proposals, quotes, or contracts to customers
- Approving discounts or non-standard terms
- Signing partnership agreements
- Changing tracking, CRM schemas, or routing rules

Internal-only actions (drafting, analysis, planning, knowledge updates) do not need approval.

## Inter-agent handoff format

Every handoff is a populated template. See `schemas/` for the canonical shapes:

- `schemas/campaign-brief.md` — Strategy → Creative/SEO/Social/Email
- `schemas/research-brief.md` — Orchestrator → Research; Research → Strategy
- `schemas/creative-brief.md` — Strategy → Creative
- `schemas/deal-record.md` — shared deal state across the sales pod
- `schemas/qa-checklist.md` — Review's exit criteria

Agents that emit content must produce a `## Handoff` section using the relevant schema.

## Shared memory

Three layers, owned by the `knowledge` agent:

**Per-client** — `clients/<slug>/knowledge/`
- `icp.md` — this client's ICP segments
- `brand-voice.md` — this client's voice
- `decisions.md` — append-only log of strategic decisions for this client
- `results.md` — append-only campaign + deal outcomes for this client
- `playbooks/` — plays tuned to this client (overrides vertical defaults)

**Per-vertical** — `verticals/<name>/playbook.md`
Industry defaults: audience archetypes, trigger events, channel mix, KPI norms, compliance flags, voice notes, common pitfalls. Updated only via promotion when a pattern shows up across 2+ clients in that vertical.

**Team-level** — `knowledge/` (root)
Cross-client, cross-vertical baseline. System-level decisions and learnings only. Most plays should *not* live here; they belong in a vertical or client folder.

The `knowledge` agent is the only one that writes anywhere in this stack. Other agents request updates through it so the log stays clean.

## Adding a new agent

The Orchestrator can author a new agent file in `.claude/agents/` when a recurring gap appears. New agents must:

1. Have a single, clear responsibility (one job).
2. Declare which schemas they read and which they emit.
3. Declare their escalation rule (when to hand back to the Orchestrator).
4. Honor the context-resolution rule from `CLAUDE.md`.
5. Be added to `README.md` roster and `ARCHITECTURE.md` flow.

## Adding a new vertical

When the second client in a new industry needs different defaults than any existing vertical:

1. Author `verticals/<name>/playbook.md` to the same shape as the existing one (`real-estate`) — audience archetypes, trigger events, sales motion, channel mix, KPIs, compliance flags, voice notes, VoC sources, common pitfalls, sub-vertical hints.
2. Add the vertical name to `README.md` "Supported verticals" section.
3. The `client-onboarding` agent will pick it up automatically next intake.

## Skills directory (`.claude/skills/`)

Skills are framework references loaded by multiple agents — they capture the *shape* of a domain (UAE real-estate regulatory framework, AML/KYC operational mechanics, approved disclosure templates, broker operations, attribution doctrine, project-fact-pack assembly, VVIP protocol). Skills are deliberately framework-only: specific current rules, current circular numbers, current thresholds route through `regulatory-research-specialist` for per-request confirmation. Skills are written by domain-owner agents (e.g., `regulatory-research-specialist` proposes regulatory-skill updates) and curated through the `knowledge` agent with `chief-commercial-officer` approval. Per-client overrides live at `clients/<slug>/skills-overrides/<skill>.md`.

## Runbooks directory (`runbooks/`)

Runbooks are multi-agent choreography for recurring scenarios — the off-the-shelf playbook the team pulls when a known event fires (resale with NOC, RERA-exposure complaint, PEP/sanctions hit, international roadshow, inbound HNW from private bank, broker onboarding, handover snagging, quarterly exec brief, press-sensitive UHNW). Each runbook follows a fixed shape: trigger → owner (single accountable agent or human) → numbered sequence with named hand-offs and SLAs → compliance gates → KPIs → close-out + learning loop → related runbooks. Per-client overrides live at `clients/<slug>/runbooks/<scenario>-overrides.md`. See `runbooks/README.md` for the catalog and authoring rules.

## Pod managers (manager tier between CCO and specialists)

Above the pod-specialist agents but below the `chief-commercial-officer`, four pod managers orchestrate within their pod and route exceptions to the CCO: `marketing-manager`, `sales-manager`, `crm-manager`, `wealth-vvip-manager`. Specialists' day-to-day handoffs go through their pod manager; cross-pod or escalation paths go through the CCO. This was added to manage the agent-count load on the CCO without compromising single-point-of-truth orchestration.
