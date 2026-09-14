import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { FAQ } from "@/components/public/FAQ";
import { CTA } from "@/components/public/CTA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  description: "Perguntas frequentes sobre o Millennium Club: quem pode participar, processo seletivo, planos, confidencialidade, matchmaking e benefícios.",
};

export default function FAQPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <section className="relative min-h-[60vh] flex items-center justify-center pt-16">
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-charcoal/50 to-obsidian" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-white">
              Perguntas <span className="text-gold">frequentes</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-silver max-w-3xl mx-auto">
              Tudo o que você precisa saber sobre o processo de entrada, funcionamento da rede e benefícios.
            </p>
          </div>
        </section>

        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}