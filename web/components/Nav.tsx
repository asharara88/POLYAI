"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import UserMenu, { type WorkspaceOption } from "@/components/UserMenu";
import MoreMenu from "@/components/MoreMenu";
import { FlowMark } from "@/components/FlowLogo";
import { useIdentity } from "@/lib/identity";

const baseItems = [
  { href: "/cco", label: "Today", icon: Sparkles },
  { href: "/approvals", label: "Decisions", icon: CheckCircle2 },
];

const projectsItem = { href: "/workspace/projects", label: "Projects", icon: Building2 };
const clientsItem = { href: "/clients", label: "Clients", icon: Building2 };
const askItem = { href: "/chat", label: "Ask", icon: MessageSquare };

export default function Nav({ workspaces = [] }: { workspaces?: WorkspaceOption[] }) {
  const pathname = usePathname() ?? "/";
  const { identity } = useIdentity();
  const isAdmin = identity?.role === "admin";
  const items = [...baseItems, isAdmin ? clientsItem : projectsItem, askItem];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="border-b border-ink-200/70 dark:border-ink-800 bg-white/85 dark:bg-ink-950/85 backdrop-blur-md sticky top-0 z-30 print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 lg:gap-5">
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
          className="flex gap-1 text-body-sm flex-1 justify-center md:justify-start"
        >
          {items.map((it) => {
            const Icon = it.icon;
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
          <MoreMenu />
          <span className="w-px h-5 bg-ink-200 dark:bg-ink-800 mx-1" aria-hidden />
          <UserMenu workspaces={workspaces} />
        </div>
      </div>
    </header>
  );
}
