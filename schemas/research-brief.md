# Research brief

Two shapes: the **request** sent to `research`, and the **report** it returns.

## Request (Orchestrator → Research)

```yaml
research_id:
question:              # one specific question, not a topic
why_it_matters:        # the decision this will inform
scope:
  segments: []
  geographies: []
  time_window:
sources_preferred: []  # e.g. ["customer-interviews", "G2", "10-K filings"]
sources_off_limits: [] # e.g. ["competitor-internal", "scraped-PII"]
output_format:         # "snapshot" | "deep-dive" | "trend-radar"
deadline:
```

## Report (Research → requester)

```yaml
research_id:
headline:              # the one-line answer
confidence:            # low | medium | high — and why
key_findings:          # 3-7 bullets, each with a source
  - finding:
    evidence:
    source:
    confidence:
audience_insights:
  segment:
  pains: []
  jobs_to_be_done: []
  language_used: []    # actual phrases customers say
market_context:
  size:
  growth:
  trends: []
  disruptors: []
implications:          # what this means for strategy
open_questions: []     # things we still don't know
sources: []            # full citation list
```
