# Runbooks

Runbooks are the off-the-shelf, multi-agent playbooks the team pulls when a recurring scenario fires. Each runbook is a deterministic sequence: trigger → owner → step-by-step sequence with named hand-offs → compliance gates → KPIs.

A runbook is **not** a campaign brief (which is per-campaign and lives in `clients/<slug>/campaigns/`); it is **not** an agent prompt (which describes a role); it is the **flow** — the choreography across multiple agents and humans for a known scenario.

## Why runbooks

In a multi-agent / multi-human team, the failure mode is not "the agent didn't know what to do" — it's "agent A and agent B both did something, didn't coordinate, and the customer / regulator / broker saw the seams." Runbooks are the choreography that prevents that.

When a scenario has fired three times in a quarter and the resolution is recognizable, write a runbook. That converts ad-hoc resolution (which depends on whoever is on duty) into reliable resolution (which doesn't).

## Runbook shape

Each runbook lives at `runbooks/<scenario-slug>.md` and follows this template:

```markdown
# Runbook: <scenario name>

## Trigger

Specifically: what event makes this runbook the right tool? (e.g., "Buyer threatens RERA Rental Dispute Centre filing")

## Owner

Single agent or named human accountable for end-to-end execution of this runbook. (Not "everyone" — one owner.)

## Pre-flight

- Records that must be open / accessible
- Compliance flags that must be checked
- Authorizations needed before initiation

## Sequence

Numbered steps. Each step:
- WHO acts (agent or human role)
- WHAT they do
- WHAT they emit (artifact, message, integration-action)
- WHO they hand off to next
- TIMING (target SLA — hours/days)

## Hand-offs

Named transitions between agents/humans. Failure modes per hand-off (what happens if the receiver doesn't acknowledge in time).

## Compliance gates

Specific points where compliance / aml-kyc / regulatory-research-specialist sign-off is mandatory before the next step.

## Out-of-scope (so the owner doesn't drift)

What this runbook does NOT cover.

## KPIs

What "success" looks like quantitatively.

## Close-out + learning

How the case file closes, what feeds back into knowledge / results / playbook updates.

## Related runbooks

When to switch to a different runbook mid-flight.
```

## Where runbooks live

- `runbooks/` (root) — **core runbooks** that apply to any client regardless of industry pack: daily cadence, board / quarterly / annual prep, risk register, strategic-bet evaluation, integration go-lives that aren't pack-specific, key-RM continuity.
- `verticals/real-estate-uae/runbooks/` — **real-estate-uae pack runbooks**: regulatory + counterparty crisis paths (RERA, Trakheesi, NOC resale, PEP/sanctions), construction + handover operations, broker / wealth / VVIP channel scenarios, and integration go-lives that depend on UAE-specific tooling (Sumsub).

A pack runbook is only available when the client has that pack active in their `client-profile.md`. A core runbook is available to every client.

## Catalog — core (any pack)

### CCO daily + cadenced reporting

- `cco-daily-brief.md` — Daily 06:00 → 07:00 morning-brief synthesis choreography
- `horizon-scan-daily.md` — Daily 06:00 horizon-scan for `cco-morning-brief`
- `risk-register-update.md` — Risk-register receive / age / escalate / close cycle
- `monthly-board-prep.md` — Monthly board-prep brief (lighter than quarterly)
- `quarterly-exec-brief.md` — Quarterly board / CMO / CFO brief cadence
- `annual-commercial-plan.md` — Annual planning cycle (Q4 → Q1)

### Strategic-bet evaluation

- `strategic-bet-evaluation.md` — Structured evaluation for new launch / partnership / corridor / M&A / structural channel investment

### Workforce continuity

- `key-rm-departure.md` — Key Relationship Manager / pod-manager departure with portfolio + relationship continuity

### Integration go-live (cross-industry)

- `integration-go-live-salesforce.md` — Salesforce wiring per `integrations/salesforce/spec.md`
- `integration-go-live-calendar.md` — CCO-personal calendar OAuth (Google / Microsoft 365)
- `integration-go-live-news-scan.md` — Daily news + regulator + sanctions feed ingestion for `horizon-scanner`

## Catalog — real-estate-uae pack

See `verticals/real-estate-uae/runbooks/README.md` for the full pack-runbook catalog. Summary:

- **Regulatory + counterparty crisis:** `resale-with-noc`, `complaint-rera-exposure`, `pep-sanctions-hit`, `regulator-inquiry-non-complaint`
- **Operational crisis:** `construction-delay-handover-slip`, `tier-1-broker-collapse`, `project-safety-press-crisis`
- **Customer + channel lifecycle:** `international-roadshow`, `inbound-hnw-private-bank`, `broker-onboarding-to-first-deal`, `handover-snagging`, `press-sensitive-uhnw-transaction`
- **Regulatory operations:** `trakheesi-permit`
- **Integration go-live (pack-specific):** `integration-go-live-sumsub`

## Authoring rules

1. **One owner.** Every runbook has a single accountable agent or human role.
2. **Compliance gates are explicit.** Don't assume the actor will route to compliance; the runbook tells them when.
3. **Hand-off SLAs.** Every hand-off has a target time. Without it, the runbook stalls invisibly.
4. **Out-of-scope is named.** Runbook drift is the most common failure mode; protect against it.
5. **Updates via `knowledge` agent + `chief-commercial-officer` approval.** Do not edit a runbook in flight; mark version + date.
6. **Multi-tenant.** Core runbooks (in this directory) are vertical-agnostic; pack runbooks (under `verticals/<pack>/runbooks/`) inherit when the client has that pack active. Per-client variations live in `clients/<slug>/runbooks/<scenario>-overrides.md`.
