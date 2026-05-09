"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useAdvancedMode } from "@/lib/advanced-mode";
import { useIdentity } from "@/lib/identity";
import {
  Bot,
  Building2,
  CheckCircle2,
  FileCode,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Search,
  Sparkles,
  Zap,
  ScrollText,
  BookOpen,
} from "lucide-react";

export type PaletteEntry = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  href: string;
  kind:
    | "navigate"
    | "ask-cco"
    | "client"
    | "agent"
    | "skill"
    | "runbook"
    | "schema"
    | "vertical";
};

const STATIC_ITEMS: PaletteEntry[] = [
  { id: "nav-today", label: "Today", group: "Go to", href: "/cco", kind: "navigate" },
  { id: "nav-decisions", label: "Decisions", group: "Go to", href: "/approvals", kind: "navigate" },
  { id: "nav-projects", label: "Projects", group: "Go to", href: "/workspace/projects", kind: "navigate" },
  { id: "nav-workspaces", label: "All workspaces", group: "Go to", href: "/clients", kind: "navigate" },
  { id: "nav-ask", label: "Ask Flow", group: "Go to", href: "/chat", kind: "navigate" },
  { id: "nav-overview", label: "Overview", group: "Go to", href: "/", kind: "navigate" },
  { id: "nav-agents", label: "Agents", group: "Go to", href: "/agents", kind: "navigate" },
  { id: "nav-verticals", label: "Verticals", group: "Go to", href: "/verticals", kind: "navigate" },
  { id: "nav-schemas", label: "Schemas", group: "Go to", href: "/schemas", kind: "navigate" },
  { id: "nav-search", label: "Search", group: "Go to", href: "/search", kind: "navigate" },

  { id: "chat-brief", label: "Brief me on this morning", hint: "preset", group: "Ask", href: "/chat?q=Brief%20me%20on%20this%20morning", kind: "ask-cco" },
  { id: "chat-attention", label: "What needs me today?", hint: "preset", group: "Ask", href: "/chat?q=What%20needs%20me%20today%3F", kind: "ask-cco" },
  { id: "chat-deals-stuck", label: "Show me stuck deals", hint: "preset", group: "Ask", href: "/chat?q=Show%20me%20deals%20stuck%20more%20than%2014%20days", kind: "ask-cco" },
  { id: "chat-channel-mix", label: "How's our channel mix?", hint: "preset", group: "Ask", href: "/chat?q=How%20has%20channel-mix%20shifted%20this%20week%20vs%20last%3F", kind: "ask-cco" },
  { id: "chat-aged-risks", label: "Show me aged risks", hint: "preset", group: "Ask", href: "/chat?q=Aged%20risks%20open%20more%20than%2030%20days", kind: "ask-cco" },
];

const ICON_BY_KIND: Record<PaletteEntry["kind"], React.ReactNode> = {
  navigate: <LayoutDashboard className="w-4 h-4" />,
  "ask-cco": <Zap className="w-4 h-4" />,
  client: <Building2 className="w-4 h-4" />,
  agent: <Bot className="w-4 h-4" />,
  skill: <BookOpen className="w-4 h-4" />,
  runbook: <ScrollText className="w-4 h-4" />,
  schema: <FileCode className="w-4 h-4" />,
  vertical: <Layers className="w-4 h-4" />,
};

const NAV_ICON_OVERRIDE: Record<string, React.ReactNode> = {
  "nav-cco": <Sparkles className="w-4 h-4" />,
  "nav-chat": <MessageSquare className="w-4 h-4" />,
  "nav-projects": <Building2 className="w-4 h-4" />,
  "nav-workspaces": <Building2 className="w-4 h-4" />,
  "nav-agents": <Bot className="w-4 h-4" />,
  "nav-approvals": <CheckCircle2 className="w-4 h-4" />,
  "nav-verticals": <Layers className="w-4 h-4" />,
  "nav-schemas": <FileCode className="w-4 h-4" />,
  "nav-search": <Search className="w-4 h-4" />,
};

