"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-5 text-center">
      <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
          <path d="M5 30V16C5 9.37258 10.3726 4 17 4C23.6274 4 29 9.37258 29 16V30" stroke="#C75D3A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M11 30V18C11 14.6863 13.6863 12 17 12C20.3137 12 23 14.6863 23 18V30" stroke="#C99A44" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink mb-2">
        Nimadir xato ketdi
      </h1>
      <p className="text-ink-soft max-w-sm mb-8">
        Kutilmagan texnik xatolik yuz berdi. Iltimos, qayta urinib ko&apos;ring yoki bosh sahifaga qayting.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-terracotta text-white font-semibold hover:bg-terracotta-deep transition-colors"
        >
          <RefreshCcw size={16} /> Qayta urinish
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-line text-ink font-semibold hover:bg-cream-deep transition-colors"
        >
          <Home size={16} /> Bosh sahifa
        </Link>
      </div>
    </div>
  );
}
