# Salesforce — schema mapping

This file maps Salesforce standard + custom objects to the POLYAI repo schemas (`schemas/deal-record.md`, `schemas/handoff-envelope.md`, etc.). When agents read or write Salesforce data, they translate through this mapping.

**Source-of-truth doctrine:** Salesforce is the system-of-record for the commercial pipeline. The repo is mirror. When they conflict, `crm-manager` rules; resolution is logged and one side is updated to match.

## Object map

| POLYAI concept | Salesforce object | Notes |
|---|---|---|
| Lead | `Lead` | New inbound contact pre-qualification. Converts to Contact + Account + Opportunity on qualification. |
| Buyer / counterparty | `Account` (record type: `buyer`) | Individual or corporate buyer. UBO captured via related contacts where corporate. |
| Broker firm | `Account` (record type: `broker`) | Mirrors `clients/<slug>/brokers/registry.md`. |
| Wealth-channel intermediary | `Account` (record type: `wealth-channel`) | Mirrors `clients/<slug>/wealth-channels/registry.md`. |
| Family office | `Account` (record type: `family-office`) | Distinct from wealth-channel for relationship-tracking purposes. |
| VVIP counterparty | `Account` (record type: `vvip`) | **Restricted-access record** per discretion stance. Per-record sharing rule limits to the named team. |
| Contact (any individual) | `Contact` | Linked to Account. UBO captured via related-contact role. |
| Deal / opportunity | `Opportunity` | Per-unit (off-plan direct), per-allocation (broker), per-transfer (secondary-market). |
| Activity (call, email, meeting, viewing) | `Task` or `Event` | Activity-log integration writes here. |
| Inventory unit | Custom: `Unit__c` | Mirrors `clients/<slug>/inventory/units.md`. Linked to Opportunity via lookup. |
| Allocation request | Custom: `Allocation_Request__c` | For broker allocations. Distinct from Opportunity (allocation precedes opportunity). |
| AML/KYC verdict | Custom fields on Account: `risk_rating__c`, `last_screened_date__c`, `edd_required__c`, `screening_provider_id__c` | Operational truth lives in the screening provider (Sumsub) audit log; Salesforce holds the verdict + reference id only. |
| PEP / sanctions flag | Custom fields on Account: `pep_flag__c`, `sanctions_flag__c` | Boolean + date-of-last-check. |
| Golden Visa eligibility | Custom field on Opportunity: `golden_visa_eligible__c` | Indicative; final eligibility determined by visa application. |

## Field map — Opportunity

| POLYAI field | Salesforce field | Type | Notes |
|---|---|---|---|
| `deal_id` | `Id` | Standard | |
| `client` | (implicit by org) | n/a | One client per Salesforce org |
| `vertical` | (implicit) | n/a | Always `real-estate` for developer engagements |
| `sub_vertical` | `Sub_Vertical__c` | Picklist | `developer-off-plan`, `developer-secondary`, `commercial-leasing`, etc. |
| `stage` | `StageName` | Standard picklist | Per `integrations/salesforce/spec.md` `stage_definitions` block in per-client config |
| `unit_id` | `Unit__c` (lookup) | Custom | Links to `Unit__c` record |
| `proposed_payment_plan` | `Payment_Plan__c` | Long Text | |
| `decision_maker_contact_id` | `Decision_Maker__c` (lookup) | Custom | Links to Contact |
| `source_channel` | `LeadSource` | Standard | Or custom `Source_Channel__c` for finer granularity |
| `broker_id` | `Broker__c` (lookup to Account) | Custom | Set when broker-attributed |
| `wealth_channel_id` | `Wealth_Channel__c` (lookup to Account) | Custom | Set when wealth-channel-attributed |
| `vvip_flag` | `VVIP__c` | Checkbox | Triggers restricted-access sharing rule |
| `aml_kyc_verdict` | `AML_KYC_Verdict__c` | Picklist (`cleared`, `hold-pending-edd`, `declined`, `pending`) | |
| `aml_kyc_verdict_date` | `AML_KYC_Verdict_Date__c` | Date | |
| `expected_close_date` | `CloseDate` | Standard | |
| `expected_value` | `Amount` | Standard | In AED (per-org currency setting) |
| `signed_spa_date` | `Signed_SPA_Date__c` | Date | Required at `closed-won` |
| `deposit_received_date` | `Deposit_Received_Date__c` | Date | Required at `closed-won` |
| `loss_reason` | `Loss_Reason__c` | Picklist | Required at `closed-lost` |
| `primary_competitor` | `Primary_Competitor__c` | Lookup to custom Competitor object | |
| `created_at` | `CreatedDate` | Standard | |
| `last_modified_at` | `LastModifiedDate` | Standard | |

