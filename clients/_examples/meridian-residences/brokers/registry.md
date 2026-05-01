# Broker registry — Meridian Residences

> Owned by `broker-enablement`. Source of truth for which broker firms and individuals are active on this launch, their tier, and their specialization.
>
> Names below are illustrative for the worked example — replace with real broker firms when onboarding a real client.

## Tier structure

- **Tier 1 (12 firms):** exclusive private-event access; first 2 weeks exclusive on premium-tier units (3BR / 4BR / penthouse). Historical conversion 6%+ on this developer's prior launches. Senior-broker-led organizations.
- **Tier 2 (60 firms):** group-session trained, full inventory access from week 3. Active in the segment, conversion 3–6%.
- **Tier 3 (108 firms):** broad-distribution tier; volume-driven, conversion 1–3%. Receives leads after Tier 1 + 2 capacity is met.

## Routing principles

1. Lead-source-aware: GCC investor inquiries → Tier-1 first; diaspora inquiries → brokers who match language + market specialization.
2. Speed-first: first broker to acknowledge gets the lead; auto-reroute after 5 minutes of silence.
3. Anti-double-routing: same prospect touched in last 30 days → same broker or escalate.
4. Specialization required: penthouse-tier inquiries route only to Tier-1 with prior penthouse closes.

## Tier-1 (sample — 5 of 12)

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
  specializations: [GCC investor, family-office]
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
```

## Tier-2, Tier-3

(full registry maintained in CRM; this file mirrors the marketing-relevant slice for `broker-enablement`)

## Performance ledger (post-launch — populated as the campaign progresses)

(empty — engagement just started)

## Disputes (active)

(none)
