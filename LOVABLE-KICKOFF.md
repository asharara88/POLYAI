# Lovable — turn-1 kickoff prompt

> Paste everything below the `---` into Lovable as the first message. Lovable will produce the project scaffolding + the `/cco` dashboard on this turn. Subsequent turns flesh out the other routes one at a time using the full handover (`HANDOVER-LOVABLE.md`).

---

I'm building an investor demo for **Flow** — a multi-agent commercial agency platform. It's a SaaS workspace where the marketing, sales, and CRM team are entirely AI agents, orchestrated by a Chief Commercial Officer (CCO) agent. Industry packs snap on per client (e.g. `real-estate-uae` for property developers).

**This is not a landing page.** Build it as a real product workspace — left-rail nav, multi-page routing, dense data UI. Think Linear / Vercel dashboard / Plain, not Webflow / Framer. No hero photography. No "Trusted by" sections. No testimonials. The richness comes from data density, not imagery.

**Stack:** React + Vite, TypeScript, Tailwind, `react-router-dom`, `lucide-react` for icons. No backend — everything is hard-coded dummy data. No auth. All routes publicly accessible.

## Visual system — set these tokens

- **Font:** Inter (sans, body + headings) + JetBrains Mono (labels, IDs, tabular data, agent names).
- **Background:** warm off-white `#FAFAF7` (light) / near-black `#0A0A0B` (dark). Default light.
- **Ink scale:** cool greys, `ink-50` through `ink-950`.
- **Accent:** deep amber `#B45309` — use sparingly (primary CTAs, active nav, hover accents only).
- **Status palette:** success `#15803D`, warning `#D97706`, info `#2563EB`, purple `#7C3AED` (for VVIP / Tier-1 contexts).
- **Cards:** white bg, 1px `border-ink-200/70`, soft shadow (no big drop shadows).
- **Pills/chips:** `text-[11px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border`. Status pills have a leading colored dot.
- **Tables:** `text-sm`, `tabular-nums` for all numerics, single thin row dividers (no zebra striping).
- **Iconography:** `lucide-react`. Small (12–16px in body, 20–24px in headings). No emoji.

## Build on this turn — scaffolding + one page

### 1. Left-rail navigation (collapsible to icon-only)

```
Flow                          ← logo + mark
─────────────────────────
Dashboard       /cco          ← default route, redirect / → /cco
Clients         /clients
Agents          /agents
Launches        /launches
Verticals       /verticals
Schemas         /schemas
Operator        /operator
─────────────────────────
Pitch deck      /deck
```

Top bar on every page: a timestamp ("refreshed 2h ago"), a client switcher dropdown (Aldar Developments / Meraas / Emaar Hospitality), and an inline ask input (`<input placeholder="Ask Flow…">` — doesn't need to work).

### 2. Stub pages for all routes except `/cco`

Each stub renders just a page title + a "Coming next" placeholder. We'll build them out in subsequent turns. Don't build their full content yet.

### 3. Build `/cco` fully

Three vertical zones:

**Top — "CCO Now — top 3 items today":** Three cards horizontally:
- Card 1 (Decision): "Sign off Q3 tower launch creative — final round." Owner: `marketing-manager`. Deadline: in 2 days. Recommendation (2 lines). Buttons: "Sign" (primary amber) + "Send back" (secondary). Small "Ask" chip in card header.
- Card 2 (Risk): "Tier-1 broker capacity at 78% — risk to launch-week slot fulfilment." Owner: `broker-enablement`. Severity: amber. Same chip + buttons treatment.
- Card 3 (Calendar): "Saadiyat sales gallery — public launch in 12 days." Owner: `events`. Date: Jun 17. Same treatment.

**Middle — "Morning brief"** (one card with multiple sections):
- Pipeline KPIs — 4 tiles: Booking-pads issued (142, ↑12% WoW, with sparkline), Reservations to contracts (38%, with mini-gauge), Channel coverage (4.1× target, gauge), Wealth-channel intros (24 active). Each tile: label (mono uppercase), value (tabular-nums big), delta + sparkline.
- Channel mix — horizontal stacked bar: Broker 22% / Wealth 14% / Paid social 18% / Display+OOH 12% / VVIP 6% / Press 8% / Direct 20%. Below: tiny chip row showing WoW delta per channel.
- Horizon scan — 3 bullets: "DLD circular 14/2026 — new escrow disclosure rules", "Russia-CIS corridor: FX +3.2% favorable", "Competitor Q3 launch — Emaar Beachfront PH". Source counts in mono.
- Compliance — 1 sticky flag: "RERA Trakheesi renewal due in 14 days (q3-tower-launch)".

**Bottom — three columns:**
- **Decision queue** (column 1): 5 pending decisions. Each row: 1-line title, deadline pill, owner agent in mono, "Sign / Send back / Ask" inline.
- **Risk register** (column 2): A 3-cell severity heatmap at top (Red: 2 / Amber: 4 / Green: 11). Below: 4 entry rows — severity dot + 1-line title + age in mono + owner.
- **Calendar** (column 3): A vertical hour-block ruler 08:00 → 20:00. Position event pills at their start time. Today's pills: "09:00 — Tier-1 broker dyad call (broker-enablement)", "11:30 — Aldar exec sync (chief-commercial-officer)", "14:00 — Compliance review: Q3 creative round 3 (compliance)", "17:00 — Wealth-channel private preview rehearsal (wealth-channel-enablement)".

Every panel has a small "Ask" chip in its header — clicking opens a stub `<details>` accordion with a "This would open an inline thread" placeholder. Doesn't need to work.

## What NOT to do

- ❌ Don't default to shadcn-ui stock styling. Build the components from scratch with the tokens above.
- ❌ Don't use stock illustrations, hero photography, Unsplash. No imagery.
- ❌ Don't add testimonials, "Why us", "Trusted by", or any marketing-site sections.
- ❌ Don't write AI-marketing copy. Avoid "agentic", "autonomous", "revolutionize", "unlock", "supercharge", "transform". This is for investors who can smell that.
- ❌ Don't build out `/clients`, `/launches`, `/agents`, `/verticals`, `/schemas`, `/operator`, or `/deck` content on this turn. Just stubs. We'll iterate.

## Reference data (use these exact names — they'll re-appear across surfaces in later turns)

- Clients: **Aldar Developments** (real-estate-uae, Abu Dhabi, active), **Meraas** (real-estate-uae, Dubai, active), **Emaar Hospitality** (real-estate-uae, Dubai, pilot)
- Pod managers (always in `font-mono` lowercase-with-hyphens): `chief-commercial-officer`, `marketing-manager`, `sales-manager`, `crm-manager`, `wealth-vvip-manager`, `broker-enablement`, `wealth-channel-enablement`, `vvip-channel-enablement`, `events`, `compliance`, `regulatory-research-specialist`

## Footer

Add to every page in tiny grey type: *"Worked example — illustrative. Firm and developer names referenced are publicly active in the UAE market; references are illustrative of category, not actual commercial relationships."*

---

Build the scaffolding + `/cco` on this turn. Don't try to do everything. The remaining 10 routes get built one-at-a-time in following turns — I have a full handover doc I'll share when we move to each.
