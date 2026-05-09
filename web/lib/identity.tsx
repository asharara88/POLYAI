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
const WORKSPACE_COOKIE = "flow-workspace";
const DEFAULT_WORKSPACE = "aldar-developments";

export type Role = "cco" | "pod-manager" | "specialist" | "viewer" | "admin";

export type Identity = {
  name: string;
  email?: string;
  role: Role;
  organization?: string;
  workspace?: string; // client slug bound to this identity; undefined for admin (cross-client)
  signedInAt: string;
};

type IdentityContextValue = {
  identity: Identity | null;
  hydrated: boolean;
  signIn: (input: Omit<Identity, "signedInAt">) => void;
  signOut: () => void;
  setWorkspace: (slug: string | null) => void;
  /** True when an identity is configured (or auth is in demo-mode). */
  ready: boolean;
};

const IdentityContext = createContext<IdentityContextValue | null>(null);

function setWorkspaceCookie(slug: string | undefined | null) {
  if (typeof document === "undefined") return;
  if (!slug) {
    // Admin / cross-client — clear the cookie so middleware redirects /workspace → /clients
    document.cookie = `${WORKSPACE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    return;
  }
  document.cookie = `${WORKSPACE_COOKIE}=${encodeURIComponent(
    slug,
  )}; path=/; max-age=31536000; SameSite=Lax`;
}

function defaultWorkspaceForRole(role: Role): string | undefined {
  if (role === "admin") return undefined;
  return DEFAULT_WORKSPACE;
}

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Identity;
        // Backfill workspace for identities saved before the field existed
        if (parsed.workspace === undefined && parsed.role !== "admin") {
          parsed.workspace = DEFAULT_WORKSPACE;
        }
        setIdentity(parsed);
        setWorkspaceCookie(parsed.workspace);
      } else {
        // Signed-out demo visitor — pin to the default workspace so /workspace works
        setWorkspaceCookie(DEFAULT_WORKSPACE);
      }
    } catch {
      setWorkspaceCookie(DEFAULT_WORKSPACE);
    }
    setHydrated(true);
  }, []);

  const signIn = useCallback((input: Omit<Identity, "signedInAt">) => {
    const workspace =
      input.workspace !== undefined ? input.workspace : defaultWorkspaceForRole(input.role);
    const next: Identity = {
      ...input,
      workspace,
      signedInAt: new Date().toISOString(),
    };
    setIdentity(next);
    setWorkspaceCookie(workspace);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const signOut = useCallback(() => {
    setIdentity(null);
    // Signed out — fall back to demo-default workspace so the site stays browsable
    setWorkspaceCookie(DEFAULT_WORKSPACE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const setWorkspace = useCallback((slug: string | null) => {
    setWorkspaceCookie(slug ?? undefined);
    setIdentity((current) => {
      if (!current) return current;
      const next: Identity = { ...current, workspace: slug ?? undefined };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const value = useMemo<IdentityContextValue>(
    () => ({ identity, hydrated, signIn, signOut, setWorkspace, ready: hydrated }),
    [identity, hydrated, signIn, signOut, setWorkspace],
  );

  return <IdentityContext.Provider value={value}>{children}</IdentityContext.Provider>;
}

export function useIdentity(): IdentityContextValue {
  const ctx = useContext(IdentityContext);
  if (!ctx) {
    return {
      identity: null,
      hydrated: false,
      signIn: () => {},
      signOut: () => {},
      setWorkspace: () => {},
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

export { DEFAULT_WORKSPACE };
