# Architecture

How POLYAI's agents are wired together.

## Design principles

1. **Structured handoffs over prose.** Every agent-to-agent transfer is a populated template (`schemas/`). No "here's a paragraph, please figure it out."
2. **Shared memory is the spine.** The `knowledge/` folder is the single source of truth for ICP, brand voice, decisions, and past results. Agents read from it and write to it via the `knowledge` agent.
3. **Review is layered, not terminal.** Lightweight peer checks at each handoff plus a final QA pass. Compliance is a separate gate before anything goes external.
4. **Human approval gates are explicit.** Anything that touches a real prospect, a real budget, or a real contract needs a human checkpoint until the team has been observed running for a while.
5. **The Orchestrator is top-down for campaigns, reactive for deals.** Marketing campaigns are decomposed and assigned by the CEO. Sales work is mostly triggered by deal-state changes.

## Pods

```
                       ┌────────────────────┐
                       │    Orchestrator    │  (CEO)
                       └─────────┬──────────┘
            ┌────────────────────┼────────────────────┐
            ▼                    ▼                    ▼
      Marketing Pod         Sales Pod            BD Pod
            │                    │                    │
            ▼                    ▼                    ▼
    Cross-cutting: review · compliance · pm · knowledge · ci · voc · localization
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

`knowledge/` holds:

- `icp.md` — ideal customer profile(s)
- `brand-voice.md` — tone, do/don't, vocabulary
- `decisions.md` — append-only log of strategic decisions and why
- `results.md` — campaign + deal post-mortems
- `playbooks/` — reusable campaign and sales plays

The `knowledge` agent is the only one that writes here directly. Other agents request updates through it so the log stays clean.

## Adding a new agent

The Orchestrator can author a new agent file in `.claude/agents/` when a recurring gap appears. New agents must:

1. Have a single, clear responsibility (one job).
2. Declare which schemas they read and which they emit.
3. Declare their escalation rule (when to hand back to the Orchestrator).
4. Be added to `README.md` roster and `ARCHITECTURE.md` flow.
