# Developer sub-vertical playbooks

Reusable runbooks for the channel-development motions every developer marketing team runs alongside the launch-led campaign work. These plays are the spine of the "channel development standalone" routing pattern in the orchestrator.

## What's here

**Broker channel:**
- `broker-channel-reactivation.md` — bring a dormant broker firm back to producing
- `broker-channel-new-firm-signing.md` — recruit a new broker firm to fill a coverage gap

**Wealth channel:**
- `wealth-channel-reactivation.md` — refresh a dormant private bank / family office / introducer relationship
- `wealth-channel-new-relationship-signing.md` — establish a new wealth-channel counterparty

**VVIP channel:**
- `vvip-channel-cultivation.md` — initiate a new VVIP relationship through a senior introduction
- `vvip-channel-dormant-refresh.md` — re-engage a dormant VVIP relationship, often through a transitioned gatekeeper

## Play structure

Each play follows the same shape:

1. **When to run it** — trigger conditions, observable signals
2. **Diagnose first** — questions to answer before acting (don't act on a misdiagnosis)
3. **Target outcome** — what success looks like, measurable
4. **Sequence** — step-by-step actions with owning agents and approval gates
5. **Success criteria** — how to know if the play worked
6. **Anti-patterns** — things to avoid; common ways the play fails
7. **Variants** — when to deviate

## When to promote a play

These plays sit at the vertical level because they apply across most developer clients. Per-client variants live in `clients/<slug>/knowledge/playbooks/`. Promotion happens via the `knowledge` agent when a variant proves useful across 2+ clients.
