# Real-estate sub-vertical: Developer (off-plan)

For master developers and project developers running their own sales arms — Aldar, Emaar, Damac, Sobha, Meraas, Nakheel and equivalents in other markets. Not for brokerages, portals, or single-rooftop resellers (those need different sub-verticals).

Inherits everything from `verticals/real-estate/playbook.md`. Overrides the parts that are developer-specific.

## What makes the developer motion different

1. **Agency-led production, in-house sales.** Creative and media planning are usually outsourced to a brand agency and a media agency. The developer's marketing team owns the brief, the brand, the budget, and the approvals. The agents support both sides of that relationship.
2. **Broker-mediated sales.** A typical Dubai launch sells 60–80% through an external broker network of 100–500+ brokers, not directly to end-customers. Broker enablement is its own discipline (training, marketing collateral, lead routing, commission tracking, escalations).
3. **Inventory is the product, and it moves.** Available units, pricing tiers, payment plan structures, and floor-plan availability change weekly during a launch. Every customer-facing asset has to reflect the truth at the moment, or it kills trust.
4. **RERA + financial-promotion compliance is non-negotiable.** Off-plan disclosures, escrow references, projected-yield language, advertising approvals, and copy-translation accuracy across English and Arabic all flow through compliance every time, not "if it's risky."
5. **Sales-gallery is part of the marketing funnel.** The physical experience (model unit, materials wall, fly-through, hosted hospitality) is a campaign asset, not just a sales venue.
6. **Lifecycle continues for years.** Off-plan to handover is 24–48 months. There's a marketing-during-construction phase (renderings → progress photos → snagging → handover party) that no other vertical has.

## Audience archetypes (overlay on the parent playbook)

Use these in addition to the parent playbook's archetypes. Real launches almost always sell across more than one of these:

- **GCC HNI investor** — primary segment in most Dubai launches. Yield + appreciation + portfolio diversification. Cycle 30–90 days. Conversion-decisive moment is usually a sales-gallery visit with a senior broker.
- **Diaspora investor (NRI / UK-Indian / GCC-resident expat)** — virtual buyers. Conversion-decisive moment is a video tour + named-broker WhatsApp follow-up + verified third-party construction status.
- **End-user upgrade** — local family moving up. Cycle 60–180 days. Conversion-decisive moment is school catchment + handover-date predictability + payment-plan affordability.
- **Family office / institutional** — multi-unit / floor / building. B2B motion. Long cycle, multiple meetings, bespoke commercial terms.
- **Government / employer relocation** — block deals via HR. Different stakeholder map entirely.

## Stakeholder map (who the agent team works with)

```
Developer marketing team
  ├─ CMO / VP Marketing                 (final approver on creative + budget)
  ├─ Head of Brand                      (brand voice, master-brand guardian)
  ├─ Head of Performance                (paid media, attribution, dashboards)
  ├─ Head of Communications / PR        (press, executive thought leadership)
  ├─ Project marketing manager(s)       (per-tower campaign owner)
  └─ Marketing operations               (martech stack, data, tracking)

External
  ├─ Brand agency                        (creative + brand strategy)
  ├─ Media agency                        (media buying, programmatic)
  ├─ Digital production agency           (microsites, AR/VR, fly-throughs)
  ├─ PR / influencer agencies            (earned + paid social influence)
  └─ Print / production vendors          (sales gallery, OOH, brochures)

Sales side (the marketing team's primary internal customer)
  ├─ Head of Sales                       (sets revenue targets, owns brokers)
  ├─ In-house sales team                 (brokers + relationship managers)
  ├─ External broker network             (the volume engine)
  ├─ Sales operations / admin            (paperwork, RERA forms, escrow)
  └─ Customer experience team            (post-reservation handover)

Compliance + legal
  ├─ Regulatory affairs                  (RERA, advertising approvals, ad CHASIS)
  ├─ Legal                               (SPAs, disclosures, third-party agreements)
  └─ Finance                             (escrow accounts, payment schedules)
```

The agent team has to talk to (read from / write to) most of these.

## Agents involved in a developer engagement

Existing agents that map directly:
- `strategy` → owns the campaign plan / measurement plan
- `research` + `competitive-intel` → live tracking of competing launches
- `voc` → mining post-purchase NPS, broker feedback, sales-call transcripts
- `creative` → reviews and improves agency-supplied copy; never replaces agency
- `brand-design` → reviews agency visuals against developer brand standards
- `seo` → microsite + portal listings + bottom-funnel paid search
- `social-media` → channel-native adaptation
- `email-lifecycle` → loyalty / VIP / past-buyer reactivation
- `analytics` → KPI definition + Tableau / Power BI feed specs
- `inbound-qualifier` → speed-to-lead routing (under 5 minutes is the bar)
- `account-executive` → broker-mediated deal support (not directly customer-facing)
- `proposal` → reservation forms, allocation requests, payment-plan customization
- `forecasting` → sales-velocity vs. inventory burn-down
- `compliance` → RERA + financial promotion + cross-language sign-off
- `localization` → EN ↔ AR adaptation; diaspora-language variants
- `review` → final QA before agency-supplied artifacts go live
- `partnerships` → broker-firm partnerships, not consumer partnerships

