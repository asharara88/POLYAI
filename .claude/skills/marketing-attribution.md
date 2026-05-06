---
name: marketing-attribution
description: Attribution framework for UAE real-estate developer marketing — how source-channel credit gets assigned across long sales cycles, multiple touchpoints, multiple channels (direct, broker, wealth, VVIP), and multi-emirate corridor activity. Used by analytics (model design), data-quality-steward (data integrity feeding the model), broker-enablement (commission attribution), wealth-channel-enablement (introducer-fee attribution), and marketing-manager (channel-mix optimization). Framework reference; specific model selection per campaign owned by analytics.
scope: real-estate developer marketing attribution + multi-channel + multi-emirate
maintained_by: analytics + marketing-manager (writes via knowledge agent)
---

# Marketing attribution — UAE real-estate developer

> **Read this first.** Attribution in long-cycle, high-value, multi-channel real-estate is a *modelling discipline*, not a math problem. Different decisions need different models. The framework below describes which model fits which question; specific model selection per campaign or per period is owned by `analytics`.

## The four classes of attribution decision

| Decision | Question | Best-fit model |
|---|---|---|
| **Channel-mix budget allocation** | Where should next quarter's marketing spend go? | Multi-touch / data-driven attribution at the funnel-stage level |
| **Per-deal attribution** (commercial credit) | Who gets the commission / introducer fee on this specific deal? | First-touch within attribution window + business-rule overrides per `.claude/skills/broker-operations.md` |
| **Tactical optimization** (per-channel performance) | Is this paid-search campaign working? | Last-click within the channel + post-click engagement quality |
| **Strategic narrative** (board / CMO reporting) | What's our funnel telling us? | Cohort + position-based attribution + assisted-touchpoint reporting |

The mistake is using one model for all four — a multi-touch model used for commission decisions creates broker disputes; a first-touch model used for budget allocation underweights the warming-up channels.

## Channel taxonomy (UAE real-estate developer)

| Channel class | Examples | Attribution treatment notes |
|---|---|---|
| **Owned digital** | Microsite, brand site, owner portal, email lifecycle | Tracked via UTM + on-site events; identity-resolved on form submit / login |
| **Paid digital** | Google search, Meta, LinkedIn, X, YouTube, TikTok, programmatic display | UTM-tagged; click-attributed; impression-tracked where measurable |
| **Paid search** | Google Search, Microsoft (Bing) | Last-click within channel; assisted-touchpoint visible across model |
| **Paid social** | Meta, TikTok, LinkedIn | Click + view-through within attribution window per platform |
| **OOH** | Sheikh Zayed Road, Corniche, AD/DXB airport, mall takeovers | Lift-modelled; QR-attributed where direct response; brand-impact via brand tracker |
| **Real-estate portals** | Property Finder, Bayut, dubizzle | Portal-side attribution + click-through to microsite UTM |
| **Diaspora portals** | Sulekha (India), Magicbricks (India), specific Russia/CIS channels | Same treatment as portals + corridor-segmented |
| **Direct (in-house)** | Direct walk-in to sales gallery, inbound from prior-buyer-list, principal-network | First-touch typically captured by RM during intake; `data-quality-steward` audits |
| **Broker channel** | Tier 1, 2, 3 brokers (RERA-licensed Dubai / ADREC-equivalent Abu Dhabi) | First-touch within window per `.claude/skills/broker-operations.md` attribution doctrine |
| **Wealth channel** | Private banks, family offices, independent wealth introducers | Introducer-fee attribution per signed introducer agreement |
| **VVIP channel** | Royal-protocol gatekeepers, ministerial introductions | Bespoke per relationship; rarely commission-attributed |
| **Press / earned** | Architecture, financial, lifestyle, institutional press | Brand-impact + lift-modelled; rarely directly conversion-attributable |
| **Events** | Roadshows, sales-gallery launches, broker events, owner events | Per-event tracking via RSVP/UTM + on-site capture |
| **Partnerships** | Hospitality JV, school partnerships, asset-class JVs | Per-partnership attribution rules (often co-marketed; co-attributed) |
| **Referral** | Existing-owner referrals (often the highest-converting source) | Referrer-tagged; referrer-credit per referral program |

## The attribution-window question

A UAE off-plan buyer-decision cycle typically spans **3–18 months** (longer for UHNW). Attribution windows must reflect that.

