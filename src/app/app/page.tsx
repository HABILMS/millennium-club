"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Users,
  Briefcase,
  Calendar,
  Clock,
  AlertTriangle,
  TrendingUp,
  Target,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Conexões ativas", value: "12", icon: Users, color: "gold", change: "+3 este mês" },
  { label: "Oportunidades compatíveis", value: "8", icon: Briefcase, color: "emerald", change: "5 novas" },
  { label: "Eventos confirmados", value: "3", icon: Calendar, color: "silver", change: "Próximo: 20/09" },
  { label: "Pendências", value: "2", icon: AlertTriangle, color: "alert", change: "Perfil 85% completo" },
];

const activities = [
  { type: "connection", title: "Nova conexão estabelecida", description: "Maria Santos (Investidora - FinTech)", time: "2h atrás", icon: Users, color: "gold" },
  { type: "opportunity", title: "Oportunidade compatível encontrada", description: "Expansão Agrotech Sul - R$ 25M", time: "5h atrás", icon: Briefcase, color: "emerald" },
  { type: "event", title: "Inscrição confirmada", description: "Rodada de Investimento - Série A", time: "1 dia atrás", icon: Calendar, color: "silver" },
  { type: "badge", title: "Selo conquistado", description: "Perfil Verificado - 100% completo", time: "3 dias atrás", icon: CheckCircle, color: "gold" },
  { type: "message", title: "Nova mensagem", description: "Carlos Oliveira solicitou introdução", time: "4 dias atrás", icon: Mail, color: "silver" },
];

import { Mail } from "lucide-react";

const nextActions = [
  { label: "Completar perfil da empresa", href: "/app/empresa", icon: Building2, priority: "high" },
  { label: "Responder solicitação de introdução", href: "/app/conexoes", icon: Mail, priority: "high" },
  { label: "Confirmar presença no evento", href: "/app/eventos", icon: Calendar, priority: "medium" },
  { label: "Revisar oportunidade Agrotech", href: "/app/oportunidades", icon: Briefcase, priority: "medium" },
];

import { Building2 } from "lucide-react";

export default function DashboardPage() {
  return (
      <div className="space-y-6 animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">
              Bem-vindo de volta, <span className="text-gold">João</span>
            </h1>
            <p className="mt-1 text-silver">Aqui está o que está acontecendo na sua rede hoje</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.href = "/app/oportunidades"}>
              Ver oportunidades
            </Button>
            <Button variant="gold" onClick={() => window.location.href = "/app/perfil"}>
              Completar perfil <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="glass hover:border-gold/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">{stat.label}</p>
                    <p className="mt-1 font-display text-3xl font-bold text-white">{stat.value}</p>
                    <p className="mt-2 text-xs text-text-secondary">{stat.change}</p>
                  </div>
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", `bg-${stat.color}/10 text-${stat.color}`)}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 glass">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center justify-between">
                Atividade recente
                <Link href="/app/notificacoes" className="text-sm text-gold hover:underline">Ver todas</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 hover:bg-charcoal/30 transition-colors"
                  >
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0", `bg-${activity.color}/10 text-${activity.color}`)}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white">{activity.title}</p>
                      <p className="text-sm text-text-secondary">{activity.description}</p>
                    </div>
                    <span className="text-xs text-text-secondary whitespace-nowrap">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center justify-between">
                Próximas ações
                <Target className="h-5 w-5 text-gold" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-0 pt-4">
              {nextActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl transition-all group",
                    action.priority === "high"
                      ? "bg-alert/5 border border-alert/20 hover:bg-alert/10"
                      : "hover:bg-charcoal/30"
                  )}
                >
                  <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0", action.priority === "high" ? "bg-alert/10 text-alert" : "bg-charcoal text-text-secondary")}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white truncate">{action.label}</p>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", action.priority === "high" ? "bg-alert/20 text-alert" : "bg-charcoal text-text-secondary")}>
                      {action.priority === "high" ? "Prioridade" : "Opcional"}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-text-secondary group-hover:text-gold transition-colors" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="glass border-gold/30 bg-gold/5">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">Perfil 85% completo</h3>
                  <p className="text-sm text-text-secondary">Adicione sua empresa e interesses para desbloquear matchmaking prioritário</p>
                </div>
              </div>
              <Button variant="gold" size="lg" onClick={() => window.location.href = "/app/perfil"}>
                Completar agora <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}