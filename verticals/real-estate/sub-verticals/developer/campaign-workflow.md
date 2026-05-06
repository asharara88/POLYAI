# Off-plan campaign workflow (developer sub-vertical)

End-to-end agent assignments for a typical 16-week off-plan launch, from internal greenlight to "30% sold" milestone. Every phase lists the lead agent, supporting agents, deliverables, and the human approval gates.

This is a template — real campaigns compress or expand timing per project size.

## T-16 to T-12 weeks · Pre-brief

**Lead:** `strategy`
**Supporting:** `research`, `voc`, `competitive-intel`, `inventory-manager`

Inputs:
- Project briefing from product / sales leadership
- Inventory definition (units, types, target price-bands, payment plans)
- Sales target (% sold by milestone date) and budget envelope
- Brand-level constraints (master brand, naming, positioning floor)

Deliverables:
- Populated `campaign-brief.md` with primary KPI, segments, channel weights
- Competitive snapshot of 3–5 competing launches in the same district
- VoC pull from prior-tower owners (CRM history, post-purchase NPS, broker notes)
- Inventory baseline document (read-only, owned by `inventory-manager`)

Human approval gates:
- CMO + Head of Sales sign off on campaign brief before agency engagement
- CFO sign off on budget envelope

## T-12 to T-10 weeks · Agency engagement

**Lead:** `agency-liaison`
**Supporting:** `strategy`, `brand-design`, `creative` (review only)

Inputs:
- Approved campaign brief
- Brand guidelines, prior-campaign assets, lessons from `results.md`
- Agency roster + scope-of-work template

Deliverables:
- External agency brief (brand, media, digital production, PR)
- Engagement timelines + deliverable schedules per agency
- Brand asset pack to each agency (DAM links, brand books, prior creative)
- Per-agency KPI definitions and review cadence

Human approval gates:
- Head of Brand approves brief language going to brand agency
- Procurement signs off on SOWs and budgets

## T-10 to T-6 weeks · Creative production

**Lead:** `agency-liaison` (relationship), `brand-design` + `creative` (review)
**Supporting:** `compliance`, `localization`

Inputs:
- Agency outputs: brand creative (visuals, video), copy decks, microsite design, sales gallery design
- Inventory data (`inventory-manager`)
- Compliance flags from `client-profile.md`

Deliverables:
- Reviewed creative round 1, 2, 3 — feedback to agency in structured form
- AR variants of all consumer-facing copy
- Compliance-cleared copy with RERA + financial-promotion sign-off
- Microsite copy + landing-page copy
- Sales gallery experience design + materials wall

Human approval gates:
- Head of Brand on master creative
- Regulatory affairs + legal on all customer-facing claims
- CMO on hero visual and headline

## T-8 to T-4 weeks · Sales-side preparation

**Lead:** `broker-enablement`
**Supporting:** `inventory-manager`, `proposal`, `account-executive`

Inputs:
- Approved creative
- Final pricing + payment-plan structure
- Broker network roster (active firms, individual brokers, performance tiers)
- Sales gallery readiness

Deliverables:
- Broker training materials (factsheets, payment-plan calculators, FAQ)
- Tier-1 broker pre-briefings (private events, one-on-ones)
- Tier-2/3 broker training sessions (group webinars, sales-gallery walkthroughs)
- Reservation-form templates + RERA Form-F prep
- Lead-routing rules (who gets which leads, tiered by broker performance)
- Commission tier confirmation per broker firm

Human approval gates:
- Head of Sales approves broker materials
- Sales operations + legal approve reservation form templates
- Commission tiers confirmed in writing per broker firm

## T-4 to T-2 weeks · Pre-launch outreach

**Lead:** `email-lifecycle` + `social-media`
**Supporting:** `creative`, `partnerships`, `broker-enablement`, `compliance`

Inputs:
- Approved creative pack
- Loyalty / VIP database (existing-tower owners, prior-launch reservations)
- PR + influencer roster

Deliverables:
- VIP / loyalty teaser email (multi-touch)
- WhatsApp 1:1 broker briefings (queued, approved per recipient)
- Press release draft + embargo strategy
- Influencer brief (where used; less common at the developer-marketing-team scale)
- Tier-1 broker private preview event(s) at sales gallery

Human approval gates:
- Every outbound to existing CRM and prior-tower owners (per approval_gates)
- PR pitches before send
- Embargoed press list approved by Head of Communications

## T-2 to T0 (launch day) · Public launch

**Lead:** `strategy` + `analytics`
**Supporting:** `seo`, `social-media`, `email-lifecycle`, `inventory-manager`

