# Lovable handover — Flow: investor demo + pitch deck

> Paste this entire document into Lovable as the project brief. It's self-contained — Lovable doesn't need access to my source code; everything required to build a credible investor-grade demo + pitch deck is below.

---

## 0. What you're building

**Two artifacts in one Lovable project:**

1. **A clickable web demo** of "Flow" — a multi-agent commercial agency platform. Think of it as a SaaS workspace for running marketing, sales, and CRM teams that are entirely AI agents. The demo should feel like a real product, not a marketing site. Multiple routes, plausible dummy data, real navigation. **No backend, no auth, no API calls — pure front-end, all data hard-coded.**

2. **An investor pitch deck** as a long-form page route inside the same Lovable app, at `/deck`, designed for full-screen presentation. ~14 slides. Tasteful, dense, founder-grade — not corporate-pretty.

Both surfaces share one design system. The demo is the *proof*; the deck is the *pitch*.

**Audience:** seed/Series-A investors. Tone: confident, technical, evidence-led. Avoid AI-hype words ("revolutionary", "unleash", "transform"). Show, don't tell.

---

## 1. The product — Flow, in one paragraph

Flow is a white-label, multi-agent commercial agency. A buyer (typically a mid-to-large enterprise like a real-estate developer, an asset manager, or a luxury-goods house) deploys Flow and gets an entire commercial team — marketing pod, sales pod, CRM pod, plus a Chief Commercial Officer (CCO) agent orchestrating them — all running as Claude-powered AI agents. The CCO produces a daily morning brief, runs the weekly cadence, dispatches work to pod managers, escalates blockers. Industry packs (e.g. `real-estate-uae`) snap on per client to add specialist agents (broker enablement, VVIP-channel protocol, wealth-channel intermediary management, regulatory research). The thesis: AI-native marketing/sales agencies will eat traditional commercial-services consulting at 1/20th the cost and 10x the responsiveness, *if* the agent graph is correctly designed.

**Wedge market:** UAE real-estate developers. High-budget, agency-dependent, regulatory-heavy, multi-channel (broker + wealth + VVIP + direct), and the closest thing to a perfect-fit ICP for multi-agent commercial automation.

---

## 2. Visual system

Build a custom design system. Do NOT default to shadcn-ui-stock styling.

**Type:**
- Sans: Inter (headings + body)
- Mono: JetBrains Mono (labels, IDs, timestamps, tabular data)
- Type scale: `text-label-xs` 11px / `text-body-xs` 12px / `text-body-sm` 14px / `text-body` 15px / `text-title-sm` 17px / 24px / 32px / 48px headings

**Color palette:**
- Background: warm off-white `#FAFAF7` (light) / near-black `#0A0A0B` (dark). Default to light.
- Ink scale: `ink-50` (lightest border) through `ink-950` (darkest text). Cool greys, not pure neutrals.
- **Accent: deep amber `#B45309` (warm gold-brown).** Used sparingly — only for primary CTAs, the active-nav indicator, the accent hover state.
- Status palette:
  - success: `#15803D` (forest green)
  - warning: `#D97706` (amber-orange)
  - info: `#2563EB` (saturated blue)
  - purple: `#7C3AED` (used for VVIP / Tier-1 contexts)
- Cards: `bg-white` with `border-ink-200/70` + soft shadow. Tight 1px borders. Don't use big drop shadows.

**Components:**
- Pills/chips: `text-label-xs font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border`. Status pills carry both color tone and a leading dot.
- Tables: `text-body-sm`, mono numerals via `tabular-nums`, alternating-row striping NO — use single thin row dividers.
- Code-like inline references: `font-mono text-label-xs bg-ink-100 px-1.5 py-0.5 rounded` — used for agent names (`chief-commercial-officer`), file paths (`runbooks/launch-day.md`), and IDs.

**Density:** Information-dense. The page should feel like a Linear/Vercel/Plain dashboard, not a marketing landing page. No big hero images. Lots of tabular and chip-based data.

**Iconography:** `lucide-react`. Small (12–16px in body, 20–24px in headings). Use sparingly.

---

## 3. Information architecture — routes the demo must have

