# Allocation rules — UAE Developments / Saadiyat Reserve Heights

> **Worked example — illustrative.** Not real UAE Developments data.
>
> Owned by `broker-enablement` (per-tier eligibility logic) and `sales-operations` (commercial sign-off).
> Source of truth for whether a broker allocation request is approved, declined, or countered.

## Plan eligibility

```yaml
plan_eligibility:
  pp-30-70:
    label: "30% during construction, 70% post-handover"
    eligible_broker_tiers: [1]
    eligible_unit_types: [3BR, 4BR, penthouse]
    notes: "Special plan; tier-1 only; >2 deals/firm/quarter requires CMO approval"
    cmo_approval_threshold_per_firm_per_quarter: 2

  pp-50-50:
    label: "50% during construction, 50% on handover"
    eligible_broker_tiers: [1, 2, 3]
    eligible_unit_types: [penthouse]
    notes: "Standard for penthouse"

  pp-60-40:
    label: "60% during construction, 40% on handover"
    eligible_broker_tiers: [1, 2, 3]
    eligible_unit_types: [1BR, 2BR, 3BR, 4BR]
    notes: "Standard launch plan"
```

## Unit-type restrictions

```yaml
unit_type_restrictions:
  penthouse:
    eligible_broker_tiers: [1]
    notes: "Penthouse units tier-1 only during launch + first 8 weeks of sustain"
    review_at_week: 8

  4BR:
    eligible_broker_tiers: [1, 2]
    notes: "4BR limited to tier-1 + tier-2 for first 4 weeks; opens to tier-3 thereafter"
    review_at_week: 4

  3BR:
    eligible_broker_tiers: [1, 2, 3]
    notes: "Open to all tiers"

  2BR:
    eligible_broker_tiers: [1, 2, 3]

  1BR:
    eligible_broker_tiers: [1, 2, 3]
```

## Multi-unit thresholds

```yaml
multi_unit:
  3_or_more_units:
    requires:
      - wealth-channel-enablement (lead the conversation)
      - sales_leadership_approval
      - bespoke commercial review
    notes: "Multi-unit requests are a wealth-channel motion, not a broker motion. Re-route."
  
  full_floor:
    requires:
      - wealth-channel-enablement OR vvip-channel-enablement (depending on principal)
      - CMO + CFO + Head of Sales approval
      - bespoke SPA terms
```

## Hold and expiry

```yaml
holds:
  default_duration_hours: 48
  extension_max_hours: 24
  extension_requires_approval: true
  extension_approver: sales-operations
```

## Anti-double-allocation

```yaml
anti_double_allocation:
  window_days: 14
  notes: |
    If the same prospect (matched by phone OR email OR national ID where available)
    has been the subject of an allocation request from a different broker in the
    last 14 days, do NOT auto-approve. Surface to sales operations for resolution.
    Common causes: prospect visited multiple brokers; prospect changed brokers;
    co-broking arrangement.
```

## RERA + commercial pre-flight

```yaml
required_pre_flight:
  - broker_has_rera_acknowledgment: true        # broker must have signed off on the RERA disclosure pack for this project
  - broker_has_current_commission_grid_signed: true
  - broker_firm_status_active: true             # not dormant or off-boarded
  - broker_firm_in_good_standing: true          # no open disputes / commission claims
```

## Decision matrix

| Outcome | When |
|---|---|
| **Approve** | All checks pass, hold placed for 48h |
| **Decline (inventory)** | Unit not available (sold, on-hold elsewhere, withdrawn) |
| **Decline (eligibility)** | Plan not eligible for broker tier OR unit type not eligible for tier |
| **Decline (pre-flight)** | RERA / commission / firm status check fails |
| **Counter** | Inventory available but plan ineligible — counter-offer the eligible plan for that unit |
| **Escalate** | Anti-double-allocation triggered, multi-unit threshold hit, full-floor request, or any non-standard term |
