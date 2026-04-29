import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "@/components/Markdown";
import { getSchema, getSchemas } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getSchemas().map((s) => ({ name: s.name }));
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const schema = getSchema(name);
  if (!schema) notFound();

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-2 text-xs font-mono text-ink-400">
          <Link href="/schemas" className="hover:underline">schemas</Link>
          <span>/</span>
          <span>{schema.name}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">{schema.name}</h1>
      </header>

      <section className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
        <Markdown>{schema.body}</Markdown>
      </section>
    </div>
  );
}
