# Runbook: Regulator inquiry (non-complaint)

> Scenario: DLD / RERA / ADREC / DMT / ADGM-FSRA / DIFC-DFSA / CBUAE / UAE FIU opens an inquiry, audit, or thematic review where there is **no underlying buyer complaint**. The inquiry may be routine (annual review), thematic (sector-wide concern), targeted (enforcement-adjacent), or strategic (consultation participation). Distinct from `runbooks/complaint-rera-exposure.md`, which handles buyer-complaint-driven regulator exposure.

## Trigger

Any of:
- Regulator written communication received (letter, email, formal inquiry)
- Regulator-initiated meeting request
- Regulator-published thematic-review notice that names the developer or developer's project class
- Audit notification (annual or special)
- Consultation-paper response window opens
- `horizon-scanner` flags a same-day-effective regulator action
- `regulatory-research-specialist` flags a circular requiring developer-side response

## Owner

`legal-liaison` charters end-to-end. `chief-commercial-officer` is informed continuously. `regulatory-research-specialist` provides current-rule confirmation. `compliance` handles claim-side artifact review. `data-room-curator` scaffolds the inquiry document surface. `aml-kyc-compliance-specialist` handles AML/CFT-class inquiries. `content-pr-specialist` manages press posture if inquiry surfaces publicly.

## Pre-flight

- Regulator communication preserved with full metadata (sender, channel, timestamp)
- Inquiry-classification framework accessible (which regulator, which scope, which response window)
- Per-client `legal_panel` current (which counsel handles which regulator)
- `clients/<client>/legal/templates/` accessible
- Risk-register entry opened
- Restricted-access folder structure for the inquiry prepared

## Sequence

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 1 | `legal-liaison` | Receive inquiry; preserve original communication; open restricted-access case file at `clients/<client>/legal/cases/regulator-<id>/` | Case file open | 4 business hours |
| 2 | `legal-liaison` | Triage: classify (routine / thematic / targeted / strategic / enforcement-adjacent); identify response window; identify lead regulator + adjacent regulators | Triage memo | 4 business hours |
| 3 | `risk-register-curator` | Open regulatory-class risk entry; severity per scope; notify CCO immediately | Risk-register update | 1 business hour |
| 4 | `legal-liaison` → `chief-commercial-officer` | Restricted-channel notification + brief; never delay this | Restricted alert | 4 business hours |
| 5 | `legal-liaison` | Counsel-routing: in-house counsel (routine) or external panel firm (specialized / material); per `legal_panel` | Counsel-brief packet | 1-2 business days |
| 6 | `regulatory-research-specialist` | Current-rule confirmation on the inquiry's scope: what does the rule actually say today? what is the regulator's typical posture on this class? | Currency memo | 2 business days |
| 7 | `data-room-curator` | Scaffold inquiry document surface per regulator scope; coordinate with `legal-liaison` on what's in / out of scope; redact thoughtfully | Inquiry data room | 3 business days from inquiry |
| 8 (if AML/CFT-class) | `aml-kyc-compliance-specialist` | DNFBP-side response coordination; STR currency review; goAML-portal interaction if applicable | AML response packet | per regulator window |
| 9 (if claim-class) | `compliance` | Customer-facing artifacts in scope reviewed; permit-display verification; forbidden-phrasing audit | Compliance memo | 3 business days |
| 10 | `chief-commercial-officer` (decision-ask) | Approve response posture: cooperative-comprehensive / cooperative-narrow / formal-defensive | Decision memo via `decision-router` | within response window |
| 11 | `legal-liaison` + counsel | Draft regulator response (formal letter, evidence packet, requested-information delivery, attendance commitment) | Response artifact | per regulator window |
| 12 | `chief-commercial-officer` + executive | Sign-off on response; if material, executive-committee review | Sign-off | per response window |
| 13 | `legal-liaison` | Submit response per regulator-required channel; preserve submission acknowledgment | Submission record | per regulator window |
| 14 (continuing engagement) | `legal-liaison` | Manage subsequent regulator interactions (clarifying questions, supplementary requests, attendance at hearings) | Continuing log | continuous |
| 15 | `content-pr-specialist` | Press posture: no-comment default; if inquiry becomes public, reactive only with `legal-liaison` sign-off; never characterize regulator | Press posture pack | continuous |
| 16 (closure) | `legal-liaison` | Confirm closure / regulator decision; archive case file; risk-register update; lessons captured | Closure memo | per regulator process |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `legal-liaison` → `chief-commercial-officer` | Inquiry triage complete | Within 4h; non-negotiable |
| `legal-liaison` → `risk-register-curator` | Inquiry confirmed | Within 1h |
| `legal-liaison` → `regulatory-research-specialist` | Currency confirmation needed | Within 1 business day |
| `legal-liaison` → `data-room-curator` | Scope identified | Within 1 business day |
| `legal-liaison` → counsel (in-house or panel) | Counsel-brief ready | Per counsel SLA, typically same-day for material |
| `legal-liaison` → `aml-kyc-compliance-specialist` | AML/CFT-class | Per `runbooks/pep-sanctions-hit.md` analog if material |
| `legal-liaison` → `content-pr-specialist` | Public surfacing risk | Continuous awareness |

