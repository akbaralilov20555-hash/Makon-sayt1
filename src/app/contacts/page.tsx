"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AiChatWidget } from "@/components/AiChatWidget";
import { MapWrapper } from "@/components/MapWrapper";
import { useT } from "@/lib/locale-store";
import { Phone, MapPin, Clock, Mail, CheckCircle2 } from "lucide-react";

export default function ContactsPage() {
  const { t } = useT();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Xatolik yuz berdi");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Tarmoq xatoligi. Qayta urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  }

  const officeLocation: [number, number] = [41.3111, 69.2797];

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
          <div className="max-w-xl mb-12">
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink">{t.contacts.title}</h1>
            <p className="mt-4 text-lg text-ink-soft">{t.contacts.subtitle}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 mb-14">
            <div className="space-y-4">
              <div className="bg-card border border-line rounded-2xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70 mb-1">{t.contacts.callCenter}</p>
                  <a href="tel:+998781509900" className="font-display font-semibold text-xl text-ink hover:text-terracotta transition-colors font-mono-num">
                    +998 78 150 99 00
                  </a>
                </div>
              </div>

              <div className="bg-card border border-line rounded-2xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-olive/15 text-olive flex items-center justify-center shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70 mb-1">{t.contacts.workHours}</p>
                  <p className="font-display font-semibold text-xl text-ink">{t.contacts.workHoursValue}</p>
                </div>
              </div>

              <div className="bg-card border border-line rounded-2xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70 mb-1">{t.contacts.address}</p>
                  <p className="font-display font-semibold text-xl text-ink">{t.contacts.addressValue}</p>
                </div>
              </div>

              <div className="bg-card border border-line rounded-2xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-ink/10 text-ink flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70 mb-1">Email</p>
                  <a href="mailto:hello@makon.uz" className="font-display font-semibold text-xl text-ink hover:text-terracotta transition-colors">
                    hello@makon.uz
                  </a>
                </div>
              </div>
            </div>

            <div className="h-full min-h-[340px] rounded-2xl overflow-hidden border border-line">
              <MapWrapper listings={[]} center={officeLocation} zoom={14} />
            </div>
          </div>

          <div className="max-w-xl">
            <div className="bg-card border border-line rounded-2xl p-7 sm:p-8">
              {submitted ? (
                <div className="text-center py-8 animate-fade-up">
                  <CheckCircle2 size={48} className="text-olive mx-auto mb-3" />
                  <p className="font-display text-xl font-semibold text-ink">{t.contacts.formSuccess}</p>
                  <p className="text-ink-soft mt-2 text-sm">
                    Xabaringiz call-markazimizga yuborildi. Tez orada siz bilan bog&apos;lanamiz.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-ink mb-1.5 block">{t.contacts.formName}</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-ink mb-1.5 block">{t.contacts.formPhone}</label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+998 90 123 45 67"
                      className="w-full h-12 px-4 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-ink mb-1.5 block">{t.contacts.formMessage}</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Savolingiz yoki murojaatingizni yozing..."
                      className="w-full px-4 py-3 rounded-xl border border-line bg-cream-deep focus:outline-none focus:ring-2 focus:ring-terracotta/30 resize-none transition-all"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-terracotta-deep bg-terracotta/10 rounded-xl px-4 py-3">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 rounded-full bg-terracotta text-white font-semibold hover:bg-terracotta-deep transition-colors disabled:opacity-60"
                  >
                    {submitting ? t.common.loading : t.contacts.formSubmit}
                  </button>
                  <p className="text-xs text-ink-soft/60 text-center">
                    Xabaringiz Telegram orqali call-markazga darhol yuboriladi
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <AiChatWidget />
    </>
  );
}
