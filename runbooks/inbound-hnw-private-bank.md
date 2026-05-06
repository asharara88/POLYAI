# Runbook: Inbound HNW from a private bank

> Scenario: A private-banking relationship manager (RM) at a wealth-channel intermediary (UBS, Julius Baer, EFG, J. Safra Sarasin, Mashreq Private Banking, Emirates NBD Private Banking, etc.) has identified one of their HNI/UHNI clients as having appetite for UAE residential real-estate and is making an introduction to the developer. The buyer expects discretion, white-glove handling, and to deal with people who already know the basics about them — not a generic intake form. Mishandle the first 48 hours and the introduction goes elsewhere.

## Trigger

Any of:
- Wealth-channel intermediary RM emails or calls a named developer contact with a client introduction
- Wealth-channel intermediary submits via the developer's wealth-channel-only intake (separate from the public form)
- Wealth-channel intermediary forwards a client-signed expression-of-interest

## Owner

`wealth-channel-enablement` charters and owns the channel-side; `account-executive` (with wealth-channel relationship-history) handles buyer-facing; `aml-kyc-compliance-specialist` runs pre-clearance on the principal; `vip-relationship-manager` activates if the principal qualifies for concierge tier.

## Pre-flight

- Wealth-channel intermediary record current in `clients/<client>/wealth-channels/registry.md` — relationship status, prior-introduction performance, signed introducer agreement on file, AML/KYC current at intermediary level
- Introducer-fee structure confirmed for this intermediary
- AML/KYC capacity for principal pre-clearance — `aml-kyc-compliance-specialist` available per SLA
- Inventory snapshot current — what's actually available at the principal's likely interest tier

## Sequence

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 1 | `wealth-channel-enablement` | Acknowledge intermediary RM within 4 business hours; restate the introduction in writing (principal name, expressed interest, intermediary's framing) | Acknowledgment email (cc'd to named developer-side relationship lead) | 4h |
| 2 | `wealth-channel-enablement` | Open case file at `clients/<client>/wealth-channels/<intermediary-slug>/introductions/<introduction-id>/case.md` (restricted-access) | Case file open | 4h |
| 3 | `aml-kyc-compliance-specialist` | Initiate pre-clearance on the principal via Sumsub per `integrations/sumsub/actions/run-check.md` — applicant level: `hnw-individual-buyer` or `uhnw-individual-buyer` per intermediary's framing | Sumsub run-check action; status: pending | within 1 business day |
| 4 | `wealth-channel-enablement` | Brief the named developer-side relationship lead (typically a senior RM with wealth-channel experience) — what we know about the principal, what intermediary has shared, what the principal expects in tone + handling | Briefing pack at case file | within 1 business day |
| 5 | Named developer-side senior RM (human) | First substantive contact with intermediary RM — confirm next-step format (intermediary-mediated initial call vs. principal-direct vs. in-Dubai meeting) per principal's preference | Activity logged | within 2 business days |
| 6 | `vip-relationship-manager` | Profile-build for principal — preferences captured from intermediary's intake + family composition, language, faith, dietary, gift-history sensitivities | Profile note in case file (restricted) | within 3 business days |
| 7 | `aml-kyc-compliance-specialist` | Pre-clearance verdict landed — typically GREEN for HNI principals from established corridors, EDD trigger for PEPs / sanctions-surface corridors | Verdict update; if EDD: senior-management approval recorded before commercial conversation per `.claude/skills/aml-kyc-uae-real-estate.md` | 3-5 business days standard; longer for EDD |
| 8 (if cleared) | Named senior RM | Substantive next-step — virtual viewing, physical viewing, project fact-pack tour, principal-direct call per preference | Activity logged | within 7 days of clearance |
| 9 | `wealth-channel-enablement` | Throughout: keep intermediary RM in the loop on principal's progress (without revealing principal-side specifics that would breach principal's expectation of discretion) | Periodic intermediary updates | weekly |
| 10 | `vip-relationship-manager` | Concierge layer activates per principal's tier — viewing logistics, residence amenity, restaurant arrangements, family considerations | Concierge case files per principal request | per request |
| 11 | `account-executive` | Commercial conversation when principal signals readiness — proposal per `proposal` agent; non-standard structure (multi-unit, custom payment plan, full-floor) routes to `deal-desk-analyst` | Proposal artifact; deal-desk memo if applicable | per principal pace |
| 12 | `legal-liaison` | If bespoke confidentiality (extended NDA, off-the-record undertaking) requested by principal, manage redline → human legal sign-off | NDA + addenda artifacts | per principal pace |
| 13 | `account-executive` + `wealth-channel-enablement` | Closing → introducer fee accrual per `marketing-financial-manager` | Stage-advance to `closed-won` per `integrations/salesforce/actions/stage-advance.md`; introducer fee scheduled | per close |
| 14 | `vip-relationship-manager` + `account-manager` | Post-handover (or post-signing for off-plan) onboarding into owner community + concierge maintenance cadence | Owner-record update; touchpoint plan | within 30 days of close |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `wealth-channel-enablement` → `aml-kyc-compliance-specialist` | Introduction received | If pre-clearance not initiated within 24h, escalate to `wealth-vvip-manager` |
| `wealth-channel-enablement` → named senior RM | Briefing pack ready | Within 1 business day; escalate to `wealth-vvip-manager` if RM unavailable |
| `aml-kyc-compliance-specialist` → senior RM (cleared) | Verdict written | Verdict ≤ 30 days old at any commercial-transaction step; re-screen if older |
| `aml-kyc-compliance-specialist` → `legal-liaison` (sanctions) | RED-sanctions outcome | Per `runbooks/pep-sanctions-hit.md`; immediate restricted-channel escalation; do not signal to intermediary or principal |
| `account-executive` → `deal-desk-analyst` (non-standard terms) | Proposal involves non-standard structure | Per `deal-desk-analyst` SOP |
| `vip-relationship-manager` → `account-manager` (post-close) | Closing complete | Within 30 days of close |

