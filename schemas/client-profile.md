# Client profile

The canonical configuration for a single client engagement. Lives at `clients/<slug>/client-profile.md`. Created by `client-onboarding`. Updated only via the `knowledge` agent thereafter.

```yaml
slug:                      # url-safe, used as folder name
display_name:
vertical:                  # must match a verticals/<name>/ folder
sub_vertical:              # optional
markets:
  primary:
  secondary: []
languages:
  primary:
  secondary: []
offerings: []              # what this client sells
business_model:            # "transactional" | "subscription" | "marketplace" | "service" | ...
sales_motion:              # "self-serve" | "smb" | "mid-market" | "enterprise" | "field"
typical_deal_cycle_days:
typical_deal_size:
icp_segments_ref:          # path to clients/<slug>/knowledge/icp.md
brand_voice_ref:           # path to clients/<slug>/knowledge/brand-voice.md
integrations:
  crm:
  ad_platforms: []
  email_platform:
  analytics:
  other: []
approval_gates:            # client-specific human-in-the-loop overrides
  outbound_email_threshold:
  social_publish:          # "always-approve" | "approve-non-standard" | "auto"
  paid_spend_cap:
  proposal_send:           # always "always-approve"
  contract_signature:      # always "always-approve"
compliance_flags: []       # e.g. ["RERA", "fair-housing", "Truth-in-Lending", "GDPR"]
exclusions: []             # what we will NOT do for this client
status:                    # "onboarding" | "active" | "paused" | "offboarded"
engagement_start:
engagement_end:
notes:
```

## Resolution order

When agents read context for this client, they consult sources in this order (most-specific first):

1. `clients/<slug>/knowledge/...` — client overrides
2. `verticals/<vertical>/playbook.md` — industry defaults
3. `knowledge/...` (root) — team-level baseline

When agents write, they always write to `clients/<slug>/`. Promotion to `verticals/` or root `knowledge/` happens only when the `knowledge` agent (with `orchestrator` approval) sees a pattern across 2+ clients.
