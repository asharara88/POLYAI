"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

const STORAGE_KEY = "flow-identity";

export type Role = "cco" | "pod-manager" | "specialist" | "viewer" | "admin";

export type Identity = {
  name: string;
  email?: string;
  role: Role;
  organization?: string;
  signedInAt: string;
};

type IdentityContextValue = {
  identity: Identity | null;
  hydrated: boolean;
  signIn: (input: Omit<Identity, "signedInAt">) => void;
  signOut: () => void;
  /** True when an identity is configured (or auth is in demo-mode). */
  ready: boolean;
};

const IdentityContext = createContext<IdentityContextValue | null>(null);

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIdentity(JSON.parse(raw) as Identity);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const signIn = useCallback((input: Omit<Identity, "signedInAt">) => {
    const next: Identity = { ...input, signedInAt: new Date().toISOString() };
    setIdentity(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const signOut = useCallback(() => {
    setIdentity(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<IdentityContextValue>(
    () => ({ identity, hydrated, signIn, signOut, ready: hydrated }),
    [identity, hydrated, signIn, signOut],
  );

  return <IdentityContext.Provider value={value}>{children}</IdentityContext.Provider>;
}

export function useIdentity(): IdentityContextValue {
  const ctx = useContext(IdentityContext);
  if (!ctx) {
    // Safe-default outside of provider — avoids crashes during SSR or in
    // components that don't wrap with the provider.
    return {
      identity: null,
      hydrated: false,
      signIn: () => {},
      signOut: () => {},
      ready: false,
    };
  }
  return ctx;
}

export const ROLE_LABEL: Record<Role, string> = {
  cco: "Chief Commercial Officer",
  "pod-manager": "Pod manager",
  specialist: "Specialist",
  viewer: "Viewer",
  admin: "Administrator",
};
