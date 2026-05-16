"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui";
import { useIdentity } from "@/lib/identity";

/**
 * Gate for the hidden /operator surface. Worked-example deployment grants
 * admin via a self-promote button so the framework views remain reachable
 * without an SSO layer; production would replace this with verified auth.
 */
export default function AdminPortalGate({ children }: { children: React.ReactNode }) {
  const { identity, hydrated, signIn } = useIdentity();
  const [confirmed, setConfirmed] = useState(false);

  if (!hydrated) {
    return (
      <div className="rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-6 text-body-sm text-ink-500">
        Loading…
      </div>
    );
  }

  if (identity?.role === "admin") {
    return <>{children}</>;
  }

  const promote = () => {
    if (identity) {
      // Re-sign in with the admin role; cookie clears so middleware stops
      // pinning to a single workspace.
      signIn({ ...identity, role: "admin", workspace: undefined });
    } else {
      signIn({
        name: "Operator",
        role: "admin",
        organization: "Platform team",
        workspace: undefined,
      });
    }
    setConfirmed(true);
  };

  return (
    <div className="max-w-md mx-auto rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-card bg-warning-50 dark:bg-warning-950/40 text-warning-600 dark:text-warning-400">
          <ShieldCheck className="w-5 h-5" aria-hidden />
        </span>
        <div>
          <h1 className="text-title-sm font-semibold tracking-tight">
            Super-admin only
          </h1>
          <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5">
            This surface is not part of the the workspace.
          </p>
        </div>
      </div>
      <p className="text-body-sm text-ink-600 dark:text-ink-300 leading-relaxed">
        The <code className="font-mono text-label-xs px-1 py-0.5 rounded bg-ink-100 dark:bg-ink-800">/operator</code>{" "}
        portal exposes the framework views (workspaces, agents, runbooks, skills,
        schemas, verticals) and the workspace switcher used by the platform team
        and the developer's IT to operate the deployment.
      </p>
      <div className="rounded-md bg-info-50 dark:bg-info-950/30 border border-info-200 dark:border-info-900/40 px-3 py-2 text-body-xs text-info-700 dark:text-info-300">
        Worked-example deployment — admin is self-grant. Production replaces
        this with SSO + verified role mapping.
      </div>
      <Button onClick={promote} variant="primary" size="md">
        {confirmed ? "Granted — refresh to enter" : "Grant admin to this device"}
      </Button>
    </div>
  );
}
