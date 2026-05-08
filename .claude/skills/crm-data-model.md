---
name: crm-data-model
description: System-agnostic data model for the developer's commercial pipeline — leads, contacts, accounts, opportunities, allocations, activities, attribution. Maps the Flow repo schemas (deal-record, handoff-envelope) to the major CRM systems (Salesforce, HubSpot, Dynamics) so any agent reading or writing CRM data uses a consistent vocabulary. The Salesforce-specific mapping lives at integrations/salesforce/schema-mapping.md; this skill is the system-agnostic layer above. Used by data-quality-steward, account-executive, forecasting, analytics, broker-enablement, wealth-channel-enablement, secondary-market-specialist, and any agent that touches commercial-pipeline records.
scope: CRM data model — system-agnostic
maintained_by: data-quality-steward + crm-manager (writes via knowledge agent)
---

# CRM data model — system-agnostic

> **Read this first.** This skill describes the *shape* of the commercial-pipeline data model — what objects exist, what fields they carry, what relationships hold. The *system-specific* mapping (Salesforce field API names, HubSpot property internal names, Dynamics entity names) lives in the per-system integration spec under `integrations/<system>/schema-mapping.md`. When the developer's CRM is Salesforce (the default), the operational mapping is `integrations/salesforce/schema-mapping.md`. This skill is the lens through which agents reason; the integration mapping is how they translate.

## Core entities

| Entity | Purpose | Lifecycle |
|---|---|---|
| **Lead** | Pre-qualified inbound or outbound contact; no commercial intent yet confirmed | Qualified → Contact + Account + Opportunity, or Disqualified |
| **Contact** | An individual associated with one or more Accounts | Persistent; may carry multiple roles |
| **Account** | A buyer (individual or corporate), broker firm, wealth-channel intermediary, family office, or VVIP counterparty | Persistent; may have parent/child relationships (corporate group, family branch) |
| **Opportunity** | A specific commercial transaction in flight (per-unit off-plan, per-allocation broker, per-transfer secondary-market, per-floor multi-unit, etc.) | Through stages → closed-won or closed-lost |
| **Allocation Request** | Broker-channel allocation request preceding a buyer-side Opportunity | Approved → linked to Opportunity, or Declined |
| **Activity** | Call, email, meeting, viewing, note — anchored to one or more entities | Created → completed; persistent |
| **Inventory Unit** | Sellable instance (a specific unit, with specific configuration, in a specific tower) | Available → Reserved → Sold (or Withdrawn) |
| **Screening Verdict** | AML/KYC outcome on a counterparty | Cleared / hold-pending-EDD / declined / pending |
| **Attribution** | First-touch / introducer / channel-credit assignment per deal | Set at Opportunity creation; locked at proposal-sent stage |

## Field model — Opportunity (system-agnostic)

| Flow field | Type | Required at stage | Notes |
|---|---|---|---|
| `deal_id` | identifier | Always | System-of-record id |
| `client` | enum | Always | Client slug (one client per CRM org typical) |
| `vertical` | enum | Always | `real-estate` for developer engagements |
| `sub_vertical` | enum | Always | `developer-off-plan` / `developer-secondary` / etc. |
| `stage` | enum | Always | Per `stage_definitions` block |
| `record_type` | enum | Always | `off-plan-direct` / `off-plan-broker` / `secondary-resale` / etc. |
| `unit_id` | reference | At proposal-sent | Links to Inventory Unit |
| `proposed_payment_plan` | text | At proposal-sent | Reference to standard plan or description of bespoke |
| `decision_maker_contact_id` | reference | At proposal-sent | Links to Contact |
| `source_channel` | enum | Always | `direct` / `broker` / `wealth-channel` / `vvip-channel` / `referral` / `roadshow` / `paid-search` / `paid-social` / etc. |
| `broker_id` | reference | When broker-attributed | Links to Account (record-type: broker) |
| `wealth_channel_id` | reference | When wealth-channel-attributed | Links to Account (record-type: wealth-channel) |
| `vvip_flag` | boolean | When VVIP-touching | Triggers restricted-access sharing |
| `aml_kyc_verdict` | enum | At proposal-sent | `cleared` / `hold-pending-edd` / `declined` / `pending` |
| `aml_kyc_verdict_date` | date | At proposal-sent | Currency rule: ≤ 30 days at closed-won |
| `expected_close_date` | date | Always | |
| `expected_value` | currency | Always | AED |
| `signed_spa_date` | date | At closed-won | |
| `deposit_received_date` | date | At closed-won | |
| `loss_reason` | enum | At closed-lost | `price` / `competitor` / `timing` / `qualification` / `attribution-dispute` / `other` |
| `primary_competitor` | reference | At closed-lost | Optional; links to competitor record |

