# Monitoring

Scheduled scrapes of public sources. Runs in GitHub Actions on a cron, commits raw findings into `clients/<slug>/knowledge/monitoring/<date>.md`. No LLM calls — pure scrape + commit. Analysis happens in Claude Code (invoke `competitive-intel`, `voc`, or `research`) or in the deployed web UI's chat (`/chat`).

## Configure sources per client

Each client can list public sources in `clients/<slug>/monitoring.yml`:

```yaml
- url: https://www.bayut.com/property/details-12345.html
  name: Bayut listing — competing tower

- url: https://www.reddit.com/r/abudhabi/search?q=saadiyat-reserve-heights
  name: Reddit — Abu Dhabi mentions
```

If a client doesn't have one, the scan falls back to `verticals/<vertical>/monitoring.yml`.

## Vertical defaults

Drop a `verticals/<name>/monitoring.yml` to seed sensible default sources for any client in that vertical.

## Schedule

The workflow `.github/workflows/monitoring.yml` runs nightly. Edit the cron there to change cadence.

## Run locally

```bash
node monitoring/scan.mjs
```

The script writes into the repo working tree; commit the result.
