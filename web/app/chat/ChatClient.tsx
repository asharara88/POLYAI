"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUp, RotateCcw } from "lucide-react";
import Markdown from "@/components/Markdown";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What needs me today?",
  "Brief me on this morning",
  "Show me stuck deals",
  "How's our channel mix?",
  "Aged risks I should know about",
  "Draft a creative brief for the Q3 launch hero",
];

export default function ChatClient() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
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

  const send = async (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || busy) return;
    setError(null);
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }

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

  const reset = () => {
    setMessages([]);
    setError(null);
    setInput("");
  };

  const hasConversation = messages.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-card border border-ink-200/70 dark:border-ink-800 dark:ring-1 dark:ring-white/[0.06] bg-white dark:bg-ink-900 min-h-[40vh] max-h-[65vh] overflow-y-auto p-5 sm:p-6 shadow-card">
        {!hasConversation ? (
          <div className="space-y-5">
            <div>
              <div className="text-body-sm font-medium text-ink-700 dark:text-ink-200">
                Try one of these
              </div>
              <p className="text-body-xs text-ink-500 dark:text-ink-400 mt-0.5">
                Or type your own question below.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTIONS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => send(prompt)}
                  disabled={busy}
                  className="text-left rounded-md border border-ink-200/70 dark:border-ink-800 bg-ink-50/40 dark:bg-ink-950/40 hover:border-accent/40 hover:bg-accent/5 dark:hover:bg-accent/10 px-3 py-2.5 text-body-sm text-ink-700 dark:text-ink-200 transition-colors disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-lg bg-accent/10 border border-accent/20 px-3.5 py-2 text-body-sm whitespace-pre-wrap text-ink-900 dark:text-ink-50"
                      : "max-w-full text-body-sm text-ink-800 dark:text-ink-100 prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2"
                  }
                >
                  {m.role === "assistant" ? (
                    m.content ? (
                      <Markdown>{m.content}</Markdown>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-ink-400">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink-400 animate-pulse" />
                        thinking…
                      </span>
                    )
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-danger-200 dark:border-danger-900/40 bg-danger-50/60 dark:bg-danger-950/30 px-3 py-2 text-body-sm text-danger-700 dark:text-danger-300">
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex gap-2 items-end"
      >
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask anything — pipeline, brief, risks, draft a brief…"
            rows={2}
            className="w-full rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 px-3.5 py-2.5 text-body-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-colors disabled:opacity-50"
            disabled={busy}
          />
          <div className="absolute bottom-2 right-2 text-label-xs font-mono text-ink-400 select-none pointer-events-none">
            ⌘↵
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send"
            className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-accent text-white hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowUp className="w-4 h-4" aria-hidden />
          </button>
          {hasConversation && (
            <button
              type="button"
              onClick={reset}
              disabled={busy}
              aria-label="Clear conversation"
              title="Clear conversation"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-ink-200/70 dark:border-ink-800 text-ink-500 hover:text-ink-800 dark:hover:text-ink-100 hover:bg-ink-50 dark:hover:bg-ink-900 disabled:opacity-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" aria-hidden />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
