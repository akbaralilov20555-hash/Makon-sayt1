"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AiChatWidget } from "@/components/AiChatWidget";
import { ListingCard } from "@/components/ListingCard";
import { FiltersPanel, FilterState, emptyFilters } from "@/components/FiltersPanel";
import { MapWrapper } from "@/components/MapWrapper";
import { Listing } from "@/types";
import { useT } from "@/lib/locale-store";
import { Map as MapIcon, LayoutGrid, SlidersHorizontal, Search } from "lucide-react";
import { DemolitionLegend } from "@/components/DemolitionLegend";

function ListingsContent() {
  const { t } = useT();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    ...emptyFilters,
    purpose: "" ,
  });
  const [view, setView] = useState<"grid" | "map">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.purpose) params.set("purpose", filters.purpose);
    if (filters.type) params.set("type", filters.type);
    if (filters.district) params.set("district", filters.district);
    if (filters.priceFrom) params.set("priceFrom", filters.priceFrom);
    if (filters.priceTo) params.set("priceTo", filters.priceTo);
    if (filters.rooms) params.set("rooms", filters.rooms);
    if (query) params.set("q", query);
    if (sort && sort !== "newest") params.set("sort", sort);

    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true);
    });

    fetch(`/api/listings?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setListings(data.listings);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, query, sort]);

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">{t.nav.listings}</h1>
              <p className="text-ink-soft mt-1.5">
                {loading ? t.common.loading : `${listings.length} ${t.filters.results}`}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.hero.searchPlaceholder}
                className="w-full h-11 pl-10 pr-4 rounded-full border border-line bg-card text-sm placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 px-3.5 rounded-full border border-line bg-card text-sm text-ink-soft focus:outline-none focus:ring-2 focus:ring-terracotta/30 cursor-pointer"
                aria-label={t.filters.sortBy}
              >
                <option value="newest">{t.filters.sortNewest}</option>
                <option value="price_asc">{t.filters.sortPriceAsc}</option>
                <option value="price_desc">{t.filters.sortPriceDesc}</option>
                <option value="popular">{t.filters.sortPopular}</option>
              </select>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border border-line text-sm font-medium text-ink-soft"
              >
                <SlidersHorizontal size={15} /> {t.filters.purpose}
              </button>
              <div className="flex items-center bg-cream-deep rounded-full p-1 border border-line">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-full transition-colors ${view === "grid" ? "bg-card shadow-sm" : ""}`}
                  aria-label="Grid"
                >
                  <LayoutGrid size={17} className={view === "grid" ? "text-terracotta" : "text-ink-soft"} />
                </button>
                <button
                  onClick={() => setView("map")}
                  className={`p-2 rounded-full transition-colors ${view === "map" ? "bg-card shadow-sm" : ""}`}
                  aria-label="Map"
                >
                  <MapIcon size={17} className={view === "map" ? "text-terracotta" : "text-ink-soft"} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <FiltersPanel filters={filters} setFilters={setFilters} />
              </div>
            </aside>

            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-[70] lg:hidden">
                <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileFiltersOpen(false)} />
                <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-cream p-5 overflow-y-auto">
                  <FiltersPanel filters={filters} setFilters={setFilters} onClose={() => setMobileFiltersOpen(false)} />
                </div>
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5 px-4 py-3 rounded-xl bg-cream-deep border border-line">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
                  {t.listing.colorLegendTitle}
                </p>
                <DemolitionLegend compact />
              </div>

              {view === "grid" ? (
                loading ? (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-[380px] rounded-2xl bg-cream-deep animate-pulse" />
                    ))}
                  </div>
                ) : listings.length === 0 ? (
                  <div className="py-24 text-center">
                    <p className="font-display text-xl text-ink-soft">Hech narsa topilmadi</p>
                    <p className="text-ink-soft/70 mt-2 text-sm">Filtrlarni o&apos;zgartirib ko&apos;ring</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {listings.map((l) => (
                      <ListingCard key={l.id} listing={l} />
                    ))}
                  </div>
                )
              ) : (
                <div className="h-[600px] rounded-2xl overflow-hidden border border-line">
                  <MapWrapper listings={listings} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <AiChatWidget />
    </>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={null}>
      <ListingsContent />
    </Suspense>
  );
}
