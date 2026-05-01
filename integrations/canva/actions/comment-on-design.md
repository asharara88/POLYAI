# Action: Canva — comment on design

## When this fires

A reviewer agent (`brand-design`, `creative`, `compliance`, `localization`, `inventory-manager`) has identified an issue with a Canva design and needs to post structured feedback to the designer.

`agency-liaison` consolidates per-design feedback from multiple reviewers into a single batched comment-on-design action set, so the designer sees one consolidated thread rather than four parallel ones.

## Pre-flight

```yaml
preconditions:
  - design_exists: design_id resolves via Canva get-design
  - reviewer_authorized: reviewing agent is in {brand-design, creative, compliance, localization, inventory-manager}
  - feedback_consolidated: agency-liaison has flagged this round's feedback complete
  - tier: B (explicit human approval) unless policy promotes
```

## Payload shape

Per `schemas/integration-action.md`:

```yaml
action_id: <ulid>
client: <slug>
vertical: real-estate
sub_vertical: developer
campaign: <campaign-slug>
proposed_by: agency-liaison
system: canva
operation: comment-on-design
endpoint: comment-on-design (MCP tool)
payload:
  design_id: <Canva design id>
  page_index: <int, optional — page-specific comment>
  selection: <region or element id, optional>
  body: |
    <consolidated feedback note, structured>
    
    Must-change:
    1. ...
    
    Should-change:
    1. ...
    
    Suggestion:
    1. ...
  reviewer_attribution: |
    Aggregated from: brand-design (<n> notes), creative (<n>), compliance (<n>), inventory-manager (<n>)
risk_tier: B
approval:
  policy: explicit-human
  required_role: brand-team-reviewer
references:
  campaign_brief: clients/<slug>/campaigns/<campaign>/campaign-brief.md
  creative_brief: clients/<slug>/campaigns/<campaign>/<asset-creative-brief>.md
  source_evidence:
    - clients/<slug>/campaigns/<campaign>/reviews/<round-id>/aggregated-feedback.md
audit:
  trace_id: <uuid>
  rollback: |
    Comments cannot be undone via API in Canva; record this comment id and use
    reply-to-comment to mark "withdrawn — superseded by <new comment id>" if needed.
  retention_days: 365
```

## Post-flight

- Record returned comment id in the action result.
- Append to `clients/<slug>/agencies/<agency-slug>/engagements/<engagement-id>/comments-log.md` for audit.
- If a `must-change` was posted, set the engagement status to "awaiting agency response" with a 24-hour SLA timer.

## Rollback

Canva comments are persistent. The compensating action is a `reply-to-comment` annotating that the original is superseded.

## Tier promotion criteria

Promote this action to Tier C (auto-approve within policy) per client when:
- The agent has run for 60+ days on this client without comment-content disputes
- The brand-team-reviewer has reported low-friction reviewer feedback consistently
- The client profile explicitly opts in via `approval_gates.canva_comments: tier-c`
