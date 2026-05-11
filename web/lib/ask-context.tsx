"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

/**
 * Inline Ask threads — single-thread-open-at-a-time across the /cco surface.
 *
 * Each decision card / risk entry / brief section / calendar event renders an
 * `<AskAnchor>` button and an `<AskInlineThread>` body. When the user opens
 * one anchor's thread, any previously-open thread closes. Threads are
 * in-memory per page load; navigating away discards them.
 */

export type AskAnchorKind =
  | "decision"
  | "risk"
  | "brief-section"
  | "calendar-event"
  | "horizon-item"
  | "compliance"
  | "aged-thread";

export type AskAnchorRef = {
  kind: AskAnchorKind;
  /** Stable ID — used to scope which thread is open. */
  id: string;
  /** Human-readable label shown at the top of the thread + sent as context to /api/chat. */
  label: string;
  /** Optional extra context (recommendation, description, etc.) included in the prompt. */
  summary?: string;
};

export type AskMessage = { role: "user" | "assistant"; content: string };

type Threads = Record<string, AskMessage[]>;

type AskCtx = {
  openAnchor: AskAnchorRef | null;
  busyAnchorId: string | null;
  threads: Threads;
  open: (anchor: AskAnchorRef) => void;
  close: () => void;
  toggle: (anchor: AskAnchorRef) => void;
  isOpen: (anchorId: string) => boolean;
  send: (anchor: AskAnchorRef, text: string) => Promise<void>;
};

const AskContext = createContext<AskCtx | null>(null);

export function AskProvider({ children }: { children: ReactNode }) {
  const [openAnchor, setOpenAnchor] = useState<AskAnchorRef | null>(null);
  const [busyAnchorId, setBusyAnchorId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Threads>({});

  const open = useCallback((anchor: AskAnchorRef) => {
    setOpenAnchor(anchor);
  }, []);

  const close = useCallback(() => {
    setOpenAnchor(null);
  }, []);

  const toggle = useCallback((anchor: AskAnchorRef) => {
    setOpenAnchor((prev) => (prev?.id === anchor.id ? null : anchor));
  }, []);

  const isOpen = useCallback(
    (anchorId: string) => openAnchor?.id === anchorId,
    [openAnchor?.id],
  );

  const send = useCallback(async (anchor: AskAnchorRef, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setBusyAnchorId(anchor.id);
    const userMsg: AskMessage = { role: "user", content: trimmed };
    const existing = threads[anchor.id] ?? [];
    const nextMsgs = [...existing, userMsg];
    setThreads((t) => ({ ...t, [anchor.id]: nextMsgs }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: nextMsgs,
          anchor: {
            kind: anchor.kind,
            id: anchor.id,
            label: anchor.label,
            summary: anchor.summary ?? null,
          },
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error("no stream");
      const decoder = new TextDecoder();
      let acc = "";
      setThreads((t) => ({
        ...t,
        [anchor.id]: [...(t[anchor.id] ?? nextMsgs), { role: "assistant", content: "" }],
      }));
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setThreads((t) => {
          const msgs = t[anchor.id] ?? [];
          const copy = msgs.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return { ...t, [anchor.id]: copy };
        });
      }
    } catch (e) {
      setThreads((t) => {
        const msgs = t[anchor.id] ?? [];
        return {
          ...t,
          [anchor.id]: [...msgs, { role: "assistant", content: `[error: ${(e as Error).message}]` }],
        };
      });
    } finally {
      setBusyAnchorId(null);
    }
  }, [threads]);

  const value = useMemo<AskCtx>(
    () => ({ openAnchor, busyAnchorId, threads, open, close, toggle, isOpen, send }),
    [openAnchor, busyAnchorId, threads, open, close, toggle, isOpen, send],
  );

  return <AskContext.Provider value={value}>{children}</AskContext.Provider>;
}

export function useAsk(): AskCtx {
  const ctx = useContext(AskContext);
  if (!ctx) {
    return {
      openAnchor: null,
      busyAnchorId: null,
      threads: {},
      open: () => {},
      close: () => {},
      toggle: () => {},
      isOpen: () => false,
      send: async () => {},
    };
  }
  return ctx;
}
