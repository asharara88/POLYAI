import Link from "next/link";

const items = [
  { href: "/", label: "Overview" },
  { href: "/clients", label: "Clients" },
  { href: "/agents", label: "Agents" },
  { href: "/verticals", label: "Verticals" },
  { href: "/schemas", label: "Schemas" },
];

export default function Nav() {
  return (
    <header className="border-b border-ink-200/70 dark:border-ink-800 bg-ink-50/70 dark:bg-ink-950/70 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
        <Link href="/" className="font-mono text-sm tracking-tight font-semibold">
          POLYAI<span className="text-accent">.</span>
        </Link>
        <nav className="flex gap-4 text-sm">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-ink-50 transition-colors"
            >
              {it.label}
            </Link>
          ))}
        </nav>
        <span className="ml-auto text-xs font-mono text-ink-400">multi-agent control plane</span>
      </div>
    </header>
  );
}
