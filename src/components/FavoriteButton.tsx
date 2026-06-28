"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/lib/favorites-store";
import { useT } from "@/lib/locale-store";

export function FavoriteButton({
  listingId,
  size = "md",
  className = "",
}: {
  listingId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { t } = useT();
  const { ids, hydrate, toggle } = useFavoritesStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  const active = mounted && ids.includes(listingId);

  const dims = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-11 h-11" : "w-9 h-9";
  const iconSize = size === "sm" ? 14 : size === "lg" ? 20 : 16;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(listingId);
      }}
      aria-pressed={active}
      title={active ? t.filters.removeFromFavorites : t.filters.addToFavorites}
      className={`${dims} rounded-full flex items-center justify-center bg-cream/95 backdrop-blur-sm shadow-sm hover:scale-110 active:scale-95 transition-all duration-200 ${className}`}
    >
      <Heart
        size={iconSize}
        className={active ? "text-terracotta" : "text-ink-soft"}
        fill={active ? "currentColor" : "none"}
        strokeWidth={2}
      />
    </button>
  );
}
