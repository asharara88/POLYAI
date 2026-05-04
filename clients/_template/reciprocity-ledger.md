# Reciprocity ledger — &lt;client name&gt;

> Owned jointly by `wealth-channel-enablement` and `vvip-channel-enablement`. Append-only structured record of every reciprocity-relevant touch in either direction (inbound: from counterparty to us; outbound: from us to counterparty). Surfaces silent debt — when inbound exceeds outbound over a sustained window, the relationship is at risk and an outbound reciprocity action is owed.
>
> Confidential. Treat counterparty references as named-recipient. For VVIP entries, follow the discretion stance of `vvip-channel/registry.md`.

## Cadence

- Refreshed at minimum quarterly per active counterparty
- Reviewed against per-counterparty debt-imbalance threshold (default: ≥3 net inbound over 6 months triggers an outbound action)
- Surfaces "owed reciprocity" report monthly to the orchestrator

## Type taxonomy

- `introduction` — counterparty introduced a buyer / partner / opportunity to us, OR we to them
- `event-invited` — counterparty invited us to their event, OR we invited them
- `event-attended` — counterparty's principal attended our event, OR we attended theirs
- `gift` — appropriate-band gift sent or received (per protocol; many channels are gift-restricted)
- `acknowledgment` — congratulatory note on national / personal occasion
- `courtesy` — meeting, dinner, salon visit, principal-to-principal call
- `referral` — counterparty referred a third-party we should know
- `other` — describe in notes

## Direction

- `outbound` — we did the thing for / to them
- `inbound` — they did the thing for / to us

## Status

- `complete` — the touch happened cleanly
- `pending-acknowledge` — the inbound touch happened; we owe an acknowledgment but have not yet sent it
- `pending-reciprocate` — the inbound touch happened, was acknowledged, but we have not yet reciprocated in kind
- `not-applicable` — gift / favor that doesn't generate a reciprocity expectation (per the relationship norms)

## Entries (append-only)

```yaml
- entry_id: rcp-YYYY-NNN
  date: YYYY-MM-DD
  counterparty_id: <vvip-channel or wealth-channels registry entity_id, or "ad-hoc:<short-name>">
  counterparty_name: "<display name; anonymized for VVIP per discretion stance>"
  channel: vvip | wealth | other
  direction: outbound | inbound
  type: introduction | event-invited | event-attended | gift | acknowledgment | courtesy | referral | other
  description: "<one line>"
  value_implied: low | medium | high
  status: complete | pending-acknowledge | pending-reciprocate | not-applicable
  recorded_by: <agent name or human>
  notes: "<optional>"
```

## Debt-imbalance threshold

By counterparty, by rolling 6 months:
- Net inbound count exceeding 3 → outbound action owed (escalates to relevant channel-enablement agent)
- Net inbound count exceeding 6 → outbound action urgent (escalates to orchestrator + developer principal)
- Net outbound count exceeding 5 → relationship under-investing on their side; surface for diagnosis (relationship may have changed; may be appropriate to slow our cadence)

## Notes

- Entries should be added at the moment of the touch, not retroactively. Memory drift causes silent debt to compound.
- Anonymize VVIP counterparty names in this file; full names live in the VVIP registry which has the discretion stance.
- Some inbound touches (a gatekeeper acknowledging receipt of our letter) are courtesies that don't generate reciprocity debt — record as `not-applicable` so the count stays clean.
