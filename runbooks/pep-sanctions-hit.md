# Runbook: PEP / sanctions hit on a counterparty

> Scenario: A counterparty (buyer, broker, wealth-channel intermediary, family-office principal, UBO of a corporate buyer) surfaces as a Politically Exposed Person (PEP — any class) or as a sanctions-list match on any of the five primary regimes (UN, OFAC, UK HMT, EU, DFAT) plus GCC where applicable.
>
> This runbook applies whether the surface event is **at intake** (Sumsub initial check returns RED), **mid-relationship** (re-screening flags a new hit), or **adjacency** (a related counterparty surfaces during another investigation).

## Trigger

Any of:
- Sumsub initial verification returns RED on PEP, sanctions, or adverse-media check
- Sumsub re-screening (daily/continuous) flags a new hit on an existing cleared counterparty
- Manual screening surfaces a likely match (e.g., during EDD)
- Adjacency: a related counterparty (UBO, signatory, family member, close associate) surfaces during another investigation
- External tip-off (regulator, press, law-enforcement) referencing the counterparty

## Owner

`aml-kyc-compliance-specialist` — runs the case end-to-end. Always pairs with `legal-liaison` (when added; until then, named human Legal). Reports immediately to `chief-commercial-officer` for sanctions hits; for PEP-only hits, reports per cadence.

## Pre-flight

- Counterparty record located in the relevant registry (broker, wealth-channel, vvip, buyer / Salesforce Account)
- Sumsub applicant ID + audit reference accessible
- All in-flight transactions / commercial activity involving the counterparty pulled
- `legal-liaison` (or named Legal human) reachable
- `chief-commercial-officer` reachable for sanctions-hit immediate notification

## Critical principle: NO TIPPING-OFF

Under UAE Federal AML/CFT, signaling to a counterparty that suspicion exists is itself an offense (tipping-off). Communications with the counterparty during this runbook proceed **as if normal** until `legal-liaison` rules otherwise. Internal communications use restricted channels.

## Sequence

| # | Who | What | Emits | Hand-off | SLA |
|---|---|---|---|---|---|
| 1 | `aml-kyc-compliance-specialist` | Confirm the hit: false-positive vs. true-positive (name match scoring, identity corroboration via passport/EIDA, date-of-birth check) | Hit-confirmation memo in restricted screening folder | self → step 2 (true-positive) OR close as false-positive | 4 business hours |
| 2 (sanctions-hit) | `aml-kyc-compliance-specialist` | Immediate notification to `legal-liaison` and `chief-commercial-officer` | Restricted-access notification | `legal-liaison` for response design; `chief-commercial-officer` for executive awareness | 2 business hours from confirmation |
| 2 (PEP-only hit) | `aml-kyc-compliance-specialist` | EDD trigger: senior-management approval before any further commercial conversation; full source-of-wealth corroboration | EDD case file | `legal-liaison` for awareness; commercial pod (`account-executive` / `wealth-channel-enablement` / etc.) for hold | 1 business day |
| 3 (sanctions-hit) | `aml-kyc-compliance-specialist` + `legal-liaison` | Halt all in-flight transactions; assess whether transaction history reaches the suspicion threshold for STR | Transaction-halt instructions; STR-trigger assessment | `chief-commercial-officer` + commercial pod for halt enforcement | 1 business day |
| 4 (sanctions-hit, STR-required) | `aml-kyc-compliance-specialist` (drafts) + `legal-liaison` (reviews) | Draft Suspicious Transaction Report for UAE FIU (goAML) | STR draft | human FIU liaison for submission | per FIU SLA |
| 5 (PEP-EDD) | `aml-kyc-compliance-specialist` | EDD measures: source-of-wealth corroboration, additional documentation, senior-management approval recording | EDD packet in case file | `chief-commercial-officer` for senior-management approval | 5-10 business days |
| 6 | `aml-kyc-compliance-specialist` | Verdict: `cleared-with-EDD` / `hold` / `decline` / `STR-filed` | Verdict update in Salesforce: `AML_KYC_Verdict__c`, `EDD_Required__c`, `PEP_Flag__c`, `Sanctions_Flag__c` + dates | commercial pod for next-action guidance | per outcome |
| 7 (cleared-with-EDD) | `aml-kyc-compliance-specialist` | Set enhanced re-screening cadence (quarterly minimum) | Re-screen calendar entry | self (recurring) | per cadence |
| 7 (decline / STR-filed) | `aml-kyc-compliance-specialist` + `legal-liaison` | Wind-down: any in-flight transaction handled per Legal guidance; counterparty removed from active registries (record retained per retention rules) | Wind-down log | commercial pod for execution | per case complexity |
| 8 | `aml-kyc-compliance-specialist` | Adjacency check: are there related counterparties (UBOs, family members, close associates) that should be screened or re-screened? | Adjacency action items | self | 5 business days |
| 9 | `aml-kyc-compliance-specialist` | Pattern-match: is this the Nth hit of this type / from this corridor / via this referring channel? | Pattern alert if applicable | `regulatory-research-specialist` for emerging-corridor advisory; `wealth-vvip-manager` for channel-quality awareness | 10 business days |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `aml-kyc-compliance-specialist` → `legal-liaison` (sanctions) | True-positive sanctions hit confirmed | Immediate; escalate to `chief-commercial-officer` if no Legal contact reachable within 2h |
| `aml-kyc-compliance-specialist` → `chief-commercial-officer` (sanctions) | True-positive sanctions hit confirmed | Immediate; if unreachable, escalate to executive committee chair |
| `aml-kyc-compliance-specialist` → commercial pod (halt) | Transaction halt required | Confirm halt within 4h; if not confirmed, escalate to `sales-manager` or `wealth-vvip-manager` per channel |
| `aml-kyc-compliance-specialist` → human FIU liaison | STR draft ready | Per FIU SLA; do not delay submission for non-substantive review |
| `aml-kyc-compliance-specialist` → `wealth-vvip-manager` | Counterparty is wealth/VVIP-channel | Discretion stance; restricted-access communications |

