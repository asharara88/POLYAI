# Creative brief

Emitted by `strategy` (or Orchestrator). Consumed by `creative` and `brand-design`.

```yaml
asset_id:
parent_campaign_id:
asset_type:            # "landing-page" | "email" | "ad-set" | "social-post" | "video-script" | etc.
audience:              # link to ICP segment
single_minded_message: # one sentence — the ONE thing this asset must communicate
emotional_response:    # what the audience should feel
rational_takeaway:     # what they should believe
call_to_action:
proof_points:          # rank-ordered, only top 3 will likely make it in
mandatories:           # legal/brand musts
constraints:
  word_count:
  format:
  brand_voice_ref:
  do: []
  dont: []
references:            # examples of what good looks like (and why)
  good: []
  bad: []
deliverables:          # exact list of variants, dimensions, lengths
deadline:
review_path:           # who reviews, in order
```
