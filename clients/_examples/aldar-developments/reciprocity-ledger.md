# Reciprocity ledger — Aldar Developments

> **Worked example — illustrative.** Fictional reciprocity entries; not real Aldar Properties data.
>
> Owned jointly by `wealth-channel-enablement` and `vvip-channel-enablement`. Confidential. VVIP entries are anonymized per the registry's discretion stance.

## Entries (append-only)

```yaml
- entry_id: rcp-2026-001
  date: 2026-01-12
  counterparty_id: rf-uae-ad-01
  counterparty_name: "[Ruling Family — AD-affiliated household] (anonymized)"
  channel: vvip
  direction: outbound
  type: acknowledgment
  description: "UAE National Day acknowledgment letter — developer principal signed, hand-delivered through Maktab"
  value_implied: medium
  status: complete
  recorded_by: vvip-channel-enablement
  notes: "Acknowledged by Maktab on 2026-01-15"

- entry_id: rcp-2026-002
  date: 2026-01-22
  counterparty_id: si-swf-ad-01
  counterparty_name: "[AD-anchored Sovereign Wealth Fund] (anonymized)"
  channel: vvip
  direction: inbound
  type: event-invited
  description: "Invited developer principal to their annual investment forum"
  value_implied: high
  status: complete
  recorded_by: vvip-channel-enablement
  notes: "Developer principal attended; reciprocity baseline established"

- entry_id: rcp-2026-003
  date: 2026-02-08
  counterparty_id: fo-london-multi-01
  counterparty_name: "Multi-family office (London-ADGM)"
  channel: wealth
  direction: inbound
  type: introduction
  description: "Introduced potential investor (UK-Indian principal); meeting held at sales gallery"
  value_implied: high
  status: pending-reciprocate
  recorded_by: wealth-channel-enablement
  notes: "Meeting was warm; investor in active conversation. We owe reciprocity touch within 90 days."

- entry_id: rcp-2026-004
  date: 2026-02-22
  counterparty_id: rf-uae-ad-01
  counterparty_name: "[Ruling Family — AD-affiliated household] (anonymized)"
  channel: vvip
  direction: inbound
  type: courtesy
  description: "Maktab confirmed scheduling for principal-to-principal meeting in May"
  value_implied: medium
  status: complete
  recorded_by: vvip-channel-enablement

- entry_id: rcp-2026-005
  date: 2026-03-04
  counterparty_id: pb-fab-ad
  counterparty_name: "First Abu Dhabi Bank Private Banking"
  channel: wealth
  direction: outbound
  type: courtesy
  description: "Initial relationship-building lunch with bank's wealth-management lead — home-emirate institutional anchor"
  value_implied: medium
  status: complete
  recorded_by: wealth-channel-enablement
  notes: "Bank fiduciary-restricted — no commission discussion. Pure relationship. They will socialize the opportunity to selected HNI clients on their own timeline."

- entry_id: rcp-2026-006
  date: 2026-03-15
  counterparty_id: fo-london-multi-01
  counterparty_name: "Multi-family office (London-ADGM)"
  channel: wealth
  direction: inbound
  type: introduction
  description: "Second introduction (different investor, also UK-Indian) — meeting scheduled"
  value_implied: high
  status: pending-reciprocate
  recorded_by: wealth-channel-enablement
  notes: "Two introductions inside 6 weeks — strong reciprocity expectation building. Developer principal needs to attend their next London event (May) or send substantive equivalent."

- entry_id: rcp-2026-007
  date: 2026-03-21
  counterparty_id: si-swf-ad-01
  counterparty_name: "[AD-anchored Sovereign Wealth Fund] (anonymized)"
  channel: vvip
  direction: outbound
  type: event-invited
  description: "Invited CEO + selected officers to private preview of Saadiyat Reserve Heights launch"
  value_implied: high
  status: pending-acknowledge
  recorded_by: vvip-channel-enablement
  notes: "Sent via Office of CEO; awaiting RSVP"

- entry_id: rcp-2026-008
  date: 2026-04-02
  counterparty_id: pb-stanchart-uae
  counterparty_name: "Standard Chartered Private Bank — UAE"
  channel: wealth
  direction: outbound
  type: courtesy
  description: "Joint principal-led briefing at sales gallery"
  value_implied: medium
  status: complete
  recorded_by: wealth-channel-enablement

- entry_id: rcp-2026-009
  date: 2026-04-18
  counterparty_id: fo-mumbai-multi-01
  counterparty_name: "Multi-family office (Mumbai)"
  channel: wealth
  direction: inbound
  type: introduction
  description: "Introduced two NRI principals interested in 2BR / 3BR mid-tier"
  value_implied: medium
  status: pending-acknowledge
  recorded_by: wealth-channel-enablement

- entry_id: rcp-2026-010
  date: 2026-04-25
  counterparty_id: rf-ksa-01
  counterparty_name: "[Ruling Family — KSA branch] (anonymized)"
  channel: vvip
  direction: outbound
  type: acknowledgment
  description: "Saudi National Day-adjacent congratulatory note + project-milestone update on Saadiyat Reserve Heights"
  value_implied: low
  status: complete
  recorded_by: vvip-channel-enablement
```

## Debt summary (computed at 2026-05-22 snapshot)

Counterparties with net inbound > outbound in last 6 months — outbound action owed:

| Counterparty | Inbound | Outbound | Net | Status |
|---|---|---|---|---|
| Multi-family office (London-ADGM) | 2 | 0 | -2 | Approaching threshold; one event-attendance or substantive courtesy owed within 60 days |
| Multi-family office (Mumbai) | 1 | 0 | -1 | New relationship; first reciprocity touch owed within 30 days (acknowledgment of introduced principals) |
| AD-anchored Sovereign Wealth Fund | 1 | 1 | 0 | Reciprocated cleanly via private-preview invitation |
| Ruling Family — AD-affiliated household | 1 | 1 | 0 | Balanced |
| First Abu Dhabi Bank Private Banking | 0 | 1 | +1 | Healthy outbound posture; reciprocity expectation low (institutional relationship) |

## Owed actions (currently)

```yaml
- counterparty: fo-london-multi-01
  owed_action: substantive courtesy or event attendance
  due_by: 2026-06-15
  owner: developer principal + wealth-channel-enablement
  status: scheduled (London visit planned around their May event)

- counterparty: fo-mumbai-multi-01
  owed_action: acknowledgment + meeting offer for the two introduced principals
  due_by: 2026-05-30
  owner: wealth-channel-enablement
  status: in-progress (RM follow-up assigned)

- counterparty: si-swf-ad-01
  owed_action: follow-up to private-preview invitation
  due_by: 2026-05-15
  owner: vvip-channel-enablement
  status: awaiting their response
```
