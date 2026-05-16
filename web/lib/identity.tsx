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
const IDENTITY_COOKIE = "flow-identity";
const DEFAULT_WORKSPACE = "uae-developments";

export type Role = "admin" | "cco" | "manager" | "specialist" | "viewer";

export type Identity = {
  name: string;
  email?: string;
  role: Role;
  /** Slug of the .claude/agents/*.md definition this identity maps to. Required for manager/specialist; null for admin/cco/viewer. */
  agentSlug?: string;
  organization?: string;
  /** Client slug this identity is bound to. Undefined for admin (cross-client). */
  workspace?: string;
  signedInAt: string;
};

type IdentityContextValue = {
  identity: Identity | null;
  hydrated: boolean;
  signIn: (input: Omit<Identity, "signedInAt">) => void;
  signOut: () => void;
  setWorkspace: (slug: string | null) => void;
  /** Admin role-switcher: replace the current identity wholesale (used by /operator AdminRoleSwitcher). */
  replaceIdentity: (next: Omit<Identity, "signedInAt">) => void;
  ready: boolean;
};

const IdentityContext = createContext<IdentityContextValue | null>(null);

function setWorkspaceCookie(slug: string | undefined | null) {
  if (typeof document === "undefined") return;
  if (!slug) {
    document.cookie = `${WORKSPACE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    return;
  }
  document.cookie = `${WORKSPACE_COOKIE}=${encodeURIComponent(
    slug,
  )}; path=/; max-age=31536000; SameSite=Lax`;
}

function setIdentityCookie(identity: Identity | null) {
  if (typeof document === "undefined") return;
  if (!identity) {
    document.cookie = `${IDENTITY_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    return;
  }
  // Compact, cookie-safe encoding for server-side reads (the API needs agentSlug + role).
  const compact = {
    r: identity.role,
    a: identity.agentSlug ?? null,
    w: identity.workspace ?? null,
  };
  document.cookie = `${IDENTITY_COOKIE}=${encodeURIComponent(
    JSON.stringify(compact),
  )}; path=/; max-age=31536000; SameSite=Lax`;
}

function defaultWorkspaceForRole(role: Role): string | undefined {
  if (role === "admin") return undefined;
  return DEFAULT_WORKSPACE;
}

/** Migrate legacy role strings to the current Role union. */
function migrateRole(raw: unknown): Role {
  if (raw === "pod-manager") return "manager";
  if (
    raw === "admin" ||
    raw === "cco" ||
    raw === "manager" ||
    raw === "specialist" ||
    raw === "viewer"
  ) {
    return raw;
  }
  return "cco";
}

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const role = migrateRole(parsed.role);
        const upgraded: Identity = {
          name: (parsed.name as string) ?? "Anonymous",
          email: parsed.email as string | undefined,
          role,
          agentSlug: parsed.agentSlug as string | undefined,
          organization: parsed.organization as string | undefined,
          workspace:
            (parsed.workspace as string | undefined) ??
            (role === "admin" ? undefined : DEFAULT_WORKSPACE),
          signedInAt:
            (parsed.signedInAt as string) ?? new Date().toISOString(),
        };
        setIdentity(upgraded);
        setWorkspaceCookie(upgraded.workspace);
        setIdentityCookie(upgraded);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(upgraded));
        } catch {}
      } else {
        setWorkspaceCookie(DEFAULT_WORKSPACE);
        setIdentityCookie(null);
      }
    } catch {
      setWorkspaceCookie(DEFAULT_WORKSPACE);
      setIdentityCookie(null);
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Identity | null) => {
    setIdentity(next);
    setWorkspaceCookie(next?.workspace);
    setIdentityCookie(next);
    try {
      if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const signIn = useCallback(
    (input: Omit<Identity, "signedInAt">) => {
      const workspace =
        input.workspace !== undefined
          ? input.workspace
          : defaultWorkspaceForRole(input.role);
      const next: Identity = {
        ...input,
        workspace,
        signedInAt: new Date().toISOString(),
      };
      persist(next);
    },
    [persist],
  );

  const signOut = useCallback(() => {
    persist(null);
    setWorkspaceCookie(DEFAULT_WORKSPACE);
  }, [persist]);

  const setWorkspace = useCallback((slug: string | null) => {
    setIdentity((current) => {
      if (!current) {
        setWorkspaceCookie(slug ?? undefined);
        return current;
      }
      const next: Identity = { ...current, workspace: slug ?? undefined };
      setWorkspaceCookie(next.workspace);
      setIdentityCookie(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const replaceIdentity = useCallback(
    (input: Omit<Identity, "signedInAt">) => {
      const workspace =
        input.workspace !== undefined
          ? input.workspace
          : defaultWorkspaceForRole(input.role);
      const next: Identity = {
        ...input,
        workspace,
        signedInAt: new Date().toISOString(),
      };
      persist(next);
    },
    [persist],
  );

  const value = useMemo<IdentityContextValue>(
    () => ({
      identity,
      hydrated,
      signIn,
      signOut,
      setWorkspace,
      replaceIdentity,
      ready: hydrated,
    }),
    [identity, hydrated, signIn, signOut, setWorkspace, replaceIdentity],
  );

  return (
    <IdentityContext.Provider value={value}>{children}</IdentityContext.Provider>
  );
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
      replaceIdentity: () => {},
      ready: false,
    };
  }
  return ctx;
}

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrator",
  cco: "Chief Commercial Officer",
  manager: "Pod Manager",
  specialist: "Specialist",
  viewer: "Viewer",
};

export { DEFAULT_WORKSPACE, IDENTITY_COOKIE };
