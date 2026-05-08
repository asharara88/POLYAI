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
import DensityToggle from "@/components/DensityToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { FlowMark } from "@/components/FlowLogo";

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
    <header className="border-b border-ink-200/70 dark:border-ink-800 bg-white/85 dark:bg-ink-950/85 backdrop-blur-md sticky top-0 z-30 print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 group"
          aria-label="Flow home"
        >
          <span className="text-accent group-hover:scale-105 transition-transform">
            <FlowMark size={26} />
          </span>
          <span className="font-semibold tracking-tight text-title-sm text-ink-900 dark:text-ink-50 hidden sm:inline">
            Flow
          </span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex gap-0.5 text-body-sm overflow-x-auto flex-1 -mx-1 px-1 scrollbar-thin"
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
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                  active
                    ? "bg-accent/10 text-accent"
                    : it.primary
                      ? "text-accent hover:bg-accent/10"
                      : "text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-50",
                ].join(" ")}
              >
                <span aria-hidden>{it.icon}</span>
                <span className="hidden md:inline">{it.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-1 flex-shrink-0">
          <DensityToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
