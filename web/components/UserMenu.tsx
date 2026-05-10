"use client";

import { useEffect, useRef, useState } from "react";
import { LogIn, LogOut, Monitor, Moon, Sun, User } from "lucide-react";
import { useIdentity, ROLE_LABEL } from "@/lib/identity";
import { useAdvancedMode } from "@/lib/advanced-mode";
import SignInModal from "@/components/SignInModal";

type Theme = "light" | "dark" | "system";
type Density = "compact" | "cozy" | "comfortable";

const THEME_KEY = "flow-theme";
const DENSITY_KEY = "flow-density";

function avatarInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

function avatarColor(name: string): string {
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

function applyTheme(t: Theme) {
  const html = document.documentElement;
  const dark =
    t === "dark" ||
    (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  html.classList.toggle("dark", dark);
  html.style.colorScheme = dark ? "dark" : "light";
  html.dataset.theme = t;
}

function applyDensity(d: Density) {
  document.documentElement.dataset.density = d;
}

function SegmentedPicker<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; icon?: React.ReactNode }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="px-3 py-2">
      <div className="text-label-xs font-mono uppercase tracking-wider text-ink-400 mb-1.5">
        {label}
      </div>
      <div role="radiogroup" aria-label={label} className="inline-flex w-full rounded-md border border-ink-200 dark:border-ink-700 overflow-hidden">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={[
                "flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-body-xs font-medium transition-colors",
                active
                  ? "bg-accent text-white"
                  : "text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800",
              ].join(" ")}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function UserMenu() {
  const { identity, hydrated, signOut } = useIdentity();
  const { advanced, setAdvanced } = useAdvancedMode();
  const [open, setOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");
  const [density, setDensity] = useState<Density>("comfortable");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = (localStorage.getItem(THEME_KEY) as Theme | null) ?? "system";
    const d =
      (localStorage.getItem(DENSITY_KEY) as Density | null) ??
      (localStorage.getItem("polyai-density") as Density | null) ??
      "comfortable";
    setTheme(t);
    setDensity(d);
    applyTheme(t);
    applyDensity(d);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const onTheme = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
    localStorage.setItem(THEME_KEY, t);
  };

  const onDensity = (d: Density) => {
    setDensity(d);
    applyDensity(d);
    localStorage.setItem(DENSITY_KEY, d);
  };

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

  const initials = identity ? avatarInitials(identity.name) : "";
  const color = identity ? avatarColor(identity.name) : "bg-ink-200 dark:bg-ink-800 text-ink-600 dark:text-ink-300";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={identity ? `User menu — ${identity.name}` : "Sign in"}
        className="inline-flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <span
          className={[
            "inline-flex items-center justify-center w-8 h-8 rounded-full text-label-sm font-semibold",
            color,
          ].join(" ")}
          aria-hidden
        >
          {identity ? initials : <User className="w-4 h-4" />}
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-10 w-72 rounded-card border border-ink-200/70 dark:border-ink-800 dark:ring-1 dark:ring-white/[0.06] bg-white dark:bg-ink-900 shadow-popover overflow-hidden animate-slide-up"
        >
          {identity ? (
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
          ) : (
            <button
              type="button"
              onClick={() => {
                setSignInOpen(true);
                setOpen(false);
              }}
              role="menuitem"
              className="w-full flex items-center gap-2.5 px-3 py-3 border-b border-ink-100 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-950/40 text-body-sm font-medium hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
            >
              <LogIn className="w-4 h-4 text-accent" aria-hidden />
              <span>Sign in to Aldar</span>
            </button>
          )}

          <SegmentedPicker<Theme>
            label="Theme"
            value={theme}
            options={[
              { value: "system", label: "Auto", icon: <Monitor className="w-3.5 h-3.5" /> },
              { value: "light", label: "Light", icon: <Sun className="w-3.5 h-3.5" /> },
              { value: "dark", label: "Dark", icon: <Moon className="w-3.5 h-3.5" /> },
            ]}
            onChange={onTheme}
          />

          <SegmentedPicker<Density>
            label="Density"
            value={density}
            options={[
              { value: "comfortable", label: "Comfortable" },
              { value: "cozy", label: "Cozy" },
              { value: "compact", label: "Compact" },
            ]}
            onChange={onDensity}
          />

          <SegmentedPicker<"simple" | "advanced">
            label="View"
            value={advanced ? "advanced" : "simple"}
            options={[
              { value: "simple", label: "Simple" },
              { value: "advanced", label: "Advanced" },
            ]}
            onChange={(v) => setAdvanced(v === "advanced")}
          />
          <div className="px-3 pb-2 text-body-xs text-ink-500 dark:text-ink-400">
            {advanced
              ? "Advanced shows agents, runbooks, skills, schemas."
              : "Simple hides power-user surfaces."}
          </div>

          {identity && (
            <div className="border-t border-ink-100 dark:border-ink-800 py-1">
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
          )}
        </div>
      )}
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  );
}
