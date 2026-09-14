"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  ChevronDown,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  MessageSquare,
  Eye,
  Edit,
  MoreVertical,
  Download,
  Calendar,
  Shield,
  Pause,
  HelpCircle,
  UserCheck,
  X,
  Info,
} from "lucide-react";
import { useState } from "react";

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "draft", label: "Rascunho" },
  { value: "submitted", label: "Enviada" },
  { value: "under_review", label: "Em análise" },
  { value: "docs_pending", label: "Docs pendentes" },
  { value: "interview_scheduled", label: "Entrevista agendada" },
  { value: "interviewed", label: "Entrevistada" },
  { value: "compliance_review", label: "Compliance" },
  { value: "approved", label: "Aprovada" },
  { value: "rejected", label: "Reprovada" },
  { value: "suspended", label: "Suspensa" },
  { value: "converted", label: "Convertida" },
];

const applications = [
  {
    id: "APP-2026-0045",
    name: "João da Silva",
    email: "joao@techventures.com.br",
    role: "entrepreneur",
    company: "TechVentures Ltda",
    status: "under_review",
    submittedAt: "2026-01-10T10:30:00",
    score: 87,
    referredBy: "Maria Santos",
  },
  {
    id: "APP-2026-0044",
    name: "Carlos Oliveira",
    email: "carlos@investbr.com.br",
    role: "investor",
    company: "InvestBR Capital",
    status: "docs_pending",
    submittedAt: "2026-01-08T14:20:00",
    score: 92,
    referredBy: "",
  },
  {
    id: "APP-2026-0043",
    name: "Ana Paula Costa",
    email: "ana@consultoria360.com.br",
    role: "consultant",
    company: "Consultoria 360",
    status: "interview_scheduled",
    submittedAt: "2026-01-05T09:15:00",
    score: 78,
    referredBy: "Roberto Lima",
  },
  {
    id: "APP-2026-0042",
    name: "Roberto Almeida",
    email: "roberto@agrotech.com.br",
    role: "entrepreneur",
    company: "AgroTech Sul",
    status: "approved",
    submittedAt: "2026-01-03T16:45:00",
    score: 95,
    referredBy: "",
  },
  {
    id: "APP-2026-0041",
    name: "Fernanda Lima",
    email: "fernanda@representa.com.br",
    role: "representative",
    company: "Representa Comercial",
    status: "rejected",
    submittedAt: "2025-12-28T11:30:00",
    score: 45,
    referredBy: "",
  },
  {
    id: "APP-2026-0040",
    name: "Ricardo Mendes",
    email: "ricardo@financeira.com.br",
    role: "investor",
    company: "Financeira Nacional",
    status: "interviewed",
    submittedAt: "2025-12-20T10:00:00",
    score: 88,
    referredBy: "Carlos Oliveira",
  },
];

const getStatusConfig = (status: string) => {
  const configs: Record<string, { variant: "default" | "gold" | "emerald" | "alert" | "silver" | "outline"; label: string; icon: React.ComponentType<{ className?: string }> }> = {
    draft: { variant: "silver", label: "Rascunho", icon: FileText },
    submitted: { variant: "default", label: "Enviada", icon: Clock },
    under_review: { variant: "gold", label: "Em análise", icon: Search },
    docs_pending: { variant: "alert", label: "Docs pendentes", icon: AlertTriangle },
    interview_scheduled: { variant: "default", label: "Entrevista agendada", icon: Calendar },
    interviewed: { variant: "silver", label: "Entrevistada", icon: MessageSquare },
    compliance_review: { variant: "gold", label: "Compliance", icon: Shield },
    approved: { variant: "emerald", label: "Aprovada", icon: CheckCircle },
    rejected: { variant: "alert", label: "Reprovada", icon: XCircle },
    suspended: { variant: "silver", label: "Suspensa", icon: Pause },
    converted: { variant: "emerald", label: "Convertida", icon: UserCheck },
  };
  return configs[status] || { variant: "silver", label: status, icon: HelpCircle };
};



