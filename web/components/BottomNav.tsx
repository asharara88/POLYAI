"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  CheckCircle2,
  Building2,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { useIdentity } from "@/lib/identity";

const baseItems = [
  { href: "/cco", label: "Today", icon: Sparkles },
  { href: "/approvals", label: "Decisions", icon: CheckCircle2 },
];

const projectsItem = { href: "/workspace/projects", label: "Projects", icon: Building2 };
const clientsItem = { href: "/clients", label: "Clients", icon: Building2 };
const askItem = { href: "/chat", label: "Ask", icon: MessageSquare };
const moreItem = { href: "/agents", label: "More", icon: MoreHorizontal };

export default function BottomNav() {
  const pathname = usePathname() ?? "/";
  const { identity } = useIdentity();
  const isAdmin = identity?.role === "admin";
  const items = [...baseItems, isAdmin ? clientsItem : projectsItem, askItem, moreItem];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      aria-label="Mobile primary"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-ink-200/70 dark:border-ink-800 bg-white/95 dark:bg-ink-950/95 backdrop-blur-md print:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon;
          const active = isActive(it.href);
          return (
            <Link
              key={it.href}
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
