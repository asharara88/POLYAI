"use client";

import { useState } from "react";

type Decision = {
  primary?: { firm: string; tier: number; rationale: string };
  alternatives?: { firm: string; tier: number; rationale: string }[];
  deferred_segments?: string[];
  speed_target_minutes?: number;
  next_actions?: string[];
  anti_patterns_avoided?: string[];
};

const PRESETS = [
  {
    label: "GCC investor — penthouse interest",
    lead: {
      source: "property-finder",
      language: "ar",
      segment: "gcc-investor",
      unitType: "penthouse",
      priceBandAed: "14M-18M",
      urgency: "now",
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
      notes: "Currently in Bangalore; planning UAE visit next month.",
    },
  },
  {
    label: "UK end-user upgrade",
    lead: {
      source: "rightmove",
      language: "en",
      segment: "diaspora-uk",
      unitType: "3BR",
      priceBandAed: "5.5M-7M",
      urgency: "exploring",
      notes: "Family relocating; school catchment is the deciding factor.",
    },
  },
];

export default function RoutingSimulator({ clientSlug }: { clientSlug: string }) {
  const [lead, setLead] = useState({
    source: "property-finder",
    language: "en",
    segment: "gcc-investor",
    unitType: "2BR",
    priceBandAed: "3.5M-4.5M",
    urgency: "now",
    notes: "",
  });
  const [decision, setDecision] = useState<Decision | null>(null);
  const [raw, setRaw] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);
    setDecision(null);
    try {
      const r = await fetch("/api/route-lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ clientSlug, lead }),
      });
      const j = await r.json();
      if (!r.ok) {
        setError(j.error ?? `HTTP ${r.status}`);
      } else if (j.parseError) {
        setError(`parse: ${j.parseError}`);
        setRaw(j.raw ?? "");
      } else {
        setDecision(j.decision as Decision);
        setRaw(j.raw ?? "");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="text-xs font-mono text-ink-400">presets</div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
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
              className="input"
            >
              {["property-finder", "bayut", "rightmove", "magicbricks", "google-ads", "meta", "linkedin", "whatsapp", "referral", "walk-in"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ),
              )}
            </select>
          </Field>
          <Field label="language">
            <select
              value={lead.language}
              onChange={(e) => setLead({ ...lead, language: e.target.value })}
              className="input"
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
              className="input"
            >
              {["gcc-investor", "diaspora-uk", "diaspora-india", "end-user", "family-office"].map((s) => (
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
              className="input"
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
              className="input"
            />
          </Field>
          <Field label="urgency">
            <select
              value={lead.urgency}
              onChange={(e) => setLead({ ...lead, urgency: e.target.value })}
              className="input"
            >
              {["now", "3-months", "exploring"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <div className="col-span-2">
            <Field label="notes">
              <textarea
                value={lead.notes}
                onChange={(e) => setLead({ ...lead, notes: e.target.value })}
                rows={3}
                className="input"
                placeholder="anything the broker needs to know"
              />
            </Field>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={busy}
          className="rounded-md bg-accent text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {busy ? "routing…" : "Route this lead"}
        </button>
      </div>

      <div className="space-y-3">
        {error && (
          <div className="rounded-md border border-red-300/40 bg-red-50/40 dark:bg-red-950/20 px-4 py-3 text-sm">
            error: {error}
          </div>
        )}

        {decision && (
          <div className="space-y-4">
            {decision.primary && (
              <div className="rounded-md border border-accent/40 bg-accent/5 p-4">
                <div className="text-xs font-mono uppercase tracking-wider text-ink-400">primary</div>
                <div className="mt-1 text-lg font-semibold">{decision.primary.firm}</div>
                <div className="text-xs font-mono text-ink-500 mt-0.5">tier {decision.primary.tier}</div>
                <div className="text-sm mt-2">{decision.primary.rationale}</div>
              </div>
            )}

            {decision.alternatives && decision.alternatives.length > 0 && (
              <div className="rounded-md border border-ink-200/70 dark:border-ink-800 p-4">
                <div className="text-xs font-mono uppercase tracking-wider text-ink-400 mb-2">
                  alternatives
                </div>
                <ul className="space-y-2">
                  {decision.alternatives.map((a, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium">{a.firm}</span>
                      <span className="text-ink-400 font-mono text-xs ml-2">tier {a.tier}</span>
                      <div className="text-ink-500 mt-0.5">{a.rationale}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {decision.next_actions && decision.next_actions.length > 0 && (
              <div className="rounded-md border border-ink-200/70 dark:border-ink-800 p-4">
                <div className="text-xs font-mono uppercase tracking-wider text-ink-400 mb-2">
                  next actions
                </div>
                <ul className="text-sm list-disc ml-5 space-y-1">
                  {decision.next_actions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            {decision.anti_patterns_avoided && decision.anti_patterns_avoided.length > 0 && (
              <div className="rounded-md border border-ink-200/70 dark:border-ink-800 p-4">
                <div className="text-xs font-mono uppercase tracking-wider text-ink-400 mb-2">
                  rules applied
                </div>
                <ul className="text-xs font-mono text-ink-500 space-y-1">
                  {decision.anti_patterns_avoided.map((a, i) => (
                    <li key={i}>· {a}</li>
                  ))}
                </ul>
              </div>
            )}

            {decision.speed_target_minutes != null && (
              <div className="text-xs font-mono text-ink-400">
                speed target: {decision.speed_target_minutes}m
              </div>
            )}
          </div>
        )}

        {raw && (
          <div>
            <button
              onClick={() => setShowRaw((s) => !s)}
              className="text-xs font-mono text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
            >
              {showRaw ? "hide" : "show"} raw model output
            </button>
            {showRaw && (
              <pre className="mt-2 text-xs font-mono p-3 rounded bg-ink-100 dark:bg-ink-900 overflow-auto max-h-72">
                {raw}
              </pre>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid rgb(216 216 222 / 0.7);
          background: white;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
        @media (prefers-color-scheme: dark) {
          .input {
            border-color: #23232a;
            background: #15151a;
            color: #eeeef0;
          }
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-mono text-ink-400">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
