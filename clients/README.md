# Clients

Each client engagement gets its own folder under `clients/<slug>/`. This is where the team's memory of *that specific client* lives — their ICP, their brand voice, their decisions, their results.

```
clients/
  _template/        ← copy this when onboarding a new client
  acme-realty/      ← real-estate client example
```

## What's in a client folder

```
clients/<slug>/
  client-profile.md   # who they are, vertical, markets, integrations, approval gates
  knowledge/
    icp.md            # their ICP segments
    brand-voice.md    # their voice (not ours)
    decisions.md      # append-only strategic decisions for this client
    results.md        # append-only campaign + deal outcomes for this client
    playbooks/        # plays tuned to this client (overrides of vertical defaults)
```

## How client context flows through the team

1. Every active engagement names a `client` slug and a `vertical` (e.g. `real-estate`).
2. The `chief-commercial-officer` sets these at the top of any work session and passes them in every `handoff-envelope` to other agents.
3. Agents read in this order (most-specific first):
   1. `clients/<slug>/knowledge/...` — client-specific overrides
   2. `verticals/<vertical>/playbook.md` — industry defaults
   3. `knowledge/...` (root) — team-level cross-client baseline
4. Writes always go to the client's folder. Cross-client learnings get promoted up to `verticals/` or root `knowledge/` only after appearing in 2+ clients.

## Onboarding a new client

Use the `client-onboarding` agent. It:

1. Takes a brief from you (the human).
2. Picks the right vertical playbook to start from.
3. Copies `clients/_template/` to `clients/<slug>/`.
4. Populates `client-profile.md` and seeds `icp.md` / `brand-voice.md` from your brief + vertical defaults.
5. Hands back to `chief-commercial-officer` so real work can begin.
