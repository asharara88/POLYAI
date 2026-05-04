# Sales pipeline — Meridian Residences

> Owned by `forecasting`, with deal-record entries maintained by `account-executive` and routing decisions by `inbound-qualifier`. Snapshot at 2026-05-22.
>
> **Mock data for the worked example.** When Salesforce read-only is wired (per `INTEGRATIONS.md`), this file becomes the local mirror of CRM stage data; the dashboard reads from it.

## Topline

```yaml
snapshot_date: 2026-05-22
total_open_deals: 47
total_open_pipeline_aed: 178400000
weighted_forecast_aed: 41200000           # historical close-rate weighting per stage
quarterly_target_aed: 84000000
forecast_vs_target_pct: 49                # current weighted forecast / target
quarterly_target_unit_count: 84
units_under_active_negotiation: 22
units_reserved_to_date: 0                 # pre-launch
```

## By stage

```yaml
- stage: prospect
  count: 18
  pipeline_aed: 51200000
  weighted_close_rate: 0.05
  weighted_forecast_aed: 2560000

- stage: qualified
  count: 14
  pipeline_aed: 49800000
  weighted_close_rate: 0.15
  weighted_forecast_aed: 7470000

- stage: discovery
  count: 8
  pipeline_aed: 36400000
  weighted_close_rate: 0.32
  weighted_forecast_aed: 11648000

- stage: evaluation
  count: 5
  pipeline_aed: 28600000
  weighted_close_rate: 0.55
  weighted_forecast_aed: 15730000

- stage: proposal
  count: 2
  pipeline_aed: 12400000
  weighted_close_rate: 0.78
  weighted_forecast_aed: 9672000

- stage: negotiation
  count: 0
  pipeline_aed: 0
  weighted_close_rate: 0.92
  weighted_forecast_aed: 0
```

## By channel

```yaml
- channel: direct
  count: 22
  pipeline_aed: 71500000
  weighted_forecast_aed: 16200000
  notes: "Direct-marketing leads to in-house RM team — primary funnel for Q3 launch"

- channel: broker
  count: 16
  pipeline_aed: 58200000
  weighted_forecast_aed: 13800000
  notes: "Broker-originated; tier-1 firms 11, tier-2 firms 5; pre-launch (allocation requests open 2026-06-08)"

- channel: wealth
  count: 7
  pipeline_aed: 32100000
  weighted_forecast_aed: 8400000
  notes: "Wealth-channel HNI introductions — average deal size 4.6M; 2 multi-unit conversations"

- channel: vvip
  count: 2
  pipeline_aed: 16600000
  weighted_forecast_aed: 2800000
  notes: "Two cultivating-stage VVIP relationships with potential bespoke allocation conversations later in cycle"
```

## By RM (in-house)

```yaml
- rm_id: rm-01
  rm_name: "[Senior RM A]"
  open_deals: 14
  pipeline_aed: 62800000
  weighted_forecast_aed: 17200000

- rm_id: rm-02
  rm_name: "[Senior RM B]"
  open_deals: 18
  pipeline_aed: 51400000
  weighted_forecast_aed: 11800000

- rm_id: rm-03
  rm_name: "[Senior RM C]"
  open_deals: 11
  pipeline_aed: 38200000
  weighted_forecast_aed: 7100000

- rm_id: rm-04
  rm_name: "[Mid-tier RM D]"
  open_deals: 22
  pipeline_aed: 18800000
  weighted_forecast_aed: 3100000

- rm_id: rm-05
  rm_name: "[Mid-tier RM E]"
  open_deals: 19
  pipeline_aed: 15400000
  weighted_forecast_aed: 1750000

- rm_id: rm-06
  rm_name: "[Junior RM F]"
  open_deals: 28
  pipeline_aed: 9200000
  weighted_forecast_aed: 920000
```

## Slipping deals (close-date pushed or stalled)

```yaml
- deal_id: d-2026-q3-117
  account_anonymized: "GCC investor — penthouse interest"
  stage: evaluation
  rm_id: rm-01
  amount_aed: 14600000
  close_date_planned: 2026-06-30
  close_date_revised: 2026-08-15
  days_since_last_activity: 18
  diagnosis: "Awaiting wealth-channel introducer follow-through on second meeting; risk of going cold"
  recommended_action: "vvip-channel-enablement to nudge introducer; AE to schedule direct touch within 7d"

- deal_id: d-2026-q3-082
  account_anonymized: "Diaspora UK family-office advised"
  stage: discovery
  rm_id: rm-02
  amount_aed: 5800000
  close_date_planned: 2026-07-15
  close_date_revised: 2026-09-01
  days_since_last_activity: 24
  diagnosis: "Single-threaded with one family member; spouse hasn't been engaged; classic stall"
  recommended_action: "Multi-thread; introduce video tour + named-broker WhatsApp follow-up"

- deal_id: d-2026-q3-045
  account_anonymized: "End-user upgrade — local"
  stage: discovery
  rm_id: rm-04
  amount_aed: 4200000
  close_date_planned: 2026-06-15
  close_date_revised: 2026-08-30
  days_since_last_activity: 31
  diagnosis: "School-catchment concern unresolved; competing developer's launch in their preferred area"
  recommended_action: "Disqualify gracefully OR pivot to a unit-type / location that matches better"

- deal_id: d-2026-q3-203
  account_anonymized: "Indian-diaspora investor"
  stage: qualified
  rm_id: rm-03
  amount_aed: 3600000
  close_date_planned: 2026-06-30
  close_date_revised: null
  days_since_last_activity: 21
  diagnosis: "Visit to UAE postponed; cultivation in pause until prospect's next trip (Q4)"
  recommended_action: "Maintain quarterly nurture; flag for Q4 reactivation"

- deal_id: d-2026-q3-156
  account_anonymized: "Tier-1 broker prospect (Better Homes)"
  stage: evaluation
  rm_id: rm-01
  amount_aed: 6800000
  close_date_planned: 2026-07-01
  close_date_revised: 2026-07-20
  days_since_last_activity: 9
  diagnosis: "Awaiting allocation request from broker; tier-1 exclusive window opens 2026-06-08"
  recommended_action: "Hold; broker-enablement to confirm allocation submission within 48h of window opening"
```

## At-risk callouts

- **3 senior-RM deals over AED 5M with >20-day inactivity** — surface to Head of Sales for personal review
- **Junior RM (rm-06) load at 28** — at 80% of capacity 35; consider reassigning incoming low-tier leads to mid-RMs
- **Wealth-channel pipeline (7 deals) under-served** — only 1 wealth-channel preview event scheduled (date TBC); recommend pulling forward
- **VVIP cultivation pipeline (2 deals) is realistic but should not weight forecast aggressively** — these are relationship-not-transaction by design; current weighting may be optimistic

## Confidence narrative

- **Commit (>78% weighted)**: 1 deal, AED 6.8M (the broker-evaluation deal awaiting allocation)
- **Best-case (55–78%)**: 5 deals (proposal + evaluation), AED 41M total; forecast contribution AED 25.4M
- **Pipeline (15–55%)**: 22 deals (qualified + discovery), AED 86.2M; forecast contribution AED 19.1M
- **Omit (<15%)**: 18 deals (prospect), AED 51.2M; forecast contribution AED 2.6M

Total weighted forecast: AED 41.2M against quarterly target of AED 84M. **49% to target with ~6 weeks to launch + 12-week sustain window.** Healthy pace if pre-launch + launch days deliver on broker + wealth-channel pipeline conversion.
