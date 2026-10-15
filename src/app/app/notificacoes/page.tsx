"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  Bell,
  Check,
  Mail,
  MessageSquare,
  Calendar,
  Trophy,
  Filter,
  CheckCircle2,
  Briefcase,
  AlertCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  action_url?: string;
}

const typeIcons: Record<string, { icon: any; color: string; label: string }> = {
  opportunity_approved: { icon: CheckCircle2, color: "emerald", label: "Oportunidade" },
  opportunity_rejected: { icon: AlertCircle, color: "amber", label: "Oportunidade" },
  opportunity_expiring: { icon: Briefcase, color: "gold", label: "Validade" },
  ticket_reply: { icon: MessageSquare, color: "blue", label: "Chamado" },
  ticket_created: { icon: MessageSquare, color: "purple", label: "Chamado" },
  event_rsvp: { icon: Calendar, color: "gold", label: "Evento" },
  badge_earned: { icon: Trophy, color: "gold", label: "Selo" },
  welcome: { icon: MessageSquare, color: "blue", label: "Boas-vindas" },
  system: { icon: Bell, color: "silver", label: "Sistema" },
};

const typeFilters = [
  { value: "all", label: "Todas" },
  { value: "unread", label: "Não lidas" },
  { value: "opportunity", label: "Oportunidades" },
  { value: "ticket", label: "Chamados" },
  { value: "event_rsvp", label: "Eventos" },
  { value: "system", label: "Sistema" },
];

export default function NotificacoesPage() {
  const { user } = useAuth();
  const [filter, setFilter] = React.useState("all");
  const [notifications, setNotifications] = React.useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMarkingAll, setIsMarkingAll] = React.useState(false);

  const fetchNotifications = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const email = user?.email ? `?email=${encodeURIComponent(user.email)}` : "";
      const res = await fetch(`/api/notifications${email}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      }
    } catch (err) {
      console.warn("Erro ao buscar notificações:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = React.useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const filteredNotifications = React.useMemo(() => {
    return notifications.filter((n) => {
      if (filter === "all") return true;
      if (filter === "unread") return !n.read;
      if (filter === "opportunity") return n.type.startsWith("opportunity");
      if (filter === "ticket") return n.type.startsWith("ticket");
      return n.type === filter;
    });
  }, [notifications, filter]);

  const toggleRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: true }),
      });
    } catch (e) {
      console.warn("Erro ao marcar como lida:", e);
    }
  };

  const markAllRead = async () => {
    if (unreadCount === 0) return;
    setIsMarkingAll(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true, email: user?.email }),
      });
    } catch (e) {
      console.warn("Erro ao marcar todas como lidas:", e);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const formatTime = (iso: string) => {
    if (!iso) return "";
    const date = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            Central de Notificações
          </h1>
          <p className="mt-1 text-silver text-sm">
            Alertas sobre suas oportunidades, aprovações, respostas de chamados e eventos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge variant="gold" className="gap-1.5 font-bold">
              <Bell className="h-3.5 w-3.5" />
              {unreadCount} nova{unreadCount > 1 ? "s" : ""}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={unreadCount === 0 || isMarkingAll}
          >
            {isMarkingAll ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Check className="h-4 w-4 mr-1" />}
            Marcar todas como lidas
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto scrollbar-none">
        {typeFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
              filter === f.value
                ? "bg-gold text-obsidian font-bold shadow-md"
                : "bg-charcoal/60 text-silver hover:bg-charcoal hover:text-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card className="glass">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-silver">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gold mb-3" />
              <p className="text-sm">Carregando notificações...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="h-12 w-12 text-text-secondary mx-auto mb-4 opacity-40" />
              <h3 className="font-display text-lg font-semibold text-white mb-1">
                Nenhuma notificação encontrada
              </h3>
              <p className="text-sm text-text-secondary">
                {filter === "unread"
                  ? "Você está em dia com todos os alertas!"
                  : "Quando houver atualizações na sua conta, elas aparecerão aqui."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredNotifications.map((notif) => {
                const typeConfig =
                  typeIcons[notif.type] || {
                    icon: Bell,
                    color: "silver",
                    label: "Sistema",
                  };
                const TypeIcon = typeConfig.icon;

                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "p-4 hover:bg-charcoal/40 transition-colors flex items-start gap-4",
                      !notif.read && "bg-gold/5 border-l-4 border-gold"
                    )}
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 border",
                        notif.type.includes("approved") && "bg-emerald/15 text-emerald border-emerald/30",
                        notif.type.includes("rejected") && "bg-amber-500/15 text-amber-400 border-amber-500/30",
                        notif.type.includes("ticket") && "bg-blue-500/15 text-blue-400 border-blue-500/30",
                        notif.type.includes("event") && "bg-purple-500/15 text-purple-400 border-purple-500/30",
                        !notif.type.includes("approved") &&
                          !notif.type.includes("rejected") &&
                          !notif.type.includes("ticket") &&
                          !notif.type.includes("event") &&
                          "bg-gold/15 text-gold border-gold/30"
                      )}
                    >
                      <TypeIcon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4
                            className={cn(
                              "text-sm font-medium text-white",
                              !notif.read && "font-bold text-white"
                            )}
                          >
                            {notif.title}
                          </h4>
                          <span className="text-[11px] text-text-secondary">
                            {typeConfig.label}
                          </span>
                        </div>
                        <span className="text-xs text-text-secondary whitespace-nowrap">
                          {formatTime(notif.created_at)}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-silver leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="mt-2.5 flex items-center gap-3">
                        {notif.action_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs font-semibold text-gold hover:text-white px-2 gap-1"
                            onClick={() => {
                              if (!notif.read) toggleRead(notif.id);
                              window.location.href = notif.action_url!;
                            }}
                          >
                            Ver detalhes <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}

                        {!notif.read && (
                          <button
                            onClick={() => toggleRead(notif.id)}
                            className="text-xs text-text-secondary hover:text-white transition-colors flex items-center gap-1"
                            title="Marcar como lida"
                          >
                            <Check className="h-3.5 w-3.5 text-emerald" /> Marcar como lida
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