## Field map — Account (Buyer)

| POLYAI field | Salesforce field | Type | Notes |
|---|---|---|---|
| `account_id` | `Id` | Standard | |
| `name` | `Name` | Standard | Individual: full legal name; corporate: registered entity name |
| `record_type` | `RecordTypeId` | Standard | Per object map |
| `eida_verified` | `EIDA_Verified__c` | Checkbox | UAE-resident only |
| `passport_country` | `Passport_Country__c` | Picklist (ISO codes) | |
| `residency_country` | `Residency_Country__c` | Picklist | |
| `risk_rating` | `Risk_Rating__c` | Picklist (`low`, `medium`, `high`) | Per `.claude/skills/aml-kyc-uae-real-estate.md` |
| `edd_required` | `EDD_Required__c` | Checkbox | |
| `last_screened_date` | `Last_Screened_Date__c` | Date | |
| `screening_provider_id` | `Screening_Provider_ID__c` | Text | Audit reference; documents do not flow here |
| `pep_flag` | `PEP_Flag__c` | Checkbox | |
| `pep_class` | `PEP_Class__c` | Picklist (`domestic`, `foreign`, `intl-org`, `family`, `close-associate`) | When `pep_flag` true |
| `sanctions_flag` | `Sanctions_Flag__c` | Checkbox | |
| `corridor` | `Corridor__c` | Picklist (`UAE-resident`, `India`, `KSA`, `UK`, `Russia-CIS`, `Egypt`, `Pakistan`, `Nigeria`, `US`, `Other`) | |
| `source_of_funds_documented` | `SoF_Documented__c` | Checkbox + linked SoF document reference | |
| `ubo_identified` | `UBO_Identified__c` | Checkbox | For corporate / trust |

## Field map — Activity (Task / Event)

| POLYAI activity field | Salesforce field | Type | Notes |
|---|---|---|---|
| `activity_id` | `Id` | Standard | |
| `activity_type` | `Type` (for Event) or `TaskSubtype` | Standard | `call`, `email`, `meeting`, `viewing` |
| `subject` | `Subject` | Standard | |
| `body` | `Description` | Standard | |
| `related_to` | `WhatId` | Standard | Opportunity / Account |
| `who` | `WhoId` | Standard | Contact / Lead |
| `activity_date` | `ActivityDate` (Task) or `StartDateTime` (Event) | Standard | |
| `outcome` | `Outcome__c` | Custom picklist | `positive`, `neutral`, `negative`, `no-response` |
| `next_step` | `Next_Step__c` | Long Text | Required for `negotiation`-stage activities |

## Translation rules

1. **Currency:** All AED in Salesforce; the repo notes currency in artifacts. Conversion happens at finance-system handoff.
2. **Dates:** Salesforce uses local-org timezone; the repo uses UTC ISO-8601. Translate at the integration boundary.
3. **Picklist values:** When the repo and Salesforce drift on picklist labels, Salesforce wins (system-of-record).
4. **Custom fields:** Per-client API names captured in `clients/<slug>/integrations/salesforce/config.md`. Never hard-code an API name in agent prompts.
5. **Restricted records:** VVIP-flagged Accounts use a Salesforce sharing rule that limits visibility to the named team. Reads from POLYAI agents respect that — `vvip-channel-enablement` and `wealth-vvip-manager` only.
6. **Soft-deletes:** Salesforce uses recycle-bin; the repo treats `IsDeleted=true` as gone. Do not surface deleted records in any rollup.

## Drift detection

`data-quality-steward` runs a daily scan comparing:

- Total active opportunities by stage (Salesforce vs. repo `pipeline.md`)
- Per-opportunity field completeness against the per-stage `stage_definitions` requirements
- Account count by record type (Salesforce vs. repo registries)

Material divergence (> 5% by count or any single high-value record divergent) triggers `crm-manager` escalation per `data-quality-steward.md` SOP.
