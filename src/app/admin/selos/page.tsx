"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import {
  Award,
  ShieldCheck,
  Plus,
  CheckCircle,
  Edit,
  Trash2,
  Search,
  Filter,
  Star,
  Crown,
  Zap,
  Gem,
  X,
  Info,
  Sparkles,
  Check,
  User,
  Calendar,
  Layers,
  CheckSquare,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export interface BadgeItem {
  id: string;
  kind: "verified_profile" | "founding_member" | "top_originator" | "specialist" | "investor_gold" | "honorary";
  label: string;
  description: string;
  memberName: string;
  memberEmail?: string;
  color: "gold" | "emerald" | "blue" | "amber" | "purple";
  iconName: "ShieldCheck" | "Award" | "Crown" | "Star" | "Zap" | "Gem";
  issuedAt: string;
  status: "active" | "suspended";
}

const initialBadges: BadgeItem[] = [
  {
    id: "b-1",
    kind: "verified_profile",
    label: "Perfil Verificado 100%",
    description: "Concedido após compliance integral, conferência jurídica e validação de antecedentes do executivo.",
    memberName: "Eduardo Silveira",
    memberEmail: "eduardo@silveiracapital.com",
    color: "emerald",
    iconName: "ShieldCheck",
    issuedAt: "2026-02-01",
    status: "active",
  },
  {
    id: "b-2",
    kind: "founding_member",
    label: "Membro Fundador",
    description: "Associado original pioneiro do Millennium Club com assento no Conselho de Admissão Estratégica.",
    memberName: "Patricia Mendes",
    memberEmail: "patricia@solarinvest.com.br",
    color: "gold",
    iconName: "Crown",
    issuedAt: "2026-01-10",
    status: "active",
  },
  {
    id: "b-3",
    kind: "top_originator",
    label: "Top Originador de Negócios",
    description: "Reconhecimento por alto volume de originação qualificada e transações concluídas no ecossistema.",
    memberName: "Carlos Oliveira",
    memberEmail: "carlos@investbr.com.br",
    color: "amber",
    iconName: "Zap",
    issuedAt: "2026-04-15",
    status: "active",
  },
  {
    id: "b-4",
    kind: "specialist",
    label: "Especialista M&A Hoteleiro",
    description: "Autoridade técnica de referência setorial com mais de R$ 500M transacionados em hospitalidade.",
    memberName: "Fernando Prado",
    memberEmail: "fprado@hotelariagroup.com",
    color: "purple",
    iconName: "Gem",
    issuedAt: "2026-05-20",
    status: "active",
  },
  {
    id: "b-5",
    kind: "investor_gold",
    label: "Investidor Qualificado Tier 1",
    description: "Tese comprovada de alocação de capital em rodadas privadas, co-investimentos e dívida estruturada.",
    memberName: "Ricardo Mendes",
    memberEmail: "ricardo@financeira.com.br",
    color: "gold",
    iconName: "Star",
    issuedAt: "2026-03-12",
    status: "active",
  },
  {
    id: "b-6",
    kind: "specialist",
    label: "Líder ESG & Transição Energética",
    description: "Destaque em práticas de sustentabilidade, créditos de carbono e governança corporativa limpa.",
    memberName: "Carla Antunes",
    memberEmail: "carla@ecocarbon.org",
    color: "blue",
    iconName: "Award",
    issuedAt: "2026-03-05",
    status: "active",
  },
];

const categoryLabels: Record<string, string> = {
  all: "Todas as categorias",
  verified_profile: "Perfil Verificado",
  founding_member: "Membro Fundador",
  top_originator: "Top Originador",
  specialist: "Especialista Setorial",
  investor_gold: "Investidor Tier 1",
  honorary: "Benemérito & Honraria",
};

