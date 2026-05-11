import ChatClient from "./ChatClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-display font-semibold tracking-tight">Ask</h1>
        <p className="text-body text-ink-600 dark:text-ink-300 mt-1.5 max-w-2xl">
          Plan a campaign, draft a brief, get a market read, or ask what needs
          you today.
        </p>
      </header>
      <ChatClient />
    </div>
  );
}
