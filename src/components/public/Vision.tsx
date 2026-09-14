"use client";

import { cn } from "@/lib/utils";
import { Target, TrendingUp, Network, MapPin } from "lucide-react";

const visionStats = [
  { icon: Target, value: "R$ 2 bi", label: "Meta estratégica de transações facilitadas em 3 anos" },
  { icon: Users, value: "500", label: "Membros qualificados na primeira escala" },
  { icon: Network, value: "N+I", label: "Rede com alcance nacional e internacional" },
  { icon: TrendingUp, value: "100%", label: "Acompanhamento da apresentação ao desenvolvimento" },
];

import { Users } from "lucide-react";

export function Vision() {
  return (
    <section className="relative bg-gradient-to-b from-charcoal/30 to-obsidian py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
            Meta de facilitar <span className="text-gold">R$ 2 bilhões</span> em transações por meio de conexões qualificadas em três anos.
          </h2>
          <p className="mt-4 text-lg text-silver">
            Não é promessa de resultado — é compromisso com a qualidade da rede, a curadoria de oportunidades e o acompanhamento rigoroso de cada conexão.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {visionStats.map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-2xl p-6 hover:border-gold/30 transition-all group"
            >
              <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="text-gold font-display text-3xl font-bold mb-2">{stat.value}</div>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 glass rounded-2xl p-6 sm:p-8 border border-gold/20">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald flex-shrink-0">
              <Target className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                Compromisso com a transparência
              </h3>
              <p className="mt-2 text-text-secondary">
                O Millennium Club não promete rentabilidade, aprovação de investimento ou resultado financeiro.
                O matchmaking representa compatibilidade de critérios, não recomendação financeira.
                A meta de R$ 2 bilhões é um <strong className="text-gold">objetivo estratégico</strong>, não um resultado já alcançado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}