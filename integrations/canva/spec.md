# Integration: Canva

## Purpose

Canva is the design surface where external brand agencies and the in-house brand team co-edit working files. Flow doesn't replace the design tool; it integrates with it so:

- `brand-design` and `creative` can pull design state for review without context-switching
- `agency-liaison` can post structured, consolidated review feedback as comments inside Canva — where the designer is already working
- `agency-liaison` can request brand-team review at the right moment in the workflow
- design files get exported to Bynder DAM via approved actions, never directly to live channels

## Auth

OAuth via the Canva MCP server (already configured at the harness level). No per-client credentials live in this repo. The MCP token lives in the user's Claude Code config and the Vercel deployment environment for the chat surface to use.

When the Canva MCP is connected, the following tools are available to agents (read tier in parens):

| Tool | Tier |
|---|---|
| `search-designs`, `search-folders` | A — read |
| `get-design`, `get-design-content`, `get-design-pages`, `get-design-thumbnail` | A — read |
| `list-comments`, `list-replies` | A — read |
| `list-brand-kits`, `get-assets` | A — read |
| `comment-on-design`, `reply-to-comment` | B — write with explicit approval |
| `request-outline-review` | B — write with explicit approval |
| `start-editing-transaction`, `perform-editing-operations`, `commit-editing-transaction`, `cancel-editing-transaction` | B — write with explicit approval |
| `generate-design`, `generate-design-structured` | B — write with explicit approval |
| `create-design-from-candidate`, `import-design-from-url`, `merge-designs`, `resize-design` | B — write with explicit approval |
| `create-folder`, `move-item-to-folder`, `upload-asset-from-url` | B — write with explicit approval |
| `export-design`, `get-export-formats` | C — write within policy (export to staging only; live-channel exports require explicit approval) |
| `resolve-shortlink` | A — read |

Default new-client posture: every write Tier B (explicit approval) until per-client policy promotes specific actions.

## Used by

- `agency-liaison` — primary user. Posts review feedback as comments, requests reviews, tracks design status.
- `brand-design` — pulls design state for review, posts brand-consistency notes as comments.
- `creative` — pulls copy state, suggests edits as comments (never direct edits).
- `compliance` — flags non-compliant copy/visuals as comments.
- `localization` — posts AR (and other-language) variants as comments tied to the canvas.
- `inventory-manager` — flags artifacts that reference specific units (price, count, "from X") for re-verification when inventory changes.

## Data flow

```
Agency edits design in Canva
    ↓ (status changes, comments added)
agent (e.g. brand-design) calls list-comments + get-design-content
    ↓ (review against brief + brand voice)
agent emits integration-action {operation: comment-on-design, payload: <consolidated note>}
    ↓ (approval per Tier B policy)
integration runtime calls Canva MCP comment-on-design
    ↓ (posted in Canva — designer sees it where they work)
agency reads, iterates, requests review again via request-outline-review
```

## What we read regularly

- New designs added to a campaign folder
- New comments on designs we're tracking
- Design version state (pages, content, last-edited)

## What we write (each through integration-action envelope)

- `comment-on-design` — post a structured review note. One comment per actionable item, tagged must-change / should-change / suggestion.
- `reply-to-comment` — answer designer questions inline.
- `request-outline-review` — escalate a design to the human reviewer queue when an agent flags a must-change.
- `export-design` — export approved designs to staging for the next pipeline step (DAM ingestion). Tier C in stable client engagements.

## What we do NOT do

- We do not edit designs directly. The agency designs; we comment.
- We do not bulk-export to live channels from Canva. Live publishing always involves a human-mediated handoff (creative-ops → DAM → channel publishing tool).
- We do not delete designs or move other agencies' work between folders.
- We do not approve or reject designs ourselves — `review` (with `compliance` and `inventory-manager` as gate) does that, and humans confirm.

## Per-client config

`clients/<slug>/integrations/canva/config.md`:

```yaml
canva_team: # team or workspace identifier
campaign_folder_naming_convention: "<campaign-slug>--<asset-type>"
brand_kit_id: # the team's master brand kit
review_assignee: # the human in the brand team who receives request-outline-review
default_export_format: pdf
auto_export_to_dam: false # set true once Tier C is approved for this client
```

## Failure modes to handle

- MCP disconnects (Canva MCP has been intermittent in our session). Agents must degrade gracefully: skip writes, log the gap, surface to `chief-commercial-officer` if the engagement depends on Canva availability.
- Concurrent edits by multiple agency contributors. Use start-editing-transaction / commit-editing-transaction when an agent does need to perform an operation, to prevent conflict.
- Orphaned designs (created but never referenced in any brief). Surface in weekly agency-liaison report; prune via human action.

## Status

Spec live. Wiring depends on the Canva MCP being reconnected at the harness level. The agent prompts (`agency-liaison`, `brand-design`) reference this spec; calls activate when the MCP is available.
