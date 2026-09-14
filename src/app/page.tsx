import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Hero } from "@/components/public/Hero";
import { Vision } from "@/components/public/Vision";
import { WhoCanJoin } from "@/components/public/WhoCanJoin";
import { HowItWorks } from "@/components/public/HowItWorks";
import { Features } from "@/components/public/Features";
import { Plans } from "@/components/public/Plans";
import { FAQ } from "@/components/public/FAQ";
import { CTA } from "@/components/public/CTA";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <Hero />
        <Vision />
        <WhoCanJoin />
        <HowItWorks />
        <Features />
        <Plans />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}