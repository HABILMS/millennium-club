"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Briefcase,
  Building2,
  DollarSign,
  MapPin,
  Lock,
  ArrowUpRight,
  Sparkles,
  CheckCircle,
  X,
  FileCheck2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export interface OpportunityItem {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  categoryIcon: string;
  volume: string;
  location: string;
  stage: "Ativa" | "Em Negociação" | "Nova Originação" | "NDA Requerido";
  summary: string;
  details: string;
  highlights: string[];
}

const categoriesList = [
  { id: "all", label: "Todas as Oportunidades", icon: "💎" },
  { id: "automoveis", label: "Automóveis & Frotas", icon: "🚗" },
  { id: "aeronaves", label: "Aeronaves", icon: "✈️" },
  { id: "usinas_rsu", label: "Usinas de RSU", icon: "♻️" },
  { id: "credito_carbono", label: "Crédito de Carbono (Compra/Venda)", icon: "🌿" },
  { id: "venda_usina_solar", label: "Venda de Usina Solar", icon: "☀️" },
  { id: "credito_solar", label: "Venda de Crédito Solar", icon: "⚡" },
  { id: "passivo_solar", label: "Passivo Energia Solar", icon: "🔋" },
  { id: "venda_hoteis", label: "Venda de Redes de Hotéis", icon: "🏨" },
  { id: "compra_hoteis", label: "Compra de Redes de Hotéis", icon: "🏢" },
  { id: "socio_projetos", label: "Sócio para Projetos (M&A)", icon: "🤝" },
];

