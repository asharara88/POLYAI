# RSVP log — &lt;event title&gt;

> Owned by `events`. Append-only structured record of every RSVP-related touch and response. Refresh nightly until cutoff; lock at headcount-lock (T-1w).

## Comms touches

| Touch | Sent | Channel | Recipients | Open / read where measurable |
|---|---|---|---|---|
| Save-the-date | YYYY-MM-DD | email + WhatsApp | <count> | <pct> |
| Formal invitation | YYYY-MM-DD | email + courier (tier-1) | <count> | <pct> |
| RSVP nudge 1 | YYYY-MM-DD | email | <pending count> | <pct> |
| RSVP nudge 2 (final) | YYYY-MM-DD | 1:1 personal | <pending count> | n/a |
| Pre-event details | YYYY-MM-DD | email | <yes count> | <pct> |
| Day-of reminder | YYYY-MM-DD | WhatsApp + SMS | <yes count> | <pct> |

## Response log (append-only)

```yaml
- timestamp: YYYY-MM-DDTHH:MM
  attendee: "<anonymized id or invitation slot>"
  cohort: <cohort label, e.g. tier-1-broker | prior-tower-owner | wealth-channel | vvip>
  response: <yes | no | pending | tentative | maybe | declined-with-reason>
  +1: <int — additional guests claimed>
  notes: "<dietary, mobility, language, role, etc.>"
  source: <email-form | direct-reply | phone | in-person | gatekeeper>
```

## Aging — RSVPs still pending

(populated automatically; flag any pending past cutoff; require human follow-up)

| Cohort | Pending | Days past cutoff | Action |
|---|---|---|---|

## Special accommodations summary

- Dietary: <count> (vegetarian, vegan, halal, allergen)
- Mobility: <count>
- Language preference: <breakdown by language>
- Other: <any flagged items>

## Anti-double-invitation check

(if a prospect was invited twice across events in the same window, flag here; coordinate with sales-operations)

## Cutoff and lock

- RSVP cutoff: T-Nw (date)
- Headcount lock: T-1w (date)
- Post-lock additions / cancellations log:

```yaml
- timestamp:
  attendee:
  change: <added | cancelled>
  approved_by:
  reason:
```
