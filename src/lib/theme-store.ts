"use client";

import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
  hydrate: () => void;
}

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", t === "dark");
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: "light",
  toggle: () => {
    const next: Theme = get().theme === "light" ? "dark" : "light";
    if (typeof window !== "undefined") localStorage.setItem("makon_theme", next);
    applyTheme(next);
    set({ theme: next });
  },
  setTheme: (t) => {
    if (typeof window !== "undefined") localStorage.setItem("makon_theme", t);
    applyTheme(t);
    set({ theme: t });
  },
  hydrate: () => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("makon_theme") as Theme | null;
    const preferred: Theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(preferred);
    set({ theme: preferred });
  },
}));
