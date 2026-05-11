"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

/**
 * Single-source ID exclusion list for the /cco page.
 *
 * CcoNow surfaces a top-N of items (top ask, top risk, top calendar event).
 * Once it has chosen them, it registers their IDs here so the queues below
 * (DecisionAsksQueue / RiskRegister / CcoCalendar) can filter them out —
 * killing the 2–3× duplication on /cco.
 */

export type DedupeKind = "ask" | "risk" | "calendar";

type Bucket = Set<string>;

type Ctx = {
  excluded: Record<DedupeKind, ReadonlySet<string>>;
  registerExcluded: (kind: DedupeKind, ids: string[]) => void;
};

const noop: Ctx = {
  excluded: { ask: new Set(), risk: new Set(), calendar: new Set() },
  registerExcluded: () => {},
};

const CcoDedupeContext = createContext<Ctx>(noop);

export function CcoDedupeProvider({ children }: { children: ReactNode }) {
  const [askSet, setAskSet] = useState<Bucket>(() => new Set());
  const [riskSet, setRiskSet] = useState<Bucket>(() => new Set());
  const [calSet, setCalSet] = useState<Bucket>(() => new Set());

  const registerExcluded = useCallback((kind: DedupeKind, ids: string[]) => {
    const next = new Set(ids.filter(Boolean));
    if (kind === "ask") {
      setAskSet((prev) => setsEqual(prev, next) ? prev : next);
    } else if (kind === "risk") {
      setRiskSet((prev) => setsEqual(prev, next) ? prev : next);
    } else if (kind === "calendar") {
      setCalSet((prev) => setsEqual(prev, next) ? prev : next);
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      excluded: { ask: askSet, risk: riskSet, calendar: calSet },
      registerExcluded,
    }),
    [askSet, riskSet, calSet, registerExcluded],
  );

  return <CcoDedupeContext.Provider value={value}>{children}</CcoDedupeContext.Provider>;
}

export function useCcoDedupe(): Ctx {
  return useContext(CcoDedupeContext);
}

function setsEqual<T>(a: Set<T>, b: Set<T>): boolean {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}
