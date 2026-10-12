"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check } from "lucide-react";

interface PlanItem {
  code?: string;
  name: string;
  description: string;
  price: number | null;
  period: string;
  features: string[];
  cta: string;
  variant: "primary" | "secondary" | "outline" | "ghost" | "gold";
  badge: string | null;
  popular: boolean;
  digitalKitIncluded?: boolean;
}

const defaultPlans: PlanItem[] = [
  {
    code: "free",
    name: "Gratuito",
    description: "Acesso inicial à rede e teste de ferramentas",
    price: 0,
    period: "/mês",
    features: [
      "1 negócio ativo por vez",
      "Validade de 20 dias por oportunidade",
      "7 dias de teste grátis da IA Millennium",
      "Visualização em Teaser Cego",
      "1 solicitação de NDA por mês",
      "Webinars públicos selecionados",
    ],
    cta: "Começar grátis",
    variant: "secondary",
    badge: null,
    popular: false,
    digitalKitIncluded: false,
  },
  {
    code: "pro",
    name: "Profissional",
    description: "Para originadores, corretores e captadores de alto padrão",
    price: 297,
    period: "/mês",
    features: [
      "Até 5 negócios ativos simultâneos",
      "Validade estendida de 45 dias",
      "Kit Presença Digital (Domínio 1 ano + 5 e-mails + Landing Page)",
      "IA Millennium ilimitada (leitura de docs e imagens)",
      "Selo de Membro Verificado 100%",
      "Até 5 solicitações de NDA/mês",
      "Split de comissões preferencial",
    ],
    cta: "Assinar Profissional",
    variant: "gold",
    badge: "Mais popular",
    popular: true,
    digitalKitIncluded: true,
  },
  {
    code: "exec",
    name: "Executivo",
    description: "Para investidores qualificados, fundos e family offices",
    price: 797,
    period: "/mês",
    features: [
      "Negócios ativos ilimitados",
      "Validade máxima de 90 dias com renovação prioritária",
      "Kit Presença Digital completo de alta performance",
      "Acesso antecipado a novos deals exclusivos (48h)",
      "NDAs e Dossiês confidenciais ilimitados",
      "Acompanhamento da Mesa de M&A do Clube",
      "Acesso a Jantares e Rodadas Presenciais",
    ],
    cta: "Assinar Executivo",
    variant: "outline",
    badge: "Completo",
    popular: false,
    digitalKitIncluded: true,
  },
  {
    code: "founder",
    name: "Fundador",
    description: "Assento vitalício no comitê estratégico do Millennium Club",
    price: null,
    period: "",
    features: [
      "Selo exclusivo de Fundador permanente",
      "Condições societárias e tributárias exclusivas",
      "Participação no comitê de deliberação de negócios",
      "Acesso irrestrito a todos os ativos e dealmakers",
      "Assessoria jurídica e due diligence express",
    ],
    cta: "Entrar na lista de espera",
    variant: "ghost",
    badge: "Sob Convite",
    popular: false,
    digitalKitIncluded: true,
  },
];

export function Plans() {
  const [plansList, setPlansList] = useState<PlanItem[]>(defaultPlans);

  useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.plans) && data.plans.length > 0) {
          const mapped: PlanItem[] = data.plans.map((p: any) => {
            const isFree = p.code === "free" || p.price_cents === 0;
            const isFounder = p.code === "founder";
            return {
              code: p.code,
              name: p.name,
              description: p.description,
              price: isFounder ? null : (p.price_cents ? p.price_cents / 100 : 0),
              period: p.billing_interval === "year" ? "/ano" : "/mês",
              features: Array.isArray(p.features) ? p.features : [],
              cta: isFree ? "Começar grátis" : isFounder ? "Entrar na lista de espera" : `Assinar ${p.name}`,
              variant: (p.popular ? "gold" : isFree ? "secondary" : isFounder ? "ghost" : "outline") as any,
              badge: p.badge_text || (p.popular ? "Mais popular" : null),
              popular: Boolean(p.popular),
              digitalKitIncluded: Boolean(p.digital_kit_included),
            };
          });
          setPlansList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
            Comece <span className="text-gold">gratuitamente</span> e escolha benefícios profissionais quando precisar
          </h2>
          <p className="mt-4 text-lg text-silver">
            O nível gratuito dá acesso inicial à rede. Os planos pagos desbloqueiam o Kit Presença Digital (domínio próprio e e-mails), visibilidade e ferramentas de M&A completas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plansList.map((plan, index) => (
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