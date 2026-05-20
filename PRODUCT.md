# Product — what Flow is

Flow is **the CCO operating system for UAE real-estate developers**. One coherent dashboard for the Chief Commercial Officer and their commercial pods, run by a multi-agent team that knows DLD, RERA, ADREC, off-plan launch mechanics, and the UAE buyer corridors.

If you're skimming, this page covers: who it serves, what it does, what's in scope today, what's not, and how to walk through it in 90 seconds.

## Who it serves

The buyer is the **human Chief Commercial Officer** of a UAE master-developer (Abu Dhabi or Dubai anchored, multi-emirate portfolio, AED-billion-class). Their day involves:

- A morning brief by 07:00 — overnight regulator, sanctions, press, and corridor signal already triaged
- Decisions queued for them — discount exceptions over policy, VVIP activations, payment-plan deviations, multi-corridor roadshows
- Live launch tracker — channel mix, finance, events, broker ecosystem for the next 0–90 days
- Channel surfaces — broker registry with tier mechanics, wealth channel (private banks + family offices), VVIP channel (protocol-aware, no-mention discipline)
- A team they can ask — `chief-commercial-officer`, the four pod managers, 46 specialist + cross-cutting agents (51 total in `.claude/agents/`, 11 tagged `(real-estate-uae pack)`)

The secondary audience is the **pod manager and specialist agent operators** — `sales-manager`, `marketing-manager`, `crm-manager`, `wealth-vvip-manager` and the specialists who report to them. They see scoped views (their pod's decision asks, their pod's risks, their agent profile).

## What it does today

| Surface | What's on it | State |
|---|---|---|
| `/cco` | Morning brief, decisions queue, risk register, horizon scan, calendar | Shipping |
| `/launches` | Multi-launch readiness across channel mix, finance, events, brokers; deep cross-link from each launch into events + brokers + decisions | Shipping |
| `/clients/<slug>` | Per-client workspace: profile, ICP, voice, decisions, results, CCO daily, inventory, pipeline, events, vendors, budget, brokers, wealth, VVIP, reciprocity, routing simulators | Shipping (3 macro-tabs: Setup / Daily operations / Channels & inventory) |
| `/approvals` | Inbound decision asks with scope filtering and inline sign-off | Shipping |
| `/chat` | Conversational interface to the CCO agent, scoped to the active workspace | Shipping |
| `/agents` | The full team grouped by pod, with hand-off matrices and runbook ownership | Shipping |

Worked-example workspace at `clients/_examples/uae-developments/` — a fictional Abu Dhabi-anchored developer with multi-emirate portfolio, 250-firm broker network, parallel wealth and VVIP channels, an active Q3 launch ("Coastal Reserve Phase 1"). All project / vendor / broker / event names are illustrative placeholders — not actual relationships or real properties.

## How it's structured

```
.claude/agents/       51 agent definitions (the team)
.claude/skills/       3 cross-industry skills (KPI framework, CRM data model, attribution)
verticals/
  real-estate-uae/    the shipping pack folder
    README.md
    pack-manifest.md
    playbook.md
    monitoring.yml
    skills/           12 pack skills (UAE regulatory, AML/KYC, broker ops, off-plan, ...)
    runbooks/         25 pack runbooks (CCO daily cadence, board prep, regulatory crisis, ...)
    sub-verticals/
      developer/
        playbook.md
        playbooks/    sub-vertical-specific channel-development plays
clients/
  _examples/
    uae-developments/ the worked-example workspace — profile, ICP, voice, brokers, wealth, VVIP, ...
knowledge/            team-level baseline templates (lowest-priority lookup)
schemas/              data shapes (handoff envelopes, campaign briefs, decision memos, ...)
web/                  the Next.js operator surface
```

## How to walk through it in 90 seconds

1. Open the homepage — read the positioning and the four-pod structure.
2. Click **Today** (`/cco`) — read the top decision in the queue.
3. Click into a launch from the morning brief, or open **Launches** (`/launches`) — pick the active Q3 launch.
4. From the launch page, click into Events & brokers depth — see how the broker firm card cross-links to the broker registry.
5. Click **Clients** (`/clients`) → open `uae-developments` — three macro-tabs (Setup / Daily operations / Channels & inventory).
6. Click **Decisions** (`/approvals`) — inline sign-off + scope filtering.
7. Open **Chat** (`/chat`) — the CCO agent scoped to the active workspace.

## What this product is NOT

- A general-purpose CRM. It plugs into Salesforce and reads from it; it doesn't replace Salesforce.
- A white-label commercial OS for any industry. Today's product is the real-estate-uae pack. The architecture has placeholders for other packs (`auto-retail`, `professional-services`, `f-and-b-multi-unit`, `b2b-saas`) but none of them are built; treat Flow as a single-pack product until a second pack ships.
- A property listing / portal product. We are operator-side, not consumer-side.
- A general document or knowledge management tool. The shape is opinionated for commercial operations, not for storing every kind of doc.

## What's on the immediate roadmap

- **Brokerage sub-vertical** — second sub-vertical inside the real-estate-uae pack (brokerage-side workflows, not developer-side).
- **Per-pack onboarding flow** — `client-onboarding` agent extended to scaffold a new client with intake → pack-pick → profile/ICP/voice seeding in one session.
- **Production integrations** — Salesforce two-way write, Sumsub two-way write, Bynder, calendar (Google + M365), WhatsApp Business API, news + sanctions feed ingestion.

Not on the immediate roadmap: additional packs beyond real-estate-uae. Those activate when a second client in a different industry asks for the work.

## Who this isn't for

- A boutique broker with one office and one listing portal. The agent count and channel infrastructure are over-scaled.
- A non-UAE real-estate developer. Until a `real-estate-sa` / `real-estate-uk` pack ships, the regulatory and corridor framework would be wrong jurisdiction.
- A single-tower indie developer running campaigns ad-hoc. Flow assumes a recurring launch cadence and a real broker / wealth / VVIP channel infrastructure to manage.

## Where to read more

- `README.md` — repo intro + getting started
- `ARCHITECTURE.md` — agent tree, pod structure, hand-off matrix, approval-gate framework
- `CHANGELOG.md` — phase-by-phase history
- `verticals/real-estate-uae/README.md` — pack overview
- `verticals/real-estate-uae/pack-manifest.md` — what activates when the pack is enabled
- `verticals/real-estate-uae/playbook.md` — pack-level patterns (audience, motion, channels, KPIs, compliance flags, voice)
- `verticals/real-estate-uae/sub-verticals/developer/playbook.md` — developer-sub-vertical specifics
- `/about/uae-real-estate` (in the web surface) — same content, rendered
