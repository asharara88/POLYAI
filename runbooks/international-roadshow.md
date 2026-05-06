# Runbook: International roadshow (post-event 14-day cadence)

> Scenario: The developer has run an international roadshow event in a target buyer-corridor city (Mumbai, Riyadh, London, Lagos, Moscow, Cairo, Karachi, Singapore, etc.). Roadshow attendees expressed interest at varying levels. The 14 days following the roadshow are the conversion window — handled well, attendee → qualified-pipeline conversion is materially higher than equivalent paid acquisition. Handled badly, the leads cool, the roadshow ROI evaporates, and the next roadshow in that corridor faces colder reception.

## Trigger

Roadshow event closes; attendee list + interest-tier captured by the events team.

## Owner

`marketing-manager` charters; `email-lifecycle` runs the cadence; `account-executive` (corridor-specialist where applicable) handles tier-1 follow-ups personally. `events` provides the attendee dataset.

## Pre-flight

- Attendee dataset finalized within 24h of event close — name, email, phone, expressed interest level (tier 1 = serious; tier 2 = warm; tier 3 = exploratory), corridor of residence, language preference
- AML/KYC-screening readiness for any tier-1 attendee from sanctions-surface corridor (Russia/CIS, etc.) — `aml-kyc-compliance-specialist` capacity check
- Local-time-zone calendar for the corridor (so cadence respects buyer's working hours, not Dubai's)
- Golden Visa eligibility framing per corridor verified via `regulatory-research-specialist` (current threshold + conditions)
- Localized creative (corridor-language email + WhatsApp templates) approved by `compliance` per `.claude/skills/regulatory-disclosure-language.md`

## Sequence

