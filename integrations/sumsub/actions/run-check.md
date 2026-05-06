# Action: Sumsub — run AML/KYC check

## When this fires

`aml-kyc-compliance-specialist` (or, by delegation, `inbound-qualifier` / `wealth-channel-enablement` / `broker-enablement` / `vvip-channel-enablement` / `secondary-market-specialist`) needs to initiate AML/KYC screening on a new counterparty before they can progress to a commercial conversation or commit any funds.

For buyers from sanctions-surface corridors (Russia/CIS, Iran-adjacent, Syria-adjacent, DPRK-adjacent, Venezuela, Cuba), this is **pre-commercial-conversation mandatory** per `.claude/skills/aml-kyc-uae-real-estate.md`.

## Pre-flight

```yaml
preconditions:
  - counterparty_record_exists: Salesforce Account or pending-applicant record present
  - applicant_level_selected: per counterparty_type → applicant level mapping in config.md
  - contact_method_for_onboarding_link: email or phone present and verified
  - vvip_check: if counterparty is VVIP-flagged, vvip-channel-enablement has authorized initiation (discretion stance)
  - tier: B (explicit human approval) by default
```

## Payload shape

Per `schemas/integration-action.md`:

```yaml
action_id: <ulid>
client: <slug>
vertical: real-estate
sub_vertical: developer
proposed_by: aml-kyc-compliance-specialist
proposed_at: <ISO timestamp>
system: sumsub
operation: create-applicant-and-initiate-check
endpoint: REST POST /resources/applicants  (then GET /resources/sdkIntegrations/levels/<levelName>/oneTimeToken for the link)
payload:
  externalUserId: "<our internal counterparty id, e.g. salesforce account id>"
  email: "<contact email>"
  phone: "<contact phone, E.164>"
  levelName: "<per applicant_levels mapping in config.md>"
  fixedInfo:
    firstName: "<as on passport>"
    lastName: "<as on passport>"
    middleName: "<optional>"
    dob: "<YYYY-MM-DD>"
    nationality: "<ISO-3166 alpha-3>"
    country: "<residency country>"
  metadata:
    counterparty_type: "individual-buyer" | "corporate-buyer" | "broker-firm" | ...
    corridor: "<per corridor mapping>"
    referring_channel: "<broker | wealth | direct | vvip>"
    vvip_flag: <bool>
    pep_class_known: "<unknown | domestic | foreign | intl-org | family | close-associate>"
preconditions:
  - external_user_id_unique: not already a Sumsub applicant for this client
  - level_appropriate_for_counterparty_type: true
risk_tier: B
approval:
  policy: explicit-human
  required_role: aml-kyc-compliance-specialist-self-approval   # operational SOP role
references:
  source_evidence:
    - clients/<slug>/wealth-channels/screening/<id>/intake.md   # or analogous
    - clients/<slug>/<channel>/registry.md#<counterparty_id>
audit:
  trace_id: <uuid>
  rollback: |
    Sumsub applicants cannot be cleanly deleted via API once created (PDPL + DNFBP retention apply).
    If created in error: mark the applicant `inactive` via update; document the error in
    clients/<slug>/wealth-channels/screening/<id>/correction.md; the applicant record persists in audit.
  retention_days: 2555   # 7 years per typical DNFBP retention; verify current with regulatory-research-specialist
```

## Post-flight

- Record returned `id` (Sumsub applicant id) in `clients/<slug>/<channel>/screening/<screening_id>/applicant.md`
- Mirror into Salesforce Account: `Screening_Provider_ID__c = <applicant id>`, `Last_Screened_Date__c = <today>`, `AML_KYC_Verdict__c = "pending"`
- Send the one-time onboarding link via the configured channel (email/SMS) — never via this integration; route through human RM or the relevant intermediary
- Set verdict-poll calendar entry (24h, 72h, 7d reminders if not complete)
- On verdict-complete webhook:
  - GREEN → `AML_KYC_Verdict__c = "cleared"`, `Risk_Rating__c` per Sumsub assessment, set re-screen cadence per risk
  - RED → `AML_KYC_Verdict__c = "hold-pending-edd"` or `"declined"` per the specific RED reason
  - sanctions hit → immediate `legal-liaison` + `chief-commercial-officer` notification; **do not signal counterparty**

## Rollback

Per the `audit.rollback` block — applicants cannot be cleanly deleted; the compensating action is to mark inactive and document the error.

## Tier promotion criteria

**Run-check does not promote to Tier C.** Every initial check requires explicit `aml-kyc-compliance-specialist` initiation, regardless of tenure. The check itself is automated; the decision to initiate is the gated step (e.g., to ensure the right applicant level is selected for the counterparty type).

**Re-screening (a separate action, not this one)** is auto-eligible per cadence and per Sumsub-side delta detection.
