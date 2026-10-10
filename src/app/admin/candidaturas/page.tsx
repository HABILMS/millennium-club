"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  Search,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  MessageSquare,
  Eye,
  Download,
  Calendar,
  Shield,
  Pause,
  HelpCircle,
  UserCheck,
  X,
  Info,
  Phone,
  Mail,
  ExternalLink,
  Check,
  Building,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const statusOptions = [
  { value: "all", label: "Todos os status" },
  { value: "submitted", label: "Enviada" },
  { value: "under_review", label: "Em análise" },
  { value: "docs_pending", label: "Docs pendentes" },
  { value: "interview_scheduled", label: "Entrevista agendada" },
  { value: "interviewed", label: "Entrevistada" },
  { value: "compliance_review", label: "Compliance" },
  { value: "approved", label: "Aprovada" },
  { value: "rejected", label: "Reprovada" },
  { value: "draft", label: "Rascunho" },
  { value: "suspended", label: "Suspensa" },
  { value: "converted", label: "Convertida" },
];

const mockApplications = [
  {
    id: "APP-2026-0045",
    code: "APP-2026-0045",
    name: "João da Silva",
    email: "joao@techventures.com.br",
    role: "Empreendedor",
    jobTitle: "CEO & Co-fundador",
    company: "TechVentures Ltda",
    status: "under_review",
    submittedAt: "2026-01-10T10:30:00",
    score: 87,
    referredBy: "Maria Santos",
    whatsapp: "+55 11 98888-1122",
    linkedin: "https://linkedin.com/in/joaodasilva",
    city: "São Paulo",
    state: "SP",
    sectors: "SaaS B2B, Inteligência Artificial, Fintech",
    bio: "Empreendedor serial com mais de 12 anos de experiência liderando startups de tecnologia no ecossistema brasileiro.",
    networkObjective: "Conectar-se a investidores e parceiros institucionais para expansão nacional.",
    contribution: "Compartilhamento de teses e originação de co-investimentos.",
    signupSource: "LinkedIn",
    isLiveDB: false,
  },
  {
    id: "APP-2026-0044",
    code: "APP-2026-0044",
    name: "Carlos Oliveira",
    email: "carlos@investbr.com.br",
    role: "Investidor",
    jobTitle: "Managing Partner",
    company: "InvestBR Capital",
    status: "docs_pending",
    submittedAt: "2026-01-08T14:20:00",
    score: 92,
    referredBy: "",
    whatsapp: "+55 21 97777-3344",
    linkedin: "https://linkedin.com/in/carlosoliveira",
    city: "Rio de Janeiro",
    state: "RJ",
    sectors: "Venture Capital, Private Equity, M&A",
    bio: "Gestor de fundo de venture capital focado em rodadas Series A e B para empresas da América Latina.",
    networkObjective: "Originação de deal flow exclusivo e sindicatos de coinvestimento.",
    contribution: "Acesso a rodadas privadas e conselho consultivo.",
    signupSource: "Indicação direta",
    isLiveDB: false,
  },
  {
    id: "APP-2026-0043",
    code: "APP-2026-0043",
    name: "Ana Paula Costa",
    email: "ana@consultoria360.com.br",
    role: "Consultora",
    jobTitle: "Sócia Diretora",
    company: "Consultoria 360",
    status: "interview_scheduled",
    submittedAt: "2026-01-05T09:15:00",
    score: 78,
    referredBy: "Roberto Lima",
    whatsapp: "+55 31 99111-4455",
    linkedin: "https://linkedin.com/in/anapaulacosta",
    city: "Belo Horizonte",
    state: "MG",
    sectors: "Estratégia Corporativa, Governança, ESG",
    bio: "Especialista em governança corporativa e reestruturação para scale-ups e médias empresas.",
    networkObjective: "Expandir relacionamentos com C-Levels e conselheiros do clube.",
    contribution: "Mentoria estratégica e comitê consultivo.",
    signupSource: "Evento presencial",
    isLiveDB: false,
  },
  {
    id: "APP-2026-0042",
    code: "APP-2026-0042",
    name: "Roberto Almeida",
    email: "roberto@agrotech.com.br",
    role: "Empreendedor",
    jobTitle: "Presidente Executivo",
    company: "AgroTech Sul",
    status: "approved",
    submittedAt: "2026-01-03T16:45:00",
    score: 95,
    referredBy: "",
    whatsapp: "+55 41 98444-2211",
    linkedin: "https://linkedin.com/in/robertoalmeida",
    city: "Curitiba",
    state: "PR",
    sectors: "Agronegócio, Cadeia de Suprimentos, Logística",
    bio: "Fundador de um dos maiores ecossistemas de biotecnologia agrícola e distribuição do Sul.",
    networkObjective: "Expansão internacional e parcerias com family offices.",
    contribution: "Know-how em agronegócio e conexão com cooperativas.",
    signupSource: "Google",
    isLiveDB: false,
  },
  {
    id: "APP-2026-0041",
    code: "APP-2026-0041",
    name: "Fernanda Lima",
    email: "fernanda@representa.com.br",
    role: "Executiva Comercial",
    jobTitle: "Head Comercial",
    company: "Representa Comercial",
    status: "rejected",
    submittedAt: "2025-12-28T11:30:00",
    score: 45,
    referredBy: "",
    whatsapp: "+55 19 99333-8899",
    linkedin: "https://linkedin.com/in/fernandalima",
    city: "Campinas",
    state: "SP",
    sectors: "Comércio Exterior, Vendas B2B",
    bio: "Profissional de representação comercial e negociações industriais com foco no Sudeste.",
    networkObjective: "Acesso a novos compradores industriais.",
    contribution: "Abertura de novos mercados.",
    signupSource: "Website",
    isLiveDB: false,
  },
  {
    id: "APP-2026-0040",
    code: "APP-2026-0040",
    name: "Ricardo Mendes",
    email: "ricardo@financeira.com.br",
    role: "Investidor",
    jobTitle: "Diretor de Investimentos",
    company: "Financeira Nacional",
    status: "interviewed",
    submittedAt: "2025-12-20T10:00:00",
    score: 88,
    referredBy: "Carlos Oliveira",
    whatsapp: "+55 11 97111-2233",
    linkedin: "https://linkedin.com/in/ricardomendes",
    city: "São Paulo",
    state: "SP",
    sectors: "Finanças Estruturadas, Crédito Privado, Real Estate",
    bio: "Mais de 18 anos de mercado financeiro estruturando operações de dívida e fundos imobiliários.",
    networkObjective: "Co-investimentos em dívida privada e ativos reais.",
    contribution: "Estruturação de funding e acesso a investidores qualificados.",
    signupSource: "Indicação de Membro",
    isLiveDB: false,
  },
];

