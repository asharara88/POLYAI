# Runbooks — real-estate-uae pack

These runbooks activate when a client has `pack: real-estate-uae` (or legacy `vertical: real-estate`) in their `client-profile.md`. They are not loaded for clients on other packs.

Core runbooks at `runbooks/` (root) are loaded for every client regardless of pack — see that directory's README for the universal catalog.

## Regulatory + counterparty crisis

- `resale-with-noc.md` — Secondary-market resale flow: NOC issuance → AML/KYC pre-clearance on incoming buyer → RERA Form-F (Dubai) / ADREC equivalent (Abu Dhabi) → Trustee Account release → owner-record update
- `complaint-rera-exposure.md` — Customer complaint that names or threatens RERA Rental Dispute Centre filing
- `pep-sanctions-hit.md` — A counterparty surfaces as a PEP (any class) or as a sanctions-list match
- `regulator-inquiry-non-complaint.md` — Regulator opens inquiry / audit / thematic review without underlying buyer complaint

## Operational crisis

- `construction-delay-handover-slip.md` — Material construction delay with buyer-notification obligation analysis
- `tier-1-broker-collapse.md` — Tier-1 broker firm experiences material continuity event
- `project-safety-press-crisis.md` — On-premises incident (safety / fatality / system-failure) with crisis-comms posture

## Customer + channel lifecycle

- `international-roadshow.md` — 14-day post-roadshow cadence in buyer's local time-zone with jurisdiction-specific Golden Visa messaging
- `inbound-hnw-private-bank.md` — Discreet inbound from private bank: KYC pre-clearance, principal-to-principal escalation
- `broker-onboarding-to-first-deal.md` — From signed broker agreement to first allocation approved
- `handover-snagging.md` — Owner experience during the snagging window; CSAT capture
- `press-sensitive-uhnw-transaction.md` — Discretion-first; coordinates vvip-channel-enablement, content-pr-specialist, legal-liaison

## Regulatory operations

- `trakheesi-permit.md` — Dubai DLD/RERA advertising-permit lifecycle: application initiation (T-45) → issuance (T-30 to T-21) → creative integration (T-21 to T-7) → launch (T0) → sustain audit → renewal → pull-down. Owned by `agency-liaison`.

## Integration go-live (pack-specific)

- `integration-go-live-sumsub.md` — Sumsub (KYC/AML) wiring per `integrations/sumsub/spec.md`. Required for any UAE real-estate engagement; not relevant outside the pack.

## Authoring rules

Same shape and rules as `runbooks/README.md` (root). Pack-specific runbooks additionally:

- Cite UAE regulators by current authority (DLD / RERA / ADREC / DMT / ADGM / DIFC / CBUAE / federal AML). Citations route through `regulatory-research-specialist` before publish.
- Reference pack skills at `verticals/real-estate-uae/skills/<skill>.md` (not `.claude/skills/...`).
- Use `clients/<slug>/cco/decision-asks/` for decision-router queue per the pack's decision-router contract.
