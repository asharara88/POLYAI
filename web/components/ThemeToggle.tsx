"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type Theme = "light" | "dark" | "system";
const STORAGE_KEY = "flow-theme";

const THEME_LABEL: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const THEME_ICON: Record<Theme, React.ReactNode> = {
  light: <Sun className="w-4 h-4" aria-hidden />,
  dark: <Moon className="w-4 h-4" aria-hidden />,
  system: <Monitor className="w-4 h-4" aria-hidden />,
};

const ORDER: Theme[] = ["system", "light", "dark"];

function resolve(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

function apply(theme: Theme) {
  const effective = resolve(theme);
  const root = document.documentElement;
  root.classList.toggle("dark", effective === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = effective;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
    setTheme(saved);
    apply(saved);
    setMounted(true);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      // Re-apply when system theme changes (only if we're following system)
      const current = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
      if (current === "system") apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const cycle = () => {
    const idx = ORDER.indexOf(theme);
    const next = ORDER[(idx + 1) % ORDER.length];
    setTheme(next);
    apply(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  if (!mounted) {
    // SSR-safe placeholder (prevents hydration flash)
    return (
      <button
        type="button"
        aria-label="Loading theme toggle"
        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-ink-400"
      >
        <Monitor className="w-4 h-4" aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${THEME_LABEL[theme]}. Click to cycle.`}
      title={`Theme: ${THEME_LABEL[theme]} (click to cycle)`}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-ink-500 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
    >
      {THEME_ICON[theme]}
      <span className="hidden lg:inline text-label-xs font-mono uppercase tracking-wider">
        {THEME_LABEL[theme]}
      </span>
    </button>
  );
}
