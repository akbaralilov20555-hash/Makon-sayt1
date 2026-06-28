"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useT } from "@/lib/locale-store";
import { useAuthStore } from "@/lib/auth-store";
import { useThemeStore } from "@/lib/theme-store";
import { useFavoritesStore } from "@/lib/favorites-store";
import { Menu, X, Phone, User as UserIcon, Sun, Moon, Heart } from "lucide-react";

export function Header() {
  const { t } = useT();
  const { user, hydrate } = useAuthStore();
  const { theme, toggle, hydrate: hydrateTheme } = useThemeStore();
  const { ids: favoriteIds, hydrate: hydrateFavorites } = useFavoritesStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    hydrate();
    hydrateTheme();
    hydrateFavorites();
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hydrate, hydrateTheme, hydrateFavorites]);

  const links = [
    { href: "/listings", label: t.nav.listings },
    { href: "/#how-it-works", label: t.nav.howItWorks },
    { href: "/contacts", label: t.nav.contacts },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/90 backdrop-blur-md border-b border-line shadow-sm" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8 h-16 sm:h-[72px] flex items-center justify-between">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-[15px] font-medium text-ink-soft hover:text-ink transition-colors rounded-full hover:bg-cream-deep"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:+998781509900"
            className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-terracotta transition-colors"
          >
            <Phone size={15} />
            +998 78 150 99 00
          </a>
          <Link
            href="/favorites"
            className="relative w-10 h-10 rounded-full border border-line flex items-center justify-center text-ink-soft hover:bg-cream-deep transition-colors"
            aria-label={t.nav.favorites}
            title={t.nav.favorites}
          >
            <Heart size={16} className={favoriteIds.length > 0 ? "text-terracotta" : ""} fill={favoriteIds.length > 0 ? "currentColor" : "none"} />
            {favoriteIds.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-terracotta text-white text-[10px] font-bold flex items-center justify-center">
                {favoriteIds.length}
              </span>
            )}
          </Link>
          <button
            onClick={toggle}
            className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-ink-soft hover:bg-cream-deep transition-colors"
            aria-label={theme === "dark" ? "Yorug' rejim" : "Tungi rejim"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <LanguageSwitcher />
          <Link
            href="/listings/new"
            className="px-4 py-2.5 text-sm font-semibold rounded-full bg-olive text-cream hover:bg-olive-deep transition-colors"
          >
            {t.nav.addListing}
          </Link>
          <Link
            href={user ? "/dashboard" : "/auth"}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-full bg-terracotta text-white hover:bg-terracotta-deep transition-colors"
          >
            <UserIcon size={15} />
            {user ? user.name.split(" ")[0] : t.nav.login}
          </Link>
        </div>

        <div className="flex items-center gap-1.5 lg:hidden">
          <button
            onClick={toggle}
            className="w-10 h-10 rounded-full flex items-center justify-center text-ink-soft"
            aria-label={theme === "dark" ? "Yorug' rejim" : "Tungi rejim"}
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button
            className="p-2 text-ink"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menyu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-cream border-t border-line px-4 py-4 flex flex-col gap-1 animate-fade-up max-h-[calc(100vh-64px)] overflow-y-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-3 text-base font-medium text-ink-soft hover:text-ink rounded-lg hover:bg-cream-deep"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/favorites"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-3 text-base font-medium text-ink-soft hover:text-ink rounded-lg hover:bg-cream-deep"
          >
            <Heart size={17} className={favoriteIds.length > 0 ? "text-terracotta" : ""} fill={favoriteIds.length > 0 ? "currentColor" : "none"} />
            {t.nav.favorites}
            {favoriteIds.length > 0 && (
              <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-terracotta text-white text-[11px] font-bold flex items-center justify-center">
                {favoriteIds.length}
              </span>
            )}
          </Link>
          <div className="flex items-center justify-between px-3 py-3 gap-3">
            <a href="tel:+998781509900" className="flex items-center gap-1.5 text-sm font-medium text-ink-soft">
              <Phone size={15} /> +998 78 150 99 00
            </a>
            <LanguageSwitcher />
          </div>
          <Link
            href="/listings/new"
            onClick={() => setMobileOpen(false)}
            className="mt-2 px-4 py-3.5 text-sm font-semibold rounded-full bg-olive text-cream text-center"
          >
            {t.nav.addListing}
          </Link>
          <Link
            href={user ? "/dashboard" : "/auth"}
            onClick={() => setMobileOpen(false)}
            className="mt-2 px-4 py-3.5 text-sm font-semibold rounded-full bg-terracotta text-white text-center"
          >
            {user ? user.name.split(" ")[0] : t.nav.login}
          </Link>
        </div>
      )}
    </header>
  );
}
