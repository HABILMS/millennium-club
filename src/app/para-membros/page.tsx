import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Features } from "@/components/public/Features";
import { CTA } from "@/components/public/CTA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Para membros",
  description: "Descubra os benefícios de ser membro do Millennium Club: diretório qualificado, oportunidades curadas, comitês, eventos e presença digital profissional.",
};

export default function ParaMembrosPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <section className="relative min-h-[60vh] flex items-center justify-center pt-16">
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-charcoal/50 to-obsidian" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-white">
              Para <span className="text-gold">membros</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-silver max-w-3xl mx-auto">
              Acesso a uma rede qualificada, ferramentas de prospecção, governança estruturada e presença digital profissional.
            </p>
          </div>
        </section>

        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
}