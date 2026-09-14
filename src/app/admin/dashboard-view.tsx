"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Users,
  UserCheck,
  CreditCard,
  TrendingUp,
  Target,
  AlertTriangle,
  Clock,
  CheckCircle,
  DollarSign,
  ArrowUpRight,
  FileText,
  Building2,
  Award,
  Info,
} from "lucide-react";
import {
  formatBRLCompact,
  formatCents,
  formatInt,
  formatPercent,
  relativeTime,
  type DashboardKpis,
} from "@/lib/dashboard";

type Accent = "gold" | "emerald" | "silver" | "alert";

const accentClass: Record<Accent, string> = {
  gold: "bg-gold/10 text-gold",
  emerald: "bg-emerald/10 text-emerald",
  silver: "bg-silver/10 text-silver",
  alert: "bg-alert/10 text-alert",
};

interface AlertItem {
  type: "warning" | "info" | "success" | "alert";
  title: string;
  action: string;
  href: string;
}

interface AdminDashboardViewProps {
  kpis: DashboardKpis;
  error: string | null;
}

export function AdminDashboardView({ kpis, error }: AdminDashboardViewProps) {
  const {
    candidatos_aguardando,
    entrevistas_agendadas,
    aprovados_mes,
    membros_ativos,
    membros_pagantes,
    meta_membros,
    oportunidades_ativas,
    volume_solicitado,
    volume_negociacao,
    receita_assinaturas_cents,
    remuneracoes_previstas,
    remuneracoes_a_pagar,
    docs_pendentes_atrasados,
    renovacoes_em_7_dias,
    remuneracoes_paradas,
    atividade_recente,
  } = kpis;

  const metaPct = meta_membros > 0 ? (membros_ativos / meta_membros) * 100 : 0;
  const metaRestante = Math.max(meta_membros - membros_ativos, 0);
  const conversao = membros_ativos > 0 ? (membros_pagantes / membros_ativos) * 100 : 0;

  const cards: {
    label: string;
    value: string;
    icon: typeof Users;
    accent: Accent;
    change: string;
    href: string;
  }[] = [
    {
      label: "Candidatos aguardando",
      value: formatInt(candidatos_aguardando),
      icon: FileText,
      accent: "gold",
      change:
        docs_pendentes_atrasados > 0
          ? `${formatInt(docs_pendentes_atrasados)} com docs pendentes`
          : "Sem pendência de documentação",
      href: "/admin/candidaturas",
    },
    {
      label: "Entrevistas agendadas",
      value: formatInt(entrevistas_agendadas),
      icon: Clock,
      accent: "silver",
      change: entrevistas_agendadas > 0 ? "A partir de hoje" : "Nenhuma agendada",
      href: "/admin/candidaturas",
    },
    {
      label: "Aprovados este mês",
      value: formatInt(aprovados_mes),
      icon: UserCheck,
      accent: "emerald",
      change: "Desde o início do mês",
      href: "/admin/membros",
    },
    {
      label: "Membros ativos",
      value: formatInt(membros_ativos),
      icon: Users,
      accent: "gold",
      change: `Meta: ${formatInt(meta_membros)}`,
      href: "/admin/membros",
    },
    {
      label: "Membros pagantes",
      value: formatInt(membros_pagantes),
      icon: CreditCard,
      accent: "emerald",
      change: `${formatPercent(conversao)} conversão`,
      href: "/admin/membros",
    },
    {
      label: `Meta ${formatInt(meta_membros)} membros`,
      value: formatPercent(metaPct),
      icon: Target,
      accent: "gold",
      change: `${formatInt(metaRestante)} restantes`,
      href: "/admin/membros",
    },
    {
      label: "Oportunidades ativas",
      value: formatInt(oportunidades_ativas),
      icon: Building2,
      accent: "silver",
      change: "Abertas + em negociação",
      href: "/admin/oportunidades",
    },
    {
      label: "Volume solicitado",
      value: formatBRLCompact(volume_solicitado),
      icon: DollarSign,
      accent: "emerald",
      change: `${formatBRLCompact(volume_negociacao)} em negociação`,
      href: "/admin/oportunidades",
    },
    {
      label: "Receita assinaturas",
      value: `${formatCents(receita_assinaturas_cents)}/mês`,
      icon: CreditCard,
      accent: "gold",
      change: `${formatInt(membros_pagantes)} assinaturas ativas`,
      href: "/admin/assinaturas",
    },
    {
      label: "Remunerações previstas",
      value: formatBRLCompact(remuneracoes_previstas),
      icon: TrendingUp,
      accent: "silver",
      change: `${formatBRLCompact(remuneracoes_a_pagar)} a pagar`,
      href: "/admin/remuneracoes",
    },
  ];

  const alerts: AlertItem[] = [];
  if (docs_pendentes_atrasados > 0) {
    alerts.push({
      type: "warning",
      title: `${formatInt(docs_pendentes_atrasados)} candidaturas com documentação pendente há mais de 7 dias`,
      action: "Ver candidaturas",
      href: "/admin/candidaturas?filter=docs_pending",
    });
  }
  if (renovacoes_em_7_dias > 0) {
    alerts.push({
      type: "info",
      title: `${formatInt(renovacoes_em_7_dias)} assinaturas vencendo nos próximos 7 dias`,
      action: "Ver assinaturas",
      href: "/admin/assinaturas?filter=expiring",
    });
  }
  if (remuneracoes_paradas > 0) {
    alerts.push({
      type: "alert",
      title: `${formatInt(remuneracoes_paradas)} remunerações aguardando aprovação há mais de 10 dias`,
      action: "Aprovar agora",
      href: "/admin/remuneracoes?filter=pending_approval",
    });
  }
  if (meta_membros > 0 && membros_ativos >= meta_membros) {
    alerts.push({
      type: "success",
      title: `Meta de ${formatInt(meta_membros)} membros ativos atingida!`,
      action: "Ver relatório",
      href: "/admin/membros",
    });
  }
  if (alerts.length === 0) {
    alerts.push({
      type: "success",
      title: "Nenhuma pendência no momento",
      action: "Ver candidaturas",
      href: "/admin/candidaturas",
    });
  }

  const activityIcon = (title: string) => {
    const normalized = title.toLowerCase();
    if (normalized.includes("aprov") || normalized.includes("convert")) return CheckCircle;
    if (normalized.includes("entrevista")) return Clock;
    if (normalized.includes("selo") || normalized.includes("badge")) return Award;
    if (normalized.includes("assinatura")) return CreditCard;
    return FileText;
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            Dashboard Administrativo
          </h1>
          <p className="mt-1 text-silver">Visão geral dos KPIs e atividades da plataforma</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/candidaturas">
            <Button variant="outline">Ver candidaturas</Button>
          </Link>
          <Link href="/admin/membros">
            <Button variant="gold">Gerenciar membros</Button>
          </Link>
        </div>
      </div>

      {error && (
        <Card className="border-alert/40 bg-alert/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-alert flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-white">Não foi possível carregar os KPIs</p>
              <p className="text-sm text-silver">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((kpi) => (
          <Card key={kpi.label} className="glass hover:border-gold/30 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary">{kpi.label}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-white">{kpi.value}</p>
                  <p className="mt-2 text-xs text-text-secondary">{kpi.change}</p>
                </div>
                <div
                  className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center",
                    accentClass[kpi.accent]
                  )}
                >
                  <kpi.icon className="h-6 w-6" />
                </div>
              </div>
              <Link
                href={kpi.href}
                className="mt-4 flex items-center gap-1 text-sm text-gold hover:underline"
              >
                Ver detalhes <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass">
          <CardHeader className="border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle>Alertas e pendências</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-0">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 border-b border-border last:border-0 flex items-center justify-between gap-4",
                  alert.type === "alert" && "bg-alert/5 border-l-4 border-alert",
                  alert.type === "warning" && "bg-gold/5 border-l-4 border-gold",
                  alert.type === "success" && "bg-emerald/5 border-l-4 border-emerald"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      alert.type === "alert"
                        ? "bg-alert/10 text-alert"
                        : alert.type === "warning"
                          ? "bg-gold/10 text-gold"
                          : alert.type === "success"
                            ? "bg-emerald/10 text-emerald"
                            : "bg-silver/10 text-silver"
                    )}
                  >
                    {alert.type === "alert" || alert.type === "warning" ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : alert.type === "success" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Info className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{alert.title}</p>
                  </div>
                </div>
                <Link href={alert.href} className="flex-shrink-0">
                  <Button variant="ghost" size="sm">
                    {alert.action}
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle>Atividade recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-0">
            {atividade_recente.length === 0 ? (
              <div className="p-6 text-sm text-text-secondary">
                Nenhuma atividade registrada ainda.
              </div>
            ) : (
              atividade_recente.map((activity, index) => {
                const Icon = activityIcon(activity.title);
                return (
                  <div
                    key={index}
                    className="p-4 border-b border-border last:border-0 hover:bg-charcoal/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gold/10 text-gold">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white">{activity.title}</p>
                        <p className="text-sm text-text-secondary">{activity.description}</p>
                      </div>
                      <span className="text-xs text-text-secondary whitespace-nowrap">
                        {relativeTime(activity.at)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-gold/30 bg-gold/5">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-white">
                  Progresso da meta estratégica
                </h3>
                <p className="text-sm text-text-secondary">
                  R$ 2 bilhões em transações facilitadas em 3 anos • {formatInt(meta_membros)} membros
                  qualificados
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block w-48 h-3 bg-charcoal rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all"
                  style={{ width: `${Math.min(metaPct, 100)}%` }}
                />
              </div>
              <span className="font-display text-xl font-bold text-gold">
                {formatPercent(metaPct)}
              </span>
              <Link href="/admin/membros">
                <Button variant="gold" size="sm">
                  Ver plano de ação
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