const getStatusConfig = (status: string) => {
  const configs: Record<
    string,
    {
      variant: "default" | "gold" | "emerald" | "alert" | "silver" | "outline";
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      colorClass: string;
    }
  > = {
    draft: { variant: "silver", label: "Rascunho", icon: FileText, colorClass: "text-silver" },
    submitted: { variant: "default", label: "Enviada", icon: Clock, colorClass: "text-sky-400" },
    under_review: { variant: "gold", label: "Em análise", icon: Search, colorClass: "text-gold" },
    docs_pending: { variant: "alert", label: "Docs pendentes", icon: AlertTriangle, colorClass: "text-amber-400" },
    interview_scheduled: { variant: "default", label: "Entrevista agendada", icon: Calendar, colorClass: "text-blue-400" },
    interviewed: { variant: "silver", label: "Entrevistada", icon: MessageSquare, colorClass: "text-silver" },
    compliance_review: { variant: "gold", label: "Compliance", icon: Shield, colorClass: "text-yellow-400" },
    approved: { variant: "emerald", label: "Aprovada", icon: CheckCircle, colorClass: "text-emerald" },
    rejected: { variant: "alert", label: "Reprovada", icon: XCircle, colorClass: "text-alert" },
    suspended: { variant: "silver", label: "Suspensa", icon: Pause, colorClass: "text-silver" },
    converted: { variant: "emerald", label: "Convertida", icon: UserCheck, colorClass: "text-emerald" },
  };
  return configs[status] || { variant: "silver", label: status, icon: HelpCircle, colorClass: "text-silver" };
};

