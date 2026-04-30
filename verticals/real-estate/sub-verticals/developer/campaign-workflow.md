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
