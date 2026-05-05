# Marketing budget — Aldar Developments

> **Worked example — illustrative.** Fictional figures scaled to AED-billion-class developer context; not real Aldar Properties budget data.
>
> Owned by `marketing-financial-manager`. Source of truth for approved marketing budget by campaign / channel / event / category.
> Period: 2026 fiscal year. Currency: AED.
> Snapshot date: 2026-05-22.

## Top-line

```yaml
fiscal_year: 2026
total_planned_aed: 320000000
total_committed_aed: 178000000
total_actual_aed: 52500000
total_remaining_aed: 142000000
period_close:
  cadence: monthly
  next_close: 2026-05-31
```

## By campaign

```yaml
- name: q3-tower-launch                    # Saadiyat Reserve Heights flagship
  planned_aed: 165000000
  committed_aed: 113000000
  actual_aed: 28000000
  remaining_aed: 52000000

- name: 2026-sustain-campaign              # cross-portfolio sustain wave
  planned_aed: 70000000
  committed_aed: 19000000
  actual_aed: 9300000
  remaining_aed: 51000000

- name: existing-portfolio-marketing       # Yas + Saadiyat + Al Raha + Al Ghadeer ongoing
  planned_aed: 46000000
  committed_aed: 28000000
  actual_aed: 11000000
  remaining_aed: 18000000

- name: brand-foundational                 # master-brand institutional advertising
  planned_aed: 24000000
  committed_aed: 11000000
  actual_aed: 3000000
  remaining_aed: 13000000

- name: contingency-reserve
  planned_aed: 15000000
  committed_aed: 7000000
  actual_aed: 1200000
  remaining_aed: 7800000
```

## By channel (Q3 launch only)

```yaml
- name: portals
  planned_aed: 33000000
  committed_aed: 23000000
  actual_aed: 7000000
  remaining_aed: 10000000

- name: paid-search
  planned_aed: 30000000
  committed_aed: 18500000
  actual_aed: 5500000
  remaining_aed: 11500000

- name: meta
  planned_aed: 30000000
  committed_aed: 20000000
  actual_aed: 6000000
  remaining_aed: 10000000

- name: linkedin
  planned_aed: 20000000
  committed_aed: 11000000
  actual_aed: 3300000
  remaining_aed: 8700000

- name: whatsapp-ops
  planned_aed: 16500000
  committed_aed: 8200000
  actual_aed: 2300000
  remaining_aed: 8200000

- name: pr
  planned_aed: 16500000
  committed_aed: 7000000
  actual_aed: 950000
  remaining_aed: 9500000

- name: diaspora-portals
  planned_aed: 11500000
  committed_aed: 4000000
  actual_aed: 950000
  remaining_aed: 7500000

- name: email-crm
  planned_aed: 8200000
  committed_aed: 5700000
  actual_aed: 1900000
  remaining_aed: 2500000

- name: events
  planned_aed: 0
  committed_aed: 0
  actual_aed: 0
  remaining_aed: 0
  notes: "Tracked separately under by-event below"
```

## By event (Q3 launch only)

```yaml
- name: q3-prelaunch-preview
  planned_aed: 11000000
  committed_aed: 8600000
  actual_aed: 0
  remaining_aed: 2400000

- name: q3-public-launch-day
  planned_aed: 56000000
  committed_aed: 38000000
  actual_aed: 0
  remaining_aed: 18000000

- name: q3-tier1-broker-private
  planned_aed: 3700000
  committed_aed: 2000000
  actual_aed: 0
  remaining_aed: 1700000

- name: q3-wealth-channel-preview
  planned_aed: 7000000
  committed_aed: 0
  actual_aed: 0
  remaining_aed: 7000000
  notes: "Date TBC; planning in progress"
```

## Variance flags

```yaml
- dimension: campaign
  item: q3-tower-launch
  variance_pct: -3.2
  status: on-track
  note: "Spend pacing slightly ahead of plan; within tolerance."

- dimension: channel
  item: pr
  variance_pct: -42.0
  status: under-pacing
  note: "PR commitments lag plan; expect catch-up at launch + post-launch wave."
```

## Approval thresholds (from finance-policy)

```yaml
up_to_aed_500000: marketing-financial-manager (process-only)
up_to_aed_2500000: CMO
up_to_aed_15000000: CMO + CFO
above_aed_15000000: CMO + CFO + Board (where applicable)
variance_alert_threshold_pct: 10
```

## Monthly snapshots

Cumulative-actual against cumulative-plan, per month-end. Used to render the burn-down trajectory.

```yaml
- month: 2026-01
  cumulative_planned_aed: 26500000
  cumulative_committed_aed: 23500000
  cumulative_actual_aed: 14400000
- month: 2026-02
  cumulative_planned_aed: 53000000
  cumulative_committed_aed: 47000000
  cumulative_actual_aed: 28000000
- month: 2026-03
  cumulative_planned_aed: 80000000
  cumulative_committed_aed: 71500000
  cumulative_actual_aed: 38400000
- month: 2026-04
  cumulative_planned_aed: 112000000
  cumulative_committed_aed: 107000000
  cumulative_actual_aed: 47200000
- month: 2026-05
  cumulative_planned_aed: 144000000
  cumulative_committed_aed: 178000000
  cumulative_actual_aed: 52500000
- month: 2026-06
  cumulative_planned_aed: 176000000
  cumulative_committed_aed: null
  cumulative_actual_aed: null
- month: 2026-07
  cumulative_planned_aed: 208000000
  cumulative_committed_aed: null
  cumulative_actual_aed: null
- month: 2026-08
  cumulative_planned_aed: 240000000
  cumulative_committed_aed: null
  cumulative_actual_aed: null
- month: 2026-09
  cumulative_planned_aed: 261000000
  cumulative_committed_aed: null
  cumulative_actual_aed: null
- month: 2026-10
  cumulative_planned_aed: 277000000
  cumulative_committed_aed: null
  cumulative_actual_aed: null
- month: 2026-11
  cumulative_planned_aed: 298000000
  cumulative_committed_aed: null
  cumulative_actual_aed: null
- month: 2026-12
  cumulative_planned_aed: 320000000
  cumulative_committed_aed: null
  cumulative_actual_aed: null
```

## Burn-down narrative

- Cumulative actual at end of May (AED 52.5M) is tracking ~36% under cumulative plan (AED 144M).
- Cumulative committed at end of May (AED 178M) is 24% over cumulative plan — front-loaded commitments are normal pre-launch (agency SOWs, event vendor contracts, premium portal listings) and will smooth over June–August as actuals catch up.
- June–August window is when the bulk of actual spend lands (launch period + sustain wave). Watch for actuals catching up to commitments without overshooting cumulative plan.
- Q4 has built-in margin (AED 59M planned remaining over Sep–Dec) for sustain-wave reallocation.
