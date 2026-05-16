# Sales pipeline — Aldar Developments

> **Worked example — illustrative.** Fictional pipeline data; not real Aldar Properties data.
>
> Owned by `forecasting`, with deal-record entries maintained by `account-executive` and routing decisions by `inbound-qualifier`. Snapshot at 2026-05-22.
>
> **Mock data.** When Salesforce read-only is wired (per `INTEGRATIONS.md`), this file becomes the local mirror of CRM stage data; the dashboard reads from it.

## Topline

```yaml
snapshot_date: 2026-05-22
total_open_deals: 140
total_open_pipeline_aed: 540000000
weighted_forecast_aed: 125000000
quarterly_target_aed: 256000000
forecast_vs_target_pct: 49
quarterly_target_unit_count: 84
units_under_active_negotiation: 65
units_reserved_to_date: 0
```

## By stage

```yaml
- stage: prospect
  count: 54
  pipeline_aed: 154000000
  weighted_close_rate: 0.05
  weighted_forecast_aed: 7700000

- stage: qualified
  count: 42
  pipeline_aed: 150000000
  weighted_close_rate: 0.15
  weighted_forecast_aed: 22500000

- stage: discovery
  count: 24
  pipeline_aed: 110000000
  weighted_close_rate: 0.32
  weighted_forecast_aed: 35200000

- stage: evaluation
  count: 14
  pipeline_aed: 86000000
  weighted_close_rate: 0.55
  weighted_forecast_aed: 47300000

- stage: proposal
  count: 6
  pipeline_aed: 40000000
  weighted_close_rate: 0.78
  weighted_forecast_aed: 31200000

- stage: negotiation
  count: 0
  pipeline_aed: 0
  weighted_close_rate: 0.92
  weighted_forecast_aed: 0
```

## By channel

```yaml
- channel: direct
  count: 68
  pipeline_aed: 220000000
  weighted_forecast_aed: 50000000
  notes: "Direct-marketing leads to in-house RM team — primary funnel for Saadiyat Reserve Heights"

- channel: broker
  count: 48
  pipeline_aed: 175000000
  weighted_forecast_aed: 41500000
  notes: "Broker-originated; tier-1 firms 32, tier-2 firms 16; pre-launch (allocation requests open 2026-06-08)"

- channel: wealth
  count: 18
  pipeline_aed: 96000000
  weighted_forecast_aed: 25500000
  notes: "Wealth-channel HNI introductions — average deal size 5.3M; 5 multi-unit conversations across FAB Private + ADCB Private + multi-family offices"

- channel: vvip
  count: 6
  pipeline_aed: 49000000
  weighted_forecast_aed: 8000000
  notes: "Six cultivating-stage VVIP relationships; potential bespoke / multi-unit allocation conversations later in cycle. Includes one Mubadala-adjacent FO conversation."
```

## By RM (in-house)

```yaml
- rm_id: rm-01
  rm_name: "[Senior RM A]"
  open_deals: 22
  pipeline_aed: 98000000
  weighted_forecast_aed: 27000000

- rm_id: rm-02
  rm_name: "[Senior RM B]"
  open_deals: 26
  pipeline_aed: 78000000
  weighted_forecast_aed: 17800000

- rm_id: rm-03
  rm_name: "[Senior RM C]"
  open_deals: 18
  pipeline_aed: 58000000
  weighted_forecast_aed: 11000000

- rm_id: rm-04
  rm_name: "[Senior RM D — AD-resident upgrader specialist]"
  open_deals: 21
  pipeline_aed: 65000000
  weighted_forecast_aed: 14500000

- rm_id: rm-05
  rm_name: "[Senior RM E — Russia/CIS corridor]"
  open_deals: 14
  pipeline_aed: 72000000
  weighted_forecast_aed: 16800000

- rm_id: rm-06
  rm_name: "[Mid-tier RM F]"
  open_deals: 24
  pipeline_aed: 56000000
  weighted_forecast_aed: 9500000

- rm_id: rm-07
  rm_name: "[Mid-tier RM G]"
  open_deals: 21
  pipeline_aed: 47000000
  weighted_forecast_aed: 5400000

- rm_id: rm-08
  rm_name: "[Junior RM H]"
  open_deals: 32
  pipeline_aed: 28000000
  weighted_forecast_aed: 2900000
```

## Slipping deals (close-date pushed or stalled)

```yaml
- deal_id: d-2026-q3-117
  account_anonymized: "GCC investor — penthouse interest (Saadiyat Reserve Heights)"
  stage: evaluation
  rm_id: rm-01
  amount_aed: 14600000
  close_date_planned: 2026-06-30
  close_date_revised: 2026-08-15
  days_since_last_activity: 18
  diagnosis: "Awaiting wealth-channel introducer follow-through on second meeting; risk of going cold"
  recommended_action: "vvip-channel-enablement to nudge introducer; AE to schedule direct touch within 7d"

- deal_id: d-2026-q3-082
  account_anonymized: "Diaspora UK family-office advised (Saadiyat-corridor)"
  stage: discovery
  rm_id: rm-02
  amount_aed: 5800000
  close_date_planned: 2026-07-15
  close_date_revised: 2026-09-01
  days_since_last_activity: 24
  diagnosis: "Single-threaded with one family member; spouse hasn't been engaged; classic stall"
  recommended_action: "Multi-thread; introduce video tour + named-broker WhatsApp follow-up"

- deal_id: d-2026-q3-045
  account_anonymized: "AD-resident upgrade — local family"
  stage: discovery
  rm_id: rm-04
  amount_aed: 4200000
  close_date_planned: 2026-06-15
  close_date_revised: 2026-08-30
  days_since_last_activity: 31
  diagnosis: "School-catchment concern unresolved; competing developer's launch in their preferred area"
  recommended_action: "Disqualify gracefully OR pivot to a Yas-corridor unit-type that matches school catchment better"

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

- **9 senior-RM deals over AED 5M with >20-day inactivity** — surface to Head of Sales for personal review
- **Junior RM (rm-08) load at 30** — at 86% of capacity 35; redirect incoming low-tier leads to mid-RMs
- **Wealth-channel pipeline (18 deals) needs more event support** — only 1 wealth-channel preview event scheduled (date TBC); recommend pulling forward
- **VVIP cultivation pipeline (6 deals) is realistic but should not weight forecast aggressively** — these are relationship-not-transaction by design; current weighting may be optimistic
- **Russia/CIS corridor (rm-05, 14 deals)** — every prospect requires sanctions screening before commercial conversation; coordinate with `compliance` weekly

## Confidence narrative

- **Commit (>78% weighted)**: 3 deals, AED 18.4M (broker-evaluation deals awaiting allocation)
- **Best-case (55–78%)**: 14 deals (proposal + evaluation), AED 126M total; forecast contribution AED 78.5M
- **Pipeline (15–55%)**: 66 deals (qualified + discovery), AED 260M; forecast contribution AED 57.7M
- **Omit (<15%)**: 54 deals (prospect), AED 154M; forecast contribution AED 7.7M

Total weighted forecast: AED 125M against quarterly target of AED 256M. **49% to target with ~6 weeks to launch + 12-week sustain window.** Healthy pace if pre-launch + launch days deliver on broker + wealth-channel pipeline conversion.
