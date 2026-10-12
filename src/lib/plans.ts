export interface PlanData {
  id?: string;
  code: string;
  name: string;
  description: string;
  price_cents: number;
  currency: string;
  billing_interval: string;
  is_active: boolean;
  popular: boolean;
  badge_text: string | null;
  digital_kit_included: boolean;
  max_active_deals: number;
  validity_days: number;
  features: string[];
}

export const defaultPlansData: PlanData[] = [
  {
    id: "plan-free",
    code: "free",
    name: "Gratuito",
    description: "Acesso inicial à rede e teste de ferramentas",
    price_cents: 0,
    currency: "BRL",
    billing_interval: "month",
    is_active: true,
    popular: false,
    badge_text: null,
    digital_kit_included: false,
    max_active_deals: 1,
    validity_days: 20,
    features: [
      "1 negócio ativo por vez",
      "Validade de 20 dias por oportunidade",
      "7 dias de teste grátis da IA Millennium",
      "Visualização em Teaser Cego",
      "1 solicitação de NDA por mês",
      "Webinars públicos selecionados",
    ],
  },
  {
    id: "plan-pro",
    code: "pro",
    name: "Profissional",
    description: "Para originadores, corretores e captadores de alto padrão",
    price_cents: 29700,
    currency: "BRL",
    billing_interval: "month",
    is_active: true,
    popular: true,
    badge_text: "Mais Popular",
    digital_kit_included: true,
    max_active_deals: 5,
    validity_days: 45,
    features: [
      "Até 5 negócios ativos simultâneos",
      "Validade estendida de 45 dias",
      "Kit Presença Digital incluso (Domínio 1 ano + 5 e-mails + Landing Page)",
      "IA Millennium ilimitada (leitura de docs e imagens)",
      "Selo de Membro Verificado 100%",
      "Até 5 solicitações de NDA/mês",
      "Split de comissões preferencial",
    ],
  },
  {
    id: "plan-exec",
    code: "exec",
    name: "Executivo",
    description: "Para investidores qualificados, fundos e family offices",
    price_cents: 79700,
    currency: "BRL",
    billing_interval: "month",
    is_active: true,
    popular: false,
    badge_text: "Completo",
    digital_kit_included: true,
    max_active_deals: 999,
    validity_days: 90,
    features: [
      "Negócios ativos ilimitados",
      "Validade máxima de 90 dias com renovação prioritária",
      "Kit Presença Digital completo de alta performance",
      "Acesso antecipado a novos deals exclusivos (48h)",
      "NDAs e Dossiês confidenciais ilimitados",
      "Acompanhamento da Mesa de M&A do Clube",
      "Acesso a Jantares e Rodadas Presenciais",
    ],
  },
  {
    id: "plan-founder",
    code: "founder",
    name: "Fundador",
    description: "Assento vitalício no comitê estratégico do Millennium Club",
    price_cents: 0,
    currency: "BRL",
    billing_interval: "year",
    is_active: true,
    popular: false,
    badge_text: "Sob Convite",
    digital_kit_included: true,
    max_active_deals: 999,
    validity_days: 180,
    features: [
      "Selo de Membro Fundador permanente",
      "Condições societárias e tributárias exclusivas",
      "Participação no comitê de deliberação de negócios",
      "Acesso irrestrito a todos os ativos e dealmakers",
      "Assessoria jurídica e due diligence express",
    ],
  },
];