**Default windows:**
- **Click attribution:** 90 days from click to deal-stage advance
- **View-through attribution:** 7-30 days depending on platform + creative type
- **Broker first-touch:** 90 days from first registered touchpoint to closed-won
- **Wealth-channel introducer:** Per signed introducer agreement (typically 6-24 months)
- **Cross-launch carryover:** when a buyer engaged in launch A but converts in launch B, credit splits per cohort tagging or fully attributes to launch B per business-rule decision (consult `marketing-manager`)

**Window-conflict resolution:** When multiple channels each have a valid claim within their windows, the priority order is per `.claude/skills/broker-operations.md` attribution doctrine (broker-channel disputes) and per `analytics` strategic ruling (marketing-channel-mix decisions).

## Identity resolution — the silent attribution problem

Attribution dies when the same buyer cannot be recognized across touchpoints. Without identity resolution:
- A buyer who clicks paid-search, then walks into the sales gallery, then calls via a broker → looks like 3 leads from 3 channels
- Channel-mix data is corrupted; budget allocation suffers
- Broker disputes multiply

**Identity-resolution layers:**
1. **Logged-in identity** (form submit, microsite login, owner-portal login) — gold standard
2. **Email-stitch** (same email across CRM + email-lifecycle) — high quality
3. **Phone-stitch** (same phone E.164 normalized across CRM + WhatsApp + portal lead-forms) — high quality
4. **Device-stitch** (probabilistic, declining post-iOS 14, less in WhatsApp-heavy markets) — supplementary
5. **Household-stitch** (same address across deals) — useful for multi-unit + family attribution

`martech-ops-specialist` owns the technical layer; `data-quality-steward` owns the CRM-side dedup; `analytics` owns the model design.

## Multi-emirate corridor consideration

A Russia/CIS buyer who sees an OOH ad in DXB airport, clicks an Arabic-language paid-social ad, attends a Moscow roadshow, and finally converts via a broker referral in Dubai is touching at least 4 channels across 2 jurisdictions. Attribution must:

1. Tag at the geo-source level (which channel was where)
2. Respect cross-emirate Trakheesi / ADREC permit boundaries (each ad's permit is jurisdiction-bound)
3. Capture the corridor for buyer-segment analysis (the corridor is a feature, not just a label)
4. Avoid double-counting roadshow + paid-digital that ran in the same corridor in the same window

## Forbidden attribution-language

Attribution in real-estate is always *probabilistic* and *evidence-based*. The following patterns are not acceptable:

- "100% of our launch sales came from channel X" — no single channel is 100% of long-cycle multi-touch decisions
- "Channel Y has a 4.2x ROI" — without showing the attribution model and assumptions, this is theatre
- "Brokers attributed 60% of sales last quarter" — without first-touch evidence and window definition, this invites dispute

Reporting language should be:
- "Channel X is the first-touch channel for N% of closed-won deals in the trailing 12 months under a 90-day first-touch window"
- "Channel Y shows a Z% lift in stage-advance probability within 60 days post-touch in our position-based model"
- "Brokers were the registered first-touch on N deals in the period; commission accrued: AED X per `.claude/skills/broker-operations.md` doctrine"

## Reporting cadences

| Audience | Cadence | Model | Owner |
|---|---|---|---|
| `marketing-manager` | Weekly | Last-click per channel + funnel-stage flow | `analytics` |
| `chief-commercial-officer` | Weekly | Multi-touch summary + channel-mix shift | `analytics` |
| Board / CMO / CFO | Monthly + Quarterly | Cohort + position-based + strategic narrative | `analytics` (with `marketing-manager`) |
| `broker-enablement` | Weekly | First-touch broker attribution per registry | `data-quality-steward` |
| `wealth-channel-enablement` | Monthly | Introducer-fee attribution per agreement | `data-quality-steward` |
| Per-campaign post-mortem | Per launch | Multi-model — what worked + assist-pattern | `analytics` |

## What this skill does NOT cover

- Specific platform measurement (GA4 setup, Meta CAPI config, etc.) — see `martech-ops-specialist`
- Per-campaign measurement plan — that's `analytics` per campaign brief
- Commission calculation math — that's `marketing-financial-manager` + `broker-enablement`
- Brand measurement (awareness, consideration, perception) — that's a separate brand-tracker discipline; reference `verticals/real-estate/sub-verticals/developer/playbook.md`
