# Client profile

Conforms to `schemas/client-profile.md`. Populated by `client-onboarding` during intake. Updated only via the `knowledge` agent thereafter.

```yaml
slug:                      # url-safe short name, used as folder name
display_name:
vertical:                  # "real-estate" | "automotive" | "saas" | ... — must match a verticals/<name>/ folder
sub_vertical:              # optional, e.g. "luxury-residential", "used-cars"
markets:
  primary:                 # country / region
  secondary: []
languages:
  primary:                 # "en" | "ar" | "es" | ...
  secondary: []
offerings: []              # what this client sells
business_model:            # "transactional" | "subscription" | "marketplace" | "service" | ...
sales_motion:              # "self-serve" | "smb" | "mid-market" | "enterprise" | "field"
typical_deal_cycle_days:
typical_deal_size:
icp_segments_ref:          # path to clients/<slug>/knowledge/icp.md
brand_voice_ref:           # path to clients/<slug>/knowledge/brand-voice.md
integrations:              # systems we'll be operating within
  crm:
  ad_platforms: []
  email_platform:
  analytics:
  other: []
approval_gates:            # client-specific human-in-the-loop overrides
  outbound_email_threshold: # max sends/day allowed without human approval
  social_publish:           # "always-approve" | "approve-non-standard" | "auto"
  paid_spend_cap:
  proposal_send:            # always "always-approve"
  contract_signature:       # always "always-approve"
compliance_flags: []       # e.g. ["RERA", "fair-housing", "Truth-in-Lending", "GDPR"]
exclusions: []             # what we will NOT do for this client
status:                    # "onboarding" | "active" | "paused" | "offboarded"
engagement_start:
engagement_end:
notes:
```
