"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Listing } from "@/types";
import { ListingCard } from "./ListingCard";
import { useT } from "@/lib/locale-store";
import { ArrowRight } from "lucide-react";

export function FeaturedListings() {
  const { t } = useT();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => {
        setListings(data.listings.filter((l: Listing) => l.featured).slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">{t.listing.featured}</h2>
          </div>
          <Link
            href="/listings"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-terracotta hover:gap-2.5 transition-all shrink-0"
          >
            {t.nav.listings} <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[380px] rounded-2xl bg-cream-deep animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}

        <Link
          href="/listings"
          className="sm:hidden mt-8 flex items-center justify-center gap-1.5 text-sm font-semibold text-terracotta"
        >
          {t.nav.listings} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
