# Client profile — Meridian Residences

> **Status:** worked example for documentation purposes. Not a real engagement.
> Populated by `client-onboarding` from a fictional intake brief, with vertical defaults pulled from `verticals/real-estate/playbook.md`.

```yaml
slug: meridian-residences
display_name: Meridian Residences
vertical: real-estate
sub_vertical: off-plan-luxury
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
integrations:
  crm: HubSpot
  ad_platforms: [Google Ads, Meta, LinkedIn, Property Finder, Bayut]
  email_platform: HubSpot
  analytics: GA4 + HubSpot revenue attribution
  other: [WhatsApp Business API, Calendly]
approval_gates:
  outbound_email_threshold: 0     # all outbound to investors requires human approval
  social_publish: always-approve
  paid_spend_cap: 25000           # AED/day per platform without re-approval
  proposal_send: always-approve
  contract_signature: always-approve
compliance_flags:
  - RERA                          # Dubai Real Estate Regulatory Agency
  - off-plan-disclosure
  - financial-promotion           # rental-yield claims
  - GDPR                          # EU-resident investor outreach
exclusions:
  - no cold WhatsApp without prior consent
  - no published "guaranteed" yield language
  - no comparison ads naming competing developers
status: onboarding
engagement_start: 2026-04-29
engagement_end: null
notes: |
  Q3 launch is the immediate priority. Sales team is 6 in-house brokers + 2 external
  agencies on commission split. Listings will appear on Property Finder and Bayut as
  primary portals; secondary push on Rightmove (UK) and Magicbricks (India) for
  diaspora investor segments.
```
