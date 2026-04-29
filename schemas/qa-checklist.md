# QA checklist

Used by `review`. Every reviewable artifact must pass these gates before it ships.

```yaml
artifact_id:
artifact_type:
reviewed_by:           # "review" agent and any peer reviewers
brief_match:
  single_minded_message_present: bool
  cta_present_and_correct: bool
  audience_appropriate: bool
  proof_points_supported: bool
brand:
  voice_match: bool    # vs knowledge/brand-voice.md
  visual_match: bool
  forbidden_terms_absent: bool
quality:
  factual_accuracy_checked: bool
  links_work: bool
  no_typos: bool
  numbers_double_checked: bool
performance_hygiene:
  tracking_present: bool
  utm_correct: bool
  variant_tags_correct: bool
compliance_routed:     # was Compliance pinged when required?
  required: bool
  completed: bool
localization_routed:
  required: bool
  completed: bool
issues_found: []       # blocking issues
nits: []               # non-blocking
verdict:               # "ship" | "revise" | "block"
notes:
```
