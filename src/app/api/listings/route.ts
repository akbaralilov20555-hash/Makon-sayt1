import { NextRequest, NextResponse } from "next/server";
import { getListings, addListing, findUserByToken } from "@/lib/db";
import { Listing } from "@/types";

export async function GET(req: NextRequest) {
  const listings = getListings();
  const { searchParams } = new URL(req.url);

  let result = listings;

  const purpose = searchParams.get("purpose");
  if (purpose) result = result.filter((l) => l.purpose === purpose);

  const type = searchParams.get("type");
  if (type) result = result.filter((l) => l.propertyType === type);

  const district = searchParams.get("district");
  if (district) result = result.filter((l) => l.district === district);

  const priceFrom = searchParams.get("priceFrom");
  if (priceFrom) result = result.filter((l) => l.price >= Number(priceFrom));

  const priceTo = searchParams.get("priceTo");
  if (priceTo) result = result.filter((l) => l.price <= Number(priceTo));

  const rooms = searchParams.get("rooms");
  if (rooms) result = result.filter((l) => l.rooms >= Number(rooms));

  const q = searchParams.get("q");
  if (q) {
    const ql = q.toLowerCase();
    result = result.filter(
      (l) =>
        l.title.uz.toLowerCase().includes(ql) ||
        l.title.ru.toLowerCase().includes(ql) ||
        l.title.en.toLowerCase().includes(ql) ||
        l.district.toLowerCase().includes(ql) ||
        l.address.toLowerCase().includes(ql) ||
        l.city.toLowerCase().includes(ql)
    );
  }

  const sort = searchParams.get("sort");
  result = [...result];
  if (sort === "price_asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === "popular") {
    result.sort((a, b) => b.views - a.views);
  } else {
    // newest first (default)
    result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
  }

  return NextResponse.json({ listings: result, total: result.length });
}

const VALID_PURPOSES = ["rent", "sale"];
const VALID_TYPES = ["apartment", "house", "room", "studio", "commercial"];

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov formati" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const purpose = typeof body.purpose === "string" ? body.purpose : "";
  const propertyType = typeof body.propertyType === "string" ? body.propertyType : "";
  const district = typeof body.district === "string" ? body.district.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const ownerName = typeof body.ownerName === "string" ? body.ownerName.trim() : "";
  const ownerPhone = typeof body.ownerPhone === "string" ? body.ownerPhone.trim() : "";
  const price = Number(body.price);
  const rooms = Number(body.rooms);
  const area = Number(body.area);

  const errors: string[] = [];
  if (!title || title.length > 200) errors.push("Sarlavha noto'g'ri");
  if (!description || description.length > 4000) errors.push("Tavsif noto'g'ri");
  if (!VALID_PURPOSES.includes(purpose)) errors.push("Maqsad noto'g'ri");
  if (!VALID_TYPES.includes(propertyType)) errors.push("Mulk turi noto'g'ri");
  if (!district) errors.push("Tuman tanlanmagan");
  if (!address) errors.push("Manzil kiritilmagan");
  if (!ownerName) errors.push("Ism kiritilmagan");
  if (!ownerPhone) errors.push("Telefon raqam kiritilmagan");
  if (!Number.isFinite(price) || price <= 0 || price > 100_000_000) errors.push("Narx noto'g'ri");
  if (!Number.isFinite(rooms) || rooms <= 0 || rooms > 50) errors.push("Xonalar soni noto'g'ri");
  if (!Number.isFinite(area) || area <= 0 || area > 100_000) errors.push("Maydon noto'g'ri");

  const images = Array.isArray(body.images)
    ? body.images.filter((u): u is string => typeof u === "string" && u.startsWith("/uploads/")).slice(0, 8)
    : [];
  const amenities = Array.isArray(body.amenities)
    ? body.amenities.filter((a): a is string => typeof a === "string").slice(0, 20)
    : [];

  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0] }, { status: 400 });
  }

  const token = req.cookies.get("makon_session")?.value;
  const sessionUser = token ? findUserByToken(token) : null;

  const lat = typeof body.lat === "number" && Number.isFinite(body.lat) ? body.lat : 41.3111 + (Math.random() - 0.5) * 0.1;
  const lng = typeof body.lng === "number" && Number.isFinite(body.lng) ? body.lng : 69.2797 + (Math.random() - 0.5) * 0.1;

  const newListing: Listing = {
    id: "l" + Date.now() + Math.random().toString(36).slice(2, 7),
    title: { uz: title, ru: title, en: title },
    description: { uz: description, ru: description, en: description },
    purpose: purpose as Listing["purpose"],
    propertyType: propertyType as Listing["propertyType"],
    price,
    currency: body.currency === "UZS" ? "UZS" : "USD",
    pricePeriod: purpose === "rent" ? "month" : "total",
    city: "Toshkent",
    district,
    address,
    lat,
    lng,
    rooms,
    area,
    images,
    amenities,
    ownerId: sessionUser ? sessionUser.id : "self",
    ownerName,
    ownerPhone,
    verified: false,
    featured: false,
    createdAt: new Date().toISOString().slice(0, 10),
    views: 0,
  };

  const saved = addListing(newListing);
  return NextResponse.json({ listing: saved }, { status: 201 });
}
