# real-estate-uae pack

The shipping industry pack for Flow. Activates the agents, runbooks, skills, sub-verticals, compliance flags, and approval-gate defaults that a UAE master-developer commercial engagement needs.

```yaml
pack: real-estate-uae
status: shipping
sub_verticals:
  - developer     # active — see sub-verticals/developer/playbook.md
  # - brokerage   # roadmap
  # - portal      # roadmap
```

Clients activate the pack by setting `pack: real-estate-uae` (or legacy `vertical: real-estate-uae`) in their `client-profile.md`. Worked example: `clients/_examples/uae-developments/`.

## What's in here

- **`pack-manifest.md`** — canonical activation list: which agents, skills, runbooks turn on; default compliance flags; default approval gates; expected integrations
- **`playbook.md`** — pack-level patterns: audience archetypes, trigger events, channel mix, KPI norms, compliance flags, voice notes, common pitfalls
- **`monitoring.yml`** — outward-monitoring sources for `horizon-scanner` (UAE regulators, sanctions feeds, competitive launch press)
- **`runbooks/`** — 25 multi-agent runbooks (full catalog in `runbooks/README.md`)
- **`skills/`** — 12 framework-reference skills (full catalog in `skills/README.md`)
- **`sub-verticals/developer/`** — sub-vertical playbook + channel-development playbooks specific to the developer motion

## Pack-specific agents

The 11 agents tagged `(real-estate-uae pack)` in their frontmatter activate alongside the universal core team when this pack is enabled:

- `aml-kyc-compliance-specialist`
- `broker-enablement`
- `data-room-curator`
- `inventory-manager`
- `legal-liaison`
- `regulatory-research-specialist`
- `secondary-market-specialist`
- `vip-relationship-manager`
- `vvip-channel-enablement`
- `wealth-channel-enablement`
- `wealth-vvip-manager`

The remaining 40 agents are tagged `(core)` and activate for every client regardless of pack. See `.claude/agents/` for the full set.

## Runbook catalog (25)

Full list in `runbooks/README.md`. Categories:

- **CCO daily + cadenced reporting** (6): cco-daily-brief, horizon-scan-daily, risk-register-update, monthly-board-prep, quarterly-exec-brief, annual-commercial-plan
- **Regulatory + counterparty crisis** (4): resale-with-noc, complaint-rera-exposure, pep-sanctions-hit, regulator-inquiry-non-complaint
- **Operational crisis** (4): construction-delay-handover-slip, tier-1-broker-collapse, project-safety-press-crisis, key-rm-departure
- **Customer + channel lifecycle** (5): international-roadshow, inbound-hnw-private-bank, broker-onboarding-to-first-deal, handover-snagging, press-sensitive-uhnw-transaction
- **Regulatory operations** (1): trakheesi-permit
- **Strategic-bet evaluation** (1): strategic-bet-evaluation
- **Integration go-live** (4): integration-go-live-{salesforce,sumsub,calendar,news-scan}

## Skill catalog (12)

Full list in `skills/README.md`. Categories:

- **Regulatory framework**: uae-real-estate-regulatory, aml-kyc-uae-real-estate, regulatory-disclosure-language, dispute-resolution-uae
- **Channel + operations**: broker-operations, wealth-channel-operations, vvip-protocol-uae, off-plan-launch-mechanics, payment-plan-structures
- **Customer + community**: owner-community-governance, project-fact-pack
- **Buyer + corridor**: diaspora-corridor-marketing

## Compliance flags (defaults)

Every client on this pack inherits these `compliance_flags`:

- ADGM, DIFC, RERA, ADREC, DLD, DMT
- off-plan-disclosure, escrow-disclosure, SPA-language-consistency
- financial-promotion, broker-disclosure
- PDPL, GDPR (when EU / UK exposure)
- PEP, sanctions-screening

Clients can add more (e.g., `Russia-CIS-corridor`) but cannot remove inherited flags.

## Approval gates (defaults)

| Gate | Default |
|---|---|
| `paid_spend_cap` | 250,000 AED |
| `deal_desk_exception.deal_above_aed` | 50,000,000 |
| `deal_desk_exception.discount_above_pct` | 8 |
| `vvip_relationship_activation` | restricted-route to vvip-channel-enablement + wealth-vvip-manager + CCO |
| `aml_kyc_edd_elevation.russia_cis_corridor_continuation` | route to CCO + Head of Compliance |
| `international_roadshow.above_aed` | 200,000 |

Clients override per `clients/<slug>/client-profile.md` → `approval_gates`.

## Expected integrations

Listed in `pack-manifest.md`. Headline:

- Salesforce Real Estate Cloud (read minimum)
- Sumsub (KYC/AML)
- Bynder (DAM) or equivalent
- Salesforce Marketing Cloud or equivalent
- WhatsApp Business API
- A calendar provider (Google or M365)

## Demo client

`clients/_examples/uae-developments/` — a worked example of a UAE master-developer commercial workspace using this pack. All names (projects, brokers, vendors, events) are illustrative placeholders.

## Out of scope for this pack

- Rental / property-management workflows (a different sub-vertical class — not in scope)
- Brokerage-side workflows (roadmap sub-vertical, not yet shipping)
- Portal / listing-aggregator workflows (roadmap sub-vertical, not yet shipping)
- Non-UAE jurisdictions (future `real-estate-sa` / `real-estate-uk` packs would inherit the framework and substitute jurisdictional specifics)
