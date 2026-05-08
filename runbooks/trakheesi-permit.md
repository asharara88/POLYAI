# Runbook: Trakheesi advertising-permit lifecycle

> Scenario: A Dubai-side real-estate campaign needs a Trakheesi permit before any artifact can ship. Every public-facing real-estate ad in Dubai requires a current Trakheesi permit number displayed on the artifact; running an ad without one is a regulatory violation that exposes the developer to RERA/DLD enforcement, channel pull-down, and reputational fallout. This runbook is the single-owner choreography from application initiation through issuance, display verification, mid-flight monitoring, renewal, and pull-down (when needed).

## Trigger

Any of:
- A Dubai-side campaign brief is approved by `marketing-manager` and creative is in production
- An existing campaign with active Trakheesi permit is approaching its `permit_renewal_buffer_days` window per `clients/<client>/integrations/trakheesi/config.md`
- An in-market artifact is detected without a displayed permit number (audit failure → urgent pull-down)
- Regulator (DLD/RERA) issues a circular changing the Trakheesi requirement (permit-application form change, scope change, fee change) — verify per case via `regulatory-research-specialist`
- A campaign artifact's scope materially changes mid-flight (new asset type, new channel, copy substantially revised) and the existing permit's scope no longer covers it

## Owner

`agency-liaison` charters and runs end-to-end. The relationship with the developer's regulatory-operations team (the human function that interfaces with DLD) is the central hand-off; `agency-liaison` chases on behalf of the marketing pod. `compliance` gates artifact ship; `data-quality-steward` audits in-flight artifacts; `marketing-manager` manages campaign-window dependency; `regulatory-research-specialist` confirms current rules per case; `chief-commercial-officer` signs off if a permit issue threatens launch window.

## Pre-flight

- Approved campaign brief at `clients/<client>/campaigns/<campaign>/campaign-brief.md`
- Per-client Trakheesi config at `clients/<client>/integrations/trakheesi/config.md` (named regulatory-operations contact, typical SLA, default artifact scope, permit-renewal buffer days) — see `integrations/trakheesi/spec.md`
- Creative direction signed off (sufficient to scope the permit application)
- Inventory definition stable (units / pricing / payment plans referenced in artifacts)
- `regulatory-research-specialist` available for current-rule confirmation
- Risk-register entry opened or updated by `risk-register-curator` for permit-cycle dependency

## Sequence

### Phase 1 — Application initiation (T-45 to T-30 days from launch)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 1 | `agency-liaison` | Open a Trakheesi case file at `clients/<client>/regulatory/trakheesi/applications/<application-id>/` per `integrations/trakheesi/spec.md` shape | Case file open | T-45 |
| 2 | `regulatory-research-specialist` | Confirm current Trakheesi application form, fee schedule, scope-definition rules per the applicable campaign-type | Currency memo | within 2 business days |
| 3 | `agency-liaison` + creative pod | Define the application scope: campaign slug, asset types in scope (landing page, OOH, paid social, paid search, brochure, broker pack, microsite — per `default_artifact_scope` in per-client config), expected flight window, channels, geos | Scope document | within 3 business days |
| 4 | `agency-liaison` → developer's regulatory-operations team | Hand off the application packet (scope + creative direction + inventory ref + project registration number per `.claude/skills/uae-real-estate-regulatory.md`) for submission | Application-submitted artifact | T-45 to T-30 |
| 5 | `risk-register-curator` | Open / update regulatory-class entry: severity per launch-window dependency; threshold = "issuance projected past T-21" | Risk-register update | T-30 |

### Phase 2 — Issuance window (T-30 to T-21)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 6 | `agency-liaison` | Daily status check with regulatory-operations team; capture queries from DLD if any | Status log | daily |
| 7 (if DLD queries application) | `agency-liaison` + `compliance` + (substantive matters) `regulatory-research-specialist` | Draft response; route through regulatory-operations team for re-submission | Query-response packet | within 2 business days of query |
| 8 (if scope-restricted issuance) | `agency-liaison` + `creative` + `brand-design` | Re-scope artifacts that fall outside the issued permit; route additional permit application if material; otherwise pull non-covered artifacts | Re-scope plan | within 5 business days of issuance |
| 9 (issuance) | `agency-liaison` | Capture issued permit number, validity start, validity end, scope of artifacts covered, into `clients/<client>/regulatory/trakheesi/permits/<permit-number>.md` per `integrations/trakheesi/spec.md` | Permit record | T-30 to T-21 (typical) |
| 10 | `agency-liaison` | Set renewal calendar entry at `(validity_end - permit_renewal_buffer_days)` per per-client config (default 30 days buffer) | Renewal reminder | same day as issuance |