Build a left-rail navigation (collapsible to icon-only). Pinned items:

```
Flow                            ← logo / mark
─────────────────────────
Dashboard          /cco         ← default route
Clients            /clients
Agents             /agents
Launches           /launches
Verticals          /verticals
Schemas            /schemas
Operator           /operator    ← admin
─────────────────────────
+ Pitch deck       /deck
```

Top-right of every page: a single timestamp ("refreshed 2h ago"), a "client switcher" dropdown (Aldar Developments / Meraas / +Add client), and an inline ask bar (`<input placeholder="Ask Flow…">`) — the ask bar doesn't need to work; it's an aspirational affordance.

### 3.1 `/cco` — the dashboard

Three vertical zones:
- **Top:** "CCO Now — top 3 items today". Three cards horizontally: (1) Decision needed, (2) Risk to address, (3) Calendar moment. Each card has a 2-line recommendation, an "Sign" + "Send back" button row, and a small `Ask` chip that *would* open an inline thread.
- **Middle:** "Morning brief" — a multi-section synthesis. Sections: Pipeline KPIs (4 KPI tiles with sparklines + a coverage gauge), Channel mix bar, Horizon scan (3 bullets with source counts), Compliance (1 sticky flag), Aged threads.
- **Bottom:** Three columns side-by-side — Decision queue (5 pending), Risk register (severity heatmap 3-cell row at top + 4 entries below), Calendar (vertical hour-block ruler 08:00–20:00 with event pills positioned by time).

Every panel has a small "Ask" chip in its header — clicking does nothing on Lovable (or opens a stub inline `<details>` accordion).

### 3.2 `/clients` — client list

Three client cards: **Aldar Developments** (active), **Meraas** (active), **Emaar Hospitality** (pilot). Each card shows: industry pack badge, primary market, # active campaigns, # active agents, last-activity timestamp.

Click into Aldar →

### 3.3 `/clients/aldar-developments` — client workspace

Header: client logo placeholder, industry pack chip (`real-estate-uae`), Trakheesi number, primary market (Abu Dhabi). Tab nav across the top:
- Overview
- ICP
- Brand voice
- Brokers → links to `/clients/aldar-developments/brokers`
- Vendors → links to `/clients/aldar-developments/vendors`
- Inventory
- Decisions

Each tab shows a rich content surface (lots of cards, structured data). For the demo, Overview and Brokers are the most important — make them the most polished.

### 3.4 `/clients/aldar-developments/brokers` — broker registry (the showcase)

This is the most recent surface I built and the one I want to *look the sharpest* in the demo, because it shows the depth of the data model.

Structure:
- **Header:** breadcrumb, title "Broker registry — Aldar Developments", subtitle explaining tier system, "Speed-to-lead SLA: 5 min" stat.
- **Tier map** — 3 cards horizontally (Tier 1 / Tier 2 / Tier 3). Each card:
  - Tier badge + total count (18 / 82 / 150)
  - Description (Tier 1: "exclusive private-event access; first 2 weeks exclusive on premium-tier units")
  - 2x2 grid: in registry, active count (with "X dormant" annotation if any), avg prior-launch conversion
  - **Mini histogram bar chart** of per-firm conversions inside the card — small flex of inline divs, ~24px tall
  - Tier 1 = purple accent, Tier 2 = blue, Tier 3 = grey
- **Tier 1 grid (7 firms):**
  - Driven Properties, Allsopp & Allsopp, Better Homes, Espace Real Estate, Provident Estate, LuxuryProperty.com, fäm Properties
  - Each card: firm name + T1 pill + 2–3 specialization chips (e.g. "GCC investor", "ultra-prime", "branded residences") + languages (en/ar/hi/ru) + prior conversion % (e.g. 7.2%) + "View profile →" link
- **Tier 2 grid (6 firms):**
  - haus & haus, Engel & Völkers Middle East, Metropolitan Premium Properties, Aqua Properties, Banke International Properties, D&B Properties
- **Tier 3 grid (5 firms):**
  - Foot Print Real Estate, Trinity Homes, Stage Properties, Coldwell Banker UAE *(dormant since 2025-11)*, Skyline Properties *(dormant since 2026-01)*. Dormant firms render dimmed (`opacity-60`) with a "dormant" badge.
