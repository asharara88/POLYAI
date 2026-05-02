"use client";

import { useState } from "react";

type Mode = "direct" | "allocation" | "overflow";

const INPUT_CLS =
  "w-full rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 px-3 py-2 text-sm";

const MODES: { key: Mode; label: string; description: string }[] = [
  {
    key: "direct",
    label: "Direct lead → in-house RM",
    description:
      "Default. Routes a direct lead from the developer's own marketing to the right in-house relationship manager.",
  },
  {
    key: "allocation",
    label: "Broker allocation request",
    description:
      "Default. Broker submits a unit + payment plan request for their named prospect; the simulator runs eligibility, anti-double-allocation, and pre-flight checks.",
  },
  {
    key: "overflow",
    label: "Overflow to broker (exception)",
    description:
      "Exception path. Only when in-house RM capacity is exceeded; distribute a direct lead to a tier-1 broker. Default-deny unless overflow-policy.md opts in.",
  },
];

// ---------- Direct-lead form ----------

const DIRECT_PRESETS = [
  {
    label: "GCC investor — penthouse interest",
    lead: {
      source: "microsite",
      language: "ar",
      segment: "gcc-investor",
      unitType: "penthouse",
      priceBandAed: "14M-18M",
      urgency: "now",
      returningProspectRmId: "",
      notes: "Returning prior-tower buyer; cash-buyer; specifically asked for sea-view penthouse.",
    },
  },
  {
    label: "Indian-diaspora — 2BR mid-tier",
    lead: {
      source: "magicbricks",
      language: "hi",
      segment: "diaspora-india",
      unitType: "2BR",
      priceBandAed: "3.5M-4.5M",
      urgency: "3-months",
      returningProspectRmId: "",
      notes: "Currently in Bangalore; planning UAE visit next month.",
    },
  },
  {
    label: "UK end-user — 3BR upgrade",
    lead: {
      source: "rightmove",
      language: "en",
      segment: "diaspora-uk",
      unitType: "3BR",
      priceBandAed: "5.5M-7M",
      urgency: "exploring",
      returningProspectRmId: "",
      notes: "Family relocating; school catchment is the deciding factor.",
    },
  },
  {
    label: "Returning prospect (rule applies)",
    lead: {
      source: "sales-gallery-walk-in",
      language: "ar",
      segment: "gcc-investor",
      unitType: "3BR",
      priceBandAed: "5.5M-7M",
      urgency: "now",
      returningProspectRmId: "rm-01",
      notes: "Spoke with rm-01 60 days ago about a different unit; came back with new criteria.",
    },
  },
];

