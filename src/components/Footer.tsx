"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { useT } from "@/lib/locale-store";
import { Phone, Mail, MapPin, AtSign, Send, Globe } from "lucide-react";

export function Footer() {
  const { t } = useT();

  return (
    <footer className="bg-ink text-cream/90 mt-auto">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-12">
          <div>
            <Logo dark />
            <p className="mt-4 font-display italic text-lg text-cream/70 max-w-xs">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[AtSign, Send, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-terracotta hover:border-terracotta transition-colors"
                  aria-label="Ijtimoiy tarmoq"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">{t.footer.company}</h4>
            <ul className="space-y-3 text-[15px] text-cream/70">
              <li><Link href="/contacts" className="hover:text-cream transition-colors">{t.footer.about}</Link></li>
              <li><Link href="/contacts" className="hover:text-cream transition-colors">{t.footer.careers}</Link></li>
              <li><Link href="/contacts" className="hover:text-cream transition-colors">{t.nav.contacts}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">{t.footer.resources}</h4>
            <ul className="space-y-3 text-[15px] text-cream/70">
              <li><Link href="/listings" className="hover:text-cream transition-colors">{t.nav.listings}</Link></li>
              <li><Link href="/contacts" className="hover:text-cream transition-colors">{t.footer.help}</Link></li>
              <li><Link href="/contacts" className="hover:text-cream transition-colors">{t.footer.terms}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">{t.contacts.callCenter}</h4>
            <ul className="space-y-3 text-[15px] text-cream/70">
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-terracotta shrink-0" />
                <a href="tel:+998781509900" className="hover:text-cream transition-colors font-mono-num">+998 78 150 99 00</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-terracotta shrink-0" />
                <a href="mailto:hello@makon.uz" className="hover:text-cream transition-colors">hello@makon.uz</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-terracotta shrink-0 mt-0.5" />
                <span>{t.contacts.addressValue}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-cream/50">
          <p>© 2026 Makon. {t.footer.rights}</p>
          <p className="font-mono-num">MCHJ &quot;MAKON DIGITAL&quot;</p>
        </div>
      </div>
    </footer>
  );
}
