export type ListingPurpose = "rent" | "sale";

export type PropertyType = "apartment" | "house" | "room" | "studio" | "commercial";

export type NearbyPlaceType =
  | "school" | "kindergarten" | "shop" | "market" | "hospital" | "pharmacy"
  | "metro" | "busStop" | "park" | "mosque" | "restaurant" | "bank" | "gym" | "other";

export interface NearbyPlace {
  name: string;
  type: NearbyPlaceType;
  distance?: string;
  lat?: number;
  lng?: number;
}

export type DemolitionStatus = "safe" | "soon" | "unknown";

export interface Listing {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  purpose: ListingPurpose;
  propertyType: PropertyType;
  price: number;
  currency: "UZS" | "USD";
  pricePeriod?: "month" | "day" | "total";
  city: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  rooms: number;
  area: number;
  floor?: number;
  totalFloors?: number;
  images: string[];
  amenities: string[];
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  verified: boolean;
  featured: boolean;
  createdAt: string;
  views: number;
  nearbyPlaces?: NearbyPlace[];
  demolitionStatus?: DemolitionStatus;
}

export type Locale = "uz" | "ru" | "en";

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  sessionToken?: string;
  role: "tenant" | "owner" | "agent";
  createdAt: string;
  avatar?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
