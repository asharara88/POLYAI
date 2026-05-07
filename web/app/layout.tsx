import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { Toaster } from "sonner";
import CommandPalette from "@/components/CommandPalette";
import { buildPaletteEntries } from "@/lib/palette-entries";

export const metadata: Metadata = {
  title: "POLYAI — Control plane",
  description: "Multi-agent marketing, sales, and BD team — control plane",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const paletteEntries = buildPaletteEntries();
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-accent focus:text-white focus:px-3 focus:py-2 focus:rounded-md focus:text-body-sm"
        >
          Skip to main content
        </a>
        <Nav />
        <main id="main" className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="max-w-6xl mx-auto px-6 py-10 text-body-xs font-mono text-ink-400 flex items-center justify-between flex-wrap gap-2">
          <span>POLYAI · multi-agent control plane</span>
          <span className="opacity-70">
            press <kbd className="px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 font-mono">⌘ K</kbd> for command palette
          </span>
        </footer>
        <CommandPalette entries={paletteEntries} />
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
      </body>
    </html>
  );
}
