"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, FileCode, Layers, MoreHorizontal, Search } from "lucide-react";
import { useAdvancedMode } from "@/lib/advanced-mode";

const advancedItems = [
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/verticals", label: "Verticals", icon: Layers },
  { href: "/schemas", label: "Schemas", icon: FileCode },
  { href: "/search", label: "Search", icon: Search },
];

const simpleItems = [
  { href: "/search", label: "Search", icon: Search },
];

export default function MoreMenu() {
  const { advanced } = useAdvancedMode();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const items = advanced ? advancedItems : simpleItems;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <MoreHorizontal className="w-4 h-4" aria-hidden />
        <span className="hidden md:inline text-body-sm">More</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-10 w-56 rounded-card border border-ink-200/70 dark:border-ink-800 dark:ring-1 dark:ring-white/[0.06] bg-white dark:bg-ink-900 shadow-popover overflow-hidden animate-slide-up"
        >
          <div className="py-1">
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-body-sm text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                >
                  <Icon className="w-4 h-4 text-ink-400" aria-hidden />
                  <span>{it.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="px-3 py-2 border-t border-ink-100 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-950/40 text-body-xs text-ink-500 flex items-center justify-between">
            <span>{advanced ? "Advanced view" : "Simple view"}</span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-500 font-mono">⌘ K</kbd> to search
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
