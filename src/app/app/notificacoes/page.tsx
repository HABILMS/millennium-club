"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Bell, Check, Mail, MessageSquare, Calendar, Trophy, Filter, X } from "lucide-react";
import { useState } from "react";

const notifications = [
  { id: "1", type: "application_status", title: "Candidatura aprovada!", message: "Parabéns! Sua candidatura foi aprovada. Acesse sua área de membro para completar o perfil.", time: "2026-01-15T10:30:00", read: true, actionUrl: "/app/perfil" },
  { id: "2", type: "interview_scheduled", title: "Entrevista agendada", message: "Sua entrevista de screening está agendada para 20/01 às 14:00. Link: meet.google.com/abc-def-ghi", time: "2026-01-10T09:00:00", read: true, actionUrl: "/candidatura" },
  { id: "3", type: "badge_earned", title: "Novo selo: Perfil Verificado", message: "Você conquistou o selo 'Perfil Verificado' ao completar 100% do seu perfil profissional.", time: "2026-01-12T16:45:00", read: false, actionUrl: "/app/perfil" },
  { id: "4", type: "welcome", title: "Bem-vindo ao Millennium Club", message: "Sua conta foi ativada. Explore a rede, complete seu perfil e comece a fazer conexões estratégicas.", time: "2026-01-15T10:35:00", read: false, actionUrl: "/app" },
  { id: "5", type: "system", title: "Atualização nos Termos de Uso", message: "Nossos termos foram atualizados. Por favor, revise as alterações na seção Legal.", time: "2026-01-01T00:00:00", read: true, actionUrl: "/termos" },
  { id: "6", type: "admin_message", title: "Convite para Comitê Agro", message: "Você foi convidado a participar do Comitê de Agronegócio. Reunião inaugural em 25/01.", time: "2026-01-14T11:20:00", read: false, actionUrl: "/app/comites" },
  { id: "7", type: "connection", title: "Nova solicitação de introdução", message: "Carlos Oliveira (Investidor - FinTech) solicitou introdução à startup AgroTech Sul.", time: "2026-01-13T15:30:00", read: false, actionUrl: "/app/conexoes" },
  { id: "8", type: "event", title: "Inscrição confirmada: Rodada Série A", message: "Sua inscrição na Rodada de Investimento - Série A foi confirmada. Evento em 20/02 às 09:00.", time: "2026-01-12T08:00:00", read: true, actionUrl: "/app/eventos" },
];

const typeIcons = {
  application_status: { icon: Check, color: "emerald", label: "Candidatura" },
  interview_scheduled: { icon: Calendar, color: "gold", label: "Entrevista" },
  badge_earned: { icon: Trophy, color: "gold", label: "Selo" },
  welcome: { icon: MessageSquare, color: "blue", label: "Boas-vindas" },
  system: { icon: Bell, color: "silver", label: "Sistema" },
  admin_message: { icon: MessageSquare, color: "purple", label: "Admin" },
  connection: { icon: MessageSquare, color: "emerald", label: "Conexão" },
  event: { icon: Calendar, color: "blue", label: "Evento" },
};

const typeFilters = [
  { value: "all", label: "Todas" },
  { value: "unread", label: "Não lidas" },
  { value: "application_status", label: "Candidatura" },
  { value: "badge_earned", label: "Selos" },
  { value: "connection", label: "Conexões" },
  { value: "event", label: "Eventos" },
  { value: "system", label: "Sistema" },
];

