"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  ArrowRight,
  DollarSign,
  MapPin,
  ShieldCheck,
  MessageSquare,
  FileText,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import {
  OpportunityItem,
  OpportunityQuestion,
  getStoredOpportunities,
  saveStoredOpportunities,
} from "@/lib/opportunities";
import { OpportunityDetailModal } from "@/components/opportunities/OpportunityDetailModal";

export function OpportunitiesShowcase() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
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

  // Exibir apenas as oportunidades aprovadas em destaque na home
  const featuredOpportunities = opportunities
    .filter((o) => o.approvalStatus === "approved" || !o.approvalStatus)
    .slice(0, 3);

  return (
    <section className="py-20 bg-charcoal/30 border-y border-border/60 relative overflow-hidden">
      {/* Luz ambiente dourada de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold" size="sm">
                <Sparkles className="h-3 w-3 mr-1" /> Vitrine Pública de Negócios
              </Badge>
              <span className="text-xs text-silver">Sem necessidade de login</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Oportunidades & Ativos dos Membros
            </h2>
            <p className="mt-2 text-silver text-sm sm:text-base max-w-2xl leading-relaxed">
              Explore o deal flow originado e validado pelos membros associados. Conecte-se diretamente com os criadores dos negócios.
            </p>
          </div>

          <Link href="/oportunidades">
            <Button variant="outline" className="gap-2 border-gold/40 text-gold hover:bg-gold/10 font-semibold text-sm">
              Ver Todas as Oportunidades ({opportunities.length}) <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Grid dos Cards de Oportunidades com Fotos e Autores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredOpportunities.map((opp) => (
            <Card
              key={opp.id}
              className="glass border-border/70 hover:border-gold/50 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between overflow-hidden group cursor-pointer"
              onClick={() => setSelectedOpp(opp)}
            >
              <div>
                {/* Foto do Ativo */}
                <div className="relative h-48 w-full bg-charcoal overflow-hidden">
                  <img
                    src={opp.imageUrl}
                    alt={opp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />

                  {/* Badge de Categoria */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-obsidian/85 text-gold border border-gold/30 text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur">
                      {opp.categoryIcon} {opp.categoryLabel}
                    </span>
                  </div>

                  {/* Status da Operação */}
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
                    <p className="font-display font-bold text-gold text-lg leading-tight">
                      {opp.volume}
                    </p>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <CardContent className="p-5 space-y-3.5">
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

                  {/* Identificação do Autor Criador */}
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
                      <ShieldCheck className="h-3 w-3" /> Verificado
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
                    setSelectedOpp(opp);
                  }}
                >
                  Ver Fotos, PDF & Chat <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Banner Inferior de Chamada */}
        <div className="mt-10 p-6 rounded-2xl bg-charcoal/60 border border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display font-semibold text-white text-base">
                Você é empresário ou investidor e deseja divulgar seus ativos?
              </p>
              <p className="text-xs text-silver mt-0.5">
                Membros associados têm vitrine exclusiva para originação de negócios e M&A.
              </p>
            </div>
          </div>
          <Link href="/candidatura">
            <Button variant="gold" size="sm" className="whitespace-nowrap font-semibold">
              Candidatar-se ao Clube
            </Button>
          </Link>
        </div>
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
    </section>
  );
}
