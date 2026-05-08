# Integration: Salesforce

## Purpose

Salesforce is the system-of-record for the developer's commercial pipeline — leads, contacts, accounts (buyers, brokers, wealth-channel intermediaries), and opportunities (deals). Flow does not replace Salesforce; it integrates so:

- `account-executive`, `inbound-qualifier`, `sdr`, `forecasting`, and `data-quality-steward` can read pipeline state without context-switching
- `account-executive` can log activity (calls, emails, meetings, viewings) into Salesforce after the work happens, never instead of it
- `account-executive` can advance opportunities through stages with the right preconditions enforced
- `forecasting` can pull stage history + activity timeline for calibration
- `data-quality-steward` can detect duplicates and missing required fields without an admin running reports
- repo-side `clients/<slug>/sales/pipeline.md` mirrors Salesforce truth, with the discipline that **Salesforce is system-of-record; the repo is mirror**

## Auth

OAuth via the Salesforce MCP server (when wired) OR direct API via Connected App credentials in the Vercel deployment environment. Per-client Salesforce orgs are addressed via per-client `clients/<slug>/integrations/salesforce/config.md`.

## Tier model

| Operation class | Tier | Default policy |
|---|---|---|
| Read-only queries (SOQL, REST GET) | A — read | Auto |
| Activity log (Task, Event, Call) creation | B — write with explicit approval | Per-client; promotable to C after 60 days clean |
| Opportunity field updates (non-stage) | B | Promotable to C with stewardship review |
| Opportunity stage advance | B — strictly | **Never auto-promote past Tier B** without `chief-commercial-officer` approval |
| Lead/Contact/Account create | B | Per-client |
| Lead/Contact/Account merge | B + `data-quality-steward` proposal required | Never C |
| Bulk operations (> 50 records) | B + explicit human review | Never C |
| Delete | D — autonomous prohibited | Always explicit human; minimum sales-manager + crm-manager joint approval |

Default new-client posture: every write Tier B until per-client policy promotes specific actions.

## Used by

- `account-executive` — primary writer (activity log, stage advance proposals)
- `inbound-qualifier` — lead create + initial routing
- `sdr` — lead create from outbound list
- `forecasting` — read pipeline + stage history
- `data-quality-steward` — read for hygiene, propose merges
- `crm-manager` — pod-level oversight, source-of-truth disputes
- `analytics` — read for performance reporting
- `email-lifecycle` — read for segment construction
- `broker-enablement` — read for broker-attribution reconciliation
- `wealth-channel-enablement` — read for wealth-channel-attributed deals

## Data flow

```
Lead arrives via web form → web app posts to Salesforce REST → Lead created
    ↓
Salesforce webhook (or polling) notifies the integration runtime
    ↓
inbound-qualifier reads the new Lead, scores it, proposes routing
    ↓
account-executive picks up qualified Lead, converts to Opportunity
    ↓
Activity happens (call, viewing, proposal sent)
    ↓
account-executive emits integration-action {operation: activity-log, payload: <task>}
    ↓ (approval per Tier B policy — promotable to C per client)
integration runtime calls Salesforce REST → Task created
    ↓
account-executive emits integration-action {operation: stage-advance, payload: <stage + evidence>}
    ↓ (Tier B explicit approval, never auto-C)
integration runtime checks preconditions (required fields complete, evidence attached) → advances stage
    ↓
forecasting picks up the change in next nightly rollup
data-quality-steward picks up any field gaps in next daily scan
```

## What we read regularly

- New leads in the last 24h (by source)
- All open opportunities (for forecasting, data-quality, attribution)
- Activity timeline per opportunity (for stage-evidence diff)
- Stage-history per opportunity (for forecasting calibration)
- Account hierarchy (for multi-unit / family-office grouping)
- Custom fields per `integrations/salesforce/schema-mapping.md`

## What we write (each through integration-action envelope)

See `integrations/salesforce/actions/`:

- `activity-log.md` — log a Task, Event, or Call against an Opportunity / Contact / Lead
- `stage-advance.md` — advance an Opportunity through stages with precondition checks
- (more actions added as needed: lead-conversion, opportunity-create, contact-create, attribution-update)

## What we do NOT do

- We do not delete records via this integration. Salesforce admin handles delete via human channel.
- We do not bulk-update pipeline stages — every stage advance is per-opportunity with evidence.
- We do not modify validation rules, page layouts, profiles, permission sets — those are Salesforce admin operations.
- We do not export PII bulk-extracts from Salesforce. Per-record reads with audit trail only.
- We do not write to fields owned by finance (booked-amount, invoiced, paid) — those are touched by the finance system; we read.
- We do not auto-merge duplicates. `data-quality-steward` proposes, human approves.

## Per-client config

`clients/<slug>/integrations/salesforce/config.md`:

```yaml
salesforce_org_id:           # production org id
sandbox_org_id:              # sandbox org id (for test runs)
api_version:                 # e.g. "v60.0"
record_types:
  opportunity:               # active record type IDs by sub-vertical
    off-plan-direct:
    off-plan-broker:
    secondary-resale:
  account:
    buyer:
    broker:
    wealth-channel:
    family-office:
custom_fields:               # per-org custom field API names
  opportunity:
    broker_id__c:
    wealth_channel_id__c:
    inventory_unit_id__c:
    aml_kyc_verdict__c:
    aml_kyc_verdict_date__c:
    pep_flag__c:
    sanctions_flag__c:
    golden_visa_eligible__c:
  account:
    risk_rating__c:
    edd_required__c:
    last_screened_date__c:
stage_definitions:           # stage label → required fields + required artifacts
  qualified:
    required_fields: [contact_method, source_channel]
    required_artifacts: []
  proposal-sent:
    required_fields: [proposed_unit, proposed_payment_plan, decision_maker_contact]
    required_artifacts: [proposal_document]
  negotiation:
    required_fields: [...]
  closed-won:
    required_fields: [unit_id, signed_spa_date, deposit_received_date, aml_kyc_verdict]
    required_artifacts: [signed_spa, kyc_evidence]
  closed-lost:
    required_fields: [loss_reason, primary_competitor]
approval_promotions:         # which actions have been promoted to Tier C for this client
  activity_log: tier-c       # after 60 days clean
  stage_advance: tier-b      # always explicit
default_owner_routing:       # by source channel
  inbound_form: round-robin-rms
  broker_referral: assigned-rm-per-broker
  wealth_channel: rm-with-channel-relationship
```

## Failure modes to handle

- **Salesforce API limits** (Daily API Request limit, Bulk API limits). Track usage; degrade to read-only when above 80% threshold.
- **Org mismatch** (sandbox vs. production). Every action carries `salesforce_org_id` in the precondition; mismatched action moves to `cancelled`.
- **Validation rule failures** post-approval. Capture the validation error and route to `data-quality-steward` to surface the underlying gap.
- **Stage-history desync** — if Salesforce shows a stage we don't expect, do not "correct" it; route to `crm-manager` for source-of-truth ruling.
- **Duplicate created during integration latency** — `data-quality-steward` daily scan catches.

## Status

Spec live. Wiring activates when the Salesforce Connected App credentials are configured per-client in the Vercel environment. Until then, the agents reference this spec and propose actions; the actions accumulate as proposed-but-not-executed for human review.
