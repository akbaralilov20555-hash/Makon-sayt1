"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AiChatWidget } from "@/components/AiChatWidget";
import { MapWrapper } from "@/components/MapWrapper";
import { ListingCard } from "@/components/ListingCard";
import { Listing, DemolitionStatus } from "@/types";
import { useT } from "@/lib/locale-store";
import { useAuthStore } from "@/lib/auth-store";
import { formatPriceShort, getDemolitionColor, getNearbyPlaceColor, isDisplayableImage } from "@/lib/utils";
import { NEARBY_ICONS, DEMOLITION_ICONS } from "@/lib/place-icons";
import { DemolitionLegend } from "@/components/DemolitionLegend";
import { FavoriteButton } from "@/components/FavoriteButton";
import {
  ArrowLeft, BadgeCheck, MapPin, BedDouble, Maximize, Building2,
  Phone, MessageCircle, Eye, Wifi, Car, Sofa, Wind, ArrowUpDown,
  DoorOpen, ShieldCheck, UtensilsCrossed, WashingMachine, Refrigerator, Tv, Flame,
  Trash2, Share2, Check, type LucideIcon,
} from "lucide-react";

const AMENITY_ICONS: Record<string, LucideIcon> = {
  wifi: Wifi, parking: Car, furniture: Sofa, ac: Wind,
  elevator: ArrowUpDown, balcony: DoorOpen, security: ShieldCheck, kitchen: UtensilsCrossed,
  washer: WashingMachine, fridge: Refrigerator, tv: Tv, heating: Flame,
};

const GRADIENTS: Record<string, string> = {
  apartment: "from-terracotta/25 via-terracotta/10 to-cream-deep",
  house: "from-olive/25 via-olive/10 to-cream-deep",
  studio: "from-gold/25 via-gold/10 to-cream-deep",
  room: "from-terracotta/20 via-olive/10 to-cream-deep",
  commercial: "from-ink/15 via-ink/5 to-cream-deep",
};

