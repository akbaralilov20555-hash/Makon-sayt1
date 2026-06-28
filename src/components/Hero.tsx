"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/locale-store";
import { Search } from "lucide-react";

export function Hero() {
  const { t } = useT();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/listings${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  }

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full bg-terracotta/10 blur-[2px]" />
        <div className="absolute top-40 -left-24 w-[380px] h-[380px] rounded-full bg-olive/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-20 sm:pt-20 sm:pb-28">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-olive/10 text-olive text-[13px] font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-olive" />
              {t.hero.eyebrow}
            </span>

            <h1 className="font-display text-[44px] sm:text-[58px] leading-[1.05] font-semibold text-ink tracking-tight">
              {t.hero.title}
            </h1>

            <p className="mt-6 text-lg text-ink-soft max-w-lg leading-relaxed">
              {t.hero.subtitle}
            </p>

            <form onSubmit={onSearch} className="mt-9 flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/50" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder={t.hero.searchPlaceholder}
                  className="w-full h-14 pl-11 pr-4 rounded-full border border-line bg-card text-[15px] placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all"
                />
              </div>
              <button
                type="submit"
                className="h-14 px-8 rounded-full bg-terracotta text-white font-semibold hover:bg-terracotta-deep transition-colors shrink-0"
              >
                {t.hero.ctaSearch}
              </button>
            </form>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <p className="font-display text-3xl font-semibold text-ink">2,400+</p>
                <p className="text-sm text-ink-soft mt-1">{t.hero.statListings}</p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold text-ink">14</p>
                <p className="text-sm text-ink-soft mt-1">{t.hero.statCities}</p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold text-ink">98%</p>
                <p className="text-sm text-ink-soft mt-1">{t.hero.statUsers}</p>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up hidden lg:block" style={{ animationDelay: "0.15s" }}>
            <HeroArchVisual t={t} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroArchVisual({ t }: { t: ReturnType<typeof useT>["t"] }) {
  return (
    <div className="relative aspect-[4/5] max-w-md mx-auto">
      <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        <path d="M30 480 V200 C30 110 100 40 200 40 C300 40 370 110 370 200 V480 Z" fill="#C75D3A" />
        <path d="M65 480 V210 C65 132 125 75 200 75 C275 75 335 132 335 210 V480 Z" fill="#FAF6EF" />
        <path d="M105 480 V220 C105 156 148 115 200 115 C252 115 295 156 295 220 V480 Z" fill="#3F5C4E" />
        <path d="M140 480 V230 C140 180 167 152 200 152 C233 152 260 180 260 230 V480 Z" fill="#F1E9DB" />
        <circle cx="200" cy="240" r="22" fill="#C99A44" />
        <rect x="55" y="455" width="290" height="10" rx="2" fill="#211712" opacity="0.08" />
      </svg>
      <div className="absolute -bottom-6 -left-4 bg-card rounded-2xl border border-line shadow-xl px-5 py-4 max-w-[220px]">
        <p className="font-mono-num text-xs text-ink-soft/70 mb-1">Yunusobod</p>
        <p className="font-display font-semibold text-ink">$650<span className="text-sm font-normal text-ink-soft">{t.listing.perMonth}</span></p>
        <p className="text-xs text-ink-soft mt-0.5">3 {t.listing.rooms} · 78 {t.listing.area}</p>
      </div>
      <div className="absolute -top-4 -right-2 bg-olive text-cream rounded-2xl shadow-xl px-4 py-3">
        <p className="text-xs font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          {t.listing.verified}
        </p>
      </div>
    </div>
  );
}
