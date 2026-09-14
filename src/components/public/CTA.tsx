"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-charcoal/50 to-obsidian" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.1)_0%,_transparent_70%)]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl p-8 sm:p-12 lg:p-16 text-center max-w-3xl mx-auto border border-gold/30">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
            Apresente seu perfil ao <span className="text-gold">Millennium Club</span>
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-silver max-w-2xl mx-auto">
            Preencha a candidatura para participar do processo de seleção e receber novidades sobre o lançamento da rede.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gold" size="xl" onClick={() => window.location.href = "/candidatura"}>
              Preencher candidatura
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="xl" onClick={() => window.location.href = "/como-funciona"}>
              Entender o processo
            </Button>
          </div>
          <p className="mt-6 text-sm text-text-secondary">
            Sem compromisso financeiro na candidatura. A avaliação é gratuita.
          </p>
        </div>
      </div>
    </section>
  );
}