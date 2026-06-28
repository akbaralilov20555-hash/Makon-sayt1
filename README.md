# Makon — uy-joy ijarasi va sotuv platformasi

Next.js (App Router) + TypeScript + Tailwind CSS asosida qurilgan to'liq funksional uy-joy ijarasi/sotuv platformasi. O'zbek, rus va ingliz tillarini qo'llab-quvvatlaydi, real interaktiv xarita, AI yordamchi va ishlaydigan demo backend bilan keladi.

## Xususiyatlar

- E'lonlar ro'yxati, filtrlash (maqsad, tur, tuman, narx, xonalar soni)
- Real interaktiv xarita (OpenStreetMap / Leaflet) — alohida e'lon va ro'yxat ko'rinishida
- AI yordamchi (Claude API orqali) — uy-joy bo'yicha savollarga javob beradi
- 3 tilli interfeys: o'zbek, rus, ingliz
- Ro'yxatdan o'tish / kirish va shaxsiy kabinet
- Yangi e'lon qo'shish formasi (to'liq ishlaydi, darhol saytda paydo bo'ladi)
- Aloqa sahifasi (call-markaz, manzil, real xarita, murojaat formasi)
- To'liq responsive (mobil, planshet, desktop)

## O'rnatish

Talab qilinadi: **Node.js 18+** (tavsiya etiladi 20+)

```bash
npm install
```

## Ishga tushirish (development rejimi)

```bash
npm run dev
```

Brauzerda oching: http://localhost:3000

## Production uchun build

```bash
npm run build
npm run start
```

## AI yordamchini yoqish (MUHIM — zaruriy qadam)

Sayt birinchi marta ishga tushganda AI chat-widget "AI bilan bog'lanib bo'lmadi, call-markazga murojaat qiling" deb javob beradi. Bu xato emas — bu AI yordamchi ishlashi uchun **bitta bepul kalit** kerakligini bildiradi. Buni quyidagicha 5 daqiqada hal qilasiz:

**1-qadam — kalit oling**

1. https://console.anthropic.com saytiga kiring (ro'yxatdan o'ting yoki kiring)
2. Chap menyudan **"Get API keys"** yoki **"API Keys"** bo'limiga o'ting: https://console.anthropic.com/settings/keys
3. **"Create Key"** tugmasini bosing, kalitga nom bering (masalan "Makon sayti"), yarating
4. Hosil bo'lgan kalitni nusxalang — u `sk-ant-...` bilan boshlanadi (faqat bir marta to'liq ko'rsatiladi, saqlab qo'ying)
5. Hisobingizda biroz kredit (balans) bo'lishi kerak — https://console.anthropic.com/settings/billing orqali kamida $5 qo'shing. AI chat juda arzon ishlaydi (har bir javob taxminan $0.001-0.01 atrofida).

**2-qadam — kalitni loyihaga qo'shing**

Loyiha papkasida (`makon` papkasi ichida, `package.json` bilan bir joyda) `.env.local` nomli yangi fayl yarating va ichiga shuni yozing:

```
ANTHROPIC_API_KEY=sk-ant-bu_yerga_oz_kalitingizni_qoying
```

(Windows'da: Notepad oching → shu qatorni yozing → "Saqlash" → fayl nomini `.env.local` deb kiriting, "Barcha fayllar" turini tanlang, loyiha papkasiga saqlang)

**3-qadam — serverni qayta ishga tushiring**

Terminalda serverni to'xtating (Ctrl+C) va qayta ishga tushiring:

```bash
npm run dev
```

Shu bilan AI yordamchi to'liq ishlay boshlaydi — har qanday savolga (uy-joy, narxlar, sayt bo'yicha) javob beradi.

**Production (`npm run build` + `npm run start`) uchun ham xuddi shunday — bitta `.env.local` fayli yetarli.**

Agar saytni biror hostingga (Vercel, va h.k.) joylashtirsangiz, `.env.local` fayl o'rniga hosting platformasining "Environment Variables" sozlamalariga `ANTHROPIC_API_KEY` ni qo'shasiz.

## Ma'lumotlar bazasi haqida

Loyiha engil, fayl asosidagi demo "backend" bilan keladi (`.db/` papkasida JSON fayllar — birinchi ishga tushirishda avtomatik yaratiladi). Bu degani:

- Yangi qo'shilgan e'lonlar va ro'yxatdan o'tgan foydalanuvchilar serverga haqiqatan saqlanadi va sahifa yangilanganda yo'qolmaydi.
- Bu juda katta miqyosli yuklama uchun mos emas — real ko'plab foydalanuvchi kutilsa, buni PostgreSQL/MySQL kabi haqiqiy ma'lumotlar bazasiga almashtirish tavsiya etiladi (Prisma ORM bilan oson bog'lanadi).

## Loyiha tuzilishi

```
src/
  app/                  -> sahifalar va API route'lar
    api/                -> backend endpoint'lar (listings, auth, ai-chat)
    listings/           -> e'lonlar ro'yxati va detal sahifalari
    dashboard/          -> foydalanuvchi kabineti
    auth/               -> kirish/ro'yxatdan o'tish
    contacts/           -> aloqa sahifasi
  components/           -> qayta ishlatiluvchi UI komponentlar
  lib/                  -> yordamchi funksiyalar, i18n, store'lar
  data/                 -> boshlang'ich demo e'lonlar
  types/                -> TypeScript tip ta'riflari
```

## Nomi va brendni o'zgartirish

Sayt nomi "Makon" — agar boshqa nom bilan almashtirmoqchi bo'lsangiz:
- `src/components/Logo.tsx` — logotip matni
- `src/app/layout.tsx` — sahifa sarlavhasi (title)
- `src/lib/i18n.ts` — barcha matnlar shu yerda joylashgan

## Call-markaz raqami

Hozircha +998 78 150 99 00 namuna sifatida qo'yilgan. O'zgartirish uchun loyiha bo'ylab shu raqamni qidiring (Header.tsx, Footer.tsx, contacts/page.tsx va h.k.) yoki "Topish va almashtirish" funksiyasidan foydalaning.

## Telegram bot sozlash (aloqa formasi + Mini App)

### 1-qism: Aloqa formasidan xabarlarni Telegram'ga olish

**Qadam 1 — Bot yarating:**
1. Telegram'da [@BotFather](https://t.me/BotFather) ga yozing
2. `/newbot` buyrug'ini yuboring
3. Botga nom bering (masalan: `Makon Call Center`)
4. Username bering (masalan: `MakonCallBot`)
5. BotFather sizga token beradi: `123456789:AABBcc...` — uni nusxalang

**Qadam 2 — Chat ID oling:**
1. Yangi yaratilgan botingizga `/start` yuboring
2. Brauzerda oching: `https://api.telegram.org/bot<TOKEN>/getUpdates`
   (TOKEN o'rniga o'z tokeningizni qo'ying)
3. Javobda `"chat":{"id":123456789}` ko'rasiz — shu raqam sizning Chat ID

**Qadam 3 — .env.local ga qo'shing:**
```
ANTHROPIC_API_KEY=sk-ant-...      # (ixtiyoriy, AI uchun)
TELEGRAM_BOT_TOKEN=123456789:AABBcc...
TELEGRAM_CHAT_ID=123456789
```

**Qadam 4 — Serverni qayta ishga tushiring:**
```bash
npm run dev
```

Endi "Aloqa" sahifasidan xabar yuborganda, bot sizning Telegram'ingizga darhol xabar yuboradi:
```
📩 MAKON — Yangi murojaat

👤 Ism: Alisher
📞 Telefon: +998901234567

💬 Xabar:
Yunusobodda 2 xonali kvartira bormi?

⏰ 21.06.2026, 15:30:00
```

---

### 2-qism: Saytni Telegram Mini App sifatida ulash

Sayt Telegram Mini App sifatida ishlashga tayyor (TelegramInit komponenti allaqachon o'rnatilgan).

**Qadam 1 — Saytni internetga joylashtiring (Vercel):**
1. [vercel.com](https://vercel.com) ga kiring → GitHub bilan ulaning
2. "New Project" → `makon` papkasini yuklang yoki GitHub'ga push qiling
3. "Environment Variables" bo'limida `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` qo'shing
4. Deploy qiling — sizga `https://makon.vercel.app` kabi URL beriladi

**Qadam 2 — Mini App ni botga ulang:**
1. [@BotFather](https://t.me/BotFather) ga yozing
2. `/mybots` → botingizni tanlang
3. `Bot Settings` → `Menu Button` → `Configure menu button`
4. URL kiriting: `https://makon.vercel.app` (Vercel'dan olgan URL)
5. Tugma nomini kiriting: `Makon` yoki `🏠 Uylar`

**Natija:** Foydalanuvchi botga `/start` yuborganda "Makon" tugmasi paydo bo'ladi. Bosaganda sayt to'liq Telegram ichida ochiladi — barcha funksiyalar (xarita, AI, e'lonlar, ro'yxatdan o'tish) ishlaydi!