## Compliance gates

1. **No tipping-off.** No communication to the counterparty references the suspicion. Any communication is either business-as-usual or framed by Legal-approved language.
2. **Restricted-access channels.** Internal communications about the hit live in restricted folders, not in general team channels.
3. **STR submission via human FIU liaison only.** Drafting via `aml-kyc-compliance-specialist` + Legal review; submission via human.
4. **Source documents stay with Sumsub.** This runbook references audit IDs only; documents do not migrate into the repo.
5. **Senior-management approval recorded.** PEP-EDD continuation requires senior-management approval per UAE Federal AML/CFT regulations; the approval is recorded in the case file.
6. **Adjacency check non-optional.** Related counterparties (≥ 25% UBO, immediate family, close associates) screened as part of the same case.
7. **Regulator-research currency.** `regulatory-research-specialist` confirms the current sanctions-list version + current PEP definition scope per case (regulators update frequently).

## Out-of-scope

- Legal opinion on the counterparty's status — `legal-liaison` + external counsel
- Public communications about the matter — never; if press inquires, route to `legal-liaison` + `chief-commercial-officer` (no comment is the default)
- Counterparty's own resolution of their PEP / sanctions status — that's their problem, not ours
- Civil dispute (e.g., counterparty challenges decline) — `legal-liaison` + external counsel, separate workflow

## KPIs

- Hit-confirmation time (target: ≤ 4 business hours from screening surface)
- Legal-notification time on sanctions hits (target: ≤ 2 business hours from confirmation)
- Transaction-halt confirmation time (target: ≤ 4 business hours from confirmation)
- Tipping-off incidents (target: 0 — non-negotiable)
- Adjacency-check completion rate (target: 100%)
- STR-filed-to-FIU-deadline compliance (target: 100%)
- False-positive rate (track for screening-quality tuning; not actionable per case)

## Close-out + learning

- Case file moves to `clients/<client>/aml-kyc/closed/<year>/<case-id>/` (restricted access)
- Pattern alerts route to `regulatory-research-specialist` if a new corridor / typology emerges
- Wealth/VVIP-channel pattern (e.g., the same intermediary surfaces multiple PEP referrals — not problematic per se, but worth knowing) routes to `wealth-vvip-manager`
- Material learnings (e.g., a list-update SLA gap with Sumsub) feed `knowledge` for `.claude/skills/aml-kyc-uae-real-estate.md` update
- Annual aggregate trend report from `aml-kyc-compliance-specialist` to `chief-commercial-officer` (sanitized — no individual-case detail beyond the named team)

## Related runbooks

- Switch to `complaint-rera-exposure.md` if the counterparty separately surfaces a regulatory complaint
- Coordinate with `press-sensitive-uhnw-transaction.md` (P3) if press-sensitivity adjacency exists
- Coordinate with `resale-with-noc.md` if the hit is on an incoming buyer in a resale transaction (halt the transfer per that runbook's compliance gate)