## Compliance gates

1. **Restricted-access** — case files restricted to legal team + named CCO scope
2. **Privilege** — counsel-prepared content tagged for legal privilege; never co-mingled with non-privileged content
3. **No public characterization of regulator** — never; press posture is no-comment with regulator-mediated statement only
4. **Response-window respect** — non-negotiable; missed window = enforcement risk
5. **Scope discipline** — over-disclosure can be as risky as under-disclosure; counsel calibrates
6. **Cross-regulator coordination** — if inquiry touches multiple regulators (e.g., DLD + ADGM-FSRA), `regulatory-research-specialist` confirms the right primary + secondary path
7. **No-tipping-off on AML-class** — AML-related inquiry handling restricted-channel
8. **VVIP discretion** — if any inquiry-relevant counterparty is VVIP, restricted-access tightened further

## Out-of-scope

- Buyer-complaint-driven regulator exposure — `runbooks/complaint-rera-exposure.md`
- Sanctions-hit-driven regulator interaction — `runbooks/pep-sanctions-hit.md`
- Litigation if matter escalates — `legal-liaison` + external counsel; this runbook ends at regulator-decision
- Specific consultation-paper substantive content — `regulatory-research-specialist` + relevant pod for input
- Tax / customs / employment regulator inquiries — separate counsel discipline

## KPIs

- Triage latency (target: ≤ 4 business hours from receipt)
- CCO notification latency (target: ≤ 4 business hours; non-negotiable)
- Counsel-brief turnaround (target: ≤ 1 business day for material; ≤ 2 days for routine)
- Response-window compliance (target: 100% — non-negotiable)
- Press-spike incidents (target: 0)
- Privilege-breach incidents (target: 0 — non-negotiable)
- Cross-regulator-coordination incidents (target: 0 missed adjacencies)

## Close-out + learning

- Case file persists in restricted-access at `clients/<client>/legal/cases/closed/regulator-<id>/`
- Closure memo captures: regulator outcome, lessons, process adjustments
- Pattern alerts: 3+ same-class inquiries in 18 months → systemic-review with `chief-commercial-officer`
- Material learnings feed `regulatory-research-specialist` skill updates via `knowledge`
- Quarterly aggregated trend reporting to `chief-commercial-officer` per `runbooks/quarterly-exec-brief.md` compliance section

## Related runbooks

- `runbooks/complaint-rera-exposure.md` — buyer-complaint-driven counterpart
- `runbooks/pep-sanctions-hit.md` — sanctions / PEP regulator interaction
- `runbooks/risk-register-update.md` — risk-register state management
- `runbooks/cco-daily-brief.md` — surfaces inquiry state in daily brief
- `runbooks/horizon-scan-daily.md` — feeds inquiry-trigger detection
