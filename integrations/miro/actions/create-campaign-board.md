# Action: Miro — create campaign-planning board

## When this fires

`strategy` has finalized a `campaign-brief.md` and wants to scaffold a visual planning board for stakeholder alignment.

## Pre-flight

```yaml
preconditions:
  - campaign_brief_finalized: campaign-brief.md exists and is approved
  - miro_workspace_resolved: clients/<slug>/integrations/miro/config.md has miro_team_id
  - no_existing_board: no clients/<slug>/campaigns/<campaign>/miro-board.md (idempotency)
  - tier: C (within policy: campaign-planning boards auto-approved per client opt-in)
```

## Payload shape

```yaml
action_id: <ulid>
client: <slug>
vertical: real-estate
sub_vertical: developer
campaign: <campaign-slug>
proposed_by: strategy
system: miro
operation: diagram_create
payload:
  team_id: <from per-client config>
  title: "<campaign-slug> — campaign plan"
  description: |
    Auto-generated from <client>/campaigns/<campaign>/campaign-brief.md
    Single source of truth: the brief. This board mirrors it for stakeholder visibility.
  diagram_dsl: |
    # nodes
    [primary_kpi: "<kpi name + target>"]
    
    # ICP segments
    [segment_a: "<segment a name>"]
    [segment_b: "<segment b name>"]
    
    # Channels (sized by weight)
    [ch_portals: "Portals (20%)"]
    [ch_paid_search: "Paid search (18%)"]
    [ch_meta: "Meta (18%)"]
    [ch_linkedin: "LinkedIn (12%)"]
    [ch_whatsapp: "WhatsApp 1:1 (10%)"]
    [ch_pr: "PR (10%)"]
    [ch_diaspora_portals: "Diaspora portals (7%)"]
    [ch_email_crm: "Email/CRM (5%)"]
    
    # Phases (left to right)
    [phase_prebrief: "T-16 to T-12 · Pre-brief"]
    [phase_agency: "T-12 to T-10 · Agency engagement"]
    [phase_creative: "T-10 to T-6 · Creative production"]
    [phase_sales_prep: "T-8 to T-4 · Sales-side prep"]
    [phase_prelaunch: "T-4 to T-2 · Pre-launch"]
    [phase_launch: "T-2 to T0 · Public launch"]
    [phase_sustain: "T0 to T+8 · Sustain"]
    
    # edges (phase → channels active in that phase)
    phase_creative -> ch_portals
    phase_creative -> ch_paid_search
    phase_launch -> ch_portals, ch_paid_search, ch_meta, ch_linkedin
    phase_sustain -> ch_meta, ch_paid_search, ch_email_crm
risk_tier: C
approval:
  policy: campaign-planning-board-auto
  required_role: # auto if policy enabled in client profile
references:
  campaign_brief: clients/<slug>/campaigns/<campaign>/campaign-brief.md
  source_evidence:
    - clients/<slug>/campaigns/<campaign>/strategy-decisions.md
audit:
  trace_id: <uuid>
  rollback: "Delete the created board via Miro UI; remove miro-board.md from repo."
  retention_days: 365
```

## Post-flight

- Write `clients/<slug>/campaigns/<campaign>/miro-board.md` with the returned board id, board url, and creation timestamp
- Notify `agency-liaison` so the media agency gets the board url
- Project-manager picks up the board from this file for ongoing sync

## Rollback

Reversible: delete the Miro board and remove the repo file. Safe.

## Tier-C policy criteria

This action runs Tier C (auto-approve) only when:
- `clients/<slug>/integrations/miro/config.md` has `auto_create_campaign_boards: true`
- The campaign brief is signed off (not draft)
- No board already exists for this campaign (idempotent)

Anything outside these constraints reverts to Tier B (explicit approval).
