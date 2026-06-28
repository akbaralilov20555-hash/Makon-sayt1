import { NextRequest, NextResponse } from "next/server";
import { getListings } from "@/lib/db";
import { Listing } from "@/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function detect(text: string): "uz" | "ru" | "en" {
  // 1. Kirill harflari bo'lsa — doim rus tili
  if (/[\u0400-\u04FF]/.test(text)) return "ru";

  const t = text.toLowerCase().trim();
  const words = t.split(/[\s,!?.]+/).filter(Boolean);

  // 2. O'zbek so'zlari — faqat to'liq so'z sifatida (sub-string emas)
  const UZ_SET = new Set([
    "salom","assalom","narx","qancha","kvartira","uy","uylar","ijara","ijaraga",
    "elon","elonlar","qoshish","qidirish","tuman","xona","xonali","makon",
    "sotuvga","sotuv","qanday","bor","yoq","nima","qila","bilan","uchun",
    "yaxshi","hammasi","ishlaydi","togirla","qayta","va","lekin","yana",
    "korinadi","korinmoqda","bering","oling","topish","topildi","korib",
    "bormi","yoqmi","qancha","arzon","qimmat","yangi","katta","kichik",
    "eski","yangilash","rasm","telefon","manzil","aloqa","biznes","ofis",
    "sayt","ishlamoqda","bolamizmi","nomi","ismi"
  ]);

  // 3. Ingliz so'zlari
  const EN_SET = new Set([
    "hello","hi","hey","how","much","cost","what","find","apartment","house",
    "rent","sale","price","room","where","search","list","contact","help",
    "please","thanks","yes","no","the","and","for","with","can","you","want",
    "need","show","tell","about","have","get","give","make","know","more",
    "buy","looking","available","location","address","phone","email","cheap",
    "expensive","new","old","big","small","nice","good","bad","best","want",
    "need","would","like","could","should","does","this","that","there","here",
    "when","where","who","why","which","area","district","city","floor"
  ]);

  let uzCount = 0;
  let enCount = 0;

  for (const w of words) {
    const clean = w.replace(/[^a-z']/g, "");
    if (UZ_SET.has(clean)) uzCount++;
    if (EN_SET.has(clean)) enCount++;
  }

  // O'zbek ustuvor (kamida 1 ta o'zbek so'zi)
  if (uzCount > 0 && uzCount >= enCount) return "uz";

  // Ingliz (kamida 1 ta ingliz so'zi va o'zbek yo'q)
  if (enCount > 0 && uzCount === 0) return "en";

  // Ikkalasida ham so'z yo'q — lotin harflari ko'p bo'lsa ingliz, aks holda o'zbek
  const latinWordCount = words.filter(w => /^[a-zA-Z]{3,}$/.test(w)).length;
  if (latinWordCount >= words.length * 0.6 && words.length >= 2) return "en";

  return "uz";
}

function fmt(l: Listing, loc: "uz" | "ru" | "en") {
  const purpose = loc === "ru"
    ? (l.purpose === "rent" ? "аренда" : "продажа")
    : loc === "en"
    ? (l.purpose === "rent" ? "rent" : "sale")
    : (l.purpose === "rent" ? "ijara" : "sotuv");
  const price = `$${l.price.toLocaleString()}${l.purpose === "rent" ? (loc === "ru" ? "/мес" : loc === "en" ? "/mo" : "/oy") : ""}`;
  return `• ${l.title[loc]} — ${price} | ${l.rooms} ${loc === "ru" ? "комн" : loc === "en" ? "rm" : "xona"}, ${l.area}m² | ${l.district}, ${l.city} | ${purpose}`;
}

// ─── Intent detection ────────────────────────────────────────────────────────

type Intent =
  | "greeting"
  | "search_rent"
  | "search_sale"
  | "search_general"
  | "price_ask"
  | "how_to_list"
  | "how_to_search"
  | "contact"
  | "about"
  | "district_ask"
  | "room_ask"
  | "fallback";

function getIntent(q: string): Intent {
  const t = q.toLowerCase();
  if (/^(salom|привет|hello|hi|hey|assalom)\b/.test(t)) return "greeting";
  if (/ijar|ижар|аренд|rent|snima|снима/.test(t)) return "search_rent";
  if (/sotil|sotib|sotov|продаж|купит|sale|buy/.test(t)) return "search_sale";
  if (/narx|цена|price|qancha|почем|stoit|стоит|нарх/.test(t)) return "price_ask";
  if (/e.?lon\s*(qo|jo)|разместит|добавит|post.*ad|how.*list/.test(t)) return "how_to_list";
  if (/qidir|qidirish|поиск|filter|найт|search|найти/.test(t)) return "how_to_search";
  if (/aloqa|bog.lan|контакт|contact|call|raqam|номер|phone/.test(t)) return "contact";
  if (/makon.*nim|sayt.*him|biz\s*haq|о\s*нас|about/.test(t)) return "about";
  if (/tuman|район|district|hudud/.test(t)) return "district_ask";
  if (/xona|комнат|room/.test(t)) return "room_ask";
  if (/kvartira|uy|дом|house|apt|houz|квартир/.test(t)) return "search_general";
  return "fallback";
}

// ─── Number extractor ────────────────────────────────────────────────────────

function extractRooms(q: string): number | null {
  const m = q.match(/(\d)\s*(?:xona|комнат|room)/i);
  return m ? parseInt(m[1]) : null;
}

function extractDistrict(q: string, listings: Listing[]): string | null {
  const districts = [...new Set(listings.map((l) => l.district.toLowerCase()))];
  for (const d of districts) {
    if (q.toLowerCase().includes(d.toLowerCase())) return d;
  }
  return null;
}

// ─── Response builder ────────────────────────────────────────────────────────

function buildReply(q: string, listings: Listing[]): string {
  const loc = detect(q);
  const intent = getIntent(q);
  const rooms = extractRooms(q);
  const district = extractDistrict(q, listings);

  const CALL = "+998 78 150 99 00";

  // ── Greeting ──
  if (intent === "greeting") {
    return loc === "ru"
      ? "Привет! Я помощник Makon — помогу найти жильё для аренды или покупки в Узбекистане. Что вас интересует?"
      : loc === "en"
      ? "Hi! I'm the Makon assistant — I can help you find rental or sale properties in Uzbekistan. What are you looking for?"
      : "Salom! Men Makon yordamchisiman — O'zbekistonda ijaraga yoki sotib olish uchun uy topishga yordam beraman. Nima qidiryapsiz?";
  }

  // ── Contact ──
  if (intent === "contact") {
    return loc === "ru"
      ? `Наш call-центр работает круглосуточно: ${CALL}\nEmail: hello@makon.uz\nАдрес: Ташкент, ул. Амира Темура, 1`
      : loc === "en"
      ? `Our call center is available 24/7: ${CALL}\nEmail: hello@makon.uz\nAddress: Tashkent, Amir Temur Ave, 1`
      : `Call-markazimiz 24/7 ishlaydi: ${CALL}\nEmail: hello@makon.uz\nManzil: Toshkent, Amir Temur shoh ko'chasi, 1`;
  }

  // ── About ──
  if (intent === "about") {
    return loc === "ru"
      ? "Makon — ведущая платформа аренды и продажи недвижимости в Узбекистане. Тысячи проверенных объявлений в Ташкенте, Самарканде, Бухаре и Фергане."
      : loc === "en"
      ? "Makon is Uzbekistan's leading real estate platform for rent and sale. Thousands of verified listings in Tashkent, Samarkand, Bukhara and Fergana."
      : "Makon — O'zbekistondagi yetakchi ko'chmas mulk platformasi. Toshkent, Samarqand, Buxoro va Farg'onada minglab tekshirilgan e'lonlar.";
  }

  // ── How to list ──
  if (intent === "how_to_list") {
    return loc === "ru"
      ? `Разместить объявление очень просто:\n1. Нажмите "Разместить" в меню сверху\n2. Заполните форму (описание, цена, район, фото)\n3. Нажмите "Разместить объявление"\n\nВаше объявление сразу появится на сайте и будет видно всем посетителям!`
      : loc === "en"
      ? `Listing a property is easy:\n1. Click "List a property" in the top menu\n2. Fill in the form (description, price, district, photos)\n3. Click "Publish listing"\n\nYour listing will appear immediately and be visible to all visitors!`
      : `E'lon joylashtirish juda oson:\n1. Yuqoridagi menyudan "E'lon joylash" tugmasini bosing\n2. Formani to'ldiring (tavsif, narx, tuman, rasmlar)\n3. "E'lonni joylashtirish" tugmasini bosing\n\nE'loningiz darhol saytda paydo bo'ladi va barcha tashrif buyuruvchilarga ko'rinadi!`;
  }

  // ── How to search ──
  if (intent === "how_to_search") {
    return loc === "ru"
      ? `Искать жильё легко:\n1. Откройте раздел "Объявления"\n2. Используйте фильтры: аренда/продажа, тип, район, цена, количество комнат\n3. Переключитесь на карту, чтобы видеть расположение\n\nМожно также ввести адрес или район в строку поиска!`
      : loc === "en"
      ? `Searching is easy:\n1. Open the "Listings" section\n2. Use filters: rent/sale, type, district, price, rooms\n3. Switch to map view to see locations\n\nYou can also type an address or district in the search bar!`
      : `Qidirish juda oson:\n1. "E'lonlar" bo'limini oching\n2. Filtrlardan foydalaning: ijara/sotuv, tur, tuman, narx, xonalar soni\n3. Xarita ko'rinishiga o'ting — manzillarni xaritada ko'ring\n\nQidiruv satriga ham hudud yoki manzil yozishingiz mumkin!`;
  }

  // ── Price ask ──
  if (intent === "price_ask") {
    const rentListings = listings.filter((l) => l.purpose === "rent" && l.currency === "USD");
    const saleListings = listings.filter((l) => l.purpose === "sale" && l.currency === "USD");

    if (rentListings.length === 0 && saleListings.length === 0) {
      return loc === "ru" ? `По ценам обратитесь: ${CALL}` : loc === "en" ? `For pricing, call: ${CALL}` : `Narxlar uchun: ${CALL}`;
    }

    const rentPrices = rentListings.map((l) => l.price);
    const salePrices = saleListings.map((l) => l.price);

    const lines = [];
    if (rentPrices.length > 0) {
      const min = Math.min(...rentPrices);
      const max = Math.max(...rentPrices);
      lines.push(loc === "ru" ? `🏠 Аренда: от $${min} до $${max}/мес` : loc === "en" ? `🏠 Rent: $${min}–$${max}/mo` : `🏠 Ijara: $${min} dan $${max}/oy gacha`);
    }
    if (salePrices.length > 0) {
      const min = Math.min(...salePrices);
      const max = Math.max(...salePrices);
      lines.push(loc === "ru" ? `🏡 Продажа: от $${min.toLocaleString()} до $${max.toLocaleString()}` : loc === "en" ? `🏡 Sale: $${min.toLocaleString()}–$${max.toLocaleString()}` : `🏡 Sotuv: $${min.toLocaleString()} dan $${max.toLocaleString()} gacha`);
    }

    const intro = loc === "ru" ? "Текущий диапазон цен на сайте:" : loc === "en" ? "Current price range on the site:" : "Saytdagi hozirgi narxlar diapazoni:";
    const outro = loc === "ru" ? "\n\nТочную цену смотрите в разделе «Объявления» с фильтрами." : loc === "en" ? "\n\nSee exact prices in the Listings section with filters." : "\n\nAniq narxni filtrlar bilan «E'lonlar» bo'limida ko'ring.";
    return `${intro}\n${lines.join("\n")}${outro}`;
  }

  // ── District ask ──
  if (intent === "district_ask") {
    const tashkentDistricts = [...new Set(listings.filter((l) => l.city === "Toshkent").map((l) => l.district))];
    const otherCities = [...new Set(listings.filter((l) => l.city !== "Toshkent").map((l) => l.city))];
    return loc === "ru"
      ? `Мы работаем в Ташкенте (${tashkentDistricts.join(", ")}) и других городах: ${otherCities.join(", ")}.`
      : loc === "en"
      ? `We cover Tashkent (${tashkentDistricts.join(", ")}) and other cities: ${otherCities.join(", ")}.`
      : `Biz Toshkentda (${tashkentDistricts.join(", ")}) va boshqa shaharlarda: ${otherCities.join(", ")} ishlaymiz.`;
  }

  // ── Search: rent / sale / general ──
  if (["search_rent", "search_sale", "search_general", "room_ask"].includes(intent)) {
    let filtered = listings;

    if (intent === "search_rent") filtered = filtered.filter((l) => l.purpose === "rent");
    if (intent === "search_sale") filtered = filtered.filter((l) => l.purpose === "sale");
    if (rooms) filtered = filtered.filter((l) => l.rooms === rooms);
    if (district) filtered = filtered.filter((l) => l.district.toLowerCase().includes(district));

    const top = filtered.slice(0, 4);

    if (top.length === 0) {
      return loc === "ru"
        ? `По вашему запросу ничего не найдено. Попробуйте изменить фильтры или звоните: ${CALL}`
        : loc === "en"
        ? `Nothing found for your request. Try different filters or call: ${CALL}`
        : `So'rovingiz bo'yicha hech narsa topilmadi. Filtrlarni o'zgartirib ko'ring yoki qo'ng'iroq qiling: ${CALL}`;
    }

    const intro = loc === "ru"
      ? `Нашёл ${filtered.length} объявлений. Вот несколько:`
      : loc === "en"
      ? `Found ${filtered.length} listing${filtered.length > 1 ? "s" : ""}. Here are some:`
      : `${filtered.length} ta e'lon topildi. Bir nechtasi:`;

    const outro = filtered.length > 4
      ? (loc === "ru" ? `\n\n...va yana ${filtered.length - 4} ta. To'liq ko'rish uchun «E'lonlar» bo'limini oching.`
        : loc === "en" ? `\n\n...and ${filtered.length - 4} more. Open "Listings" to see all.`
        : `\n\n...va yana ${filtered.length - 4} ta. Barchasini ko'rish uchun «E'lonlar» bo'limini oching.`)
      : "";

    return `${intro}\n\n${top.map((l) => fmt(l, loc)).join("\n")}${outro}`;
  }

  // ── Fallback ──
  return loc === "ru"
    ? `Я могу помочь:\n• 🔍 Найти жильё для аренды или покупки\n• 💰 Узнать цены\n• 📋 Разместить объявление\n• 📞 Контакты: ${CALL}\n\nЧто вас интересует?`
    : loc === "en"
    ? `I can help you:\n• 🔍 Find rental or sale properties\n• 💰 Check prices\n• 📋 List a property\n• 📞 Call us: ${CALL}\n\nWhat are you looking for?`
    : `Men yordam bera olaman:\n• 🔍 Ijara yoki sotuv uchun uy topish\n• 💰 Narxlarni bilish\n• 📋 E'lon joylashtirish\n• 📞 Qo'ng'iroq: ${CALL}\n\nNima qidiryapsiz?`;
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];

    const lastUserMsg = [...rawMessages]
      .reverse()
      .find((m: { role: string; content: string }) => m.role === "user")?.content ?? "";

    if (!lastUserMsg.trim()) {
      return NextResponse.json({ reply: "Savolingizni yozing." });
    }

    const listings = getListings();
    const reply = buildReply(lastUserMsg.trim(), listings);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("chat error", err);
    return NextResponse.json({ reply: "Xatolik yuz berdi. +998 78 150 99 00 ga murojaat qiling." });
  }
}
