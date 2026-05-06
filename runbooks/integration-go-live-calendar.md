# Runbook: Integration go-live — calendar (CCO-personal)

> Scenario: The CCO opts in to a personal-calendar OAuth read-only sync (Google Workspace or Microsoft 365) to feed `clients/<client>/cco/calendar.md` and the `/cco` daily surface. Calendar integration is *personal* — consent is non-negotiable, scope-limit is non-negotiable, redaction is non-negotiable. Distinct from Salesforce (company-system) or Sumsub (compliance-system).

## Trigger

CCO opts in (personal consent). May happen at engagement start or later. Re-consent on every credential refresh; auto-revoke on CCO-departure or credential loss.

## Owner

`chief-commercial-officer` (the CCO themselves) charters consent; named human MarTech lead owns OAuth implementation; `legal-liaison` validates PDPL + corridor data-protection (calendar contains personal data); `martech-ops-specialist` (when added) owns runtime.

## Pre-flight

- CCO consents in writing per `legal-liaison` template
- Scope-limit defined: read-only; calendar of named work email only; redact private events; redact calendar entries marked "Private"
- Token storage in Vercel env (encrypted; per-CCO; rotates per OAuth refresh)
- Per-client config at `clients/<slug>/integrations/calendar/config.md` (CCO email, calendar IDs in scope, default redaction rules)
- Auto-revoke trigger defined: CCO-departure (per `runbooks/key-rm-departure.md` Phase-1 step 3); credential rotation; CCO opt-out at any time

## Sequence

### Phase 1: Consent + setup

| Step | Who | What |
|---|---|---|
| 1 | CCO + `legal-liaison` | Consent written + signed; scope-limit + redaction-rules acknowledged |
| 2 | Named human MarTech lead | OAuth flow implementation; sandbox first |
| 3 | `legal-liaison` | PDPL + GDPR-equivalent posture verified for the CCO's home jurisdiction |
| 4 | Named human MarTech lead | Sandbox OAuth tested with CCO's test calendar; redaction rules tested (private events excluded) |

### Phase 2: Production go-live

| Step | Who | What |
|---|---|---|
| 5 | `chief-commercial-officer` (decision-ask) | Approve production go-live with own consent attached | 
| 6 | Named human MarTech lead | OAuth credentials provisioned + token stored encrypted |
| 7 | Daily scheduled job | Pull next-30-day calendar; apply redaction; emit to `clients/<client>/cco/calendar.md` (auto-update) |
| 8 | `cco-morning-brief` | Reads calendar.md for "Today's calendar" section |

### Phase 3: Continuous operation

| Step | Who | What | Cadence |
|---|---|---|---|
| 9 | Daily scheduled job | Refresh calendar; apply redaction; update calendar.md | Daily 05:30 |
| 10 | OAuth token refresh | Per provider cadence (typically every 60 days for Google, similar Microsoft) | Per provider |
| 11 | CCO | Opt-out at any time → token revocation → calendar.md reverts to manually-maintained or removed | On demand |

## Compliance gates

1. **Personal consent** — non-negotiable; written + signed; renewed per credential cycle
2. **Read-only** — never write to CCO calendar
3. **Scope-limit** — only the named work email; never personal-life calendars
4. **Redaction** — events marked "Private" excluded; counterparty PII in event titles redacted unless directly engagement-relevant
5. **Auto-revoke on CCO-departure** — per `runbooks/key-rm-departure.md` Phase 1 step 3 trigger
6. **PDPL** — calendar data per retention rules; not shared beyond named team
7. **Cross-jurisdiction** — if CCO is in a GDPR jurisdiction, additional posture per `legal-liaison`

## Rollback path

Phase 1 (sandbox) → no production exposure.
Phase 2 (production) → CCO opts out at any time → token revoked, calendar.md reverts.
Phase 3 (continuous) → token corruption / OAuth failure → daily job degrades gracefully (uses last-good calendar.md with "stale" flag); CCO can re-authenticate at convenience.

## Out-of-scope

- Calendar write (creating events on CCO's calendar) — never; integration is read-only
- Other-team-member calendars — separate per-person consent if surfaces
- Meeting-room booking integration — separate
- Travel + flight + hotel integration — separate

## KPIs

- Consent-fresh rate (target: 100% — never read with stale consent)
- Redaction accuracy (target: 100% on Private-marked events; sample-audited monthly)
- Daily refresh success rate (target: ≥ 98%)
- Auto-revoke timeliness on CCO-departure (target: same business day as departure)
- Privacy incidents (target: 0)

## Related runbooks

- `runbooks/cco-daily-brief.md` — primary consumer
- `runbooks/key-rm-departure.md` — auto-revoke trigger if CCO departs
- `runbooks/risk-register-update.md` — integration-runtime risk if applicable

## Sign-off

CCO personal consent + `chief-commercial-officer` decision-memo + `legal-liaison` PDPL posture verification.
