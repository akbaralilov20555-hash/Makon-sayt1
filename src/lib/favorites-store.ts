"use client";

import { create } from "zustand";

const STORAGE_KEY = "makon_favorites";

interface FavoritesStore {
  ids: string[];
  hydrated: boolean;
  hydrate: () => void;
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

function readStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeStorage(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore quota / privacy-mode errors
  }
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  ids: [],
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    set({ ids: readStorage(), hydrated: true });
  },
  toggle: (id) => {
    const current = get().ids;
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    writeStorage(next);
    set({ ids: next });
  },
  isFavorite: (id) => get().ids.includes(id),
}));
