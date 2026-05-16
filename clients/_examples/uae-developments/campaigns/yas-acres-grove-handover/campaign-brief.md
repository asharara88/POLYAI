# Campaign brief — Yas Acres Grove — Handover & loyalty

> **Worked example — illustrative.** Fictional campaign brief; not real UAE Developments data.
>
> Owned by `crm-manager`. Conforms to `schemas/campaign-brief.md`.

```yaml
campaign_id: yas-acres-grove-handover
project_name: "Yas Acres Grove"
goal: Convert 2026 Yas Acres Grove handover cohort (411 units) into the UAE Developments loyalty programme; seed the 2027 referral pipeline
primary_kpi: Loyalty programme enrolment rate ≥ 65% of handover cohort by 2026-09-30
secondary_kpis:
  - Referral leads from existing-owner cohort (target 80 leads by 2026-12-31)
  - Net Promoter Score on handover survey ≥ 60
  - Service-recovery resolution within SLA on handover-snagging tickets ≥ 90%
audience:
  segment_a:
    name: 2026 Yas Acres Grove handover cohort (411 households)
    pains:
      - Snagging timeline anxiety
      - Service-charge transparency at handover
      - School-catchment readiness for September academic year
positioning:
  promise: |
    The way you experience handover is a preview of how we'll operate
    your home for the next thirty years.
offer:
  hook: White-glove handover concierge — every owner is paired with a single point of contact for 90 days
  call_to_action: Activate your handover concierge thread
  destination: uae-developments.example/owners/handover
channels:
  - channel: Direct CRM (handover cohort 1:1 outreach)
    weight: 0.45
    rationale: Highest-converting; consent already in place; named concierge per owner
  - channel: Owner events (community gardens reception, key-handover ceremonies)
    weight: 0.25
    rationale: Build community + referral seed; in-person matters at handover
  - channel: Service-recovery cycle (snagging resolution loop)
    weight: 0.15
    rationale: Loyalty enrolment correlates strongly with snagging-resolution speed
  - channel: Owner referral programme (structured incentive)
    weight: 0.10
    rationale: Highest-value lead source for 2027 launches
  - channel: WhatsApp owner channel (1:1, opt-in)
    weight: 0.05
    rationale: Already-trusted channel for cohort
timeline:
  start_date: 2026-04-01
  end_date: 2026-12-31
  milestones:
    - 2026-04-01: Handover concierge programme launch
    - 2026-05-15: First owner reception event (community gardens)
    - 2026-06-30: Mid-cohort NPS pulse
    - 2026-08-15: Loyalty enrolment milestone (50% target)
    - 2026-09-30: Loyalty enrolment milestone (65% target)
    - 2026-12-31: Referral leads milestone (80 leads)
budget:
  total: AED 14,500,000
  by_channel:
    crm_ops: 6500000
    events: 3625000
    service_recovery: 2175000
    referral_incentive: 1450000
    whatsapp_ops: 750000
constraints:
  must_include:
    - Named concierge per owner before first outreach
    - Service-charge year-1 figure on every owner-facing communication
    - Snagging-resolution-time commitment (5 business days response)
  must_avoid:
    - Generic "valued customer" templates
    - Any cross-sell language during handover window
  brand_voice_ref: clients/_examples/uae-developments/knowledge/brand-voice.md
  compliance_flags:
    - PDPL
    - GDPR
measurement_plan:
  attribution_model: Salesforce loyalty enrolment + referral attribution
  reporting_cadence: bi-weekly to chief-commercial-officer + monthly to crm-manager
dependencies:
  - email-lifecycle: handover sequence (5 touches over 60 days) ready by 2026-04-01 (assigned)
  - service-recovery-specialist: snagging-resolution playbook updated (assigned)
  - events: owner reception event series (4 events Apr–Aug) (assigned)
  - voc: monthly owner-cohort sentiment review (assigned)
human_approval_required:
  - Handover concierge assignment list before first outreach
  - Owner referral incentive structure (legal review)
  - Snagging-resolution playbook updates
```

## Decomposition into creative briefs

- `creative-brief-handover-concierge-welcome.md`
- `creative-brief-owner-reception-invitation.md`
- `creative-brief-snagging-resolution-comms.md`
- `creative-brief-loyalty-enrolment-flow.md`
- `creative-brief-referral-programme-launch.md`
