import { NextRequest, NextResponse } from "next/server";
import { getListingById, getListings, saveListings, findUserByToken } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }

  const listings = getListings();
  const idx = listings.findIndex((l) => l.id === id);
  if (idx !== -1) {
    listings[idx].views += 1;
    saveListings(listings);
  }

  return NextResponse.json({ listing: { ...listing, views: listing.views + 1 } });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Session tekshiruvi — login bo'lgan bo'lishi shart
  const token = req.cookies.get("makon_session")?.value;
  const sessionUser = token ? findUserByToken(token) : null;

  const listing = getListingById(id);
  if (!listing) {
    return NextResponse.json({ error: "E'lon topilmadi" }, { status: 404 });
  }

  // Login bo'lmagan bo'lsa rad etish
  if (!sessionUser) {
    return NextResponse.json({ error: "Buning uchun avval tizimga kiring" }, { status: 401 });
  }

  // Faqat o'z e'lonini o'chira oladi
  if (listing.ownerId !== sessionUser.id) {
    return NextResponse.json({ error: "Bu e'lonni o'chirish uchun ruxsatingiz yo'q" }, { status: 403 });
  }

  // Yuklangan rasmlarni diskdan o'chirish
  for (const imgUrl of listing.images) {
    if (imgUrl.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", imgUrl);
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch {
        // Fayl o'chirilmasa ham davom etamiz
      }
    }
  }

  // E'lonni bazadan o'chirish
  const listings = getListings();
  const filtered = listings.filter((l) => l.id !== id);
  saveListings(filtered);

  return NextResponse.json({ ok: true });
}
