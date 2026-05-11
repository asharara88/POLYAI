"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, MessageSquare } from "lucide-react";
import Markdown from "@/components/Markdown";
import { useAsk, type AskAnchorRef } from "@/lib/ask-context";

/**
 * Inline thread body. Renders nothing when the anchor isn't the currently
 * open one. When open, expands below its parent surface with a thread of
 * messages anchored to this specific item, plus an input box.
 */
export default function AskInlineThread({ anchor }: { anchor: AskAnchorRef }) {
  const { isOpen, threads, send, busyAnchorId, close } = useAsk();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const active = isOpen(anchor.id);
  const messages = threads[anchor.id] ?? [];
  const busy = busyAnchorId === anchor.id;

  useEffect(() => {
    if (active) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [active, messages.length]);

  if (!active) return null;

  const submit = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await send(anchor, text);
  };

  return (
    <aside
      role="region"
      aria-label={`Ask thread for ${anchor.label}`}
      className="mt-3 rounded-md border border-accent/30 dark:border-accent/40 bg-accent/[0.04] dark:bg-accent/[0.07] overflow-hidden"
    >
      <header className="px-3.5 py-2 flex items-center gap-2 border-b border-accent/20 bg-accent/[0.06] dark:bg-accent/[0.10]">
        <MessageSquare className="w-3.5 h-3.5 text-accent flex-shrink-0" aria-hidden />
        <div className="flex-1 min-w-0 text-label-xs font-mono uppercase tracking-wider text-accent truncate">
          Asking about: <span className="normal-case text-ink-800 dark:text-ink-100 font-semibold tracking-tight">{anchor.label}</span>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close thread"
          className="text-ink-400 hover:text-ink-800 dark:hover:text-ink-100 text-label-xs font-mono uppercase tracking-wider"
        >
          close
        </button>
      </header>

      <div className="px-3.5 py-3 space-y-3 max-h-[40vh] overflow-y-auto">
        {messages.length === 0 ? (
          <SuggestionRow anchor={anchor} onPick={(s) => send(anchor, s)} disabled={busy} />
        ) : (
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-md bg-white dark:bg-ink-900 border border-ink-200/70 dark:border-ink-800 px-3 py-1.5 text-body-sm whitespace-pre-wrap text-ink-900 dark:text-ink-50"
                      : "max-w-full text-body-sm text-ink-800 dark:text-ink-100 prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5"
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="px-3 py-2.5 border-t border-accent/20 flex items-end gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              void submit();
            }
          }}
          placeholder="Ask anything about this…"
          rows={1}
          className="flex-1 rounded-md border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 px-3 py-1.5 text-body-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-colors disabled:opacity-50"
          disabled={busy}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send"
          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-accent text-white hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          <ArrowUp className="w-3.5 h-3.5" aria-hidden />
        </button>
      </form>
    </aside>
  );
}

function SuggestionRow({
  anchor,
  onPick,
  disabled,
}: {
  anchor: AskAnchorRef;
  onPick: (text: string) => void | Promise<void>;
  disabled: boolean;
}) {
  const suggestions = suggestionsFor(anchor.kind);
  return (
    <div className="space-y-2">
      <div className="text-body-xs text-ink-500 dark:text-ink-400">
        Try one of these — or type your own.
      </div>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => void onPick(s)}
            disabled={disabled}
            className="text-label-xs px-2 py-1 rounded border border-ink-200/70 dark:border-ink-800 bg-white dark:bg-ink-900 text-ink-700 dark:text-ink-200 hover:border-accent/40 hover:bg-accent/5 disabled:opacity-50 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function suggestionsFor(kind: AskAnchorRef["kind"]): string[] {
  switch (kind) {
    case "decision":
      return [
        "What's the strongest argument for the recommendation?",
        "What could go wrong with this approach?",
        "Draft a one-line note for the audit trail.",
      ];
    case "risk":
      return [
        "What mitigation moves the needle most?",
        "Who should I loop in on this?",
        "Should this be escalated now?",
      ];
    case "brief-section":
      return ["Why is this in the brief today?", "What changed since last week?", "What should I act on?"];
    case "calendar-event":
      return [
        "What's the goal of this meeting?",
        "Who else should be in the room?",
        "Draft talking points.",
      ];
    case "horizon-item":
      return ["How does this affect us?", "What's the action timeline?", "Who owns the response?"];
    case "compliance":
      return ["What's the current obligation?", "Where could we slip?", "Who owns this control?"];
    case "aged-thread":
      return ["Why has this aged?", "Who is blocked on what?", "Suggest a path to resolution."];
    default:
      return ["Tell me more.", "What should I do?"];
  }
}
