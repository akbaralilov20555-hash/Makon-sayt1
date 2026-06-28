import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const MAX_FILES_PER_REQUEST = 8;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function ensureDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function isReadOnlyFsError(err: unknown): boolean {
  const code = (err as { code?: string } | null)?.code;
  return code === "EROFS" || code === "EACCES" || code === "EPERM";
}

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string" || !url.startsWith("/uploads/")) {
      return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
    }

    // Faqat uploads papkasi ichidagi faylga ruxsat (papkadan chiqib ketishni oldini olish)
    const filename = path.basename(url);
    const filepath = path.join(UPLOAD_DIR, filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "O'chirishda xatolik yuz berdi" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Fayl tanlanmagan" }, { status: 400 });
    }
    if (files.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json({ error: `Bir martada eng ko'pi bilan ${MAX_FILES_PER_REQUEST} ta rasm yuklash mumkin` }, { status: 400 });
    }

    ensureDir();
    const urls: string[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: "Faqat rasm fayllari qabul qilinadi (jpg, png, webp, gif)" }, { status: 400 });
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: "Rasm hajmi 8MB dan oshmasligi kerak" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.type.split("/")[1] || "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      fs.writeFileSync(filepath, buffer);
      urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch (err) {
    if (isReadOnlyFsError(err)) {
      console.error("Upload error (read-only filesystem — needs cloud storage in production):", err);
      return NextResponse.json(
        { error: "Bu serverda rasm saqlash hali sozlanmagan. Productionda bulutli xotira (masalan Vercel Blob) ulanishi kerak." },
        { status: 503 }
      );
    }
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Yuklashda xatolik yuz berdi" }, { status: 500 });
  }
}
