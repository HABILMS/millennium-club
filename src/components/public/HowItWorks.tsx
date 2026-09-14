"use client";

import { cn } from "@/lib/utils";
import { Send, SearchCheck, UserCheck, Link2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Envie sua candidatura",
    description: "Preencha o formulário completo em 4 etapas com suas informações profissionais, interesses de negócio e como pode contribuir para a rede.",
    icon: Send,
  },
  {
    number: "02",
    title: "Passe pelo screening",
    description: "Nossa equipe avalia seu perfil, verifica referências e pode solicitar documentos complementares ou agendar uma entrevista.",
    icon: SearchCheck,
  },
  {
    number: "03",
    title: "Ative sua participação",
    description: "Após aprovação, você recebe acesso à área do membro, define seu plano e começa a construir seu perfil na rede.",
    icon: UserCheck,
  },
  {
    number: "04",
    title: "Desenvolva conexões",
    description: "Acesse oportunidades curadas, solicite introduções, participe de comitês e eventos com contexto e acompanhamento estruturado.",
    icon: Link2,
  },
];

export function HowItWorks() {
  return (
    <section className="bg-charcoal/30 py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
            Como <span className="text-gold">funciona</span>
          </h2>
          <p className="mt-4 text-lg text-silver">
            Um processo seletivo rigoroso garante a qualidade da rede. Da candidatura à conexão, cada etapa é pensada para gerar valor real.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" aria-hidden="true" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 relative">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={cn(
                  "relative flex gap-6",
                  index % 2 === 1 ? "md:pl-16" : "md:pr-16"
                )}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center flex-col relative z-10">
                  <span className="font-display text-2xl font-bold text-gold">{step.number}</span>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gold/20 border border-gold/30" aria-hidden="true" />
                </div>
                <div className="flex-1 pt-2">
                  <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-text-secondary">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}