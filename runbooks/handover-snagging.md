# Runbook: Handover + snagging window owner experience

> Scenario: A unit (or block of units, or a tower) is approaching handover. The 30-60 days around handover are decisive for owner satisfaction and for the developer's reputation in the resale market. The snagging window — typically 30-60 days post-handover during which buyers can flag construction defects for remedy — is the highest-friction touchpoint of the entire ownership cycle. Handled well, owners refer; handled poorly, the regulator (RERA Rental Dispute Centre) gets involved and the developer pays in cash and reputation.

## Trigger

A unit reaches the handover-window threshold per the project schedule (typically T-30 days from scheduled handover date).

## Owner

`account-manager` charters end-to-end owner experience; `inventory-manager` handles the unit-side handover coordination; `service-recovery-specialist` activates if complaints surface; `email-lifecycle` runs the cadence; `vip-relationship-manager` handles HNW/UHNW concierge layer; `voc` mines feedback; `events` runs handover-ceremony where applicable.

## Pre-flight

- Project handover schedule current — units in handover-window correctly flagged in `clients/<client>/inventory/units.md`
- Owner registry current — all relevant owners' contact preferences verified
- Snagging-resolution operational team capacity confirmed
- Owner-association governance set up per Dubai Law 27/2007 (or AD equivalent) where applicable
- Service-charge schedule + transparency materials prepared
- Handover-document pack ready (Title Deed / Oqood-to-title transition, warranty packs, building-manuals, owner-association documents)
- VVIP discretion check — any unit on a VVIP-occupied floor handled per `vvip-channel-enablement`

## Sequence

| Phase | Day | Who | What | Emits |
|---|---|---|---|---|
| **Pre-handover** | T-30 | `account-manager` | Handover-window pre-notification email to all owners — confirms scheduled handover date, what to expect, what's needed (final-payment, document-verification, handover-appointment booking) | Notification at `clients/<client>/owners/handover-comms/<batch>/T-30.md` |
| | T-30 | `email-lifecycle` | Owner-portal access activated; document pack uploaded; FAQ surfaced | Portal-access entries |
| | T-30 | `account-manager` | Per-owner outreach call from named developer-side relationship lead — confirm appointment time preferences, address any pre-handover questions | Activity logged in CRM |
| | T-21 | `vip-relationship-manager` | HNW/UHNW owners — bespoke handover ceremony coordination via `events`; private appointment slots; family-member coordination | Concierge case files |
| | T-14 | `account-manager` | Final-payment confirmation prompts; document-verification follow-up | Reminders queued |
| | T-7 | `inventory-manager` + operational handover team | Unit final readiness check (cleaning, snagging-pre-clear, MEP-final, finishes verification) | Per-unit readiness checklist |
| **Handover day** | T-0 | `inventory-manager` + `account-manager` | Handover appointment — keys + document pack + walkthrough; snagging-form provided + walkthrough | Handover-completion artifact per unit |
| | T-0 | `vip-relationship-manager` (HNW/UHNW) | Welcome amenity in unit (matched to known preferences); senior-RM presence at handover | Welcome-touchpoint logged |
| | T-0 | `email-lifecycle` | Same-day welcome email — what's next, snagging-window, owner-association contacts, building amenities | Email sent |
| **Snagging window** | T+1 to T+30 | `inventory-manager` + operational owner | Owner-submitted snagging items received via owner-portal; triaged + scheduled for remedy per SLA | Snagging-case files per item |
| | T+7 | `account-manager` | Week-1 check-in call to every owner — settlement question, snagging clarity, owner-portal navigation | Activity logged |
| | T+7 | `voc` | Mining of week-1 feedback — owner-call notes, portal interactions, snagging-form text — for emerging themes | VoC entries |
| | T+14 | `account-manager` | Mid-window review per owner — open snagging items count, resolution-rate, owner-stated satisfaction | Mid-window note per owner |
| | T+21 | `email-lifecycle` | Owner-association onboarding email — first OA meeting schedule, governance overview, how-to-engage | Email sent |
| | T+30 | `account-manager` | End-of-snagging-window review per owner — open vs. closed items, owner sign-off on closed items, escalation route for unresolved | End-of-window note per owner |
| **Post-window** | T+45 | `account-manager` | Owner CSAT survey — short, structured, attribution-tagged | CSAT entries |
| | T+60 | `voc` | First post-handover NPS pull + theme synthesis | NPS + themes report at `clients/<client>/owners/post-handover/<batch>/voc-T+60.md` |
| | T+90 | `account-manager` + `marketing-manager` | Cohort review — what worked, what didn't, what feeds next-tower handover | Cohort review note |
| | T+90 + ongoing | `email-lifecycle` | Owner ongoing cadence — community updates, event invitations (per `events`), referral program activation | Ongoing lifecycle entry |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `account-manager` → `inventory-manager` (per-unit readiness) | T-7 | Escalate to `chief-commercial-officer` if any unit not ready 48h before scheduled handover |
| `inventory-manager` → snagging operational team | Owner submits snagging item | Per SLA in `clients/<client>/owners/snagging/sla.md`; escalate to `service-recovery-specialist` if SLA breached |
| `account-manager` → `service-recovery-specialist` | Owner expresses dissatisfaction beyond snagging-routine | Per `service-recovery-specialist` SOP |
| `account-manager` → `vip-relationship-manager` | HNW/UHNW owner | Per concierge profile |
| `voc` → `marketing-manager` | Recurring theme surfaces (3+ similar) | Within 7 days of pattern detection |
| `account-manager` → `service-recovery-specialist` (regulator-exposure) | Owner mentions RERA Rental Dispute Centre | Switch to `runbooks/complaint-rera-exposure.md` immediately |

