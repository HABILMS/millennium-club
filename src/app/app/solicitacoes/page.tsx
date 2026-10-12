"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  Globe,
  Mail,
  Loader2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  ExternalLink,
  HelpCircle,
  Server,
  MessageSquare,
  Search,
  Filter,
  Send,
  X,
  ShieldCheck,
  Briefcase,
  CreditCard,
  FileText,
  User,
  Sparkles,
} from "lucide-react";

export interface TicketItem {
  id: string;
  ticket_number: string;
  author_name: string;
  author_email: string;
  author_whatsapp?: string;
  category: string;
  category_label: string;
  subject: string;
  description: string;
  priority: "normal" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting_user" | "resolved" | "closed";
  domain_requested?: string;
  emails_requested?: string[];
  landing_page_requested?: boolean;
  admin_notes?: string;
  admin_resolution_notes?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_type: "member" | "admin" | "system";
  sender_name: string;
  content: string;
  created_at: string;
}

const mockInitialTickets: TicketItem[] = [
  {
    id: "tck-demo-1",
    ticket_number: "TCK-2026-0041",
    author_name: "Membro Associado",
    author_email: "membro@millenniumclub.com",
    category: "digital_kit",
    category_label: "Kit Presença Digital",
    subject: "Solicitação de registro de domínio joaosolar.com.br e 5 e-mails",
    description: "Gostaria de registrar o domínio joaosolar.com.br incluído no meu plano e criar as caixas contato@ e diretoria@.",
    priority: "high",
    status: "in_progress",
    domain_requested: "joaosolar.com.br",
    emails_requested: ["contato@joaosolar.com.br", "diretoria@joaosolar.com.br"],
    landing_page_requested: true,
    admin_resolution_notes: "Domínio enviado para provisionamento com DNS gerenciado e SSL.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "tck-demo-2",
    ticket_number: "TCK-2026-0038",
    author_name: "Membro Associado",
    author_email: "membro@millenniumclub.com",
    category: "deals_ma",
    category_label: "Mesa de Deals / M&A",
    subject: "Apoio de Due Diligence para ativo de Usina Solar",
    description: "Tenho um comprador qualificado para o parque solar e solicito termo de NDA com não-circunvenção intermediado.",
    priority: "urgent",
    status: "resolved",
    admin_resolution_notes: "Termo de NDA gerado e assinado digitalmente pelas partes. Reunião agendada.",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    resolved_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export default function SolicitacoesPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [activeTab, setActiveTab] = useState<"chamados" | "beneficios">("chamados");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Form states do Novo Chamado
  const [authorName, setAuthorName] = useState("Membro Associado");
  const [authorEmail, setAuthorEmail] = useState("membro@millenniumclub.com");
  const [authorWhatsapp, setAuthorWhatsapp] = useState("(11) 98888-0000");
  const [category, setCategory] = useState("digital_kit");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"normal" | "high" | "urgent">("normal");

  // Form states exclusivos do Kit Presença Digital
  const [domainRequested, setDomainRequested] = useState("");
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [domainCheckResult, setDomainCheckResult] = useState<{
    isValid: boolean;
    available: boolean;
    message: string;
  } | null>(null);
  const [email1, setEmail1] = useState("contato@");
  const [email2, setEmail2] = useState("diretoria@");
  const [email3, setEmail3] = useState("");
  const [email4, setEmail4] = useState("");
  const [email5, setEmail5] = useState("");
  const [landingPageRequested, setLandingPageRequested] = useState(true);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  // Carrega chamados
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.tickets) && data.tickets.length > 0) {
          setTickets(data.tickets);
          return;
        }
      }
    } catch (e) {
      console.warn("Falha ao carregar tickets da API:", e);
    }
    setTickets(mockInitialTickets);
  };

  // Checagem de disponibilidade de domínio em tempo real
  const handleCheckDomain = async () => {
    if (!domainRequested.trim()) return;
    setIsCheckingDomain(true);
    setDomainCheckResult(null);

    try {
      const res = await fetch(`/api/domain-check?domain=${encodeURIComponent(domainRequested.trim())}`);
      const data = await res.json();
      setDomainCheckResult(data);
    } catch (err: any) {
      setDomainCheckResult({
        isValid: false,
        available: false,
        message: "Não foi possível validar o domínio no momento. Você ainda pode submeter o pedido.",
      });
    } finally {
      setIsCheckingDomain(false);
    }
  };

  // Submeter novo chamado
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      alert("Por favor, preencha o assunto e a descrição do chamado.");
      return;
    }

    setIsSubmittingTicket(true);

    const categoryLabels: Record<string, string> = {
      digital_kit: "Kit Presença Digital",
      deals_ma: "Mesa de Deals / M&A",
      compliance: "Compliance & Mandato",
      billing: "Planos & Faturamento",
      support: "Suporte Geral",
    };

    const emails = [email1, email2, email3, email4, email5]
      .map((em) => em.trim())
      .filter((em) => em.length > 3 && em !== "contato@" && em !== "diretoria@");

    const payload = {
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim(),
      authorWhatsapp: authorWhatsapp.trim(),
      category,
      categoryLabel: categoryLabels[category] || "Suporte Geral",
      subject: subject.trim(),
      description: description.trim(),
      priority,
      domainRequested: category === "digital_kit" ? domainRequested.trim() : undefined,
      emailsRequested: category === "digital_kit" ? emails : [],
      landingPageRequested: category === "digital_kit" ? landingPageRequested : false,
    };

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ticket) {
          setTickets((prev) => [data.ticket, ...prev]);
        }
      } else {
        // Fallback local
        const localTicket: TicketItem = {
          id: `tck-${Date.now()}`,
          ticket_number: `TCK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          author_name: payload.authorName,
          author_email: payload.authorEmail,
          author_whatsapp: payload.authorWhatsapp,
          category: payload.category,
          category_label: payload.categoryLabel,
          subject: payload.subject,
          description: payload.description,
          priority: payload.priority,
          domain_requested: payload.domainRequested,
          emails_requested: payload.emailsRequested,
          landing_page_requested: payload.landingPageRequested,
          status: "open",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setTickets((prev) => [localTicket, ...prev]);
      }
    } catch (e) {
      console.warn("Erro ao submeter ticket:", e);
    } finally {
      setIsSubmittingTicket(false);
      setIsNewModalOpen(false);
      setSubject("");
      setDescription("");
      setDomainRequested("");
      setDomainCheckResult(null);
    }
  };

  // Abrir chamado para ver detalhes e mensagens
  const handleOpenTicket = async (ticket: TicketItem) => {
    setSelectedTicket(ticket);
    setIsLoadingMessages(true);

    try {
      const res = await fetch(`/api/tickets/${ticket.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setTicketMessages(data.messages);
          setIsLoadingMessages(false);
          return;
        }
      }
    } catch (e) {}

    // Fallback inicial
    setTicketMessages([
      {
        id: "msg-init",
        ticket_id: ticket.id,
        sender_type: "member",
        sender_name: ticket.author_name,
        content: ticket.description,
        created_at: ticket.created_at,
      },
      ...(ticket.admin_resolution_notes
        ? [
            {
              id: "msg-admin",
              ticket_id: ticket.id,
              sender_type: "admin" as const,
              sender_name: "Administrador Master",
              content: ticket.admin_resolution_notes,
              created_at: ticket.updated_at,
            },
          ]
        : []),
    ]);
    setIsLoadingMessages(false);
  };

  // Enviar nova mensagem na timeline do chamado
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedTicket) return;

    setIsSendingMessage(true);

    const newMsg: TicketMessage = {
      id: `msg-${Date.now()}`,
      ticket_id: selectedTicket.id,
      sender_type: "member",
      sender_name: authorName,
      content: newMessageText.trim(),
      created_at: new Date().toISOString(),
    };

    setTicketMessages((prev) => [...prev, newMsg]);
    setNewMessageText("");

    try {
      await fetch(`/api/tickets/${selectedTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderType: "member",
          senderName: authorName,
          content: newMsg.content,
        }),
      });
    } catch (e) {
      console.warn("Erro ao enviar mensagem:", e);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Badge de status do chamado
  const renderStatusBadge = (status: TicketItem["status"]) => {
    switch (status) {
      case "open":
        return <Badge variant="gold" size="sm" className="gap-1 bg-amber-500/20 text-amber-300 border-amber-500/40"><Clock className="h-3 w-3" /> Aberto</Badge>;
      case "in_progress":
        return <Badge variant="outline" size="sm" className="gap-1 bg-blue-500/20 text-blue-300 border-blue-500/40"><Loader2 className="h-3 w-3 animate-spin" /> Em Atendimento</Badge>;
      case "waiting_user":
        return <Badge variant="outline" size="sm" className="gap-1 bg-purple-500/20 text-purple-300 border-purple-500/40"><HelpCircle className="h-3 w-3" /> Aguardando Membro</Badge>;
      case "resolved":
        return <Badge variant="emerald" size="sm" className="gap-1 bg-emerald/20 text-emerald border-emerald/40"><CheckCircle className="h-3 w-3" /> Resolvido</Badge>;
      case "closed":
        return <Badge variant="silver" size="sm" className="gap-1 bg-charcoal text-silver border-border"><X className="h-3 w-3" /> Encerrado</Badge>;
      default:
        return <Badge variant="silver" size="sm">{status}</Badge>;
    }
  };

  // Badge de prioridade
  const renderPriorityBadge = (priority: TicketItem["priority"]) => {
    switch (priority) {
      case "urgent":
        return <span className="text-[10px] font-bold text-alert bg-alert/15 px-2 py-0.5 rounded border border-alert/30">Urgente</span>;
      case "high":
        return <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">Alta</span>;
      default:
        return <span className="text-[10px] text-silver bg-white/5 px-2 py-0.5 rounded border border-border">Normal</span>;
    }
  };

  // Filtragem dos chamados
  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      t.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category_label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.domain_requested && t.domain_requested.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-up max-w-6xl">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Central de Atendimento & Serviços
            </Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            Chamados & Solicitações
          </h1>
          <p className="mt-1 text-silver text-sm">
            Solicite seu Kit Presença Digital (domínio e e-mails), mediação de deals, suporte de compliance e atendimento.
          </p>
        </div>

        <Button
          variant="gold"
          size="md"
          onClick={() => setIsNewModalOpen(true)}
          className="gap-2 shrink-0 font-bold shadow-lg shadow-gold/10"
        >
          <Plus className="h-4 w-4" /> Novo Chamado / Solicitação
        </Button>
      </div>

      {/* Abas */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("chamados")}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
            activeTab === "chamados"
              ? "bg-gold/20 text-gold border border-gold/40 shadow-sm"
              : "text-silver hover:text-white hover:bg-white/5"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          Meus Chamados ({tickets.length})
        </button>

        <button
          onClick={() => setActiveTab("beneficios")}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
            activeTab === "beneficios"
              ? "bg-gold/20 text-gold border border-gold/40 shadow-sm"
              : "text-silver hover:text-white hover:bg-white/5"
          )}
        >
          <Globe className="h-4 w-4" />
          Kit Presença Digital & Benefícios
        </button>
      </div>

      {activeTab === "chamados" ? (
        <div className="space-y-4">
          {/* Barra de Filtros e Busca */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-charcoal/70 rounded-xl border border-border overflow-x-auto">
              <button
                onClick={() => setStatusFilter("all")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                  statusFilter === "all" ? "bg-white/15 text-white" : "text-silver hover:text-white"
                )}
              >
                Todos ({tickets.length})
              </button>
              <button
                onClick={() => setStatusFilter("open")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                  statusFilter === "open" ? "bg-amber-500/20 text-amber-300" : "text-silver hover:text-white"
                )}
              >
                Abertos
              </button>
              <button
                onClick={() => setStatusFilter("in_progress")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                  statusFilter === "in_progress" ? "bg-blue-500/20 text-blue-300" : "text-silver hover:text-white"
                )}
              >
                Em Atendimento
              </button>
              <button
                onClick={() => setStatusFilter("resolved")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                  statusFilter === "resolved" ? "bg-emerald/20 text-emerald" : "text-silver hover:text-white"
                )}
              >
                Resolvidos
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary" />
              <Input
                placeholder="Buscar por protocolo, assunto..."
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
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-display text-base font-semibold text-white">Nenhum chamado encontrado</h3>
              <p className="text-xs text-silver max-w-md mx-auto">
                Você não possui chamados com os filtros selecionados. Clique em "Novo Chamado / Solicitação" para abrir um pedido.
              </p>
              <Button variant="gold" size="sm" onClick={() => setIsNewModalOpen(true)} className="gap-1 mt-2">
                <Plus className="h-3.5 w-3.5" /> Abrir Meu Primeiro Chamado
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredTickets.map((t) => (
                <Card
                  key={t.id}
                  className="glass hover:border-gold/30 transition-all cursor-pointer border-border"
                  onClick={() => handleOpenTicket(t)}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gold bg-gold/10 border border-gold/30 px-2.5 py-0.5 rounded-md">
                            {t.ticket_number}
                          </span>
                          <span className="text-xs text-silver bg-charcoal px-2.5 py-0.5 rounded-md border border-border">
                            {t.category_label}
                          </span>
                          {renderStatusBadge(t.status)}
                          {renderPriorityBadge(t.priority)}
                        </div>

                        <h3 className="font-display font-semibold text-white text-base truncate">
                          {t.subject}
                        </h3>

                        <p className="text-xs text-silver line-clamp-2 leading-relaxed">
                          {t.description}
                        </p>

                        {/* Dados adicionais para Kit Digital */}
                        {t.domain_requested && (
                          <div className="flex items-center gap-2 pt-1 text-xs">
                            <span className="text-text-secondary">Domínio solicitado:</span>
                            <span className="font-mono text-gold bg-obsidian px-2 py-0.5 rounded border border-border">
                              {t.domain_requested}
                            </span>
                            {t.landing_page_requested && (
                              <span className="text-emerald text-[11px] font-semibold flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Landing Page Inclusa
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                        <span className="text-[11px] text-text-secondary">
                          {new Date(t.created_at).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                        <Button variant="outline" size="sm" className="h-8 text-xs gap-1 border-border text-silver hover:text-white">
                          <MessageSquare className="h-3.5 w-3.5" /> Ver Conversa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Aba de Benefícios do Kit Digital */
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 sm:p-8 border border-gold/30 relative overflow-hidden">
            <div className="max-w-2xl space-y-3 relative z-10">
              <Badge variant="gold" size="sm" className="gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Exclusivo para Planos Pagantes
              </Badge>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Kit Presença Digital Corporativa
              </h2>
              <p className="text-silver text-sm leading-relaxed">
                Como membro dos planos Profissional ou Executivo, você tem direito à infraestrutura digital completa para elevar sua autoridade em negociações e deals de grande porte.
              </p>
              <div className="pt-2">
                <Button
                  variant="gold"
                  size="md"
                  onClick={() => {
                    setCategory("digital_kit");
                    setSubject("Solicitação do Kit Presença Digital (Domínio e E-mails)");
                    setIsNewModalOpen(true);
                  }}
                  className="font-bold gap-2"
                >
                  <Globe className="h-4 w-4" /> Solicitar Meu Domínio & E-mails Agora
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="glass border-border hover:border-gold/30 transition-all p-5 space-y-3">
              <div className="h-11 w-11 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Server className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-white text-lg">1. Domínio Próprio (1 Ano)</h3>
              <p className="text-xs text-silver leading-relaxed">
                Registro de domínio (.com.br ou .com) custeado por 1 ano pelo clube, com proteção de privacidade, SSL de alta segurança e DNS gerenciado.
              </p>
            </Card>

            <Card className="glass border-border hover:border-gold/30 transition-all p-5 space-y-3">
              <div className="h-11 w-11 rounded-xl bg-emerald/15 text-emerald flex items-center justify-center border border-emerald/30">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-white text-lg">2. Até 5 Caixas de E-mail</h3>
              <p className="text-xs text-silver leading-relaxed">
                Caixas corporativas no seu domínio próprio (ex: contato@suaempresa.com.br), com webmail moderno, filtros antispam e suporte a clientes de e-mail.
              </p>
            </Card>

            <Card className="glass border-border hover:border-gold/30 transition-all p-5 space-y-3">
              <div className="h-11 w-11 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-white text-lg">3. Landing Page Executiva</h3>
              <p className="text-xs text-silver leading-relaxed">
                Página profissional personalizada com biografia executiva, serviços, formulário de captura de leads e vitrine de ativos sob mandato.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Modal: Abertura de Novo Chamado com Verificador de Domínio */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="glass rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-gold/40 shadow-2xl p-5 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gold/15 text-gold flex items-center justify-center border border-gold/30">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                    Abrir Novo Chamado ou Solicitação
                  </h2>
                  <p className="text-xs text-silver">Protocolo gerado automaticamente para acompanhamento</p>
                </div>
              </div>
              <button onClick={() => setIsNewModalOpen(false)} className="p-1.5 text-text-secondary hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              {/* Categoria */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-silver uppercase">Selecione o Tipo de Solicitação:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-charcoal border border-border text-white rounded-xl px-3 py-2.5 text-xs focus:border-gold focus:outline-none"
                >
                  <option value="digital_kit">🌐 Kit Presença Digital (Domínio 1 ano, 5 e-mails e Landing Page)</option>
                  <option value="deals_ma">💼 Mesa de Deals / M&A (Apoio em Due Diligence e Intermediação de NDA)</option>
                  <option value="compliance">🛡️ Compliance & Mandato (Validação e Selos)</option>
                  <option value="billing">💳 Planos & Faturamento</option>
                  <option value="support">❓ Dúvidas Gerais & Suporte Técnico</option>
                </select>
              </div>

              {/* Seção Especial: Kit Presença Digital */}
              {category === "digital_kit" && (
                <div className="p-4 bg-gold/5 border border-gold/30 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-gold text-xs font-bold">
                    <Globe className="h-4 w-4" /> Configuração do Domínio & Caixas de E-mail
                  </div>

                  {/* Verificador de Domínio */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-silver">
                      Domínio Desejado (ex: suaempresa.com.br ou .com):
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Ex: joaosolar.com.br"
                        value={domainRequested}
                        onChange={(e) => {
                          setDomainRequested(e.target.value);
                          setDomainCheckResult(null);
                        }}
                        className="text-xs bg-charcoal"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCheckDomain}
                        disabled={isCheckingDomain || !domainRequested.trim()}
                        className="text-xs shrink-0 border-gold/40 text-gold hover:bg-gold/10"
                      >
                        {isCheckingDomain ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Verificar"}
                      </Button>
                    </div>

                    {/* Resultado da Checagem */}
                    {domainCheckResult && (
                      <div
                        className={cn(
                          "p-2.5 rounded-lg text-xs mt-1.5 flex items-start gap-2",
                          domainCheckResult.available
                            ? "bg-emerald/15 text-emerald border border-emerald/30"
                            : "bg-alert/15 text-alert border border-alert/30"
                        )}
                      >
                        {domainCheckResult.available ? (
                          <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        )}
                        <span>{domainCheckResult.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Caixas de E-mail */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-semibold text-silver">
                      E-mails desejados para criação (até 5 contas):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        placeholder="contato@seudominio.com.br"
                        value={email1}
                        onChange={(e) => setEmail1(e.target.value)}
                        className="text-xs bg-charcoal h-8"
                      />
                      <Input
                        placeholder="diretoria@seudominio.com.br"
                        value={email2}
                        onChange={(e) => setEmail2(e.target.value)}
                        className="text-xs bg-charcoal h-8"
                      />
                      <Input
                        placeholder="financeiro@seudominio.com.br"
                        value={email3}
                        onChange={(e) => setEmail3(e.target.value)}
                        className="text-xs bg-charcoal h-8"
                      />
                      <Input
                        placeholder="deal@seudominio.com.br"
                        value={email4}
                        onChange={(e) => setEmail4(e.target.value)}
                        className="text-xs bg-charcoal h-8"
                      />
                    </div>
                  </div>

                  {/* Checkbox Landing Page */}
                  <label className="flex items-center gap-2 pt-1 text-xs text-silver cursor-pointer">
                    <input
                      type="checkbox"
                      checked={landingPageRequested}
                      onChange={(e) => setLandingPageRequested(e.target.checked)}
                      className="rounded accent-gold h-4 w-4"
                    />
                    <span>Desejo a criação de uma Landing Page profissional integrada ao domínio.</span>
                  </label>
                </div>
              )}

              {/* Assunto */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-silver uppercase">Assunto do Chamado:</label>
                <Input
                  placeholder="Resuma o motivo do contato..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="text-xs bg-charcoal"
                />
              </div>

              {/* Descrição Detalhada */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-silver uppercase">Descrição e Detalhes:</label>
                <textarea
                  rows={4}
                  placeholder="Explique detalhadamente como a administração pode te ajudar..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full bg-charcoal border border-border text-white rounded-xl p-3 text-xs focus:border-gold focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Prioridade */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-silver uppercase">Prioridade:</span>
                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="normal"
                      checked={priority === "normal"}
                      onChange={() => setPriority("normal")}
                      className="accent-gold"
                    />
                    <span>Normal</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
                    <input
                      type="radio"
                      name="priority"
                      value="high"
                      checked={priority === "high"}
                      onChange={() => setPriority("high")}
                      className="accent-amber-400"
                    />
                    <span>Alta</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-alert">
                    <input
                      type="radio"
                      name="priority"
                      value="urgent"
                      checked={priority === "urgent"}
                      onChange={() => setPriority("urgent")}
                      className="accent-alert"
                    />
                    <span>Urgente</span>
                  </label>
                </div>
              </div>

              {/* Botões */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsNewModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="gold" size="sm" loading={isSubmittingTicket} className="font-bold gap-1">
                  <Send className="h-3.5 w-3.5" /> Submeter Chamado
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer / Modal: Visualização de Chamado e Chat de Mensagens */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="glass rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto border border-gold/40 shadow-2xl p-5 sm:p-7 space-y-5 flex flex-col">
            {/* Topo do Ticket */}
            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gold bg-gold/15 border border-gold/30 px-2 py-0.5 rounded">
                    {selectedTicket.ticket_number}
                  </span>
                  {renderStatusBadge(selectedTicket.status)}
                  {renderPriorityBadge(selectedTicket.priority)}
                </div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                  {selectedTicket.subject}
                </h2>
                <p className="text-xs text-silver">
                  Categoria: <strong>{selectedTicket.category_label}</strong> • Aberto em{" "}
                  {new Date(selectedTicket.created_at).toLocaleString("pt-BR")}
                </p>
              </div>

              <button onClick={() => setSelectedTicket(null)} className="p-1.5 text-text-secondary hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Metadados do Kit Digital (se houver) */}
            {selectedTicket.domain_requested && (
              <div className="p-3 bg-charcoal rounded-xl border border-border text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Domínio Solicitado:</span>
                  <span className="font-mono text-gold font-bold">{selectedTicket.domain_requested}</span>
                </div>
                {Array.isArray(selectedTicket.emails_requested) && selectedTicket.emails_requested.length > 0 && (
                  <div className="flex items-start justify-between">
                    <span className="text-text-secondary">E-mails Solicitados:</span>
                    <span className="text-white text-right font-mono">
                      {selectedTicket.emails_requested.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Timeline de Mensagens (Thread) */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-obsidian/60 rounded-xl border border-border min-h-[220px] max-h-[380px]">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center p-8 text-xs text-silver">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando mensagens do chamado...
                </div>
              ) : ticketMessages.length === 0 ? (
                <p className="text-xs text-silver text-center py-6">Nenhuma mensagem neste chamado ainda.</p>
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
                          {isAdmin ? "🛡️ Suporte Millennium Club" : msg.sender_name}
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

            {/* Formulário para Envio de Réplica */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2">
              <Input
                placeholder="Escreva uma resposta ou atualização para a administração..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="text-xs bg-charcoal flex-1"
              />
              <Button
                type="submit"
                variant="gold"
                size="sm"
                loading={isSendingMessage}
                disabled={!newMessageText.trim()}
                className="font-bold gap-1 shrink-0"
              >
                <Send className="h-3.5 w-3.5" /> Responder
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
