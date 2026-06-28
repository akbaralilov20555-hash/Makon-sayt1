import type { Metadata } from "next";
import { getListingById } from "@/lib/db";
import { formatPriceShort } from "@/lib/utils";
import ListingDetailView from "./ListingDetailView";

const PROPERTY_TYPE_LABEL_UZ: Record<string, string> = {
  apartment: "Kvartira", house: "Uy", room: "Xona", studio: "Studiya", commercial: "Tijorat mulki",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    return { title: "E'lon topilmadi" };
  }

  const title = listing.title.uz;
  const priceText = `${formatPriceShort(listing.price)}${listing.purpose === "rent" ? "/oy" : ""}`;
  const typeLabel = PROPERTY_TYPE_LABEL_UZ[listing.propertyType] || "Ko'chmas mulk";
  const description =
    `${priceText} — ${typeLabel}, ${listing.rooms} xona, ${listing.area} m², ${listing.district}, ${listing.city}. ${listing.description.uz}`.slice(0, 180);

  return {
    title,
    description,
    openGraph: {
      title: `${title} — ${priceText}`,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${title} — ${priceText}`,
      description,
    },
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListingById(id);

  const jsonLd = listing
    ? {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: listing.title.uz,
        description: listing.description.uz,
        url: `https://makon.uz/listings/${listing.id}`,
        datePosted: listing.createdAt,
        offers: {
          "@type": "Offer",
          price: listing.price,
          priceCurrency: listing.currency,
          availability: "https://schema.org/InStock",
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: listing.address,
          addressLocality: listing.district,
          addressRegion: listing.city,
          addressCountry: "UZ",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: listing.lat,
          longitude: listing.lng,
        },
        numberOfRooms: listing.rooms,
        floorSize: {
          "@type": "QuantitativeValue",
          value: listing.area,
          unitCode: "MTK",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ListingDetailView />
    </>
  );
}
