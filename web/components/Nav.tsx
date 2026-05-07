"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Bot,
  Layers,
  FileCode,
  CheckCircle2,
  Search,
  Sparkles,
} from "lucide-react";
import { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  primary?: boolean;
};

const items: NavItem[] = [
  { href: "/", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: "/cco", label: "CCO Daily", icon: <Sparkles className="w-4 h-4" />, primary: true },
  { href: "/chat", label: "Chat", icon: <MessageSquare className="w-4 h-4" /> },
  { href: "/clients", label: "Clients", icon: <Users className="w-4 h-4" /> },
  { href: "/agents", label: "Agents", icon: <Bot className="w-4 h-4" /> },
  { href: "/verticals", label: "Verticals", icon: <Layers className="w-4 h-4" /> },
  { href: "/schemas", label: "Schemas", icon: <FileCode className="w-4 h-4" /> },
  { href: "/approvals", label: "Approvals", icon: <CheckCircle2 className="w-4 h-4" /> },
  { href: "/search", label: "Search", icon: <Search className="w-4 h-4" /> },
];

export default function Nav() {
  const pathname = usePathname() ?? "/";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header className="border-b border-ink-200/70 dark:border-ink-800 bg-white/80 dark:bg-ink-950/80 backdrop-blur-md sticky top-0 z-30 print:hidden">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
        <Link
          href="/"
          className="font-mono text-body-sm tracking-tight font-semibold flex items-center gap-1"
          aria-label="POLYAI home"
        >
          POLYAI<span className="text-accent">.</span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex gap-1 text-body-sm overflow-x-auto scrollbar-thin"
        >
          {items.map((it) => {
            const active = isActive(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap",
                  active
                    ? "bg-ink-100 dark:bg-ink-800 text-ink-900 dark:text-ink-50"
                    : it.primary
                      ? "text-accent hover:bg-accent-50 dark:hover:bg-accent-900/30"
                      : "text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-50",
                ].join(" ")}
              >
                <span aria-hidden>{it.icon}</span>
                <span className="hidden sm:inline">{it.label}</span>
              </Link>
            );
          })}
        </nav>
        <span className="ml-auto text-body-xs font-mono text-ink-400 hidden md:inline">
          multi-agent control plane
        </span>
      </div>
    </header>
  );
}