- **Routing principles footer** — 5 numbered principles in a card.

### 3.5 `/clients/aldar-developments/brokers/driven-properties` — firm detail

- Breadcrumb back to brokers
- Title: Driven Properties
- Profile card: long-form markdown about the firm (illustrative)
- **"Launches this firm is on"** — list of 3 rows, each linking to a launch:
  - Q3 tower launch (Live) — 36 slots · T1
  - Hudayriyat Canal Residences (Pre-launch) — 16 slots · T1
  - *(no Yas Acres — Driven isn't on that allocation)*

### 3.6 `/launches` — campaign list

Three sections: **Active** (1: Q3 tower launch — Live), **In creative** (1: Hudayriyat Canal — Pre-launch), **Closing out** (1: Yas Acres Grove handover — Close-out). Each `LaunchCard` shows: project name, campaign title, phase badge, days-to-close (`12 days · Jun 17`), budget chip (`AED 4.1M`), primary KPI (`booking-pads issued`), owner agent (`marketing-manager`).

### 3.7 `/launches/q3-tower-launch` — launch detail (the second showcase)

Six tabs:
1. **Readiness** — 6-row board: Strategy / Brand / Media-planning / Media-buying / Creative-production / Measurement. Each row: status pill (green/amber/red), owner agent, blocker text. Two rows red, one amber.
2. **Brief** — audience-segment cards, positioning promise+proof, offer hook+CTA, constraints chips.
3. **Channel mix** — horizontal waterfall bar split by channel weight; broker 22% / wealth 14% / paid social 18% / display+ooh 12% / vvip 6% / press 8% / direct 20%. Each segment has a rationale tooltip.
4. **Finance** — budget breakdown table by channel, total AED 4.1M, sparkline of spend pacing.
5. **Events & brokers** — this is where Phase-20 + Phase-21 work converges:
   - Event cards: Q3 broker preview night (Jun 10) + Q3 public launch (Jun 17). Each card shows: status pill, date+venue, 4-stat attendance KPI grid (Invited / Accepted / Declined / Pending), stacked accept/decline/pending bar, **invitee slate by protocol tier** with per-tier acceptance bars (VVIP 8 invited / 5 accepted, VIP 64/41, Wealth 38/22, Broker 96/71, Press 28/18, Internal 86/30 — for the public launch).
   - **Broker firms allocated** table below — 12 rows (the firms named above) × 3 phase columns (Pre-launch / Launch week / Post-launch) × slot counts. Phase totals row at the bottom.
   - Broker & wealth-channel allocation cards (the channel-mix slice).
6. **Decisions & risks** — 3 open decisions + 4 open risks scoped to this launch.

### 3.8 `/agents` — agent directory

Grid of agent cards. ~35 agents. Each card: agent name (mono), pod (marketing / sales / crm / wealth-vvip / cross-cutting / real-estate-pack), 1-line job description, "report-to" chip (`marketing-manager`), tool palette chips (`Read`, `Write`, `WebFetch`).

Group by pod with sticky section headers.

### 3.9 `/verticals` — pack catalog

Two cards: **real-estate-uae** (active, 11 specialist agents) + **luxury-retail** (placeholder, "coming"). Click into `/verticals/real-estate-uae` for a longer page describing the pack: included agents, included skills, included runbooks, regulatory citations covered (DLD / RERA / ADREC / CBUAE / AML/CFT / PDPL / Golden Visa).

### 3.10 `/schemas` — schema catalog

Grid of schema cards: campaign-brief, client-profile, creative-brief, deal-record, handoff-envelope, broker-firm, launch-event, allocation. Each card shows: name, 2-line description, "View →" link. The detail page (`/schemas/campaign-brief`) shows the YAML structure with field annotations.

### 3.11 `/operator` — admin

Single page. Shows: Flow version, deployed agents count, packs activated, integrations status (Salesforce ✅, Canva ✅, HubSpot ⚠️, Meta Ads ✅). Plus a "Logs" mock table with 8 recent events.

---

## 4. The deck — at `/deck`

Long-form page route. One slide per `<section>`. Snap-scroll between sections (`scroll-snap-type: y mandatory; scroll-snap-align: start`). Full viewport per slide. Slide numbers in bottom-right (`01 / 14`).

Slide content:

1. **Cover.** "Flow — the multi-agent commercial agency." Subtitle: "Marketing, sales, and CRM run by AI agents. Built for industries where the human version costs 20x and ships 10x slower."
2. **The problem.** Commercial-services consulting (agencies, broker enablement, CRM consultancies) is a $400B+ market built on labor arbitrage. Three failure modes: high price, slow turnaround, opaque output. Visualize as 3 stats.
3. **Why now.** Tool-using LLMs crossed the threshold for **multi-step commercial reasoning** in 2024–25. Frontier models can plan a campaign, route a lead, draft a board memo, and reason about regulatory compliance — all in one agent graph. The agent-graph quality is the moat, not the model.
4. **What Flow is.** Diagram: a buyer's marketing/sales/CRM team replaced by a **CCO + three pod managers + ~30 specialist agents + an industry pack**. Show the actual agent-graph (use the Mermaid render shown in `/agents`).
5. **The wedge — UAE real-estate.** Why this vertical first: high agency-spend density, regulatory complexity that nobody else automates, three highly differentiated channels (broker / wealth / VVIP), AED 1.4T regional market, 30+ active master-developers, 250+ active broker firms. Insert a screenshot of `/clients/aldar-developments/brokers`.
6. **Demo (live).** A 90-second click-through script — pinned link to the demo. Suggested path: `/cco` → click into the top decision → `/launches` → click Q3 tower → Readiness → Events & brokers → click a firm → back to `/clients/aldar/brokers`.
7. **Product architecture.** Two diagrams side-by-side: (a) **core + packs** (universal commercial core; packs snap on per vertical), (b) **agent graph** (CCO orchestrates pod managers; pod managers orchestrate specialists). Cite numbers: 3 pods, 21 core agents, 11 real-estate-pack agents, 8 cross-cutting agents.
8. **Defensibility.** Three moats: (a) **the agent graph** — designing this is design work that compounds, not prompting; (b) **the skills library** — regulatory citations, runbooks, handoff schemas; (c) **the data flywheel** — each engagement enriches the knowledge graph for the next.
9. **Pricing / commercial model.** Mock numbers: enterprise SaaS, $25k/mo base, +$10k/mo per pack, +$5k/mo per integration. Gross margin >80% at scale. Show a sample bill for Aldar: $50k/mo × 12 = $600k ARR/client. Compare against the AED 4.1M they spend on one campaign with traditional agencies.
10. **Traction.** Honest current state — be specific about what we have: working agent graph (35 agents authored), working pack (real-estate-uae fully built), working CCO surface (`/cco`), working launch+broker surface (built in Phases 17–21 of this engagement), 4 worked-example clients. Pilot conversations: list industries if you want, or leave as "in conversation with N developers / N family offices".
11. **Market sizing.** $400B+ TAM (global commercial services). SAM (real-estate developer commercial services, GCC + Asia): $8B. Beachhead (UAE master-developers, top 30): $200M. Top-down + bottoms-up reconciliation.
12. **Team.** Founder (you) — leave a placeholder card with photo + 1-paragraph bio. Add a "key advisors" placeholder. Be honest about gaps and what the round funds.
13. **Roadmap.** 4-quarter view: Q1 close UAE pack + pilot 3 developers; Q2 pilot → revenue; Q3 add `luxury-retail` pack + 1 new vertical; Q4 self-serve onboarding. Don't over-promise.
14. **The ask.** Round size, use-of-funds breakdown (~60% eng, ~25% gtm/pilots, ~15% ops), milestones to next round. Closing line: "Most AI-native companies are building copilots. We're building the team."

Each slide: tight headline, short prose (no bullet-mountains), at most one visual or data block. Investor decks should look like a designed document, not a corporate template.

---

## 5. Dummy data — use these exact names + numbers

Don't invent — these are the entities I want consistent across surfaces:

**Clients:**
- Aldar Developments (real-estate-uae, Abu Dhabi, active, 3 campaigns)
- Meraas (real-estate-uae, Dubai, active, 1 campaign)
- Emaar Hospitality (real-estate-uae, Dubai, pilot, 1 campaign)

**Aldar campaigns / launches:**
- `q3-tower-launch` — "Saadiyat Reserve Heights — Q3 tower" — Live — Jun 17 — AED 4.1M — KPI: booking-pads issued
- `hudayriyat-canal-residences-pre-launch` — "Hudayriyat Canal Residences — pre-launch" — Pre-launch — Sep 14 — AED 2.8M — KPI: qualified-wealth-channel intros
- `yas-acres-grove-handover` — "Yas Acres Grove — handover campaign" — Close-out — May 15 — AED 1.2M — KPI: loyalty-program enrolment

**Tier-1 broker firms (use these spellings):** Driven Properties, Allsopp & Allsopp, Better Homes, Espace Real Estate, Provident Estate, LuxuryProperty.com, fäm Properties

**Tier-2:** haus & haus, Engel & Völkers Middle East, Metropolitan Premium Properties, Aqua Properties, Banke International Properties, D&B Properties

**Tier-3:** Foot Print Real Estate, Trinity Homes, Stage Properties, Coldwell Banker UAE *(dormant)*, Skyline Properties *(dormant)*

**Pods + a few agent names per pod (use these — they'll appear cross-page):**
- Marketing: marketing-manager, strategy, creative, brand-design, seo, social-media, analytics, content-pr-specialist, email-lifecycle, martech-ops-specialist
- Sales: sales-manager, sdr, inbound-qualifier, account-executive, proposal, account-manager, forecasting, deal-desk-analyst
- CRM: crm-manager, voc, service-recovery-specialist, data-quality-steward
- Wealth/VVIP: wealth-vvip-manager, broker-enablement, wealth-channel-enablement, vvip-channel-enablement, vip-relationship-manager
- Cross-cutting: chief-commercial-officer, review, compliance, regulatory-research-specialist, horizon-scanner, risk-register-curator, decision-router, knowledge, project-manager

Always render agent names in `font-mono` lowercase-with-hyphens, never title-cased.

**Disclaimer line — include at the bottom of every demo page in tiny grey type:**
*"Worked example — illustrative. Firm and developer names referenced are publicly active in the UAE market; references are illustrative of category, not actual commercial relationships."*

---

## 6. Things Lovable should NOT do

- ❌ Don't use shadcn-ui defaults out of the box. Style every component custom.
- ❌ Don't use stock illustrations, hero photography, or Unsplash. The visual richness comes from data density, not imagery.
- ❌ Don't use emoji as iconography. Use lucide-react.
- ❌ Don't make the demo a marketing site. No "Why us" sections, no "Trusted by" logo bars, no testimonials. Build the **product**.
- ❌ Don't write AI-marketing copy. Especially avoid "agentic", "autonomous", "revolutionize", "unlock", "supercharge". This is for investors who can smell that from a mile away.
- ❌ Don't link out to external URLs. Everything self-contained.
- ❌ Don't add real auth or signup flows. The demo is fully accessible — investors should be one click from `/cco`.

---

## 7. Build order suggested

1. Design system (tokens, type, components: Card, Chip, Pill, KPI tile, Table, Tab nav, Left rail).
2. Routing skeleton + left rail nav.
3. `/cco` dashboard (hardest visual — get it right first).
4. `/launches` + `/launches/q3-tower-launch` (six tabs — Events & brokers is the showpiece).
5. `/clients/aldar-developments/brokers` + firm-detail.
6. The lighter routes (`/agents`, `/verticals`, `/schemas`, `/operator`).
7. `/deck` — last, once the rest exists to screenshot from.

Ship-ready when: a stranger can click `/cco` → top decision card → `/launches` → Q3 tower → Events & brokers → click into a firm → land on the firm detail with launch history → click into the deck → present the 14 slides in <90 seconds. That's the investor walk-through.

---

*End of handover. Build something that feels like a product, not a deck. The deck is the part of the demo that talks back.*
