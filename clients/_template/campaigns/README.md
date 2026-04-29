# Campaigns

One folder per active campaign for this client. Each campaign folder holds:

- `campaign-brief.md` — populated `schemas/campaign-brief.md`, owned by `strategy`
- `creative-brief-<asset>.md` — one per asset that needs creative, owned by `strategy` or derived by `creative`
- `assets/` — drafts, variants, and review notes
- `qa/` — review and compliance checklists

Folder name = the campaign's slug (matches `campaign_id` in the brief).

When a campaign closes, move it to `campaigns/archive/<slug>/` and append the post-mortem to `clients/<slug>/knowledge/results.md`.