## Compliance gates

1. **Snagging-resolution SLA** — published SLA per `clients/<client>/owners/snagging/sla.md`; breaches expose the developer to RERA / ADREC complaint. Track every item.
2. **Service-charge transparency** — disclosed per `.claude/skills/regulatory-disclosure-language.md` Template 3 (payment-plan disclosure) and corresponding owner-association governance under Dubai Law 27/2007 (Dubai) or AD equivalent. Confirm current per case via `regulatory-research-specialist`.
3. **Owner-association governance** — meeting cadence + voting rights per applicable law; coordinate with `legal-liaison` if novel structure.
4. **PDPL** — owner contact + preference data handled per retention rules.
5. **VVIP discretion** — VVIP-touching units have restricted-access handover scheduling; no general-team visibility.
6. **Material-disclosure** — any handover-package change vs. SPA promises (e.g., spec change, finish substitution) requires owner notification under applicable real-estate law; coordinate with `legal-liaison`.

## Out-of-scope

- Construction snagging-resolution operational work — that's the operational owner's team; runbook tracks but does not run
- Owner-association elected-board operations — that's owner-side post-handover; runbook hands over
- Service-charge collection (post-handover ongoing) — that's the building OAM (operations + asset management); runbook hands over
- Ongoing owner-community programming after T+90 — that's `email-lifecycle` + `events` standard
- Resale activity by handed-over owners — switch to `runbooks/resale-with-noc.md`

## KPIs

- Pre-handover communication touchpoint completion (target: 100% per cadence)
- Per-owner senior-RM call completion in T-30 to T-0 window (target: 100%)
- Snagging-item submission rate (signal — too high suggests construction-quality issue; too low suggests owners not engaging)
- Snagging-item resolution within published SLA (target: ≥ 95%)
- Owner-stated satisfaction at T+30 (target: ≥ 80% positive)
- T+60 NPS (target: by project; trend over time per cohort)
- Snagging-window-to-RERA-complaint conversion (target: ≤ 1% — escalation should be exceptional)
- HNW/UHNW concierge-touchpoint completion (target: 100%)

## Close-out + learning

- Per-cohort handover review at `clients/<client>/projects/<project-slug>/handover/<cohort-id>/closeout.md`
- VoC themes routed to `marketing-manager` for next-tower positioning + to `inventory-manager` for next-tower spec input
- SLA breaches root-caused → either operational-team capacity issue (route to `chief-commercial-officer`) or process issue (route via `knowledge` for SOP update)
- Material learnings (e.g., a particular finish-type that consistently snags) routed to `inventory-manager` for next-project specification

## Related runbooks

- Switch to `complaint-rera-exposure.md` if any owner threatens RERA / ADREC filing
- Switch to `resale-with-noc.md` if a handed-over owner moves to sell within or shortly after the snagging window
- Coordinate with `press-sensitive-uhnw-transaction.md` if any handover involves a press-sensitive principal
- Coordinate with `quarterly-exec-brief.md` for cohort-level reporting to leadership