Developer-specific agents (added with this sub-vertical):
- `agency-liaison` → owns the relationship with each external agency: briefs, deliverables, approvals, deadlines, performance.
- `broker-enablement` → manages the broker network: training, materials, lead routing, allocations, commission disputes, broker performance.
- `inventory-manager` → maintains the source of truth for unit availability, pricing tiers, payment plans, floor-plan inventory; gates any creative or listing that references specific units.

## Approval gates (developer-specific overrides)

These should be set in `clients/<slug>/client-profile.md` → `approval_gates`:

```yaml
outbound_email_threshold: 0           # all customer/investor outbound through human
social_publish: always-approve        # everything social goes through brand
paid_spend_cap: 0                     # nothing auto-launched; CFO/CMO sign-off
proposal_send: always-approve
contract_signature: always-approve
broker_communication:                 # NEW gate — see broker-enablement agent
  bulk: always-approve
  1-to-1: approve-non-standard
inventory_change:                     # NEW gate — any creative referencing units
  pricing_tier: always-approve
  unit_availability: always-approve
agency_brief_send: always-approve     # external agency engagement
press_pitch: always-approve
rera_filing: always-approve           # regulatory filings always human + legal
```

## Compliance flags (developer-specific)

```yaml
compliance_flags:
  - RERA                              # advertising approval per project
  - off-plan-disclosure               # mandatory paragraph + RERA project number
  - financial-promotion               # any rental-yield, ROI, capital-appreciation language
  - escrow-disclosure                 # Article 11 escrow account reference
  - SPA-language-consistency          # marketing claims must match SPA terms
  - GDPR                              # for EU-resident investor outreach
  - DIFC-DSGVO                        # DIFC data protection where applicable
  - broker-disclosure                 # commission disclosures where required
```

## KPI overlay (developer launches)

Beyond the parent playbook's KPIs, developer launches track:

- **Pre-launch reservation pace** — by week, vs. plan
- **Sales-gallery walk-in conversion** — visit → reserved within 7 days
- **Broker-attached %** — share of reservations where a broker was the source
- **Speed-to-lead** — median time from form submission to first sales contact (target < 5 min)
- **Per-channel cost per qualified lead** — by source AND by ICP segment
- **Inventory burn-down** — units reserved by floor / unit-type / price-band
- **Cancellation / drop-off rate** — % of reservations that don't progress to SPA
- **Broker performance** — by broker firm and by individual broker
- **Sales-velocity vs. construction milestones** — sold % at substructure / superstructure / topping-out / handover

## Common pitfalls (developer-specific)

- **Creative shipped without inventory check.** A floor plan in an ad that's already sold-out kills trust and triggers complaints. `inventory-manager` should gate any creative referencing specific units.
- **Broker briefings out-of-sync with consumer creative.** Brokers go to market with old pricing or old payment plans. The team has to sync internal and external comms in lockstep.
- **Translation drift.** AR copy that subtly contradicts the EN copy on payment plans is a real RERA risk. `compliance` + `localization` together, not separately.
- **Sales gallery as a silo.** Marketing doesn't have visibility into walk-ins or broker conversions; performance reports lag by weeks. Tableau + CRM integration fix this.
- **Vanity reach metrics.** Reach and impressions hide whether the right people are seeing the campaign. Tie every dashboard to `qualified leads → reservations` not exposure.
- **Press coverage timed wrong.** PR hits before the sales gallery is ready, or before brokers are trained. PR + sales-ops + broker-enablement need a shared calendar.
- **Diaspora media mistimed.** UK / India campaigns launching in summer — when most diaspora investors are visiting Dubai — vs. winter when they're not. Trip seasonality matters.

## Sub-sub-verticals (worth flagging when onboarding)

- **Master developer with land bank** — multiple project launches per year, brand-led identity. Aldar, Emaar.
- **Project developer / vertical builder** — fewer launches, project-led identity. Sobha, Damac, smaller boutiques.
- **Branded residences (hospitality + developer JV)** — co-brand with a hotel operator. Different voice, different audience, different creative bar. Marriott, Four Seasons, Bvlgari residences fall here.
- **Mass-market off-plan** — different audience entirely; price-led, payment-plan-led, less brand-restraint.
- **Government-anchored / freezone-anchored** — DIFC, ADGM, Saadiyat, RAK FTZ. Different stakeholder map.
