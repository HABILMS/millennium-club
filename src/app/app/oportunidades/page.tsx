"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  DollarSign,
  MapPin,
  ShieldCheck,
  MessageSquare,
  FileText,
  ArrowUpRight,
  Sparkles,
  Plus,
  CheckCircle,
  X,
  Layers,
  Upload,
} from "lucide-react";
import {
  OpportunityItem,
  OpportunityQuestion,
  opportunityCategories,
  getStoredOpportunities,
  saveStoredOpportunities,
} from "@/lib/opportunities";
import { OpportunityDetailModal } from "@/components/opportunities/OpportunityDetailModal";
import { NewOpportunityModal } from "@/components/opportunities/NewOpportunityModal";

export default function OportunidadesMemberPage() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalOpp, setActiveModalOpp] = useState<OpportunityItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  useEffect(() => {
    setOpportunities(getStoredOpportunities());
  }, []);

  const handleCreateOpportunity = (newOpp: OpportunityItem) => {
    const updated = [newOpp, ...opportunities];
    setOpportunities(updated);
    saveStoredOpportunities(updated);
    showToast(`Oportunidade "${newOpp.title}" publicada com sucesso e já visível na galeria pública!`);
  };

  const handleAddQuestion = (oppId: string, question: Omit<OpportunityQuestion, "id" | "sentAt">) => {
    const updated = opportunities.map((opp) => {
      if (opp.id === oppId) {
        const newQuestion: OpportunityQuestion = {
          id: `q-${Date.now()}`,
          sentAt: new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          ...question,
        };
        return {
          ...opp,
          questions: [newQuestion, ...(opp.questions || [])],
        };
      }
      return opp;
    });

    setOpportunities(updated);
    saveStoredOpportunities(updated);

    if (activeModalOpp && activeModalOpp.id === oppId) {
      setActiveModalOpp(updated.find((o) => o.id === oppId) || null);
    }
    showToast("Pergunta enviada ao criador do negócio com sucesso!");
  };

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesCategory = selectedCategory === "all" || opp.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opp.author?.name && opp.author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (opp.author?.company && opp.author.company.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [opportunities, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 animate-fade-up">
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

      {/* Header da Galeria do Portal do Membro */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Deal Flow & Originação Exclusiva
            </Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Galeria de Oportunidades & Negócios
          </h1>
          <p className="mt-1 text-silver text-sm max-w-2xl">
            Ativos de alto valor originados pelos membros associados. Como membro aprovado, você pode publicar suas oportunidades para todo o clube e para a vitrine pública aberta.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="gold"
            onClick={() => setIsNewModalOpen(true)}
            className="gap-2 font-semibold shadow-lg text-sm"
          >
            <Plus className="h-4 w-4" /> Publicar Nova Oportunidade
          </Button>
        </div>
      </div>

      {/* Busca e Categorias */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              type="text"
              placeholder="Buscar ativo por tese, criador, cidade ou valor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 text-sm bg-charcoal border-border text-white"
            />
          </div>

          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="h-11 px-4 text-xs"
            >
              Limpar
            </Button>
          )}
        </div>

        {/* Abas de Categorias */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {opportunityCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border shrink-0",
                  isActive
                    ? "bg-gold text-obsidian font-bold border-gold shadow-lg"
                    : "bg-charcoal/60 text-silver border-border hover:bg-charcoal hover:border-gold/30 hover:text-white"
                )}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Cards de Oportunidades com Fotos e Autores */}
      {filteredOpportunities.length === 0 ? (
        <Card className="glass text-center p-12 space-y-4">
          <div className="h-12 w-12 rounded-full bg-charcoal border border-border flex items-center justify-center text-text-secondary mx-auto">
            <Filter className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-semibold text-white">Nenhuma oportunidade encontrada</h3>
          <p className="text-silver text-sm max-w-md mx-auto">
            Tente buscar com outros termos ou seja o primeiro a publicar um negócio nesta categoria!
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}>
              Limpar filtros
            </Button>
            <Button variant="gold" size="sm" onClick={() => setIsNewModalOpen(true)}>
              Publicar Oportunidade
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => (
            <Card
              key={opp.id}
              className="glass border-border/70 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between overflow-hidden group cursor-pointer"
              onClick={() => setActiveModalOpp(opp)}
            >
              <div>
                {/* Foto do Ativo */}
                <div className="relative h-48 w-full bg-charcoal overflow-hidden">
                  <img
                    src={opp.imageUrl}
                    alt={opp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-85" />

                  {/* Categoria */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-obsidian/85 text-gold border border-gold/40 text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur">
                      {opp.categoryIcon} {opp.categoryLabel}
                    </span>
                  </div>

                  {/* Estágio */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur uppercase",
                        opp.stage === "Ativa" && "bg-emerald/90 text-white border-emerald/50",
                        opp.stage === "Em Negociação" && "bg-amber-500/90 text-white border-amber-500/50",
                        opp.stage === "Nova Originação" && "bg-blue-600/90 text-white border-blue-500/50",
                        opp.stage === "NDA Requerido" && "bg-purple-600/90 text-white border-purple-500/50"
                      )}
                    >
                      {opp.stage}
                    </span>
                  </div>

                  {/* Volume Estimado */}
                  <div className="absolute bottom-2.5 left-3">
                    <p className="text-[11px] text-text-secondary">Volume Estimado</p>
                    <p className="font-display font-bold text-gold text-xl leading-tight">
                      {opp.volume}
                    </p>
                  </div>
                </div>

                {/* Conteúdo */}
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-display font-bold text-white text-base group-hover:text-gold transition-colors line-clamp-2">
                    {opp.title}
                  </h3>

                  <div className="flex items-center text-xs text-silver gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-silver/80 shrink-0" />
                    <span className="truncate">{opp.location}</span>
                  </div>

                  <p className="text-xs text-silver line-clamp-2 leading-relaxed">
                    {opp.summary}
                  </p>

                  {/* Autor Devidamente Identificado */}
                  <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-gold/15 text-gold border border-gold/30 flex items-center justify-center font-bold text-xs shrink-0">
                        {opp.author?.name ? opp.author.name[0] : "M"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {opp.author?.name}
                        </p>
                        <p className="text-[10px] text-silver truncate">
                          {opp.author?.company}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] bg-gold/10 text-gold border border-gold/30 px-2 py-0.5 rounded-full font-medium shrink-0 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> {opp.author?.badge || "Verificado"}
                    </span>
                  </div>
                </CardContent>
              </div>

              {/* Rodapé com Botão */}
              <div className="px-5 pb-5 pt-0">
                <Button
                  variant="gold"
                  size="sm"
                  className="w-full justify-center text-xs font-semibold gap-1.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModalOpp(opp);
                  }}
                >
                  Ver Fotos, PDF & Chat com Criador <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Detalhes da Oportunidade com Fotos, PDF e Chat */}
      {activeModalOpp && (
        <OpportunityDetailModal
          opportunity={activeModalOpp}
          onClose={() => setActiveModalOpp(null)}
          onAddQuestion={handleAddQuestion}
          isMemberLoggedIn={true}
        />
      )}

      {/* Modal para Membro Publicar Nova Oportunidade */}
      {isNewModalOpen && (
        <NewOpportunityModal
          onClose={() => setIsNewModalOpen(false)}
          onSave={handleCreateOpportunity}
          defaultAuthorName="Membro Associado"
          defaultCompanyName="Minha Empresa"
        />
      )}
    </div>
  );
}
