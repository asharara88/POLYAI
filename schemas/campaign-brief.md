# Campaign brief

Emitted by `strategy`. Consumed by `creative`, `brand-design`, `seo`, `social-media`, `email-lifecycle`, `analytics`.

```yaml
campaign_id:           # short slug, e.g. "q3-launch-analytics"
goal:                  # single sentence, business outcome
primary_kpi:           # one number that defines success
secondary_kpis: []     # supporting metrics
audience:
  segment:             # ICP slice — link to knowledge/icp.md entry
  pains: []
  current_alternatives: []
positioning:
  promise:             # one sentence the audience should believe after exposure
  proof_points: []
  anti_positioning:    # what we are deliberately NOT
offer:
  hook:
  call_to_action:
  destination:         # landing page, demo form, etc.
channels:              # ranked, with budget split
  - channel:
    weight:            # 0-1
    rationale:
timeline:
  start_date:
  end_date:
  milestones: []
budget:
  total:
  by_channel: {}
constraints:
  must_include: []
  must_avoid: []
  brand_voice_ref:     # path in knowledge/brand-voice.md
  compliance_flags: [] # e.g. ["health-claim", "financial-promo", "GDPR"]
measurement_plan:
  attribution_model:
  test_design:         # A/B variants, holdouts
  reporting_cadence:
dependencies: []       # other briefs/agents this depends on
human_approval_required: # list of actions requiring sign-off
```
