export type EventCategory = "presencial" | "seminario" | "webinar";

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  categoryLabel: string;
  date: string;
  time: string;
  location: string;
  speakers: string[];
  description: string;
  capacity: string;
  maxAttendees?: number;
  registeredCount: number;
  isRegistered?: boolean;
  isActive?: boolean;
  createdAt?: string;
  attendees?: { name: string; email: string; registeredAt: string }[];
}

export const defaultMockEvents: EventItem[] = [
  {
    id: "a0000001-0000-0000-0000-000000000001",
    title: "Mesa Redonda: Estruturação de Transações de Energia Solar & Crédito",
    category: "webinar",
    categoryLabel: "Webinar Online",
    date: "25 de Outubro, 2026",
    time: "19:00 - 20:30 (BRT)",
    location: "Transmissão Zoom Exclusiva para Membros",
    speakers: ["Dr. Marcelo Guimarães (Especialista M&A)", "Ana Paula Siqueira (VP Originação Solar)"],
    description: "Discussão prática sobre precificação de passivos fotovoltaicos, securitização de créditos de energia e estruturação de PPAs de longo prazo.",
    capacity: "100 vagas online",
    maxAttendees: 100,
    registeredCount: 64,
    isActive: true,
  },
  {
    id: "a0000002-0000-0000-0000-000000000002",
    title: "Seminário Anual de Mercado Imobiliário & Redes Hoteleiras",
    category: "seminario",
    categoryLabel: "Seminário",
    date: "10 de Novembro, 2026",
    time: "09:00 - 18:00 (BRT)",
    location: "Hotel Unique - São Paulo, SP",
    speakers: ["Carlos Eduardo Nobre (CEO Fund)", "Fernanda Lins (Diretora Real Estate)"],
    description: "Encontro presencial de executivos para debater o cenário de M&A hoteleiro, retrofit de empreendimentos e oportunidades buy-side no Brasil.",
    capacity: "120 convidados presenciais",
    maxAttendees: 120,
    registeredCount: 88,
    isActive: true,
  },
  {
    id: "a0000003-0000-0000-0000-000000000003",
    title: "Rodada Fechada de Co-Investimento & Societário para Projetos RSU",
    category: "presencial",
    categoryLabel: "Evento Presencial",
    date: "22 de Novembro, 2026",
    time: "15:00 - 19:30 (BRT)",
    location: "Clube Millennium HQ - Faria Lima, SP",
    speakers: ["Comitê de Admissão & Originação RSU"],
    description: "Apresentação restrita de 3 projetos de usinas de resíduos sólidos urbanos pré-operacionais buscando parceiros equity e de tecnologia.",
    capacity: "35 investidores qualificados",
    maxAttendees: 35,
    registeredCount: 29,
    isActive: true,
  },
  {
    id: "a0000004-0000-0000-0000-000000000004",
    title: "Webinar: Créditos de Carbono VERRA & Descarbonização Corporativa",
    category: "webinar",
    categoryLabel: "Webinar Online",
    date: "05 de Dezembro, 2026",
    time: "17:00 - 18:15 (BRT)",
    location: "Plataforma Virtual Millennium",
    speakers: ["Gabriel Ramos (Head ESG)", "Juliana Santos (Auditora Verra)"],
    description: "Análise de tendências de preços de carbono no mercado voluntário e estratégias de liquidez para ativos de conservação florestal.",
    capacity: "200 participantes",
    maxAttendees: 200,
    registeredCount: 112,
    isActive: true,
  },
];
