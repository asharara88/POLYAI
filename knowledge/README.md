# Knowledge — team-level baseline

This directory holds the **lowest-priority** lookup for ICP, brand voice, decisions, results, and playbooks. It is the fallback when neither the active client folder nor the active pack defines the answer.

Per `CLAUDE.md` path resolution order:

1. `clients/<client>/knowledge/...` — client-specific overrides
2. `verticals/<vertical>/playbook.md` (and `verticals/<vertical>/sub-verticals/<sub>/playbook.md`) — industry pack defaults
3. `knowledge/...` (this directory) — team-level cross-client baseline

**You probably don't want to edit this directory.** Real content lives at level 1 (specific to a client) or level 2 (specific to a pack). The files here are templates that the `client-onboarding` agent reads when scaffolding a new client folder. They describe the *shape* of the data, not the data itself.

## Files

- `icp.md` — ideal customer profile template; the structure `client-onboarding` populates per client
- `brand-voice.md` — brand voice template; the structure `client-onboarding` populates per client
- `decisions.md` — append-only log shape; instantiated per client
- `results.md` — append-only log shape; instantiated per client
- `playbooks/` — placeholder for cross-client plays that emerge once a pattern is proven in 2+ clients (promoted here by the `knowledge` agent with `chief-commercial-officer` approval)

## Discipline

1. **Do not write here directly.** The `knowledge` agent is the only writer, and only on cross-client promotion. All other writes go to `clients/<client>/knowledge/` per CLAUDE.md rule 3.
2. **Templates are descriptive, not prescriptive.** The point is to capture the *shape* a populated file should take. A future onboarding pulls from the template + the active pack's playbook + the client's intake brief.
3. **Promotion to this level requires evidence.** A pattern must appear across two or more clients before being promoted from a single client folder or pack to the team-level baseline.
