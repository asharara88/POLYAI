# Industry packs

Industry packs add the specialist agents, skills, runbooks, and defaults that a particular vertical needs on top of Flow's universal marketing/sales/CRM core. The `_default` pack covers any industry without a dedicated pack — clients still get the full 3-pod core team. Dedicated packs sharpen the work for industries with their own commercial physics.

```
verticals/
  real-estate/              # `real-estate-uae` pack — shipping today
    playbook.md
    sub-verticals/
      developer/            # off-plan developers (UAE Developments / Emaar class)
```

A pack playbook captures patterns common across most clients in that industry — audience archetypes, trigger events, channel mix, compliance flags, KPI norms, voice notes, common pitfalls. The client's own `clients/<slug>/knowledge/` overrides anything here.

## Anatomy of a pack

- `playbook.md` — required: audience, motion, channels, KPIs, compliance flags, voice, pitfalls
- `pack-manifest.md` — optional: which agents are activated when this pack is enabled on a client (without a manifest, the universal core + cross-cutting agents are the active set)
- `monitoring.yml` — optional: default outward-monitoring sources for `horizon-scanner`
- supporting docs — workflows, KPI definitions, sub-sub-vertical hints
- sub-verticals — when clients within a pack split along a structural axis (e.g. developer vs. brokerage vs. portal within real-estate)

A client whose `client-profile.md` has `pack: real-estate-uae, sub_vertical: developer` reads both `verticals/real-estate/playbook.md` and `verticals/real-estate/sub-verticals/developer/playbook.md`. The sub-vertical overrides the parent when they conflict.

## When to add a new pack

Add a new pack when the second client in an industry needs a substantively different default than the `_default` pack or any existing pack. Don't add a pack for a single client — that's what their client folder is for.

Packs on the roadmap: `auto-retail`, `professional-services`, `f-and-b-multi-unit`, `b2b-saas`. Until those ship, clients in those industries run on `_default` plus their own client overrides.

## When to update an existing pack

When a pattern repeats across 2+ clients in the same pack, the `knowledge` agent (with `chief-commercial-officer` approval) promotes it from those clients' folders into the pack playbook so future engagements benefit.
