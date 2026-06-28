import { MetadataRoute } from "next";
import { getListings } from "@/lib/db";

const BASE_URL = "https://makon.uz";

export default function sitemap(): MetadataRoute.Sitemap {
  let listingEntries: MetadataRoute.Sitemap = [];

  try {
    const listings = getListings();
    listingEntries = listings.map((l) => ({
      url: `${BASE_URL}/listings/${l.id}`,
      lastModified: l.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // If the data store isn't available at build time, fall back to static routes only.
    listingEntries = [];
  }

  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/listings`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/listings/new`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contacts`, changeFrequency: "monthly", priority: 0.4 },
  ];

  return [...staticEntries, ...listingEntries];
}
