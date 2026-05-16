"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Building2,
  CheckCircle2,
  Megaphone,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useIdentity } from "@/lib/identity";
import { navItemsFor, type NavItem } from "@/lib/role-scope";

const ICON_MAP: Record<NavItem["iconKey"], React.ComponentType<{ className?: string }>> = {
  today: Sparkles,
  decisions: CheckCircle2,
  projects: Building2,
  ask: MessageSquare,
  operator: ShieldCheck,
  pod: UsersRound,
  agent: Bot,
  launches: Megaphone,
};

export default function BottomNav() {
  const pathname = usePathname() ?? "/";
  const { identity, hydrated } = useIdentity();
  const baseItems = hydrated
    ? navItemsFor(identity?.role ?? "cco", identity?.agentSlug)
    : navItemsFor("cco", undefined);
  const items = baseItems.slice(0, 5);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      aria-label="Mobile primary"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-ink-200/70 dark:border-ink-800 bg-white/95 dark:bg-ink-950/95 backdrop-blur-md print:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const Icon = ICON_MAP[it.iconKey];
          const active = isActive(it.href);
          return (
            <Link
              key={it.href + it.label}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={[
                "flex flex-col items-center gap-0.5 py-2.5 text-label-xs font-medium transition-colors",
                "min-h-[48px] focus-visible:outline-none focus-visible:bg-ink-100 dark:focus-visible:bg-ink-800",
                active
                  ? "text-accent"
                  : "text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-100",
              ].join(" ")}
            >
              <Icon
                className={["w-5 h-5", active ? "text-accent" : ""].join(" ")}
                aria-hidden
              />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
