# Wealth-channel registry — Aldar Developments

> **Worked example — illustrative.** Real institution names appear because they're publicly active in the UAE wealth-management market — references are illustrative of *category*, not actual relationships with Aldar Properties PJSC.
>
> Owned by `wealth-channel-enablement`. Source of truth for the wealth side of the channel mix.
>
> Confidential: this file references named institutions / principals. Do not share outside the marketing + commercial leadership team.

## Channel structure

Three sub-channels, each managed differently:

- **Private banks (institutional)** — fiduciary-restricted; no introducer fees in most jurisdictions. Engagement is through the bank's wealth-management division as a curated-opportunity channel for their HNI / UHNI clients.
- **Family offices (single + multi)** — relationship-driven; principal-to-principal. Each office decides independently. Larger commitments more likely (multi-unit, floor, building).
- **Independent introducers** — IFAs, RIAs, wealth-tax advisors, concierge firms, diaspora-corridor specialists. Commercial relationship with named referral / introducer fee (where permissible).

## Engagement health summary (pre-launch baseline)

| Sub-channel | Active | Dormant | New (target) | Total |
|---|---|---|---|---|
| Private banks | 0 | 0 | 8 | 8 (target by launch) |
| Family offices | 0 | 0 | 16 | 16 (target by launch) |
| Independent introducers | 0 | 0 | 24 | 24 (target by launch) |

(Engagement starts pre-launch; numbers populate as relationships build.)

## Private banks (target list, illustrative)

```yaml
- name: "First Abu Dhabi Bank Private Banking"
  status: target-new
  primary_relationship: # TODO
  fiduciary_restricted: true
  approach: "Home-emirate institutional anchor; principal-to-principal AD relationship"
  prior_introductions: 0
  notes: "Primary AD-institutional counterpart given home-emirate alignment."

- name: "Abu Dhabi Commercial Bank — Private Banking"
  status: target-new
  primary_relationship: # TODO
  fiduciary_restricted: true
  approach: "AD-resident HNI focus"
  prior_introductions: 0

- name: "J.P. Morgan Private Bank — Dubai"
  status: target-new
  primary_relationship: # TODO populate after first meeting
  estimated_aum_dubai_clients: "$8B+"
  fiduciary_restricted: true
  approach: "Curated-opportunity preview at sales gallery + named principal introduction"
  prior_introductions: 0

- name: "Standard Chartered Private Bank — UAE"
  status: target-new
  primary_relationship: # TODO
  estimated_aum_dubai_clients: "$5B+"
  fiduciary_restricted: true
  approach: "Joint principal-led briefing"
  prior_introductions: 0

- name: "HSBC Premier — UAE + UK"
  status: target-new
  primary_relationship: # TODO
  fiduciary_restricted: true
  approach: "UK-diaspora corridor focus"
  prior_introductions: 0

- name: "Emirates NBD Private Banking"
  status: target-new
  primary_relationship: # TODO
  fiduciary_restricted: true
  approach: "GCC-resident HNI focus"
  prior_introductions: 0

- name: "Mashreq Private Banking"
  status: target-new
  primary_relationship: # TODO
  fiduciary_restricted: true
  prior_introductions: 0

- name: "Julius Baer — UAE branch"
  status: target-new
  primary_relationship: # TODO
  fiduciary_restricted: true
  approach: "Swiss-private-bank corridor; ultra-prime focus"
  prior_introductions: 0
```

## Family offices (target list, illustrative)

```yaml
- name: "<single-family office, AD-resident principal>"
  type: single-family
  status: target-new
  primary_principal: # TODO
  geography: AE-AD
  prior_introductions: 0
  notes: "Approach via mutual relationship; AD-anchored institutional context. No cold outreach."

- name: "<single-family office, KSA principal>"
  type: single-family
  status: target-new
  primary_principal: # TODO
  geography: SA
  prior_introductions: 0
  notes: "Senior introduction TBC via existing AD relationship."

- name: "<multi-family office, London-ADGM dual office>"
  type: multi-family
  status: target-new
  primary_principal: # TODO
  geography: [GB, AE]
  estimated_clients_in_target_segment: 30+
  prior_introductions: 0
  notes: "ADGM presence makes the AD-anchored institutional pitch direct."

- name: "<multi-family office, Mumbai>"
  type: multi-family
  status: target-new
  primary_principal: # TODO
  geography: IN
  estimated_clients_in_target_segment: 40+
  prior_introductions: 0
  notes: "NRI corridor, especially relevant for diaspora-investor segment."

- name: "<multi-family office, Cairo-DIFC dual office>"
  type: multi-family
  status: target-new
  primary_principal: # TODO
  geography: [EG, AE]
  prior_introductions: 0
  notes: "Egyptian diaspora corridor."

# 11 more target-new family offices to be added during channel-development phase
```

## Independent introducers (target list, illustrative)

```yaml
- firm: "<UK IFA specializing in expatriate UAE residents>"
  type: IFA
  status: target-new
  geography: GB
  commission_structure: "1.5% net of net price, payable on SPA signing (UK FCA-permissible)"
  prior_introductions: 0

- firm: "<ADGM-based wealth-tax advisor>"
  type: wealth-tax-advisor
  status: target-new
  geography: AE-ADGM
  commission_structure: "Flat introducer fee, AED 50,000 per closed unit"
  prior_introductions: 0

- firm: "<DIFC-based wealth-tax advisor>"
  type: wealth-tax-advisor
  status: target-new
  geography: AE-DIFC
  commission_structure: "Flat introducer fee, AED 50,000 per closed unit"
  prior_introductions: 0

- firm: "<Singapore concierge firm with HNI roster>"
  type: concierge
  status: target-new
  geography: SG
  commission_structure: "TBD — discuss in initial meeting"
  prior_introductions: 0

- firm: "<Mumbai NRI-specialist consultancy>"
  type: NRI-advisor
  status: target-new
  geography: IN
  commission_structure: "Flat introducer fee per closed unit, jurisdiction-confirmed"
  prior_introductions: 0

# 19 more target-new introducers to be added during channel-development phase
```

## Channel-development priorities (current quarter)

- **Reactivation queue:** (none — engagement just started)
- **New-signing queue:** All 48 entries above are target-new
- **Reciprocity tracking:** none yet

## Compliance flags specific to this channel

- Private bank engagement must respect bank's no-commission policy (no introducer fees attempted)
- UK FCA: introducer fees disclosable in customer documentation
- US-resident family offices: securities-rule constraints on offer documentation
- ADGM: ADGM-FSRA regulatory considerations for AD-resident counterparties
- DIFC: DFSA-regulated counterparties have separate disclosure requirements
- Russia/CIS introducer prospects: sanctions screening before any engagement
- All confidential materials watermarked + named-recipient
