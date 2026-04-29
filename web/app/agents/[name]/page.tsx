import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "@/components/Markdown";
import { getAgent, getAgents } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAgents().map((a) => ({ name: a.name }));
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const agent = getAgent(name);
  if (!agent) notFound();

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-2 text-xs font-mono text-ink-400">
          <Link href="/agents" className="hover:underline">agents</Link>
          <span>/</span>
          <span>{agent.name}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">{agent.name}</h1>
        <p className="text-ink-500 dark:text-ink-400 mt-2 max-w-3xl">{agent.description}</p>
        <div className="flex flex-wrap gap-2 mt-3 font-mono text-[11px]">
          {agent.model && (
            <span className="px-2 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300">
              model: {agent.model}
            </span>
          )}
          {agent.tools && (
            <span className="px-2 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300">
              tools: {agent.tools}
            </span>
          )}
        </div>
      </header>

      <section className="rounded-lg border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
        <Markdown>{agent.body}</Markdown>
      </section>
    </div>
  );
}
