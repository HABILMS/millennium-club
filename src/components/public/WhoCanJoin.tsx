"use client";

import { cn } from "@/lib/utils";
import { Building2, PiggyBank, Lightbulb, Handshake, Check } from "lucide-react";

const profiles = [
  {
    icon: Building2,
    title: "Empresários",
    description: "Apresentam empresas, projetos, demandas de capital, expansão e alianças estratégicas.",
    color: "gold",
    bgColor: "bg-gold/10",
    borderColor: "border-gold/30",
  },
  {
    icon: PiggyBank,
    title: "Investidores",
    description: "Encontram negócios alinhados às suas teses, faixas de investimento e regiões.",
    color: "emerald",
    bgColor: "bg-emerald/10",
    borderColor: "border-emerald/30",
  },
  {
    icon: Lightbulb,
    title: "Consultores",
    description: "Aplicam conhecimento na análise, estruturação e evolução dos negócios.",
    color: "silver",
    bgColor: "bg-silver/10",
    borderColor: "border-silver/30",
  },
  {
    icon: Handshake,
    title: "Representantes",
    description: "Originam oportunidades, desenvolvem mercados e aproximam parceiros.",
    color: "gold",
    bgColor: "bg-gold/10",
    borderColor: "border-gold/30",
  },
];

export function WhoCanJoin() {
  return (
    <section className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
            Quem pode fazer parte do <span className="text-gold">Millennium Club</span>?
          </h2>
          <p className="mt-4 text-lg text-silver">
            Buscamos profissionais qualificados que compartilhem nossos valores de ética, confidencialidade e excelência.
            Um membro poderá acumular múltiplos papéis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {profiles.map((profile, index) => (
            <div
              key={profile.title}
              className={cn(
                "relative glass rounded-2xl p-6 hover:border-gold/30 transition-all overflow-hidden",
                profile.borderColor,
                profile.bgColor
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-gold/5" aria-hidden="true" />
              <div className={cn("h-14 w-14 rounded-xl flex items-center justify-center mb-4", profile.bgColor)}>
                <profile.icon className="h-7 w-7" style={{ color: `var(--color-${profile.color})` }} aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-3">{profile.title}</h3>
              <p className="text-sm text-text-secondary mb-4">{profile.description}</p>
              <div className="flex items-center gap-2 text-xs text-gold font-medium">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Múltiplos papéis permitidos
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}