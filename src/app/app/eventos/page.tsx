"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { EventItem, defaultMockEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default function EventosPage() {
  const { user } = useAuth();
  const [events, setEvents] = React.useState<EventItem[]>(defaultMockEvents);
  const [activeTab, setActiveTab] = React.useState<"todos" | "presencial" | "seminario" | "webinar">("todos");
  const [isLoading, setIsLoading] = React.useState(true);
  const [rsvpLoadingId, setRsvpLoadingId] = React.useState<string | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchEvents = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const email = user?.email ? `?email=${encodeURIComponent(user.email)}` : "";
      const res = await fetch(`/api/events${email}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.events) && data.events.length > 0) {
          setEvents(data.events);
        }
      }
    } catch (e) {
      console.warn("Erro ao buscar eventos:", e);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  React.useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = React.useMemo(() => {
    if (activeTab === "todos") return events;
    return events.filter((e) => e.category === activeTab);
  }, [events, activeTab]);

  const handleToggleRsvp = async (eventItem: EventItem) => {
    const isCurrentlyRegistered = eventItem.isRegistered;
    setRsvpLoadingId(eventItem.id);

    // Atualização otimista
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventItem.id
          ? {
              ...e,
              isRegistered: !isCurrentlyRegistered,
              registeredCount: isCurrentlyRegistered
                ? Math.max(0, e.registeredCount - 1)
                : e.registeredCount + 1,
            }
          : e
      )
    );

    try {
      const res = await fetch(`/api/events/${eventItem.id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          name: user?.user_metadata?.first_name || user?.email?.split("@")[0],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.registered) {
          showToast(`Sua inscrição no evento "${eventItem.title}" foi confirmada!`);
        } else {
          showToast(`Inscrição no evento "${eventItem.title}" cancelada.`);
        }
      }
    } catch (e) {
      console.warn("Erro ao processar RSVP:", e);
    } finally {
      setRsvpLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
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

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Badge variant="gold" size="sm" className="mb-1.5 font-bold">
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Agenda Exclusiva de Deals & Networking
          </Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Agenda de Eventos, Seminários & Webinars
          </h1>
          <p className="mt-1 text-silver text-sm">
            Participe dos encontros de originação, seminários presenciais e rodadas fechadas do Millennium Club.
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
          Todos os Eventos ({events.length})
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
      {isLoading ? (
        <div className="p-16 text-center text-silver">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gold mb-3" />
          <p className="text-sm">Carregando programação de eventos...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-16 text-center glass rounded-2xl border border-border">
          <CalendarIcon className="h-10 w-10 text-text-secondary mx-auto mb-3 opacity-40" />
          <h3 className="font-display text-lg font-semibold text-white">Nenhum evento nesta categoria</h3>
          <p className="text-xs text-silver mt-1">Fique atento aos próximos comunicados da diretoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((evt) => {
            const isRegistered = Boolean(evt.isRegistered);
            const isProcessing = rsvpLoadingId === evt.id;

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
                      <Users className="h-3.5 w-3.5 text-gold" /> {evt.registeredCount} inscritos
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

                    {Array.isArray(evt.speakers) && evt.speakers.length > 0 && (
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
                    )}
                  </div>

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-3">
                    <span className="text-xs text-text-secondary">{evt.capacity}</span>

                    <Button
                      variant={isRegistered ? "outline" : "gold"}
                      size="sm"
                      disabled={isProcessing}
                      onClick={() => handleToggleRsvp(evt)}
                      className={cn(
                        "font-bold text-xs",
                        isRegistered && "border-emerald text-emerald bg-emerald/10 hover:bg-emerald/20"
                      )}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isRegistered ? (
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
      )}
    </div>
  );
}
