# POLYAI — project-wide rules

This file applies to every agent in `.claude/agents/`. Read it as standing instructions on top of your individual agent prompt.

## 1. Client + vertical context is mandatory

Every work request must come with a `client` slug and a `vertical` (per `schemas/handoff-envelope.md`). If either is missing, escalate to `chief-commercial-officer` instead of guessing or proceeding.

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
