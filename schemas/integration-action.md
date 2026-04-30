# Integration action

Every write or side-effecting call into an external system (Salesforce, HubSpot, Meta Ads, WhatsApp, DocuSign, Tableau, etc.) is wrapped in this envelope. Read calls don't need it; only writes.

The agent prepares the action, the human (or an approved policy) authorizes it, the integration executes it, the audit log records it.

## Schema

```yaml
action_id:                 # unique, ULID/UUID
client:                    # client slug (mandatory)
vertical:                  # vertical (mandatory)
campaign:                  # campaign slug if scoped to one
deal:                      # deal_id if scoped to one
proposed_by:               # agent name that originated the action
proposed_at:               # ISO timestamp
system:                    # "salesforce" | "hubspot" | "meta-ads" | "google-ads" | ...
endpoint:                  # API endpoint or operation name
operation:                 # "create" | "update" | "delete" | "send" | "publish" | "advance" | "pause" | ...
payload: {}                # operation-specific body
preconditions: []          # invariants that must be true at execute-time (e.g. "deal.stage == evaluation")
risk_tier:                 # "A" | "B" | "C" | "D" — see INTEGRATIONS.md
approval:
  policy:                  # the approval policy name that applies (or "explicit-human")
  required_role:           # role required to approve (CMO, Sales Ops, Compliance, etc.)
  approver:                # populated when approved
  approved_at:             # ISO timestamp
  rationale:               # required for any deviation from default policy
execute:
  status:                  # "pending" | "approved" | "executing" | "succeeded" | "failed" | "cancelled" | "rolled-back"
  started_at:
  completed_at:
  result: {}               # response body or summary
  error:                   # error message if failed
audit:
  trace_id:                # correlation id (passed to system if supported)
  rollback:                # description of how to reverse this action, if applicable
  retention_days:          # how long to keep this record
references:
  campaign_brief:          # path
  creative_brief:          # path (if creative-driven)
  deal_record:             # path (if deal-driven)
  source_evidence: []      # paths to artifacts/data backing this action
```

## Rules

1. **No execution without approval.** `execute.status` cannot move from `pending` to `executing` until `approval.approver` and `approval.approved_at` are set, OR the policy named in `approval.policy` is one of the pre-approved Tier C policies declared in the client profile.
2. **Pre-conditions checked at execute time.** Even after approval, if a precondition fails (deal moved stages, inventory sold, etc.), the action does not run. It moves to `cancelled` with a reason.
3. **Audit log is permanent.** No action record is deleted; superseded actions get a `superseded_by` reference.
4. **Rollback is mandatory for destructive operations.** If the operation can't be reversed (sent emails, posted social), the rollback field documents the compensating action (retraction email, deletion request).
5. **Idempotency.** Each action carries `action_id`; if the same action is approved twice, the second approval is a no-op.
6. **Tier respect.** An agent cannot self-promote an action's tier. If a policy says \"only Tier C with these constraints,\" the agent emits accordingly.

## Lifecycle

```
agent → emits action with status=pending
     → routed to approval surface (chat /approvals page, Slack, email)
     → human approves OR Tier C policy auto-approves
     → status=approved, approver+timestamp recorded
     → integration runtime picks up approved actions, runs preconditions
     → status=executing
     → integration call succeeds → status=succeeded, result populated
     → integration call fails → status=failed, error populated, retry per policy
     → if requires rollback → status=rolled-back, compensating action recorded
```

## Where actions live

`clients/<slug>/integrations/<system>/actions/<YYYY>/<MM>/<action_id>.md`

That gives chronological browsability and per-system grouping. The orchestrator can list pending actions across all clients with a glob.
