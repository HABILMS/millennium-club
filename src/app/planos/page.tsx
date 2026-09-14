import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Plans } from "@/components/public/Plans";
import { FAQ } from "@/components/public/FAQ";
import { CTA } from "@/components/public/CTA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planos",
  description: "Compare os planos do Millennium Club: Gratuito, Profissional, Executivo e Fundador. Escolha os benefícios profissionais que você precisa.",
};

export default function PlanosPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <section className="relative min-h-[60vh] flex items-center justify-center pt-16">
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-charcoal/50 to-obsidian" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-white">
              Planos e <span className="text-gold">benefícios</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-silver max-w-3xl mx-auto">
              Comece gratuitamente e escolha benefícios profissionais quando precisar. Cada plano desbloqueia novas ferramentas para sua presença na rede.
            </p>
          </div>
        </section>

        <Plans />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}