"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useIdentity } from "@/lib/identity";

type CTA = {
  href: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  hint?: string;
};

export default function HomeCTAs({
  pendingCount,
  workspaceCount,
}: {
  pendingCount: number;
  workspaceCount: number;
}) {
  const { identity } = useIdentity();
  const isAdmin = identity?.role === "admin";

  const workspaceCta: CTA = isAdmin
    ? {
        href: "/clients",
        icon: <Building2 className="w-6 h-6" aria-hidden />,
        title: "Workspaces",
        body: "Switch between developer engagements — pipeline, channels, events, and more.",
        hint:
          workspaceCount > 0
            ? `${workspaceCount} ${workspaceCount === 1 ? "workspace" : "workspaces"}`
            : undefined,
      }
    : {
        href: "/workspace",
        icon: <Building2 className="w-6 h-6" aria-hidden />,
        title: "Workspace",
        body: "Open your workspace — projects, pipeline, channels, and events.",
        hint: "Today, Projects, Decisions, Ask",
      };

  const ctas: CTA[] = [
    {
      href: "/cco",
      icon: <Sparkles className="w-6 h-6" aria-hidden />,
      title: "Today",
      body: "What needs you today — your morning brief, key risks, and what's new.",
      hint: "Start here every morning",
    },
    {
      href: "/approvals",
      icon: <CheckCircle2 className="w-6 h-6" aria-hidden />,
      title: "Decisions",
      body: "Sign or send back the decisions waiting on you.",
      hint: pendingCount > 0 ? `${pendingCount} waiting on you` : "All caught up",
    },
    workspaceCta,
  ];

  return (
    <section
      aria-label="Primary actions"
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {ctas.map((cta) => (
        <Link
          key={cta.href}
          href={cta.href}
          className="group rounded-card border border-ink-200/70 dark:border-ink-800 dark:ring-1 dark:ring-white/[0.06] bg-white dark:bg-ink-900 p-6 shadow-card hover:shadow-card-hover hover:border-accent/40 dark:hover:border-accent/40 transition-all flex flex-col gap-3"
        >
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-card bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
            {cta.icon}
          </span>
          <div>
            <h2 className="text-title font-semibold tracking-tight inline-flex items-center gap-2">
              {cta.title}
              <ArrowRight
                className="w-4 h-4 text-ink-300 group-hover:text-accent group-hover:translate-x-0.5 transition-all"
                aria-hidden
              />
            </h2>
            <p className="text-body-sm text-ink-600 dark:text-ink-300 mt-1.5 leading-relaxed">
              {cta.body}
            </p>
            {cta.hint && (
              <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-2">
                {cta.hint}
              </p>
            )}
          </div>
        </Link>
      ))}
    </section>
  );
}
