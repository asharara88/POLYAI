# Flow — project-wide rules

This file applies to every agent in `.claude/agents/`. Read it as standing instructions on top of your individual agent prompt.

## 1. Client + pack context is mandatory

Every work request must come with a `client` slug and a `pack` — the industry pack the client is on, or `_default` if none (per `schemas/handoff-envelope.md`). The field is still called `vertical` in legacy `client-profile.md` entries and remains valid. If either is missing, escalate to `chief-commercial-officer` instead of guessing or proceeding.

Flow's product shape is **core + packs**: a universal marketing/sales/CRM core that every deployment runs, plus optional industry packs (e.g. `real-estate-uae`) that activate specialist agents for specific verticals. Pack-only agents must refuse work for clients not on their pack and escalate to the CCO.

## 2. Path resolution order

When your prompt references context paths (`knowledge/icp.md`, `knowledge/brand-voice.md`, `knowledge/results.md`, `knowledge/playbooks/...`), resolve them in this order — most-specific first:

1. `clients/<client>/knowledge/...` — client-specific overrides
2. `verticals/<vertical>/playbook.md` — industry defaults (matched section, e.g. "Audience archetypes" maps to ICP)
3. `knowledge/...` (root) — team-level cross-client baseline

If the file doesn't exist at level 1, fall through to level 2, then level 3. Never invent content because a file is missing — escalate.

## 3. Writes always go to the client folder

You may only write under `clients/<client>/...`. You may **not** write to `verticals/...` or root `knowledge/...` directly. Promotion happens through the `knowledge` agent with `chief-commercial-officer` approval, only when a pattern appears across 2+ clients.

## 4. Approval gates respect client overrides

Before treating something as auto-approve, check `clients/<client>/client-profile.md` → `approval_gates`. Client-specific overrides win over the global defaults in `ARCHITECTURE.md`.

## 5. Compliance flags are sticky

If `clients/<client>/client-profile.md` lists `compliance_flags`, every externally-facing artifact for that client must route through `compliance` regardless of channel. The flag is a contract, not a suggestion.

## 6. Don't fabricate

If you don't know something about the client, leave a `# TODO: <what's missing>` marker and escalate the gap. Inventing ICP details, customer quotes, or trigger events poisons every downstream brief.

## 7. Skills are framework, not current truth

When a skill in `.claude/skills/` carries a regulatory citation (DLD circular number, RERA Trakheesi requirement, ADREC clause, CBUAE LTV cap, sanctions list cadence, FATF status, Golden Visa threshold), treat it as **framework-level reference** — not as today's truth. For any artifact that depends on the current rule, route to `regulatory-research-specialist` for per-request confirmation. The skill describes *what the regulator regulates and how the rule generally works*; the agent confirms *what the rule says today*.

## 8. Runbooks have a single owner

When you reference a runbook in `runbooks/`, the named owner agent runs the case end-to-end. Do not parallel-fork — if you are not the owner, your role is supporting per the hand-off matrix in the runbook. Switch runbooks (per "related runbooks" sections) when the scenario shape changes mid-flight, but only one runbook is primary at a time.

## 9. Pod-manager routing

Specialists route their day-to-day handoffs through their pod manager (`marketing-manager`, `sales-manager`, `crm-manager`, `wealth-vvip-manager`). Cross-pod handoffs and escalations go through the `chief-commercial-officer`. Do not bypass the manager tier for routine work; do bypass for true escalations.

## 11. Pack-only agents refuse out-of-pack work

Agents that belong to an industry pack (declared via a `## Pack scope` section in the agent file) must refuse work for clients not on that pack and escalate to `chief-commercial-officer`. Pack manifests live in `verticals/<pack>/`. Today the only shipping pack is `real-estate-uae`; future packs follow the same contract.

## 10. Discretion stance

For VVIP-touching artifacts and any matter referencing the per-client `vvip-channel/no-mention-list.md`, restricted-access discipline applies: case files in restricted folders, Salesforce records under restricted-access sharing rules, no general-team visibility, no press reference (ever). Discretion is the contract, not a suggestion.
