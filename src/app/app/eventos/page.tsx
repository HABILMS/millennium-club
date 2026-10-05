"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle,
  Sparkles,
  Share2,
  Bookmark,
} from "lucide-react";

export const dynamic = "force-dynamic";

export interface EventItem {
  id: string;
  title: string;
  category: "presencial" | "seminario" | "webinar";
  categoryLabel: string;
  date: string;
  time: string;
  location: string;
  speakers: string[];
  description: string;
  capacity: string;
  registeredCount: number;
}

const mockEvents: EventItem[] = [
  {
    id: "evt-1",
    title: "Mesa Redonda: Estruturação de Transações de Energia Solar & Crédito",
    category: "webinar",
    categoryLabel: "Webinar Online",
    date: "25 de Setembro, 2026",
    time: "19:00 - 20:30 (BRT)",
    location: "Transmissão Zoom Exclusiva para Membros",
    speakers: ["Dr. Marcelo Guimarães (Especialista M&A)", "Ana Paula Siqueira (VP Originação Solar)"],
    description: "Discussão prática sobre precificação de passivos fotovoltaicos, securitização de créditos de energia e estruturação de PPAs de longo prazo.",
    capacity: "100 vagas online",
    registeredCount: 64,
  },
  {
    id: "evt-2",
    title: "Seminário Anual de Mercado Imobiliário & Redes Hoteleiras",
    category: "seminario",
    categoryLabel: "Seminário",
    date: "10 de Outubro, 2026",
    time: "09:00 - 18:00 (BRT)",
    location: "Hotel Unique - São Paulo, SP",
    speakers: ["Carlos Eduardo Nobre (CEO Fund)", "Fernanda Lins (Diretora Real Estate)"],
    description: "Encontro presencial de executivos para debater o cenário de M&A hoteleiro, retrofit de empreendimentos e oportunidades buy-side no Brasil.",
    capacity: "120 convidados presenciais",
    registeredCount: 88,
  },
  {
    id: "evt-3",
    title: "Rodada Fechada de Co-Investimento & Societário para Projetos RSU",
    category: "presencial",
    categoryLabel: "Evento Presencial",
    date: "22 de Outubro, 2026",
    time: "15:00 - 19:30 (BRT)",
    location: "Clube Millenium HQ - Faria Lima, SP",
    speakers: ["Comitê de Admissão & Originação RSU"],
    description: "Apresentação restrita de 3 projetos de usinas de resíduos sólidos urbanos pré-operacionais buscando parceiros equity e de tecnologia.",
    capacity: "35 investidores qualificados",
    registeredCount: 29,
  },
  {
    id: "evt-4",
    title: "Webinar: Créditos de Carbono VERRA & Descarbonização Corporativa",
    category: "webinar",
    categoryLabel: "Webinar Online",
    date: "05 de Novembro, 2026",
    time: "17:00 - 18:15 (BRT)",
    location: "Plataforma Virtual Millennium",
    speakers: ["Gabriel Ramos (Head ESG)", "Juliana Santos (Auditora Verra)"],
    description: "Análise de tendências de preços de carbono no mercado voluntário e estratégias de liquidez para ativos de conservação florestal.",
    capacity: "200 participantes",
    registeredCount: 112,
  },
];

export default function EventosPage() {
  const [activeTab, setActiveTab] = React.useState<"todos" | "presencial" | "seminario" | "webinar">("todos");
  const [registeredEvents, setRegisteredEvents] = React.useState<string[]>([]);

  const filteredEvents = React.useMemo(() => {
    if (activeTab === "todos") return mockEvents;
    return mockEvents.filter((e) => e.category === activeTab);
  }, [activeTab]);

  const toggleRsvp = (eventId: string) => {
    setRegisteredEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Badge variant="gold" size="sm" className="mb-1.5">
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Agenda Exclusiva
          </Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Agenda de Eventos, Seminários & Webinars
          </h1>
          <p className="mt-1 text-silver text-sm">
            Participe dos encontros de originação, seminários presenciais e rodadas de negócios do Millennium Club.
          </p>
        </div>
      </div>

      {/* Abas de Filtro */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("todos")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "todos"
              ? "bg-gold text-obsidian font-bold shadow-md"
              : "bg-charcoal/50 text-silver hover:bg-charcoal hover:text-white"
          )}
        >
          Todos os Eventos ({mockEvents.length})
        </button>
        <button
          onClick={() => setActiveTab("presencial")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "presencial"
              ? "bg-gold text-obsidian font-bold shadow-md"
              : "bg-charcoal/50 text-silver hover:bg-charcoal hover:text-white"
          )}
        >
          🏢 Presenciais
        </button>
        <button
          onClick={() => setActiveTab("seminario")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "seminario"
              ? "bg-gold text-obsidian font-bold shadow-md"
              : "bg-charcoal/50 text-silver hover:bg-charcoal hover:text-white"
          )}
        >
          🎓 Seminários
        </button>
        <button
          onClick={() => setActiveTab("webinar")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
            activeTab === "webinar"
              ? "bg-gold text-obsidian font-bold shadow-md"
              : "bg-charcoal/50 text-silver hover:bg-charcoal hover:text-white"
          )}
        >
          💻 Webinars Online
        </button>
      </div>

      {/* Grid de Eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((evt) => {
          const isRegistered = registeredEvents.includes(evt.id);
          return (
            <Card key={evt.id} className="glass hover:border-gold/40 transition-all flex flex-col justify-between">
              <CardHeader className="p-6 border-b border-border/50">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-semibold text-xs",
                      evt.category === "webinar" && "bg-blue-500/10 text-blue-400 border-blue-500/30",
                      evt.category === "seminario" && "bg-purple-500/10 text-purple-400 border-purple-500/30",
                      evt.category === "presencial" && "bg-emerald/10 text-emerald border-emerald/30"
                    )}
                  >
                    {evt.categoryLabel}
                  </Badge>
                  <span className="text-xs text-text-secondary flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-gold" /> {evt.registeredCount + (isRegistered ? 1 : 0)} inscritos
                  </span>
                </div>
                <CardTitle className="font-display text-lg text-white leading-snug">
                  {evt.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-silver">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gold flex-shrink-0" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gold flex-shrink-0" />
                      <span>{evt.time}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-silver">
                    {evt.category === "webinar" ? (
                      <Video className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <MapPin className="h-4 w-4 text-emerald flex-shrink-0 mt-0.5" />
                    )}
                    <span>{evt.location}</span>
                  </div>

                  <p className="text-xs text-silver leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-white uppercase tracking-wider block mb-1">
                      Palestrantes & Convidados:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {evt.speakers.map((spk, i) => (
                        <span key={i} className="text-xs bg-charcoal border border-border px-2.5 py-1 rounded-lg text-silver">
                          👤 {spk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-3">
                  <span className="text-xs text-text-secondary">{evt.capacity}</span>

                  <Button
                    variant={isRegistered ? "outline" : "gold"}
                    size="sm"
                    onClick={() => toggleRsvp(evt.id)}
                    className={cn(isRegistered && "border-emerald text-emerald bg-emerald/10 hover:bg-emerald/20")}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1 text-emerald" /> Vaga Garantida
                      </>
                    ) : (
                      "Garantir Minha Vaga"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
