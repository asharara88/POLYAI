# Integrations

Flow agents can read from, and (with human-approval gates) write to, the systems your team already runs in. This document is the architecture and the wiring plan.

## Principle: agents recommend, integrations execute, humans approve

No agent ever pushes a status, commission change, paid-spend reallocation, or customer-facing message directly into a real system without an approved trigger. The pattern is always:

```
agent decides → emits an integration-action envelope → human (or pre-approved policy) authorizes → integration executes → audit log entry written
```

The schema for the envelope is `schemas/integration-action.md`. Every integration must conform to it.

## Integration tiers

**Tier A — read-only (low risk).** Agents pull data; no writes. Stand these up first.

**Tier B — write with explicit human approval.** Each write gets a human checkpoint in the UI or chat surface.

**Tier C — write with policy-based approval.** Writes inside pre-defined safe envelopes (e.g. "log activity," "advance lead stage if score > 80") run automatically; out-of-envelope writes need human approval.

**Tier D — write autonomously.** Reserved for narrow, fully-instrumented motions after months of observed behavior.

Default new integrations to Tier A, then promote one tier at a time.

## Mapping clients/integrations needed for a developer like UAE Developments

| System | Tier | Owning agent(s) | What we read | What we write |
|---|---|---|---|---|
| **Salesforce** (CRM) | A → B | inbound-qualifier, account-executive, broker-enablement, forecasting, account-manager | Leads, opportunities, accounts, activity, broker associations, stage, source | Activity logs, recommended next steps, score updates, stage advancements (B) |
| **Tableau / Power BI** | A → B | analytics, forecasting | Existing dashboards (where embedded), data extracts | Push pre-aggregated KPI snapshots to a publishing data source (B) |
| **Snowflake / BigQuery / Redshift** (warehouse) | A | analytics, forecasting, voc | All campaign + sales + product event data | — |
| **Property Finder + Bayut** (UAE portals) | A → B | seo, inventory-manager | Listings, lead inquiries, listing performance | Update listing copy + inventory status (B) |
| **Diaspora portals** (Magicbricks, Rightmove) | A → B | seo, social-media | Listings, lead inquiries | Listing updates (B) |
| **Meta Ads** (Facebook + Instagram) | A → C | strategy, analytics, seo | Campaign performance, audience insights, creative performance | Pause / activate ad sets, adjust budgets within caps (C); creative changes (B) |
| **Google Ads + GA4** | A → C | seo, analytics | Search performance, attribution, audience signals | Bid adjustments within caps (C); negative-keyword + structure changes (B) |
| **LinkedIn Ads** | A → B | strategy, partnerships | Campaign performance, audience insights | Campaign actions (B) |
| **HubSpot / Pardot / Marketo** (marketing automation) | A → B | email-lifecycle, inbound-qualifier | Contacts, lists, sequence performance | Send sequences, update contact properties, suppress / unsuppress (B) |
| **WhatsApp Business API** (broker + 1:1 customer) | A → B | broker-enablement, account-executive, social-media | Inbound messages, delivery + read state | Outbound to brokers and authorized customers (B always until trust + volume) |
| **Email** (Gmail / Outlook / SES) | A → B | email-lifecycle, sdr, account-executive | Inbound, deliverability signals | Sends, with per-recipient or per-batch human approval (B) |
| **DocuSign / Dropbox Sign** | A → B | proposal | Status of envelopes | Send envelopes (B always) |
| **Bynder / DAM** (asset management) | A | brand-design, agency-liaison | Approved brand assets, current creative | — (writes go through DAM admin manually) |
| **Slack / Teams** | A → B | chief-commercial-officer, project-manager | Channels for notification | Post approval requests, status updates, anomaly alerts (B for direct messages, C for #channel updates inside policy) |
| **Asana / Monday / Jira** (project management) | A → C | project-manager, agency-liaison | Tasks, deadlines, status | Create / update tasks within policy (C) |
| **Canva** (already MCP-available) | A → B | brand-design, creative, agency-liaison | Designs, brand kits, comments | Generate variants, post comments, request reviews (B for any export to live creative) |
| **Miro** (already MCP-available) | A → C | strategy, project-manager, agency-liaison | Boards, items | Create planning boards, post sprint outputs (C) |
| **GitHub** (already MCP-available, this repo) | A → C | chief-commercial-officer, agency-liaison, knowledge | Issues, PRs, files | Open PRs, post comments, update files (C, scoped to this repo) |

## Phased rollout for a developer engagement

The integrations are a lot to wire at once. A sensible order for a developer client:

**Phase 1 (Tier A only — first 4 weeks).** No writes, just read.
- Salesforce read (leads, opportunities, activity, broker fields)
- GA4 + Meta Ads read (paid performance)
- Property Finder + Bayut read (listing performance, inquiries)
- HubSpot or Pardot read (email + sequence performance)

This gets the agents' planning, briefing, forecasting, and reporting based on real data — no risk to live systems.

**Phase 2 (Tier B writes — weeks 4–8).**
- Salesforce activity log writes (lowest risk, highest leverage — `account-executive` and `broker-enablement` log every meaningful event automatically)
- Slack approval queue (so humans can approve from where they work)
- HubSpot / Pardot sequence sends with per-batch approval

**Phase 3 (Tier C policy writes — weeks 8–16).**
- Meta + Google Ads bid adjustments inside caps
- Salesforce stage advancement on policy-defined criteria
- Inventory status sync (CRM ↔ inventory-manager)
- WhatsApp Business outbound to brokers (broker comms volume justifies policy automation; customer comms stays Tier B)

**Phase 4 (deeper Tier C / selective Tier D — ongoing).**
- DocuSign envelope sends with policy
- Tableau / Power BI publishing data source push
- Cross-system orchestrations (e.g. lead → CRM → marketing automation → broker assignment fully automated within policy)

## Where the integrations live in the repo

```
integrations/
  salesforce/
    spec.md             # what we read, what we write, schema, auth model
    schema-mapping.md   # how Salesforce objects map to our deal-record + lead schemas
    actions/            # one .md per write action (pre-flight + post-flight)
  tableau/
  google-ads/
  meta-ads/
  property-finder/
  bayut/
  hubspot/
  whatsapp-business/
  docusign/
  ...
```

Each integration has:

1. **`spec.md`** — auth model (OAuth / API key / service account), endpoints used, rate-limit behavior, retry policy.
2. **`schema-mapping.md`** — how the system's data model maps onto Flow schemas (deal-record, campaign-brief, etc.).
3. **`actions/`** — one `.md` per supported write action, conforming to `schemas/integration-action.md`.
4. **Per-client config** at `clients/<slug>/integrations/<system>/` — credentials reference (NEVER actual credentials), sandbox vs. production, custom field mappings.

## Credentials

Credentials never live in the repo. They live in:
- Vercel environment variables (for the web control plane)
- The user's local Claude Code MCP config (for in-session agent runs)
- A vault (1Password, Vault, AWS Secrets Manager) for production runtime

Each integration spec lists exactly which env vars or secret-paths it reads.

## Choosing the first integration to wire

The single highest-leverage integration for an developer-scale developer is **Salesforce read**. With it:

- `forecasting` operates on real pipeline
- `account-executive` sees real opportunities
- `broker-enablement` sees real lead-to-broker mapping
- `analytics` builds dashboards on real data
- `voc` mines real call notes and broker comms

Everything else compounds on top of this. Start there.

## Status

Today the integration layer is a specification, not a runtime. The agents are coded to expect data via these schemas; the actual API wiring is the next iteration. The phased rollout above is the path.
