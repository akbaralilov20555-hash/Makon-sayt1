"use client";

import { useT } from "@/lib/locale-store";
import { districts } from "@/data/listings";
import { SlidersHorizontal, X } from "lucide-react";

export interface FilterState {
  purpose: string;
  type: string;
  district: string;
  priceFrom: string;
  priceTo: string;
  rooms: string;
}

export const emptyFilters: FilterState = {
  purpose: "",
  type: "",
  district: "",
  priceFrom: "",
  priceTo: "",
  rooms: "",
};

export function FiltersPanel({
  filters,
  setFilters,
  onClose,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  onClose?: () => void;
}) {
  const { t } = useT();

  const purposes = [
    { v: "", l: t.filters.allDistricts.includes("Barcha") ? "Barchasi" : "All" },
    { v: "rent", l: t.filters.rent },
    { v: "sale", l: t.filters.sale },
  ];

  const types = [
    { v: "", l: "—" },
    { v: "apartment", l: t.filters.apartment },
    { v: "house", l: t.filters.house },
    { v: "room", l: t.filters.room },
    { v: "studio", l: t.filters.studio },
    { v: "commercial", l: t.filters.commercial },
  ];

  function update<K extends keyof FilterState>(key: K, value: string) {
    setFilters({ ...filters, [key]: value });
  }

  return (
    <div className="bg-card border border-line rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-semibold text-lg flex items-center gap-2">
          <SlidersHorizontal size={17} className="text-terracotta" />
          {t.filters.purpose}
        </h3>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 text-ink-soft" aria-label="Yopish">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70 mb-2 block">
            {t.filters.purpose}
          </label>
          <div className="flex gap-2">
            {purposes.map((p) => (
              <button
                key={p.v}
                onClick={() => update("purpose", p.v)}
                className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                  filters.purpose === p.v
                    ? "bg-terracotta text-white border-terracotta"
                    : "bg-cream-deep text-ink-soft border-line hover:border-terracotta/40"
                }`}
              >
                {p.l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70 mb-2 block">
            {t.filters.type}
          </label>
          <select
            value={filters.type}
            onChange={(e) => update("type", e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-line bg-cream-deep text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 cursor-pointer"
          >
            {types.map((ty) => (
              <option key={ty.v} value={ty.v}>{ty.l}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70 mb-2 block">
            {t.filters.district}
          </label>
          <select
            value={filters.district}
            onChange={(e) => update("district", e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-line bg-cream-deep text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 cursor-pointer"
          >
            <option value="">{t.filters.allDistricts}</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70 mb-2 block">
              {t.filters.priceFrom}
            </label>
            <input
              type="number"
              value={filters.priceFrom}
              onChange={(e) => update("priceFrom", e.target.value)}
              placeholder="$0"
              className="w-full h-11 px-3.5 rounded-xl border border-line bg-cream-deep text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70 mb-2 block">
              {t.filters.priceTo}
            </label>
            <input
              type="number"
              value={filters.priceTo}
              onChange={(e) => update("priceTo", e.target.value)}
              placeholder="$5000"
              className="w-full h-11 px-3.5 rounded-xl border border-line bg-cream-deep text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70 mb-2 block">
            {t.filters.rooms}
          </label>
          <div className="flex gap-2">
            {["", "1", "2", "3", "4"].map((r) => (
              <button
                key={r}
                onClick={() => update("rooms", r)}
                className={`flex-1 h-10 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                  filters.rooms === r
                    ? "bg-olive text-cream border-olive"
                    : "bg-cream-deep text-ink-soft border-line hover:border-olive/40"
                }`}
              >
                {r === "" ? "—" : `${r}+`}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setFilters(emptyFilters)}
          className="w-full h-11 rounded-xl border border-line text-sm font-medium text-ink-soft hover:bg-cream-deep transition-colors"
        >
          {t.filters.reset}
        </button>
      </div>
    </div>
  );
}
