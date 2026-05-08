"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Markdown from "@/components/Markdown";

type Msg = { role: "user" | "assistant"; content: string };
type ClientItem = { slug: string; displayName: string; vertical: string | null };

export default function ChatClient({ clients }: { clients: ClientItem[] }) {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [activeClient, setActiveClient] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Prefill from ?q= deep link (used by command palette presets)
  useEffect(() => {
    const q = searchParams?.get("q");
    if (q && messages.length === 0) {
      setInput(q);
    }
  }, [searchParams, messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || busy) return;
    setError(null);
    const userMsg: Msg = { role: "user", content: input };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next,
          clientSlug: activeClient || undefined,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }

      // stream
      const reader = res.body?.getReader();
      if (!reader) throw new Error("no stream");
      const decoder = new TextDecoder();
      let acc = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = m.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 px-3 py-2">
        <label className="text-xs font-mono text-ink-400">active client</label>
        <select
          className="bg-transparent text-sm border border-ink-200 dark:border-ink-700 rounded px-2 py-1"
          value={activeClient}
          onChange={(e) => setActiveClient(e.target.value)}
          disabled={busy}
        >
          <option value="">— none —</option>
          {clients.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.displayName} {c.vertical ? `· ${c.vertical}` : ""}
            </option>
          ))}
        </select>
        {messages.length > 0 && (
          <button
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
            disabled={busy}
            className="ml-auto text-xs font-mono text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
          >
            clear
          </button>
        )}
      </div>

      <div className="rounded-card border border-ink-200/70 dark:border-ink-800 dark:ring-1 dark:ring-white/[0.06] bg-white dark:bg-ink-900 min-h-[40vh] max-h-[65vh] overflow-y-auto p-5 shadow-card">
        {messages.length === 0 ? (
          <div className="text-body-sm text-ink-600 dark:text-ink-300 space-y-4">
            <div className="font-medium text-ink-700 dark:text-ink-200">Try one of these</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "What needs me today?",
                "Brief me on this morning",
                "Show me stuck deals",
                "How's our channel mix?",
                "Aged risks I should know about",
                "Plan a Q3 launch campaign",
                "Draft a creative brief for the hero landing page",
                "Onboard a new real-estate developer client",
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  disabled={busy}
                  className="text-left rounded-md border border-ink-200/70 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-950/40 hover:border-accent/40 hover:bg-accent/5 dark:hover:bg-accent/10 px-3 py-2 text-body-sm text-ink-700 dark:text-ink-200 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <p className="text-body-xs text-ink-400 pt-2">
              Cmd / Ctrl + Enter to send. Pick a client above to scope the answer.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-lg bg-accent/10 border border-accent/20 px-3 py-2 text-sm whitespace-pre-wrap"
                      : "max-w-full text-sm"
                  }
                >
                  {m.role === "assistant" ? <Markdown>{m.content}</Markdown> : m.content}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">
          error: {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Ask the chief-commercial-officer… (cmd/ctrl+enter to send)"
          rows={3}
          className="flex-1 rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 px-3 py-2 text-sm font-mono"
          disabled={busy}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-md bg-accent text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {busy ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
