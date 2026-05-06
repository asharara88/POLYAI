# Runbook: Integration go-live — Salesforce

> Scenario: A per-client engagement is ready to wire the Salesforce integration from spec-only (per `integrations/salesforce/spec.md`) to live operational. This runbook is the gate: pre-conditions, sandbox testing, per-client opt-in, rollback path. Wiring is **never bulk** — per-client per per-action.

## Trigger

Per-engagement greenlight to wire Salesforce read or write actions.

## Owner

`chief-commercial-officer` charters and sign-off; `data-quality-steward` owns CRM-side integrity; `martech-ops-specialist` (when added) or named human MarTech lead owns runtime; `legal-liaison` validates audit-retention; `compliance` validates PDPL handling.

## Pre-flight

- `integrations/salesforce/spec.md` reviewed against per-client Salesforce org configuration
- `integrations/salesforce/schema-mapping.md` reviewed; per-client custom-field API names captured in `clients/<slug>/integrations/salesforce/config.md`
- Sandbox org provisioned + access confirmed
- Connected App credentials in Vercel env vars (sandbox + production separate)
- `clients/<slug>/integrations/salesforce/config.md` populated (org-id, record-types, custom-fields, stage-definitions, default-owner-routing, approval-promotions per `spec.md` shape)
- Per-action approval-promotion decisions made per `clients/<slug>/client-profile.md` `approval_gates`

## Sequence

### Phase 1: Sandbox (1-2 weeks)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 1 | `data-quality-steward` | Sandbox-org schema audit: custom fields present, record types correct, validation rules compatible | Schema audit | 2 business days |
| 2 | Named human MarTech lead | Read-only smoke test: pull 100-record sample via REST against schema-mapping | Test log | 1 business day |
| 3 | `data-quality-steward` | Compare repo-mirror to sandbox: divergence < 1% expected on read-only baseline | Divergence report | 1 business day |
| 4 | Named human MarTech lead | Activity-log action smoke test (per `integrations/salesforce/actions/activity-log.md`): one synthetic Task created, audit-trail recorded | Test log | 1 business day |
| 5 | Named human MarTech lead | Stage-advance action smoke test (per `integrations/salesforce/actions/stage-advance.md`): one synthetic Opportunity advanced through stages with all preconditions; rollback simulation | Test log | 2 business days |
| 6 | `data-quality-steward` | Bulk-edit safety check: simulate 50-record bulk operation; confirm Tier-B explicit-approval enforcement holds | Safety verdict | 1 business day |

### Phase 2: Production go-live (gated on Phase 1 pass)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 7 | `chief-commercial-officer` (decision-ask) | Approve production go-live; confirm rollback contact + SLA | Decision memo via `decision-router` | per CCO calendar |
| 8 | Named human MarTech lead | Production credentials verified; production Connected App authorized | Authorization log | 1 business day |
| 9 | `data-quality-steward` | Production read-only sync activated; daily divergence audit per `integrations/salesforce/spec.md` Failure modes section | Daily audit cadence | continuous |
| 10 | Named human MarTech lead | Activity-log action production go-live (Tier-B explicit-approval first 30 days; promotion eligible per per-client `approval_gates`) | Live | 30-day learning window |
| 11 | Named human MarTech lead | Stage-advance action production go-live (Tier-B always — never auto-Tier-C per spec rule) | Live | continuous |
| 12 | `chief-commercial-officer` | Per-client `approval_gates.salesforce_activity_log: tier-c` promotion decision after 30-day clean window per agent-prompt promotion criteria | Promotion decision | T+30 |

### Phase 3: Continuous operation

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 13 | `data-quality-steward` | Daily integrity audit; flag divergence; flag bulk-export attempts; flag delete attempts | Daily audit | continuous |
| 14 | Named human MarTech lead | Monthly capacity check (API limits, Bulk API quota); per-month-end load review | Monthly health | monthly |
| 15 | `chief-commercial-officer` | Quarterly review: any go-live extensions to additional actions (lead-conversion, opportunity-create, contact-create) | Quarterly review | quarterly |

## Compliance gates

1. **Stage-advance never auto-promotes past Tier-B** — non-negotiable per `integrations/salesforce/actions/stage-advance.md` rule
2. **Bulk operations always Tier-B explicit** — never C
3. **Delete operations Tier-D autonomous prohibited** — always human + sales-manager + crm-manager joint approval
4. **VVIP-flagged Accounts** restricted-access via Salesforce sharing rule per `integrations/salesforce/schema-mapping.md`
5. **AML/KYC field currency** — Tier-B precondition on stage-advance to proposal-sent and beyond
6. **PDPL** — bulk-export prohibited; per-record reads with audit trail
7. **Audit-retention** — all integration actions persist per `audit.retention_days` in envelope; minimum per applicable regulator retention requirement
8. **Org-mismatch protection** — every action carries `salesforce_org_id` precondition; mismatched action moves to `cancelled`

## Rollback path

Phase 1 (sandbox-only) → no production exposure; rollback is "stop running tests."
Phase 2 (production go-live) → revert per-action approval-tier to fully-manual; halt action-emission from agents; investigate; re-test in sandbox; re-go-live with fixes.
Phase 3 (continuous) → if material divergence, integrity issue, or trust-loss event surfaces, halt action-emission; revert per-client `salesforce_*` `approval_gates` promotions; investigate; re-go-live from Phase 2.

## Out-of-scope

- Salesforce admin operations (validation rules, page layouts, permission sets) — Salesforce admin team
- Salesforce-side AI / Einstein features — separate
- Marketing-automation integration (Pardot / Marketing Cloud) — separate per-system spec when needed
- Finance-system integration on revenue-recognition — separate per-system spec

## KPIs

- Phase 1 sandbox pass rate on first attempt (target: ≥ 80%)
- Phase 2 production go-live latency from sandbox-pass (target: ≤ 2 weeks)
- Daily divergence rate (target: < 1%)
- API limit utilization (target: < 80% peak)
- Tier-promotion-to-Tier-C achievement (target: per agent-prompt criteria)
- Rollback incidents (target: 0; if any, full postmortem)

## Related runbooks

- `runbooks/cco-daily-brief.md` — surfaces integration health in daily brief
- `runbooks/risk-register-update.md` — integration-runtime risks tracked
- `integrations/salesforce/spec.md` + `integrations/salesforce/schema-mapping.md` + per-action specs

## Sign-off

Production go-live requires `chief-commercial-officer` approval per Phase 2 decision-memo. Per-action Tier-C promotions require continued `chief-commercial-officer` approval per `approval_gates` workflow.
