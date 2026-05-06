# Runbook: Press-sensitive UHNW transaction

> Scenario: A UHNW transaction is in flight (active opportunity through closed-won) where the buyer or seller is press-sensitive — they are public figures, they are royal-family or VVIP-tier, they are foreign principals whose activity in the UAE is itself press-noteworthy, or they are subjects of ongoing media interest for unrelated reasons. The transaction must complete with discretion intact, with no avoidable press surface, and without compromising AML/KYC, regulatory, or commercial obligations. The cost of mishandling is not just embarrassment — for some principals it is relationship-ending or, in extreme cases, security-affecting.

## Trigger

Any of:
- An incoming-buyer's press-sensitivity flag is raised at intake (typically by `wealth-channel-enablement`, `vvip-channel-enablement`, or the named senior RM)
- An existing-owner's press-sensitivity status changes mid-relationship (becomes a public figure; subject of unrelated press; VVIP-adjacency newly identified)
- A seller in a resale transaction is press-sensitive (per `runbooks/resale-with-noc.md` adjacency)
- A press inquiry surfaces referencing a transaction in flight or recently closed

## Owner

`wealth-vvip-manager` charters and oversees. `vvip-channel-enablement` runs discretion mechanics. `vip-relationship-manager` runs principal-experience. `legal-liaison` runs the legal layer (NDA, bespoke confidentiality, no-comment defense). `content-pr-specialist` manages press posture (active defense if needed). `aml-kyc-compliance-specialist` runs principal screening with discretion-tightened access. `account-executive` (with VVIP-channel experience) runs commercial. `chief-commercial-officer` is informed continuously.

## Pre-flight

- Press-sensitivity classification per principal documented in restricted-access case file
- VVIP no-mention list current per `clients/<client>/vvip-channel/no-mention-list.md`
- Bespoke-confidentiality NDA template ready per `legal-liaison`
- Restricted-access folder structure for the case prepared
- Salesforce restricted-access sharing rule confirmed for the principal's Account record
- `content-pr-specialist` available with no-comment-defense template per outlet tier
- All prior press coverage of principal (if any) catalogued for context

## Sequence

| Phase | Who | What | Emits |
|---|---|---|---|
| **Activation** | `wealth-vvip-manager` | Open press-sensitive-transaction case file at `clients/<client>/vvip-channel/transactions/<case-id>/` (restricted-access — named team only) | Case file open |
| | `wealth-vvip-manager` | Brief named team only — `vvip-channel-enablement`, `vip-relationship-manager`, `legal-liaison`, `aml-kyc-compliance-specialist`, `account-executive`, `content-pr-specialist`, `chief-commercial-officer`. No general-team awareness. | Restricted-access briefing |
| | `vvip-channel-enablement` | Cross-reference principal against no-mention list + protocol register per `.claude/skills/vvip-protocol-uae.md` | No-mention update if needed; protocol register confirmation |
| **Compliance** | `aml-kyc-compliance-specialist` | Initiate screening with discretion-tightened access (case-restricted Sumsub level; minimal team access on verdict); EDD per PEP class | Screening per `runbooks/pep-sanctions-hit.md` if RED outcomes |
| | `legal-liaison` | Bespoke-confidentiality NDA prepared per principal preferences (jurisdiction, duration, scope, breach remedies) | NDA ready for execution |
| **Commercial** | `account-executive` (VVIP-channel-experienced) | Commercial conversation conducted via principal's preferred channel (gatekeeper-mediated where applicable per `.claude/skills/vvip-protocol-uae.md`) | Commercial activity logged in restricted-access manner |
| | `deal-desk-analyst` (if non-standard terms) | Bespoke commercial structure analysis per `deal-desk-analyst` SOP — restricted-access memo | Restricted-access deal-desk memo |
| | `account-executive` + `wealth-vvip-manager` | Closing coordination — discretion-aware scheduling, signing logistics (gatekeeper-mediated where applicable) | Closing artifacts in restricted-access folder |
| **Concierge** | `vip-relationship-manager` | Principal-experience touchpoints throughout — coordinated with gatekeeper per protocol register | Concierge case files (restricted) |
| **Press posture** | `content-pr-specialist` (continuous) | Monitor outlet activity referencing principal or transaction; prepare no-comment defense if surfaced | No-comment template per outlet tier; monitoring log |
| | `content-pr-specialist` (if press surfaces) | No-comment defense activated; coordinate with `legal-liaison` on any required statement | Activation log |
| **Closing + post-close** | `account-executive` + `marketing-financial-manager` | Closing recorded with VVIP-flag enforced; commission accrual for any introducer (per agreement, with restricted disbursement-detail access) | Stage advance per `integrations/salesforce/actions/stage-advance.md` with VVIP flag |
| | `account-manager` (where post-handover applicable) | Owner onboarding via restricted channel; post-handover services coordinated with `vip-relationship-manager` | Owner onboarding (restricted) |
| | `wealth-vvip-manager` | Closing-debrief — what worked, what to refine, lessons for next press-sensitive case | Debrief in case file |
| **Press monitoring (post-close)** | `content-pr-specialist` | Continuing monitoring per principal's risk-profile (typically 6-12 months post-close, longer for some principals) | Continuing monitoring log |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `wealth-vvip-manager` → named team (briefing) | Case open | Restricted-channel briefing within 24h; if any named team member unavailable, escalate to alternate per `wealth-vvip-manager` matrix |
| `wealth-vvip-manager` → `chief-commercial-officer` | Case open | Continuous awareness; never silent on press-sensitive cases |
| `aml-kyc-compliance-specialist` → `legal-liaison` (RED) | Sanctions / PEP issue | Switch to `runbooks/pep-sanctions-hit.md` with discretion overlay; do not signal counterparty |
| `account-executive` → `deal-desk-analyst` (non-standard) | Bespoke terms requested | Per `deal-desk-analyst` SOP; memo restricted-access |
| `content-pr-specialist` → `legal-liaison` (press surface) | Any media reference | Immediate; legal-mediated response posture |
| `content-pr-specialist` → `chief-commercial-officer` (press escalation) | Tier-1 outlet inquiry | Immediate; no-comment defense activated; CCO informs executive committee |