const mockOpportunities: OpportunityItem[] = [
  {
    id: "opp-1",
    title: "Venda de Parque Solar Operacional 15MWp",
    category: "venda_usina_solar",
    categoryLabel: "Venda de Usina Solar",
    categoryIcon: "☀️",
    volume: "R$ 48.000.000",
    location: "Minas Gerais, Brasil",
    stage: "Ativa",
    summary: "Parque fotovoltaico em operação com contrato PPA firmado de 15 anos. Retorno projetado acima do CDI + 6.5% a.a.",
    details: "Usina com outorga aprovada, conexão na rede de média tensão concluída e receita contratada em modalidade autoconsumo remoto.",
    highlights: ["15 MWp de potência", "PPA de 15 anos", "Geração pronta com EBITDA R$ 6.2M"],
  },
  {
    id: "opp-2",
    title: "Portfólio de 500.000 Créditos de Carbono VERRA",
    category: "credito_carbono",
    categoryLabel: "Crédito de Carbono",
    categoryIcon: "🌿",
    volume: "US$ 6.500.000",
    location: "Amazonia Legal",
    stage: "Ativa",
    summary: "Lote de créditos de preservação florestal (REDD+) auditados pela certificadora internacional Verra (VCS).",
    details: "Disponível para venda imediata com documentação de custódia e rastreabilidade pronta para aposentadoria ou comercialização.",
    highlights: ["Certificação Verra VCS", "Auditado por terceira parte", "Vintage recente 2024/2025"],
  },
  {
    id: "opp-3",
    title: "Venda de Rede de Hotéis Boutique (4 Propriedades)",
    category: "venda_hoteis",
    categoryLabel: "Venda de Redes de Hotéis",
    categoryIcon: "🏨",
    volume: "R$ 125.000.000",
    location: "Nordeste & Serra Gaúcha",
    stage: "Em Negociação",
    summary: "Grupo hoteleiro premium com alta taxa de ocupação, marca consolidada e imóveis próprios livres de ônus.",
    details: "Operação completa incluindo gestão, equipe, sistema de reservas direto e margem EBITDA de 32%.",
    highlights: ["Imóveis próprios", "EBITDA R$ 18.5M/ano", "Taxa média ocupação 78%"],
  },
  {
    id: "opp-4",
    title: "Aeronave Executiva Embraer Phenom 300E (2022)",
    category: "aeronaves",
    categoryLabel: "Aeronaves",
    categoryIcon: "✈️",
    volume: "US$ 11.800.000",
    location: "São Paulo, SP",
    stage: "Ativa",
    summary: "Aeronave com poucas horas de voo, programa de manutenção de motores pago e interior executivo 10/10.",
    details: "Único dono, sem histórico de incidentes, configurado para 9 passageiros com aviônica Garmin Prodigy Touch.",
    highlights: ["Apenas 450 horas totais", "Garmin Prodigy Touch", "Tap Blue Engine Program"],
  },
  {
    id: "opp-5",
    title: "Usina de Triagem e Valorização RSU (Lixo em Energia)",
    category: "usinas_rsu",
    categoryLabel: "Usinas de RSU",
    categoryIcon: "♻️",
    volume: "R$ 85.000.000",
    location: "Interior de São Paulo",
    stage: "Nova Originação",
    summary: "Projeto aprovado de usina de biodigestão e pirólise para processamento de 500 toneladas/dia de lixo urbano.",
    details: "Contrato de concessão municipal de 30 anos firmado com receita de gatilho de tippage fee + venda de energia limpa.",
    highlights: ["Concessão de 30 anos", "500t/dia garantidas", "TIR estimada de 19% a.a."],
  },
  {
    id: "opp-6",
    title: "Procura de Rede Hoteleira para Compra (Buy-Side Mandate)",
    category: "compra_hoteis",
    categoryLabel: "Compra de Redes de Hotéis",
    categoryIcon: "🏢",
    volume: "R$ 200.000.000",
    location: "Capitais & Centros Financeiros",
    stage: "NDA Requerido",
    summary: "Fundo imobiliário comprador busca redes de hotéis midscale ou corporativos com no mínimo 150 chaves.",
    details: "Mandato de compra exclusivo com capital integralizado pronto para liquidação e due diligence ágil.",
    highlights: ["Fundo comprador ativado", "Ticket disponível até R$ 200M", "Prefere gestão mantida"],
  },
  {
    id: "opp-7",
    title: "Sócio Estratégico para Projeto Eólico / H2 Verde 100MW",
    category: "socio_projetos",
    categoryLabel: "Sócio para Projetos",
    categoryIcon: "🤝",
    volume: "R$ 350.000.000",
    location: "Ceará, Brasil",
    stage: "Ativa",
    summary: "Busca de sócio investidor ou co-desenvolvedor para equity de 40% em complexo de Hidrogênio Verde e Eólico.",
    details: "Licença prévia de meio ambiente (LP) concedida, estudo de vento de 3 anos concluído e memorando de entendimento com porto marinho.",
    highlights: ["40% Equity disponível", "LP aprovada", "MOU de Offtake assinado"],
  },
  {
    id: "opp-8",
    title: "Lote de Créditos de Geração Solar para Aquisição",
    category: "credito_solar",
    categoryLabel: "Venda de Crédito Solar",
    categoryIcon: "⚡",
    volume: "R$ 18.000.000",
    location: "Goiás & DF",
    stage: "Ativa",
    summary: "Desconto estruturado de faturas de energia para carteira de clientes corporativos A/B.",
    details: "Geração distribuída compartilhada com receita mensal garantida e inadimplência histórica menor que 0,4%.",
    highlights: ["Desconto 18% na tarifa", "Geração 8MWp", "Receita garantida em custódia"],
  },
  {
    id: "opp-9",
    title: "Reestruturação e Venda de Passivo Solar GD",
    category: "passivo_solar",
    categoryLabel: "Passivo Energia Solar",
    categoryIcon: "🔋",
    volume: "R$ 22.000.000",
    location: "Bahia, Brasil",
    stage: "Em Negociação",
    summary: "Oportunidade distress em ativos de geração distribuída com necessidade de repactuação financeira e turn-around.",
    details: "Ativo com capacidade instalada de 12MW com grande desconto de valuation para investidores especializados em turn-around.",
    highlights: ["Valuation com 45% desconto", "Usinas construídas", "Turn-around de contratos"],
  },
  {
    id: "opp-10",
    title: "Frota de 40 Veículos Utilitários e Blindados Executivos",
    category: "automoveis",
    categoryLabel: "Automóveis & Frotas",
    categoryIcon: "🚗",
    volume: "R$ 14.500.000",
    location: "São Paulo & Rio de Janeiro",
    stage: "Ativa",
    summary: "Venda em lote de frota corporativa de SUVs de alto padrão e veículos blindados nível III-A.",
    details: "Veículos revisados em concessionária com contratos de locação corporativa de curto prazo ativos.",
    highlights: ["Blindagem III-A homologada", "Frota 2023/2024", "Contratos de locação inclusos"],
  },
];

