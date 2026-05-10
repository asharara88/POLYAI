"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIdentity } from "@/lib/identity";

/**
 * Client-side redirect for surfaces that should not appear to non-admin
 * identities. Reads identity from context (localStorage-backed) after
 * hydration, then replaces the current route with the target.
 */
export default function NonAdminRedirect({ to = "/" }: { to?: string }) {
  const router = useRouter();
  const { identity, hydrated } = useIdentity();

  useEffect(() => {
    if (!hydrated) return;
    // No identity yet (signed-out demo visitor) → still treat as workspace user
    if (!identity || identity.role !== "admin") {
      router.replace(to);
    }
  }, [hydrated, identity, router, to]);

  return null;
}
