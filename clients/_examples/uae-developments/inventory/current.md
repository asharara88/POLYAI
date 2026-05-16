# Inventory — Saadiyat Reserve Heights (current)

> **Worked example — illustrative.** Fictional inventory for a fictional Saadiyat tower; not real UAE Developments data.
>
> Owned by `inventory-manager`. Source of truth for marketing-permitted-to-reference status.
> Sales-ops / CRM (Salesforce Real Estate Cloud) remains source of truth for legal status (sold / reserved / SPA-signed).
> Snapshot dated 2026-05-01. Refresh: weekly during launch, daily during sustain.

## Project totals (Saadiyat Reserve Heights — Q3 flagship launch)

- Total units: 280
- Available: 280 (100%) — pre-launch
- On-hold: 0
- Reserved: 0
- Sold: 0
- Withdrawn: 0

## Unit-type breakdown

| Type | Count | Avg AED/sqft | Range AED | Plan default |
|---|---|---|---|---|
| 1BR | 80 | 2,650 | 2.4M – 3.1M | 60/40 |
| 2BR | 110 | 2,540 | 3.6M – 5.2M | 60/40 |
| 3BR | 60 | 2,480 | 5.4M – 7.8M | 60/40 |
| 4BR | 24 | 2,420 | 8.5M – 11.2M | 60/40 |
| penthouse | 6 | 3,200 | 14.0M – 18.0M | 50/50 |

Service charge: AED 1,540 per sqft per annum (capped first 5 years post-handover).

## Payment plans

| Plan ID | Structure | Eligible types | Notes |
|---|---|---|---|
| pp-60-40 | 60% during construction, 40% on handover | 1BR, 2BR, 3BR, 4BR | Standard launch plan |
| pp-50-50 | 50% during construction, 50% on handover | penthouse | Penthouse-tier default |
| pp-30-70 | 30% during construction, 70% post-handover | tier-1 broker requests only | Allocated by Head of Sales; not in public collateral |

## Allocation holds (active)

(none — pre-launch)

## Withdrawn / unavailable

(none)

---

## Sample of current unit detail (first 10 of 280)

> Unit IDs use the convention SRH-T1-{floor}-{position}. SRH = Saadiyat Reserve Heights, T1 = tower one.

```yaml
- unit_id: SRH-T1-04-01
  type: 1BR
  floor: 4
  view: saadiyat-east-coast
  area_sqft: 745
  price_aed: 2480000
  payment_plan: pp-60-40
  status: available
  hold_expires: null
  reserved_by: null
  notes: ""

- unit_id: SRH-T1-04-02
  type: 2BR
  floor: 4
  view: saadiyat-east-coast
  area_sqft: 1380
  price_aed: 3680000
  payment_plan: pp-60-40
  status: available
  hold_expires: null
  reserved_by: null
  notes: ""

- unit_id: SRH-T1-04-03
  type: 2BR
  floor: 4
  view: saadiyat-east-coast
  area_sqft: 1410
  price_aed: 3760000
  payment_plan: pp-60-40
  status: available
  hold_expires: null
  reserved_by: null

- unit_id: SRH-T1-04-04
  type: 1BR
  floor: 4
  view: saadiyat-cultural-district
  area_sqft: 720
  price_aed: 2420000
  payment_plan: pp-60-40
  status: available
  hold_expires: null
  reserved_by: null

# … (260 more rows truncated — full list maintained per snapshot)
```

## Gating rules (read-only summary)

Per `inventory-manager` agent contract:

1. Any creative artifact referencing specific units (by ID, by floor + view, by price, by scarcity claim) requires inventory-manager stamp before shipping.
2. "From AED X" claims require the lowest-priced *currently available* unit's price; refresh daily.
3. "Only N left" / scarcity claims require RERA / ADGM pre-approval and dated evidence; check before re-stating.
4. Pricing-tier changes are CMO-approved and trigger an inventory snapshot + cascading creative re-review.
