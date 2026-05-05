# Campaign brief — Saadiyat Reserve Heights — Q3 Launch

> **Worked example — illustrative.** Fictional campaign brief; not real Aldar Properties data.
>
> Owned by `strategy`. Conforms to `schemas/campaign-brief.md`.
> Stamped with `client: aldar-developments, vertical: real-estate, sub_vertical: developer` per envelope rules.
>
> **Linked client artifacts (developer sub-vertical):**
> - Inventory truth: `clients/_examples/aldar-developments/inventory/current.md` (gates every artifact referencing units)
> - Broker network: `clients/_examples/aldar-developments/brokers/registry.md`
> - Agency engagements: `clients/_examples/aldar-developments/agencies/`
>   - Brand: `agencies/memac-ogilvy/profile.md`
>   - Media: `agencies/havas-mena/profile.md`
> - Working surfaces: Canva (agency design files) + Miro (planning board) — see `integrations/canva/spec.md` and `integrations/miro/spec.md`

```yaml
campaign_id: q3-tower-launch
project_name: "Saadiyat Reserve Heights"
goal: Reserve 30% of inventory at launch (target ≈ 84 of 280 residences) within 12 weeks of public launch
primary_kpi: Reservations (signed reservation form + AED 100k holding deposit)
secondary_kpis:
  - Qualified-lead-to-viewing rate ≥ 40%
  - Viewing-to-reservation rate ≥ 18%
  - Cost per qualified lead, by segment and channel
  - Share of reservations across three segments (target: GCC investor 45% / diaspora 35% / AD-resident upgrade 20%)
audience:
  segment_a:
    name: GCC investor (yield + appreciation, AD-aligned)
    pains:
      - Limited high-yield AED-denominated deployment options
      - Off-plan counter-party risk (the developer's institutional credibility is a positive)
      - Service-charge transparency
    current_alternatives:
      - Other tier-1 UAE developers' off-plan launches
      - Existing-stock secondary purchase
      - Outside-region holdings (London, Singapore)
  segment_b:
    name: Diaspora investor (UK, India, Egypt, Russia/CIS)
    pains:
      - Hard-currency / inflation hedge demand
      - Distance + trust gap on virtual purchases
      - Residency optionality interest
    current_alternatives:
      - Home-market property
      - London buy-to-let
  segment_c:
    name: AD-resident end-user upgrade (Saadiyat / Yas / dual-corridor)
    pains:
      - School-catchment concern; community amenities
      - Handover-date predictability for family timing
      - Payment-plan affordability leveraging existing-property equity
    current_alternatives:
      - Resale market in established AD communities (Al Reef, Al Raha Gardens)
      - Holding existing residence
positioning:
  promise: |
    A residence engineered to be owned for a generation, with the financial
    transparency you'd expect from a private bank — operated by a named
    hospitality partner you already know, in a master community designed
    for the long horizon.
  proof_points:
    - Named architectural firm + named hospitality operator
    - Construction-progress transparency: monthly third-party-verified updates
    - Service-charge stated as AED/sqft per annum, capped for first 5 years post-handover
    - Escrow-protected payment plan compliant with relevant regulator (RERA / ADGM as applicable)
    - Exit liquidity: rental-pool program operated by hospitality partner from day one
    - Master-community institutional context (Saadiyat cultural-corridor adjacency)
  anti_positioning:
    - We are NOT competing on price-per-sqft
    - We are NOT a yield-maximization product (5–7%, not 9–12%)
    - We are NOT speaking to first-time buyers
offer:
  hook: A pre-launch reservation window, by invitation, for 4 weeks before public launch
  call_to_action: Request the investor pack
  destination: saadiyat-reserve-heights.example/investor-pack (gated form, Salesforce Marketing Cloud)
channels:
  - channel: Property Finder + Bayut (premium listing tier)
    weight: 0.20
    rationale: Investor segment researches here; premium tier for visibility on tower-name search
  - channel: Google Ads (paid search)
    weight: 0.18
    rationale: Bottom-funnel branded + competitor + neighborhood terms; high-intent investor queries
  - channel: Meta (Instagram + Facebook)
    weight: 0.18
    rationale: Architectural visual storytelling; lookalike audiences off existing CRM and prior tower
    sub_audiences: [GCC HNI lookalikes, UK-Indian-diaspora interest stack, Russia/CIS HNI interest]
  - channel: LinkedIn
    weight: 0.12
    rationale: GCC business-owner + family-office-principal targeting; investor-thesis content
  - channel: WhatsApp 1:1 (broker-led)
    weight: 0.10
    rationale: Highest-conversion in segment; consent-only, no broadcast; coordinated by brokers
  - channel: PR + earned (architecture press, lifestyle press)
    weight: 0.10
    rationale: Credibility build, especially for diaspora segment that can't visit before reserving
  - channel: Diaspora portals (Magicbricks IN, Rightmove UK, regional Russia/CIS)
    weight: 0.07
    rationale: Diaspora segment researches in home-market portals first
  - channel: Email to existing CRM + prior-tower owners
    weight: 0.05
    rationale: Highest-converting list (existing customers); referral mechanic embedded
timeline:
  start_date: 2026-05-13
  end_date: 2026-08-05
  milestones:
    - 2026-05-13: Pre-launch teaser to existing CRM + brokers' 1:1 networks
    - 2026-05-27: Invitation-only investor pack live
    - 2026-06-10: Public launch creative live across paid channels
    - 2026-06-17: Sales gallery opens; in-person viewings begin
    - 2026-07-08: Mid-campaign analytics readout; rebalance spend by segment performance
    - 2026-08-05: 30% reservation milestone target
budget:
  total: AED 165,000,000
  by_channel:
    portals: 33000000
    paid_search: 30000000
    meta: 30000000
    linkedin: 20000000
    whatsapp_ops: 16500000
    pr: 16500000
    diaspora_portals: 11500000
    email_crm: 8200000
constraints:
  must_include:
    - Named architect, named hospitality operator, escrow + regulator (RERA / ADGM) disclosure
    - Service-charge AED/sqft figure visible on landing pages and brochure
    - Payment plan structure visible before form submission
  must_avoid:
    - "Guaranteed yield" or "guaranteed appreciation" language
    - Any comparison naming a competing developer
    - Stock-image villas, helicopter shots, champagne glasses (per brand-voice.md)
  brand_voice_ref: clients/_examples/aldar-developments/knowledge/brand-voice.md
  compliance_flags:
    - ADGM            # primary regulator (Abu Dhabi anchoring)
    - RERA            # for Dubai-side reach
    - off-plan-disclosure
    - financial-promotion
    - GDPR            # for UK + EU-resident diaspora outreach
    - sanctions-screening   # for Russia/CIS prospects before commercial conversation
measurement_plan:
  attribution_model: Salesforce revenue attribution (multi-touch, position-based weighting)
  test_design:
    - A/B test on hero landing: "yield-led headline" vs. "architecture-led headline" — primary KPI = investor-pack request rate
    - Holdout: hold back 10% of CRM list from email send to baseline organic conversion
  reporting_cadence: weekly to orchestrator + human user; daily anomaly alerts from analytics
dependencies:
  - research-brief: investor-segment willingness-to-pay validation (assigned)
  - voc: prior-tower CRM thread analysis for objection patterns (assigned)
  - competitive-intel: snapshot of 3 competing Q3 launches across UAE master-developers (assigned)
  - compliance: full pre-launch review of investor pack + landing page (mandatory)
  - localization: AR variants for primary creative; Hindi-context UK-diaspora variant (en-IN tone); RU variant for Russia/CIS corridor
human_approval_required:
  - Final paid-channel launch (any spend > AED 250k/day per platform)
  - All outbound to existing CRM and prior-tower owners
  - PR pitches before send
  - Investor pack v1 before any external delivery
```

## Decomposition into creative briefs

`strategy` will derive these creative briefs from this campaign brief. Each is a separate file; only the hero-landing brief is fully populated below as the worked example.

- `creative-brief-hero-landing.md` ← **populated** as worked example
- `creative-brief-investor-pack.md`
- `creative-brief-paid-search-ads.md`
- `creative-brief-meta-launch-set.md`
- `creative-brief-linkedin-thesis-post.md`
- `creative-brief-email-prelaunch.md`
- `creative-brief-portal-listing-copy.md`
