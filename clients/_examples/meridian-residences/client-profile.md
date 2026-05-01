# Client profile — Meridian Residences

> **Status:** worked example for documentation purposes. Not a real engagement.
> Populated by `client-onboarding` from a fictional intake brief, with vertical defaults pulled from `verticals/real-estate/playbook.md`.

```yaml
slug: meridian-residences
display_name: Meridian Residences
vertical: real-estate
sub_vertical: developer
sub_sub_vertical_notes: |
  Developer-class engagement, off-plan launch, branded-residences sub-pattern
  (hospitality operator JV). Inherits verticals/real-estate/playbook.md +
  verticals/real-estate/sub-verticals/developer/playbook.md.
markets:
  primary: AE
  secondary: [SA, KW, QA, BH, OM, IN, GB]
languages:
  primary: en
  secondary: [ar]
offerings:
  - branded-residence-units (1BR–4BR + penthouses)
  - serviced-residence-program (rental-pool participation)
business_model: transactional
sales_motion: field
typical_deal_cycle_days: 45
typical_deal_size: AED 2.4M – AED 18M
icp_segments_ref: clients/_examples/meridian-residences/knowledge/icp.md
brand_voice_ref: clients/_examples/meridian-residences/knowledge/brand-voice.md

agencies:
  brand:
    name: Leo Burnett MENA
    profile_ref: clients/_examples/meridian-residences/agencies/leo-burnett-mena/profile.md
    primary_contact: # TODO populate after kickoff
  media:
    name: Havas Media MENA
    profile_ref: clients/_examples/meridian-residences/agencies/havas-mena/profile.md
    primary_contact: # TODO populate after kickoff
  digital_production: # TBD
  pr: # TBD

broker_strategy:
  registry_ref: clients/_examples/meridian-residences/brokers/registry.md
  network_size_target: 180
  tier_distribution:
    tier_1: 12   # exclusive private-event tier
    tier_2: 60
    tier_3: 108
  speed_to_lead_sla_minutes: 5
  exclusive_period_weeks: 2  # tier-1 gets 2 weeks exclusive on premium-tier units
  channel_development_targets_quarterly:
    reactivations: 4
    new_signings: 8

wealth_channel_strategy:
  registry_ref: clients/_examples/meridian-residences/wealth-channels/registry.md
  active_target_by_launch:
    private_banks: 6
    family_offices: 12
    independent_introducers: 18
  expected_share_of_revenue: 0.30  # ~30% of revenue from <10% of reservations
  expected_share_of_reservations: 0.08
  channel_development_targets_quarterly:
    reactivations: 2
    new_signings: 6

inventory:
  current_ref: clients/_examples/meridian-residences/inventory/current.md
  total_units: 280
  unit_types: [1BR, 2BR, 3BR, 4BR, penthouse]

integrations:
  crm: HubSpot # currently; planned migration to Salesforce in Q4
  ad_platforms: [Google Ads, Meta, LinkedIn, Property Finder, Bayut]
  email_platform: HubSpot
  analytics: GA4 + HubSpot revenue attribution + planned Tableau publishing
  bi_dashboards: Tableau (in build)
  e_signature: DocuSign
  collaboration: Slack
  asset_management: Bynder
  design_review: Canva (agency working files) # MCP-integrated
  planning_boards: Miro # MCP-integrated
  other: [WhatsApp Business API, Calendly]

approval_gates:
  outbound_email_threshold: 0
  social_publish: always-approve
  paid_spend_cap: 25000
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

compliance_flags:
  - RERA
  - off-plan-disclosure
  - financial-promotion
  - escrow-disclosure
  - SPA-language-consistency
  - GDPR
  - broker-disclosure

exclusions:
  - no cold WhatsApp without prior consent
  - no published "guaranteed" yield language
  - no comparison ads naming competing developers
  - no "limited-time" pressure language without RERA-approved scarcity claim

status: onboarding
engagement_start: 2026-04-29
engagement_end: null
notes: |
  Q3 launch is the immediate priority. 280-unit branded-residence tower on
  Saadiyat coast. Hospitality operator co-brand (TBD in agency-onboarding).
  Sales runs through 6 in-house brokers + ~180 external brokers in tiers.
  Listings live on Property Finder + Bayut as primary portals; Rightmove
  (UK) and Magicbricks (India) for diaspora segments.
```
