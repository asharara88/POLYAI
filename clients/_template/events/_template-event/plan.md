# Event plan — &lt;event title&gt;

```yaml
event_id: <slug>
campaign: <campaign-slug-or-null>
type: <pre-launch-private-preview | public-launch-day | tier1-broker-private | tier2-3-broker-group | wealth-channel-preview | vvip-attended-opening | owner-loyalty | industry | internal-partner>
phase: <T-12-weeks | T-8-weeks | T-4-weeks | T-2-weeks | T-1-week | T0 | T+5d | T+30d | post>
status: <planning | in-flight | ready | done | cancelled>
date: YYYY-MM-DD
venue: <location>
audience: <one-line audience description>
headcount:
  capacity: <int or "open">
  invited: <int or "n/a (public)">
  rsvp_yes: <int>
  rsvp_no: <int>
  rsvp_pending: <int>
  expected_show: <int>
  actual: <int or null pre-event>
budget:
  planned_aed: <int>
  committed_aed: <int>
  actual_aed: <int or null pre-event>
  remaining_aed: <int or null>
vendors:
  catering: "<vendor + status>"
  av_production: "<vendor + status>"
  photography: "<vendor + status>"
  # add per event type
partners:
  hospitality_operator: <confirmed-attending | not-attending | n/a>
  named_architect: <confirmed-attending | not-attending | n/a>
risks:
  - "<risk + mitigation summary>"
approvals_required:
  - <approval item + status>
```

## Run-of-show summary

(2–6 bullet points; full minute-by-minute lives in `run-of-show.md`)

## Communications calendar

- Save-the-date: T-Nw
- Formal invitation: T-Nw
- RSVP cutoff: T-Nw
- Pre-event details: T-1w
- Day-of reminder: T-1d
- Thank-you: T+1d
- Debrief: T+5d