## Compliance gates

1. **Restricted-access enforced** — case files, Salesforce records, internal communications all restricted to named team. Discretion is the contract.
2. **No general-team visibility** — even agents would not be aware of case existence outside the named team. The runbook itself is referenced; specifics are not.
3. **No press reference, ever** — principal name, transaction detail, unit identification, floor reference, value reference all blocked from any general communication, internal newsletter, marketing case study, awards submission, social post, byline. The no-mention list is non-negotiable.
4. **Bespoke-confidentiality NDA in force** — extended-duration, broad-scope NDAs typical; signed by all developer-side personnel involved in the case.
5. **No-tipping-off on AML adjacency** — discretion intact on any AML matter; switch to `runbooks/pep-sanctions-hit.md` silently.
6. **No comment is the default press posture** — any active statement requires `legal-liaison` + `chief-commercial-officer` sign-off + (where reputational risk material) executive-committee approval.
7. **Vienna Convention adjacency** — for foreign-VVIP cases, route any unusual transaction-structure question to `legal-liaison` for diplomatic-immunity context.
8. **No photographs / video** of principal or transaction artifacts in any developer-side capture, including handover, signing, viewing — unless principal's protocol office explicitly clears.
9. **Briefing-pack discipline** — every developer-side individual involved in the case carries a current briefing pack covering title-usage, family-composition, off-limits topics, escalation contact.

## Out-of-scope

- Routine UHNW transactions where principal is not press-sensitive — that's `runbooks/inbound-hnw-private-bank.md` standard
- General PR strategy (not transaction-specific) — that's `content-pr-specialist` standard
- Concierge that is not transaction-coordinated — that's `vip-relationship-manager` standard ongoing relationship
- Long-term reputation defense post-transaction — that's `content-pr-specialist` standard ongoing monitoring
- Litigation if a press inquiry triggers legal action — that's `legal-liaison` + external counsel; this runbook ends at press posture

## KPIs

- Restricted-access integrity (target: 0 unauthorized accesses over case lifecycle — non-negotiable)
- Press surface incidents (target: 0 — any incident is a major learning event)
- Discretion-incident rate (target: 0 — any leak is investigation-grade)
- NDA compliance (target: 100% of involved personnel signed before access)
- Principal-stated satisfaction (qualitative; surveyed via gatekeeper post-close)
- Transaction completion within standard SLA (despite the discretion overhead — measure that the discretion process did not materially extend the timeline)
- Post-close press-monitoring duration adhered (per principal's risk profile)

## Close-out + learning

- Case file remains restricted-access at `clients/<client>/vvip-channel/transactions/closed/<year>/<case-id>/`
- Aggregated learnings (no per-case detail) feed `.claude/skills/vvip-protocol-uae.md` updates via `knowledge`
- Pattern-level reporting (e.g., a particular outlet's pattern of press inquiry on UHNW transactions) feeds `content-pr-specialist` ongoing posture
- Material learnings (e.g., a process change in protocol coordination, a new corridor with discretion-sensitive principals) routed via `knowledge` for `wealth-vvip-manager` and `vvip-channel-enablement` SOPs

## Related runbooks

- Switch to `pep-sanctions-hit.md` if AML/KYC RED — discretion overlay applies
- Coordinate with `inbound-hnw-private-bank.md` if principal arrived via wealth-channel introduction — this runbook overlays the press-sensitive layer
- Coordinate with `resale-with-noc.md` if seller is press-sensitive in a resale transaction
- Coordinate with `complaint-rera-exposure.md` (with discretion overlay) if a press-sensitive principal complains
