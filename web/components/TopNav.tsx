"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Building2,
  CheckCircle2,
  Megaphone,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";
import UserMenu from "@/components/UserMenu";
import MoreMenu from "@/components/MoreMenu";
import { WorkspaceMark } from "@/components/WorkspaceMark";
import { useIdentity } from "@/lib/identity";
import { navItemsFor, type NavItem } from "@/lib/role-scope";

const ICON_MAP: Record<NavItem["iconKey"], React.ComponentType<{ className?: string }>> = {
  today: Sparkles,
  launches: Megaphone,
  clients: Building2,
  decisions: CheckCircle2,
  agent: Bot,
  ask: MessageSquare,
};

export default function TopNav() {
  const pathname = usePathname() ?? "/";
  const { identity, hydrated } = useIdentity();
  const items = navItemsFor();
  const isAdmin = hydrated && identity?.role === "admin";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="border-b border-ink-200/70 dark:border-ink-800 bg-white/85 dark:bg-ink-950/85 backdrop-blur-md sticky top-0 z-30 print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 lg:gap-5">
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 group"
          aria-label="Flow — home"
        >
          <span className="text-accent group-hover:scale-105 transition-transform">
            <WorkspaceMark size={26} />
          </span>
          <span className="font-semibold tracking-tight text-title-sm text-ink-900 dark:text-ink-50 hidden sm:inline">
            Flow
          </span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex gap-1 text-body-sm flex-1 justify-center md:justify-start"
        >
          {items.map((it) => {
            const Icon = ICON_MAP[it.iconKey];
            const active = isActive(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "inline-flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                  active
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-50",
                ].join(" ")}
              >
                <Icon className="w-4 h-4" aria-hidden />
                <span className="hidden sm:inline">{it.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-1 flex-shrink-0">
          {isAdmin && (
            <Link
              href="/operator"
              aria-label="Operator settings"
              className={[
                "inline-flex items-center justify-center w-9 h-9 rounded-md transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                isActive("/operator")
                  ? "bg-accent/10 text-accent"
                  : "text-ink-500 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-50",
              ].join(" ")}
            >
              <Settings className="w-4 h-4" aria-hidden />
            </Link>
          )}
          <MoreMenu />
          <span className="w-px h-5 bg-ink-200 dark:bg-ink-800 mx-1" aria-hidden />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
