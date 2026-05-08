"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "flow-advanced";

type AdvancedModeContextValue = {
  advanced: boolean;
  setAdvanced: (v: boolean) => void;
  toggle: () => void;
  hydrated: boolean;
};

const AdvancedModeContext = createContext<AdvancedModeContextValue | null>(null);

export function AdvancedModeProvider({ children }: { children: ReactNode }) {
  const [advanced, setAdvancedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "true") setAdvancedState(true);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Reflect mode on <html> for any CSS hooks
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.advanced = advanced ? "true" : "false";
    }
  }, [advanced]);

  const setAdvanced = useCallback((v: boolean) => {
    setAdvancedState(v);
    try {
      localStorage.setItem(STORAGE_KEY, String(v));
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setAdvanced(!advanced);
  }, [advanced, setAdvanced]);

  const value = useMemo<AdvancedModeContextValue>(
    () => ({ advanced, setAdvanced, toggle, hydrated }),
    [advanced, setAdvanced, toggle, hydrated],
  );

  return (
    <AdvancedModeContext.Provider value={value}>
      {children}
    </AdvancedModeContext.Provider>
  );
}

export function useAdvancedMode(): AdvancedModeContextValue {
  const ctx = useContext(AdvancedModeContext);
  if (!ctx) {
    return { advanced: false, setAdvanced: () => {}, toggle: () => {}, hydrated: false };
  }
  return ctx;
}
