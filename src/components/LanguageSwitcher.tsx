"use client";

import { useState, useRef, useEffect } from "react";
import { useLocaleStore } from "@/lib/locale-store";
import { ChevronDown } from "lucide-react";

const LABELS: Record<string, string> = { uz: "O'zbekcha", ru: "Русский", en: "English" };
const SHORT: Record<string, string> = { uz: "UZ", ru: "RU", en: "EN" };

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { locale, setLocale } = useLocaleStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-full border transition-colors cursor-pointer ${
          dark
            ? "border-cream/20 text-cream hover:bg-cream/10"
            : "border-line text-ink-soft hover:bg-cream-deep"
        }`}
        aria-label="Tilni o'zgartirish"
      >
        {SHORT[locale]}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-card rounded-xl border border-line shadow-lg py-1.5 z-50 overflow-hidden">
          {(Object.keys(LABELS) as Array<keyof typeof LABELS>).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l as "uz" | "ru" | "en");
                setOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 text-sm hover:bg-cream-deep transition-colors cursor-pointer ${
                locale === l ? "text-terracotta font-medium" : "text-ink-soft"
              }`}
            >
              {LABELS[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
