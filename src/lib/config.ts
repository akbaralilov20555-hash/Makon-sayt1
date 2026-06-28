/**
 * MAKON SAYT KONFIGURATSIYASI
 * ================================
 * Saytning asosiy ma'lumotlarini o'zgartirish uchun FAQAT shu faylni tahrirlang.
 * Barcha sahifalar avtomatik yangilanadi.
 */

export const SITE_CONFIG = {
  // ── Sayt nomi va brend ─────────────────────────────────────────────────────
  name: "Makon",
  tagline: {
    uz: "Har bir uy — o'z makonida",
    ru: "Каждый дом — своё пространство",
    en: "Every home, its own space",
  },
  description: {
    uz: "O'zbekistondagi #1 ijara va sotuv platformasi",
    ru: "№1 платформа аренды и продажи в Узбекистане",
    en: "Uzbekistan's #1 rental & sale platform",
  },

  // ── Aloqa ma'lumotlari ─────────────────────────────────────────────────────
  phone: "+998 78 150 99 00",        // call-markaz raqami (sayt bo'ylab ko'rinadi)
  email: "hello@makon.uz",
  address: {
    uz: "Toshkent sh., Amir Temur shoh ko'chasi, 1-uy",
    ru: "г. Ташкент, ул. Амира Темура, 1",
    en: "Tashkent, Amir Temur Avenue, 1",
  },
  workHours: {
    uz: "24/7, har kuni",
    ru: "24/7, ежедневно",
    en: "24/7, every day",
  },

  // ── Ijtimoiy tarmoqlar ─────────────────────────────────────────────────────
  telegram: "https://t.me/makonuz",   // Telegram kanal/bot havolasi
  instagram: "https://instagram.com/makon.uz",

  // ── Statistika (bosh sahifa) ───────────────────────────────────────────────
  stats: {
    listings: "2,400+",    // faol e'lonlar soni
    cities: "14",          // shaharlar soni
    satisfaction: "98%",   // mamnun mijozlar foizi
  },

  // ── Meta (SEO) ─────────────────────────────────────────────────────────────
  url: "https://makon.uz",           // saytning haqiqiy manzili (deploy qilgandan keyin o'zgartiring)
  ogImage: "/og-image.png",          // havolani ulashganda chiqadigan rasm

  // ── Kompaniya ──────────────────────────────────────────────────────────────
  company: "MCHJ \"MAKON DIGITAL\"",
  year: "2026",
} as const;

// Tezkor yordamchi funksiyalar
export function getSiteName() { return SITE_CONFIG.name; }
export function getSitePhone() { return SITE_CONFIG.phone; }
