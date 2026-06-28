"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AiChatWidget } from "@/components/AiChatWidget";
import { ListingCard } from "@/components/ListingCard";
import { useT } from "@/lib/locale-store";
import { useAuthStore } from "@/lib/auth-store";
import { Listing } from "@/types";
import { Plus, LogOut, User as UserIcon, Phone, Mail } from "lucide-react";

export default function DashboardPage() {
  const { t } = useT();
  const router = useRouter();
  const { user, hydrate, hydrated, logout } = useAuthStore();
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (hydrated && !user) router.push("/auth");
  }, [hydrated, user, router]);

  useEffect(() => {
    fetch("/api/listings")
      .then((r) => r.json())
      .then((data) => setListings(data.listings.slice(0, 3)));
  }, []);

  if (!user) {
    return (
      <>
        <Header />
        <main className="flex-1 py-32" />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">{t.dashboard.title}</h1>
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-line text-sm font-medium text-ink-soft hover:bg-cream-deep transition-colors self-start"
            >
              <LogOut size={15} /> Chiqish
            </button>
          </div>

          <div className="grid lg:grid-cols-[320px_1fr] gap-8">
            <div className="bg-card border border-line rounded-2xl p-6 h-fit">
              <div className="w-16 h-16 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center font-display font-semibold text-2xl mb-4">
                {user.name.charAt(0)}
              </div>
              <p className="font-display font-semibold text-lg text-ink">{user.name}</p>
              <div className="mt-4 space-y-2.5 text-sm text-ink-soft">
                <p className="flex items-center gap-2"><Mail size={14} /> {user.email}</p>
                {user.phone && <p className="flex items-center gap-2"><Phone size={14} /> {user.phone}</p>}
                <p className="flex items-center gap-2"><UserIcon size={14} /> {user.role === "tenant" ? "Foydalanuvchi" : user.role}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-semibold text-ink">{t.dashboard.myListings}</h2>
                <Link
                  href="/listings/new"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-terracotta text-white text-sm font-semibold hover:bg-terracotta-deep transition-colors"
                >
                  <Plus size={15} /> {t.dashboard.addNew}
                </Link>
              </div>

              <p className="text-sm text-ink-soft/70 mb-4">Quyida saytdagi so&apos;nggi e&apos;lonlar namunasi ko&apos;rsatilgan:</p>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <AiChatWidget />
    </>
  );
}
