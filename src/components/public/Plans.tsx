"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check } from "lucide-react";

const plans: Array<{
  name: string;
  description: string;
  price: number | null;
  period: string;
  features: string[];
  cta: string;
  variant: "primary" | "secondary" | "outline" | "ghost" | "gold";
  badge: string | null;
  popular: boolean;
}> = [
  {
    name: "Gratuito",
    description: "Acesso inicial à rede para conhecer a dinâmica do clube",
    price: 0,
    period: "/mês",
    features: [
      "Perfil básico na rede",
      "Acesso a conteúdos autorizados",
      "Eventos selecionados gratuitos",
      "Comunicados da comunidade",
      "Limites configuráveis de conexões",
    ],
    cta: "Começar grátis",
    variant: "secondary",
    badge: null,
    popular: false,
  },
  {
    name: "Profissional",
    description: "Para quem quer visibilidade e ferramentas de prospecção",
    price: 297,
    period: "/mês",
    features: [
      "Perfil verificado com selo",
      "Página comercial personalizada",
      "Formulário e gestão de leads",
      "Selo de membro verificado",
      "Comitês temáticos autorizados",
      "Métricas básicas de engajamento",
      "Prioridade no diretório",
    ],
    cta: "Assinar Profissional",
    variant: "gold",
    badge: "Mais popular",
    popular: true,
  },
  {
    name: "Executivo",
    description: "Presença digital completa com domínio e e-mail profissionais",
    price: 797,
    period: "/mês",
    features: [
      "Todos benefícios do Profissional",
      "Domínio próprio incluso",
      "Hospedagem gerenciada",
      "Contas de e-mail profissionais",
      "Prioridade no matchmaking",
      "Relatórios avançados",
      "Destaque no diretório",
      "Mais usuários por empresa",
    ],
    cta: "Assinar Executivo",
    variant: "outline",
    badge: "Completo",
    popular: false,
  },
  {
    name: "Fundador",
    description: "Condições exclusivas para membros da primeira hora",
    price: null,
    period: "",
    features: [
      "Selo exclusivo de Fundador",
      "Condições especiais vitalícias",
      "Prioridade em rodadas e comitês",
      "Benefícios definidos pela administração",
      "Acesso direto à diretoria",
      "Participação em decisões estratégicas",
    ],
    cta: "Entrar na lista de espera",
    variant: "ghost",
    badge: "Limitado",
    popular: false,
  },
];

export function Plans() {
  return (
    <section className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
            Comece <span className="text-gold">gratuitamente</span> e escolha benefícios profissionais quando precisar
          </h2>
          <p className="mt-4 text-lg text-silver">
            O nível gratuito dá acesso inicial à rede. Os planos pagos desbloqueiam visibilidade, ferramentas comerciais e presença digital completa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={cn(
                "relative glass rounded-2xl p-6 flex flex-col transition-all",
                plan.popular
                  ? "border-gold/50 ring-2 ring-gold/20 scale-105 z-10"
                  : "border-border hover:border-gold/30"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.badge && (
                <Badge variant="gold" className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1">
                  {plan.badge}
                </Badge>
              )}
              
              <div className="mb-6">
                <h3 className="font-display text-xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-text-secondary">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.price !== null ? (
                  <>
                    <span className="font-display text-4xl font-bold text-white">
                      R$ {plan.price.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-text-secondary">{plan.period}</span>
                  </>
                ) : (
                  <span className="font-display text-2xl font-semibold text-gold">
                    Sob convite
                  </span>
                )}
              </div>

              <ul className="flex-1 space-y-3 mb-6" role="list">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-silver">
                    <Check className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant={plan.variant} size="lg" className="w-full" onClick={() => window.location.href = "/candidatura"}>
                {plan.cta}
              </Button>

              {plan.name === "Gratuito" && (
                <p className="mt-4 text-center text-xs text-text-secondary">
                  Sem cartão de crédito. Upgrade a qualquer momento.
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 glass rounded-2xl p-6 sm:p-8 border border-gold/20">
          <h3 className="font-display text-lg font-semibold text-white mb-4">O que os planos pagos podem incluir:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-silver">
            {[
              "Maior visibilidade no diretório",
              "Página comercial personalizada",
              "Formulário e gestão de leads",
              "Domínio próprio incluso",
              "Hospedagem gerenciada",
              "Contas de e-mail profissionais",
              "Participação prioritária em oportunidades",
              "Relatórios avançados de engajamento",
              "Matchmaking com prioridade",
              "Acesso a comitês restritos",
              "Suporte dedicado",
              "Condições especiais de renovação",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-gold flex-shrink-0" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}