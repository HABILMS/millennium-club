"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Search,
  Filter,
  DollarSign,
  MapPin,
  FileText,
  User,
  ShieldCheck,
  Check,
  X,
  Phone,
  Mail,
  Building,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Calendar,
  RotateCcw,
} from "lucide-react";
import {
  OpportunityItem,
  getStoredOpportunities,
  saveStoredOpportunities,
  opportunityCategories,
  fetchAdminOpportunities,
  updateAdminOpportunityStatus,
  renewOpportunity,
} from "@/lib/opportunities";
import { OpportunityDetailModal } from "@/components/opportunities/OpportunityDetailModal";

export default function AdminOportunidadesPage() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);
  const [rejectingOpp, setRejectingOpp] = useState<OpportunityItem | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [approvingOpp, setApprovingOpp] = useState<OpportunityItem | null>(null);
  const [approvalValidityDays, setApprovalValidityDays] = useState<number>(20);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  useEffect(() => {
    // 1. Carrega dados em cache local
    setOpportunities(getStoredOpportunities());

    // 2. Busca todas as oportunidades em tempo real do banco Supabase
    fetchAdminOpportunities().then((data) => {
      if (data && data.length > 0) {
        setOpportunities(data);
      }
    });
  }, []);

  // Estatísticas rápidas
  const pendingCount = useMemo(
    () => opportunities.filter((o) => o.approvalStatus === "pending").length,
    [opportunities]
  );
  const approvedCount = useMemo(
    () => opportunities.filter((o) => o.approvalStatus === "approved").length,
    [opportunities]
  );
  const rejectedCount = useMemo(
    () => opportunities.filter((o) => o.approvalStatus === "rejected").length,
    [opportunities]
  );

  // Ação 1: Abrir Modal de Aprovação com Configuração de Prazo
  const handleOpenApprove = (opp: OpportunityItem) => {
    setApprovingOpp(opp);
    setApprovalValidityDays(Math.max(20, opp.validityDays || 20));
  };

  // Confirmação de Aprovação
  const handleConfirmApprove = async () => {
    if (!approvingOpp) return;
    const days = Math.max(20, Number(approvalValidityDays) || 20);
    const id = approvingOpp.id;
    const now = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const expiresAt = new Date(Date.now() + days * 86400000).toISOString();

    // Atualização otimista
    const updated = opportunities.map((opp) => {
      if (opp.id === id) {
        return {
          ...opp,
          approvalStatus: "approved" as const,
          reviewedAt: now,
          reviewedBy: "Admin Master",
          rejectionReason: undefined,
          validityDays: days,
          expiresAt: expiresAt,
          lastRenewedAt: new Date().toISOString(),
        };
      }
      return opp;
    });

    setOpportunities(updated);
    setApprovingOpp(null);
    showToast(`✓ Oportunidade aprovada e liberada na vitrine pública com ${days} dias de validade!`);
    if (selectedOpp && selectedOpp.id === id) {
      setSelectedOpp(null);
    }

    // Persistência no banco Supabase
    await updateAdminOpportunityStatus(id, "approved", {
      reviewedBy: "Admin Master",
      validityDays: days,
    });
  };

  // Ação Rápida: Renovar Validade (+20 dias)
  const handleRenewByAdmin = async (id: string, days = 20) => {
    const validDays = Math.max(20, days);
    const expiresAt = new Date(Date.now() + validDays * 86400000).toISOString();
    const updated = opportunities.map((opp) => {
      if (opp.id === id) {
        return {
          ...opp,
          approvalStatus: "approved" as const,
          validityDays: validDays,
          expiresAt: expiresAt,
          lastRenewedAt: new Date().toISOString(),
        };
      }
      return opp;
    });
    setOpportunities(updated);
    showToast(`✓ Validade do negócio renovada por mais ${validDays} dias!`);
    await renewOpportunity(id, validDays);
  };

  // Ação 2: Abrir modal para reprovar com justificativa
  const handleOpenReject = (opp: OpportunityItem) => {
    setRejectingOpp(opp);
    setRejectionReasonInput(
      "Ausência de comprovação de mandato exclusivo de originação ou dados insuficientes para due diligence."
    );
  };

  // Confirmação de Reprovação
  const handleConfirmReject = async () => {
    if (!rejectingOpp) return;
    const now = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const targetId = rejectingOpp.id;
    const reason = rejectionReasonInput.trim() || "Reprovado pelo administrador.";

    // Atualização otimista
    const updated = opportunities.map((opp) => {
      if (opp.id === targetId) {
        return {
          ...opp,
          approvalStatus: "rejected" as const,
          reviewedAt: now,
          reviewedBy: "Admin Master",
          rejectionReason: reason,
        };
      }
      return opp;
    });

    setOpportunities(updated);
    setRejectingOpp(null);
    showToast("Oportunidade reprovada e retirada da vitrine pública.");
    if (selectedOpp && selectedOpp.id === targetId) {
      setSelectedOpp(null);
    }

    // Persistência no banco Supabase
    await updateAdminOpportunityStatus(targetId, "rejected", {
      rejectionReason: reason,
      reviewedBy: "Admin Master",
    });
  };

  // Ação 3: Solicitar Documento de Mandato ao Membro
  const handleRequestMandate = async (id: string) => {
    const note = "Pendente: Administrador solicitou contrato formal de mandato com exclusividade assinado pelo proprietário.";

    const updated = opportunities.map((opp) => {
      if (opp.id === id) {
        return {
          ...opp,
          adminNotes: note,
        };
      }
      return opp;
    });

    setOpportunities(updated);
    showToast("Solicitação de mandato e comprovação registrada para o membro.");

    // Persistência no banco Supabase
    await updateAdminOpportunityStatus(id, "pending", {
      adminNotes: note,
      reviewedBy: "Admin Master",
    });
  };

  // Filtragem da lista
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesTab = activeTab === "all" || opp.approvalStatus === activeTab;
      const matchesSearch =
        !searchQuery ||
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opp.author?.name && opp.author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (opp.author?.company && opp.author.company.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTab && matchesSearch;
    });
  }, [opportunities, activeTab, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Toast Flutuante */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-charcoal/95 border border-gold/40 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-text-secondary hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Compliance & Curadoria
            </Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            Moderação & Aprovação de Oportunidades
          </h1>
          <p className="mt-1 text-silver text-sm">
            Checagem de veracidade, mandato exclusivo de originação e liberação de ativos na vitrine pública.
          </p>
        </div>

        <a
          href="/oportunidades"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline font-semibold bg-gold/10 px-3 py-2 rounded-xl border border-gold/30 shrink-0"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Ver Vitrine Pública Aberta
        </a>
      </div>

      {/* Cards de Métricas e KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Pendentes */}
        <Card
          onClick={() => setActiveTab("pending")}
          className={cn(
            "glass cursor-pointer transition-all hover:border-gold/40",
            activeTab === "pending" && "border-gold shadow-lg bg-gold/5"
          )}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary uppercase font-semibold">Aguardando Moderação</p>
              <p className="mt-1 font-display text-2xl font-bold text-amber-400">{pendingCount}</p>
              <p className="text-[11px] text-silver mt-0.5">Exigem checagem de mandato</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Aprovadas */}
        <Card
          onClick={() => setActiveTab("approved")}
          className={cn(
            "glass cursor-pointer transition-all hover:border-emerald/40",
            activeTab === "approved" && "border-emerald shadow-lg bg-emerald/5"
          )}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary uppercase font-semibold">Aprovadas & Publicadas</p>
              <p className="mt-1 font-display text-2xl font-bold text-emerald">{approvedCount}</p>
              <p className="text-[11px] text-silver mt-0.5">Ativas na vitrine pública</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald/15 text-emerald flex items-center justify-center border border-emerald/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Reprovadas */}
        <Card
          onClick={() => setActiveTab("rejected")}
          className={cn(
            "glass cursor-pointer transition-all hover:border-alert/40",
            activeTab === "rejected" && "border-alert shadow-lg bg-alert/5"
          )}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary uppercase font-semibold">Reprovadas / Recusadas</p>
              <p className="mt-1 font-display text-2xl font-bold text-alert">{rejectedCount}</p>
              <p className="text-[11px] text-silver mt-0.5">Sem mandato comprovado</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-alert/15 text-alert flex items-center justify-center border border-alert/30">
              <XCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Geral */}
        <Card
          onClick={() => setActiveTab("all")}
          className={cn(
            "glass cursor-pointer transition-all hover:border-silver/40",
            activeTab === "all" && "border-white shadow-lg bg-white/5"
          )}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary uppercase font-semibold">Total de Negócios</p>
              <p className="mt-1 font-display text-2xl font-bold text-white">{opportunities.length}</p>
              <p className="text-[11px] text-silver mt-0.5">Volume total sob análise</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Abas */}
        <div className="flex items-center gap-1.5 p-1 bg-charcoal/70 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab("pending")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
              activeTab === "pending"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-silver hover:text-white"
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            Pendentes ({pendingCount})
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
              activeTab === "approved"
                ? "bg-emerald/20 text-emerald border border-emerald/40 shadow-sm"
                : "text-silver hover:text-white"
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Aprovadas ({approvedCount})
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
              activeTab === "rejected"
                ? "bg-alert/20 text-alert border border-alert/40 shadow-sm"
                : "text-silver hover:text-white"
            )}
          >
            <XCircle className="h-3.5 w-3.5" />
            Reprovadas ({rejectedCount})
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
              activeTab === "all"
                ? "bg-white/15 text-white border border-white/30 shadow-sm"
                : "text-silver hover:text-white"
            )}
          >
            Todas ({opportunities.length})
          </button>
        </div>

        {/* Busca */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary" />
          <Input
            placeholder="Buscar por título, autor, empresa ou valor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-charcoal border-border"
          />
        </div>
      </div>

      {/* Lista / Tabela de Oportunidades com Ações de Moderação */}
      {filteredOpportunities.length === 0 ? (
        <Card className="glass text-center p-12 space-y-3">
          <div className="h-12 w-12 rounded-full bg-charcoal border border-border flex items-center justify-center text-text-secondary mx-auto">
            <Filter className="h-6 w-6" />
          </div>
          <h3 className="font-display text-base font-semibold text-white">Nenhuma oportunidade nesta categoria</h3>
          <p className="text-xs text-silver max-w-sm mx-auto">
            {activeTab === "pending"
              ? "Excelente! Não há oportunidades pendentes aguardando moderação no momento."
              : "Nenhum registro corresponde aos filtros selecionados."}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOpportunities.map((opp) => (
            <Card
              key={opp.id}
              className={cn(
                "glass transition-all hover:border-gold/30 border-border overflow-hidden",
                opp.approvalStatus === "pending" && "border-amber-500/40 bg-amber-500/5",
                opp.approvalStatus === "rejected" && "border-alert/30 bg-alert/5"
              )}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Informações Principais da Oportunidade */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <img
                      src={opp.imageUrl}
                      alt={opp.title}
                      className="h-20 w-28 sm:h-24 sm:w-36 rounded-xl object-cover shrink-0 border border-border bg-charcoal"
                    />

                    <div className="min-w-0 space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold text-gold bg-gold/15 border border-gold/30 px-2.5 py-0.5 rounded-full">
                          {opp.categoryIcon} {opp.categoryLabel}
                        </span>

                        <span className="text-[11px] font-bold text-white bg-charcoal px-2.5 py-0.5 rounded-full border border-border">
                          {opp.volume}
                        </span>

                        {/* Status de Aprovação */}
                        {opp.approvalStatus === "pending" && (
                          <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                            <Clock className="h-3 w-3" /> Pendente de Aprovação
                          </span>
                        )}
                        {opp.approvalStatus === "approved" && (
                          <span className="text-[11px] font-bold text-emerald bg-emerald/20 border border-emerald/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Aprovada & Pública
                          </span>
                        )}
                        {opp.approvalStatus === "rejected" && (
                          <span className="text-[11px] font-bold text-alert bg-alert/20 border border-alert/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> Reprovada
                          </span>
                        )}

                        {/* Indicador de Validade */}
                        {opp.approvalStatus === "approved" && opp.expiresAt && (() => {
                          const daysLeft = Math.ceil((new Date(opp.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                          const isExpired = daysLeft <= 0;
                          return (
                            <span
                              className={cn(
                                "text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border",
                                isExpired
                                  ? "bg-alert/20 text-alert border-alert/40"
                                  : daysLeft <= 5
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                                  : "bg-gold/15 text-gold border-gold/30"
                              )}
                            >
                              <Calendar className="h-3 w-3" />
                              {isExpired ? "Validade Vencida" : `${daysLeft}d restantes`}
                            </span>
                          );
                        })()}
                      </div>

                      <h3 className="font-display font-bold text-white text-base truncate">
                        {opp.title}
                      </h3>

                      <p className="text-xs text-silver line-clamp-2 leading-relaxed">
                        {opp.summary}
                      </p>

                      {/* Mandato e Compliance */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                        <span className="text-emerald flex items-center gap-1 font-semibold">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Mandatário Direto Declarado
                        </span>

                        {opp.documentPdfName && (
                          <span className="text-silver flex items-center gap-1 bg-obsidian/70 border border-border px-2 py-0.5 rounded-md">
                            <FileText className="h-3 w-3 text-gold" />
                            {opp.documentPdfName} ({opp.documentPdfSize || "Documento Anexo"})
                          </span>
                        )}

                        <span className="text-text-secondary flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {opp.location}
                        </span>
                      </div>

                      {/* Justificativa caso reprovada */}
                      {opp.approvalStatus === "rejected" && opp.rejectionReason && (
                        <div className="p-2 bg-alert/15 border border-alert/30 rounded-lg text-xs text-alert flex items-start gap-1.5 mt-2">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span>
                            <strong>Motivo da Reprovação:</strong> {opp.rejectionReason}
                          </span>
                        </div>
                      )}

                      {/* Nota administrativa caso haja */}
                      {opp.adminNotes && (
                        <div className="p-2 bg-gold/15 border border-gold/30 rounded-lg text-xs text-gold flex items-start gap-1.5 mt-1">
                          <Clock className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span>{opp.adminNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informações do Autor & Ações Administrativas */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-border">
                    {/* Autor */}
                    <div className="text-left lg:text-right space-y-0.5">
                      <div className="flex items-center lg:justify-end gap-1.5">
                        <User className="h-3.5 w-3.5 text-gold" />
                        <span className="text-xs font-bold text-white">{opp.author?.name}</span>
                      </div>
                      <p className="text-[11px] text-silver">
                        {opp.author?.jobTitle} • {opp.author?.company}
                      </p>
                      {opp.author?.whatsapp && (
                        <p className="text-[11px] text-gold font-mono flex items-center lg:justify-end gap-1">
                          <Phone className="h-2.5 w-2.5" /> {opp.author.whatsapp}
                        </p>
                      )}
                    </div>

                    {/* Botões de Ação 1-Clique */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOpp(opp)}
                        className="h-8 text-xs gap-1 border-border text-silver hover:text-white"
                      >
                        <Eye className="h-3.5 w-3.5" /> Analisar
                      </Button>

                      {opp.approvalStatus !== "approved" && (
                        <Button
                          variant="gold"
                          size="sm"
                          onClick={() => handleOpenApprove(opp)}
                          className="h-8 text-xs font-bold gap-1 bg-emerald hover:bg-emerald/90 text-white border-none"
                        >
                          <Check className="h-3.5 w-3.5" /> Aprovar & Liberar
                        </Button>
                      )}

                      {opp.approvalStatus === "approved" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRenewByAdmin(opp.id, 20)}
                          className="h-8 text-xs font-semibold gap-1 border-gold/40 text-gold hover:bg-gold/10"
                          title="Estender validade por +20 dias"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> +20 Dias
                        </Button>
                      )}

                      {opp.approvalStatus !== "rejected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenReject(opp)}
                          className="h-8 text-xs gap-1 border-alert/40 text-alert hover:bg-alert/10"
                        >
                          <X className="h-3.5 w-3.5" /> Reprovar
                        </Button>
                      )}

                      {opp.approvalStatus === "pending" && !opp.adminNotes && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRequestMandate(opp.id)}
                          className="h-8 text-xs gap-1 border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
                        >
                          <FileText className="h-3.5 w-3.5" /> Pedir Mandato
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Reprovação com Justificativa */}
      {rejectingOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/85 backdrop-blur-md animate-fade-in">
          <div className="glass rounded-2xl w-full max-w-lg border border-alert/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 text-alert">
                <XCircle className="h-5 w-5" />
                <h3 className="font-display font-bold text-white text-lg">Reprovar Oportunidade</h3>
              </div>
              <button
                onClick={() => setRejectingOpp(null)}
                className="p-1 text-text-secondary hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-silver">
                Você está reprovando o negócio <strong>"{rejectingOpp.title}"</strong> de <strong>{rejectingOpp.author?.name}</strong>.
              </p>
              <p className="text-xs text-silver mt-1">
                Essa oportunidade será removida imediatamente da vitrine pública.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-silver uppercase">
                Motivo da Reprovação (visível para o autor):
              </label>
              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="Ex: Ausência de contrato de mandato com exclusividade assinado, dados inconclusivos..."
                className="w-full bg-charcoal border border-border text-white rounded-xl p-3 text-xs focus:border-gold focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setRejectingOpp(null)}>
                Cancelar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfirmReject}
                className="bg-alert/20 border-alert text-alert hover:bg-alert/30 font-bold"
              >
                Confirmar Reprovação
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Aprovação com Configuração de Prazo (Mínimo 20 dias) */}
      {approvingOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/85 backdrop-blur-md animate-fade-in">
          <div className="glass rounded-2xl w-full max-w-lg border border-emerald/50 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 text-emerald">
                <CheckCircle2 className="h-5 w-5" />
                <h3 className="font-display font-bold text-white text-lg">Aprovar & Liberar Oportunidade</h3>
              </div>
              <button
                onClick={() => setApprovingOpp(null)}
                className="p-1 text-text-secondary hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">
                {approvingOpp.title}
              </p>
              <p className="text-xs text-silver">
                Autor: <strong className="text-white">{approvingOpp.author?.name}</strong> • Volume: <strong className="text-gold">{approvingOpp.volume}</strong>
              </p>
              <p className="text-xs text-silver">
                Ao aprovar, esta oportunidade terá o mandato auditado e será publicada na vitrine pública com proteção de confidencialidade (Teaser Cego & NDA intermediado).
              </p>
            </div>

            {/* Configuração de Prazo de Validade (Mínimo 20 dias) */}
            <div className="space-y-2 bg-charcoal/50 p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase tracking-wider">
                  Prazo de Validade na Vitrine
                </label>
                <span className="text-gold text-[11px] font-semibold bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
                  Mínimo obrigatório: 20 dias
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={20}
                  value={approvalValidityDays}
                  onChange={(e) => setApprovalValidityDays(Math.max(20, parseInt(e.target.value) || 20))}
                  className="h-10 text-sm font-bold bg-charcoal border-border text-white w-28 text-center"
                />
                <span className="text-xs text-silver">dias corridos até expiração automática</span>
              </div>

              {/* Botões Rápidos de Prazo */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[20, 30, 45, 60, 90].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setApprovalValidityDays(d)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all",
                      approvalValidityDays === d
                        ? "bg-emerald text-white border-emerald shadow"
                        : "bg-charcoal text-silver border-border hover:text-white hover:border-gold/30"
                    )}
                  >
                    {d} dias {d === 20 && "(Mínimo)"}
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-text-secondary pt-1">
                Após este período, a oportunidade expira automaticamente da vitrine até que o proprietário faça a renovação de disponibilidade em 1-clique.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setApprovingOpp(null)}>
                Cancelar
              </Button>
              <Button
                variant="gold"
                size="sm"
                onClick={handleConfirmApprove}
                className="bg-emerald hover:bg-emerald/90 text-white font-bold gap-1.5"
              >
                <Check className="h-4 w-4" /> Confirmar Aprovação ({approvalValidityDays} dias)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Análise Completa da Oportunidade */}
      {selectedOpp && (
        <OpportunityDetailModal
          opportunity={selectedOpp}
          onClose={() => setSelectedOpp(null)}
          onAddQuestion={() => {}}
          isMemberLoggedIn={true}
        />
      )}
    </div>
  );
}
