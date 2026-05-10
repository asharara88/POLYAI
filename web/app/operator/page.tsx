import Link from "next/link";
import {
  Bot,
  Building2,
  FileCode,
  Layers,
  ScrollText,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { getClients } from "@/lib/content";
import AdminPortalGate from "@/components/AdminPortalGate";
import AdminWorkspaceSwitcher from "@/components/AdminWorkspaceSwitcher";

export const dynamic = "force-static";

const FRAMEWORK_LINKS = [
  {
    href: "/clients",
    label: "Clients",
    description: "Workspace picker — every configured engagement.",
    icon: Building2,
  },
  {
    href: "/agents",
    label: "Agents",
    description: "Specialist agents that operate the pods.",
    icon: Bot,
  },
  {
    href: "/runbooks",
    label: "Runbooks",
    description: "Single-owner playbooks for cross-pod scenarios.",
    icon: ScrollText,
  },
  {
    href: "/skills",
    label: "Skills",
    description: "Framework-level reference material.",
    icon: BookOpen,
  },
  {
    href: "/schemas",
    label: "Schemas",
    description: "Hand-off envelopes and shared contracts.",
    icon: FileCode,
  },
  {
    href: "/verticals",
    label: "Verticals",
    description: "Industry default playbooks.",
    icon: Layers,
  },
];

export default function AdminPortalPage() {
  const workspaces = getClients()
    .filter((c) => !c.isTemplate)
    .map((c) => ({ slug: c.slug, name: c.displayName ?? c.slug, isExample: c.isExample }));

  return (
    <AdminPortalGate>
      <div className="space-y-10">
        <header className="flex items-start gap-3 flex-wrap">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-card bg-warning-50 dark:bg-warning-950/40 text-warning-600 dark:text-warning-400 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" aria-hidden />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-label-xs font-mono uppercase tracking-wider text-warning-600 dark:text-warning-400">
              Super-admin
            </div>
            <h1 className="text-display font-semibold tracking-tight mt-1">
              Flow operator portal
            </h1>
            <p className="text-body text-ink-600 dark:text-ink-300 mt-2 max-w-2xl leading-relaxed">
              Back-of-house tools for the Flow team and Aldar IT. Workspace
              switcher, framework views, identity state. Not part of the Aldar
              workspace and not surfaced in nav, palette, or sitemap.
            </p>
          </div>
        </header>

        <section
          aria-labelledby="workspace-section"
          className="rounded-card border border-ink-200/70 dark:border-ink-800 dark:ring-1 dark:ring-white/[0.06] bg-white dark:bg-ink-900 shadow-card p-5 sm:p-6"
        >
          <h2
            id="workspace-section"
            className="text-title-sm font-semibold tracking-tight"
          >
            Workspace
          </h2>
          <p className="text-body-sm text-ink-600 dark:text-ink-300 mt-1 leading-relaxed">
            Single-tenant deployment is pinned to Aldar Developments. Switching
            here updates the workspace cookie used by the proxy to resolve{" "}
            <code className="font-mono text-label-xs px-1 py-0.5 rounded bg-ink-100 dark:bg-ink-800">
              /workspace/*
            </code>{" "}
            routes.
          </p>
          <div className="mt-4">
            <AdminWorkspaceSwitcher workspaces={workspaces} />
          </div>
        </section>

        <section aria-labelledby="framework-section">
          <h2
            id="framework-section"
            className="text-title-sm font-semibold tracking-tight"
          >
            Framework views
          </h2>
          <p className="text-body-sm text-ink-600 dark:text-ink-300 mt-1 leading-relaxed">
            The cross-engagement reference surfaces. Reachable directly via URL
            but intentionally not linked from the public Aldar workspace.
          </p>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FRAMEWORK_LINKS.map((l) => {
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group rounded-card border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 hover:border-accent/40 hover:shadow-card-hover transition-all flex items-start gap-3"
                >
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-accent/10 text-accent flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" aria-hidden />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-body-sm font-semibold tracking-tight">
                      {l.label}
                    </span>
                    <span className="block text-body-xs text-ink-500 dark:text-ink-400 mt-0.5 leading-snug">
                      {l.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="text-body-xs text-ink-500 dark:text-ink-400 leading-relaxed">
          <p>
            Worked-example deployment — admin role is self-grant via this
            portal. Production replaces with SSO + verified role mapping.
            See <code className="font-mono text-label-xs">CLAUDE.md</code> §10
            for discretion stance on VVIP-touching artifacts.
          </p>
        </footer>
      </div>
    </AdminPortalGate>
  );
}
