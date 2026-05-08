"use client";

import { useEffect, useState } from "react";

/**
 * useSavedState — localStorage-backed state with safe SSR + initial-paint fallback.
 * Reads from localStorage on mount; persists every change.
 */
export function useSavedState<T>(key: string, defaultValue: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      // ignore — corrupt or unavailable
    }
    setHydrated(true);
  }, [key]);

  const update = (v: T) => {
    setValue(v);
    if (hydrated) {
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch {
        // ignore
      }
    }
  };

  return [value, update];
}
