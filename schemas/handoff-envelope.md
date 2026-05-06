# Handoff envelope

Every inter-agent message is wrapped in this envelope so the receiving agent can route, log, and respond consistently.

```yaml
from:                  # agent name
to:                    # agent name(s)
client:                # required — slug of the active client (matches clients/<slug>/)
vertical:              # required — must match a verticals/<name>/ folder
sub_vertical:          # optional — when set, must match verticals/<vertical>/sub-verticals/<name>/
intent:                # "request" | "deliverable" | "review" | "escalation" | "knowledge-update"
references:            # ids this relates to (campaign_id, deal_id, asset_id, etc.)
schema:                # which schema the payload conforms to
payload: {}            # the schema-shaped object
needs_human_approval:  # bool
deadline:
priority:              # "p0" | "p1" | "p2"
```

Rules:

1. **Client + vertical are mandatory.** No work happens without them. If either is missing, the receiving agent escalates back to the `chief-commercial-officer` instead of acting.
2. **Path resolution.** Agents read context in this order: `clients/<client>/knowledge/...` → `verticals/<vertical>/playbook.md` → root `knowledge/...`. Writes go to `clients/<client>/...` only.
3. If `needs_human_approval: true`, the receiving agent **must not** execute external actions until a human signs off.
4. Escalations (`intent: escalation`) always go to the Orchestrator with a one-line reason.
5. Knowledge updates (`intent: knowledge-update`) go to the `knowledge` agent only — no other agent writes to `clients/<client>/knowledge/` or root `knowledge/` directly.
