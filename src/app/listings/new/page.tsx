"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AiChatWidget } from "@/components/AiChatWidget";
import { ImageUploader } from "@/components/ImageUploader";
import { useT } from "@/lib/locale-store";
import { districts, AMENITIES_LIST } from "@/data/listings";
import { CheckCircle2 } from "lucide-react";

export default function NewListingPage() {
  const { t } = useT();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    purpose: "rent",
    propertyType: "apartment",
    price: "",
    currency: "USD",
    district: districts[0],
    address: "",
    rooms: "1",
    area: "",
    amenities: [] as string[],
    ownerName: "",
    ownerPhone: "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleAmenity(a: string) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  }

  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Xatolik yuz berdi. Iltimos, ma'lumotlarni tekshiring.");
        setSubmitting(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push(`/listings/${data.listing.id}`), 1400);
    } catch {
      setError("Tarmoq xatoligi. Internetingizni tekshirib, qayta urinib ko'ring.");
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center py-32">
          <div className="text-center animate-fade-up">
            <CheckCircle2 size={56} className="text-olive mx-auto mb-4" />
            <p className="font-display text-2xl font-semibold text-ink">{t.addListingForm.success}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink mb-2">{t.addListingForm.title}</h1>
          <p className="text-ink-soft mb-10">Ma&apos;lumotlarni to&apos;ldiring, e&apos;loningiz darhol saytda paydo bo&apos;ladi.</p>

          <form onSubmit={onSubmit} className="space-y-8">
            <div className="bg-card border border-line rounded-2xl p-6 space-y-5">
              <div>
                <label className="text-sm font-semibold text-ink mb-2 block">{t.addListingForm.titleField}</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="Masalan: Yunusobodda 2 xonali kvartira"
                  className="w-full h-12 px-4 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-ink mb-2 block">{t.addListingForm.description}</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={4}
                  placeholder="Mulk haqida batafsil yozing..."
                  className="w-full px-4 py-3 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30 resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-semibold text-ink mb-2 block">{t.addListingForm.purpose}</label>
                  <div className="flex gap-2">
                    {[{ v: "rent", l: t.filters.rent }, { v: "sale", l: t.filters.sale }].map((p) => (
                      <button
                        type="button"
                        key={p.v}
                        onClick={() => update("purpose", p.v)}
                        className={`flex-1 h-12 rounded-xl text-sm font-medium border transition-colors ${
                          form.purpose === p.v ? "bg-terracotta text-white border-terracotta" : "bg-cream-deep border-line text-ink-soft"
                        }`}
                      >
                        {p.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-ink mb-2 block">{t.addListingForm.propertyType}</label>
                  <select
                    value={form.propertyType}
                    onChange={(e) => update("propertyType", e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  >
                    <option value="apartment">{t.filters.apartment}</option>
                    <option value="house">{t.filters.house}</option>
                    <option value="room">{t.filters.room}</option>
                    <option value="studio">{t.filters.studio}</option>
                    <option value="commercial">{t.filters.commercial}</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                <div>
                  <label className="text-sm font-semibold text-ink mb-2 block">{t.addListingForm.price}</label>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="500"
                    className="w-full h-12 px-4 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink mb-2 block">{t.addListingForm.rooms}</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={form.rooms}
                    onChange={(e) => update("rooms", e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink mb-2 block">{t.addListingForm.area}</label>
                  <input
                    required
                    type="number"
                    value={form.area}
                    onChange={(e) => update("area", e.target.value)}
                    placeholder="65"
                    className="w-full h-12 px-4 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-semibold text-ink mb-2 block">{t.addListingForm.district}</label>
                  <select
                    value={form.district}
                    onChange={(e) => update("district", e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink mb-2 block">{t.addListingForm.address}</label>
                  <input
                    required
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="Ko'cha, uy raqami"
                    className="w-full h-12 px-4 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-ink mb-2 block">{t.listing.amenities}</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_LIST.map((a) => (
                    <button
                      type="button"
                      key={a}
                      onClick={() => toggleAmenity(a)}
                      className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-colors ${
                        form.amenities.includes(a)
                          ? "bg-olive text-cream border-olive"
                          : "bg-cream-deep border-line text-ink-soft"
                      }`}
                    >
                      {(t.amenities as Record<string, string>)[a]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card border border-line rounded-2xl p-6">
              <h3 className="font-display font-semibold text-lg mb-1">Rasmlar</h3>
              <p className="text-sm text-ink-soft mb-4">Mulkning rasmlarini qo&apos;shing — bu boshqa foydalanuvchilarga ko&apos;rinadi.</p>
              <ImageUploader images={images} onChange={setImages} />
            </div>

            <div className="bg-card border border-line rounded-2xl p-6 space-y-5">
              <h3 className="font-display font-semibold text-lg">{t.listing.owner}</h3>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-semibold text-ink mb-2 block">{t.addListingForm.ownerName}</label>
                  <input
                    required
                    value={form.ownerName}
                    onChange={(e) => update("ownerName", e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink mb-2 block">{t.addListingForm.ownerPhone}</label>
                  <input
                    required
                    value={form.ownerPhone}
                    onChange={(e) => update("ownerPhone", e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full h-12 px-4 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-terracotta-deep bg-terracotta/10 rounded-xl px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 rounded-full bg-terracotta text-white font-semibold text-base hover:bg-terracotta-deep transition-colors disabled:opacity-60"
            >
              {submitting ? t.common.loading : t.addListingForm.submit}
            </button>
          </form>
        </div>
      </main>
      <Footer />
      <AiChatWidget />
    </>
  );
}
