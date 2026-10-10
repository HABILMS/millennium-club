export interface OpportunityAuthor {
  name: string;
  company: string;
  jobTitle: string;
  avatar?: string;
  badge: string;
  whatsapp?: string;
  email?: string;
}

export interface OpportunityQuestion {
  id: string;
  senderName: string;
  senderContact: string;
  content: string;
  sentAt: string;
  reply?: string;
}

export interface OpportunityItem {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  categoryIcon: string;
  volume: string;
  location: string;
  stage: "Ativa" | "Em Negociação" | "Nova Originação" | "NDA Requerido";
  summary: string;
  details: string;
  highlights: string[];
  imageUrl: string;
  galleryImages?: string[];
  documentPdfName?: string;
  documentPdfSize?: string;
  documentPdfUrl?: string;
  author: OpportunityAuthor;
  createdAt: string;
  questions: OpportunityQuestion[];
}

export const opportunityCategories = [
  { id: "all", label: "Todas as Oportunidades", icon: "💎" },
  { id: "venda_usina_solar", label: "Venda de Usina Solar", icon: "☀️" },
  { id: "credito_carbono", label: "Crédito de Carbono", icon: "🌿" },
  { id: "venda_hoteis", label: "Venda de Hotéis & Resorts", icon: "🏨" },
  { id: "compra_hoteis", label: "Compra de Redes de Hotéis", icon: "🏢" },
  { id: "socio_projetos", label: "Sócio para Projetos (M&A)", icon: "🤝" },
  { id: "aeronaves", label: "Aeronaves Executivas", icon: "✈️" },
  { id: "automoveis", label: "Automóveis & Frotas", icon: "🚗" },
  { id: "usinas_rsu", label: "Usinas de RSU (Lixo em Energia)", icon: "♻️" },
  { id: "credito_solar", label: "Venda de Crédito Solar", icon: "⚡" },
  { id: "passivo_solar", label: "Passivo Energia Solar", icon: "🔋" },
];