Inputs:
- All channel creative live-ready
- Tracking + UTMs validated
- Sales gallery operational, brokers trained, reservation pipeline ready

Deliverables:
- Paid media live across all channels per plan
- Microsite live with real-time inventory feed (where supported)
- Portal listings live (Property Finder, Bayut, diaspora portals)
- Public press release distribution
- Sales gallery opens to public

Human approval gates:
- Final go-live decision (CMO + Head of Sales)
- Paid spend daily caps enforced; over-cap requires re-approval

## T0 to T+8 weeks · Sustain

**Lead:** `analytics` + `forecasting`
**Supporting:** `inbound-qualifier`, `account-executive`, `broker-enablement`, `inventory-manager`, `voc`

Inputs:
- Real-time CRM + media platform data
- Inventory status (updated continuously)
- Broker performance data
- Sales-gallery walk-in data

Deliverables:
- Daily anomaly alerts (drop in lead-quality, broker overflow, channel underperformance)
- Weekly performance report → Tableau / Power BI dashboards for leadership
- Per-channel optimization recommendations (rebalance budgets, kill underperformers)
- Per-broker performance feedback
- Inventory updates pushed to all customer-facing surfaces
- Lead-quality feedback loop with sales (which sources convert, which don't)
- VoC: continuous mining of sales-call notes, broker disputes, prospect questions

Human approval gates:
- Channel rebalancing > 20% of plan needs CMO approval
- Tier-1 broker disputes escalate to Head of Sales

## T+ongoing · Marketing during construction

**Lead:** `social-media` + `email-lifecycle`
**Supporting:** `voc`, `account-manager`, `competitive-intel`

For the 24–48 months between launch and handover:

Deliverables:
- Monthly construction-progress updates (third-party-verified photos, drone footage)
- Owners-only WhatsApp / email community
- Snagging-period coordination
- Handover-event planning
- Reactivation / referral plays (existing owners are the highest-converting source for next launch)

## Phase summary table

| Phase | Weeks | Lead agent | Key human gate |
|---|---|---|---|
| Pre-brief | T-16 to T-12 | strategy | CMO + Head of Sales sign off |
| Agency engagement | T-12 to T-10 | agency-liaison | Head of Brand + Procurement |
| Creative production | T-10 to T-6 | brand-design + creative | Head of Brand + Regulatory + CMO |
| Sales prep | T-8 to T-4 | broker-enablement | Head of Sales + Sales Ops + Legal |
| Pre-launch | T-4 to T-2 | email-lifecycle + social-media | Head of Communications |
| Launch | T-2 to T0 | strategy + analytics | CMO + Head of Sales (go-live) |
| Sustain | T0 to T+8 | analytics + forecasting | CMO (rebalance > 20%) |
| Construction marketing | T+ongoing | social-media + email-lifecycle | Per artifact |

---

## Regulatory-milestone overlay

The campaign-workflow phases above are the **commercial cadence**. Layered on top is a **regulatory cadence** that gates whether the campaign can lawfully proceed at each step. This overlay reframes the same timeline using the regulator-side T-90 / T-30 / T0 / T+30 vocabulary alongside the marketing-side T-16/T-12/etc. above.

**Critical principle:** Every specific regulator timing or form below is a *framework reference*. Confirm current per case via `regulatory-research-specialist` — DLD/RERA/ADREC update circulars frequently and yesterday's truth is not always today's.

### Regulatory milestone table

| Reg-clock | Marketing-clock | Milestone | Owner | Hand-off | Without it |
|---|---|---|---|---|---|
| **T-90 days from public launch** | ~T-16 to T-12 | Project escrow / Trustee Account opened (Dubai Law 8/2007 / Abu Dhabi Law No. 3/2015 — verify applicable per project location) | Developer's regulatory-operations team + `marketing-financial-manager` (commercial coordination) | `regulatory-research-specialist` confirms current process; trustee-bank reference recorded for use in payment-plan disclosure | No public-facing payment-plan reference can ship; full launch blocks |
| **T-90 to T-60 days** | ~T-16 to T-10 | RERA project registration (Dubai) / ADREC project registration (Abu Dhabi) | Developer's regulatory-operations team | `compliance` for project-registration-number capture; flows into Template 4 (permit / registration display) | No public-facing project reference can ship |
| **T-60 days** | ~T-10 to T-8 | Oqood off-plan registration system enabled for the project (Dubai-side) | Developer's regulatory-operations team + `inventory-manager` | `account-executive` for reservation-form wiring | Reservations cannot be booked into the regulator-recognized system |
| **T-45 to T-30 days** | ~T-8 to T-6 | **Trakheesi advertising-permit application** initiated for Dubai-side ads (per `integrations/trakheesi/spec.md`) | `agency-liaison` (chase) + developer's regulatory-operations team | `compliance` blocks any Dubai-side artifact ship until permit number on file | No Dubai-side ad can lawfully run; channels reject artifacts without permit |
| **T-45 to T-30 days** | ~T-8 to T-6 | ADREC advertising-permit equivalent application (Abu Dhabi-side) — verify current per case via `regulatory-research-specialist` | `agency-liaison` + developer's regulatory-operations team | `compliance` mirrors Trakheesi gate for AD-side | No AD-side ad can lawfully run |
| **T-30 days** | ~T-6 to T-4 | Compliance review of all customer-facing creative against `.claude/skills/regulatory-disclosure-language.md` templates 1-7 | `compliance` + `regulatory-research-specialist` (current-wording confirmation) | `creative` + `agency-liaison` for required revisions | Forbidden phrasing or missing required disclosures cause platform-policy + regulator exposure |
| **T-30 days** | ~T-6 to T-4 | Arabic substantive-equivalence review of all customer-facing creative | `localization` (translation) → `compliance` (substantive-equivalence) | Re-loop `compliance` + `regulatory-research-specialist` | Arabic-EN drift creates per-language disclosure inconsistency — material regulatory risk |
| **T-21 days** | ~T-4 to T-2 | Tier-1 broker pre-briefing materials cleared for use (must include current Trakheesi permit reference + escrow / payment-plan disclosure) | `broker-enablement` + `compliance` | `agency-liaison` distributes to broker network | Broker-side ad / WhatsApp / email use of pre-cleared materials with stale permit triggers regulator exposure |
| **T-14 days** | ~T-2 | AML/KYC capacity check: `aml-kyc-compliance-specialist` ready to handle launch-volume incoming-buyer screening within SLA; Sumsub levels configured per `integrations/sumsub/spec.md` per-client config | `aml-kyc-compliance-specialist` + `chief-commercial-officer` | Commercial pod for any pre-launch reservation-flow tests | Launch-day buyer flow stalls in pre-clearance; revenue-recognition lag and customer-experience hit |
| **T-7 days** | ~T-2 to T0 | Permit-display verification across all in-flight artifacts (microsite footer, OOH bottom-bar, paid-social caption, paid-search ad-extension) | `compliance` + `data-quality-steward` (audit-pass) | `agency-liaison` for any remediation | Any one missing-permit artifact in market triggers pull-down within 24h per `runbooks/trakheesi-permit.md` (P3) |
| **T0 launch day** | T0 | Final go-live confirmation: all permits valid + all disclosures current + escrow reference live + AML/KYC ready | `compliance` (chair) + `chief-commercial-officer` (sign-off) | Launch proceeds | Launch is held |
| **T+30 days** | ~T+4 | First sustain-phase compliance audit: any artifact that drifted (rotated copy, new variants, broker re-issued packs) revalidated | `compliance` + `data-quality-steward` | Remediation loop with relevant agency / pod | Drift accumulates and surfaces as a regulator inquiry weeks later |
| **T+90 days** | ~T+12 | Permit-renewal initiation if any in-flight permit will expire within 30-day buffer per `integrations/trakheesi/spec.md` config | `agency-liaison` + developer's regulatory-operations team | `compliance` for renewed-permit verification | Mid-flight permit expiry forces pull-down |
| **T+ongoing** | T+ongoing | Re-screening cadence on cleared counterparties per risk-rating in `.claude/skills/aml-kyc-uae-real-estate.md` | `aml-kyc-compliance-specialist` | Any new hit triggers `runbooks/pep-sanctions-hit.md` | Continuous-monitoring obligation under DNFBP rules; lapse exposes the developer |

### Cross-runbook coordination during launch

- **Resale activity** during the launch window (existing-tower owners selling to upgrade into the new tower) follows `runbooks/resale-with-noc.md` in parallel — coordinate via `secondary-market-specialist`.
- **Customer complaints** that surface during sustain follow `runbooks/complaint-rera-exposure.md` if regulator-exposure flag fires.
- **VVIP-touching creative** (e.g., a special-edition penthouse marketed via `vvip-channel-enablement`) follows the discretion stance — `compliance` references the no-mention list before sign-off.
- **Sanctions-surface corridor activity** (Russia/CIS, etc.) — pre-commercial-conversation screening per `.claude/skills/aml-kyc-uae-real-estate.md`; do not allow a sales-gallery walk-in from a corridor counterparty to advance to commercial conversation without screening cleared.
