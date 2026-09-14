import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Plans } from "@/components/public/Plans";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Benefícios",
  description: "Conheça todos os benefícios dos planos do Millennium Club: perfil verificado, página comercial, leads, domínio próprio, e-mail profissional, relatórios e mais.",
};

export default function BeneficiosPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <section className="relative min-h-[60vh] flex items-center justify-center pt-16">
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-charcoal/50 to-obsidian" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-white">
              Benefícios <span className="text-gold">dos planos</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-silver max-w-3xl mx-auto">
              Compare o que cada plano oferece e escolha a melhor opção para sua estratégia na rede.
            </p>
          </div>
        </section>

        <Plans />
      </main>
      <Footer />
    </>
  );
}