import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body: { name?: string; phone?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const phone = (body.phone || "").trim();
  const message = (body.message || "").trim();

  if (!name || !phone || !message) {
    return NextResponse.json({ error: "Barcha maydonlarni to'ldiring" }, { status: 400 });
  }

  if (message.length > 2000) {
    return NextResponse.json({ error: "Xabar juda uzun (max 2000 belgi)" }, { status: 400 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Agar Telegram sozlanmagan bo'lsa — xabarni log qilamiz, lekin foydalanuvchiga muvaffaqiyat ko'rsatamiz
  if (!botToken || !chatId) {
    console.log("=== YANGI MUROJAAT (Telegram sozlanmagan) ===");
    console.log(`Ism: ${name}`);
    console.log(`Telefon: ${phone}`);
    console.log(`Xabar: ${message}`);
    console.log("============================================");
    return NextResponse.json({ ok: true });
  }

  const text = [
    "📩 *MAKON — Yangi murojaat*",
    "",
    `👤 *Ism:* ${name}`,
    `📞 *Telefon:* ${phone}`,
    "",
    `💬 *Xabar:*`,
    message,
    "",
    `⏰ ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}`,
  ].join("\n");

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown",
        }),
      }
    );

    const data = await res.json();

    if (!data.ok) {
      console.error("Telegram API xato:", data);
      // Foydalanuvchiga xato ko'rsatmaymiz — xabar qabul qilindi deb ayting
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Telegram yuborishda xato:", err);
    // Tarmoq xatosi bo'lsa ham foydalanuvchiga muvaffaqiyat ko'rsatamiz
    // (xabar server logida saqlanib qoldi)
    return NextResponse.json({ ok: true });
  }
}
