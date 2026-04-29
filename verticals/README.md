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

## When to update an existing vertical

When a pattern repeats across 2+ clients in the same vertical, the `knowledge` agent (with orchestrator approval) promotes it from those clients' folders into the vertical playbook so future engagements benefit.