export default function NotificacoesPage() {
  const [filter, setFilter] = React.useState("all");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = React.useState(false);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleRead = (id: string) => {
    const notif = notifications.find(n => n.id === id);
    if (notif) notif.read = !notif.read;
  };

  const markAllRead = () => {
    notifications.forEach(n => n.read = true);
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (hours < 1) return "Agora";
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  return (
    
      <div className="space-y-6 animate-fade-up max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">Notificações</h1>
            <p className="mt-1 text-silver">Central de comunicações e alertas da sua conta</p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Badge variant="emerald" className="gap-1.5">
                <Bell className="h-3.5 w-3.5" />
                {unreadCount} não lida{unreadCount > 1 ? "s" : ""}
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
              Marcar todas como lidas
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none appearance-none text-sm"
            >
              {typeFilters.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        <Card className="glass">
          <CardContent className="p-0">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-white mb-2">Nenhuma notificação</h3>
                <p className="text-text-secondary">Todas as suas notificações aparecerão aqui.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredNotifications.map((notif) => {
                  const typeConfig = typeIcons[notif.type as keyof typeof typeIcons] || { icon: Bell, color: "silver", label: "Sistema" };
                  const TypeIcon = typeConfig.icon;

                  return (
                    <div
                      key={notif.id}
                      className={cn(
                        "p-4 hover:bg-charcoal/30 transition-colors flex items-start gap-4",
                        !notif.read && "bg-gold/5 border-l-4 border-gold"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.has(notif.id)}
                        onChange={(e) => {
                          const newSet = new Set(selectedIds);
                          e.target.checked ? newSet.add(notif.id) : newSet.delete(notif.id);
                          setSelectedIds(newSet);
                        }}
                        className="mt-1 h-4 w-4 rounded border-border bg-charcoal text-gold focus:ring-gold"
                      />
                      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0", `bg-${typeConfig.color}/10 text-${typeConfig.color}`)}>
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className={cn("font-medium text-white", !notif.read && "font-semibold")}>{notif.title}</h4>
                            <span className="text-xs text-text-secondary ml-2">{typeConfig.label}</span>
                          </div>
                          <span className="text-xs text-text-secondary whitespace-nowrap">{formatTime(notif.time)}</span>
                        </div>
                        <p className="mt-1 text-sm text-text-secondary">{notif.message}</p>
{notif.actionUrl && (
                          <Button variant="ghost" size="sm" className="mt-2" onClick={() => window.location.href = notif.actionUrl}>
                            Ver detalhes
                          </Button>
                        )}
                      </div>
                      {!notif.read && (
                        <button
                          onClick={() => toggleRead(notif.id)}
                          className="p-1 text-text-secondary hover:text-gold transition-colors rounded"
                          aria-label="Marcar como lida"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center justify-between">
              Preferências de notificação
              <Mail className="h-5 w-5 text-gold" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium text-white mb-4">Canais de recebimento</h4>
              <div className="space-y-3">
                {[
                  { key: "in_app", label: "Notificações no app", description: "Alertas na central de notificações", enabled: true },
                  { key: "email", label: "E-mail transacional", description: "Confirmações, alertas de segurança, mudanças de status", enabled: true },
                  { key: "marketing", label: "Comunicações de marketing", description: "Novidades, eventos, conteúdo exclusivo", enabled: false },
                ].map((pref) => (
                  <label key={pref.key} className="flex items-center justify-between p-4 glass rounded-xl cursor-pointer hover:border-gold/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked={pref.enabled}
                        className="h-5 w-5 rounded border-border bg-charcoal text-gold focus:ring-gold"
                      />
                      <div>
                        <p className="font-medium text-white">{pref.label}</p>
                        <p className="text-sm text-text-secondary">{pref.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="font-medium text-white mb-4">Tipos de notificação (granular)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Mudança de status da candidatura",
                  "Entrevista agendada",
                  "Novo selo conquistado",
                  "Solicitação de introdução",
                  "Nova oportunidade compatível",
                  "Evento confirmado",
                  "Lembrete de evento",
                  "Mensagem da administração",
                  "Atualizações de sistema",
                  "Newsletter semanal",
                ].map((type) => (
                  <label key={type} className="flex items-center gap-3 p-3 glass rounded-xl cursor-pointer hover:border-gold/30 transition-colors">
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border bg-charcoal text-gold focus:ring-gold" />
                    <span className="text-sm text-silver">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button variant="gold">Salvar preferências</Button>
          </CardContent>
        </Card>
      </div>
    
  );
}
