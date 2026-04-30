import SearchClient from "./SearchClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
        <p className="text-ink-500 dark:text-ink-400 mt-2 max-w-2xl text-sm">
          Across clients, agents, verticals, and schemas.
        </p>
      </header>
      <SearchClient />
    </div>
  );
}
