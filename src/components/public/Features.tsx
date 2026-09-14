"use client";

import { cn } from "@/lib/utils";
import { UserCheck, Briefcase, Globe, Users, Megaphone, FileText } from "lucide-react";

const features = [
  {
    icon: UserCheck,
    title: "Perfis profissionais qualificados",
    description: "Perfis verificados com histórico, competências e interesses de negócio estruturados para matchmaking preciso.",
  },
  {
    icon: Briefcase,
    title: "Oportunidades de negócios curadas",
    description: "Pipeline de oportunidades com due diligence prévia, métricas financeiras e nível de confidencialidade controlado.",
  },
  {
    icon: Globe,
    title: "Presença digital profissional",
    description: "Página comercial personalizada com domínio próprio, formulário de leads, cases autorizados e métricas de engajamento.",
  },
  {
    icon: Users,
    title: "Comitês e rodadas de negócios",
    description: "Grupos temáticos liderados por especialistas, rodadas de pitch estruturadas e mesas de conexão direcionadas.",
  },
  {
    icon: Megaphone,
    title: "Divulgação para a rede",
    description: "Campanhas segmentadas por setor, região, plano e interesse — notificações internas, e-mail e WhatsApp (com consentimento).",
  },
  {
    icon: FileText,
    title: "Governança e acompanhamento",
    description: "NDA digital, Data Room com controle de acesso, participantes com papéis definidos, remunerações previstas e auditadas.",
  },
];

export function Features() {
  return (
    <section className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
            Funcionalidades e <span className="text-gold">benefícios</span>
          </h2>
          <p className="mt-4 text-lg text-silver">
            Cada recurso é desenhado para acelerar conexões qualificadas com segurança, rastreabilidade e governança.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass rounded-2xl p-6 hover:border-gold/30 transition-all group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}