export default function OportunidadesPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeModalOpp, setActiveModalOpp] = React.useState<OpportunityItem | null>(null);
  const [interestSubmitted, setInterestSubmitted] = React.useState(false);

  const filteredOpportunities = React.useMemo(() => {
    return mockOpportunities.filter((opp) => {
      const matchesCategory = selectedCategory === "all" || opp.category === selectedCategory;
      const matchesSearch =
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header da Galeria */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Deal Flow Exclusivo
            </Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Galeria de Oportunidades & Ativos
          </h1>
          <p className="mt-1 text-silver text-sm">
            Originação qualificada de ativos de alto valor, M&A, energia solar, carbono, hotéis e frotas executivas.
          </p>
        </div>

        {/* Busca por texto */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar ativo, local ou valor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-charcoal border border-border text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-gold focus:outline-none placeholder:text-text-secondary"
          />
        </div>
      </div>

      {/* Categorias (Abas e Pills) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categoriesList.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border flex-shrink-0",
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

      {/* Grid de Cards de Oportunidades */}
      {filteredOpportunities.length === 0 ? (
        <Card className="glass text-center p-12 space-y-4">
          <div className="h-12 w-12 rounded-full bg-charcoal border border-border flex items-center justify-center text-text-secondary mx-auto">
            <Filter className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-semibold text-white">Nenhuma oportunidade encontrada</h3>
          <p className="text-silver text-sm max-w-md mx-auto">
            Tente buscar com outros termos ou selecione uma categoria diferente acima.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}>
            Limpar filtros
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => (
            <Card key={opp.id} className="glass hover:border-gold/40 transition-all flex flex-col justify-between group">
              <CardHeader className="p-6 border-b border-border/50">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="outline" size="sm" className="bg-charcoal border-gold/30 text-gold font-medium">
                    {opp.categoryIcon} {opp.categoryLabel}
                  </Badge>
                  <span
                    className={cn(
                      "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border",
                      opp.stage === "Ativa" && "bg-emerald/10 text-emerald border-emerald/30",
                      opp.stage === "Em Negociação" && "bg-amber-500/10 text-amber-400 border-amber-500/30",
                      opp.stage === "Nova Originação" && "bg-blue-500/10 text-blue-400 border-blue-500/30",
                      opp.stage === "NDA Requerido" && "bg-purple-500/10 text-purple-400 border-purple-500/30"
                    )}
                  >
                    {opp.stage}
                  </span>
                </div>
                <CardTitle className="font-display text-lg text-white group-hover:text-gold transition-colors leading-snug">
                  {opp.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary text-xs flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-gold" /> Volume estimado
                    </span>
                    <span className="font-display font-bold text-gold text-base">{opp.volume}</span>
                  </div>

                  <div className="flex items-center text-xs text-silver gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-silver flex-shrink-0" />
                    <span className="truncate">{opp.location}</span>
                  </div>

                  <p className="text-xs text-silver line-clamp-3 leading-relaxed">
                    {opp.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {opp.highlights.map((h, i) => (
                      <span key={i} className="text-[11px] bg-charcoal border border-border px-2 py-0.5 rounded-md text-text-secondary">
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <Button
                    variant="gold"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => {
                      setActiveModalOpp(opp);
                      setInterestSubmitted(false);
                    }}
                  >
                    Ver detalhes & NDA <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Detalhes e Solicitação de NDA */}
      {activeModalOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm animate-fade-in">
          <Card className="glass border-gold/30 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setActiveModalOpp(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-text-secondary hover:text-white bg-charcoal hover:bg-obsidian transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <CardHeader className="p-6 border-b border-border">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="gold" size="sm">
                  {activeModalOpp.categoryIcon} {activeModalOpp.categoryLabel}
                </Badge>
              </div>
              <CardTitle className="font-display text-xl text-white pr-6">
                {activeModalOpp.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-5 text-sm text-silver">
              {interestSubmitted ? (
                <div className="text-center py-6 space-y-4">
                  <div className="h-14 w-14 rounded-full bg-emerald/10 text-emerald flex items-center justify-center mx-auto border border-emerald/30">
                    <CheckCircle className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">Solicitação de NDA Enviada!</h3>
                  <p className="text-xs text-silver">
                    Sua demonstração de interesse foi registrada. O analista responsável pela originação deste ativo enviará o termo de confidencialidade (NDA) para o seu e-mail.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setActiveModalOpp(null)}>
                    Fechar
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 p-3.5 bg-charcoal/60 rounded-xl border border-border">
                    <div>
                      <span className="text-xs text-text-secondary">Volume / Ticket</span>
                      <p className="font-display font-bold text-gold text-base mt-0.5">{activeModalOpp.volume}</p>
                    </div>
                    <div>
                      <span className="text-xs text-text-secondary">Localização</span>
                      <p className="font-medium text-white text-xs mt-0.5">{activeModalOpp.location}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-1">Resumo do Ativo</h4>
                    <p className="text-xs text-silver leading-relaxed">{activeModalOpp.details}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-2">Destaques da Operação</h4>
                    <ul className="space-y-1.5 text-xs">
                      {activeModalOpp.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-white">
                          <FileCheck2 className="h-4 w-4 text-gold flex-shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
                    <Lock className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>
                      O acesso a relatórios de Due Diligence estendidos requer assinatura prévia de acordo de confidencialidade (NDA).
                    </span>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setActiveModalOpp(null)}>
                      Cancelar
                    </Button>
                    <Button
                      variant="gold"
                      className="flex-1"
                      onClick={() => setInterestSubmitted(true)}
                    >
                      Solicitar NDA & Contato
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
