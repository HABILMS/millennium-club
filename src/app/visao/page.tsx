import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Vision } from "@/components/public/Vision";
import { WhoCanJoin } from "@/components/public/WhoCanJoin";
import { HowItWorks } from "@/components/public/HowItWorks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visão",
  description: "A visão de longo prazo do Millennium Club: meta estratégica de R$ 2 bilhões em transações, 500 membros qualificados, rede nacional e internacional.",
};

export default function VisaoPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <section className="relative min-h-[60vh] flex items-center justify-center pt-16">
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-charcoal/50 to-obsidian" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-white">
              Nossa <span className="text-gold">Visão</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-silver max-w-3xl mx-auto">
              Construir o principal ecossistema privado de negócios do Brasil, conectando capital, expertise e oportunidades com governança e confidencialidade.
            </p>
          </div>
        </section>

        <Vision />
        <WhoCanJoin />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}