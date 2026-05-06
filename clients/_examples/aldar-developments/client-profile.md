# Client profile — Aldar Developments

> **Worked example — illustrative.** Fictional data demonstrating how POLYAI structures a developer-class engagement. Not real Aldar Properties PJSC data; no claim of partnership or endorsement. Names of real broker firms, agencies, and institutions appear because they're publicly active in the UAE market — references are illustrative of *category*, not actual relationships.
>
> Populated by `client-onboarding` from a fictional intake brief, with vertical defaults pulled from `verticals/real-estate/sub-verticals/developer/playbook.md`.

```yaml
slug: aldar-developments
display_name: Aldar Developments
vertical: real-estate
sub_vertical: developer
sub_sub_vertical_notes: |
  Developer-class engagement — Abu Dhabi-anchored, multi-emirate portfolio,
  multi-asset (residential + branded residences + hospitality co-brand +
  schools-adjacent + commercial). Inherits verticals/real-estate/playbook.md +
  verticals/real-estate/sub-verticals/developer/playbook.md.
markets:
  primary: AE
  primary_emirate: AD
  secondary: [SA, KW, QA, BH, OM, IN, GB, EG, RU]
  active_master_communities:
    - "Saadiyat Island"
    - "Yas Island"
    - "Al Raha"
    - "Al Ghadeer"
    - "Reem Island"
    - "Hudayriyat Island"
    - "Dubai (selective expansion)"
languages:
  primary: en
  secondary: [ar]
  diaspora_supported: [hi, ru, fr]
offerings:
  - residential-apartments
  - branded-residence-units (with named hospitality operators)
  - villas-and-townhouses
  - hospitality (co-branded with operator)
  - schools-adjacent residential
  - commercial / office (selective)
business_model: transactional-residential + recurring-hospitality + recurring-education-adjacent
sales_motion: field
typical_deal_cycle_days: 45
typical_deal_size: AED 1.6M – AED 24M
icp_segments_ref: clients/_examples/aldar-developments/knowledge/icp.md
brand_voice_ref: clients/_examples/aldar-developments/knowledge/brand-voice.md

agencies:
  brand:
    name: Memac Ogilvy
    profile_ref: clients/_examples/aldar-developments/agencies/memac-ogilvy/profile.md
    primary_contact: # TODO populate after kickoff
  media:
    name: Havas Media MENA
    profile_ref: clients/_examples/aldar-developments/agencies/havas-mena/profile.md
    primary_contact: # TODO populate after kickoff
  digital_production: Wunderman Thompson MENA
  pr: # TBD

broker_strategy:
  registry_ref: clients/_examples/aldar-developments/brokers/registry.md
  network_size_target: 250
  tier_distribution:
    tier_1: 18
    tier_2: 82
    tier_3: 150
  speed_to_lead_sla_minutes: 5
  exclusive_period_weeks: 2
  channel_development_targets_quarterly:
    reactivations: 6
    new_signings: 12

wealth_channel_strategy:
  registry_ref: clients/_examples/aldar-developments/wealth-channels/registry.md
  active_target_by_launch:
    private_banks: 8
    family_offices: 16
    independent_introducers: 24
  expected_share_of_revenue: 0.32
  expected_share_of_reservations: 0.10
  channel_development_targets_quarterly:
    reactivations: 3
    new_signings: 8

vvip_channel_strategy:
  registry_ref: clients/_examples/aldar-developments/vvip-channel/registry.md
  protocol_library_ref: clients/_examples/aldar-developments/vvip-channel/protocol-library.md
  active_target_by_launch:
    ruling_families: 5
    government_officials: 8
    foreign_dignitaries: 4
    sovereign_institutions: 4
  primary_outcome: relationship
  no_mention_list_propagated_to: [social-media, creative, pr, agency-liaison]
  pep_screening_cadence: annual
  channel_development_targets_quarterly:
    cultivation_introductions: 4
    reactivations: 2
    protocol_library_refreshes: 1

inventory:
  current_ref: clients/_examples/aldar-developments/inventory/current.md
  total_units_in_active_launch: 280
  active_launch_project: "Saadiyat Reserve Heights"
  unit_types: [1BR, 2BR, 3BR, 4BR, penthouse]
  notes: |
    "Saadiyat Reserve Heights" is the active Q3 launch demo. The full
    pipeline would normally run many concurrent launches across master
    communities; this worked example focuses on one for clarity.

integrations:
  crm: Salesforce (Real Estate Cloud)
  ad_platforms: [Google Ads, Meta, LinkedIn, Property Finder, Bayut, Dubizzle]
  email_platform: Salesforce Marketing Cloud
  analytics: GA4 + Salesforce revenue attribution + Tableau (in production)
  bi_dashboards: Tableau + Power BI (cross-functional)
  e_signature: DocuSign
  collaboration: Slack
  asset_management: Bynder
  design_review: Canva (agency working files)
  planning_boards: Miro
  other: [WhatsApp Business API, Calendly]

approval_gates:
  outbound_email_threshold: 0
  social_publish: always-approve
  paid_spend_cap: 250000
  proposal_send: always-approve
  contract_signature: always-approve
  broker_communication:
    bulk: always-approve
    1-to-1: approve-non-standard
  inventory_change:
    pricing_tier: always-approve
    unit_availability: always-approve
  agency_brief_send: always-approve
  press_pitch: always-approve
  rera_filing: always-approve
  adgm_filing: always-approve

  # Phase 5B — depth gates (route via decision-router per schemas/decision-memo.md)
  deal_desk_exception:
    deal_above_aed: 50000000              # any deal > AED 50M routes to CCO
    discount_above_pct: 8                  # any discount > 8% routes to CCO
    non_standard_payment_plan: route-cco   # any plan beyond Structures A-D in payment-plan-structures skill
  channel_development_spend:
    broker_event_above_aed: 100000
    wealth_channel_hospitality_above_aed: 75000
    vvip_event_above_aed: 250000
  marketing_budget_reallocation:
    within_quarter_pct: 15                 # > 15% reallocation within a quarter routes to CCO + CMO
  international_roadshow:
    above_aed: 200000                       # every roadshow > AED 200k OR > 1 corridor
    multi_corridor: route-cco
  aml_kyc_edd_elevation:
    pep_edd_continuation: route-cco-and-head-of-compliance
    russia_cis_corridor_continuation: route-cco-and-head-of-compliance
  vvip_relationship_activation:
    new_vvip_account: restricted-route-vvip-channel-enablement-and-wealth-vvip-manager-and-cco
    dormant_vvip_reactivation: restricted-route-vvip-channel-enablement-and-wealth-vvip-manager-and-cco
  decision_memo_required:
    quarterly_exec_brief_material_risks_section: cco-sign-off
    monthly_board_prep_summary: cco-sign-off
    annual_commercial_plan_targets: cco-and-cfo-and-ceo

compliance_flags:
  - ADGM
  - RERA
  - off-plan-disclosure
  - financial-promotion
  - escrow-disclosure
  - SPA-language-consistency
  - GDPR
  - DIFC-DSGVO
  - broker-disclosure
  - PEP
  - sanctions-screening

exclusions:
  - no cold WhatsApp without prior consent
  - no published "guaranteed" yield language
  - no comparison ads naming competing developers
  - no "limited-time" pressure language without RERA / ADGM-approved scarcity claim
  - no public reference to VVIP relationships under any circumstance

status: onboarding
engagement_start: 2026-04-29
engagement_end: null
notes: |
  Abu Dhabi-anchored developer with multi-emirate portfolio. Active Q3
  flagship launch is "Saadiyat Reserve Heights" (280-unit branded-residence
  tower with hospitality-operator co-brand). Sales motion runs through
  18 in-house RMs on the project + ~250 external brokers in tiers, plus
  parallel wealth + VVIP channels.

  The marketing-budget figures and pipeline numbers are scaled to AED-billion-
  class context appropriate for a major UAE developer (vs. a single-tower
  indie). Compliance is heavier than a Dubai-only developer: ADGM is the
  home regulator alongside RERA for Dubai-side projects.
```