export default function AdminCandidaturasPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState<"date" | "score" | "name">("date");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [viewDetail, setViewDetail] = React.useState<string | null>(null);

  const filteredApplications = applications
    .filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      if (search && !app.name.toLowerCase().includes(search.toLowerCase()) && !app.email.toLowerCase().includes(search.toLowerCase()) && !app.company.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      if (sortBy === "score") return b.score - a.score;
      return a.name.localeCompare(b.name);
    });

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6 animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">Candidaturas</h1>
            <p className="mt-1 text-silver">Gerencie o pipeline de screening e aprovação de novos membros</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.href = "/admin/candidaturas/nova"}>
              Nova candidatura manual
            </Button>
            <Button variant="gold" onClick={() => alert("Exportar CSV")}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <Card className="glass">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  placeholder="Buscar por nome, e-mail, empresa..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48 bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none py-2.5 px-4 text-sm appearance-none"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "score" | "name")}
                className="w-full sm:w-40 bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none py-2.5 px-4 text-sm appearance-none"
              >
                <option value="date">Mais recentes</option>
                <option value="score">Maior score</option>
                <option value="name">Nome A-Z</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-charcoal/50">
                    <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary w-10">Sel.</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">Candidato</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">Papel</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">Empresa</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">Score</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">Enviado em</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">Indicação</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-text-secondary">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredApplications.map((app) => {
                    const statusConfig = getStatusConfig(app.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr key={app.id} className={cn("hover:bg-charcoal/30 transition-colors", selectedIds.has(app.id) && "bg-gold/5")}>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(app.id)}
                            onChange={(e) => {
                              const newSet = new Set(selectedIds);
                              e.target.checked ? newSet.add(app.id) : newSet.delete(app.id);
                              setSelectedIds(newSet);
                            }}
                            className="h-4 w-4 rounded border-border bg-charcoal text-gold focus:ring-gold"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-semibold text-sm">
                              {app.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium text-white">{app.name}</p>
                              <p className="text-sm text-text-secondary">{app.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="silver" size="sm">{app.role}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-silver">{app.company}</td>
                        <td className="px-6 py-4">
                          <Badge variant={statusConfig.variant as any} size="sm" className="gap-1.5">
                            <statusConfig.icon className="h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-16 bg-charcoal rounded-full overflow-hidden">
                              <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${app.score}%` }} />
                            </div>
                            <span className="text-sm font-medium text-white">{app.score}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{formatDate(app.submittedAt)}</td>
                        <td className="px-6 py-4 text-sm text-text-secondary">{app.referredBy || "—"}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setViewDetail(app.id)} className="p-2">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-2" onClick={() => alert("Editar")}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <div className="relative">
                              <Button variant="ghost" size="sm" className="p-2">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>Mostrando {filteredApplications.length} de {applications.length} candidaturas</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm" disabled>Próxima</Button>
          </div>
        </div>

        {viewDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm overflow-y-auto">
            <div className="glass rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gold/30">
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-obsidian z-10 py-4">
                <h2 className="font-display text-xl font-semibold text-white">Detalhe da candidatura</h2>
                <button onClick={() => setViewDetail(null)} className="p-2 text-text-secondary hover:text-white rounded-lg hover:bg-charcoal">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 glass rounded-xl">
                  <div>
                    <p className="text-sm text-text-secondary">ID da candidatura</p>
                    <p className="font-mono text-gold">{viewDetail}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="gold" size="lg">Em análise</Badge>
                    <Button variant="outline" size="sm" onClick={() => alert("Ver timeline")}>Histórico</Button>
                    <Button variant="gold" size="sm" onClick={() => alert("Aprovar")}>Aprovar</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="glass">
                      <CardHeader className="border-b border-border">
                        <CardTitle>Informações do candidato</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-sm text-text-secondary">Nome</p><p className="font-medium">João da Silva</p></div>
                          <div><p className="text-sm text-text-secondary">E-mail</p><p className="font-medium">joao@techventures.com.br</p></div>
                          <div><p className="text-sm text-text-secondary">Papel principal</p><p className="font-medium">Empresário</p></div>
                          <div><p className="text-sm text-text-secondary">Empresa</p><p className="font-medium">TechVentures Ltda</p></div>
                          <div><p className="text-sm text-text-secondary">Indicação</p><p className="font-medium">Maria Santos (Membro)</p></div>
                          <div><p className="text-sm text-text-secondary">Origem</p><p className="font-medium">LinkedIn</p></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass">
                      <CardHeader className="border-b border-border">
                        <CardTitle>Documentos anexados</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          { name: "CPF", status: "approved" },
                          { name: "Comprovante de residência", status: "approved" },
                          { name: "Contrato social da empresa", status: "pending" },
                          { name: "Declaração de IR", status: "pending" },
                        ].map((doc) => (
                          <div key={doc.name} className="flex items-center justify-between p-3 glass rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-text-secondary" />
                              <span className="text-sm text-silver">{doc.name}</span>
                            </div>
                            <Badge variant={doc.status === "approved" ? "emerald" : "gold"} size="sm">
                              {doc.status === "approved" ? "Aprovado" : "Pendente"}
                            </Badge>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full">Solicitar documentos adicionais</Button>
                      </CardContent>
                    </Card>

                    <Card className="glass">
                      <CardHeader className="border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <CardTitle>Entrevistas</CardTitle>
                        <Button variant="gold" size="sm">Agendar</Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-3 glass rounded-lg border border-gold/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Entrevista de screening</p>
                              <p className="text-sm text-text-secondary">Agendada: 20/01/2026 às 14:00 • 30 min</p>
                            </div>
                            <Badge variant="default" size="sm">Agendada</Badge>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <Button variant="outline" size="sm">Reagendar</Button>
                            <Button variant="ghost" size="sm" className="text-alert">Cancelar</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card className="glass">
                      <CardHeader className="border-b border-border">
                        <CardTitle className="flex items-center justify-between">
                          Notas internas
                          <Info className="h-4 w-4 text-gold" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-3 glass rounded-lg border border-alert/30 bg-alert/5">
                          <p className="text-sm font-medium text-alert mb-1">⚠️ Visível apenas para administradores</p>
                          <textarea
                            rows={4}
                            className="w-full bg-charcoal border border-border text-white placeholder-text-secondary rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none py-2.5 px-3.5 text-sm resize-y min-h-[80px]"
                            placeholder="Registre notas internas, impressões da entrevista, análise de compliance..."
                          />
                        </div>
                        <div className="space-y-2">
                          {[
                            { author: "Admin Master", time: "10/01 15:30", content: "Perfil forte em SaaS B2B. Histórico de exits consistente. Recomendo aprovação." },
                            { author: "Compliance", time: "12/01 09:15", content: "Documentação societária pendente. Solicitar contrato social atualizado." },
                          ].map((note, i) => (
                            <div key={i} className="p-3 glass rounded-lg border border-border">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm text-white">{note.author}</span>
                                <span className="text-xs text-text-secondary">{note.time}</span>
                              </div>
                              <p className="text-sm text-silver">{note.content}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass">
                      <CardHeader className="border-b border-border">
                        <CardTitle>Ações rápidas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="gold" className="w-full justify-start gap-2" onClick={() => alert("Aprovando...")}>
                          <CheckCircle className="h-4 w-4" />
                          Aprovar e converter em membro
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2 text-alert border-alert hover:bg-alert/5">
                          <XCircle className="h-4 w-4" />
                          Reprovar candidatura
                        </Button>
                        <Button variant="secondary" className="w-full justify-start gap-2" onClick={() => alert("Solicitando docs...")}>
                          <FileText className="h-4 w-4" />
                          Solicitar documentos
                        </Button>
                        <Button variant="secondary" className="w-full justify-start gap-2" onClick={() => alert("Agendando...")}>
                          <Calendar className="h-4 w-4" />
                          Agendar entrevista
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => alert("Enviando...")}>
                          <MessageSquare className="h-4 w-4" />
                          Enviar mensagem ao candidato
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}