# Pack manifest — real-estate-uae

> The canonical list of what activates when a client has `pack: real-estate-uae` (or legacy `vertical: real-estate`) in their `client-profile.md`. Anything not on this manifest is core (every client) or not part of this pack.

```yaml
pack: real-estate-uae
display_name: UAE Real-Estate (master-developer)
sub_verticals:
  - developer        # active sub-vertical; see sub-verticals/developer/playbook.md
  # - brokerage      # future
  # - portal         # future
status: shipping
```

## Activated agents

When the pack is enabled, the following pack-only agents activate in addition to the universal core team:

| Agent | Pod | Role |
|---|---|---|
| `aml-kyc-compliance-specialist` | cross-cutting | DNFBP-side AML/KYC + sanctions screening |
| `regulatory-research-specialist` | cross-cutting | Current-rule confirmation across UAE regulators |
| `legal-liaison` | cross-cutting | Interface to in-house counsel + panel firms |
| `broker-enablement` | wealth-vvip | External broker channel ops |
| `wealth-channel-enablement` | wealth-vvip | Private-bank + family-office channel |
| `vvip-channel-enablement` | wealth-vvip | Ruling-family / ministerial protocol |
| `vip-relationship-manager` | wealth-vvip | HNW / UHNW concierge |
| `inventory-manager` | sales | Unit / pricing / allocation source of truth |
| `deal-desk-analyst` | sales | Non-standard structure approvals |
| `secondary-market-specialist` | sales | NOC + Form-F + Oqood + resale flow |
| `agency-liaison` | marketing | Brand / media / production / PR agencies |
| `events` | marketing | Sales-gallery launches, broker nights, VVIP events |
| `marketing-procurement` | marketing | RFP / SOW / vendor performance |
| `marketing-financial-manager` | marketing | Marketing finance, accruals, period-close |
| `data-room-curator` | cross-cutting | Investor / counterparty / regulator data rooms |
| `horizon-scanner` | cross-cutting | Daily UAE regulator + corridor + sanctions scan |
| `risk-register-curator` | cross-cutting | Risk register with pack-aware classifications |
| `content-pr-specialist` | marketing | Architecture / lifestyle / financial / institutional press |
| `service-recovery-specialist` | crm | Complaint triage with RERA / ADREC escalation pathway |

## Pack skills

See `skills/README.md` — twelve framework references covering UAE regulatory, AML/KYC, broker / wealth / VVIP channel ops, off-plan launch mechanics, payment plans, disclosure language, dispute resolution, owner community, project fact pack, and diaspora corridor marketing.

## Pack runbooks

See `runbooks/README.md` — fourteen scenarios covering regulatory + counterparty crisis, operational crisis, customer + channel lifecycle, regulatory operations, and pack-specific integration go-lives.

## Compliance flags

Every client on this pack inherits these `compliance_flags`:

- ADGM, DIFC, RERA, ADREC, DLD, DMT
- off-plan-disclosure, escrow-disclosure, SPA-language-consistency
- financial-promotion, broker-disclosure
- PDPL, GDPR (when EU / UK exposure)
- PEP, sanctions-screening

A client may add more (e.g., `Russia-CIS-corridor`) but cannot remove inherited flags.

## Approval gates (pack defaults)

| Gate | Default |
|---|---|
| `paid_spend_cap` | 250,000 AED |
| `deal_desk_exception.deal_above_aed` | 50,000,000 |
| `deal_desk_exception.discount_above_pct` | 8 |
| `vvip_relationship_activation` | restricted-route to vvip-channel-enablement + wealth-vvip-manager + CCO |
| `aml_kyc_edd_elevation.russia_cis_corridor_continuation` | route to CCO + Head of Compliance |
| `international_roadshow.above_aed` | 200,000 |

Clients can override per `clients/<slug>/client-profile.md` → `approval_gates`.

## Integrations expected at pack activation

- Salesforce Real Estate Cloud (read minimum)
- Sumsub (KYC/AML)
- Bynder (DAM) or equivalent
- Salesforce Marketing Cloud or equivalent
- WhatsApp Business API
- A calendar provider (Google or M365)

## Out of scope for this pack

- Rental / property-management workflows (different sub-vertical class)
- Brokerage-side workflows (separate sub-vertical, not yet shipping)
- Portal / listing-aggregator workflows (separate sub-vertical, not yet shipping)
- Non-UAE jurisdictions (a future `real-estate-sa` / `real-estate-uk` pack would inherit the framework and substitute jurisdictional specifics)
