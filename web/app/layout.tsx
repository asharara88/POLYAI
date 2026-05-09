import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import BottomNav from "@/components/BottomNav";
import { Toaster } from "sonner";
import CommandPalette from "@/components/CommandPalette";
import { buildPaletteEntries } from "@/lib/palette-entries";
import { IdentityProvider } from "@/lib/identity";
import { AdvancedModeProvider } from "@/lib/advanced-mode";
import { getClients } from "@/lib/content";

export const metadata: Metadata = {
  title: "Flow — AI-driven control plane",
  description:
    "Flow — AI-driven multi-agent commercial control plane. Marketing, sales, and BD orchestration.",
  applicationName: "Flow",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c10" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeInitScript = `
(function () {
  try {
    var t = localStorage.getItem('flow-theme') || 'system';
    var dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var html = document.documentElement;
    html.classList.toggle('dark', dark);
    html.style.colorScheme = dark ? 'dark' : 'light';
    html.dataset.theme = t;
    var d = localStorage.getItem('flow-density') || localStorage.getItem('polyai-density') || 'comfortable';
    html.dataset.density = d;
    var adv = localStorage.getItem('flow-advanced') === 'true';
    html.dataset.advanced = adv ? 'true' : 'false';
    // Workspace cookie default — middleware uses this to rewrite /workspace/* → /clients/<slug>/*
    if (!document.cookie.split('; ').some(function(c){return c.indexOf('flow-workspace=')===0;})) {
      document.cookie = 'flow-workspace=aldar-developments; path=/; max-age=31536000; SameSite=Lax';
    }
  } catch (_) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const paletteEntries = buildPaletteEntries();
  const workspaces = getClients()
    .filter((c) => !c.isTemplate)
    .map((c) => ({ slug: c.slug, name: c.displayName ?? c.slug, isExample: c.isExample }));
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Block FOUC: set theme + density classes before paint */}
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="min-h-screen antialiased pb-[72px] md:pb-0 selection:bg-accent/30">
        <IdentityProvider>
        <AdvancedModeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-accent focus:text-white focus:px-3 focus:py-2 focus:rounded-md focus:text-body-sm focus:font-medium"
          >
            Skip to main content
          </a>
          <Nav workspaces={workspaces} />
          <main id="main" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </main>
          <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-body-xs text-ink-400 dark:text-ink-500 flex items-center justify-between flex-wrap gap-2 print:hidden">
            <span>Flow · AI-driven solutions</span>
            <span className="hidden sm:inline">
              Tip:{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 font-mono">
                ⌘ K
              </kbd>{" "}
              opens search
            </span>
          </footer>
          <CommandPalette entries={paletteEntries} />
          <BottomNav />
          <Toaster
            position="top-right"
            richColors
            closeButton
            theme="system"
            toastOptions={{
              classNames: {
                toast: "rounded-card shadow-popover",
              },
            }}
          />
        </AdvancedModeProvider>
        </IdentityProvider>
      </body>
    </html>
  );
}
