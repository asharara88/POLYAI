"use client";

import { useEffect, useRef, useState } from "react";
import { LogIn, LogOut, User } from "lucide-react";
import { useIdentity, ROLE_LABEL } from "@/lib/identity";
import SignInModal from "@/components/SignInModal";

function avatarInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

function avatarColor(name: string): string {
  // Hash to a stable accent-blue / neutral palette
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  const palette = [
    "bg-accent text-white",
    "bg-info-600 text-white",
    "bg-success-600 text-white",
    "bg-warning-600 text-white",
    "bg-purple-600 text-white",
    "bg-pink-600 text-white",
  ];
  return palette[Math.abs(h) % palette.length];
}

export default function UserMenu() {
  const { identity, hydrated, signOut } = useIdentity();
  const [open, setOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!hydrated) {
    return (
      <button
        type="button"
        aria-label="Loading user menu"
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink-100 dark:bg-ink-800"
      >
        <User className="w-4 h-4 text-ink-400" aria-hidden />
      </button>
    );
  }

  if (!identity) {
    return (
      <>
        <button
          type="button"
          onClick={() => setSignInOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-label-xs font-mono uppercase tracking-wider text-ink-600 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <LogIn className="w-3.5 h-3.5" aria-hidden />
          <span className="hidden lg:inline">Sign in</span>
        </button>
        <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
      </>
    );
  }

  const initials = avatarInitials(identity.name);
  const color = avatarColor(identity.name);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`User menu — ${identity.name}`}
        className="inline-flex items-center gap-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <span
          className={[
            "inline-flex items-center justify-center w-8 h-8 rounded-full text-label-sm font-semibold",
            color,
          ].join(" ")}
          aria-hidden
        >
          {initials || "?"}
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-10 w-64 rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-popover overflow-hidden animate-slide-up"
        >
          <div className="px-3 py-3 border-b border-ink-100 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-950/40 flex items-center gap-3">
            <span
              className={[
                "inline-flex items-center justify-center w-10 h-10 rounded-full text-body font-semibold",
                color,
              ].join(" ")}
              aria-hidden
            >
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-body-sm font-semibold truncate">{identity.name}</div>
              <div className="text-body-xs text-ink-500 truncate">
                {ROLE_LABEL[identity.role]}
              </div>
              {identity.organization && (
                <div className="text-label-xs font-mono text-ink-400 truncate mt-0.5">
                  {identity.organization}
                </div>
              )}
            </div>
          </div>
          {identity.email && (
            <div className="px-3 py-2 text-body-xs text-ink-500 border-b border-ink-100 dark:border-ink-800">
              {identity.email}
            </div>
          )}
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                signOut();
                setOpen(false);
              }}
              role="menuitem"
              className="w-full inline-flex items-center gap-2 px-3 py-2 text-body-sm text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-ink-400" aria-hidden />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
