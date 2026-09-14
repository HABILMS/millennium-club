"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle, Shield, Globe, Users } from "lucide-react";

export function Hero() {
  const trustIndicators = [
    { icon: Shield, label: "Rede privada", description: "Acesso restrito e qualificado" },
    { icon: Users, label: "Membros avaliados", description: "Screening rigoroso de entrada" },
    { icon: Globe, label: "Atuação nacional e internacional", description: "Conexões Brasil e exterior" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-charcoal/50 to-obsidian" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="gold" className="mb-6 animate-fade-up" size="lg">
            Rede empresarial privada e qualificada
          </Badge>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight text-white animate-fade-up" style={{ animationDelay: "100ms" }}>
            Clube privado de negócios para <br />
            <span className="text-gold">conexões estratégicas.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-silver max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "200ms" }}>
            O Millennium Club conecta empresários, investidores, consultores e representantes
            para criar parcerias, acessar oportunidades e desenvolver negócios no Brasil e no exterior.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
            <Button variant="gold" size="xl" onClick={() => window.location.href = "/candidatura"}>
              Quero participar do Millennium Club
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="xl" onClick={() => window.location.href = "/como-funciona"}>
              Entender como funciona
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "400ms" }}>
            {trustIndicators.map((item) => (
              <div key={item.label} className="glass rounded-2xl p-6 text-left hover:border-gold/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white">{item.label}</h3>
                </div>
                <p className="text-sm text-text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <svg className="h-6 w-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}