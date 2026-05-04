# Marketing budget — Meridian Residences

> Owned by `marketing-financial-manager`. Source of truth for approved marketing budget by campaign / channel / event / category.
> Period: 2026 fiscal year. Currency: AED.
> Snapshot date: 2026-05-22.

## Top-line

```yaml
fiscal_year: 2026
total_planned_aed: 8400000
total_committed_aed: 4670000
total_actual_aed: 1380000
total_remaining_aed: 3730000
period_close:
  cadence: monthly
  next_close: 2026-05-31
```

## By campaign

```yaml
- name: q3-tower-launch
  planned_aed: 4200000
  committed_aed: 2890000
  actual_aed: 720000
  remaining_aed: 1310000

- name: 2026-sustain-campaign
  planned_aed: 1800000
  committed_aed: 480000
  actual_aed: 240000
  remaining_aed: 1320000

- name: existing-portfolio-marketing
  planned_aed: 1200000
  committed_aed: 720000
  actual_aed: 280000
  remaining_aed: 480000

- name: brand-foundational
  planned_aed: 800000
  committed_aed: 380000
  actual_aed: 100000
  remaining_aed: 420000

- name: contingency-reserve
  planned_aed: 400000
  committed_aed: 200000
  actual_aed: 40000
  remaining_aed: 200000
```

## By channel (Q3 launch only)

```yaml
- name: portals
  planned_aed: 840000
  committed_aed: 600000
  actual_aed: 180000
  remaining_aed: 240000

- name: paid-search
  planned_aed: 756000
  committed_aed: 480000
  actual_aed: 144000
  remaining_aed: 276000

- name: meta
  planned_aed: 756000
  committed_aed: 520000
  actual_aed: 156000
  remaining_aed: 236000

- name: linkedin
  planned_aed: 504000
  committed_aed: 280000
  actual_aed: 84000
  remaining_aed: 224000

- name: whatsapp-ops
  planned_aed: 420000
  committed_aed: 210000
  actual_aed: 60000
  remaining_aed: 210000

- name: pr
  planned_aed: 420000
  committed_aed: 180000
  actual_aed: 24000
  remaining_aed: 240000

- name: diaspora-portals
  planned_aed: 294000
  committed_aed: 100000
  actual_aed: 24000
  remaining_aed: 194000

- name: email-crm
  planned_aed: 210000
  committed_aed: 145000
  actual_aed: 48000
  remaining_aed: 65000

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
  planned_aed: 280000
  committed_aed: 220000
  actual_aed: 0
  remaining_aed: 60000

- name: q3-public-launch-day
  planned_aed: 1450000
  committed_aed: 980000
  actual_aed: 0
  remaining_aed: 470000

- name: q3-tier1-broker-private
  planned_aed: 95000
  committed_aed: 52000
  actual_aed: 0
  remaining_aed: 43000

- name: q3-wealth-channel-preview
  planned_aed: 180000
  committed_aed: 0
  actual_aed: 0
  remaining_aed: 180000
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
up_to_aed_25000: marketing-financial-manager (process-only)
up_to_aed_100000: CMO
up_to_aed_500000: CMO + CFO
above_aed_500000: CMO + CFO + Board (where applicable)
variance_alert_threshold_pct: 10
```