export default function CommandPalette({ entries = [] }: { entries?: PaletteEntry[] }) {
  const router = useRouter();
  const { advanced } = useAdvancedMode();
  const { identity } = useIdentity();
  const isAdmin = identity?.role === "admin";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // In Simple mode, hide power-user kinds (agent / skill / runbook / schema / vertical).
  // Non-admin identities also don't see cross-client surfaces (nav-workspaces, client list entries).
  const visibleEntries = (() => {
    if (!advanced) return isAdmin ? entries.filter((e) => e.kind === "client") : [];
    return isAdmin ? entries : entries.filter((e) => e.kind !== "client");
  })();
  const simpleNavIds = isAdmin
    ? ["nav-today", "nav-decisions", "nav-workspaces", "nav-ask", "nav-overview", "nav-search"]
    : ["nav-today", "nav-decisions", "nav-projects", "nav-ask", "nav-overview", "nav-search"];
  const visibleStatic = (advanced ? STATIC_ITEMS : STATIC_ITEMS.filter(
    (e) => e.kind === "ask-cco" || simpleNavIds.includes(e.id),
  )).filter((e) => {
    if (e.id === "nav-workspaces") return isAdmin;
    if (e.id === "nav-projects") return !isAdmin;
    return true;
  });
  const all = [...visibleStatic, ...visibleEntries];

  const onSelect = (item: PaletteEntry) => {
    setOpen(false);
    setQuery("");
    if (item.href) router.push(item.href);
  };

  if (!open) return null;

  const grouped = all.reduce<Record<string, PaletteEntry[]>>((acc, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {});

  return (
    <div
      role="dialog"
      aria-label="Command palette"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 animate-fade-in"
    >
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div className="relative w-full max-w-xl rounded-card bg-white dark:bg-ink-900 shadow-popover border border-ink-200/70 dark:border-ink-800 overflow-hidden animate-slide-up">
        <Command
          label="Command palette"
          loop
          className="[&_[cmdk-group-heading]]:text-label-xs [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-ink-400 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:bg-ink-50/40 [&_[cmdk-group-heading]]:dark:bg-ink-950/40 [&_[cmdk-group-heading]]:border-y [&_[cmdk-group-heading]]:border-ink-100 [&_[cmdk-group-heading]]:dark:border-ink-800"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-100 dark:border-ink-800">
            <Search className="w-4 h-4 text-ink-400 flex-shrink-0" aria-hidden />
            <Command.Input
              placeholder={
                advanced
                  ? "Search anywhere — clients, agents, runbooks, skills…"
                  : "Where do you want to go?"
              }
              value={query}
              onValueChange={setQuery}
              className="flex-1 bg-transparent border-0 outline-none text-body placeholder:text-ink-400"
              autoFocus
            />
            <kbd className="text-label-xs font-mono px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-500">
              Esc
            </kbd>
          </div>
          <Command.List className="max-h-[420px] overflow-y-auto p-1">
            <Command.Empty className="px-4 py-8 text-center text-body-sm text-ink-400">
              No matches.
            </Command.Empty>
            {Object.entries(grouped).map(([group, groupItems]) => (
              <Command.Group key={group} heading={group}>
                {groupItems.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={`${item.label} ${item.hint ?? ""} ${item.group}`}
                    onSelect={() => onSelect(item)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer text-body-sm aria-selected:bg-ink-100 dark:aria-selected:bg-ink-800"
                  >
                    <span className="text-ink-500 flex-shrink-0" aria-hidden>
                      {NAV_ICON_OVERRIDE[item.id] ?? ICON_BY_KIND[item.kind]}
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.hint && (
                      <span className="text-label-xs font-mono text-ink-400">
                        {item.hint}
                      </span>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
        <div className="px-3 py-2 border-t border-ink-100 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-950/40 flex items-center gap-3 text-label-xs font-mono text-ink-400">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <kbd className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800">⌘ K</kbd>
            to toggle
          </span>
        </div>
      </div>
    </div>
  );
}
