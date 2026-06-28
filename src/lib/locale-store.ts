"use client";

import { create } from "zustand";
import { dict, Locale } from "@/lib/i18n";

interface LocaleStore {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>((set) => ({
  locale: "uz",
  setLocale: (l) => {
    if (typeof window !== "undefined") localStorage.setItem("makon_locale", l);
    set({ locale: l });
  },
}));

export function useT() {
  const locale = useLocaleStore((s) => s.locale);
  return { t: dict[locale], locale };
}
