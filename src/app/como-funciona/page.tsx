import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { HowItWorks } from "@/components/public/HowItWorks";
import { Features } from "@/components/public/Features";
import { CTA } from "@/components/public/CTA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Como funciona",
  description: "Entenda o processo seletivo do Millennium Club: candidatura, screening, aprovação e desenvolvimento de conexões estratégicas.",
};

export default function ComoFuncionaPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <section className="relative min-h-[60vh] flex items-center justify-center pt-16">
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-charcoal/50 to-obsidian" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-white">
              Como <span className="text-gold">funciona</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-silver max-w-3xl mx-auto">
              Um processo seletivo rigoroso garante a qualidade da rede. Da candidatura à conexão, cada etapa é pensada para gerar valor real.
            </p>
          </div>
        </section>

        <HowItWorks />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
}