function DirectLeadMode({ clientSlug }: { clientSlug: string }) {
  const [lead, setLead] = useState({
    source: "microsite",
    language: "en",
    segment: "gcc-investor",
    unitType: "2BR",
    priceBandAed: "3.5M-4.5M",
    urgency: "now",
    returningProspectRmId: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [decision, setDecision] = useState<DirectDecision | null>(null);
  const [raw, setRaw] = useState("");
  const [showRaw, setShowRaw] = useState(false);

  const submit = async () => {
    setBusy(true);
    setErr(null);
    setDecision(null);
    try {
      const r = await fetch("/api/simulate-direct-lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ clientSlug, lead }),
      });
      const j = await r.json();
      if (!r.ok) {
        setErr(j.error ?? `HTTP ${r.status}`);
      } else if (j.parseError) {
        setErr(`parse: ${j.parseError}`);
        setRaw(j.raw ?? "");
      } else {
        setDecision(j.decision as DirectDecision);
        setRaw(j.raw ?? "");
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="text-xs font-mono text-ink-400">presets</div>
        <div className="flex flex-wrap gap-2">
          {DIRECT_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setLead(p.lead)}
              disabled={busy}
              className="text-xs px-2.5 py-1 rounded border border-ink-200/70 dark:border-ink-800 hover:border-accent/60"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="source">
            <select
              value={lead.source}
              onChange={(e) => setLead({ ...lead, source: e.target.value })}
              className={INPUT_CLS}
            >
              {[
                "microsite",
                "sales-gallery-walk-in",
                "google-ads",
                "meta",
                "linkedin",
                "property-finder",
                "bayut",
                "rightmove",
                "magicbricks",
                "whatsapp",
                "referral",
                "owned-email",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="language">
            <select
              value={lead.language}
              onChange={(e) => setLead({ ...lead, language: e.target.value })}
              className={INPUT_CLS}
            >
              {["en", "ar", "hi", "ur", "fr"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="segment">
            <select
              value={lead.segment}
              onChange={(e) => setLead({ ...lead, segment: e.target.value })}
              className={INPUT_CLS}
            >
              {[
                "gcc-investor",
                "diaspora-uk",
                "diaspora-india",
                "end-user",
                "family-office",
                "first-time-investor",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="unit type">
            <select
              value={lead.unitType}
              onChange={(e) => setLead({ ...lead, unitType: e.target.value })}
              className={INPUT_CLS}
            >
              {["1BR", "2BR", "3BR", "4BR", "penthouse", "any"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="price band (AED)">
            <input
              value={lead.priceBandAed}
              onChange={(e) => setLead({ ...lead, priceBandAed: e.target.value })}
              className={INPUT_CLS}
            />
          </Field>
          <Field label="urgency">
            <select
              value={lead.urgency}
              onChange={(e) => setLead({ ...lead, urgency: e.target.value })}
              className={INPUT_CLS}
            >
              {["now", "3-months", "exploring"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="returning prospect — RM id (if known)">
            <input
              value={lead.returningProspectRmId}
              onChange={(e) => setLead({ ...lead, returningProspectRmId: e.target.value })}
              className={INPUT_CLS}
              placeholder="rm-01"
            />
          </Field>
          <div className="col-span-2">
            <Field label="notes">
              <textarea
                value={lead.notes}
                onChange={(e) => setLead({ ...lead, notes: e.target.value })}
                rows={3}
                className={INPUT_CLS}
              />
            </Field>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={busy}
          className="rounded-md bg-accent text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {busy ? "routing…" : "Route to RM"}
        </button>
      </div>

      <div className="space-y-3">
        {err && <ErrorBox message={err} />}
        {decision && (
          <div className="space-y-4">
            {decision.primary && (
              <div className="rounded-md border border-accent/40 bg-accent/5 p-4">
                <div className="text-xs font-mono uppercase tracking-wider text-ink-400">primary</div>
                <div className="mt-1 text-lg font-semibold">
                  {decision.primary.rm_name}{" "}
                  <span className="text-ink-400 font-mono text-xs">{decision.primary.rm_id}</span>
                </div>
                <div className="text-xs font-mono text-ink-500 mt-0.5">
                  tier {decision.primary.tier}
                </div>
                <div className="text-sm mt-2">{decision.primary.rationale}</div>
              </div>
            )}

            {decision.match_breakdown && (
              <KvBox title="match breakdown" data={decision.match_breakdown} />
            )}

            {decision.alternatives && decision.alternatives.length > 0 && (
              <Box title="alternatives">
                <ul className="space-y-2">
                  {decision.alternatives.map((a, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium">{a.rm_name}</span>
                      <span className="text-ink-400 font-mono text-xs ml-2">{a.rm_id}</span>
                      <div className="text-ink-500 mt-0.5">{a.rationale}</div>
                    </li>
                  ))}
                </ul>
              </Box>
            )}

            {decision.next_actions && decision.next_actions.length > 0 && (
              <Box title="next actions">
                <ul className="text-sm list-disc ml-5 space-y-1">
                  {decision.next_actions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </Box>
            )}

            {decision.alerts_raised && decision.alerts_raised.length > 0 && (
              <Box title="alerts" tone="warn">
                <ul className="text-sm space-y-1">
                  {decision.alerts_raised.map((a, i) => (
                    <li key={i}>· {a}</li>
                  ))}
                </ul>
              </Box>
            )}

            {decision.anti_patterns_avoided && decision.anti_patterns_avoided.length > 0 && (
              <Box title="rules applied">
                <ul className="text-xs font-mono text-ink-500 space-y-1">
                  {decision.anti_patterns_avoided.map((a, i) => (
                    <li key={i}>· {a}</li>
                  ))}
                </ul>
              </Box>
            )}

            {decision.speed_target_minutes != null && (
              <div className="text-xs font-mono text-ink-400">
                speed target: {decision.speed_target_minutes}m
              </div>
            )}
          </div>
        )}
        <RawToggle raw={raw} show={showRaw} onToggle={() => setShowRaw((s) => !s)} />
      </div>
    </div>
  );
}

// ---------- Allocation form ----------

const ALLOCATION_PRESETS = [
  {
    label: "Tier-2 broker, 2BR, standard plan (clean approval)",
    request: {
      brokerFirm: "Better Homes",
      brokerTier: 2,
      unitId: "T1-04-02",
      paymentPlan: "pp-60-40",
      prospectIdentifier: "+971-50-XXXX-101",
      notes: "First inquiry; standard buyer; cash + mortgage mix.",
    },
  },
  {
    label: "Tier-3 broker requests 30/70 plan (decline — tier-1 only)",
    request: {
      brokerFirm: "[generic tier-3 firm]",
      brokerTier: 3,
      unitId: "T1-04-04",
      paymentPlan: "pp-30-70",
      prospectIdentifier: "+971-50-XXXX-202",
      notes: "Broker pushing for the deferred-payment plan to close the deal.",
    },
  },
  {
    label: "Tier-2 broker requests penthouse (decline — tier-1 only)",
    request: {
      brokerFirm: "Allsopp & Allsopp",
      brokerTier: 2,
      unitId: "T1-04-99-PH",
      paymentPlan: "pp-50-50",
      prospectIdentifier: "+971-50-XXXX-303",
      notes: "HNI prospect; broker would normally route through wealth-channel.",
    },
  },
  {
    label: "Tier-1 broker, penthouse, 50/50 plan (clean approval)",
    request: {
      brokerFirm: "Driven Properties",
      brokerTier: 1,
      unitId: "T1-04-99-PH",
      paymentPlan: "pp-50-50",
      prospectIdentifier: "+971-50-XXXX-404",
      notes: "Repeat buyer; principal-led conversation has matured to the request.",
    },
  },
];

function AllocationMode({ clientSlug }: { clientSlug: string }) {
  const [request, setRequest] = useState({
    brokerFirm: "Better Homes",
    brokerTier: 2,
    unitId: "T1-04-02",
    paymentPlan: "pp-60-40",
    prospectIdentifier: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [decision, setDecision] = useState<AllocationDecision | null>(null);
  const [raw, setRaw] = useState("");
  const [showRaw, setShowRaw] = useState(false);

  const submit = async () => {
    setBusy(true);
    setErr(null);
    setDecision(null);
    try {
      const r = await fetch("/api/simulate-allocation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ clientSlug, request }),
      });
      const j = await r.json();
      if (!r.ok) setErr(j.error ?? `HTTP ${r.status}`);
      else if (j.parseError) {
        setErr(`parse: ${j.parseError}`);
        setRaw(j.raw ?? "");
      } else {
        setDecision(j.decision as AllocationDecision);
        setRaw(j.raw ?? "");
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const decisionTone = (d: string) =>
    d === "approved"
      ? "border-emerald-400/50 bg-emerald-50/40 dark:bg-emerald-950/20"
      : d === "declined"
        ? "border-red-400/50 bg-red-50/40 dark:bg-red-950/20"
        : d === "countered"
          ? "border-amber-400/50 bg-amber-50/40 dark:bg-amber-950/20"
          : "border-blue-400/50 bg-blue-50/40 dark:bg-blue-950/20";

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="text-xs font-mono text-ink-400">presets</div>
        <div className="flex flex-wrap gap-2">
          {ALLOCATION_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setRequest(p.request)}
              disabled={busy}
              className="text-xs px-2.5 py-1 rounded border border-ink-200/70 dark:border-ink-800 hover:border-accent/60"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="broker firm">
            <input
              value={request.brokerFirm}
              onChange={(e) => setRequest({ ...request, brokerFirm: e.target.value })}
              className={INPUT_CLS}
            />
          </Field>
          <Field label="broker tier">
            <select
              value={request.brokerTier}
              onChange={(e) => setRequest({ ...request, brokerTier: Number(e.target.value) })}
              className={INPUT_CLS}
            >
              {[1, 2, 3].map((s) => (
                <option key={s} value={s}>
                  Tier {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="unit id">
            <input
              value={request.unitId}
              onChange={(e) => setRequest({ ...request, unitId: e.target.value })}
              className={INPUT_CLS}
              placeholder="T1-04-02"
            />
          </Field>
          <Field label="payment plan">
            <select
              value={request.paymentPlan}
              onChange={(e) => setRequest({ ...request, paymentPlan: e.target.value })}
              className={INPUT_CLS}
            >
              {["pp-60-40", "pp-50-50", "pp-30-70"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <div className="col-span-2">
            <Field label="prospect identifier (anonymized — phone/email/id)">
              <input
                value={request.prospectIdentifier}
                onChange={(e) => setRequest({ ...request, prospectIdentifier: e.target.value })}
                className={INPUT_CLS}
                placeholder="+971-50-XXXX-XXXX"
              />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="notes">
              <textarea
                value={request.notes}
                onChange={(e) => setRequest({ ...request, notes: e.target.value })}
                rows={3}
                className={INPUT_CLS}
              />
            </Field>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={busy}
          className="rounded-md bg-accent text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {busy ? "processing…" : "Process allocation"}
        </button>
      </div>

      <div className="space-y-3">
        {err && <ErrorBox message={err} />}
        {decision && (
          <div className="space-y-4">
            <div className={`rounded-md border ${decisionTone(decision.decision)} p-4`}>
              <div className="text-xs font-mono uppercase tracking-wider text-ink-400">decision</div>
              <div className="mt-1 text-lg font-semibold">{decision.decision}</div>
              <div className="text-sm mt-2">{decision.rationale}</div>
            </div>

            {decision.checks && (
              <KvBox
                title="checks"
                data={Object.fromEntries(
                  Object.entries(decision.checks).map(([k, v]) => [k, v ? "✓" : "✗"]),
                )}
              />
            )}

            {decision.hold_until_iso && (
              <Box title="hold">
                <div className="text-sm">
                  Held until <span className="font-mono">{decision.hold_until_iso}</span>
                </div>
              </Box>
            )}

            {decision.counter_offer && decision.counter_offer.unit_id && (
              <Box title="counter-offer" tone="warn">
                <div className="text-sm">
                  <span className="font-mono">{decision.counter_offer.unit_id}</span> ·{" "}
                  <span className="font-mono">{decision.counter_offer.payment_plan}</span>
                </div>
                <div className="text-xs text-ink-500 mt-1">{decision.counter_offer.rationale}</div>
              </Box>
            )}

            {decision.escalation_reason && (
              <Box title="escalation" tone="warn">
                <div className="text-sm">{decision.escalation_reason}</div>
              </Box>
            )}

            {decision.next_actions && decision.next_actions.length > 0 && (
              <Box title="next actions">
                <ul className="text-sm list-disc ml-5 space-y-1">
                  {decision.next_actions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </Box>
            )}
          </div>
        )}
        <RawToggle raw={raw} show={showRaw} onToggle={() => setShowRaw((s) => !s)} />
      </div>
    </div>
  );
}

// ---------- Overflow mode (existing route-lead, kept as exception) ----------

function OverflowMode({ clientSlug }: { clientSlug: string }) {
  const [lead, setLead] = useState({
    source: "microsite",
    language: "en",
    segment: "gcc-investor",
    unitType: "2BR",
    priceBandAed: "3.5M-4.5M",
    urgency: "now",
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [decision, setDecision] = useState<OverflowDecision | null>(null);
  const [raw, setRaw] = useState("");
  const [showRaw, setShowRaw] = useState(false);

  const submit = async () => {
    setBusy(true);
    setErr(null);
    setDecision(null);
    try {
      const r = await fetch("/api/route-lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ clientSlug, lead }),
      });
      const j = await r.json();
      if (!r.ok) setErr(j.error ?? `HTTP ${r.status}`);
      else if (j.parseError) {
        setErr(`parse: ${j.parseError}`);
        setRaw(j.raw ?? "");
      } else {
        setDecision(j.decision as OverflowDecision);
        setRaw(j.raw ?? "");
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-amber-300/40 bg-amber-50/40 dark:bg-amber-950/20 px-4 py-3 text-sm">
        <strong>Exception path.</strong> Direct-marketing leads should default to in-house RMs (use
        the "Direct lead" mode). This overflow distribution to brokers only fires when in-house
        capacity is exceeded AND <code className="font-mono">sales/overflow-policy.md</code> opts
        in. Default-deny otherwise.
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="source">
              <input
                value={lead.source}
                onChange={(e) => setLead({ ...lead, source: e.target.value })}
                className={INPUT_CLS}
              />
            </Field>
            <Field label="language">
              <input
                value={lead.language}
                onChange={(e) => setLead({ ...lead, language: e.target.value })}
                className={INPUT_CLS}
              />
            </Field>
            <Field label="segment">
              <input
                value={lead.segment}
                onChange={(e) => setLead({ ...lead, segment: e.target.value })}
                className={INPUT_CLS}
              />
            </Field>
            <Field label="unit type">
              <input
                value={lead.unitType}
                onChange={(e) => setLead({ ...lead, unitType: e.target.value })}
                className={INPUT_CLS}
              />
            </Field>
            <Field label="price band">
              <input
                value={lead.priceBandAed}
                onChange={(e) => setLead({ ...lead, priceBandAed: e.target.value })}
                className={INPUT_CLS}
              />
            </Field>
            <Field label="urgency">
              <input
                value={lead.urgency}
                onChange={(e) => setLead({ ...lead, urgency: e.target.value })}
                className={INPUT_CLS}
              />
            </Field>
            <div className="col-span-2">
              <Field label="notes">
                <textarea
                  value={lead.notes}
                  onChange={(e) => setLead({ ...lead, notes: e.target.value })}
                  rows={3}
                  className={INPUT_CLS}
                />
              </Field>
            </div>
          </div>
          <button
            onClick={submit}
            disabled={busy}
            className="rounded-md bg-accent text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {busy ? "routing…" : "Route via overflow"}
          </button>
        </div>
        <div className="space-y-3">
          {err && <ErrorBox message={err} />}
          {decision?.primary && (
            <div className="rounded-md border border-accent/40 bg-accent/5 p-4">
              <div className="text-xs font-mono uppercase tracking-wider text-ink-400">primary</div>
              <div className="mt-1 text-lg font-semibold">{decision.primary.firm}</div>
              <div className="text-xs font-mono text-ink-500 mt-0.5">
                tier {decision.primary.tier}
              </div>
              <div className="text-sm mt-2">{decision.primary.rationale}</div>
            </div>
          )}
          <RawToggle raw={raw} show={showRaw} onToggle={() => setShowRaw((s) => !s)} />
        </div>
      </div>
    </div>
  );
}

// ---------- Shared types and components ----------

type DirectDecision = {
  primary?: { rm_id: string; rm_name: string; tier: string; rationale: string };
  match_breakdown?: Record<string, unknown>;
  alternatives?: { rm_id: string; rm_name: string; rationale: string }[];
  speed_target_minutes?: number;
  next_actions?: string[];
  anti_patterns_avoided?: string[];
  alerts_raised?: string[];
};

type AllocationDecision = {
  decision: string;
  rationale: string;
  checks?: Record<string, boolean>;
  hold_until_iso?: string;
  counter_offer?: { unit_id?: string; payment_plan?: string; rationale?: string };
  escalation_reason?: string;
  next_actions?: string[];
};

type OverflowDecision = {
  primary?: { firm: string; tier: number; rationale: string };
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-mono text-ink-400">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-red-300/40 bg-red-50/40 dark:bg-red-950/20 px-4 py-3 text-sm">
      error: {message}
    </div>
  );
}

function Box({
  title,
  children,
  tone,
}: {
  title: string;
  children: React.ReactNode;
  tone?: "warn";
}) {
  const cls =
    tone === "warn"
      ? "border-amber-300/40 bg-amber-50/30 dark:bg-amber-950/10"
      : "border-ink-200/70 dark:border-ink-800";
  return (
    <div className={`rounded-md border ${cls} p-4`}>
      <div className="text-xs font-mono uppercase tracking-wider text-ink-400 mb-2">{title}</div>
      {children}
    </div>
  );
}

function KvBox({ title, data }: { title: string; data: Record<string, unknown> }) {
  return (
    <Box title={title}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
        {Object.entries(data).map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <span className="font-mono text-ink-400 text-xs w-44 shrink-0">{k}</span>
            <span>{typeof v === "boolean" ? (v ? "true" : "false") : String(v)}</span>
          </div>
        ))}
      </div>
    </Box>
  );
}

function RawToggle({
  raw,
  show,
  onToggle,
}: {
  raw: string;
  show: boolean;
  onToggle: () => void;
}) {
  if (!raw) return null;
  return (
    <div>
      <button
        onClick={onToggle}
        className="text-xs font-mono text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
      >
        {show ? "hide" : "show"} raw model output
      </button>
      {show && (
        <pre className="mt-2 text-xs font-mono p-3 rounded bg-ink-100 dark:bg-ink-900 overflow-auto max-h-72">
          {raw}
        </pre>
      )}
    </div>
  );
}

// ---------- Top-level shell ----------

export default function RoutingSimulator({ clientSlug }: { clientSlug: string }) {
  const [mode, setMode] = useState<Mode>("direct");
  const meta = MODES.find((m) => m.key === mode)!;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 border-b border-ink-200/70 dark:border-ink-800">
        {MODES.map((m) => {
          const isActive = m.key === mode;
          return (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`px-3 py-2 text-sm border-b-2 -mb-px transition-colors ${
                isActive
                  ? "border-accent text-ink-900 dark:text-ink-50"
                  : "border-transparent text-ink-500 hover:text-ink-800 dark:hover:text-ink-200"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-ink-500 dark:text-ink-400">{meta.description}</p>

      {mode === "direct" && <DirectLeadMode clientSlug={clientSlug} />}
      {mode === "allocation" && <AllocationMode clientSlug={clientSlug} />}
      {mode === "overflow" && <OverflowMode clientSlug={clientSlug} />}
    </div>
  );
}
