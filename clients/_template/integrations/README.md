# Per-client integrations

Owned by `chief-commercial-officer` (config) + the integration runtime (logs).

Structure:
```
integrations/<system>/
  config.md                       # client-specific config (sandbox vs prod, custom fields)
  actions/<YYYY>/<MM>/<id>.md     # action records (per schemas/integration-action.md)
```

Credentials NEVER live here — only references to where credentials are stored (Vercel env vars, vault paths, etc.). See root `INTEGRATIONS.md` for the architecture.
