"use client";

import Link from "next/link";
import { useT } from "@/lib/locale-store";
import { ArrowRight, Phone } from "lucide-react";

export function CtaSection() {
  const { t } = useT();

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative bg-ink rounded-[28px] overflow-hidden px-8 py-14 sm:px-16 sm:py-20">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-terracotta/15" />
          <div className="absolute -left-16 -bottom-24 w-72 h-72 rounded-full bg-olive/20" />

          <div className="relative max-w-xl">
            <h2 className="font-display text-3xl sm:text-[40px] leading-tight font-semibold text-cream">
              {t.cta.title}
            </h2>
            <p className="mt-4 text-cream/70 text-lg max-w-md">
              {t.contacts.subtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/listings/new"
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-terracotta text-white font-semibold hover:bg-terracotta-deep transition-colors"
              >
                {t.nav.addListing} <ArrowRight size={17} />
              </Link>
              <a
                href="tel:+998781509900"
                className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-cream/25 text-cream font-semibold hover:bg-cream/10 transition-colors"
              >
                <Phone size={17} /> +998 78 150 99 00
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
