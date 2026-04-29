import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "POLYAI — Control plane",
  description: "Multi-agent marketing, sales, and BD team — control plane",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Nav />
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
        <footer className="max-w-6xl mx-auto px-6 py-10 text-xs font-mono text-ink-400">
          POLYAI · multi-agent control plane · static read-only view
        </footer>
      </body>
    </html>
  );
}
