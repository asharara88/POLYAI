# Action: Salesforce — advance opportunity stage

## When this fires

An `account-executive` (or `account-manager` for post-sale lifecycle) believes an Opportunity has met the criteria to move from its current stage to the next. Stage advances are commercially material — they move the deal into the forecast, change the broker-attribution lock, and (at `closed-won`) trigger a cascade of post-sale operations.

Stage advances are **never auto-promoted past Tier B** per `integrations/salesforce/spec.md`. Every stage advance requires explicit human approval (typically `sales-manager` or higher per `approval_gates`).

## Pre-flight

```yaml
preconditions:
  - opportunity_exists: opportunity_id resolves via Salesforce REST GET
  - current_stage_matches: the proposing agent observes the same current stage as Salesforce
  - target_stage_valid: target stage is the next stage in the configured pipeline (no skipping)
  - required_fields_complete: per per-client stage_definitions in salesforce/config.md
  - required_artifacts_attached: per stage_definitions
  - aml_kyc_currency: at stages >= proposal-sent, AML_KYC_Verdict__c == "cleared" AND AML_KYC_Verdict_Date__c <= 90 days old
  - aml_kyc_at_close: at closed-won, AML_KYC_Verdict__c == "cleared" AND <= 30 days old
  - vvip_clearance: if VVIP__c == true, vvip-channel-enablement has explicitly cleared the stage advance
  - broker_attribution_locked: at proposal-sent or later, Broker__c (if set) is verified active in clients/<slug>/brokers/registry.md
  - tier: B (explicit human approval) — never auto-C
```

## Payload shape

```yaml
action_id: <ulid>
client: <slug>
vertical: real-estate
sub_vertical: developer
deal: <opportunity_id>
proposed_by: account-executive
proposed_at: <ISO timestamp>
system: salesforce
operation: stage-advance
endpoint: REST PATCH /services/data/v60.0/sobjects/Opportunity/<opportunity_id>
payload:
  StageName: "<target stage>"
  Probability: <stage-default probability per Salesforce config>
  # Stage-required fields (per stage_definitions):
  # at proposal-sent:
  Proposed_Unit__c: <unit_id>
  Payment_Plan__c: "<plan summary>"
  Decision_Maker__c: <contact_id>
  # at negotiation:
  # ...
  # at closed-won:
  Unit__c: <unit_id>
  Signed_SPA_Date__c: <YYYY-MM-DD>
  Deposit_Received_Date__c: <YYYY-MM-DD>
  AML_KYC_Verdict__c: "cleared"
  AML_KYC_Verdict_Date__c: <YYYY-MM-DD, <= 30 days old>
  # at closed-lost:
  Loss_Reason__c: "<picklist value>"
  Primary_Competitor__c: <competitor_id, optional>
preconditions:
  - opportunity_current_stage: "<expected current stage>"
  - all_required_fields_present: true
  - aml_kyc_cleared_and_current: true
risk_tier: B
approval:
  policy: explicit-human-sales-manager   # or chief-commercial-officer for above-threshold
  required_role: sales-manager   # default; promotes to chief-commercial-officer per approval_gates threshold
references:
  deal_record: clients/<slug>/sales/pipeline.md#<deal_id>
  source_evidence:
    # at proposal-sent:
    - clients/<slug>/proposals/<proposal_id>/proposal.md
    # at closed-won:
    - clients/<slug>/contracts/<spa_id>/signed-spa-evidence.md
    - clients/<slug>/sales/aml-kyc/<account_id>/verdict.md
audit:
  trace_id: <uuid>
  rollback: |
    Stage reversion is operationally undesirable (forecast distortion, broker-attribution implications, owner-community
    onboarding may have triggered). If a stage was advanced in error, the corrective action is to:
    1. Document the error in clients/<slug>/sales/deal-corrections/<correction_id>/note.md
    2. Loop forecasting + crm-manager + (if past proposal-sent) broker-enablement
    3. Decide whether to revert the stage (PATCH back) or close-lost the opportunity and re-create
    Per data-quality-steward SOP, do not silently revert.
  retention_days: 2555   # 7 years (commercial transaction record)
```

## Post-flight

- Record advance in `clients/<slug>/sales/pipeline.md` with timestamp + approver
- If advancing to `proposal-sent`: trigger `proposal` agent to ensure the proposal artifact is on file
- If advancing to `negotiation`: trigger `deal-desk-analyst` review if non-standard terms surface
- If advancing to `closed-won`:
  - Trigger `account-manager` post-sale onboarding sequence
  - Trigger `email-lifecycle` welcome cadence
  - If broker-attributed: trigger `broker-enablement` commission accrual workflow
  - Update `clients/<slug>/inventory/units.md` to mark the unit `sold`
  - Trigger `forecasting` next-cycle adjustment
- If advancing to `closed-lost`:
  - Trigger `voc` capture of loss reason in customer language
  - Update `clients/<slug>/sales/loss-analysis/<period>.md`
  - Trigger `competitive-intel` if `Primary_Competitor__c` populated

## Rollback

Per the `audit.rollback` block above — there is no clean automatic rollback for a stage advance. The compensating workflow is documented and human-mediated.

## Tier promotion criteria

**Stage advances do not promote to Tier C.** Every stage advance requires explicit human approval, regardless of tenure or track record. This is a deliberate guardrail: the cost of a mis-advanced stage (forecast distortion, downstream cascade, broker-attribution lock-in) materially exceeds the friction of an explicit approval per advance.

The only adjustment per client is the **threshold above which** approval routes to `chief-commercial-officer` instead of `sales-manager`, captured in `clients/<slug>/client-profile.md` `approval_gates`.
