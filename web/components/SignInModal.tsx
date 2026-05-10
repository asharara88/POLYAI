"use client";

import { useState } from "react";
import { LogIn, X } from "lucide-react";
import { Button } from "@/components/ui";
import { ROLE_LABEL, useIdentity, type Role } from "@/lib/identity";
import { AldarMark } from "@/components/AldarMark";
import { FlowMark } from "@/components/FlowLogo";

// Roles available via public sign-in. `admin` is granted only via the hidden
// /operator entrypoint — not exposed in the workspace sign-in modal.
const PUBLIC_ROLES: Role[] = ["cco", "pod-manager", "specialist", "viewer"];

export default function SignInModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { signIn } = useIdentity();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState<Role>("cco");

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    signIn({
      name: name.trim(),
      email: email.trim() || undefined,
      organization: organization.trim() || undefined,
      role,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 animate-fade-in"
    >
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-card bg-white dark:bg-ink-900 shadow-popover border border-ink-200/70 dark:border-ink-800 overflow-hidden animate-slide-up">
        <header className="px-5 py-4 border-b border-ink-100 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-accent">
              <AldarMark size={22} />
            </span>
            <h2 id="signin-title" className="text-title-sm font-semibold tracking-tight">
              Sign in to Aldar Developments
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <form onSubmit={submit} className="px-5 py-4 space-y-4">
          <p className="text-body-sm text-ink-500 dark:text-ink-400">
            Identity is used to attribute decision-ask signatures, comments, and
            audit-trail entries. Your identity is stored locally on this device.
            Connect GitHub OAuth via env vars to upgrade to verified sign-in.
          </p>

          <label className="block">
            <span className="text-label-xs font-mono uppercase tracking-wider text-ink-400">
              Name *
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder="e.g. Jane Doe"
              className="mt-1 w-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-md px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>

          <label className="block">
            <span className="text-label-xs font-mono uppercase tracking-wider text-ink-400">
              Email (optional)
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@aldar.ae"
              className="mt-1 w-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-md px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>

          <label className="block">
            <span className="text-label-xs font-mono uppercase tracking-wider text-ink-400">
              Organization (optional)
            </span>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Aldar Developments"
              className="mt-1 w-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-md px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>

          <label className="block">
            <span className="text-label-xs font-mono uppercase tracking-wider text-ink-400">
              Role
            </span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="mt-1 w-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 rounded-md px-3 py-2 text-body-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              {PUBLIC_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-md bg-info-50 dark:bg-info-950/30 border border-info-200 dark:border-info-900/40 px-3 py-2 text-body-xs text-info-700 dark:text-info-300">
            <strong>Demo mode.</strong> Identity is local-only. For production, connect
            GitHub OAuth via NextAuth + AUTH_SECRET in Vercel env. Decision-ask commits
            already carry the signer name in their git message regardless.
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              startIcon={<LogIn className="w-3.5 h-3.5" />}
              disabled={!name.trim()}
            >
              Sign in
            </Button>
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>

        <footer className="px-5 py-3 border-t border-ink-100 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-950/40 flex items-center justify-between gap-3 text-body-xs text-ink-500 dark:text-ink-400">
          <span className="leading-snug">
            Worked example — illustrative. Not real Aldar Properties PJSC data.
          </span>
          <span className="inline-flex items-center gap-1.5 flex-shrink-0">
            Built on
            <span className="text-accent">
              <FlowMark size={12} />
            </span>
            <span className="font-medium text-ink-600 dark:text-ink-300">Flow</span>
          </span>
        </footer>
      </div>
    </div>
  );
}