export default function AdminCandidaturasPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "score" | "name">("date");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewDetail, setViewDetail] = useState<string | null>(null);
  const [appList, setAppList] = useState<any[]>(mockApplications);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "info" | "alert" } | null>(null);
  const [internalNoteInput, setInternalNoteInput] = useState("");
  const [internalNotes, setInternalNotes] = useState<Record<string, Array<{ author: string; time: string; content: string }>>>({
    "APP-2026-0045": [
      { author: "Admin Comitê", time: "10/01 15:30", content: "Perfil forte em SaaS B2B. Histórico de exits consistente. Recomendo aprovação." },
      { author: "Compliance", time: "12/01 09:15", content: "Documentação societária verificada sem pendências cadastrais." },
    ],
  });

  const ITEMS_PER_PAGE = 6;

  const showToast = (text: string, type: "success" | "info" | "alert" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortBy]);

  useEffect(() => {
    async function loadApplications() {
      try {
        let dbRows: any[] = [];

        // 1. Tentar buscar via API Server Route sem cache
        const res = await fetch("/api/admin/candidaturas", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.applications && json.applications.length > 0) {
            dbRows = json.applications;
          }
        }

        // 2. Se a API não retornou dados, tentar via cliente Supabase
        if (dbRows.length === 0) {
          const { data } = await supabase
            .from("applications")
            .select("*")
            .order("created_at", { ascending: false });
          if (data && data.length > 0) {
            dbRows = data;
          }
        }

        if (dbRows.length > 0) {
          const mapped = dbRows.map((item) => ({
            id: item.code || item.id,
            rawId: item.id,
            code: item.code || item.id,
            name: item.full_name || "Candidato sem nome",
            email: item.email || "sem-email@exemplo.com",
            role: item.primary_role || "Empreendedor",
            jobTitle: item.job_title || "Executivo",
            company: item.company_name || "Não informada",
            status: item.status || "submitted",
            submittedAt: item.created_at || new Date().toISOString(),
            score: item.score || 90,
            referredBy: item.referred_by || "",
            whatsapp: item.whatsapp || item.phone || "",
            phone: item.phone || item.whatsapp || "",
            linkedin: item.linkedin || "",
            city: item.city || "",
            state: item.state || "",
            sectors: item.interest_sectors || item.sectors || "",
            bio: item.executive_bio || "",
            networkObjective: item.network_objective || "",
            contribution: item.contribution || "",
            signupSource: item.signup_source || "Formulário Web",
            isLiveDB: true,
          }));

          // Concatena cadastros reais do banco no topo com a lista mock para exibição completa
          setAppList([...mapped, ...mockApplications.filter((a) => !mapped.some((m) => m.id === a.id))]);
        }
      } catch (err) {
        console.error("Erro ao carregar candidaturas do Supabase:", err);
      } finally {
        setLoading(false);
      }
    }
    loadApplications();
  }, []);

  // Ação rápida e ágil para aprovar, reprovar, pedir documentos ou colocar em análise
  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    const candidate = appList.find((a) => a.id === appId || a.code === appId);
    const candidateName = candidate?.name || appId;
    const statusCfg = getStatusConfig(newStatus);

    // 1. Atualização otimista no estado local
    setAppList((prev) =>
      prev.map((app) => (app.id === appId || app.code === appId ? { ...app, status: newStatus } : app))
    );

    showToast(`Status de ${candidateName} atualizado para "${statusCfg.label}"`, newStatus === "rejected" ? "alert" : "success");

    // 2. Persistência no banco Supabase via API e fallback direto
    try {
      const res = await fetch("/api/admin/candidaturas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status: newStatus }),
      });

      if (!res.ok) {
        await supabase
          .from("applications")
          .update({ status: newStatus })
          .or(`code.eq.${appId},id.eq.${appId}`);
      }
    } catch (err) {
      console.warn("API de atualização falhou, tentando Supabase direto:", err);
      try {
        await supabase
          .from("applications")
          .update({ status: newStatus })
          .or(`code.eq.${appId},id.eq.${appId}`);
      } catch (e) {
        console.error("Falha ao salvar no banco:", e);
      }
    }
  };

  const handleAddInternalNote = (appId: string) => {
    if (!internalNoteInput.trim()) return;
    const newNote = {
      author: "Admin Master",
      time: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
      content: internalNoteInput.trim(),
    };
    setInternalNotes((prev) => ({
      ...prev,
      [appId]: [newNote, ...(prev[appId] || [])],
    }));
    setInternalNoteInput("");
    showToast("Anotação interna registrada com sucesso!");
  };

  const filteredApplications = appList
    .filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      if (
        search &&
        !app.name.toLowerCase().includes(search.toLowerCase()) &&
        !app.email.toLowerCase().includes(search.toLowerCase()) &&
        !app.company.toLowerCase().includes(search.toLowerCase()) &&
        !app.id.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      if (sortBy === "score") return b.score - a.score;
      return a.name.localeCompare(b.name);
    });

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE) || 1;
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Obter os dados REAIS do candidato selecionado para exibir no modal
  const selectedApp = appList.find((a) => a.id === viewDetail || a.code === viewDetail) || null;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Toast Notification Flutuante */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-charcoal/95 border border-gold/40 text-white px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in">
          {toastMessage.type === "success" && <CheckCircle className="h-5 w-5 text-emerald shrink-0" />}
          {toastMessage.type === "alert" && <XCircle className="h-5 w-5 text-alert shrink-0" />}
          {toastMessage.type === "info" && <Info className="h-5 w-5 text-gold shrink-0" />}
          <span className="text-sm font-medium">{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-text-secondary hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">Controle de Candidaturas</h1>
          <p className="mt-1 text-silver text-sm">
            Triagem, análise de perfil e decisão ágil sobre novas candidaturas ao clube
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => (window.location.href = "/candidatura")}>
            Ver formulário público
          </Button>
          <Button
            variant="gold"
            onClick={() => {
              const csvContent =
                "data:text/csv;charset=utf-8," +
                ["ID,Nome,Email,Empresa,Status,Data"]
                  .concat(
                    appList.map(
                      (a) => `${a.id},"${a.name}","${a.email}","${a.company}",${a.status},${a.submittedAt}`
                    )
                  )
                  .join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `candidaturas_millennium_${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Barra de Filtros Compacta */}
      <Card className="glass">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Buscar por nome, e-mail, empresa ou ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none h-10 px-3 text-sm appearance-none cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "score" | "name")}
              className="w-full sm:w-40 bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none h-10 px-3 text-sm appearance-none cursor-pointer"
            >
              <option value="date">Mais recentes</option>
              <option value="score">Maior score</option>
              <option value="name">Nome A-Z</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* TABELA OTIMIZADA: 4 Colunas Claras - SEM ROLAGEM LATERAL */}
      <Card className="glass overflow-hidden border border-border/80">
        <CardContent className="p-0">
          <div className="w-full">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="border-b border-border bg-charcoal/60 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  <th className="py-3 px-4 w-[36%]">Candidato & Contato</th>
                  <th className="py-3 px-4 w-[24%]">Empresa & Cargo</th>
                  <th className="py-3 px-4 w-[16%]">Status & Data</th>
                  <th className="py-3 px-4 w-[24%] text-right">Ações Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedApplications.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-text-secondary">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="h-8 w-8 text-silver/40" />
                        <p className="text-base text-silver">Nenhuma candidatura encontrada com os filtros atuais.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedApplications.map((app) => {
                    const statusConfig = getStatusConfig(app.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr
                        key={app.id}
                        className={cn(
                          "hover:bg-charcoal/40 transition-colors group",
                          selectedIds.has(app.id) && "bg-gold/5"
                        )}
                      >
                        {/* Coluna 1: Candidato & Contato */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                              {app.name
                                ? app.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()
                                : "MC"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  onClick={() => setViewDetail(app.id)}
                                  className="font-medium text-white hover:text-gold cursor-pointer transition-colors truncate text-sm"
                                  title={app.name}
                                >
                                  {app.name}
                                </span>
                                {app.isLiveDB && (
                                  <span className="text-[10px] bg-emerald/20 text-emerald border border-emerald/40 px-1.5 py-0.2 rounded-full font-bold shrink-0">
                                    🟢 BD Real
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-text-secondary truncate mt-0.5">{app.email}</p>
                              <div className="flex items-center gap-2 text-[11px] text-silver/80 mt-0.5">
                                <span className="font-mono text-gold/80">{app.code || app.id}</span>
                                {app.whatsapp && (
                                  <>
                                    <span>•</span>
                                    <a
                                      href={`https://wa.me/${app.whatsapp.replace(/\D/g, "")}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="hover:text-emerald flex items-center gap-1 transition-colors"
                                      title="Conversar no WhatsApp"
                                    >
                                      <Phone className="h-3 w-3 text-emerald" />
                                      <span>{app.whatsapp}</span>
                                    </a>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Coluna 2: Empresa & Perfil */}
                        <td className="py-3.5 px-4">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate" title={app.company}>
                              {app.company}
                            </p>
                            <p className="text-xs text-silver truncate mt-0.5" title={app.jobTitle || app.role}>
                              {app.jobTitle || app.role}
                            </p>
                            {app.referredBy ? (
                              <p className="text-[11px] text-text-secondary truncate mt-0.5" title={`Indicado por: ${app.referredBy}`}>
                                Ref: <span className="text-gold/90">{app.referredBy}</span>
                              </p>
                            ) : null}
                          </div>
                        </td>

                        {/* Coluna 3: Status & Data */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1">
                            <div>
                              <Badge variant={statusConfig.variant as any} size="sm" className="gap-1.5 font-normal">
                                <StatusIcon className="h-3 w-3 shrink-0" />
                                <span>{statusConfig.label}</span>
                              </Badge>
                            </div>
                            <span className="text-[11px] text-text-secondary">{formatDate(app.submittedAt)}</span>
                          </div>
                        </td>

                        {/* Coluna 4: Ações Rápidas (Zero Scroll Lateral) */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Botão Ver / Editar Detalhes */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewDetail(app.id)}
                              className="h-8 px-2.5 text-xs gap-1 border-gold/40 text-gold hover:bg-gold/10"
                              title="Abrir detalhes completos para analisar e editar"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden md:inline font-medium">Analisar</span>
                            </Button>

                            {/* Botão Aprovar */}
                            {app.status !== "approved" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(app.id, "approved")}
                                className="h-8 px-2 text-xs border-emerald/40 text-emerald hover:bg-emerald/15 hover:border-emerald"
                                title="Aprovar candidatura imediatamente"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span className="hidden lg:inline ml-1 font-medium">Aprovar</span>
                              </Button>
                            )}

                            {/* Botão Pedir Docs */}
                            {app.status !== "docs_pending" && app.status !== "approved" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(app.id, "docs_pending")}
                                className="h-8 px-2 text-xs border-amber-500/40 text-amber-400 hover:bg-amber-500/15"
                                title="Solicitar envio de documentos pendentes"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                <span className="hidden xl:inline ml-1 font-medium">Docs</span>
                              </Button>
                            )}

                            {/* Botão Reprovar */}
                            {app.status !== "rejected" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(app.id, "rejected")}
                                className="h-8 px-2 text-xs border-alert/30 text-alert hover:bg-alert/15"
                                title="Reprovar candidatura"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span className="hidden xl:inline ml-1 font-medium">Reprovar</span>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Paginação */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 glass rounded-xl border border-border">
        <span className="text-xs text-silver">
          Exibindo{" "}
          <strong className="text-white">
            {filteredApplications.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}
          </strong>{" "}
          a{" "}
          <strong className="text-white">
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredApplications.length)}
          </strong>{" "}
          de <strong className="text-gold">{filteredApplications.length}</strong> registros
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Anterior
          </Button>
          <span className="text-xs font-semibold text-gold px-3 py-1 bg-charcoal rounded-lg border border-gold/30">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Próxima
          </Button>
        </div>
      </div>

      {/* MODAL COM DADOS 100% DINÂMICOS DO CANDIDATO CLICADO */}
      {viewDetail && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian/85 backdrop-blur-md overflow-y-auto">
          <div className="glass rounded-2xl p-5 sm:p-7 w-full max-w-4xl max-h-[92vh] overflow-y-auto animate-fade-in border border-gold/30 shadow-2xl">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-border sticky top-0 bg-obsidian/95 z-20">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold text-base">
                  {selectedApp.name
                    ? selectedApp.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "MC"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg sm:text-xl font-semibold text-white">
                      {selectedApp.name}
                    </h2>
                    {selectedApp.isLiveDB && (
                      <span className="text-[10px] bg-emerald/20 text-emerald border border-emerald/40 px-2 py-0.5 rounded-full font-bold">
                        🟢 Banco de Dados
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-silver">
                    Código: <span className="font-mono text-gold font-semibold">{selectedApp.code || selectedApp.id}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={getStatusConfig(selectedApp.status).variant as any} size="md">
                  {getStatusConfig(selectedApp.status).label}
                </Badge>
                <button
                  onClick={() => setViewDetail(null)}
                  className="p-2 text-text-secondary hover:text-white rounded-lg hover:bg-charcoal transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* BARRA DE AÇÃO RÁPIDA DO ADMINISTRADOR NO TOPO DO MODAL */}
            <div className="my-5 p-4 rounded-xl bg-charcoal/70 border border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Decisão de Screening</p>
                <p className="text-sm font-medium text-white">Selecione a ação para este candidato:</p>
              </div>
              <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedApp.id, "approved")}
                  className={cn(
                    "text-xs gap-1 border-emerald/40 text-emerald hover:bg-emerald/20",
                    selectedApp.status === "approved" && "bg-emerald text-obsidian font-bold"
                  )}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Aprovar Candidatura
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedApp.id, "docs_pending")}
                  className={cn(
                    "text-xs gap-1 border-amber-500/40 text-amber-400 hover:bg-amber-500/20",
                    selectedApp.status === "docs_pending" && "bg-amber-400 text-obsidian font-bold"
                  )}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Pedir Documentos
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedApp.id, "under_review")}
                  className={cn(
                    "text-xs gap-1 border-gold/40 text-gold hover:bg-gold/20",
                    selectedApp.status === "under_review" && "bg-gold text-obsidian font-bold"
                  )}
                >
                  <Search className="h-3.5 w-3.5" />
                  Em Análise
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedApp.id, "rejected")}
                  className={cn(
                    "text-xs gap-1 border-alert/40 text-alert hover:bg-alert/20",
                    selectedApp.status === "rejected" && "bg-alert text-white font-bold"
                  )}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reprovar
                </Button>
              </div>
            </div>

            {/* CONTEÚDO DINÂMICO DO CANDIDATO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Card 1: Dados Pessoais & Contato */}
              <Card className="glass border-border/70">
                <CardHeader className="py-3 px-4 border-b border-border bg-charcoal/30">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-gold" />
                    Informações do Candidato
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-sm">
                  <div className="flex justify-between items-center py-1 border-b border-border/40">
                    <span className="text-text-secondary">Nome completo:</span>
                    <span className="font-medium text-white">{selectedApp.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border/40">
                    <span className="text-text-secondary">E-mail:</span>
                    <a href={`mailto:${selectedApp.email}`} className="text-gold hover:underline">
                      {selectedApp.email}
                    </a>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border/40">
                    <span className="text-text-secondary">WhatsApp:</span>
                    {selectedApp.whatsapp ? (
                      <a
                        href={`https://wa.me/${selectedApp.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald hover:underline flex items-center gap-1 font-medium"
                      >
                        <Phone className="h-3 w-3" />
                        {selectedApp.whatsapp}
                      </a>
                    ) : (
                      <span className="text-silver">Não informado</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border/40">
                    <span className="text-text-secondary">Localização:</span>
                    <span className="text-white">
                      {selectedApp.city || selectedApp.state
                        ? `${selectedApp.city || ""}${selectedApp.city && selectedApp.state ? " - " : ""}${selectedApp.state || ""}`
                        : "Brasil"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border/40">
                    <span className="text-text-secondary">LinkedIn:</span>
                    {selectedApp.linkedin ? (
                      <a
                        href={selectedApp.linkedin.startsWith("http") ? selectedApp.linkedin : `https://${selectedApp.linkedin}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gold hover:underline flex items-center gap-1"
                      >
                        Acessar perfil <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-silver">Não informado</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border/40">
                    <span className="text-text-secondary">Indicação:</span>
                    <span className="text-white font-medium">
                      {selectedApp.referredBy ? `👤 ${selectedApp.referredBy}` : "Sem indicação direta"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-text-secondary">Data de envio:</span>
                    <span className="text-silver">{formatDate(selectedApp.submittedAt)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Empresa & Perfil Executivo */}
              <Card className="glass border-border/70">
                <CardHeader className="py-3 px-4 border-b border-border bg-charcoal/30">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Building className="h-4 w-4 text-gold" />
                    Empresa & Perfil Executivo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-sm">
                  <div className="flex justify-between items-center py-1 border-b border-border/40">
                    <span className="text-text-secondary">Empresa atual:</span>
                    <span className="font-semibold text-white">{selectedApp.company}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border/40">
                    <span className="text-text-secondary">Cargo / Posição:</span>
                    <span className="text-white font-medium">{selectedApp.jobTitle || selectedApp.role}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border/40">
                    <span className="text-text-secondary">Papel no Clube:</span>
                    <Badge variant="silver" size="sm">
                      {selectedApp.role}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border/40">
                    <span className="text-text-secondary">Score de Triagem:</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 bg-charcoal rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full" style={{ width: `${selectedApp.score}%` }} />
                      </div>
                      <span className="font-semibold text-white">{selectedApp.score}%</span>
                    </div>
                  </div>
                  <div className="py-1">
                    <span className="text-text-secondary block mb-1">Setores de Atuação & Interesse:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedApp.sectors
                        ? selectedApp.sectors.split(",").map((s: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs bg-charcoal border border-border px-2 py-0.5 rounded-lg text-silver"
                            >
                              {s.trim()}
                            </span>
                          ))
                        : (
                            <span className="text-xs text-silver">Geral / Multi-setorial</span>
                          )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Apresentação & Proposta de Valor */}
              <Card className="glass border-border/70 lg:col-span-2">
                <CardHeader className="py-3 px-4 border-b border-border bg-charcoal/30">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gold" />
                    Apresentação Executiva & Objetivos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                      Biografia / Resumo Executivo
                    </p>
                    <p className="text-silver bg-charcoal/40 p-3 rounded-xl border border-border/60 leading-relaxed">
                      {selectedApp.bio || "Nenhum resumo executivo preenchido pelo candidato."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                        Objetivo no Millennium Club
                      </p>
                      <p className="text-silver bg-charcoal/40 p-3 rounded-xl border border-border/60 leading-relaxed">
                        {selectedApp.networkObjective ||
                          "Conectar-se com líderes, co-investimentos e originação de negócios."}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                        Contribuição para os Membros
                      </p>
                      <p className="text-silver bg-charcoal/40 p-3 rounded-xl border border-border/60 leading-relaxed">
                        {selectedApp.contribution ||
                          "Compartilhamento de teses, acesso a dealflow e conselho estratégico."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Anotações Internas do Comitê */}
              <Card className="glass border-border/70 lg:col-span-2">
                <CardHeader className="py-3 px-4 border-b border-border bg-charcoal/30 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4 text-gold" />
                    Notas Internas do Comitê de Admissão
                  </CardTitle>
                  <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Visível apenas para admins
                  </span>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={internalNoteInput}
                      onChange={(e) => setInternalNoteInput(e.target.value)}
                      placeholder="Adicione uma nota sobre o screening, compliance ou entrevista..."
                      className="w-full bg-charcoal border border-border text-white placeholder-text-secondary rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none p-3 text-sm resize-none"
                    />
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => handleAddInternalNote(selectedApp.id)}
                      className="self-end h-10 px-4"
                    >
                      Salvar Nota
                    </Button>
                  </div>

                  {/* Lista de notas gravadas para este ID */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {(internalNotes[selectedApp.id] || []).length === 0 ? (
                      <p className="text-xs text-silver/60 italic">Nenhuma anotação registrada ainda para este candidato.</p>
                    ) : (
                      (internalNotes[selectedApp.id] || []).map((note, idx) => (
                        <div key={idx} className="p-3 bg-charcoal/50 border border-border/60 rounded-xl">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gold">{note.author}</span>
                            <span className="text-[11px] text-text-secondary">{note.time}</span>
                          </div>
                          <p className="text-xs text-silver leading-relaxed">{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rodapé do Modal */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-silver">
                Status atual:{" "}
                <strong className={getStatusConfig(selectedApp.status).colorClass}>
                  {getStatusConfig(selectedApp.status).label}
                </strong>
              </span>
              <Button variant="outline" onClick={() => setViewDetail(null)}>
                Fechar Janela
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}