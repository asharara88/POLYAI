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

## Catalog

### P2 (active)

- `resale-with-noc.md` — Secondary-market resale flow: NOC issuance → AML/KYC pre-clearance on incoming buyer → RERA Form-F (Dubai) / ADREC equivalent (Abu Dhabi) → Trustee Account release → owner-record update
- `complaint-rera-exposure.md` — Customer complaint that names or threatens RERA Rental Dispute Centre filing
- `pep-sanctions-hit.md` — A counterparty surfaces as a PEP (any class) or as a sanctions-list match

### P3 (planned — see PLAN.md)

- `international-roadshow.md` — 14-day post-roadshow cadence in buyer's local time-zone with jurisdiction-specific Golden Visa messaging
- `inbound-hnw-private-bank.md` — Discreet inbound from private bank: KYC pre-clearance, principal-to-principal escalation
- `broker-onboarding-to-first-deal.md` — From signed broker agreement to first allocation approved
- `handover-snagging.md` — Owner experience during the snagging window; CSAT capture
- `quarterly-exec-brief.md` — Brief cadence + format + data sources for board / CMO / CFO
- `press-sensitive-uhnw-transaction.md` — Discretion-first; coordinates vvip-channel-enablement, content-pr-specialist, legal-liaison
- `trakheesi-permit.md` — Dubai advertising-permit application flow (referenced from `compliance` and `agency-liaison`)

## Authoring rules

1. **One owner.** Every runbook has a single accountable agent or human role.
2. **Compliance gates are explicit.** Don't assume the actor will route to compliance; the runbook tells them when.
3. **Hand-off SLAs.** Every hand-off has a target time. Without it, the runbook stalls invisibly.
4. **Out-of-scope is named.** Runbook drift is the most common failure mode; protect against it.
5. **Updates via `knowledge` agent + `chief-commercial-officer` approval.** Do not edit a runbook in flight; mark version + date.
6. **Multi-tenant.** Runbooks are vertical-level (UAE real-estate developer); per-client variations live in `clients/<slug>/runbooks/<scenario>-overrides.md`.