### Phase 3 — Creative production with permit (T-21 to T-7)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 11 | `creative` + `brand-design` + `agency-liaison` | Wire permit number into every in-scope artifact per `.claude/skills/regulatory-disclosure-language.md` Template 4 (RERA permit + project registration + developer + RERA registration number) | Final artifacts with permit reference | iterative through T-7 |
| 12 | `compliance` | Forbidden-phrasing audit + permit-display audit + cross-language substantive-equivalence (Arabic) per `.claude/skills/regulatory-disclosure-language.md` | Compliance verdict per artifact | per artifact, before ship |
| 13 | `localization` | Arabic substantive-equivalence; `compliance` re-reviews | Localized artifacts | per artifact |
| 14 | `data-quality-steward` | At T-7: audit pass across all in-flight artifacts (microsite footer, OOH bottom-bar, paid-social caption, paid-search ad-extension, brochure footer, broker pack disclaimer) confirming the permit number is displayed correctly + currency-fresh | Audit verdict at `clients/<client>/regulatory/trakheesi/audits/<date>/T-7-display-audit.md` | T-7 |

### Phase 4 — Launch + sustain (T0 to T+permit-expiry)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 15 | `compliance` + `chief-commercial-officer` | T0 launch sign-off gate confirms permit valid, displayed everywhere, scope-covered for all artifacts going live | Sign-off | T0 |
| 16 | `data-quality-steward` | Weekly sustain-phase audit: any new variant / rotated copy / broker re-issued pack revalidated for permit display | Weekly audit log | weekly |
| 17 (if mid-flight scope change) | `agency-liaison` | Material scope change (new asset, new channel, substantively revised copy) — assess whether existing permit covers; if not, return to Phase 1 step 3 for a supplementary application | Re-scope assessment | per change |

### Phase 5 — Renewal cycle (T+permit-expiry minus buffer)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 18 | `agency-liaison` | At calendar reminder: initiate renewal application; carry-forward scope unless materially changed | Renewal application packet | per `permit_renewal_buffer_days` |
| 19 | `regulatory-research-specialist` | Confirm renewal-procedure currency (DLD/RERA may have updated the renewal flow) | Currency memo | within 2 business days |
| 20 | `agency-liaison` + regulatory-operations team | Submit renewal; track issuance same as Phase 2 | Renewal status log | per issuance window |
| 21 | `compliance` + `data-quality-steward` | On renewed permit: update every in-flight artifact's permit reference; audit pass before old permit expires | Updated artifacts + audit verdict | before old permit expiry |
| 22 (if renewal late or declined) | `agency-liaison` + `chief-commercial-officer` | Decision-ask: pause campaign / scope-narrow / pull-down. Per `runbooks/risk-register-update.md` threshold trip | Decision memo via `decision-router` | immediate |

### Phase 6 — Pull-down (when required)

| Step | Who | What | Emits | SLA |
|---|---|---|---|---|
| 23 (any of: artifact in market without permit, permit revoked, scope-mismatch detected) | `compliance` + `agency-liaison` + `chief-commercial-officer` | Immediate alert; triage which artifacts must come down vs. which can be re-scoped in place | Pull-down list | within 2 business hours of detection |
| 24 | `agency-liaison` + agencies + channel teams | Channel-level pull-down: paid digital, OOH, portal listings, broker collateral. Document every action | Pull-down log | within 24 business hours |
| 25 | `data-quality-steward` | Re-audit confirms zero in-market artifacts without compliant permit display | Clean-state verdict | within 24 business hours |
| 26 | `legal-liaison` | If pull-down was driven by regulator action (revocation / circular), per `runbooks/regulator-inquiry-non-complaint.md` for inquiry-side handling | Legal posture | per case |

## Hand-offs

| From → To | Trigger | Failure mode if no ack |
|---|---|---|
| `agency-liaison` → regulatory-operations team | Application packet ready | Within 1 business day; escalate to `chief-commercial-officer` after 3 |
| `agency-liaison` → `regulatory-research-specialist` | Currency confirmation needed | Within 2 business days |
| `agency-liaison` → `risk-register-curator` | Application-cycle entered | Within 1 business day |
| `agency-liaison` → `compliance` | Permit issued; artifacts in production | Per artifact, before ship |
| `data-quality-steward` → `agency-liaison` | T-7 audit identifies gaps | Within 4 business hours |
| `compliance` → `chief-commercial-officer` | T0 launch sign-off | T0 |
| `agency-liaison` → `chief-commercial-officer` (decision-ask) | Renewal late / declined / pull-down required | Immediate |
| `agency-liaison` → channel teams (pull-down) | Pull-down decision approved | Within 24 business hours; SLA non-negotiable |

