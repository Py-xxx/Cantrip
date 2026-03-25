import { useState, useEffect, useRef } from "react";
import { checkConnection, chat } from "./lib/ollama";
import { SYSTEM_PROMPT, parseResponse } from "./lib/prompts";
import { OPENING_SCENE } from "./data/campaign";
import { Message } from "./components/Message";
import type { ChatMessage, OllamaMessage, SkillCheck, RollResult } from "./lib/types";

export default function App() {
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [awaitingRoll, setAwaitingRoll] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const openingFired = useRef(false);

  // ── Connection check on mount, then kick off opening scene ───────────
  useEffect(() => {
    if (openingFired.current) return;
    openingFired.current = true;

    checkConnection()
      .then(() => {
        setConnecting(false);
        sendMessage(OPENING_SCENE, { hidden: true });
      })
      .catch((err: Error) => {
        setConnecting(false);
        setConnectionError(err.message);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Scroll to bottom on new messages ──────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, generating]);

  // ── Core send function ─────────────────────────────────────────────────
  async function sendMessage(
    content: string,
    opts: { isRollResult?: boolean; hidden?: boolean } = {}
  ) {
    setSendError(null);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      isRollResult: opts.isRollResult,
      isHidden: opts.hidden,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setGenerating(true);

    // Build the Ollama history from the updated messages array
    const ollamaHistory: OllamaMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...nextMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    try {
      const raw = await chat(ollamaHistory);
      const { narrative, skillCheck, suggestions } = parseResponse(raw);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: narrative,
        skillCheck: skillCheck ?? undefined,
        suggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (skillCheck) {
        setAwaitingRoll(true);
      }
    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : String(err));
    } finally {
      setGenerating(false);
    }
  }

  // ── Handle dice roll result ────────────────────────────────────────────
  function handleRoll(skillCheck: SkillCheck, result: RollResult) {
    setAwaitingRoll(false);

    const outcome = result.success ? "SUCCESS" : "FAILED";
    const rollContent = `[ROLL_RESULT: ${skillCheck.type} Check — d20: ${result.roll} | DC: ${skillCheck.dc} | ${outcome}]`;

    sendMessage(rollContent, { isRollResult: true });
  }

  // ── Handle player submit ───────────────────────────────────────────────
  function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed || generating || awaitingRoll) return;
    setInput("");
    sendMessage(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  // ── Render: connection error ───────────────────────────────────────────
  if (connecting) {
    return (
      <div className="h-screen bg-stone-950 flex items-center justify-center">
        <p className="text-stone-400 text-sm animate-pulse">Connecting to Ollama…</p>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="h-screen bg-stone-950 flex items-center justify-center">
        <div className="max-w-md text-center flex flex-col gap-4">
          <h1 className="text-amber-400 text-lg font-semibold">Cannot reach Ollama</h1>
          <p className="text-stone-400 text-sm leading-relaxed">{connectionError}</p>
          <button
            onClick={() => {
              setConnecting(true);
              setConnectionError(null);
              checkConnection()
                .then(() => setConnecting(false))
                .catch((err: Error) => {
                  setConnecting(false);
                  setConnectionError(err.message);
                });
            }}
            className="mt-2 px-4 py-2 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm border border-stone-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Render: main chat ──────────────────────────────────────────────────
  const inputBlocked = generating || awaitingRoll;

  return (
    <div className="h-screen bg-stone-950 flex flex-col">
      {/* Header */}
      <header className="shrink-0 px-6 py-3 border-b border-stone-800 flex items-center gap-3">
        <span className="text-amber-500 font-bold tracking-widest text-sm uppercase">Cantrip</span>
        <span className="text-stone-700">|</span>
        <span className="text-stone-500 text-xs">D&amp;D AI Dungeon Master</span>
        {generating && (
          <span className="ml-auto text-stone-500 text-xs animate-pulse">The DM is writing…</span>
        )}
        {awaitingRoll && (
          <span className="ml-auto text-amber-500/80 text-xs">Roll the dice to continue</span>
        )}
      </header>

      {/* Chat log */}
      <main className="flex-1 overflow-y-auto px-6 py-6 max-w-3xl w-full mx-auto">
        {messages.filter((m) => !m.isHidden).length === 0 && !generating && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <p className="text-stone-600 text-sm">Your adventure awaits.</p>
            <p className="text-stone-700 text-xs">Type anything to begin — describe your character, ask to start a campaign, or just say where you are.</p>
          </div>
        )}

        {messages.filter((m) => !m.isHidden).map((msg) => (
          <Message
            key={msg.id}
            message={msg}
            onRoll={awaitingRoll && msg.skillCheck ? handleRoll : undefined}
          />
        ))}

        {/* Generating indicator */}
        {generating && (
          <div className="mb-6">
            <div className="flex gap-1.5 items-center h-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600/70 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600/70 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600/70 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* Send error */}
      {sendError && (
        <div className="shrink-0 px-6 py-2 bg-red-950/60 border-t border-red-800/40">
          <p className="text-red-400 text-xs">{sendError}</p>
        </div>
      )}

      {/* Input bar */}
      <footer className="shrink-0 border-t border-stone-800 px-6 py-4 max-w-3xl w-full mx-auto">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={inputBlocked}
            placeholder={
              awaitingRoll
                ? "Roll the dice above to continue…"
                : "What do you do?"
            }
            rows={1}
            className="
              flex-1 resize-none rounded-md bg-stone-900 border border-stone-700
              text-stone-200 placeholder-stone-600 text-sm px-4 py-2.5
              focus:outline-none focus:border-amber-700/60
              disabled:opacity-40 disabled:cursor-not-allowed
              leading-relaxed max-h-40 overflow-y-auto
            "
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <button
            onClick={handleSubmit}
            disabled={inputBlocked || !input.trim()}
            className="
              shrink-0 px-4 py-2.5 rounded-md text-sm font-medium
              bg-amber-700 hover:bg-amber-600 active:bg-amber-800
              text-amber-100 border border-amber-600
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-colors duration-100
            "
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-stone-700 text-xs">Enter to send &middot; Shift+Enter for new line</p>
      </footer>
    </div>
  );
}
