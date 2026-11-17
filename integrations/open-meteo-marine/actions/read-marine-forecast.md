# Action: read-marine-forecast

## Classification

- **Integration:** `open-meteo-marine`
- **Tier:** A — read-only
- **Approval:** none required (Tier A)
- **Callable by:** `horizon-scanner`, `franchise-ip-manager`, `multi-platform-producer`, `government-stakeholder-manager`, `commercial-intelligence-analyst`

## Purpose

Read the marine forecast for one or more declared locations in `clients/<client>/integrations/open-meteo-marine/locations.yaml` and return structured current / hourly / daily readings.

## Inputs

| Field | Required | Shape |
|---|---|---|
| `location_keys` | yes | List of `key` values declared in `locations.yaml` |
| `include.current` | no (default true) | Boolean |
| `include.hourly_hours` | no (default 48) | Integer (max 168) |
| `include.daily_days` | no (default 7) | Integer (max 16) |

## Call

```
GET https://marine-api.open-meteo.com/v1/marine
  ?latitude=<lat>&longitude=<lng>
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

One request per location. No API key.

## Outputs

A structured JSON payload per location, timestamped, including:

- `current` — latest wave conditions
- `hourly` — next 48h (default) of all requested hourly fields
- `daily` — next 7d (default) of all requested daily fields
- `meta` — generation_time_ms, source model (GFS / ECMWF per Open-Meteo), retrieval timestamp

## Envelope

Wrap the result in an `integration-action` envelope per `schemas/integration-action.md` with:

- `integration: open-meteo-marine`
- `action: read-marine-forecast`
- `tier: A`
- `requested_by: <agent-name>`
- `client: <slug>`
- `pack: <pack>`
- `locations: [<key>, ...]`
- `retrieved_at: <ISO timestamp>`

## Audit trail

Every call is logged to `clients/<client>/integrations/open-meteo-marine/log.jsonl` with request parameters, HTTP status, response size, and model attribution. A call that triggered a commercial decision additionally gets referenced from the resulting decision's audit entry.

## Failure behaviour

- **Network failure or 5xx:** agent records "marine signal unavailable this cycle" and proceeds without the signal. Do not infer values.
- **Rate limit (429):** back off; retry once after 60s; if still limited, record unavailable.
- **Schema change:** if Open-Meteo returns unexpected field shape, `martech-ops-specialist` is flagged for a schema-spec refresh.
