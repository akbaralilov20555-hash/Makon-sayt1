"use client";

import Link from "next/link";
import { Listing } from "@/types";
import { useT } from "@/lib/locale-store";
import { BadgeCheck, MapPin, BedDouble, Maximize, Sparkles } from "lucide-react";
import { formatPriceShort, getDemolitionColor, getNearbyPlaceColor, isDisplayableImage } from "@/lib/utils";
import { NEARBY_ICONS, DEMOLITION_ICONS } from "@/lib/place-icons";
import { FavoriteButton } from "@/components/FavoriteButton";

const GRADIENTS: Record<string, string> = {
  apartment: "from-terracotta/25 via-terracotta/10 to-cream-deep",
  house: "from-olive/25 via-olive/10 to-cream-deep",
  studio: "from-gold/25 via-gold/10 to-cream-deep",
  room: "from-terracotta/20 via-olive/10 to-cream-deep",
  commercial: "from-ink/15 via-ink/5 to-cream-deep",
};

export function ListingCard({ listing }: { listing: Listing }) {
  const { t, locale } = useT();
  const realImage = listing.images.find(isDisplayableImage);
  const status = listing.demolitionStatus || "unknown";
  const statusColor = getDemolitionColor(status);
  const StatusIcon = DEMOLITION_ICONS[status];
  const statusLabel =
    status === "safe" ? t.listing.demolitionSafe :
    status === "soon" ? t.listing.demolitionSoon :
    t.listing.demolitionUnknown;
  const previewPlaces = (listing.nearbyPlaces || []).slice(0, 2);

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block bg-card rounded-2xl border border-line overflow-hidden hover:shadow-xl hover:shadow-ink/5 hover:-translate-y-1 transition-all duration-300"
    >
      <div className={`relative h-52 ${realImage ? "" : `bg-gradient-to-br ${GRADIENTS[listing.propertyType] || GRADIENTS.apartment}`} flex items-center justify-center overflow-hidden`}>
        {realImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={realImage}
            alt={listing.title[locale]}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <svg width="120" height="120" viewBox="0 0 34 34" fill="none" className="opacity-25 group-hover:scale-110 transition-transform duration-500">
            <path d="M5 30V16C5 9.37258 10.3726 4 17 4C23.6274 4 29 9.37258 29 16V30" stroke="#211712" strokeWidth="2" strokeLinecap="round" />
            <path d="M11 30V18C11 14.6863 13.6863 12 17 12C20.3137 12 23 14.6863 23 18V30" stroke="#211712" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}

        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-ink/85 text-cream backdrop-blur-sm">
            {listing.purpose === "rent" ? t.filters.rent : t.filters.sale}
          </span>
          {listing.featured && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gold text-ink flex items-center gap-1">
              <Sparkles size={11} /> {t.listing.featured}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <FavoriteButton listingId={listing.id} size="sm" />
          {listing.verified && (
            <div className="w-7 h-7 rounded-full bg-cream flex items-center justify-center" title={t.listing.verified}>
              <BadgeCheck size={16} className="text-olive" />
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="font-display font-semibold text-[17px] leading-snug text-ink line-clamp-2 group-hover:text-terracotta transition-colors">
            {listing.title[locale]}
          </h3>
        </div>

        <p className="flex items-center gap-1 text-[13px] text-ink-soft/80 mb-3">
          <MapPin size={13} className="shrink-0" />
          {listing.district}, {listing.city}
        </p>

        <div className="flex items-center gap-4 text-[13px] text-ink-soft mb-4">
          <span className="flex items-center gap-1.5">
            <BedDouble size={14} /> {listing.rooms} {t.listing.rooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize size={14} /> {listing.area} {t.listing.area}
          </span>
        </div>

        <div className="flex items-end justify-between pt-3 pb-3.5 border-t border-line">
          <span className="font-mono-num font-semibold text-xl text-ink">
            {formatPriceShort(listing.price)}
            {listing.purpose === "rent" && <span className="text-sm font-normal text-ink-soft">{t.listing.perMonth}</span>}
          </span>
          <span className="text-xs text-ink-soft/70">{listing.views} {t.listing.views}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 border-t border-line">
          <span className="flex items-center gap-1.5" title={statusLabel}>
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${statusColor}1E` }}
            >
              <StatusIcon size={12} style={{ color: statusColor }} />
            </span>
            <span className="text-[12px] font-semibold" style={{ color: statusColor }}>{statusLabel}</span>
          </span>

          {previewPlaces.map((place, i) => {
            const Icon = NEARBY_ICONS[place.type] || MapPin;
            const color = getNearbyPlaceColor(place.type);
            return (
              <span key={`${place.name}-${i}`} className="flex items-center gap-1.5">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}1E` }}
                >
                  <Icon size={12} style={{ color }} />
                </span>
                <span className="text-[12px] font-medium text-ink-soft truncate max-w-[110px]">{place.name}</span>
              </span>
            );
          })}
        </div>
      </div>
    </Link>
  );
}
