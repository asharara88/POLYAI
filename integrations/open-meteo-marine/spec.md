# Integration: Open-Meteo Marine Weather

## Purpose

Open-Meteo Marine is a free, no-auth-required marine-weather API that returns wave, swell, wind-wave, current and sea-surface-temperature data by lat/lng. Flow uses it as an **operational-signal source** for packs whose commercial output depends on outdoor and coastal conditions — today that's `rak-media`, where marine conditions affect:

- **Franchise programming** — Destination RAK segments (Jebel Jais, coast, offshore) and Heart of RAK livability content are weather-sensitive
- **Tentpole-event coverage** — RAK Half Marathon prep (wind + humidity), coastal events, sailing / regatta / offshore moments
- **Hotel-wave readiness signal** — Marjan Island opening cadence is weather-adjacent (construction, soft-opens, beach-day programming)
- **Content calendar** — `multi-platform-producer` schedules weather-aware segments; a swell / surf window is a social moment
- **Sponsor-delivery** — if a sponsor's package includes outdoor activations, the conditions are part of the delivery story

## Why this integration exists

Weather data is public and commodity, but routing it through an integration-action envelope buys three things: a stable schema, a documented authority list (Open-Meteo citing GFS / ECMWF under the hood), and an audit trail of which signals triggered which commercial decisions. Signals without an audit trail become "we saw the swell was good" folklore; signals with an audit trail become `knowledge/results.md` entries that compound.

## Auth

**None.** Open-Meteo is a free public API with no key. Rate limits apply at the IP level (10,000 requests / day for non-commercial use; the project's usage sits far below this).

Base URL: `https://marine-api.open-meteo.com/v1/marine`

## Endpoints used

A single GET endpoint with query parameters. The canonical call shape:

```
GET https://marine-api.open-meteo.com/v1/marine
  ?latitude=<float>
  &longitude=<float>
  &current=wave_height,wave_period,wave_direction,wave_peak_period
  &hourly=wave_height,wave_period,wave_direction,wave_peak_period,
          wind_wave_height,wind_wave_direction,wind_wave_period,wind_wave_peak_period,
          swell_wave_height,swell_wave_direction,
          sea_level_height_msl,sea_surface_temperature,
          ocean_current_velocity,ocean_current_direction
  &daily=wave_height_max,wave_direction_dominant,wave_period_max,
         wind_wave_height_max,wind_wave_direction_dominant,
         wind_wave_peak_period_max,wind_wave_period_max
  &timezone=Asia/Dubai
```

## Fields Flow consumes

| Field | Unit | Used by | Signal class |
|---|---|---|---|
| `current.wave_height` | m | `horizon-scanner`, `multi-platform-producer` | Operational — today-of swell window |
| `current.wave_period` | s | `horizon-scanner` | Operational — long-period swell quality |
| `hourly.wave_height` (next 48h) | m | `multi-platform-producer` | Programming — segment-slot decisions |
| `hourly.sea_surface_temperature` | °C | `franchise-ip-manager` | Content — "SST now sits at …" factual lines |
| `hourly.wind_wave_height` | m | `multi-platform-producer` | Operational — chop vs. ridable wave |
| `daily.wave_height_max` (next 7d) | m | `horizon-scanner` | Horizon — surf/sail window sighting |
| `hourly.ocean_current_velocity` | m/s | `horizon-scanner`, `government-stakeholder-manager` | Safety — currents affect open-water event protocol |

## Per-client configuration

Each client that uses this integration declares lat/lng points of interest in `clients/<client>/integrations/open-meteo-marine/locations.yaml`. Example for RAK Media:

```yaml
locations:
  - key: marjan-island-coast
    name: Marjan Island coast (Wynn / hotel wave)
    latitude: 25.7325
    longitude: 55.7850
    purpose: hotel-wave + Wynn-adjacent beach programming
    agents: [horizon-scanner, franchise-ip-manager, multi-platform-producer]
  - key: rak-corniche
    name: RAK Corniche
    latitude: 25.7889
    longitude: 55.9436
    purpose: Heart of RAK livability + daily-presence content
    agents: [horizon-scanner, multi-platform-producer]
  - key: jebel-jais-offshore
    name: Offshore weather proxy for Jebel Jais event-day conditions
    latitude: 25.9200
    longitude: 56.1500
    purpose: Jebel Jais event-day + RAK Half Marathon prep
    agents: [horizon-scanner, franchise-ip-manager]
```

The `24.532, 54.4392` location in the API docs is Abu Dhabi coastal reference — kept in `locations.yaml` only if the client's audience or buyer book extends to Abu Dhabi coastal coverage (not default for `rak-media`).

## Tiers

| Operation | Tier |
|---|---|
| `GET /v1/marine` (read-only forecast) | **A — read** |
| None — this integration is strictly read-only | — |

No write path exists for this integration. Nothing to approve beyond initial per-client location declaration.

## Signal cadence

- **Hourly refresh** — `horizon-scanner` reads the current + next-48h window every scan (06:00 client-local)
- **Daily forecast refresh** — the 7-day daily block reads once per scan for horizon signal
- **Event-day high cadence** — on an event day for a declared location (Half Marathon, open-water event), `multi-platform-producer` can poll every 30 min from T-3h → T+1h

## Signal-to-action pathways

| Observed signal | Routes to | Typical action |
|---|---|---|
| `daily.wave_height_max > 1.5 m` over a 2+ day window | `horizon-scanner` → `franchise-ip-manager` | Schedule a coastal / surf segment in Destination RAK |
| `hourly.sea_surface_temperature < 23°C` anomaly | `horizon-scanner` → `commercial-intelligence-analyst` | Low-SST as a "swim season ending" editorial moment + hotel-wave messaging |
| `current.wave_height > 2 m` during a declared event window | `government-stakeholder-manager` (safety-sensitive) | Event-protocol check; coordinate with event owner |
| Flat conditions (`wave_height < 0.3 m`) across a week | `multi-platform-producer` | Deprioritise coastal segments; surface land-based content |

Signals that trigger commercial decisions (e.g. a sponsor activation moves) are logged in `clients/<client>/horizon-scan/<date>/scan.md` under the `operational` class.

## Attribution

Open-Meteo requires attribution for any public use. Flow's content that relies on an Open-Meteo signal credits "Marine data: Open-Meteo (CC BY 4.0)" in the segment's source list — `multi-platform-producer` adds this line per the rights framework; `rights-licensing-coordinator` confirms attribution before publish.

## Operational notes

- **Network:** this integration hits a public HTTPS endpoint. In cloud sessions, outbound HTTPS goes through the agent proxy — no extra config needed.
- **Failure mode:** if Open-Meteo is unreachable during a scan, `horizon-scanner` records "marine signal unavailable this cycle" in the scan file; it does not infer or fabricate values.
- **Verification:** the data is model output (GFS / ECMWF); treat every number as "most likely", not ground truth. For safety-sensitive decisions, `government-stakeholder-manager` cross-checks with a second source.
