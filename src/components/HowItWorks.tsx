"use client";

import { useT } from "@/lib/locale-store";
import { Search, MessageCircle, KeyRound } from "lucide-react";

export function HowItWorks() {
  const { t } = useT();

  const steps = [
    { icon: Search, title: t.howItWorks.step1Title, text: t.howItWorks.step1Text },
    { icon: MessageCircle, title: t.howItWorks.step2Title, text: t.howItWorks.step2Text },
    { icon: KeyRound, title: t.howItWorks.step3Title, text: t.howItWorks.step3Text },
  ];

  return (
    <section id="how-it-works" className="bg-cream-deep py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-xl mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">{t.howItWorks.title}</h2>
          <p className="mt-3 text-ink-soft text-lg">{t.howItWorks.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 relative">
          <div className="hidden sm:block absolute top-7 left-[16.5%] right-[16.5%] h-px bg-line" />
          {steps.map((s, i) => (
            <div key={i} className="relative">
              <div className="w-14 h-14 rounded-2xl bg-card border border-line flex items-center justify-center relative z-10 mb-5">
                <s.icon size={22} className="text-terracotta" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink mb-2">{s.title}</h3>
              <p className="text-ink-soft leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
