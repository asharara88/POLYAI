# Broker registry — Aldar Developments

> **Worked example — illustrative.** Real firm names appear below because they're publicly active in the UAE market — references are illustrative of *category*, not actual relationships with Aldar Properties PJSC.
>
> Owned by `broker-enablement`. Source of truth for which broker firms and individuals are active on this launch, their tier, and their specialization.

## Tier structure

- **Tier 1 (18 firms):** exclusive private-event access; first 2 weeks exclusive on premium-tier units (3BR / 4BR / penthouse). Historical conversion 6%+ on this developer's prior launches. Senior-broker-led organizations.
- **Tier 2 (82 firms):** group-session trained, full inventory access from week 3. Active in the segment, conversion 3–6%.
- **Tier 3 (150 firms):** broad-distribution tier; volume-driven, conversion 1–3%. Receives leads after Tier 1 + 2 capacity is met.

## Routing principles

1. Lead-source-aware: GCC investor inquiries → Tier-1 first; diaspora inquiries → brokers who match language + market specialization.
2. Speed-first: first broker to acknowledge gets the lead; auto-reroute after 5 minutes of silence.
3. Anti-double-routing: same prospect touched in last 30 days → same broker or escalate.
4. Specialization required: penthouse-tier inquiries route only to Tier-1 with prior penthouse closes.
5. Corridor-aware: Saadiyat-corridor inquiries route to brokers with Abu Dhabi-anchored books; Dubai-corridor inquiries to brokers with Dubai-resident clientele.

## Tier-1 (sample — 7 of 18)

```yaml
- firm: "Driven Properties"
  tier: 1
  specializations: [GCC investor, ultra-prime, branded residences]
  languages: [en, ar]
  prior_launch_conversion: 0.072
  primary_broker: # TODO
  active: true

- firm: "Allsopp & Allsopp"
  tier: 1
  specializations: [end-user upgrade, diaspora UK]
  languages: [en]
  prior_launch_conversion: 0.064
  primary_broker: # TODO
  active: true

- firm: "Better Homes"
  tier: 1
  specializations: [GCC investor, family-office, AD-resident]
  languages: [en, ar]
  prior_launch_conversion: 0.061
  primary_broker: # TODO
  active: true

- firm: "Espace Real Estate"
  tier: 1
  specializations: [end-user upgrade, GCC investor]
  languages: [en, ar]
  prior_launch_conversion: 0.069
  primary_broker: # TODO
  active: true

- firm: "Provident Estate"
  tier: 1
  specializations: [diaspora India, GCC investor]
  languages: [en, hi]
  prior_launch_conversion: 0.058
  primary_broker: # TODO
  active: true

- firm: "LuxuryProperty.com"
  tier: 1
  specializations: [ultra-prime, branded residences, penthouse]
  languages: [en, ar, ru]
  prior_launch_conversion: 0.066
  primary_broker: # TODO
  active: true

- firm: "fäm Properties"
  tier: 1
  specializations: [GCC investor, dual-corridor (AD + Dubai)]
  languages: [en, ar]
  prior_launch_conversion: 0.063
  primary_broker: # TODO
  active: true
```

## Tier-2, Tier-3

(full registry maintained in CRM / Salesforce; this file mirrors the marketing-relevant slice for `broker-enablement`)

## Tier-2 (sample — 6 of 82)

```yaml
- firm: "haus & haus"
  tier: 2
  specializations: [end-user upgrade, AD-resident, family-segment]
  languages: [en, ar]
  prior_launch_conversion: 0.048
  primary_broker: # TODO
  active: true

- firm: "Engel & Völkers Middle East"
  tier: 2
  specializations: [diaspora Germany, diaspora Switzerland, end-user upgrade]
  languages: [en, de]
  prior_launch_conversion: 0.052
  primary_broker: # TODO
  active: true

- firm: "Metropolitan Premium Properties"
  tier: 2
  specializations: [GCC investor, diaspora Russia-CIS, lifestyle-segment]
  languages: [en, ru, ar]
  prior_launch_conversion: 0.041
  primary_broker: # TODO
  active: true

- firm: "Aqua Properties"
  tier: 2
  specializations: [diaspora UK, end-user upgrade]
  languages: [en]
  prior_launch_conversion: 0.039
  primary_broker: # TODO
  active: true

- firm: "Banke International Properties"
  tier: 2
  specializations: [GCC investor, AD-resident, family-segment]
  languages: [en, ar]
  prior_launch_conversion: 0.046
  primary_broker: # TODO
  active: true

- firm: "D&B Properties"
  tier: 2
  specializations: [end-user upgrade, diaspora India]
  languages: [en, hi]
  prior_launch_conversion: 0.043
  primary_broker: # TODO
  active: true
```

## Tier-3 (sample — 5 of 150)

```yaml
- firm: "Foot Print Real Estate"
  tier: 3
  specializations: [volume-distribution, diaspora India]
  languages: [en, hi]
  prior_launch_conversion: 0.022
  primary_broker: # TODO
  active: true

- firm: "Trinity Homes"
  tier: 3
  specializations: [volume-distribution, end-user upgrade]
  languages: [en]
  prior_launch_conversion: 0.019
  primary_broker: # TODO
  active: true

- firm: "Stage Properties"
  tier: 3
  specializations: [volume-distribution, lifestyle-segment]
  languages: [en, ar]
  prior_launch_conversion: 0.024
  primary_broker: # TODO
  active: true

- firm: "Coldwell Banker UAE"
  tier: 3
  specializations: [diaspora US, end-user upgrade]
  languages: [en]
  prior_launch_conversion: 0.017
  primary_broker: # TODO
  active: false
  dormant: true
  dormant_since: 2025-11

- firm: "Skyline Properties"
  tier: 3
  specializations: [volume-distribution]
  languages: [en, ar]
  prior_launch_conversion: 0.014
  primary_broker: # TODO
  active: false
  dormant: true
  dormant_since: 2026-01
```

## Performance ledger (post-launch — populated as the campaign progresses)

(empty — engagement just started)

## Disputes (active)

(none)
