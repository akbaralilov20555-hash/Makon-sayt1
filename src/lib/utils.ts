import { Listing, DemolitionStatus } from "@/types";

export function formatPrice(listing: Listing): string {
  const num = listing.price.toLocaleString("en-US");
  const suffix = listing.purpose === "rent" ? "/oy" : "";
  return `$${num}${suffix}`;
}

export function formatPriceShort(price: number): string {
  return `$${price.toLocaleString("en-US")}`;
}

export const PROPERTY_TYPE_ICONS: Record<string, string> = {
  apartment: "Building2",
  house: "Home",
  room: "DoorOpen",
  studio: "Square",
  commercial: "Store",
};

export function isDisplayableImage(img: string): boolean {
  return img.startsWith("/uploads/") || img.startsWith("/images/");
}

export const DEMOLITION_COLORS: Record<DemolitionStatus, string> = {
  safe: "#2E7D46",
  soon: "#C0392B",
  unknown: "#D4A017",
};

export const DEMOLITION_ORDER: DemolitionStatus[] = ["safe", "unknown", "soon"];

export function getDemolitionStatus(listing: Listing): DemolitionStatus {
  return listing.demolitionStatus || "unknown";
}

export function getDemolitionColor(status?: DemolitionStatus): string {
  return DEMOLITION_COLORS[status || "unknown"];
}

export const NEARBY_PLACE_COLORS: Record<string, string> = {
  school: "#D97706",
  kindergarten: "#DB2777",
  shop: "#7C3AED",
  market: "#16A34A",
  hospital: "#DC2626",
  pharmacy: "#E11D48",
  metro: "#2563EB",
  busStop: "#475569",
  park: "#059669",
  mosque: "#4F46E5",
  restaurant: "#EA580C",
  bank: "#52525B",
  gym: "#DC2626",
  other: "#6B7280",
};

export function getNearbyPlaceColor(type: string): string {
  return NEARBY_PLACE_COLORS[type] || NEARBY_PLACE_COLORS.other;
}
