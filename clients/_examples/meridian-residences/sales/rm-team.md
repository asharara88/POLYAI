# In-house RM team — Meridian Residences

> Owned by `inbound-qualifier` (routing) and `account-executive` (deal management). Source of truth for who receives direct-marketing leads.
>
> Names below are illustrative for the worked example.

## Team composition

6 in-house relationship managers, organized by tier and specialization. All direct-marketing leads (microsite, paid media, sales-gallery walk-ins, owned channels) route here, never to brokers (except via opt-in overflow per `overflow-policy.md`).

## Routing principles

1. **Speed first.** Median time-to-first-contact under 5 minutes is the bar. Routing logic returns an RM assignment in under 30 seconds.
2. **Specialization matters more than load balancing.** A GCC-Arabic ultra-prime inquiry routes to a senior RM with that fit even if their load is heavier than a mid-tier RM with no fit.
3. **Capacity is a real constraint.** If a senior RM's load is at capacity, route to the next-best-fit available RM and queue an alert to sales operations.
4. **Returning prospects.** A prospect who previously interacted with an RM in the last 90 days routes back to that RM, regardless of fit/capacity.
5. **Override gracefully.** Sales leadership occasionally pulls a lead. Log it; don't fight it.

## RM roster

```yaml
- rm_id: rm-01
  name: "[Senior RM A]"
  tier: senior
  specializations: [GCC investor, ultra-prime, branded residences, penthouse]
  languages: [en, ar]
  current_load: 14
  capacity: 25
  prior_quarter_close_rate: 0.22
  prior_quarter_avg_deal_size_aed: 9200000
  active: true

- rm_id: rm-02
  name: "[Senior RM B]"
  tier: senior
  specializations: [diaspora UK, end-user upgrade, family-office]
  languages: [en]
  current_load: 18
  capacity: 25
  prior_quarter_close_rate: 0.19
  prior_quarter_avg_deal_size_aed: 5400000
  active: true

- rm_id: rm-03
  name: "[Senior RM C]"
  tier: senior
  specializations: [diaspora India, GCC investor, NRI corridor]
  languages: [en, hi, ur]
  current_load: 11
  capacity: 25
  prior_quarter_close_rate: 0.17
  prior_quarter_avg_deal_size_aed: 4100000
  active: true

- rm_id: rm-04
  name: "[Mid-tier RM D]"
  tier: mid
  specializations: [end-user upgrade, GCC investor]
  languages: [en, ar]
  current_load: 22
  capacity: 30
  prior_quarter_close_rate: 0.14
  prior_quarter_avg_deal_size_aed: 3200000
  active: true

- rm_id: rm-05
  name: "[Mid-tier RM E]"
  tier: mid
  specializations: [end-user upgrade, mid-market investor, lease-conversion]
  languages: [en]
  current_load: 19
  capacity: 30
  prior_quarter_close_rate: 0.12
  prior_quarter_avg_deal_size_aed: 2900000
  active: true

- rm_id: rm-06
  name: "[Junior RM F]"
  tier: junior
  specializations: [first-time investor, end-user, exploratory]
  languages: [en, ar]
  current_load: 28
  capacity: 35
  prior_quarter_close_rate: 0.09
  prior_quarter_avg_deal_size_aed: 2400000
  active: true
```

## Capacity overview (snapshot)

| Tier | RMs | Total capacity | Total load | Available |
|---|---|---|---|---|
| Senior | 3 | 75 | 43 | 32 |
| Mid | 2 | 60 | 41 | 19 |
| Junior | 1 | 35 | 28 | 7 |
| **Total** | **6** | **170** | **112** | **58** |

Headroom: 34% across the team. Comfortable for a launch period; anything below 15% triggers an overflow review.

## Routing decision rationale (what the simulator returns)

For each lead, the simulator returns:
- Assigned RM (id + name)
- Match-score breakdown (specialization fit / language match / capacity / segment-history / returning-prospect bonus)
- Alternatives (next-best 1–2 RMs)
- Anti-patterns avoided (returning-prospect rule applied / specialization preserved / over-capacity avoided)
- Speed target (5 minutes from form submission to RM acknowledgment)
- Next actions (RM acknowledges in HubSpot, calls within 5 min, logs first-touch outcome within 24h)

## Performance ledger

(populated post-launch from CRM data via integration)
