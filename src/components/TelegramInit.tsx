"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/theme-store";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        setHeaderColor?: (color: string) => void;
        setBackgroundColor?: (color: string) => void;
        colorScheme?: "light" | "dark";
        onEvent?: (event: string, cb: () => void) => void;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
          };
        };
      };
    };
  }
}

/**
 * Detects whether the site is running inside the Telegram Mini App webview
 * and, if so, performs the minimal handshake Telegram expects (ready/expand)
 * and aligns the app's color scheme with Telegram's. No-ops everywhere else
 * (a normal browser tab), so this is safe to mount unconditionally.
 */
export function TelegramInit() {
  const { setTheme } = useThemeStore();

  useEffect(() => {
    let cancelled = false;

    function tryInit() {
      const tg = window.Telegram?.WebApp;
      if (!tg) return false;

      tg.ready();
      tg.expand();

      if (tg.colorScheme === "dark") {
        setTheme("dark");
      }

      return true;
    }

    if (tryInit()) return;

    // The script loads async, so poll briefly in case it's not ready yet.
    const interval = setInterval(() => {
      if (cancelled) return;
      if (tryInit()) clearInterval(interval);
    }, 200);

    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [setTheme]);

  return null;
}