export const defaultOpportunities: OpportunityItem[] = [
  {
    id: "opp-1",
    title: "Venda de Parque Solar Operacional 15MWp",
    category: "venda_usina_solar",
    categoryLabel: "Venda de Usina Solar",
    categoryIcon: "☀️",
    volume: "R$ 48.000.000",
    location: "Minas Gerais, Brasil",
    stage: "Ativa",
    summary: "Parque fotovoltaico em operação com contrato PPA firmado de 15 anos. Retorno projetado acima do CDI + 6.5% a.a.",
    details: "Usina com outorga aprovada, conexão na rede de média tensão concluída e receita contratada em modalidade autoconsumo remoto com garantia de pagamento em custódia bancária.",
    highlights: ["15 MWp de potência instalada", "PPA firmado por 15 anos", "EBITDA anual projetado de R$ 6.2M"],
    imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80",
    ],
    documentPdfName: "Teaser_Executivo_Parque_Solar_15MWp.pdf",
    documentPdfSize: "3.4 MB",
    documentPdfUrl: "#",
    author: {
      name: "Patricia Mendes",
      company: "Solar Invest Brasil",
      jobTitle: "CEO & Sócia Fundadora",
      badge: "Membro Fundador",
      whatsapp: "(31) 97777-6666",
      email: "patricia@solarinvest.com.br",
    },
    createdAt: "2026-03-10",
    questions: [
      {
        id: "q-1",
        senderName: "Carlos Eduardo Faria",
        senderContact: "(11) 98111-2233",
        content: "A subestação conectada suporta expansão para mais 5MWp sem obras estruturais adicionais?",
        sentAt: "12/03/2026 14:20",
        reply: "Sim! O transformador principal foi superdimensionado para 20MVA na fase de construção.",
      },
    ],
  },
  {
    id: "opp-2",
    title: "Portfólio de 500.000 Créditos de Carbono VERRA",
    category: "credito_carbono",
    categoryLabel: "Crédito de Carbono",
    categoryIcon: "🌿",
    volume: "US$ 6.500.000",
    location: "Amazônia Legal, Brasil",
    stage: "Ativa",
    summary: "Lote de créditos de preservação florestal (REDD+) auditados pela certificadora internacional Verra (VCS).",
    details: "Disponível para venda imediata com documentação de custódia e rastreabilidade pronta para aposentadoria ou comercialização no mercado voluntário e internacional.",
    highlights: ["Certificação Verra VCS", "Auditado por terceira parte", "Vintage recente 2024/2025"],
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80",
    ],
    documentPdfName: "Certificado_Verra_Auditoria_Carbono.pdf",
    documentPdfSize: "5.1 MB",
    documentPdfUrl: "#",
    author: {
      name: "Carla Antunes",
      company: "EcoCarbon Partners",
      jobTitle: "Fundadora & Diretora ESG",
      badge: "Especialista ESG",
      whatsapp: "(41) 95555-4444",
      email: "carla@ecocarbon.org",
    },
    createdAt: "2026-03-05",
    questions: [
      {
        id: "q-2",
        senderName: "Fundo Verde Alocação",
        senderContact: "contato@fundoverde.com.br",
        content: "Existe possibilidade de fracionamento para lote mínimo de 100.000 créditos?",
        sentAt: "15/03/2026 09:45",
        reply: "Sim, aceitamos propostas para lotes a partir de 100 mil créditos com precificação escalonada.",
      },
    ],
  },
  {
    id: "opp-3",
    title: "Venda de Rede de Hotéis Boutique (4 Propriedades)",
    category: "venda_hoteis",
    categoryLabel: "Venda de Hotéis & Resorts",
    categoryIcon: "🏨",
    volume: "R$ 125.000.000",
    location: "Nordeste & Serra Gaúcha",
    stage: "Em Negociação",
    summary: "Grupo hoteleiro premium com alta taxa de ocupação, marca consolidada e imóveis próprios livres de ônus.",
    details: "Operação completa incluindo gestão, equipe, sistema de reservas direto e margem EBITDA de 32%. Terrenos e edifícios 100% de propriedade do grupo, sem financiamentos pendentes.",
    highlights: ["Imóveis próprios livres de ônus", "EBITDA R$ 18.5M/ano", "Taxa média ocupação 78%"],
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    ],
    documentPdfName: "Memorando_M&A_Rede_Hoteis_Boutique.pdf",
    documentPdfSize: "6.8 MB",
    documentPdfUrl: "#",
    author: {
      name: "Fernando Prado",
      company: "Prado Hotéis & Resorts",
      jobTitle: "Diretor de Expansão & Sócio",
      badge: "Especialista M&A Hoteleiro",
      whatsapp: "(21) 96666-5555",
      email: "fprado@hotelariagroup.com",
    },
    createdAt: "2026-02-28",
    questions: [],
  },
  {
    id: "opp-4",
    title: "Aeronave Executiva Embraer Phenom 300E (2022)",
    category: "aeronaves",
    categoryLabel: "Aeronaves Executivas",
    categoryIcon: "✈️",
    volume: "US$ 11.800.000",
    location: "São Paulo, SP - Hangar Privado",
    stage: "Ativa",
    summary: "Aeronave com poucas horas de voo, programa de manutenção de motores pago e interior executivo 10/10.",
    details: "Único dono, sem histórico de incidentes, configurado para 9 passageiros com aviônica Garmin Prodigy Touch e alcance transcontinental.",
    highlights: ["Apenas 450 horas totais", "Garmin Prodigy Touch 300", "Tap Blue Engine Program"],
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
    ],
    documentPdfName: "Ficha_Tecnica_Phenom_300E.pdf",
    documentPdfSize: "2.1 MB",
    documentPdfUrl: "#",
    author: {
      name: "Eduardo Silveira",
      company: "Silveira Capital",
      jobTitle: "Managing Partner",
      badge: "Membro Verificado 100%",
      whatsapp: "(11) 98888-7777",
      email: "eduardo@silveiracapital.com",
    },
    createdAt: "2026-03-01",
    questions: [],
  },
  {
    id: "opp-5",
    title: "Usina de Triagem e Valorização RSU (Lixo em Energia)",
    category: "usinas_rsu",
    categoryLabel: "Usinas de RSU",
    categoryIcon: "♻️",
    volume: "R$ 85.000.000",
    location: "Campinas e Região, SP",
    stage: "Nova Originação",
    summary: "Projeto aprovado de usina de biodigestão e pirólise para processamento de 500 toneladas/dia de resíduos sólidos urbanos.",
    details: "Contrato de concessão municipal de 30 anos firmado com receita de gatilho de tippage fee + venda de energia limpa para rede de distribuição.",
    highlights: ["Concessão de 30 anos", "500 toneladas/dia garantidas", "TIR estimada de 19% a.a."],
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
    documentPdfName: "Projeto_Tecnico_Viabilidade_RSU_500t.pdf",
    documentPdfSize: "4.7 MB",
    documentPdfUrl: "#",
    author: {
      name: "Carlos Oliveira",
      company: "InvestBR Capital",
      jobTitle: "Diretor de Infraestrutura",
      badge: "Top Originador",
      whatsapp: "(21) 97777-3344",
      email: "carlos@investbr.com.br",
    },
    createdAt: "2026-03-12",
    questions: [],
  },
  {
    id: "opp-6",
    title: "Procura de Rede Hoteleira para Compra (Buy-Side Mandate)",
    category: "compra_hoteis",
    categoryLabel: "Compra de Redes de Hotéis",
    categoryIcon: "🏢",
    volume: "R$ 200.000.000",
    location: "São Paulo, Rio de Janeiro e Curitiba",
    stage: "NDA Requerido",
    summary: "Fundo imobiliário comprador busca redes de hotéis midscale ou corporativos com no mínimo 150 chaves.",
    details: "Mandato de compra exclusivo com capital integralizado pronto para liquidação e due diligence ágil em até 45 dias úteis.",
    highlights: ["Fundo comprador 100% capitalizado", "Ticket até R$ 200M", "Opção de manter bandeira atual"],
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    documentPdfName: "Criterios_Aquisicao_Fundo_Imobiliario.pdf",
    documentPdfSize: "1.8 MB",
    documentPdfUrl: "#",
    author: {
      name: "Ricardo Mendes",
      company: "Financeira Nacional",
      jobTitle: "Diretor de Investimentos",
      badge: "Investidor Tier 1",
      whatsapp: "(11) 97111-2233",
      email: "ricardo@financeira.com.br",
    },
    createdAt: "2026-02-20",
    questions: [],
  },
];

const STORAGE_KEY = "mc_opportunities_v2";

export function getStoredOpportunities(): OpportunityItem[] {
  if (typeof window === "undefined") return defaultOpportunities;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Falha ao ler oportunidades de localStorage:", e);
  }
  return defaultOpportunities;
}

export function saveStoredOpportunities(items: OpportunityItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("Falha ao salvar oportunidades no localStorage:", e);
  }
}
