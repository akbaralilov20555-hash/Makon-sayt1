"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AiChatWidget } from "@/components/AiChatWidget";
import { ListingCard } from "@/components/ListingCard";
import { useT } from "@/lib/locale-store";
import { useFavoritesStore } from "@/lib/favorites-store";
import { Listing } from "@/types";
import { Heart, ArrowRight } from "lucide-react";

export default function FavoritesPage() {
  const { t } = useT();
  const { ids, hydrate, hydrated } = useFavoritesStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    if (ids.length === 0) {
      setListings([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const all: Listing[] = data.listings || [];
        setListings(all.filter((l) => ids.includes(l.id)));
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ids, hydrated]);

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <Heart size={26} className="text-terracotta" fill="currentColor" />
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">{t.filters.favoritesTitle}</h1>
          </div>
          <p className="text-ink-soft mb-8">
            {loading ? t.common.loading : `${listings.length} ${t.filters.results}`}
          </p>

          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[380px] rounded-2xl bg-cream-deep animate-pulse" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="py-20 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-5">
                <Heart size={26} className="text-terracotta" />
              </div>
              <p className="font-display text-xl text-ink mb-2">{t.filters.favoritesEmpty}</p>
              <p className="text-ink-soft/70 text-sm mb-6">{t.filters.favoritesEmptyDesc}</p>
              <Link
                href="/listings"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-terracotta text-white text-sm font-semibold hover:bg-terracotta-deep transition-colors"
              >
                {t.nav.listings} <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AiChatWidget />
    </>
  );
}
