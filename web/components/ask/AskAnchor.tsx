"use client";

import { MessageSquare, X } from "lucide-react";
import { useAsk, type AskAnchorRef } from "@/lib/ask-context";

/**
 * Inline "Ask about this" button. Click to toggle a thread anchored to a
 * specific decision / risk / brief section / calendar event. Only one
 * thread is open at a time across the /cco page — opening this anchor
 * closes any other.
 */
export default function AskAnchor({
  anchor,
  className = "",
  size = "sm",
}: {
  anchor: AskAnchorRef;
  className?: string;
  size?: "sm" | "xs";
}) {
  const { isOpen, toggle } = useAsk();
  const active = isOpen(anchor.id);
  const sizes =
    size === "xs"
      ? "px-1.5 py-0.5 text-label-xs"
      : "px-2 py-1 text-label-sm";
  return (
    <button
      type="button"
      onClick={() => toggle(anchor)}
      aria-pressed={active}
      aria-label={active ? "Close ask thread" : "Ask about this"}
      className={[
        "inline-flex items-center gap-1 rounded-md font-mono uppercase tracking-wider transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        sizes,
        active
          ? "bg-accent text-white"
          : "text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-800",
        className,
      ].join(" ")}
    >
      {active ? (
        <X className="w-3 h-3" aria-hidden />
      ) : (
        <MessageSquare className="w-3 h-3" aria-hidden />
      )}
      <span>{active ? "Close" : "Ask"}</span>
    </button>
  );
}
