# Deal record

The shared source of truth for any opportunity. Read and written by all sales-pod agents. Append-only `activity` log.

```yaml
deal_id:
account:
  name:
  domain:
  industry:
  size:                # employees / revenue band
  geo:
stakeholders:
  - name:
    role:
    persona:           # "champion" | "economic-buyer" | "user" | "blocker" | "technical-evaluator"
    sentiment:         # positive | neutral | negative | unknown
    last_touched:
source:                # "outbound" | "inbound" | "partner" | "expansion"
stage:                 # "prospect" | "qualified" | "discovery" | "evaluation" | "proposal" | "negotiation" | "closed-won" | "closed-lost"
qualification:
  framework:           # "MEDDIC" | "BANT" | "SPICED" — pick one and stick to it
  scores: {}
  notes:
pain:
  primary:
  cost_of_inaction:
  current_solution:
value:
  hypothesis:          # how much this is worth to them — be specific
  proof_required: []
process:
  decision_criteria: []
  decision_makers: []
  timeline:
  paper_process:
competition:           # who else they're considering
amount:
close_date:
next_step:
  what:
  who:
  when:
blockers: []
activity:              # append-only
  - timestamp:
    agent:             # which agent logged this
    type:              # "email" | "call" | "demo" | "note" | "stage-change"
    summary:
forecast_category:     # "commit" | "best-case" | "pipeline" | "omitted"
risk_flags: []
```
