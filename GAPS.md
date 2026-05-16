# GAPS.md — Coverage matrix (Phase 2)

> Target roster from the prompt → existing repo. Five status codes per the prompt: ✅ Present and solid · 🟡 Present but light · 🟠 Present with drift · 🔴 Missing · ⚪ Not applicable here.
>
> Mapping rule: where an existing agent already covers the function under a different name, **map to the existing name and keep it**. Do not rename for cosmetic conformity.

## Sales

| Target agent | Status | Existing equivalent | Notes / specific gaps |
|---|---|---|---|
| sales-manager | 🔴 Missing | (chief-commercial-officer routes directly) | No managerial tier exists. Adding it is an architectural change — flag for decision. |
| crm-sales-specialist (existing clientele) | 🟡 Light | `account-manager` | Account-manager handles post-sale ownership generically. UAE-developer specifics (existing-owner reactivation for next-launch, prior-tower owner cross-sell, handover snagging cycle) are partially covered in `verticals/real-estate/sub-verticals/developer/playbook.md` but not formalized as the agent's standing remit. |
| international-sales-specialist | 🔴 Missing | (none — `account-executive` is segment-agnostic) | International HNW handling needs jurisdiction-specific cadence (UK / India / KSA / Russia-CIS / China / Egypt / Pakistan / Nigeria), Golden Visa messaging, cross-time-zone discipline. RM team has a "Russia/CIS" specialist (rm-05) at the per-client level but no generic agent. |
| new-business-sales-specialist | 🟡 Light | `inbound-qualifier` + `sdr` (top of funnel) + `account-executive` (qualified onward) | Three agents jointly cover the "new business" arc. Could be left as the existing trio if the user prefers. |
| business-development-partnerships | ✅ Solid | `partnerships` | Direct equivalent. Light drift on developer-style partnerships (the developer's education subsidiary / hospitality JV / data-center JV scope) — marginal. |
| off-plan-launch-specialist | 🟡 Light | (function distributed across 6 agents + dev playbook) | The 16-week off-plan workflow at `verticals/real-estate/sub-verticals/developer/campaign-workflow.md` covers the orchestration; `strategy`, `events`, `agency-liaison`, `inventory-manager`, `broker-enablement`, `compliance` carry the work. No single agent owns the launch as an artifact. **Decision needed: add the agent, or formalize the workflow doc as the source of truth?** |
| secondary-market-specialist | 🔴 Missing | (none) | UAE secondary-market resale + NOC + DLD/RERA Form-F transfer is a different motion from off-plan. Real gap if UAE Developments runs a secondary-market arm. |
| deal-desk-analyst | 🔴 Missing | (`proposal` is adjacent) | Deal-desk is negotiation/term analysis (discount approval, margin protection, custom commercial terms), not document generation. Real gap. |

## CRM

| Target agent | Status | Existing equivalent | Notes |
|---|---|---|---|
| crm-manager | 🔴 Missing | (chief-commercial-officer + email-lifecycle + analytics + voc) | Same managerial-tier question as sales-manager. |
| customer-success-specialist | 🟡 Light | `account-manager` | Equivalent in spirit. Light on UAE-developer customer-success specifics (handover snagging, owner-community ops, schools-adjacent family events). |
| retention-loyalty-specialist | 🟡 Light | `email-lifecycle` (handles lifecycle and reactivation) | Email-lifecycle covers segments, drip, re-engagement — but loyalty programs (e.g. existing-owner referral mechanics, multi-tower portfolio benefits) aren't represented. |
| customer-insights-analyst | 🟡 Light | `voc` (mining) + `analytics` (measurement) split | Two-agent split is reasonable. A merged "insights" agent would conflict with this. **Decision: keep the split.** |
| service-recovery-specialist | 🔴 Missing | (none) | Complaint handling, RERA escalation pathway, reputation defense is unowned. |
| data-quality-steward | 🔴 Missing | (`knowledge` is for canonical memory, not CRM data hygiene) | Salesforce data hygiene (deduplication, missing fields, stage-progression discipline) is unowned. The earlier sales pod had a "sales-ops/CRM-hygiene" function in conversation, but no agent file. |

## Marketing

| Target agent | Status | Existing equivalent | Notes |
|---|---|---|---|
| marketing-manager | 🔴 Missing | (chief-commercial-officer + `strategy`) | Managerial-tier question. |
| social-media-specialist | ✅ Solid | `social-media` | Direct equivalent. |
| events-specialist | ✅ Solid | `events` | Direct equivalent — already substantive (covers external event agency + internal events team + 3 channel agents). |
| content-pr-specialist | 🔴 Missing | `creative` covers copy; PR not represented | UAE Developments runs press across architecture / lifestyle / financial / institutional press — different cadence and gates from `creative`. |
| performance-marketing-specialist | 🟡 Light | `seo` + `analytics` | The two cover paid-search structure + measurement. Programmatic / DSP buying / cross-platform attribution is a separate discipline. |
| brand-creative-specialist | ✅ Solid | `creative` + `brand-design` (paired) | The existing pair is the conventional split. A merged agent would dilute. **Decision: keep the pair.** |
| martech-ops-specialist | 🔴 Missing | (`analytics` does tracking, `marketing-procurement` does technology vendor selection) | Owns the marketing-tech stack itself: integration health, identity resolution, consent-management, deliverability monitoring across CRM + MAP + ad platforms. Real gap for an enterprise-scale developer. |

## Wealth / VVIP / Brokers

| Target agent | Status | Existing equivalent | Notes |
|---|---|---|---|
| wealth-vvip-manager | 🔴 Missing | (the three enablement agents are independent peers) | Managerial-tier question; the 3 enablements are deliberately parallel today. |
| broker-network-manager | ✅ Solid | `broker-enablement` | Functionally equivalent. Naming differs but the rule is "map to existing name, keep". |
| vvip-relationship-manager | ✅ Solid | `vvip-channel-enablement` | Functionally equivalent. |
| private-banking-liaison | 🟡 Light | `wealth-channel-enablement` (absorbs this) | Wealth-channel-enablement covers private banks, family offices, introducers in one agent. UAE-specific bank engagement (FAB Private, ADCB Private, Mashreq Private, Emirates NBD Private, J.P. Morgan Private Bank — Dubai, Standard Chartered Private, HSBC Premier, Julius Baer) is in the UAE Developments wealth-channels registry. Splitting out a dedicated agent is possible but doubles management surface. |
| family-office-specialist | 🟡 Light | `wealth-channel-enablement` (absorbs this) | Same as above. |
| aml-kyc-compliance-specialist | 🔴 Missing | `compliance` is generic | UAE Federal AML/CFT DNFBP obligations, PEP screening, sanctions screening (UN/OFAC/UK/EU/DFAT), Sumsub / World-Check provider integration, Golden Visa source-of-funds documentation — all unowned. Real gap. |
| concierge-coordinator | 🔴 Missing | (none) | UHNW buyer concierge ops (private gallery viewings, cultural-corridor experiences, Yas events / F1 weekend access, school-introductions for relocating families). Could absorb into `vvip-channel-enablement` or stay separate. |

## Cross-cutting

| Target agent | Status | Existing equivalent | Notes |
|---|---|---|---|
| aldar-chief-of-staff (top-level router) | ✅ Solid | `chief-commercial-officer` | Functional equivalent. Renaming to "aldar-chief-of-staff" violates multi-tenancy (the chief-commercial-officer is generic). **Keep as chief-commercial-officer; do NOT rename.** |
| regulatory-research-specialist | 🔴 Missing | (none) | Tracks DLD/RERA/ADREC/CBUAE/PDPL circulars, advisories, fee changes. Real gap. The `compliance` agent enforces; this agent *researches* and feeds compliance + strategy. |
| legal-liaison | 🔴 Missing | (none) | Counsel-facing role: SPA redlines, escrow disputes, regulatory complaint pathway. `compliance` does ad-claim and platform-policy review, not contract-level legal. |
| data-room-curator | 🔴 Missing | (none) | Owner / investor / counterparty data-room management (RERA project pack, financial transparency packs, due-diligence kits for institutional buyers). Real gap. |

---

## Skills coverage

The repo has **no skills concept**. The closest in-repo equivalents are vertical playbooks + client-profile fields + per-channel registries. Each target skill below is genuinely missing as a self-contained skill artifact.

| Target skill | Status | Closest existing | Gap |
|---|---|---|---|
| aldar-project-fact-pack | 🟡 Light | `client-profile.md` + `inventory/current.md` | A "fact pack" for a project (Saadiyat Reserve Heights worked example) exists as scattered yaml; not a single skill artifact. |
| uae-real-estate-regulatory | 🟡 Light | `verticals/real-estate/playbook.md` + `sub-verticals/developer/playbook.md` (compliance-flag sections) | Generic compliance pointers exist; no consolidated, citation-bearing skill. Doesn't reference DLD circulars, ADREC notices, CBUAE LTV caps, Oqood, or Trustee Account flows. |
| aml-kyc-uae-real-estate | 🔴 Missing | (none) | UAE Federal AML/CFT DNFBP-specific obligations + Sumsub/World-Check provider integration absent entirely. |
| crm-data-model | 🟡 Light | `schemas/deal-record.md` | Generic deal-record exists; no Salesforce / Dynamics object mapping. |
| broker-operations | 🟡 Light | `verticals/real-estate/sub-verticals/developer/playbooks/broker-channel-*.md` (2 plays) + `broker-enablement` agent | Channel development is covered; day-to-day operations (Form-F flow, commission grid mechanics, RERA broker-license verification, dispute escalation steps) are partially covered. |
| marketing-attribution | 🟡 Light | `analytics` agent + `INTEGRATIONS.md` Salesforce / GA4 entries | No standalone attribution-model skill (multi-touch / position-based / data-driven specifics); generic guidance only. |
| vvip-protocol | 🟡 Light | `clients/_examples/uae-developments/vvip-channel/protocol-library.md` (worked example) + `vvip-channel-enablement` agent | UAE-specific protocol forms-of-address + ceremonial precedence are in the worked-example file, not a portable skill. |
| regulatory-disclosure-language | 🔴 Missing | (none) | Approved-disclosure templates (RERA off-plan disclosure paragraph, ADGM-equivalent, financial-promotion footers, "no guaranteed return" templates) are unowned. Real risk surface. |

---

## Integration coverage

| Target integration | Status | Path | Notes |
|---|---|---|---|
| Salesforce / Dynamics | 🔴 Missing (specced only) | (`INTEGRATIONS.md` references it) | Highest-leverage Phase-1 integration per INTEGRATIONS.md. No `integrations/salesforce/` folder yet. |
| Marketing Cloud / HubSpot | 🔴 Missing | (referenced) | |
| WhatsApp Business | 🔴 Missing | (referenced) | Critical for broker channel + 1:1 customer comms in UAE market. |
| Property Finder / Bayut feeds | 🔴 Missing | (referenced) | Listing management + lead capture integration. |
| DLD / Trakheesi | 🔴 Missing | (not even in INTEGRATIONS.md target list) | **Real gap.** Trakheesi is the DLD advertising-permit system — every public-facing real-estate ad in Dubai needs a permit. ADREC has equivalents in AD. |
| KYC provider (Sumsub / World-Check) | 🔴 Missing | (not in target list) | Required for AML/CFT DNFBP compliance. |
| DocuSign | 🔴 Missing | (referenced) | |
| Power BI | 🔴 Missing | (referenced as "Tableau / Power BI") | |
| Canva | ✅ Present | `integrations/canva/` (spec + 1 action) | Built. |
| Miro | ✅ Present | `integrations/miro/` (spec + 1 action) | Built. |

---

## Runbook coverage (top-10 cross-agent workflows)

| Runbook | Status | Closest existing |
|---|---|---|
| New off-plan launch (T-90 to T+30) | 🟡 Light | `verticals/real-estate/sub-verticals/developer/campaign-workflow.md` (T-16 to T+ongoing). Needs reframing to T-90 / T+30 windows + addition of regulatory milestones (Trakheesi permit application timing, Oqood registration, Trustee Account opening). |
| International roadshow | 🔴 Missing | (none) |
| Inbound HNW lead from private bank | 🔴 Missing | `wealth-channel-enablement` covers principles, no runbook |
| Broker onboarding & first deal | 🟡 Light | `verticals/real-estate/sub-verticals/developer/playbooks/broker-channel-new-firm-signing.md` covers signing, not onboarding-to-first-deal |
| Resale with NOC | 🔴 Missing | (none) |
| Complaint with RERA exposure | 🔴 Missing | (none) |
| Handover snagging cycle | 🔴 Missing | (mentioned in dev playbook but not as a runbook) |
| Quarterly executive brief | 🔴 Missing | (none) |
| PEP / sanctions hit on a buyer | 🔴 Missing | `vvip-channel-enablement` references screening, no runbook |
| Press-sensitive UHNW transaction | 🔴 Missing | (vvip-channel-enablement discretion stance covers principles) |

---

## Summary count

| Status | Count |
|---|---|
| ✅ Present and solid | 8 (chief-commercial-officer, social-media, events, partnerships, broker-enablement, vvip-channel-enablement, creative+brand-design pair, canva + miro integrations) |
| 🟡 Present but light | ~12 (account-manager, email-lifecycle, voc+analytics split, wealth-channel-enablement absorbs PB+FO, seo, off-plan-launch distributed, new-business arc, plus most skills) |
| 🟠 Present with drift | 2 (compliance — UAE specifics; partnerships — mild on developer-class scope) |
| 🔴 Missing | ~10 agents + ~5 skills + ~7 integrations + ~9 runbooks |
| ⚪ Not applicable here | "manager-tier" agents are an architectural choice, not gaps — flagged for decision |
