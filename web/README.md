# POLYAI — web control plane

Next.js (App Router, React 19, Tailwind) UI that renders the multi-agent workspace: clients, agents, vertical playbooks, schemas, and per-client campaigns. Reads the markdown files at the repo root at build time and ships as a static site.

## Local dev

```bash
cd web
npm install
npm run dev
# open http://localhost:3000
```

## Build (static)

```bash
npm run build
```

The build statically prerenders every page (`generateStaticParams` walks the `clients/`, `.claude/agents/`, `verticals/`, and `schemas/` directories).

## Deploy to Vercel

The app is at `web/`; Vercel needs to know that.

1. Push the repo to GitHub.
2. In Vercel: **New Project** → import the repo.
3. Set **Root Directory** to `web`.
4. Framework preset: **Next.js** (auto-detected). No environment variables required.
5. Deploy.

Alternatively, with the Vercel CLI:

```bash
cd web
vercel
# follow prompts; set the project's root directory to "web" if asked
```

## What it does today

- **Overview** — counts of clients, agents, verticals, schemas; latest cards.
- **Clients** — folder-per-client view, with a tabbed detail page (Profile / ICP / Brand voice / Decisions / Results) and per-campaign drill-down rendering all briefs in the campaign folder.
- **Agents** — grouped by pod (Executive / Marketing / Sales / BD / Cross-cutting) with full system-prompt detail page.
- **Verticals** — playbook view per vertical (real-estate, automotive).
- **Schemas** — the inter-agent handoff shapes (campaign-brief, creative-brief, deal-record, etc.).

## What it's NOT yet

- **No write actions.** Read-only view of the repo's markdown.
- **No agent invocation.** No "run the orchestrator from the UI" yet.
- **No approval queue.** The human-approval gates still live in conversation, not in the UI.
- **No auth.** Anyone with the URL can read everything. Add auth before deploying with real client data.

## Extending

- **Run agents from the UI**: add an API route that posts to a Claude Agent SDK session with the orchestrator's system prompt as the agent identity.
- **Approval queue**: write a `pending-approvals.md` per campaign with a structured frontmatter (`{action, requested_by, deadline}`); read and surface them on a `/approvals` page with approve/reject actions that write back to the file.
- **Auth**: add Clerk / Auth.js / Vercel-managed auth before any non-demo deploy.
- **Editing**: pair with a tiny commit-back service (or use a backed-by-Git CMS like TinaCMS) to let humans edit briefs in the UI and have changes commit to the repo.

## File map

```
web/
  app/
    layout.tsx               # shell + nav
    page.tsx                 # dashboard
    clients/                 # list + detail + campaign drill-down
    agents/                  # roster + agent detail
    verticals/               # vertical list + playbook
    schemas/                 # schema list + schema detail
  components/
    Nav.tsx
    Markdown.tsx             # react-markdown + GFM
    Card.tsx                 # card + stat-card
  lib/
    content.ts               # filesystem readers (clients, agents, verticals, schemas)
```

The content readers walk `path.resolve(process.cwd(), "..")` from the `web/` directory, so they pick up the repo's content when Vercel builds with Root Directory = `web`.
