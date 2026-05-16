# Campaign brief — Hudayriyat Canal Residences — Pre-launch

> **Worked example — illustrative.** Fictional campaign brief; not real Aldar Properties data.
>
> Owned by `marketing-manager`. Conforms to `schemas/campaign-brief.md`.

```yaml
campaign_id: hudayriyat-canal-residences-pre-launch
project_name: "Hudayriyat Canal Residences"
goal: Build a 1,500-name pre-launch interest list (qualified, segment-tagged) ahead of public launch in October
primary_kpi: Investor-pack requests from qualified leads (≥ AED 5M household profile)
secondary_kpis:
  - Wealth-channel intermediary leads share ≥ 35% of total
  - Broker-introduced leads share ≥ 25%
  - Cost per qualified investor-pack request, by channel
audience:
  segment_a:
    name: GCC family-office principal
    pains:
      - Limited deployment options on mid-market AED yields
      - Demand for waterfront-canal lifestyle product class
positioning:
  promise: |
    A canal-front address engineered to outlast a generation,
    operated by a hospitality-grade service partner.
offer:
  hook: Private viewing series for invitation-only investor segments — Sept 14–28
  call_to_action: Request the canal residences investor pack
  destination: hudayriyat-canal.example/investor-pack
channels:
  - channel: Wealth-channel intermediaries (private banks + family offices)
    weight: 0.35
    rationale: Highest-converting segment; consent-only; coordinated by wealth-channel-enablement
  - channel: Broker network (Tier-1 broker dyads)
    weight: 0.25
    rationale: Long-cycle introductions; reservoir of GCC and AD-resident HNI
  - channel: PR + earned (architecture press, lifestyle press)
    weight: 0.15
    rationale: Credibility + visibility ahead of public launch
  - channel: LinkedIn (thesis content)
    weight: 0.12
    rationale: Family-office-principal audience; investor-thesis posts
  - channel: Direct CRM (existing-owner referrals)
    weight: 0.13
    rationale: Highest-converting list; referral incentive structured
timeline:
  start_date: 2026-08-15
  end_date: 2026-10-30
  milestones:
    - 2026-08-15: Wealth-channel + broker briefing series begins
    - 2026-09-01: Private viewing series invitations sent
    - 2026-09-14: First private viewing event (sales gallery)
    - 2026-09-28: Final private viewing event
    - 2026-10-15: Pre-launch interest list closes; investor packs sent to converted leads
    - 2026-10-30: Public launch (separate campaign)
budget:
  total: AED 38,000,000
  by_channel:
    wealth_channel_ops: 13300000
    broker_ops: 9500000
    pr: 5700000
    linkedin: 4560000
    crm_ops: 4940000
constraints:
  must_include:
    - Named architect, named hospitality operator, escrow + RERA disclosure
    - Service-charge AED/sqft figure on all materials
  must_avoid:
    - "Guaranteed yield" or "appreciation" language
    - Stock-image villas, helicopter shots
  brand_voice_ref: clients/_examples/aldar-developments/knowledge/brand-voice.md
  compliance_flags:
    - ADGM
    - RERA
    - off-plan-disclosure
    - financial-promotion
    - sanctions-screening
measurement_plan:
  attribution_model: Salesforce revenue attribution (multi-touch)
  reporting_cadence: weekly to chief-commercial-officer
dependencies:
  - wealth-channel-enablement: intermediary briefing pack ready by 2026-08-12 (assigned)
  - broker-enablement: broker dyad briefing pack ready by 2026-08-12 (assigned)
  - events: private viewing series logistics + RSVP system (assigned)
  - compliance: full pre-event review of investor pack (mandatory)
human_approval_required:
  - Final wealth-channel briefing pack before distribution
  - All private viewing event invitation lists
  - PR pitches before send
```

## Decomposition into creative briefs

- `creative-brief-investor-pack.md`
- `creative-brief-wealth-channel-deck.md`
- `creative-brief-broker-dyad-deck.md`
- `creative-brief-pr-canal-thesis.md`
- `creative-brief-linkedin-thesis-post.md`
- `creative-brief-crm-referral-email.md`
