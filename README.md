# POLYAI

Polyphonic multi-agent AI system — a marketing, sales, and business development team built as Claude Code subagents.

## What this is

A team of specialized agents that work together to plan, execute, and review marketing and sales work. Each agent lives in `.claude/agents/` as a Markdown file with a YAML frontmatter header. The Orchestrator (CEO) routes work between them.

## Team roster

**Executive**
- `orchestrator` — CEO. Decomposes goals, assigns work, runs handoffs, can author new agents.

**Marketing pod**
- `strategy` — campaign plans, GTM, CRM strategy
- `research` — market, audience, trend research
- `creative` — copy and messaging
- `brand-design` — visual direction and brand consistency
- `seo` — organic search and SEM
- `social-media` — platform-native content and community
- `email-lifecycle` — segmentation, nurture, retention email
- `analytics` — KPIs, attribution, A/B test readouts

**Sales pod**
- `sdr` — outbound prospecting and cold sequences
- `inbound-qualifier` — inbound lead scoring and routing
- `account-executive` — discovery, demos, deal management
- `proposal` — quotes, SOWs, proposals
- `account-manager` — expansion, retention, renewals
- `forecasting` — pipeline rollup and deal-slip detection

**Business development**
- `partnerships` — partner identification, outreach, co-marketing

**Cross-cutting**
- `review` — final QA against brief and brand
- `compliance` — claims, regulated language, ad policy, privacy
- `project-manager` — timelines, dependencies, blockers
- `knowledge` — shared memory: ICP, brand voice, decisions, results
- `competitive-intel` — competitor pricing, launches, messaging, ads
- `voc` — voice-of-customer: support tickets, reviews, calls
- `localization` — multi-language, multi-region adaptation

## How they work together

1. The user gives the **Orchestrator** a goal.
2. Orchestrator decomposes it into a campaign or deal plan and dispatches structured **briefs** (see `schemas/`) to the relevant pod agents.
3. Pod agents produce structured outputs — never prose blobs — so the next agent can parse them.
4. **Review** + **Compliance** check outputs before anything ships externally.
5. **Knowledge** captures decisions, ICP updates, and results so future runs don't repeat work.
6. **Project-manager** tracks who owes what to whom and surfaces blockers.

See `ARCHITECTURE.md` for handoff flows and human-approval gates.

## Repo layout

```
.claude/agents/   # one .md per agent (Claude Code subagent format)
schemas/          # JSON-shaped templates for inter-agent handoffs
knowledge/        # shared memory: ICP, brand voice, decision log, results
ARCHITECTURE.md   # handoff flows, approval gates, design choices
```

## Using the team

Inside Claude Code, the Orchestrator is invoked first. Example:

> Plan a 6-week launch campaign for our new B2B analytics product targeting Series-B SaaS companies.

The Orchestrator will pull from `knowledge/icp.md`, dispatch a Research brief, then a Strategy brief, then Creative briefs, etc. Outputs flow through Review and Compliance before anything is marked ready to ship.
