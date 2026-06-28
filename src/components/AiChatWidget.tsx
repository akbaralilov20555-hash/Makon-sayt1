"use client";

import { useState, useRef, useEffect } from "react";
import { useT } from "@/lib/locale-store";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export function AiChatWidget() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      Promise.resolve().then(() => {
        setMessages([{ role: "assistant", content: t.ai.greeting }]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Texnik xatolik. Iltimos qayta urinib ko'ring yoki +998 78 150 99 00 ga qo'ng'iroq qiling." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-terracotta text-white shadow-xl shadow-terracotta/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="AI yordamchi"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[60] w-[min(380px,calc(100vw-3rem))] h-[min(560px,calc(100vh-9rem))] bg-card rounded-2xl border border-line shadow-2xl flex flex-col overflow-hidden animate-fade-up">
          <div className="bg-ink px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-terracotta flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <p className="text-cream font-semibold text-sm">{t.ai.title}</p>
              <p className="text-cream/50 text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-olive" /> Online
              </p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "self-end bg-terracotta text-white rounded-br-sm"
                    : "self-start bg-cream-deep text-ink rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="self-start bg-cream-deep text-ink-soft px-4 py-2.5 rounded-2xl rounded-bl-sm text-[14px]">
                {t.ai.thinking}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-line flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t.ai.placeholder}
              className="flex-1 h-11 px-4 rounded-full bg-cream-deep text-[14px] placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-11 h-11 rounded-full bg-terracotta text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-terracotta-deep transition-colors"
              aria-label={t.ai.send}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
