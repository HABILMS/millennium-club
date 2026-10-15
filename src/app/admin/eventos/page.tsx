"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Sparkles,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Loader2,
  Video,
  Globe,
  UserCheck,
  Eye,
} from "lucide-react";
import { EventItem, defaultMockEvents } from "@/lib/events";

export default function AdminEventosPage() {
  const [events, setEvents] = useState<EventItem[]>(defaultMockEvents);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [attendeesModalEvent, setAttendeesModalEvent] = useState<EventItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulário de Criação / Edição
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<"presencial" | "seminario" | "webinar">("webinar");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formSpeakers, setFormSpeakers] = useState("");
  const [formCapacity, setFormCapacity] = useState("");
  const [formMaxAttendees, setFormMaxAttendees] = useState(100);
  const [formDescription, setFormDescription] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/events");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.events)) {
          setEvents(data.events);
        }
      }
    } catch (e) {
      console.warn("Erro ao buscar eventos:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormTitle("");
    setFormCategory("webinar");
    setFormDate("20 de Novembro, 2026");
    setFormTime("19:00 - 20:30 (BRT)");
    setFormLocation("Transmissão Online Zoom para Membros");
    setFormSpeakers("Dr. Nome Sobrenome, Dra. Especialista");
    setFormCapacity("100 participantes");
    setFormMaxAttendees(100);
    setFormDescription("");
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (evt: EventItem) => {
    setEditingEvent(evt);
    setFormTitle(evt.title);
    setFormCategory(evt.category);
    setFormDate(evt.date);
    setFormTime(evt.time);
    setFormLocation(evt.location);
    setFormSpeakers(evt.speakers.join(", "));
    setFormCapacity(evt.capacity);
    setFormMaxAttendees(evt.maxAttendees || 100);
    setFormDescription(evt.description);
    setFormIsActive(evt.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDate || !formLocation || !formDescription) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    const speakersArray = formSpeakers
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: formTitle,
      category: formCategory,
      date: formDate,
      time: formTime,
      location: formLocation,
      speakers: speakersArray,
      capacity: formCapacity,
      maxAttendees: formMaxAttendees,
      description: formDescription,
      isActive: formIsActive,
    };

    try {
      if (editingEvent) {
        // Atualização
        const res = await fetch("/api/admin/events", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingEvent.id, ...payload }),
        });
        if (res.ok) {
          showToast(`Evento "${formTitle}" atualizado com sucesso!`);
          setIsModalOpen(false);
          fetchEvents();
        }
      } else {
        // Criação
        const res = await fetch("/api/admin/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast(`Novo evento "${formTitle}" publicado na agenda!`);
          setIsModalOpen(false);
          fetchEvents();
        }
      }
    } catch (err) {
      console.error("Erro ao salvar evento:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o evento "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/events?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Evento excluído da agenda.");
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (e) {
      console.warn("Erro ao excluir:", e);
    }
  };

  // KPIs
  const totalRsvps = useMemo(() => {
    return events.reduce((acc, e) => acc + (e.registeredCount || 0), 0);
  }, [events]);

  const activeEventsCount = useMemo(() => {
    return events.filter((e) => e.isActive !== false).length;
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "active" && e.isActive !== false) ||
        (activeTab === "inactive" && e.isActive === false);

      const matchesSearch =
        !searchQuery ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.speakers.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTab && matchesSearch;
    });
  }, [events, activeTab, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-charcoal/95 border border-gold/40 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-text-secondary hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge variant="gold" size="sm" className="mb-1 font-bold">
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Curadoria de Encontros & Deals
          </Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            Gestão de Eventos, Seminários & Webinars
          </h1>
          <p className="mt-1 text-silver text-sm">
            Cadastre novos encontros para a rede, acompanhe as listas de inscritos e edite a programação.
          </p>
        </div>

        <Button variant="gold" onClick={openCreateModal} className="font-bold gap-1.5 shrink-0">
          <Plus className="h-4 w-4" /> Novo Evento
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary uppercase font-semibold">Total de Eventos</p>
              <p className="mt-1 font-display text-2xl font-bold text-white">{events.length}</p>
              <p className="text-[11px] text-silver mt-0.5">Na programação anual</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
              <CalendarIcon className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary uppercase font-semibold">Eventos Ativos</p>
              <p className="mt-1 font-display text-2xl font-bold text-emerald">{activeEventsCount}</p>
              <p className="text-[11px] text-silver mt-0.5">Visíveis aos membros</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald/15 text-emerald flex items-center justify-center border border-emerald/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary uppercase font-semibold">Inscrições Totais</p>
              <p className="mt-1 font-display text-2xl font-bold text-gold">{totalRsvps}</p>
              <p className="text-[11px] text-silver mt-0.5">Vagas confirmadas</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center border border-gold/30">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary uppercase font-semibold">Formato Online</p>
              <p className="mt-1 font-display text-2xl font-bold text-blue-400">
                {events.filter((e) => e.category === "webinar").length}
              </p>
              <p className="text-[11px] text-silver mt-0.5">Webinars exclusivos</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Video className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Filtro e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-charcoal/70 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              activeTab === "all" ? "bg-white/15 text-white" : "text-silver hover:text-white"
            )}
          >
            Todos ({events.length})
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              activeTab === "active" ? "bg-emerald/20 text-emerald" : "text-silver hover:text-white"
            )}
          >
            Ativos ({activeEventsCount})
          </button>
          <button
            onClick={() => setActiveTab("inactive")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              activeTab === "inactive" ? "bg-amber-500/20 text-amber-300" : "text-silver hover:text-white"
            )}
          >
            Inativos ({events.length - activeEventsCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary" />
          <Input
            placeholder="Buscar por título, palestrante ou local..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-charcoal border-border"
          />
        </div>
      </div>

      {/* Lista de Eventos */}
      {isLoading ? (
        <div className="p-16 text-center text-silver">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gold mb-3" />
          <p className="text-sm">Carregando painel de eventos...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card className="glass text-center p-12 space-y-3">
          <CalendarIcon className="h-10 w-10 text-text-secondary mx-auto opacity-40" />
          <h3 className="font-display text-base font-semibold text-white">Nenhum evento localizado</h3>
          <p className="text-xs text-silver">Ajuste os filtros ou cadastre um novo evento.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((evt) => (
            <Card key={evt.id} className="glass hover:border-gold/30 transition-all border-border">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-semibold",
                          evt.category === "webinar" && "bg-blue-500/10 text-blue-400 border-blue-500/30",
                          evt.category === "seminario" && "bg-purple-500/10 text-purple-400 border-purple-500/30",
                          evt.category === "presencial" && "bg-emerald/10 text-emerald border-emerald/30"
                        )}
                      >
                        {evt.categoryLabel}
                      </Badge>

                      {evt.isActive !== false ? (
                        <span className="text-[11px] font-bold text-emerald bg-emerald/15 px-2 py-0.5 rounded border border-emerald/30">
                          ● Ativo na Agenda
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-silver bg-charcoal px-2 py-0.5 rounded border border-border">
                          ○ Oculto
                        </span>
                      )}

                      <span className="text-xs text-silver flex items-center gap-1 bg-charcoal px-2 py-0.5 rounded border border-border">
                        <Users className="h-3 w-3 text-gold" /> {evt.registeredCount} inscritos ({evt.capacity})
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-white text-base leading-snug">
                      {evt.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-silver">
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon className="h-3.5 w-3.5 text-gold" /> {evt.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gold" /> {evt.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-gold" /> {evt.location}
                      </span>
                    </div>

                    <p className="text-xs text-silver line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAttendeesModalEvent(evt)}
                      className="h-8 text-xs gap-1 border-gold/40 text-gold hover:bg-gold/10"
                    >
                      <Eye className="h-3.5 w-3.5" /> Ver Inscritos ({evt.registeredCount})
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(evt)}
                      className="h-8 text-xs gap-1 border-border text-white hover:bg-charcoal"
                    >
                      <Edit className="h-3.5 w-3.5" /> Editar
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(evt.id, evt.title)}
                      className="h-8 text-xs text-silver hover:text-red-400 p-2"
                      title="Excluir evento"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Criar / Editar Evento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="glass rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-gold/40 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-gold" />
                {editingEvent ? "Editar Evento" : "Novo Evento na Agenda"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-silver hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-silver block mb-1">Título do Evento *</label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex: Rodada Fechada de M&A em Energia Solar"
                  className="bg-charcoal text-white text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-silver block mb-1">Formato / Categoria</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-charcoal border border-border rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-gold"
                  >
                    <option value="webinar">Webinar Online (Transmissão)</option>
                    <option value="presencial">Evento Presencial</option>
                    <option value="seminario">Seminário Executivo</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-silver block mb-1">Capacidade / Vagas</label>
                  <Input
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    placeholder="Ex: 50 convidados presenciais"
                    className="bg-charcoal text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-silver block mb-1">Data *</label>
                  <Input
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="Ex: 15 de Novembro, 2026"
                    className="bg-charcoal text-white text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-silver block mb-1">Horário (com fuso)</label>
                  <Input
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="Ex: 19:00 - 20:30 (BRT)"
                    className="bg-charcoal text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-silver block mb-1">Local / Link de Acesso *</label>
                <Input
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Ex: Hotel Unique - São Paulo ou Link Zoom Exclusivo"
                  className="bg-charcoal text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-silver block mb-1">Palestrantes (separados por vírgula)</label>
                <Input
                  value={formSpeakers}
                  onChange={(e) => setFormSpeakers(e.target.value)}
                  placeholder="Ex: Dr. Roberto Siqueira, Ana Paula Guimarães"
                  className="bg-charcoal text-white text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-silver block mb-1">Descrição e Pauta *</label>
                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detalhes dos temas, regras de admissão e objetivos da rodada..."
                  className="w-full bg-charcoal border border-border rounded-xl p-3 text-white text-xs focus:outline-none focus:border-gold resize-none"
                  required
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="rounded bg-charcoal border-border text-gold focus:ring-gold"
                />
                <span className="text-white font-medium text-xs">Publicar imediatamente na agenda do membro</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="gold" type="submit" loading={isSubmitting} className="font-bold">
                  {editingEvent ? "Salvar Alterações" : "Publicar Evento"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Visualização de Inscritos */}
      {attendeesModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="glass rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-gold/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-xs text-gold font-bold uppercase">Lista de Presença</span>
                <h2 className="font-display text-base font-bold text-white mt-0.5">
                  {attendeesModalEvent.title}
                </h2>
              </div>
              <button onClick={() => setAttendeesModalEvent(null)} className="text-silver hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-silver bg-charcoal/70 p-3 rounded-xl border border-border">
              <span>Total de Confirmações:</span>
              <span className="font-bold text-white font-mono">
                {attendeesModalEvent.attendees?.length || attendeesModalEvent.registeredCount} membros
              </span>
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              {Array.isArray(attendeesModalEvent.attendees) && attendeesModalEvent.attendees.length > 0 ? (
                attendeesModalEvent.attendees.map((att, i) => (
                  <div key={i} className="p-3 bg-charcoal border border-border rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{att.name}</p>
                      <p className="text-text-secondary">{att.email}</p>
                    </div>
                    <span className="text-[11px] text-silver font-mono">
                      {new Date(att.registeredAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-silver">
                  <UserCheck className="h-8 w-8 text-gold mx-auto mb-2 opacity-50" />
                  <p>Inscrições realizadas através da vitrine do clube ({attendeesModalEvent.registeredCount} membros confirmados).</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setAttendeesModalEvent(null)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