## Field model — Account (Buyer)

| Flow field | Type | Notes |
|---|---|---|
| `account_id` | identifier | |
| `name` | text | Individual: legal name; corporate: registered entity name |
| `record_type` | enum | `buyer-individual` / `buyer-corporate` / `broker` / `wealth-channel` / `family-office` / `vvip` |
| `eida_verified` | boolean | UAE-resident only |
| `passport_country` | enum | ISO-3166 |
| `residency_country` | enum | ISO-3166 |
| `risk_rating` | enum | `low` / `medium` / `high` per `.claude/skills/aml-kyc-uae-real-estate.md` |
| `edd_required` | boolean | |
| `last_screened_date` | date | |
| `screening_provider_id` | text | Audit reference (e.g., Sumsub applicant id) |
| `pep_flag` | boolean | |
| `pep_class` | enum | `domestic` / `foreign` / `intl-org` / `family` / `close-associate` |
| `sanctions_flag` | boolean | |
| `corridor` | enum | Per `.claude/skills/diaspora-corridor-marketing.md` |
| `source_of_funds_documented` | boolean | |
| `ubo_identified` | boolean | For corporate / trust |

## Field model — Activity

| Flow activity field | Type | Notes |
|---|---|---|
| `activity_id` | identifier | |
| `activity_type` | enum | `call` / `email` / `meeting` / `viewing` / `note` |
| `subject` | text | |
| `body` | text | |
| `related_to` | reference | Opportunity / Account |
| `who` | reference | Contact / Lead |
| `activity_date` | datetime | |
| `outcome` | enum | `positive` / `neutral` / `negative` / `no-response` |
| `next_step` | text | Required for `negotiation`-stage |

## Stage definitions (default — per-client may override)

| Stage | Required fields | Required artifacts | Compliance preconditions |
|---|---|---|---|
| `lead-new` | `source_channel` | None | None |
| `qualified` | + `contact_method` | None | None |
| `discovery` | + `decision_maker_contact_id` | Discovery notes | None |
| `proposal-sent` | + `proposed_unit`, `proposed_payment_plan`, `aml_kyc_verdict` | Proposal document | `aml_kyc_verdict ∈ {cleared}` ; verdict ≤ 90 days |
| `negotiation` | + `next_step` per activity | Negotiation log | `aml_kyc_verdict` current ≤ 60 days |
| `verbal-commit` | All proposal-sent + `expected_close_date` confirmed | Verbal-commit note | `aml_kyc_verdict` current ≤ 30 days |
| `closed-won` | + `unit_id`, `signed_spa_date`, `deposit_received_date` | Signed SPA, KYC evidence | `aml_kyc_verdict ∈ {cleared}` ; ≤ 30 days |
| `closed-lost` | + `loss_reason`, `primary_competitor` (optional) | Loss note | None |

## Relationships

```
Lead ──qualified──▶ Contact ◀───── Account
                                       │
                                       ├──▶ Opportunity ──▶ Inventory Unit
                                       │         │
                                       │         ├──▶ Activities (many)
                                       │         │
                                       │         ├──▶ Attribution (one)
                                       │         │
                                       │         └──▶ Allocation Request (zero or one — for broker deals)
                                       │
                                       └──▶ Screening Verdict (one or more — re-screening creates new)
```

## Source-of-truth doctrine

- **CRM is system-of-record** for the commercial pipeline
- **Repo (`clients/<client>/sales/pipeline.md`) is mirror** — for browseability and for agent reasoning
- **When CRM and repo conflict** → `crm-manager` rules; one side updates to match the other; never silently overwrite
- **Per-system field API names live in the per-system integration mapping** — this skill is the system-agnostic layer

## Cross-system mapping pattern

When the developer's CRM is *not* Salesforce (a different engagement uses HubSpot, Dynamics, Pipedrive, custom):

1. Create `integrations/<system>/schema-mapping.md` following the same shape as `integrations/salesforce/schema-mapping.md`
2. Map each Flow field above to the system's API name
3. Document any system-specific custom-field requirements
4. Document the system's audit trail mechanism
5. Create per-action specs (`integrations/<system>/actions/`) for activity-log, stage-advance, lead-create

## What this skill does NOT cover

- Specific CRM admin operations (validation rules, page layouts, profile permissions) — system-admin responsibility
- Marketing-automation system data model (Pardot, Marketo, HubSpot Marketing Hub) — partial overlap; covered separately as needed
- ERP / accounting system data (revenue recognition, invoiced, paid) — finance-system territory; we read but don't write
- Customer-data-platform (CDP) identity resolution — see `martech-ops-specialist` + `marketing-attribution.md` skill