export default function AdminSelosPage() {
  const [badges, setBadges] = useState<BadgeItem[]>(initialBadges);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Controle do modal (Criar ou Editar)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulário do modal
  const [formData, setFormData] = useState<{
    label: string;
    kind: BadgeItem["kind"];
    description: string;
    memberName: string;
    memberEmail: string;
    color: BadgeItem["color"];
    iconName: BadgeItem["iconName"];
    status: BadgeItem["status"];
  }>({
    label: "",
    kind: "verified_profile",
    description: "",
    memberName: "",
    memberEmail: "",
    color: "gold",
    iconName: "ShieldCheck",
    status: "active",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Carrega do localStorage ao montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mc_badges_list_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBadges(parsed);
        }
      }
    } catch (e) {
      console.warn("Falha ao recuperar selos locais:", e);
    }
  }, []);

  // Salva no localStorage sempre que houver alteração
  const persistBadges = (newBadges: BadgeItem[]) => {
    setBadges(newBadges);
    try {
      localStorage.setItem("mc_badges_list_v1", JSON.stringify(newBadges));
    } catch (e) {
      console.warn("Falha ao salvar selos no localStorage:", e);
    }
  };

  // Abre modal para criação
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      label: "",
      kind: "verified_profile",
      description: "",
      memberName: "",
      memberEmail: "",
      color: "gold",
      iconName: "ShieldCheck",
      status: "active",
    });
    setIsModalOpen(true);
  };

  // Abre modal para edição
  const handleOpenEdit = (badge: BadgeItem) => {
    setEditingId(badge.id);
    setFormData({
      label: badge.label,
      kind: badge.kind,
      description: badge.description,
      memberName: badge.memberName,
      memberEmail: badge.memberEmail || "",
      color: badge.color,
      iconName: badge.iconName,
      status: badge.status,
    });
    setIsModalOpen(true);
  };

  // Submissão do formulário (Criar ou Atualizar)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim() || !formData.memberName.trim()) {
      alert("Por favor, preencha o nome do selo e o membro associado.");
      return;
    }

    if (editingId) {
      // Edição de selo existente
      const updated = badges.map((b) =>
        b.id === editingId
          ? {
              ...b,
              label: formData.label.trim(),
              kind: formData.kind,
              description: formData.description.trim(),
              memberName: formData.memberName.trim(),
              memberEmail: formData.memberEmail.trim(),
              color: formData.color,
              iconName: formData.iconName,
              status: formData.status,
            }
          : b
      );
      persistBadges(updated);
      showToast(`Selo "${formData.label}" atualizado com sucesso!`);
    } else {
      // Criação de novo selo
      const newBadge: BadgeItem = {
        id: `b-${Date.now()}`,
        label: formData.label.trim(),
        kind: formData.kind,
        description: formData.description.trim() || "Selo oficial atribuído pelo comitê do Millennium Club.",
        memberName: formData.memberName.trim(),
        memberEmail: formData.memberEmail.trim(),
        color: formData.color,
        iconName: formData.iconName,
        issuedAt: new Date().toISOString().split("T")[0],
        status: formData.status,
      };
      persistBadges([newBadge, ...badges]);
      showToast(`Novo selo "${newBadge.label}" criado com sucesso!`);
    }

    setIsModalOpen(false);
  };

  // Excluir selo
  const handleDelete = (id: string, label: string) => {
    if (confirm(`Tem certeza que deseja excluir o selo "${label}"?`)) {
      const remaining = badges.filter((b) => b.id !== id);
      persistBadges(remaining);
      showToast(`Selo "${label}" excluído.`);
    }
  };

  // Alternar status ativo/suspenso
  const handleToggleStatus = (id: string) => {
    const updated = badges.map((b) =>
      b.id === id ? { ...b, status: (b.status === "active" ? "suspended" : "active") as BadgeItem["status"] } : b
    );
    persistBadges(updated);
    showToast("Status do selo alterado com sucesso!");
  };

  // Filtros de busca
  const filteredBadges = useMemo(() => {
    return badges.filter((b) => {
      const matchSearch =
        !search ||
        b.label.toLowerCase().includes(search.toLowerCase()) ||
        b.memberName.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase());

      const matchCategory = categoryFilter === "all" || b.kind === categoryFilter;
      const matchStatus = statusFilter === "all" || b.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [badges, search, categoryFilter, statusFilter]);

  // Renderizador de ícone dinâmico
  const renderIcon = (iconName: BadgeItem["iconName"], className = "h-5 w-5") => {
    switch (iconName) {
      case "Crown":
        return <Crown className={className} />;
      case "Star":
        return <Star className={className} />;
      case "Zap":
        return <Zap className={className} />;
      case "Gem":
        return <Gem className={className} />;
      case "Award":
        return <Award className={className} />;
      case "ShieldCheck":
      default:
        return <ShieldCheck className={className} />;
    }
  };

  // Renderizador de cores e estilos
  const getColorStyles = (color: BadgeItem["color"]) => {
    switch (color) {
      case "emerald":
        return {
          bg: "bg-emerald/10",
          border: "border-emerald/40",
          text: "text-emerald",
          badgeVariant: "emerald" as const,
        };
      case "blue":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/40",
          text: "text-blue-400",
          badgeVariant: "outline" as const,
        };
      case "amber":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/40",
          text: "text-amber-400",
          badgeVariant: "alert" as const,
        };
      case "purple":
        return {
          bg: "bg-purple-500/10",
          border: "border-purple-500/40",
          text: "text-purple-400",
          badgeVariant: "outline" as const,
        };
      case "gold":
      default:
        return {
          bg: "bg-gold/10",
          border: "border-gold/40",
          text: "text-gold",
          badgeVariant: "gold" as const,
        };
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Toast Flutuante */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-charcoal/95 border border-gold/40 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle className="h-5 w-5 text-emerald shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-text-secondary hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <Award className="h-7 w-7 text-gold" /> Emissão & Gestão de Selos
          </h1>
          <p className="text-silver text-sm mt-1">
            Crie novos selos de autoridade, edite os existentes e atribua certificações aos associados do clube.
          </p>
        </div>
        <Button variant="gold" onClick={handleOpenCreate} className="gap-2 shadow-lg">
          <Plus className="h-4 w-4" /> Criar Novo Selo
        </Button>
      </div>

      {/* Métricas e Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary">Total de Selos</p>
              <p className="font-display text-2xl font-bold text-white mt-0.5">{badges.length}</p>
            </div>
            <Award className="h-7 w-7 text-gold/30" />
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary">Selos Ativos</p>
              <p className="font-display text-2xl font-bold text-emerald mt-0.5">
                {badges.filter((b) => b.status === "active").length}
              </p>
            </div>
            <CheckCircle className="h-7 w-7 text-emerald/30" />
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary">Membros Distintos</p>
              <p className="font-display text-2xl font-bold text-gold mt-0.5">
                {new Set(badges.map((b) => b.memberName)).size}
              </p>
            </div>
            <User className="h-7 w-7 text-gold/30" />
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary">Categorias</p>
              <p className="font-display text-2xl font-bold text-purple-400 mt-0.5">
                {new Set(badges.map((b) => b.kind)).size}
              </p>
            </div>
            <Layers className="h-7 w-7 text-purple-400/30" />
          </CardContent>
        </Card>
      </div>

      {/* Barra de Busca e Filtros */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Buscar por título do selo, membro ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 text-sm"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-48 bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none h-10 px-3 text-sm appearance-none cursor-pointer"
            >
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-36 bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none h-10 px-3 text-sm appearance-none cursor-pointer"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativos</option>
              <option value="suspended">Suspensos</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Cards dos Selos */}
      {filteredBadges.length === 0 ? (
        <Card className="glass py-12 text-center">
          <CardContent className="flex flex-col items-center justify-center gap-3">
            <Award className="h-10 w-10 text-silver/40" />
            <p className="text-white font-medium">Nenhum selo encontrado com os filtros selecionados.</p>
            <Button variant="outline" size="sm" onClick={() => { setSearch(""); setCategoryFilter("all"); setStatusFilter("all"); }}>
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBadges.map((badge) => {
            const styles = getColorStyles(badge.color);
            return (
              <Card
                key={badge.id}
                className={cn(
                  "glass relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gold/50 flex flex-col justify-between group",
                  badge.status === "suspended" && "opacity-75"
                )}
              >
                <div>
                  <CardHeader className="p-5 border-b border-border/60 flex flex-row items-center justify-between bg-charcoal/40">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-11 w-11 rounded-xl flex items-center justify-center border shadow-inner",
                          styles.bg,
                          styles.border,
                          styles.text
                        )}
                      >
                        {renderIcon(badge.iconName, "h-6 w-6")}
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold tracking-wider text-text-secondary uppercase">
                          {categoryLabels[badge.kind] || badge.kind}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-silver/70">#{badge.id}</span>
                        </div>
                      </div>
                    </div>

                    <Badge
                      variant={badge.status === "active" ? "emerald" : "alert"}
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => handleToggleStatus(badge.id)}
                      title="Clique para alternar status"
                    >
                      {badge.status === "active" ? "Ativo" : "Suspenso"}
                    </Badge>
                  </CardHeader>

                  <CardContent className="p-5 space-y-3.5">
                    <div>
                      <h3 className="font-display font-bold text-white text-base group-hover:text-gold transition-colors">
                        {badge.label}
                      </h3>
                      <p className="text-xs text-silver mt-1 leading-relaxed line-clamp-3">
                        {badge.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/40 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-gold" /> Titular:
                        </span>
                        <strong className="text-white font-medium">{badge.memberName}</strong>
                      </div>
                      {badge.memberEmail && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-text-secondary">E-mail:</span>
                          <span className="text-silver truncate max-w-[180px]">{badge.memberEmail}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-text-secondary flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-silver/60" /> Emitido:
                        </span>
                        <span className="text-silver">{badge.issuedAt}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Barra de Ações do Card */}
                <div className="p-4 bg-charcoal/30 border-t border-border/60 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(badge)}
                    className="flex-1 text-xs gap-1.5 h-8 border-gold/40 text-gold hover:bg-gold/15"
                  >
                    <Edit className="h-3.5 w-3.5" /> Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(badge.id, badge.label)}
                    className="h-8 px-2.5 text-alert hover:bg-alert/10"
                    title="Excluir selo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* MODAL PARA CRIAR OU EDITAR SELO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian/85 backdrop-blur-md overflow-y-auto">
          <div className="glass rounded-2xl p-5 sm:p-7 w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-fade-in border border-gold/40 shadow-2xl">
            {/* Header do Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                  {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-white">
                    {editingId ? "Editar Selo de Autoridade" : "Criar & Emitir Novo Selo"}
                  </h2>
                  <p className="text-xs text-silver">
                    {editingId
                      ? "Atualize as informações, membros titulares ou critérios do selo."
                      : "Defina os dados, design e atribuição do novo selo executivo."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-text-secondary hover:text-white rounded-lg hover:bg-charcoal transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4 my-5">
              {/* Título do Selo */}
              <div>
                <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                  Título / Nome do Selo *
                </label>
                <Input
                  required
                  placeholder="Ex: Membro Fundador, Perfil Verificado 100%, Top Dealmaker..."
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="h-10 text-sm"
                />
              </div>

              {/* Grid: Categoria e Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                    Categoria do Selo
                  </label>
                  <select
                    value={formData.kind}
                    onChange={(e) => setFormData({ ...formData, kind: e.target.value as BadgeItem["kind"] })}
                    className="w-full bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none h-10 px-3 text-sm appearance-none cursor-pointer"
                  >
                    <option value="verified_profile">Perfil Verificado (Compliance)</option>
                    <option value="founding_member">Membro Fundador (Conselho)</option>
                    <option value="top_originator">Top Originador de Negócios</option>
                    <option value="specialist">Especialista Setorial</option>
                    <option value="investor_gold">Investidor Qualificado Tier 1</option>
                    <option value="honorary">Membro Benemérito / Honraria</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                    Status de Validade
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as BadgeItem["status"] })}
                    className="w-full bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none h-10 px-3 text-sm appearance-none cursor-pointer"
                  >
                    <option value="active">Ativo (Válido)</option>
                    <option value="suspended">Suspenso / Em Revisão</option>
                  </select>
                </div>
              </div>

              {/* Grid: Membro Titular e E-mail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                    Nome do Membro Titular *
                  </label>
                  <Input
                    required
                    placeholder="Ex: Eduardo Silveira, Patricia Mendes..."
                    value={formData.memberName}
                    onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
                    className="h-10 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                    E-mail do Membro (Opcional)
                  </label>
                  <Input
                    type="email"
                    placeholder="exemplo@empresa.com.br"
                    value={formData.memberEmail}
                    onChange={(e) => setFormData({ ...formData, memberEmail: e.target.value })}
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              {/* Descrição / Critério */}
              <div>
                <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                  Descrição & Critério de Atribuição
                </label>
                <textarea
                  rows={3}
                  placeholder="Explique o motivo da concessão, requisitos atingidos e mérito demonstrado..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-charcoal border border-border text-white placeholder-text-secondary rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none p-3 text-sm resize-none"
                />
              </div>

              {/* Grid: Ícone e Cor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1.5">
                    Ícone Representativo
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {(["ShieldCheck", "Crown", "Star", "Zap", "Gem", "Award"] as const).map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setFormData({ ...formData, iconName: ic })}
                        className={cn(
                          "h-10 rounded-xl border flex items-center justify-center transition-all",
                          formData.iconName === ic
                            ? "border-gold bg-gold/20 text-gold shadow-md"
                            : "border-border bg-charcoal text-silver hover:border-gold/40"
                        )}
                        title={ic}
                      >
                        {renderIcon(ic, "h-5 w-5")}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1.5">
                    Cor & Destaque
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {(
                      [
                        { key: "gold", label: "Dourado", class: "bg-gold border-gold" },
                        { key: "emerald", label: "Esmeralda", class: "bg-emerald border-emerald" },
                        { key: "blue", label: "Azul", class: "bg-blue-500 border-blue-500" },
                        { key: "amber", label: "Âmbar", class: "bg-amber-500 border-amber-500" },
                        { key: "purple", label: "Púrpura", class: "bg-purple-500 border-purple-500" },
                      ] as const
                    ).map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: c.key })}
                        className={cn(
                          "h-10 rounded-xl border flex items-center justify-center transition-all text-xs font-bold",
                          formData.color === c.key
                            ? "ring-2 ring-white ring-offset-2 ring-offset-obsidian"
                            : "opacity-70 hover:opacity-100"
                        )}
                        style={{
                          backgroundColor:
                            c.key === "gold"
                              ? "#C5A059"
                              : c.key === "emerald"
                              ? "#10B981"
                              : c.key === "blue"
                              ? "#3B82F6"
                              : c.key === "amber"
                              ? "#F59E0B"
                              : "#A855F7",
                        }}
                        title={c.label}
                      >
                        {formData.color === c.key && <Check className="h-4 w-4 text-obsidian stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pré-visualização ao Vivo (Live Preview) */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-gold" /> Pré-visualização ao Vivo do Selo
                </p>
                <div className="p-3.5 rounded-xl bg-charcoal/60 border border-gold/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center border",
                        getColorStyles(formData.color).bg,
                        getColorStyles(formData.color).border,
                        getColorStyles(formData.color).text
                      )}
                    >
                      {renderIcon(formData.iconName, "h-5 w-5")}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {formData.label || "Nome do Selo"}
                      </p>
                      <p className="text-xs text-silver">
                        Titular: <strong className="text-gold">{formData.memberName || "Nome do Membro"}</strong>
                      </p>
                    </div>
                  </div>
                  <Badge variant={formData.status === "active" ? "emerald" : "alert"} size="sm">
                    {formData.status === "active" ? "Ativo" : "Suspenso"}
                  </Badge>
                </div>
              </div>

              {/* Botões do Rodapé */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="gold" className="gap-2">
                  <Check className="h-4 w-4" />
                  {editingId ? "Salvar Alterações" : "Emitir Selo"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
