# Action: Salesforce — log activity

## When this fires

An `account-executive`, `sdr`, `inbound-qualifier`, or `account-manager` has completed an interaction (call, email, meeting, viewing, follow-up) with a Lead, Contact, or Opportunity-linked party and needs to log it in Salesforce so the activity timeline is current.

Activity-log writes after the activity, not before. The integration is for memorialization, not orchestration.

## Pre-flight

```yaml
preconditions:
  - target_record_exists: WhatId or WhoId resolves via Salesforce REST GET
  - activity_complete: the activity actually happened (not a planned activity — those are Tasks with status=open, handled separately)
  - reporter_authorized: reporting agent is in {account-executive, account-manager, sdr, inbound-qualifier}
  - tier: B (explicit human approval) by default; promotable to C per-client after 60 days clean per spec.md
```

## Payload shape

Per `schemas/integration-action.md`:

```yaml
action_id: <ulid>
client: <slug>
vertical: real-estate
sub_vertical: developer
deal: <opportunity_id, when scoped>
proposed_by: account-executive
proposed_at: <ISO timestamp>
system: salesforce
operation: activity-log
endpoint: REST POST /services/data/v60.0/sobjects/Task   # or /Event
payload:
  WhatId: <opportunity or account id>
  WhoId: <contact or lead id, optional>
  Subject: "<concise activity subject>"
  Description: |
    <activity narrative — what happened, what was said, what was agreed>
  TaskSubtype: "Call" | "Email" | "Meeting" | "Viewing"   # for Task
  ActivityDate: <YYYY-MM-DD>
  Status: "Completed"
  Priority: "Normal"
  Outcome__c: "positive" | "neutral" | "negative" | "no-response"
  Next_Step__c: |
    <next concrete step + by-when, required when stage >= negotiation>
preconditions:
  - target_what_id_exists: true
  - reporter_owns_record_or_collaborator: true
risk_tier: B
approval:
  policy: explicit-human   # or tier-c-auto when promoted per client config
  required_role: account-executive-self-approval   # for Tier C
references:
  deal_record: clients/<slug>/sales/pipeline.md#<deal_id>
  source_evidence:
    - clients/<slug>/sales/activities/<activity_id>/notes.md
audit:
  trace_id: <uuid>
  rollback: |
    Tasks/Events can be deleted by the activity owner via Salesforce UI or REST DELETE.
    Compensating action: log a follow-up Task referencing the original as "superseded — see <new task id>"
    when the original carries durable side-effects (e.g., a Customer Activity Score update).
  retention_days: 1825   # 5 years for activity audit
```

## Post-flight

- Record returned `Id` in the action result.
- Append to `clients/<slug>/sales/activities/<activity_id>/log.md`.
- If `Outcome__c == "negative"` or `Outcome__c == "no-response"` for 3 consecutive activities on the same Opportunity → flag to `forecasting` for category review.
- If the activity is on an Opportunity at stage `closed-won` or `closed-lost` → mirror to `clients/<slug>/sales/pipeline.md` and append to the deal's `outcomes.md`.

## Rollback

Salesforce Tasks and Events can be deleted by the owner. The compensating action for an activity that was logged in error is a deletion (not via this integration — via human Salesforce UI). For an activity that was substantively wrong, log a corrected activity referencing the original and let the original stand for audit purposes.

## Tier promotion criteria

Promote to Tier C (auto-approve within policy) per client when:
- The agent has run for 60+ days on this client without activity-log accuracy disputes
- `data-quality-steward` reports no fabricated-activity flags in the period
- The client profile explicitly opts in via `approval_gates.salesforce_activity_log: tier-c`

Even at Tier C, the following remain Tier B:
- Activities on VVIP-flagged Accounts (always explicit)
- Activities at `negotiation` or `closed-*` stages (always explicit — material to forecast)
- Activities with `Outcome__c == "negative"` (always explicit — material to retention conversation)
