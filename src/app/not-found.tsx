"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AiChatWidget } from "@/components/AiChatWidget";
import { useT } from "@/lib/locale-store";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { t } = useT();

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-24 px-5 bg-cream">
        <div className="text-center max-w-lg animate-fade-up">
          {/* Arch motif */}
          <div className="relative inline-block mb-8">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="mx-auto">
              <path
                d="M10 110 V55 C10 29 33 8 60 8 C87 8 110 29 110 55 V110"
                stroke="#C75D3A"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.3"
              />
              <path
                d="M28 110 V62 C28 43 42 30 60 30 C78 30 92 43 92 62 V110"
                stroke="#3F5C4E"
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.3"
              />
              <text x="60" y="80" textAnchor="middle" className="font-display"
                fill="#C75D3A" fontSize="36" fontWeight="700" fontFamily="Georgia, serif">
                404
              </text>
            </svg>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink mb-3">
            {t.common.notFoundTitle}
          </h1>

          <p className="text-ink-soft text-lg mb-10 leading-relaxed">
            {t.common.notFoundDesc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-terracotta text-white font-semibold hover:bg-terracotta-deep transition-colors"
            >
              <Home size={17} />
              {t.common.goHome}
            </Link>
            <Link
              href="/listings"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-line text-ink font-semibold hover:bg-cream-deep transition-colors"
            >
              <Search size={17} />
              {t.nav.listings}
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-line text-ink-soft font-semibold hover:bg-cream-deep transition-colors"
            >
              <ArrowLeft size={17} />
              {t.common.goBack}
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <AiChatWidget />
    </>
  );
}
