# In-house RM team — UAE Developments

> **Worked example — illustrative.** Not real UAE Developments data.
>
> Owned by `inbound-qualifier` (routing) and `account-executive` (deal management). Source of truth for who receives direct-marketing leads.

## Team composition

8 in-house relationship managers on the active flagship project, organized by tier and specialization. Direct-marketing leads (microsite, paid media, sales-gallery walk-ins, owned channels) route here, never to external brokers (except via opt-in overflow per `overflow-policy.md`).

## Routing principles

1. **Speed first.** Median time-to-first-contact under 5 minutes is the bar. Routing logic returns an RM assignment in under 30 seconds.
2. **Specialization matters more than load balancing.** A GCC-Arabic ultra-prime inquiry routes to a senior RM with that fit even if their load is heavier than a mid-tier RM with no fit.
3. **Capacity is a real constraint.** If a senior RM's load is at capacity, route to the next-best-fit available RM and queue an alert to sales operations.
4. **Returning prospects.** A prospect who previously interacted with an RM in the last 90 days routes back to that RM, regardless of fit/capacity.
5. **Dual-corridor specialists.** AD-portfolio buyers often consider both Saadiyat and Yas; route to a dual-corridor RM where applicable.
6. **Override gracefully.** Sales leadership occasionally pulls a lead. Log it; don't fight it.

## RM roster

```yaml
- rm_id: rm-01
  name: "[Senior RM A]"
  tier: senior
  specializations: [GCC investor, ultra-prime, branded residences, penthouse, Saadiyat-corridor]
  languages: [en, ar]
  current_load: 16
  capacity: 25
  prior_quarter_close_rate: 0.22
  prior_quarter_avg_deal_size_aed: 9200000
  active: true

- rm_id: rm-02
  name: "[Senior RM B]"
  tier: senior
  specializations: [diaspora UK, end-user upgrade, family-office, Saadiyat-corridor]
  languages: [en]
  current_load: 19
  capacity: 25
  prior_quarter_close_rate: 0.19
  prior_quarter_avg_deal_size_aed: 5400000
  active: true

- rm_id: rm-03
  name: "[Senior RM C]"
  tier: senior
  specializations: [diaspora India, GCC investor, NRI corridor, dual-corridor]
  languages: [en, hi, ur]
  current_load: 14
  capacity: 25
  prior_quarter_close_rate: 0.17
  prior_quarter_avg_deal_size_aed: 4100000
  active: true

- rm_id: rm-04
  name: "[Senior RM D — AD-resident upgrader specialist]"
  tier: senior
  specializations: [AD-resident upgrade, end-user, schools-adjacent buyers, Yas-corridor]
  languages: [en, ar]
  current_load: 17
  capacity: 25
  prior_quarter_close_rate: 0.21
  prior_quarter_avg_deal_size_aed: 4800000
  active: true

- rm_id: rm-05
  name: "[Senior RM E — Russia/CIS corridor]"
  tier: senior
  specializations: [diaspora Russia/CIS, GCC investor, sanctions-aware]
  languages: [en, ru]
  current_load: 12
  capacity: 25
  prior_quarter_close_rate: 0.18
  prior_quarter_avg_deal_size_aed: 5800000
  active: true
  notes: "Every prospect routed here gets sanctions screening before commercial conversation."

- rm_id: rm-06
  name: "[Mid-tier RM F]"
  tier: mid
  specializations: [end-user upgrade, GCC investor, Yas-corridor]
  languages: [en, ar]
  current_load: 24
  capacity: 30
  prior_quarter_close_rate: 0.14
  prior_quarter_avg_deal_size_aed: 3200000
  active: true

- rm_id: rm-07
  name: "[Mid-tier RM G]"
  tier: mid
  specializations: [end-user upgrade, mid-market investor, lease-conversion, Egyptian diaspora]
  languages: [en, ar]
  current_load: 21
  capacity: 30
  prior_quarter_close_rate: 0.12
  prior_quarter_avg_deal_size_aed: 2900000
  active: true

- rm_id: rm-08
  name: "[Junior RM H]"
  tier: junior
  specializations: [first-time investor, end-user, exploratory, Al Ghadeer-corridor]
  languages: [en, ar]
  current_load: 30
  capacity: 35
  prior_quarter_close_rate: 0.09
  prior_quarter_avg_deal_size_aed: 2400000
  active: true
```

## Capacity overview (snapshot)

| Tier | RMs | Total capacity | Total load | Available |
|---|---|---|---|---|
| Senior | 5 | 125 | 78 | 47 |
| Mid | 2 | 60 | 45 | 15 |
| Junior | 1 | 35 | 30 | 5 |
| **Total** | **8** | **220** | **153** | **67** |

Headroom: 30% across the team. Comfortable for a launch period; anything below 15% triggers an overflow review.

## Routing decision rationale (what the simulator returns)

For each lead, the simulator returns:
- Assigned RM (id + name)
- Match-score breakdown (specialization fit / language match / capacity / corridor / segment-history / returning-prospect bonus)
- Alternatives (next-best 1–2 RMs)
- Anti-patterns avoided (returning-prospect rule applied / specialization preserved / over-capacity avoided / sanctions-screening flagged for Russia/CIS)
- Speed target (5 minutes from form submission to RM acknowledgment)
- Next actions (RM acknowledges in Salesforce, calls within 5 min, logs first-touch outcome within 24h)

## Performance ledger

(populated post-launch from CRM data via Salesforce integration)