## Compliance gates

1. **No artifact ships without permit number on file.** `compliance` blocks per `.claude/skills/regulatory-disclosure-language.md` Template 4 + extension in `.claude/agents/compliance.md`'s UAE-specific guardrails. Non-negotiable.
2. **Application packet currency.** `regulatory-research-specialist` confirms current Trakheesi form / fee / scope rules per case — never quote framework knowledge as today's truth.
3. **Cross-language substantive-equivalence.** Arabic translation of permit-display language must be substantively equivalent, not paraphrased; `localization` + `compliance` double-loop.
4. **Forbidden-phrasing block.** "Guaranteed yield", "guaranteed appreciation", "risk-free" never appear in any permit-bearing artifact, even if the permit was issued — those are independent compliance violations.
5. **Permit-display verification at T-7.** Every artifact in market carries the permit number visibly; `data-quality-steward` audit documented.
6. **Mid-flight rotation discipline.** New variant or rotated copy = re-audit; not an automatic carry-forward.
7. **Pull-down within 24 business hours** when a permit issue surfaces — never delay for commercial reasons.
8. **VVIP discretion.** VVIP-touching campaigns: permit-application packet must not reference VVIP counterparties even tangentially per `.claude/skills/vvip-protocol-uae.md` no-mention list; `vvip-channel-enablement` clears scope before submission.

## Out-of-scope

- ADREC advertising-permit equivalent (Abu Dhabi-side campaigns) — separate runbook to be authored when first AD-side campaign goes through; framework lives in `integrations/trakheesi/spec.md` "ADREC equivalent" section
- Specific Trakheesi application-form mechanics — operational with regulatory-operations team; this runbook coordinates, doesn't operate
- Channel-level placement coordination beyond permit-display — per-channel agency / media plan
- Disputes with DLD over permit decisions — `legal-liaison` + external counsel
- Building-side wayfinding signage compliance — different regulator (DM signage rules); separate
- Internal-only briefing materials (broker training decks, sales-gallery wall) — not "advertising" in the Trakheesi sense; verify per case

## KPIs

- **Application-to-issuance latency** (target: ≤ 21 business days; track median + p90 per cycle)
- **T-7 audit pass rate first attempt** (target: ≥ 95%)
- **Permit-display compliance** (target: 100% of in-market artifacts at any audit point)
- **Forbidden-phrasing incidents in permit-bearing artifacts** (target: 0 — non-negotiable)
- **Permit-renewal initiation latency** (target: at or before `permit_renewal_buffer_days` 100% of cycles)
- **Mid-flight pull-down incidents** (target: 0; if any, full postmortem)
- **Same-day-effective regulator-circular response** (target: ≤ 24 business hours per `runbooks/horizon-scan-daily.md` escalation)

## Close-out + learning

- Per-permit case files persist at `clients/<client>/regulatory/trakheesi/permits/<permit-number>.md` for the permit lifecycle plus retention period (typically through campaign close + audit retention)
- Application case files at `clients/<client>/regulatory/trakheesi/applications/<application-id>/` move to `closed/` on issuance; persist for retention
- Audit logs at `clients/<client>/regulatory/trakheesi/audits/<date>/` persist per applicable retention rule
- Pattern alerts: 2+ scope-restricted issuances per quarter → `marketing-manager` for application-scoping framework adjustment
- Pattern alerts: any pull-down event → `risk-register-curator` for systemic-risk review + `chief-commercial-officer` postmortem
- Material learnings (e.g., new DLD form, scope-rule change, SLA shift) feed `integrations/trakheesi/spec.md` updates via `knowledge` agent + `chief-commercial-officer` approval

## Related runbooks

- `runbooks/cco-daily-brief.md` — surfaces Trakheesi cycle status in daily brief
- `runbooks/horizon-scan-daily.md` — `horizon-scanner` flags DLD/RERA circular changes that affect Trakheesi
- `runbooks/risk-register-update.md` — permit-cycle risk handling
- `runbooks/regulator-inquiry-non-complaint.md` — when DLD opens an inquiry adjacent to a permit
- `runbooks/complaint-rera-exposure.md` — when an in-market artifact triggers a buyer complaint that surfaces RERA dispute
- `runbooks/integration-go-live-news-scan.md` — DLD press feed feeds the scan that catches circular changes
- `verticals/real-estate/sub-verticals/developer/campaign-workflow.md` — regulatory-milestone overlay (T-90 to T+30) integrates this runbook into the launch cadence
