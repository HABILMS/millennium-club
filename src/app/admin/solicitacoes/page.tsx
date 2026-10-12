"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  User,
  Globe,
  Mail,
  Send,
  X,
  ShieldCheck,
  Check,
  ChevronRight,
  Loader2,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { TicketItem, TicketMessage } from "@/app/app/solicitacoes/page";

export default function AdminSolicitacoesPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "open" | "in_progress" | "resolved">("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTicket, setActiveTicket] = useState<TicketItem | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  useEffect(() => {
    fetchAdminTickets();
  }, []);

  const fetchAdminTickets = async () => {
    try {
      const res = await fetch("/api/admin/tickets");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.tickets) && data.tickets.length > 0) {
          setTickets(data.tickets);
          return;
        }
      }
    } catch (e) {
      console.warn("Erro ao buscar tickets no admin:", e);
    }

    // Fallback de demonstração caso o banco ainda não tenha registros
    setTickets([
      {
        id: "tck-demo-1",
        ticket_number: "TCK-2026-0041",
        author_name: "Patricia Mendes",
        author_email: "patricia@solarinvest.com.br",
        author_whatsapp: "(31) 97777-6666",
        category: "digital_kit",
        category_label: "Kit Presença Digital",
        subject: "Solicitação de registro de domínio joaosolar.com.br e 5 e-mails",
        description: "Gostaria de registrar o domínio joaosolar.com.br incluído no meu plano e criar as caixas contato@ e diretoria@.",
        priority: "high",
        status: "open",
        domain_requested: "joaosolar.com.br",
        emails_requested: ["contato@joaosolar.com.br", "diretoria@joaosolar.com.br"],
        landing_page_requested: true,
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: "tck-demo-2",
        ticket_number: "TCK-2026-0038",
        author_name: "Fernando Castilho",
        author_email: "fernando@castilho.com.br",
        author_whatsapp: "(11) 98555-7788",
        category: "deals_ma",
        category_label: "Mesa de Deals / M&A",
        subject: "Apoio de Due Diligence para ativo de Usina Solar",
        description: "Tenho um comprador qualificado para o parque solar e solicito termo de NDA com não-circunvenção intermediado.",
        priority: "urgent",
        status: "in_progress",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ]);
  };

  // KPIs
  const openCount = useMemo(() => tickets.filter((t) => t.status === "open").length, [tickets]);
  const inProgressCount = useMemo(() => tickets.filter((t) => t.status === "in_progress").length, [tickets]);
  const resolvedCount = useMemo(() => tickets.filter((t) => t.status === "resolved").length, [tickets]);

  // Abertura do ticket para atendimento
  const handleOpenTicket = async (t: TicketItem) => {
    setActiveTicket(t);
    setAdminNotesInput(t.admin_resolution_notes || "");
    setIsLoadingMessages(true);

    try {
      const res = await fetch(`/api/tickets/${t.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setTicketMessages(data.messages);
          setIsLoadingMessages(false);
          return;
        }
      }
    } catch (e) {}

    // Fallback de mensagens
    setTicketMessages([
      {
        id: "msg-1",
        ticket_id: t.id,
        sender_type: "member",
        sender_name: t.author_name,
        content: t.description,
        created_at: t.created_at,
      },
    ]);
    setIsLoadingMessages(false);
  };

  // Enviar resposta do admin
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !activeTicket) return;

    setIsSendingReply(true);

    const newMsg: TicketMessage = {
      id: `msg-${Date.now()}`,
      ticket_id: activeTicket.id,
      sender_type: "admin",
      sender_name: "Administrador Master",
      content: adminReplyText.trim(),
      created_at: new Date().toISOString(),
    };

    setTicketMessages((prev) => [...prev, newMsg]);
    setAdminReplyText("");

    try {
      await fetch(`/api/tickets/${activeTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderType: "admin",
          senderName: "Administrador Master",
          content: newMsg.content,
          newStatus: "waiting_user",
        }),
      });

      // Atualiza estado local
      setTickets((prev) =>
        prev.map((t) => (t.id === activeTicket.id ? { ...t, status: "waiting_user" } : t))
      );
      showToast("Resposta enviada com sucesso ao membro!");
    } catch (e) {
      console.warn("Erro ao responder ticket:", e);
    } finally {
      setIsSendingReply(false);
    }
  };

  // Atualizar status do ticket (ex: Resolver, Em Atendimento)
  const handleUpdateStatus = async (ticketId: string, newStatus: TicketItem["status"]) => {
    try {
      await fetch("/api/admin/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ticketId,
          status: newStatus,
          adminResolutionNotes: adminNotesInput.trim() || undefined,
        }),
      });

      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                status: newStatus,
                admin_resolution_notes: adminNotesInput.trim() || t.admin_resolution_notes,
              }
            : t
        )
      );

      if (activeTicket && activeTicket.id === ticketId) {
        setActiveTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      showToast(`Status do chamado atualizado para "${newStatus === "resolved" ? "Resolvido" : newStatus}"!`);
    } catch (e) {
      console.warn("Erro ao atualizar status:", e);
    }
  };

  // Filtragem da tabela
  const filteredTickets = tickets.filter((t) => {
    const matchesTab = activeTab === "all" || t.status === activeTab;
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      t.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.domain_requested && t.domain_requested.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesCategory && matchesSearch;
  });

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

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Mesa de Atendimento & Suporte
            </Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            Gestão de Chamados & Solicitações
          </h1>
          <p className="mt-1 text-silver text-sm">
            Atendimento aos membros, provisionamento do Kit Presença Digital (domínios e e-mails) e suporte a deals.
          </p>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card
          onClick={() => setActiveTab("open")}
          className={cn(
            "glass cursor-pointer transition-all hover:border-amber-500/40",
            activeTab === "open" && "border-amber-500 shadow-lg bg-amber-500/5"
          )}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary uppercase font-semibold">Abertos / Pendentes</p>
              <p className="mt-1 font-display text-2xl font-bold text-amber-400">{openCount}</p>
              <p className="text-[11px] text-silver mt-0.5">Aguardando atendimento</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setActiveTab("in_progress")}
          className={cn(
            "glass cursor-pointer transition-all hover:border-blue-500/40",
            activeTab === "in_progress" && "border-blue-500 shadow-lg bg-blue-500/5"
          )}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary uppercase font-semibold">Em Atendimento</p>
              <p className="mt-1 font-display text-2xl font-bold text-blue-400">{inProgressCount}</p>
              <p className="text-[11px] text-silver mt-0.5">Em análise técnica</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setActiveTab("resolved")}
          className={cn(
            "glass cursor-pointer transition-all hover:border-emerald/40",
            activeTab === "resolved" && "border-emerald shadow-lg bg-emerald/5"
          )}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary uppercase font-semibold">Resolvidos</p>
              <p className="mt-1 font-display text-2xl font-bold text-emerald">{resolvedCount}</p>
              <p className="text-[11px] text-silver mt-0.5">Concluídos com sucesso</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald/15 text-emerald flex items-center justify-center border border-emerald/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setActiveTab("all")}
          className={cn(
            "glass cursor-pointer transition-all hover:border-white/40",
            activeTab === "all" && "border-white shadow-lg bg-white/5"
          )}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary uppercase font-semibold">Total de Chamados</p>
              <p className="mt-1 font-display text-2xl font-bold text-white">{tickets.length}</p>
              <p className="text-[11px] text-silver mt-0.5">Histórico completo</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
              <MessageSquare className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Abas */}
          <div className="flex items-center gap-1 p-1 bg-charcoal/70 rounded-xl border border-border">
            <button
              onClick={() => setActiveTab("open")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeTab === "open" ? "bg-amber-500/20 text-amber-300" : "text-silver hover:text-white"
              )}
            >
              Abertos ({openCount})
            </button>
            <button
              onClick={() => setActiveTab("in_progress")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeTab === "in_progress" ? "bg-blue-500/20 text-blue-300" : "text-silver hover:text-white"
              )}
            >
              Em Atendimento ({inProgressCount})
            </button>
            <button
              onClick={() => setActiveTab("resolved")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeTab === "resolved" ? "bg-emerald/20 text-emerald" : "text-silver hover:text-white"
              )}
            >
              Resolvidos ({resolvedCount})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeTab === "all" ? "bg-white/15 text-white" : "text-silver hover:text-white"
              )}
            >
              Todos ({tickets.length})
            </button>
          </div>

          {/* Filtro de Categoria */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-charcoal border border-border text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-gold"
          >
            <option value="all">Todas as Categorias</option>
            <option value="digital_kit">Kit Presença Digital</option>
            <option value="deals_ma">Mesa de Deals / M&A</option>
            <option value="compliance">Compliance</option>
            <option value="billing">Faturamento</option>
            <option value="support">Suporte Geral</option>
          </select>
        </div>

        {/* Busca */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary" />
          <Input
            placeholder="Buscar por protocolo, membro, domínio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-charcoal border-border"
          />
        </div>
      </div>

      {/* Lista de Chamados */}
      {filteredTickets.length === 0 ? (
        <Card className="glass text-center p-12 space-y-3">
          <div className="h-12 w-12 rounded-full bg-charcoal border border-border flex items-center justify-center text-text-secondary mx-auto">
            <Filter className="h-6 w-6" />
          </div>
          <h3 className="font-display text-base font-semibold text-white">Nenhum chamado nesta seção</h3>
          <p className="text-xs text-silver max-w-sm mx-auto">
            Não há solicitações correspondentes aos filtros selecionados no momento.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((t) => (
            <Card
              key={t.id}
              className={cn(
                "glass transition-all hover:border-gold/30 border-border cursor-pointer",
                t.status === "open" && "border-amber-500/40 bg-amber-500/5",
                t.category === "digital_kit" && "border-purple-500/30"
              )}
              onClick={() => handleOpenTicket(t)}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gold bg-gold/10 border border-gold/30 px-2 py-0.5 rounded">
                        {t.ticket_number}
                      </span>
                      <span className="text-xs text-silver bg-charcoal px-2.5 py-0.5 rounded border border-border">
                        {t.category_label}
                      </span>
                      {t.status === "open" && (
                        <span className="text-xs text-amber-300 font-bold bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Aberto
                        </span>
                      )}
                      {t.status === "in_progress" && (
                        <span className="text-xs text-blue-300 font-bold bg-blue-500/20 border border-blue-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" /> Em Atendimento
                        </span>
                      )}
                      {t.status === "resolved" && (
                        <span className="text-xs text-emerald font-bold bg-emerald/20 border border-emerald/40 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Resolvido
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-white text-base truncate">
                      {t.subject}
                    </h3>

                    <p className="text-xs text-silver line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>

                    {/* Dados Especiais do Kit Digital */}
                    {t.domain_requested && (
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                        <span className="text-purple-300 flex items-center gap-1 bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 rounded">
                          <Globe className="h-3 w-3" /> Domínio: {t.domain_requested}
                        </span>
                        {t.landing_page_requested && (
                          <span className="text-emerald flex items-center gap-1 font-semibold">
                            <Check className="h-3 w-3" /> Landing Page Solicitada
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Informações do Membro e Ações */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-border">
                    <div className="text-left lg:text-right space-y-0.5">
                      <div className="flex items-center lg:justify-end gap-1.5">
                        <User className="h-3.5 w-3.5 text-gold" />
                        <span className="text-xs font-bold text-white">{t.author_name}</span>
                      </div>
                      <p className="text-[11px] text-silver">{t.author_email}</p>
                      {t.author_whatsapp && (
                        <p className="text-[11px] text-gold font-mono">{t.author_whatsapp}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenTicket(t);
                        }}
                        className="h-8 text-xs font-bold gap-1"
                      >
                        Atender Chamado <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal / Drawer de Atendimento do Admin */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="glass rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto border border-gold/40 shadow-2xl p-5 sm:p-7 space-y-5 flex flex-col">
            {/* Topo */}
            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gold bg-gold/15 border border-gold/30 px-2 py-0.5 rounded">
                    {activeTicket.ticket_number}
                  </span>
                  <span className="text-xs text-white bg-charcoal px-2 py-0.5 rounded border border-border">
                    {activeTicket.category_label}
                  </span>
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-white/5 border border-border">
                    Status: {activeTicket.status}
                  </span>
                </div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                  {activeTicket.subject}
                </h2>
                <p className="text-xs text-silver">
                  Solicitante: <strong>{activeTicket.author_name}</strong> ({activeTicket.author_email})
                  {activeTicket.author_whatsapp && ` • WhatsApp: ${activeTicket.author_whatsapp}`}
                </p>
              </div>

              <button onClick={() => setActiveTicket(null)} className="p-1.5 text-text-secondary hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Caso seja Kit Digital: Caixa de Provisionamento */}
            {activeTicket.domain_requested && (
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 flex items-center gap-1.5">
                    <Globe className="h-4 w-4" /> Domínio Solicitado para Registro:
                  </span>
                  <span className="font-mono text-white text-sm font-bold bg-charcoal px-3 py-1 rounded border border-border">
                    {activeTicket.domain_requested}
                  </span>
                </div>
                {Array.isArray(activeTicket.emails_requested) && activeTicket.emails_requested.length > 0 && (
                  <div>
                    <span className="text-text-secondary">E-mails Corporativos Solicitados:</span>
                    <p className="font-mono text-white mt-0.5">{activeTicket.emails_requested.join(", ")}</p>
                  </div>
                )}
              </div>
            )}

            {/* Ações Rápidas de Status */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-charcoal/70 rounded-xl border border-border">
              <span className="text-xs font-semibold text-silver">Alterar Status do Chamado:</span>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(activeTicket.id, "in_progress")}
                  className="h-8 text-xs gap-1 border-blue-500/40 text-blue-300 hover:bg-blue-500/10"
                >
                  <Loader2 className="h-3 w-3" /> Em Atendimento
                </Button>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => handleUpdateStatus(activeTicket.id, "resolved")}
                  className="h-8 text-xs font-bold gap-1 bg-emerald hover:bg-emerald/90 text-white border-none"
                >
                  <Check className="h-3.5 w-3.5" /> Concluir / Resolver Chamado
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(activeTicket.id, "closed")}
                  className="h-8 text-xs gap-1 border-border text-silver hover:text-white"
                >
                  <X className="h-3 w-3" /> Encerrar
                </Button>
              </div>
            </div>

            {/* Timeline de Mensagens */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-obsidian/60 rounded-xl border border-border min-h-[200px] max-h-[340px]">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center p-6 text-xs text-silver">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Carregando histórico...
                </div>
              ) : (
                ticketMessages.map((msg) => {
                  const isAdmin = msg.sender_type === "admin";
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "p-3 rounded-xl text-xs max-w-[85%] space-y-1",
                        isAdmin
                          ? "ml-auto bg-gold/15 border border-gold/30 text-white"
                          : "mr-auto bg-charcoal border border-border text-silver"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px]">
                        <span className={cn("font-bold", isAdmin ? "text-gold" : "text-white")}>
                          {isAdmin ? "🛡️ Administrador (Você)" : msg.sender_name}
                        </span>
                        <span className="text-text-secondary">
                          {new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap text-white">{msg.content}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Enviar Resposta para o Membro */}
            <form onSubmit={handleSendAdminReply} className="space-y-2 pt-2 border-t border-border">
              <label className="text-xs font-semibold text-silver">Responder ao Membro:</label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Escreva a orientação, dados de provisionamento ou resposta..."
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  className="text-xs bg-charcoal flex-1"
                />
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  loading={isSendingReply}
                  disabled={!adminReplyText.trim()}
                  className="font-bold gap-1 shrink-0"
                >
                  <Send className="h-3.5 w-3.5" /> Enviar Resposta
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
