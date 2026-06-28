import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturedListings } from "@/components/FeaturedListings";
import { CtaSection } from "@/components/CtaSection";
import { AiChatWidget } from "@/components/AiChatWidget";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedListings />
        <HowItWorks />
        <CtaSection />
      </main>
      <Footer />
      <AiChatWidget />
    </>
  );
}
