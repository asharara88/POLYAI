# Verticals

Industry-specific defaults that any client in the vertical inherits. Each vertical is a single playbook file (kept short on purpose) plus optional sub-resources.

```
verticals/
  real-estate/
    playbook.md
  automotive/
    playbook.md
```

A vertical playbook captures patterns that are common across most clients in that industry — audience archetypes, trigger events, channel mix, compliance flags, KPI norms, voice notes, common pitfalls. The client's own `clients/<slug>/knowledge/` overrides anything here.

## When to add a new vertical

Add a new vertical when the second client in that industry needs a substantively different default than any existing vertical. Don't add a vertical for a single client — that's what their client folder is for.

## Sub-verticals

When clients within a vertical split along a structural axis — e.g. real-estate brokers vs. real-estate developers, or automotive OEMs vs. dealers — add a sub-vertical instead of forcing one playbook to cover both:

```
verticals/
  real-estate/
    playbook.md                          # parent: applies to all real-estate clients
    sub-verticals/
      developer/
        playbook.md                      # off-plan developers (Aldar / Emaar class)
        campaign-workflow.md             # supporting docs allowed
      brokerage/                         # would live here if added
      portal/                            # would live here if added
```

A client whose `client-profile.md` has `vertical: real-estate, sub_vertical: developer` reads both files. The sub-vertical overrides the parent when they conflict.

Sub-verticals can include their own:
- `playbook.md` — required
- `monitoring.yml` — optional, default monitoring sources for clients in this sub-vertical
- supporting docs (workflows, KPI definitions, sub-sub-vertical hints)

## When to update an existing vertical

When a pattern repeats across 2+ clients in the same vertical, the `knowledge` agent (with orchestrator approval) promotes it from those clients' folders into the vertical playbook so future engagements benefit.
