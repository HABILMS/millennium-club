/**
 * Tipos e formatadores do dashboard administrativo.
 * Este módulo é isomórfico (usado no servidor e no cliente), por isso não
 * importa nada de `next/headers`.
 */

export interface RecentActivity {
  title: string;
  description: string;
  at: string;
}

export interface DashboardKpis {
  candidatos_aguardando: number;
  entrevistas_agendadas: number;
  aprovados_mes: number;
  membros_ativos: number;
  membros_pagantes: number;
  meta_membros: number;
  oportunidades_ativas: number;
  volume_solicitado: number;
  volume_negociacao: number;
  receita_assinaturas_cents: number;
  remuneracoes_previstas: number;
  remuneracoes_a_pagar: number;
  docs_pendentes_atrasados: number;
  renovacoes_em_7_dias: number;
  remuneracoes_paradas: number;
  atividade_recente: RecentActivity[];
}

export const META_MEMBROS_PADRAO = 500;

export const EMPTY_KPIS: DashboardKpis = {
  candidatos_aguardando: 0,
  entrevistas_agendadas: 0,
  aprovados_mes: 0,
  membros_ativos: 0,
  membros_pagantes: 0,
  meta_membros: META_MEMBROS_PADRAO,
  oportunidades_ativas: 0,
  volume_solicitado: 0,
  volume_negociacao: 0,
  receita_assinaturas_cents: 0,
  remuneracoes_previstas: 0,
  remuneracoes_a_pagar: 0,
  docs_pendentes_atrasados: 0,
  renovacoes_em_7_dias: 0,
  remuneracoes_paradas: 0,
  atividade_recente: [],
};

/** O PostgREST devolve `numeric` como número ou string; normaliza sempre. */
export function toNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

/** Preenche valores ausentes/ inválidos com os padrões, mantendo a UI estável. */
export function normalizeKpis(raw: unknown): DashboardKpis {
  if (!raw || typeof raw !== "object") return EMPTY_KPIS;
  const source = raw as Record<string, unknown>;
  const numbers = Object.keys(EMPTY_KPIS).filter(
    (key) => key !== "atividade_recente"
  ) as (keyof Omit<DashboardKpis, "atividade_recente">)[];

  const result = { ...EMPTY_KPIS };
  for (const key of numbers) {
    if (key in source) result[key] = toNumber(source[key]);
  }
  if (!result.meta_membros) result.meta_membros = META_MEMBROS_PADRAO;

  const activity = source.atividade_recente;
  if (Array.isArray(activity)) {
    result.atividade_recente = activity.map((item) => {
      const entry = (item ?? {}) as Record<string, unknown>;
      return {
        title: String(entry.title ?? ""),
        description: String(entry.description ?? ""),
        at: String(entry.at ?? ""),
      };
    });
  }

  return result;
}

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const currencyCompact = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

const intFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

export function formatInt(value: number): string {
  return intFormatter.format(value);
}

export function formatBRL(value: number): string {
  return currency.format(value);
}

/** Valores grandes viram "R$ 2,4 bi" para caber no card. */
export function formatBRLCompact(value: number): string {
  return Math.abs(value) >= 100_000 ? currencyCompact.format(value) : currency.format(value);
}

export function formatCents(cents: number): string {
  return currency.format(cents / 100);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes} min atrás`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d atrás`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