export default function ListingDetailView() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { t, locale } = useT();
  const { user } = useAuthStore();
  const [listing, setListing] = useState<Listing | null>(null);
  const [similar, setSimilar] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  async function shareListing() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = { title: listing?.title[locale] || "Makon", url };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled or share failed — fall back to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setListing(data.listing);
        setLoading(false);
        if (data.listing) {
          fetch(`/api/listings?district=${encodeURIComponent(data.listing.district)}`)
            .then((r) => r.json())
            .then((d) => {
              if (!cancelled) setSimilar(d.listings.filter((l: Listing) => l.id !== id).slice(0, 3));
            });
        }
      })
      .catch(() => setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 mx-auto max-w-7xl px-5 sm:px-8 py-10 w-full">
          <div className="h-[420px] rounded-2xl bg-cream-deep animate-pulse" />
        </main>
        <Footer />
      </>
    );
  }

  if (!listing) {
    return (
      <>
        <Header />
        <main className="flex-1 mx-auto max-w-2xl px-5 py-24 text-center">
          <p className="font-display text-2xl text-ink">E&apos;lon topilmadi</p>
          <Link href="/listings" className="inline-block mt-6 text-terracotta font-semibold">
            {t.listing.backToListings}
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const realImages = listing.images.filter(isDisplayableImage);

  // O'chirish ruxsati: faqat login bo'lgan foydalanuvchi o'z e'lonini o'chira oladi
  const canDelete = user !== null && listing.ownerId === user.id;

  async function deleteListing() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        router.push("/listings");
      } else {
        const data = await res.json();
        alert(data.error || "O'chirishda xatolik yuz berdi");
        setDeleting(false);
        setDeleteConfirm(false);
      }
    } catch {
      alert("Tarmoq xatoligi. Qayta urinib ko'ring.");
      setDeleting(false);
      setDeleteConfirm(false);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-8">
          <Link href="/listings" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-terracotta transition-colors mb-6">
            <ArrowLeft size={15} /> {t.listing.backToListings}
          </Link>

          {realImages.length > 0 ? (
            <div className="mb-8">
              <div className="relative h-[320px] sm:h-[440px] rounded-2xl overflow-hidden bg-cream-deep">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={realImages[Math.min(activeImage, realImages.length - 1)]}
                  alt={listing.title[locale]}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-ink/85 text-cream backdrop-blur-sm">
                    {listing.purpose === "rent" ? t.filters.rent : t.filters.sale}
                  </span>
                  {listing.verified && (
                    <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-olive text-cream flex items-center gap-1.5">
                      <BadgeCheck size={14} /> {t.listing.verified}
                    </span>
                  )}
                </div>
              </div>
              {realImages.length > 1 && (
                <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                  {realImages.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                        i === activeImage ? "border-terracotta" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={`relative h-[320px] sm:h-[440px] rounded-2xl bg-gradient-to-br ${GRADIENTS[listing.propertyType] || GRADIENTS.apartment} flex items-center justify-center overflow-hidden mb-8`}>
              <svg width="200" height="200" viewBox="0 0 34 34" fill="none" className="opacity-20">
                <path d="M5 30V16C5 9.37258 10.3726 4 17 4C23.6274 4 29 9.37258 29 16V30" stroke="#211712" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M11 30V18C11 14.6863 13.6863 12 17 12C20.3137 12 23 14.6863 23 18V30" stroke="#211712" strokeWidth="1" strokeLinecap="round" />
              </svg>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-ink/85 text-cream backdrop-blur-sm">
                  {listing.purpose === "rent" ? t.filters.rent : t.filters.sale}
                </span>
                {listing.verified && (
                  <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-olive text-cream flex items-center gap-1.5">
                    <BadgeCheck size={14} /> {t.listing.verified}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-10">
            <div>
              <div className="flex items-start justify-between gap-4 mb-1.5">
                <h1 className="font-display text-3xl sm:text-[36px] font-semibold text-ink leading-tight">
                  {listing.title[locale]}
                </h1>
                <div className="shrink-0 flex items-center gap-2 mt-1">
                  <button
                    onClick={shareListing}
                    title={t.listing.share}
                    className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-ink-soft hover:bg-cream-deep transition-colors relative"
                  >
                    {linkCopied ? <Check size={16} className="text-olive" /> : <Share2 size={16} />}
                  </button>
                  <FavoriteButton listingId={listing.id} size="lg" className="border border-line" />
                  {canDelete && !deleteConfirm && (
                    <button
                      onClick={() => setDeleteConfirm(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-terracotta/40 text-terracotta text-sm font-medium hover:bg-terracotta/10 transition-colors"
                    >
                      <Trash2 size={15} /> O&apos;chirish
                    </button>
                  )}
                </div>
              </div>

              {canDelete && deleteConfirm && (
                <div className="flex items-center gap-2 mb-1.5 justify-end">
                  <span className="text-sm text-ink-soft">Ishonchingiz komilmi?</span>
                  <button
                    onClick={deleteListing}
                    disabled={deleting}
                    className="px-4 py-2 rounded-full bg-terracotta text-white text-sm font-semibold hover:bg-terracotta-deep transition-colors disabled:opacity-60"
                  >
                    {deleting ? "O'chirilmoqda..." : "Ha, o'chir"}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="px-4 py-2 rounded-full border border-line text-ink-soft text-sm font-medium hover:bg-cream-deep transition-colors"
                  >
                    Bekor
                  </button>
                </div>
              )}
              <p className="flex items-center gap-1.5 text-ink-soft mt-3">
                <MapPin size={16} /> {listing.address}, {listing.district}, {listing.city}
              </p>

              {(() => {
                const status: DemolitionStatus = listing.demolitionStatus || "unknown";
                const color = getDemolitionColor(status);
                const DIcon = DEMOLITION_ICONS[status];
                const label = status === "safe" ? t.listing.demolitionSafe : status === "soon" ? t.listing.demolitionSoon : t.listing.demolitionUnknown;
                const desc = status === "safe" ? t.listing.demolitionSafeDesc : status === "soon" ? t.listing.demolitionSoonDesc : t.listing.demolitionUnknownDesc;
                return (
                  <div className="mt-4 rounded-xl border overflow-hidden" style={{ borderColor: `${color}40` }}>
                    <div className="flex items-start gap-3 px-4 py-3" style={{ backgroundColor: `${color}14` }}>
                      <DIcon size={20} style={{ color }} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold" style={{ color }}>{t.listing.demolitionStatus}: {label}</p>
                        <p className="text-xs text-ink-soft mt-0.5">{desc}</p>
                      </div>
                    </div>
                    <div className="px-4 py-2.5 bg-card border-t" style={{ borderColor: `${color}25` }}>
                      <DemolitionLegend active={status} compact />
                    </div>
                  </div>
                );
              })()}

              <div className="flex flex-wrap items-center gap-6 mt-6 pb-6 border-b border-line">
                <span className="flex items-center gap-2 text-ink-soft">
                  <BedDouble size={18} className="text-terracotta" />
                  <span className="font-semibold text-ink">{listing.rooms}</span> {t.listing.rooms}
                </span>
                <span className="flex items-center gap-2 text-ink-soft">
                  <Maximize size={18} className="text-terracotta" />
                  <span className="font-semibold text-ink">{listing.area}</span> {t.listing.area}
                </span>
                {listing.floor && (
                  <span className="flex items-center gap-2 text-ink-soft">
                    <Building2 size={18} className="text-terracotta" />
                    <span className="font-semibold text-ink">{listing.floor}</span>/{listing.totalFloors} {t.listing.floor}
                  </span>
                )}
                <span className="flex items-center gap-2 text-ink-soft/70 text-sm">
                  <Eye size={15} /> {listing.views} {t.listing.views}
                </span>
              </div>

              <div className="py-6 border-b border-line">
                <h2 className="font-display font-semibold text-xl text-ink mb-3">Tavsif</h2>
                <p className="text-ink-soft leading-relaxed">{listing.description[locale]}</p>
              </div>

              {listing.amenities.length > 0 && (
                <div className="py-6 border-b border-line">
                  <h2 className="font-display font-semibold text-xl text-ink mb-4">{t.listing.amenities}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {listing.amenities.map((a) => {
                      const Icon = AMENITY_ICONS[a] || Wifi;
                      return (
                        <div key={a} className="flex items-center gap-2.5 text-sm text-ink-soft bg-cream-deep rounded-xl px-3.5 py-3">
                          <Icon size={16} className="text-olive shrink-0" />
                          {(t.amenities as Record<string, string>)[a] || a}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {listing.nearbyPlaces && listing.nearbyPlaces.length > 0 && (
                <div className="py-6 border-b border-line">
                  <h2 className="font-display font-semibold text-xl text-ink mb-4">{t.listing.nearbyPlaces}</h2>
                  <div className="flex flex-wrap gap-x-5 gap-y-3.5">
                    {listing.nearbyPlaces.map((place, i) => {
                      const Icon = NEARBY_ICONS[place.type] || MapPin;
                      const color = getNearbyPlaceColor(place.type);
                      return (
                        <div key={`${place.name}-${i}`} className="flex items-center gap-2.5">
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${color}1E` }}
                          >
                            <Icon size={15} style={{ color }} />
                          </span>
                          <span>
                            <span className="block font-semibold text-sm text-ink leading-tight">{place.name}</span>
                            {place.distance && <span className="block text-xs text-ink-soft/60 leading-tight">{place.distance}</span>}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="py-6">
                <h2 className="font-display font-semibold text-xl text-ink mb-4">{t.listing.location}</h2>
                <div className="h-[340px] rounded-2xl overflow-hidden border border-line">
                  <MapWrapper listings={[listing]} center={[listing.lat, listing.lng]} zoom={15} />
                </div>
              </div>
            </div>

            <div>
              <div className="sticky top-24 bg-card border border-line rounded-2xl p-6">
                <p className="font-mono-num font-semibold text-3xl text-ink">
                  {formatPriceShort(listing.price)}
                  {listing.purpose === "rent" && <span className="text-base font-normal text-ink-soft">{t.listing.perMonth}</span>}
                </p>

                <div className="mt-6 pt-6 border-t border-line">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70 mb-3">{t.listing.owner}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center font-display font-semibold">
                      {listing.ownerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-ink text-sm">{listing.ownerName}</p>
                      {listing.verified && (
                        <p className="text-xs text-olive flex items-center gap-1"><BadgeCheck size={12} /> {t.listing.verified}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  {showPhone ? (
                    <a
                      href={`tel:${listing.ownerPhone.replace(/\s/g, "")}`}
                      className="flex items-center justify-center gap-2 h-12 rounded-full bg-terracotta text-white font-semibold hover:bg-terracotta-deep transition-colors font-mono-num"
                    >
                      <Phone size={16} /> {listing.ownerPhone}
                    </a>
                  ) : (
                    <button
                      onClick={() => setShowPhone(true)}
                      className="flex items-center justify-center gap-2 h-12 rounded-full bg-terracotta text-white font-semibold hover:bg-terracotta-deep transition-colors"
                    >
                      <Phone size={16} /> {t.listing.call}
                    </button>
                  )}
                  <a
                    href="tel:+998781509900"
                    className="flex items-center justify-center gap-2 h-12 rounded-full border border-line text-ink font-semibold hover:bg-cream-deep transition-colors"
                  >
                    <MessageCircle size={16} /> Call-markaz: +998 78 150 99 00
                  </a>
                </div>
              </div>
            </div>
          </div>

          {similar.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-semibold text-ink mb-6">{t.listing.similar}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AiChatWidget />
    </>
  );
}
