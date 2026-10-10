"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
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
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  OpportunityItem,
  OpportunityQuestion,
  opportunityCategories,
  getStoredOpportunities,
  saveStoredOpportunities,
} from "@/lib/opportunities";
import { OpportunityDetailModal } from "@/components/opportunities/OpportunityDetailModal";

export default function PublicOportunidadesPage() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);

  useEffect(() => {
    setOpportunities(getStoredOpportunities());
  }, []);

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

    if (selectedOpp && selectedOpp.id === oppId) {
      setSelectedOpp(updated.find((o) => o.id === oppId) || null);
    }
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
    <>
      <Header />

      <main className="min-h-screen pt-28 pb-20 bg-obsidian text-white relative">
        {/* Fundo sutil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gold/5 blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          {/* Cabeçalho Público */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/70">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="gold" size="sm">
                  <Sparkles className="h-3 w-3 mr-1" /> Vitrine Pública Aberta
                </Badge>
                <span className="text-xs text-silver">Acesso livre sem necessidade de login</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Galeria de Oportunidades & Negócios
              </h1>
              <p className="mt-2 text-silver text-sm sm:text-base max-w-3xl leading-relaxed">
                Originação qualificada de ativos de alto valor, M&A, usinas de energia solar, frotas, hotéis e créditos de carbono originados por membros executivos do Millennium Club.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/app/oportunidades">
                <Button variant="gold" className="gap-2 text-xs font-semibold shadow-lg">
                  <Plus className="h-4 w-4" /> Publicar Oportunidade (Membros)
                </Button>
              </Link>
            </div>
          </div>

          {/* Barra de Busca e Filtros */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  placeholder="Buscar ativo por palavra-chave, cidade, criador ou empresa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 text-sm bg-charcoal border-border"
                />
              </div>

              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="h-11 px-4 text-xs"
                >
                  Limpar Busca
                </Button>
              )}
            </div>

            {/* Categorias em Pílulas */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {opportunityCategories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border shrink-0",
                      isActive
                        ? "bg-gold text-obsidian font-bold border-gold shadow-md"
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

          {/* Contador de Oportunidades */}
          <div className="flex items-center justify-between text-xs text-silver">
            <span>
              Exibindo <strong className="text-white">{filteredOpportunities.length}</strong> negócios ativos
            </span>
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-gold hover:underline"
              >
                Ver todas as categorias
              </button>
            )}
          </div>

          {/* Grid de Oportunidades */}
          {filteredOpportunities.length === 0 ? (
            <Card className="glass text-center p-14 space-y-4">
              <div className="h-12 w-12 rounded-full bg-charcoal border border-border flex items-center justify-center text-text-secondary mx-auto">
                <Filter className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">Nenhum ativo encontrado</h3>
              <p className="text-silver text-sm max-w-md mx-auto">
                Tente outros termos de busca ou selecione outra categoria de negócios acima.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
              >
                Limpar Todos os Filtros
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opp) => (
                <Card
                  key={opp.id}
                  className="glass border-border/70 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedOpp(opp)}
                >
                  <div>
                    {/* Imagem de Capa */}
                    <div className="relative h-52 w-full bg-charcoal overflow-hidden">
                      <img
                        src={opp.imageUrl}
                        alt={opp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-85" />

                      {/* Categoria */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-obsidian/90 text-gold border border-gold/40 text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur shadow-md">
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
                      <div className="absolute bottom-3 left-3">
                        <p className="text-[11px] text-text-secondary">Volume Estimado</p>
                        <p className="font-display font-bold text-gold text-xl leading-tight">
                          {opp.volume}
                        </p>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <CardContent className="p-5 space-y-3.5">
                      <h3 className="font-display font-bold text-white text-base group-hover:text-gold transition-colors line-clamp-2">
                        {opp.title}
                      </h3>

                      <div className="flex items-center text-xs text-silver gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-silver/80 shrink-0" />
                        <span className="truncate">{opp.location}</span>
                      </div>

                      <p className="text-xs text-silver line-clamp-3 leading-relaxed">
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

                  {/* Ação */}
                  <div className="px-5 pb-5 pt-0">
                    <Button
                      variant="gold"
                      size="sm"
                      className="w-full justify-center text-xs font-semibold gap-1.5 shadow"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOpp(opp);
                      }}
                    >
                      Ver Fotos, PDF & Fazer Pergunta <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Detalhes da Oportunidade com Fotos, PDF e Chat */}
        {selectedOpp && (
          <OpportunityDetailModal
            opportunity={selectedOpp}
            onClose={() => setSelectedOpp(null)}
            onAddQuestion={handleAddQuestion}
            isMemberLoggedIn={false}
          />
        )}
      </main>

      <Footer />
    </>
  );
}
