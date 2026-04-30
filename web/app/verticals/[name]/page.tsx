import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "@/components/Markdown";
import { getVertical, getVerticals } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getVerticals().map((v) => ({ name: v.name }));
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const vertical = getVertical(name);
  if (!vertical) notFound();

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-2 text-xs font-mono text-ink-400">
          <Link href="/verticals" className="hover:underline">verticals</Link>
          <span>/</span>
          <span>{vertical.name}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1 capitalize">
          {vertical.name.replace(/-/g, " ")}
        </h1>
      </header>

      <section className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
        <Markdown>{vertical.body}</Markdown>
      </section>
    </div>
  );
}
