# Knowledge

Shared memory for the POLYAI team. The `knowledge` agent is the only one that writes here directly. Other agents request updates through it.

## Files

- `icp.md` — ideal customer profile(s). Overwriteable, with a changelog footer.
- `brand-voice.md` — tone, do/don't, vocabulary, visual notes. Overwriteable, with a changelog footer.
- `decisions.md` — append-only log of strategic decisions and rationale.
- `results.md` — append-only log of campaign / deal outcomes vs. plan.
- `playbooks/` — reusable plays and references.

## Discipline

1. Treat this as the team's source of truth. If two agents disagree about ICP, this file resolves it.
2. Don't quietly drift. If a finding contradicts existing content, the `knowledge` agent flags it to the `orchestrator` rather than overwriting silently.
3. Keep entries dated. Markets and customers change.
4. Archive failed playbooks rather than deleting them — past failures are signal.