| Day | Who | What | Emits | SLA |
|---|---|---|---|---|
| Day 0 (event close) | `events` → `marketing-manager` | Hand off attendee list with interest-tier, corridor, language | Attendee dataset at `clients/<client>/events/<event-id>/attendees.md` | within 24h of event close |
| Day 0 + 4h (in buyer's local time) | `email-lifecycle` | Thank-you email — corridor-language; references the event; offers next-step (microsite tour, virtual viewing, follow-up call) | Email sent | per local-time send-window |
| Day 1 (buyer's local time) | `account-executive` (corridor-specialist) | Personal follow-up to every tier-1 attendee — phone or WhatsApp per attendee preference | Activity logged in Salesforce per `integrations/salesforce/actions/activity-log.md` | within 24h |
| Day 2 | `email-lifecycle` | Tier-2 follow-up email with project fact pack PDF (per `.claude/skills/project-fact-pack.md` — buyer-facing version) and corridor-specific Golden Visa framing | Email sent | within local-business-day window |
| Day 3-5 | `account-executive` | Schedule virtual viewings or arrange Dubai/AD trip-coordination for any tier-1 attendee that engages | Viewing-booked artifacts | per attendee responsiveness |
| Day 5 | `email-lifecycle` | Tier-3 nurture email — softer, more discovery-oriented, links to brand microsite + project portfolio | Email sent | within local-business-day window |
| Day 7 | `marketing-manager` | Mid-cadence checkpoint — engagement-rate review, route engaged-but-uncontacted leads to `account-executive` | Mid-cadence note | end of week |
| Day 7 (parallel) | `aml-kyc-compliance-specialist` | Pre-clearance screening initiated on every tier-1 attendee from sanctions-surface corridor (do not wait for attempted commercial conversation) | Sumsub run-check actions per `integrations/sumsub/actions/run-check.md` | within 7 days of event |
| Day 10 | `email-lifecycle` | Re-engagement email to non-openers with different angle (e.g., construction-progress for sustain-phase project, or testimonial-led for launch) | Email sent | per local-time-window |
| Day 12 | `account-executive` | Final personal-touch follow-up to tier-1 attendees who have not progressed to viewing or call | Activity logged | within 12 days of event |
| Day 14 | `marketing-manager` | Cadence-close + attribution attribution: which attendees converted to qualified pipeline; which to active opportunity; which to cold | Cadence-close report at `clients/<client>/events/<event-id>/post-event-conversion.md` | within 14 days |
| Day 14 + | `analytics` | Roadshow attribution analysis per `.claude/skills/marketing-attribution.md`: cost-per-attendee, attendee-to-qualified rate, qualified-to-closed projection, ROI vs. plan | Attribution memo | within 30 days of cadence close |
| Day 30, 60, 90 | `email-lifecycle` | Long-tail nurture for attendees who didn't convert in the 14-day window; segmented per interest-tier and engagement signal | Continued lifecycle entry | per nurture program |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `events` → `marketing-manager` (attendee dataset) | Event close + 24h | Escalate to `chief-commercial-officer` if dataset not delivered within 48h — every hour of delay costs conversion |
| `marketing-manager` → `email-lifecycle` (cadence kick-off) | Day 0 | Escalate after 12h |
| `marketing-manager` → `account-executive` (tier-1 list) | Day 0 | Escalate after 24h |
| `account-executive` → `aml-kyc-compliance-specialist` (corridor pre-clearance) | Day 0 for sanctions-surface corridors | Pre-clearance must initiate within 7 days; escalate to `wealth-vvip-manager` if blocked |
| `marketing-manager` → `analytics` (attribution) | Day 14 | Within 30 days |

## Compliance gates

1. **Corridor disclosure language** — every email + WhatsApp respects the corridor's regulatory framework (UK FCA-adjacent for UK; FCA-equivalent for KSA SAMA; etc.). `compliance` confirms localized creative pre-approval per `.claude/skills/regulatory-disclosure-language.md` with corridor-specific overlay.
2. **Golden Visa framing** — never imply guaranteed visa issuance; current threshold + conditions verified via `regulatory-research-specialist`.
3. **Forbidden phrasing** — full block list applies in localized variants too; substantive equivalence in translation per `localization` workflow.
4. **PDPL + corridor data-protection** — attendee data handled per the stricter of UAE PDPL or the corridor's own regime (often the corridor's regime — e.g., GDPR for UK/EU residents).
5. **Sanctions-surface corridors** — pre-clearance screening on tier-1 attendees mandatory before any substantive commercial conversation, not just before transaction.
6. **VVIP-adjacent attendees** — if any roadshow attendee is VVIP-adjacent (per the no-mention list or per `vvip-channel-enablement` flag), their handling routes through `wealth-vvip-manager` immediately, off this standard cadence.

## Out-of-scope

- Roadshow event execution itself (planning, venue, attendee acquisition) — that's `events` per its own SOP
- Long-term nurture beyond Day 90 — that's `email-lifecycle` standard nurture (the runbook hands off)
- Per-buyer commercial negotiation — that's `account-executive` (the runbook gets them to qualified, not closed)
- Channel-mix decision for roadshow vs. other corridor activity — that's `marketing-manager` (strategic, not runbook-ial)

## KPIs

- Attendee-to-qualified-pipeline conversion rate by tier (target: tier 1 ≥ 60%, tier 2 ≥ 25%, tier 3 ≥ 8%)
- Qualified-to-closed conversion by corridor (tracked separately because corridors convert at different rates)
- Cadence engagement (open + click + reply rate) by corridor + by tier
- Cost-per-qualified-pipeline-lead from the roadshow vs. corridor's standard channel benchmark
- ROI vs. plan within 12 months
- Cadence completion rate (target: 100% of tier-1 attendees receive day-1 personal follow-up)
- Pre-clearance completion rate on sanctions-surface tier-1 attendees (target: 100% within 7 days)

## Close-out + learning

- Cadence-close report at `clients/<client>/events/<event-id>/post-event-conversion.md`
- Corridor-pattern alerts to `marketing-manager` (e.g., one corridor consistently underperforms; messaging may need rework)
- Roadshow-format learnings (which session formats produced higher tier-1 conversion) routed via `knowledge` for `verticals/real-estate/sub-verticals/developer/playbook.md` update
- Attendee dataset moves to `clients/<client>/events/<event-id>/closed/` after Day 90; per-attendee record persists in CRM per attribution doctrine

## Related runbooks

- Switch to `inbound-hnw-private-bank.md` if a tier-1 attendee's wealth-channel intermediary independently surfaces them
- Switch to `pep-sanctions-hit.md` if AML/KYC pre-clearance returns RED on a tier-1 attendee
- Coordinate with `press-sensitive-uhnw-transaction.md` if a tier-1 attendee is press-sensitive
