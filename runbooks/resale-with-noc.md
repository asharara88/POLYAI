# Runbook: Secondary-market resale with NOC

> Scenario: A registered owner intends to sell a unit (off-plan or post-handover) on the secondary market and needs the developer's No Objection Certificate (NOC) to proceed with the transfer through DLD (Dubai) or ADREC (Abu Dhabi).

## Trigger

Any of:
- Owner submits NOC request directly
- Owner's appointed broker submits NOC request on owner's behalf
- Buyer's broker initiates transfer-readiness check on a unit
- Secondary-market listing surfaces in market intelligence (`competitive-intel`) on a unit registered to a known owner

## Owner

`secondary-market-specialist` — runs the case end-to-end. Reports status weekly to `sales-manager`.

## Pre-flight

- Owner record verified in the developer's owner registry
- Unit record verified in `clients/<client>/inventory/units.md` with current status
- Outstanding-position snapshot pulled (service charges, arrears, snagging holds, payment-plan completeness)
- Original SPA on file accessible (for transfer reference)
- AML/KYC capacity check: `aml-kyc-compliance-specialist` available for incoming-buyer screening within the runbook SLA

## Sequence

| # | Who | What | Emits | Hand-off | SLA |
|---|---|---|---|---|---|
| 1 | `secondary-market-specialist` | Acknowledge intake within 4 business hours; pull unit + owner records | NOC case file at `clients/<client>/secondary-market/<noc-id>/case.md` | self → step 2 | 4h |
| 2 | `secondary-market-specialist` | Outstanding-position review (service charges, snagging, arrears) | Position memo in case file | self → step 3 OR `account-manager` if arrears | 1 business day |
| 3 (if clean) | `secondary-market-specialist` | Issue NOC; record in case file | NOC document; status → "NOC issued" | seller-side broker | 2 business days from clean position |
| 3 (if arrears) | `account-manager` | Collection conversation with owner | Collection log entry | back to `secondary-market-specialist` once cleared | 5 business days |
| 4 | `secondary-market-specialist` | Once a buyer is identified, initiate AML/KYC pre-clearance on incoming buyer via `aml-kyc-compliance-specialist` | `integration-action`: sumsub run-check | `aml-kyc-compliance-specialist` | 1 business day from buyer ID |
| 5 | `aml-kyc-compliance-specialist` | Run screening per `.claude/skills/aml-kyc-uae-real-estate.md` | Verdict: `cleared` / `hold-pending-edd` / `declined` | back to `secondary-market-specialist` (if cleared) OR escalation paths if not | 3-5 business days standard; longer for EDD |
| 6 (if cleared) | `secondary-market-specialist` | Verify buyer-side broker license (Dubai: RERA registration; Abu Dhabi: ADREC equivalent — verify current via `regulatory-research-specialist`) | Broker-license confirmation note | self → step 7 | 1 business day |
| 7 | `secondary-market-specialist` | Schedule Form-F (Dubai) / ADREC transfer (Abu Dhabi) appointment with DLD / ADREC | Appointment confirmation | self → step 8 | per regulator availability |
| 8 (if Trustee Account release needed) | `secondary-market-specialist` + human Trustee Bank contact | Coordinate Trustee Account release for off-plan still in escrow | Release confirmation | self → step 9 | 5-10 business days |
| 9 | `secondary-market-specialist` | Attend / confirm transfer; receive title-transfer / Oqood-update confirmation | Transfer-complete artifact | self → step 10 | day-of |
| 10 | `secondary-market-specialist` → `account-manager` | Update owner registry (seller out, buyer in); trigger buyer welcome cadence | Owner-record update via `knowledge` | `account-manager` + `email-lifecycle` | 24h post-transfer |
| 11 | `secondary-market-specialist` | Close case; capture closure language; feed any process learnings to `knowledge` | Case file closure note | self | 48h post-transfer |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `secondary-market-specialist` → `account-manager` (arrears) | Position review reveals arrears | Re-route to `crm-manager` after 48h no-ack |
| `secondary-market-specialist` → `aml-kyc-compliance-specialist` | Buyer identified | Re-route to `wealth-vvip-manager` after 48h |
| `aml-kyc-compliance-specialist` → `secondary-market-specialist` (cleared) | Verdict written | If verdict ages > 30 days before transfer: re-screen (do not skip) |
| `aml-kyc-compliance-specialist` → `legal-liaison` (sanctions hit) | RED-sanctions outcome | Immediate escalation to `chief-commercial-officer`; do not signal counterparty |
| `secondary-market-specialist` → `account-manager` (post-transfer) | Transfer complete | Buyer-welcome cadence triggers within 14 days else flag to `crm-manager` |

## Compliance gates

1. **Before NOC issuance:** outstanding-position review documented in case file. No NOC issued without this.
2. **Before transfer scheduling:** AML/KYC verdict on buyer must be `cleared`. `hold-pending-edd` blocks scheduling.
3. **Before transfer:** AML/KYC verdict ≤ 30 days old. Re-screen if older.
4. **Before transfer:** buyer-side broker is RERA-active (Dubai) or ADREC-equivalent-active (Abu Dhabi). `regulatory-research-specialist` confirms current verification process if uncertain.
5. **Multi-resale flag:** if this is the unit's third or later resale within 18 months, route through `aml-kyc-compliance-specialist` for layering review before transfer.
6. **VVIP-touching unit:** if the unit is on a VVIP-occupied floor, `vvip-channel-enablement` clears the case for visibility scope before any internal communication.

## Out-of-scope (so the owner doesn't drift)

- Buyer / seller commercial-price negotiation — broker territory, not developer
- Snagging defect resolution — `inventory-manager` + operational owner; case-file ref but not in sequence
- SPA legal redline — `legal-liaison` (when added) + external counsel
- RERA dispute filing — switch to `complaint-rera-exposure.md` runbook
- Press / discretion management for VVIP-touching transfers — switch to `press-sensitive-uhnw-transaction.md` (P3) or escalate to `vvip-channel-enablement`

## KPIs

- NOC issuance turnaround (target: ≤ 5 business days from clean intake)
- Transfer-completion rate (target: ≥ 95% of initiated transfers complete within target window)
- Time-to-transfer (median, p90 by emirate)
- AML/KYC pre-clearance lag (target: ≤ 3 business days from initiation)
- Resale-buyer welcome touchpoint completed within 14 days (target: 100%)
- Resale-related complaint rate (trending down)

## Close-out + learning

- Case file moves to `clients/<client>/secondary-market/closed/<year>/<noc-id>/`
- Quarterly trend report from `secondary-market-specialist` to `sales-manager` and `crm-manager` — surfaces patterns (corridors with longer SLAs, brokers with frequent license-issues, units with multiple-resale patterns)
- Material learnings (e.g., a process change at DLD that altered the SLA) routed via `knowledge` agent for `verticals/real-estate/sub-verticals/developer/playbook.md` update

## Related runbooks

- Switch to `complaint-rera-exposure.md` if seller or buyer escalates toward RERA
- Switch to `pep-sanctions-hit.md` if AML/KYC returns sanctions or PEP-RED
- Coordinate with `press-sensitive-uhnw-transaction.md` (P3) if buyer / seller / unit triggers press-sensitivity