## Compliance gates

1. **Pre-clearance initiated within 24h** — discretion stance does not waive AML/KYC obligation; pre-clearance is non-negotiable. Communicate to intermediary RM as standard process, not as a flag on the principal.
2. **EDD before substantive commercial conversation** for PEPs (any class) — senior-management approval recorded.
3. **No tipping-off** if RED outcome — switch to `runbooks/pep-sanctions-hit.md` silently; standard intermediary-update language used until Legal advises otherwise.
4. **VVIP-adjacent screening** — if principal is VVIP or VVIP-adjacent (per `.claude/skills/vvip-protocol-uae.md`), case routes through `wealth-vvip-manager` from step 1; restricted-access tightened.
5. **Discretion stance** — case files restricted to named team; no general-team visibility on principal identity until close (and minimal even then per `vvip-channel-enablement` no-mention list if applicable).
6. **PDPL + corridor data-protection** — principal data per the stricter of UAE PDPL or principal's home jurisdiction.
7. **Forbidden phrasing** — applies fully even in private-bank-mediated communications; no yield-guarantee language.
8. **Introducer-fee disclosure** — per the signed introducer agreement; commission-disclosure language follows whatever the agreement specifies. Coordinate with `legal-liaison` if novel.

## Out-of-scope

- General private-bank wealth-channel relationship development — that's `wealth-channel-enablement` standard outside this runbook
- The principal's own commercial decision (yes/no/timing) — buyer agency
- Tax / immigration advice — outside scope; refer to relevant external advisors via intermediary
- Principal's other-asset advice (e.g., fund placements via the bank) — strictly the bank's territory; we do not opine

## KPIs

- Acknowledgment time to intermediary (target: ≤ 4 business hours)
- Pre-clearance initiation time (target: ≤ 24 business hours)
- First substantive contact with intermediary RM (target: ≤ 2 business days)
- Pre-clearance verdict turnaround (target: ≤ 5 business days standard; ≤ 14 for EDD)
- Introduction-to-qualified-pipeline rate (target: ≥ 70% — the intermediary is pre-qualifying for us)
- Introduction-to-closed-won rate (target: corridor + intermediary specific; tracked over time)
- Discretion incidents (target: 0 — non-negotiable)
- Intermediary satisfaction rate (qualitative; surveyed quarterly via `wealth-channel-enablement`)

## Close-out + learning

- Case file moves to `clients/<client>/wealth-channels/<intermediary-slug>/closed/<year>/<introduction-id>/` (restricted-access maintained)
- Per-intermediary performance update — feeds wealth-channel registry status
- Per-corridor pattern (e.g., a specific bank consistently introduces ready-to-transact principals) routes to `wealth-channel-enablement` for relationship investment prioritization
- Material learnings (e.g., a corridor's typical timeline-to-close, a recurring concierge-preference pattern) routed via `knowledge` for `verticals/real-estate/sub-verticals/developer/playbook.md` update

## Related runbooks

- Switch to `pep-sanctions-hit.md` if AML/KYC pre-clearance returns RED
- Coordinate with `press-sensitive-uhnw-transaction.md` if principal is press-sensitive
- Coordinate with `international-roadshow.md` if principal is also a roadshow attendee (deduplicate)
- Coordinate with `resale-with-noc.md` if the principal is buying a resale unit rather than off-plan
