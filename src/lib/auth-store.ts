"use client";

import { create } from "zustand";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface AuthStore {
  user: SessionUser | null;
  hydrated: boolean;
  login: (u: SessionUser) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  hydrated: false,
  login: (u) => {
    set({ user: u, hydrated: true });
  },
  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // network error, but we still clear local state
    }
    set({ user: null });
  },
  hydrate: async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      set({ user: data.user, hydrated: true });
    } catch {
      set({ user: null, hydrated: true });
    }
  },
}));
