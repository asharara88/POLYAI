# Decision memo

The canonical shape of a CCO-bound decision-ask. Every agent that needs human approval emits a decision-memo; `decision-router` validates, classifies, and routes per `approval_gates`. The memo lives in the queue at `clients/<client>/cco/decision-asks/<YYYY-MM-DD>/queue.md` and surfaces on `/cco` and in the next morning brief.

## Schema

```yaml
id:                      # DA-YYYY-MM-DD-NNN (assigned by decision-router on receipt)
client:                  # client slug (mandatory)
submitted_at:            # ISO timestamp from emitting agent
submitter:               # emitting agent name
class:                   # marketing-operational | compliance-operational |
                         #   channel-relationship | governance | commercial-deal-desk |
                         #   channel-development-spend | roadshow-commitment |
                         #   aml-kyc-edd-elevation | vvip-relationship-activation |
                         #   marketing-budget-reallocation | deal-above-threshold
urgency:                 # immediate | within 48h | within 5 business days | standard
counterparty_tier:       # standard | vvip-touching | strategic
ask:                     # one-sentence question that needs a yes/no/modified answer
recommendation:          # what the emitting agent recommends + brief rationale
evidence:                # list of pointers to source artifacts (paths in repo)
alternatives_considered: # 1-3 alternatives the emitting agent ruled out + why
sla:                     # decision required by <date + time>
approval:
  policy:                # per-client approval_gates resolved value
  required_role:         # CCO | sales-manager | wealth-vvip-manager | etc.
  approver:              # populated when signed
  signed_at:             # ISO timestamp when signed
  decision:              # approve | approve-with-modifications | decline | send-back
  comment:               # human's reasoning (visible in audit trail)
status:                  # pending | escalated | signed | sent-back | superseded
audit:
  routed_at:             # ISO timestamp when decision-router queued
  routed_to:             # approver role
  sla_breach_at:         # ISO timestamp if breach occurred
  escalated_at:          # ISO timestamp if escalated
  superseded_by:         # decision-ask id, if applicable
references:
  decision_memo_path:    # clients/<client>/cco/decision-asks/<date>/queue.md#<id>
  source_artifacts: []   # paths to evidence
  related_decisions: []  # prior decision-ask ids that informed this
  related_runbooks: []   # runbook paths if a runbook fired this decision
```

## Lifecycle

```
agent → emits decision-memo with status=draft
     → decision-router validates completeness
     → status=pending; routed_at set; queued in clients/<client>/cco/decision-asks/<date>/queue.md
     → approver notified (restricted-channel for VVIP-touching)
     → approver signs (file mutation today; API in Phase 5B-2)
     → status=signed; signed_at + decision + comment recorded
     → audit-trail entry persisted
     → moved from "Pending" to "Recently signed" table
     → if SLA breached: status=escalated; sla_breach_at + escalated_at recorded; next-level approver notified
     → if sent back: status=sent-back; emitting agent notified for revision; new memo emitted on resubmit
```

## Rules

1. **One owner per memo.** Single approver per `approval_gates` resolution; second-level only on escalation.
2. **No silent supersedes.** A new memo that supersedes a prior one carries `superseded_by`; both stay in audit trail.
3. **Immutability post-sign.** Signed memos are append-only in the audit trail; corrections via new memo with reference.
4. **VVIP-touching memos** are restricted-access; queue surface shows aggregated indicator on general `/cco`; full content visible only to named team.
5. **Evidence is mandatory.** No memo queued without at least one evidence pointer.
6. **Recommendation is mandatory.** No memo queued without an emitting-agent recommendation; "approver decides without input" is a routing failure.
7. **SLA is mandatory.** No memo queued without a target sign-by date.

## Where memos live

- Queue (live): `clients/<client>/cco/decision-asks/<YYYY-MM-DD>/queue.md`
- Per-memo audit trail (persistent): the queue file's audit-table entry + the memo's evidence pointers; the queue file persists for the day; a roll-forward archive runs at `clients/<client>/cco/decision-asks/<YYYY-MM>/archive.md` (rolled monthly)
- Restricted-access for VVIP-touching memos: same path with the queue file flagged restricted-access at the file system level

## Cross-references

- `schemas/integration-action.md` — when an integration action requires CCO approval, it carries `decision_memo_ref` pointing to the memo that authorized it
- `schemas/handoff-envelope.md` — every cross-pod handoff that requires CCO sign-off references a decision memo
- `runbooks/risk-register-update.md` — risk-register-curator emits decision memos for closure proposals
- `runbooks/quarterly-exec-brief.md` — board-prep section sign-off uses a decision memo
- `runbooks/cco-daily-brief.md` — the brief surfaces today's pending memos
