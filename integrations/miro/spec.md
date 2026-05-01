# Integration: Miro

## Purpose

Miro is the planning surface where strategy, project management, and stakeholder alignment happen visually. POLYAI integrates with Miro so:

- `strategy` can scaffold a campaign-planning board (channels, timeline, dependencies) at kickoff
- `project-manager` can sync tasks and milestones bidirectionally
- `agency-liaison` can co-plan with media agencies on a shared canvas
- the team has a visual artifact stakeholders outside the repo can engage with

## Auth

OAuth via the Miro MCP server (already configured at the harness level). No per-client credentials live in this repo.

When the Miro MCP is connected, the following tools are available to agents:

| Tool | Tier |
|---|---|
| `context_get`, `context_explore` | A — read |
| `board_list_items` | A — read |
| `doc_get`, `image_get_data`, `image_get_url` | A — read |
| `diagram_get_dsl`, `table_list_rows` | A — read |
| `doc_create`, `doc_update` | C — write within policy (planning surfaces only, never customer-facing) |
| `diagram_create` | C — write within policy |
| `table_create`, `table_sync_rows` | C — write within policy (sync POLYAI markdown tables to Miro tables for stakeholder visibility) |

## Used by

- `strategy` — primary user. Creates campaign-planning boards, channel-mix diagrams, KPI maps.
- `project-manager` — syncs the active-work board (tasks, owners, dates) to a Miro view stakeholders can see.
- `agency-liaison` — co-plans with media agencies on a shared canvas during brief development.
- `analytics` — posts dashboard-spec sketches and attribution-model diagrams.
- `forecasting` — posts pipeline-health visuals to the board for sales-leadership review.

## Data flow patterns

### Pattern 1 — Strategy builds a campaign board at kickoff

```
strategy reads campaign-brief.md
    ↓ (extracts channels, weights, timeline, milestones)
strategy emits integration-action {operation: diagram_create, payload: <campaign DSL>}
    ↓ (Tier C policy: campaign-planning boards auto-approved)
Miro MCP creates board in the team's Miro workspace
    ↓ (board url logged in clients/<slug>/campaigns/<campaign>/miro-board.md)
stakeholders engage with the board; humans + agencies edit
```

### Pattern 2 — Project-manager syncs task table

```
project-manager maintains active-work.md in clients/<slug>/
    ↓ (cron weekly, or on significant change)
project-manager emits integration-action {operation: table_sync_rows, payload: <task rows>}
    ↓ (Tier C — within policy: sync limited to a known board id)
Miro MCP updates the table on the shared board
    ↓ (stakeholders see fresh state without leaving Miro)
```

### Pattern 3 — Read Miro back to discover changes

```
project-manager reads Miro board weekly via board_list_items
    ↓ (compare against active-work.md state)
diff surfaces external edits (new sticky notes, status changes from stakeholders)
    ↓ (project-manager surfaces "outside-repo changes" to orchestrator)
```

## What we read regularly

- Active campaign-planning boards (state, items, comments)
- Stakeholder annotations / sticky notes
- Diagram structure changes

## What we write (each through integration-action envelope)

- `diagram_create` — campaign-planning diagrams (channel mix, timeline, dependencies)
- `doc_create`, `doc_update` — planning narratives that reference the diagram
- `table_create`, `table_sync_rows` — sync repo markdown tables to Miro tables (active work, broker registry summary, inventory burn-down)

## What we do NOT do

- We do not edit boards owned by a different team or workspace.
- We do not delete content stakeholders created. Reconcile via comments / annotations.
- We do not use Miro for customer-facing artifacts. Planning surface only.

## Per-client config

`clients/<slug>/integrations/miro/config.md`:

```yaml
miro_team_id: # workspace identifier
default_campaign_board_template: # board id of a template if any
auto_create_campaign_boards: false # set true for established clients to auto-spin a board on every new campaign
sync_active_work_table: true
```

## Status

Spec live. Wiring depends on Miro MCP reconnection at the harness level. Agent prompts reference this spec; calls activate when the MCP is available.
