import { getVerticals } from "@/lib/content";
import NewClientForm from "./NewClientForm";

export const dynamic = "force-dynamic";

export default function Page() {
  const verticals = getVerticals().map((v) => v.name);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">New client</h1>
        <p className="text-ink-500 dark:text-ink-400 mt-2 max-w-2xl text-sm">
          Generates a populated <code className="font-mono">client-profile.md</code> from your inputs and deep-links you
          to GitHub to commit it. The full <code className="font-mono">clients/&lt;slug&gt;/</code> scaffold (ICP, brand
          voice, decisions, results) gets created when you accept the PR.
        </p>
      </header>
      <NewClientForm verticals={verticals} />
    </div>
  );
}
