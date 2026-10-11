"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import {
  X,
  Upload,
  Image as ImageIcon,
  FileText,
  DollarSign,
  MapPin,
  Check,
  Sparkles,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  Plus,
  Wand2,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Cpu,
  FileUp,
  FileCheck2,
  Zap,
  Clock,
  Crown,
  AlertTriangle,
} from "lucide-react";
import {
  OpportunityItem,
  opportunityCategories,
} from "@/lib/opportunities";
import {
  convertAnyDocumentToMarkdown,
  compressImage,
  MAX_DOC_SIZE_MB,
  MAX_DOC_SIZE_BYTES,
} from "@/lib/documentParser";

interface NewOpportunityModalProps {
  onClose: () => void;
  onSave: (newOpp: OpportunityItem) => void;
  defaultAuthorName?: string;
  defaultCompanyName?: string;
}

export function NewOpportunityModal({
  onClose,
  onSave,
  defaultAuthorName = "Membro Associado",
  defaultCompanyName = "Empresa Membro",
}: NewOpportunityModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("venda_usina_solar");
  const [volume, setVolume] = useState("");
  const [location, setLocation] = useState("");
  const [stage, setStage] = useState<OpportunityItem["stage"]>("Ativa");
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [highlight1, setHighlight1] = useState("");
  const [highlight2, setHighlight2] = useState("");
  const [highlight3, setHighlight3] = useState("");

  // Foto e Imagens
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Estados do Gerador de Imagem com IA
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedAiImage, setGeneratedAiImage] = useState<string | null>(null);
  const [isImageApproved, setIsImageApproved] = useState(false);
  const [aiProvider, setAiProvider] = useState<string | null>("IA Millennium");
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Estados do Auto-Leitor de PDF, Word, TXT e Imagem com IA
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false);
  const [analyzingStepText, setAnalyzingStepText] = useState("A Inteligência Artificial está lendo e estruturando os dados do negócio...");
  const [docAnalysisSuccess, setDocAnalysisSuccess] = useState<string | null>(null);
  const [docAnalysisError, setDocAnalysisError] = useState<string | null>(null);

  // Gestão de Teste Gratuito de 7 Dias vs Plano Pago
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(7);
  const [isPaidPlan, setIsPaidPlan] = useState<boolean>(true);

  // Documento Anexo
  const [pdfFileName, setPdfFileName] = useState("Teaser_Executivo_Investimento.pdf");
  const [pdfFileSize, setPdfFileSize] = useState("3.2 MB");

  // Autor
  const [authorName, setAuthorName] = useState(defaultAuthorName);
  const [authorCompany, setAuthorCompany] = useState(defaultCompanyName);
  const [authorJobTitle, setAuthorJobTitle] = useState("Diretor Executivo & Sócio");
  const [authorBadge, setAuthorBadge] = useState("Membro Verificado 100%");
  const [authorWhatsapp, setAuthorWhatsapp] = useState("(11) 98888-0000");
  const [authorEmail, setAuthorEmail] = useState("membro@millenniumclub.com");

  // Compliance de Mandato & Veracidade
  const [isMandataryDeclared, setIsMandataryDeclared] = useState(false);

  // Inicializa a contagem dos 7 dias de teste gratuito
  useEffect(() => {
    try {
      const trialKey = "mc_ai_trial_start_v1";
      let startTimestamp = localStorage.getItem(trialKey);
      if (!startTimestamp) {
        startTimestamp = Date.now().toString();
        localStorage.setItem(trialKey, startTimestamp);
      }
      const daysPassed = Math.floor((Date.now() - parseInt(startTimestamp, 10)) / (1000 * 60 * 60 * 24));
      const remaining = Math.max(0, 7 - daysPassed);
      setTrialDaysLeft(remaining);
    } catch (e) {
      setTrialDaysLeft(7);
    }
  }, []);

  // Leitura Automática de Documentos (PDF, Word, TXT) ou Imagem
  const handleAutoAnalyzeFile = async (file: File, fileType: "document" | "image") => {
    setIsAnalyzingDoc(true);
    setDocAnalysisSuccess(null);
    setDocAnalysisError(null);

    // 1. Limite estrito de tamanho para evitar travamento
    if (fileType === "document" && file.size > MAX_DOC_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setDocAnalysisError(
        `O arquivo selecionado possui ${sizeMb} MB. Para garantir uma leitura ultrarrápida e sem travamentos, o limite para análise automática é de ${MAX_DOC_SIZE_MB} MB. Dica: selecione um arquivo de até ${MAX_DOC_SIZE_MB} MB ou envie um teaser/resumo com as páginas principais do negócio.`
      );
      setIsAnalyzingDoc(false);
      return;
    }

    try {
      const payload: any = {
        fileName: file.name,
      };

      if (fileType === "document") {
        setPdfFileName(file.name);
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        setPdfFileSize(`${sizeMb} MB`);

        setAnalyzingStepText(`Lendo "${file.name}" e convertendo em Markdown estruturado...`);

        // Conversão ultrarrápida no cliente para Markdown (lê TXT, Word .docx/.doc ou PDF)
        const { markdown, isScanned, firstPageImage, detectedType } = await convertAnyDocumentToMarkdown(file);

        if (isScanned && firstPageImage) {
          setAnalyzingStepText("Documento escaneado detectado. Analisando dados visuais com IA...");
          payload.image = firstPageImage;
        } else {
          setAnalyzingStepText(`Processando conteúdo do documento (${detectedType.toUpperCase()}) com Inteligência Artificial...`);
          payload.text = markdown;
        }
      } else {
        setAnalyzingStepText("Otimizando imagem e analisando ativo com Inteligência Artificial...");
        // Comprime a imagem no cliente antes de enviar para manter o payload leve (<250 KB)
        const compressedBase64 = await compressImage(file, 1280, 800, 0.8);
        setImageUrl(compressedBase64);
        setImagePreview(compressedBase64);
        setIsImageApproved(true);
        payload.image = compressedBase64;
      }

      // Envia payload leve (texto Markdown ou imagem comprimida) para a API
      const res = await fetch("/api/analyze-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Falha na resposta do servidor.");
      }

      const result = await res.json();
      const extracted = result.data;

      if (extracted) {
        // Preenchimento automático nos campos; campos ausentes permanecem em branco
        if (extracted.title) setTitle(extracted.title);
        if (extracted.category) setCategory(extracted.category);
        if (extracted.volume) setVolume(extracted.volume);
        if (extracted.location) setLocation(extracted.location);
        if (extracted.stage) setStage(extracted.stage);
        if (extracted.summary) setSummary(extracted.summary);
        if (extracted.details) setDetails(extracted.details);

        if (Array.isArray(extracted.highlights)) {
          if (extracted.highlights[0]) setHighlight1(extracted.highlights[0]);
          if (extracted.highlights[1]) setHighlight2(extracted.highlights[1]);
          if (extracted.highlights[2]) setHighlight3(extracted.highlights[2]);
        }

        setDocAnalysisSuccess(
          `✓ Arquivo "${file.name}" lido e estruturado com sucesso pela IA! Os dados foram pré-preenchidos. Confira e complete os campos necessários abaixo.`
        );
      } else {
        setDocAnalysisSuccess(`Arquivo "${file.name}" anexado com sucesso! Complete os campos necessários abaixo.`);
      }
    } catch (err: any) {
      console.error("Erro na leitura com IA:", err);
      setDocAnalysisError("Não foi possível extrair automaticamente todos os dados. Preencha manualmente os campos abaixo.");
    } finally {
      setIsAnalyzingDoc(false);
    }
  };

  // Função inteligente para sugerir prompt baseado nos dados preenchidos
  const handleSuggestPrompt = () => {
    const loc = location.trim() || "Brasil";
    const t = title.trim();

    let suggestion = "";
    if (category === "venda_usina_solar" || category === "credito_solar" || category === "passivo_solar") {
      suggestion = `Fotografia aérea cinematográfica e ultra-realista de um moderno parque de energia solar fotovoltaica com milhares de placas solares alinhadas em ${loc}, céu azul ensolarado com luz dourada de fim de tarde, nitidez extrema, perspectiva ampla de drone comercial, qualidade 8k`;
    } else if (category === "credito_carbono") {
      suggestion = `Fotografia aérea cinematográfica em alta resolução da densa copa da floresta tropical amazônica preservada em ${loc}, névoa matinal suave, rio sinuoso ao fundo, raios de sol, preservação e créditos de carbono, ultra-detalhado 8k`;
    } else if (category === "venda_hoteis" || category === "compra_hoteis") {
      suggestion = `Fotografia de arquitetura comercial de luxo de um hotel resort contemporâneo em ${loc}, fachada moderna envidraçada, piscina de borda infinita, iluminação quente e sofisticada ao crepúsculo, sofisticação executiva, 8k`;
    } else if (category === "aeronaves") {
      suggestion = `Fotografia comercial de alta resolução de um jato executivo moderno e sofisticado estacionado em um hangar privativo de luxo em ${loc}, piso espelhado de alta reflexão, iluminação de estúdio comercial, pintura brilhante impecável, 8k`;
    } else if (category === "automoveis") {
      suggestion = `Fotografia comercial de estúdio de uma frota de SUVs executivos pretos de luxo blindados alinhados em frente a uma torre corporativa moderna de vidro em ${loc}, reflexos perfeitos, iluminação dramática, 8k`;
    } else if (category === "usinas_rsu") {
      suggestion = `Fotografia industrial moderna de uma usina ecológica de reciclagem e processamento sustentável de energia limpa em ${loc}, arquitetura de alta tecnologia, céu limpo, 8k`;
    } else {
      suggestion = `Fotografia executiva moderna em arranha-céu corporativo espelhado em ${loc}, sala de reunião com vista panorâmica para o horizonte da cidade, representando grandes negócios e M&A, iluminação suave e elegante, 8k`;
    }

    if (t) {
      suggestion = `${t}. ${suggestion}`;
    }

    setAiPrompt(suggestion);
    setGenerationError(null);
  };

  // Disparo da geração de imagem via API
  const handleGenerateImage = async () => {
    if (!aiPrompt.trim()) {
      handleSuggestPrompt();
    }
    const promptToSend = aiPrompt.trim() || `Fotografia profissional corporativa de ${title || "ativo de investimento de alto valor"}`;

    setIsGeneratingAi(true);
    setGenerationError(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToSend, width: 1280, height: 720 }),
      });

      if (!res.ok) {
        throw new Error("Falha na geração de imagem com IA.");
      }

      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedAiImage(data.imageUrl);
        setAiProvider(data.provider || "IA Millennium");
        setIsImageApproved(false);
      } else {
        throw new Error("URL de imagem não retornada.");
      }
    } catch (err: any) {
      console.error("Erro na geração de imagem:", err);
      setGenerationError("Não foi possível gerar a imagem no momento. Utilize o upload manual ou tente novamente.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Aprovar a imagem gerada para ser a imagem oficial do ativo
  const handleApproveImage = () => {
    if (generatedAiImage) {
      setImageUrl(generatedAiImage);
      setIsImageApproved(true);
    }
  };

  // Handler para upload local de Documento (PDF, Word, TXT)
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAutoAnalyzeFile(file, "document");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !volume.trim()) {
      alert("Por favor, preencha o título e o volume da oportunidade.");
      return;
    }

    if (!isMandataryDeclared) {
      alert("É obrigatório declarar formalmente que você é mandatário direto ou representante exclusivo do negócio para submeter.");
      return;
    }

    const selectedCatObj = opportunityCategories.find((c) => c.id === category) || {
      id: category,
      label: "Oportunidade Estratégica",
      icon: "💎",
    };

    const highlightsArray = [highlight1.trim(), highlight2.trim(), highlight3.trim()].filter(Boolean);

    const newOpp: OpportunityItem = {
      id: `opp-${Date.now()}`,
      title: title.trim(),
      category: selectedCatObj.id,
      categoryLabel: selectedCatObj.label,
      categoryIcon: selectedCatObj.icon,
      volume: volume.trim(),
      location: location.trim() || "Brasil",
      stage,
      summary: summary.trim() || "Oportunidade executiva originada por membro associado do Millennium Club.",
      details: details.trim() || summary.trim(),
      highlights: highlightsArray.length > 0 ? highlightsArray : ["Ativo auditado", "Originação de membro qualificado", "Due diligence disponível sob NDA"],
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
      documentPdfName: pdfFileName,
      documentPdfSize: pdfFileSize,
      documentPdfUrl: "#",
      author: {
        name: authorName.trim() || "Membro Associado",
        company: authorCompany.trim() || "Empresa Membro",
        jobTitle: authorJobTitle.trim() || "Sócio & Diretor",
        badge: authorBadge,
        whatsapp: authorWhatsapp.trim(),
        email: authorEmail.trim(),
      },
      createdAt: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }),
      questions: [],
      // Moderação Administrativa Inicial: Pendente de Checagem
      approvalStatus: "pending",
      isMandataryDeclared: true,
    };

    onSave(newOpp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="glass rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto border border-gold/40 shadow-2xl p-5 sm:p-7">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center font-bold text-lg">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-white">
                  Publicar Nova Oportunidade ou Negócio
                </h2>
                <Badge variant="gold" size="sm" className="hidden sm:inline-flex gap-1 text-[11px]">
                  <Sparkles className="h-3 w-3" /> IA Habilitada
                </Badge>
              </div>
              <p className="text-xs text-silver mt-0.5">
                Sua oportunidade passará pela checagem de veracidade e comprovação de mandato pelo administrador antes de ser liberada na vitrine pública.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-white rounded-lg hover:bg-charcoal transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* RECURSO 1: AUTO-PREENCHIMENTO COM IA LENDO PDF, WORD, TXT OU IMAGEM */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-gold/15 via-charcoal/80 to-gold/10 border border-gold/40 shadow-inner space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-gold" /> Auto-Preenchimento Inteligente com IA (Zero Esforço)
              </p>
              <p className="text-xs text-silver mt-0.5">
                Já possui um <strong>resumo em TXT</strong>, <strong>Word (.docx)</strong>, <strong>PDF</strong> ou <strong>Imagem</strong>? A IA converte o conteúdo e preenche os campos automaticamente em segundos!
              </p>
            </div>

            {/* Badge de Plano Pago / 7 Dias de Teste Gratuito */}
            <div className="shrink-0 flex items-center gap-1.5 bg-obsidian/70 border border-gold/30 px-3 py-1 rounded-full text-xs">
              <Clock className="h-3.5 w-3.5 text-gold" />
              <span className="text-silver">
                Teste Grátis: <strong className="text-gold">{trialDaysLeft} dias restantes</strong>
              </span>
            </div>
          </div>

          {/* Botões de Upload para Auto-leitura */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Ler Documento (PDF, Word, TXT) */}
            <label className="flex items-center justify-center gap-2.5 p-3 rounded-xl border border-dashed border-alert/50 bg-charcoal/60 hover:bg-alert/10 cursor-pointer transition-colors text-xs font-semibold text-white group">
              <FileText className="h-4 w-4 text-alert group-hover:scale-110 transition-transform" />
              <span>Ler Resumo / Teaser (PDF, Word, TXT)</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md,.rtf,text/plain,text/markdown,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                disabled={isAnalyzingDoc}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleAutoAnalyzeFile(f, "document");
                }}
                className="hidden"
              />
            </label>

            {/* Ler Imagem / Folder */}
            <label className="flex items-center justify-center gap-2.5 p-3 rounded-xl border border-dashed border-emerald/50 bg-charcoal/60 hover:bg-emerald/10 cursor-pointer transition-colors text-xs font-semibold text-white group">
              <ImageIcon className="h-4 w-4 text-emerald group-hover:scale-110 transition-transform" />
              <span>Ler Imagem / Flyer do Ativo</span>
              <input
                type="file"
                accept="image/*"
                disabled={isAnalyzingDoc}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleAutoAnalyzeFile(f, "image");
                }}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center justify-between text-[11px] text-text-secondary px-1">
            <span>⚡ Suporta <strong>TXT, Word (.docx), PDF</strong> e imagens. Arquivos de até 10 MB lidos sem travamento.</span>
          </div>

          {/* Indicador de Carregamento da Leitura com passos claros */}
          {isAnalyzingDoc && (
            <div className="flex items-center justify-center gap-2.5 p-3 bg-obsidian/80 rounded-xl border border-gold/40 text-gold text-xs font-medium animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin text-gold shrink-0" />
              <span>{analyzingStepText}</span>
            </div>
          )}

          {/* Feedback de Sucesso */}
          {docAnalysisSuccess && (
            <div className="p-3 bg-emerald/10 border border-emerald/30 text-emerald text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{docAnalysisSuccess}</span>
            </div>
          )}

          {/* Feedback de Erro / Limite de Arquivo */}
          {docAnalysisError && (
            <div className="p-3 bg-alert/15 border border-alert/30 text-alert text-xs rounded-xl flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{docAnalysisError}</span>
            </div>
          )}
        </div>

        {/* Formulário com os Campos */}
        <form onSubmit={handleSubmit} className="space-y-6 my-5">
          {/* Seção 1: Dados do Ativo */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> 1. Informações Básicas do Negócio
            </h3>

            <div>
              <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                Título da Oportunidade *
              </label>
              <Input
                required
                placeholder="Ex: Venda de Parque Solar 20MWp com PPA, Compra de Rede Hoteleira..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none h-10 px-3 text-sm appearance-none cursor-pointer"
                >
                  {opportunityCategories.filter((c) => c.id !== "all").map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                  Volume / Ticket Estimado *
                </label>
                <Input
                  required
                  placeholder="Ex: R$ 35.000.000 ou US$ 5M"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                  Estágio da Operação
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as OpportunityItem["stage"])}
                  className="w-full bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none h-10 px-3 text-sm appearance-none cursor-pointer"
                >
                  <option value="Ativa">Ativa (Aberta para Propostas)</option>
                  <option value="Nova Originação">Nova Originação</option>
                  <option value="Em Negociação">Em Negociação</option>
                  <option value="NDA Requerido">NDA Requerido</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                Localização do Ativo
              </label>
              <Input
                placeholder="Ex: São Paulo, SP ou Minas Gerais, Brasil (Deixe em branco se confidencial)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-10 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                Resumo Executivo (Tese de Investimento)
              </label>
              <textarea
                rows={2}
                placeholder="Descreva resumidamente o que é o ativo e a oportunidade para investidores..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-charcoal border border-border text-white placeholder-text-secondary rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none p-3 text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                Detalhes & Informações Técnicas
              </label>
              <textarea
                rows={3}
                placeholder="Informações contratuais, EBITDA, licenças, garantias e retorno estimado..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full bg-charcoal border border-border text-white placeholder-text-secondary rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none p-3 text-sm resize-none"
              />
            </div>

            {/* Destaques rápidos */}
            <div>
              <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                Destaques Principais (Bullet points)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  placeholder="Destaque 1 (ex: EBITDA R$ 8M)"
                  value={highlight1}
                  onChange={(e) => setHighlight1(e.target.value)}
                  className="h-9 text-xs"
                />
                <Input
                  placeholder="Destaque 2 (ex: Contrato 15 anos)"
                  value={highlight2}
                  onChange={(e) => setHighlight2(e.target.value)}
                  className="h-9 text-xs"
                />
                <Input
                  placeholder="Destaque 3 (ex: Licença aprovada)"
                  value={highlight3}
                  onChange={(e) => setHighlight3(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Seção 2: GERADOR DE IMAGENS COM IA & FOTOS */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-emerald" /> 2. Imagem do Ativo (Gerador com IA / Upload)
              </h3>
              <span className="text-[11px] text-emerald bg-emerald/10 border border-emerald/30 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> IA Habilitada
              </span>
            </div>

            {/* BOX DO GERADOR DE IMAGEM COM IA */}
            <div className="p-4 rounded-xl bg-charcoal/60 border border-gold/30 space-y-3.5 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Wand2 className="h-4 w-4 text-gold" /> Criar Imagem Profissional com Inteligência Artificial
                  </p>
                  <p className="text-xs text-silver mt-0.5">
                    A IA analisa os dados da oportunidade e sugere o prompt fotográfico. Você pode editar o texto e pedir a geração.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSuggestPrompt}
                  className="text-xs gap-1.5 border-gold/40 text-gold hover:bg-gold/10 shrink-0"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Sugerir Prompt com IA
                </Button>
              </div>

              {/* Campo para editar o prompt da IA */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text-secondary uppercase">
                  Prompt da Imagem (Edite e ajuste livremente):
                </label>
                <textarea
                  rows={2}
                  placeholder="Clique em 'Sugerir Prompt com IA' ou digite seu prompt personalizado para a IA gerar a foto..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full bg-obsidian border border-border text-white placeholder-text-secondary rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none p-3 text-xs resize-none"
                />
              </div>

              {/* Botão de Disparo da Geração */}
              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  disabled={isGeneratingAi}
                  onClick={handleGenerateImage}
                  className="gap-2 text-xs font-semibold h-9 px-4"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Gerando Imagem com IA...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Gerar Imagem com IA
                    </>
                  )}
                </Button>

                {aiProvider && (
                  <span className="text-[11px] text-text-secondary">
                    Motor: <strong className="text-silver">{aiProvider}</strong>
                  </span>
                )}
              </div>

              {generationError && (
                <p className="text-xs text-alert bg-alert/10 p-2 rounded-lg border border-alert/20">
                  {generationError}
                </p>
              )}

              {/* Prévia da Imagem Gerada com IA e Botão de Aprovação */}
              {generatedAiImage && (
                <div className="pt-3 border-t border-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-gold" /> Resultado da Geração com IA:
                    </span>
                    {isImageApproved ? (
                      <span className="text-xs bg-emerald/20 text-emerald border border-emerald/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Aprovada para a Galeria!
                      </span>
                    ) : (
                      <span className="text-xs text-amber-400 font-medium">Aguardando aprovação</span>
                    )}
                  </div>

                  <div className="relative h-44 sm:h-56 w-full rounded-xl overflow-hidden border-2 border-gold/40 shadow-lg">
                    <img
                      src={generatedAiImage}
                      alt="Gerada por IA"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between p-2 rounded-lg bg-obsidian/85 backdrop-blur border border-border">
                      <span className="text-[11px] text-silver truncate max-w-[200px]">
                        Resolução 1280x720 • Ultra-HD
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isGeneratingAi}
                          onClick={handleGenerateImage}
                          className="h-7 px-2 text-[11px] gap-1 text-silver hover:text-white"
                          title="Gerar outra versão"
                        >
                          <RefreshCw className="h-3 w-3" /> Gerar Outra
                        </Button>
                        <Button
                          type="button"
                          variant={isImageApproved ? "outline" : "gold"}
                          size="sm"
                          onClick={handleApproveImage}
                          className={cn("h-7 px-3 text-[11px] font-bold gap-1", isImageApproved && "border-emerald text-emerald bg-emerald/10")}
                        >
                          <Check className="h-3 w-3" />
                          {isImageApproved ? "Aprovada!" : "Aprovar & Usar na Galeria"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Alternativa: Upload Manual de Foto e Documento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Upload Manual de Foto */}
              <div className="p-3.5 bg-charcoal/40 border border-border rounded-xl space-y-2">
                <span className="text-xs font-semibold text-white block">Ou faça Upload de Foto Própria</span>
                <label className="flex items-center justify-center gap-2 p-2.5 border border-dashed border-border rounded-xl cursor-pointer hover:bg-gold/5 transition-colors">
                  <Upload className="h-3.5 w-3.5 text-gold" />
                  <span className="text-xs font-medium text-silver hover:text-gold">Escolher imagem do computador</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleAutoAnalyzeFile(f, "image");
                    }}
                    className="hidden"
                  />
                </label>
                <Input
                  placeholder="Ou cole a URL da imagem..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setIsImageApproved(true);
                  }}
                  className="h-8 text-xs"
                />
              </div>

              {/* Upload de Documento Anexo (PDF, Word, TXT) */}
              <div className="p-3.5 bg-charcoal/40 border border-border rounded-xl space-y-2">
                <span className="text-xs font-semibold text-white block">Documento Anexo (PDF, Word ou TXT)</span>
                <label className="flex items-center justify-center gap-2 p-2.5 border border-dashed border-alert/40 rounded-xl cursor-pointer hover:bg-alert/5 transition-colors">
                  <FileText className="h-3.5 w-3.5 text-alert" />
                  <span className="text-xs font-medium text-alert">Anexar Arquivo (PDF, Word, TXT)</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.md,.rtf,text/plain,text/markdown,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                    onChange={handleDocUpload}
                    className="hidden"
                  />
                </label>
                <div className="flex items-center justify-between text-xs text-silver px-1">
                  <span className="truncate text-white font-medium">{pdfFileName}</span>
                  <span className="text-text-secondary">{pdfFileSize}</span>
                </div>
              </div>
            </div>

            {/* Foto de Capa Atual que será usada */}
            {imageUrl && (
              <div className="relative h-24 w-full rounded-xl overflow-hidden border border-border flex items-center justify-between p-3 bg-charcoal">
                <div className="flex items-center gap-3">
                  <img src={imageUrl} alt="Capa ativa" className="h-16 w-24 object-cover rounded-lg border border-border" />
                  <div>
                    <p className="text-xs font-bold text-white">Foto Oficial de Capa Selecionada</p>
                    <p className="text-[11px] text-silver truncate max-w-sm">Esta imagem será exibida na vitrine pública e para os associados.</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald/20 text-emerald border border-emerald/40 px-2 py-0.5 rounded-full font-bold">
                  ✓ Pronta para Publicação
                </span>
              </div>
            )}
          </div>

          {/* Seção 3: Identificação do Autor Criador */}
          <div className="space-y-3 pt-3 border-t border-border">
            <h3 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> 3. Identificação do Autor (Criador do Negócio)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                  Seu Nome Completo *
                </label>
                <Input
                  required
                  placeholder="Nome do Membro"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                  Empresa do Membro *
                </label>
                <Input
                  required
                  placeholder="Nome da Empresa"
                  value={authorCompany}
                  onChange={(e) => setAuthorCompany(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                  Cargo / Função
                </label>
                <Input
                  placeholder="Ex: CEO, Diretor de M&A, Managing Partner"
                  value={authorJobTitle}
                  onChange={(e) => setAuthorJobTitle(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-silver uppercase tracking-wider mb-1">
                  WhatsApp para Contato Direto
                </label>
                <Input
                  placeholder="(DDD) 99999-9999"
                  value={authorWhatsapp}
                  onChange={(e) => setAuthorWhatsapp(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Seção 4: Declaração de Mandato Exclusivo & Veracidade */}
          <div className="p-4 rounded-xl bg-gold/10 border border-gold/40 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={isMandataryDeclared}
                onChange={(e) => setIsMandataryDeclared(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gold/50 text-gold focus:ring-gold bg-charcoal shrink-0"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">
                  Declaração de Mandato Exclusivo & Veracidade das Informações *
                </span>
                <span className="text-[11px] text-silver leading-relaxed block">
                  Declaro sob responsabilidade civil e estatutária que sou <strong>mandatário direto</strong> (ou representante credenciado com exclusividade de originação) deste negócio e que todas as informações e documentos anexados são autênticos e auditáveis.
                </span>
              </div>
            </label>
            <p className="text-[10px] text-text-secondary pl-7">
              🔒 <strong>Regra de Governança:</strong> As oportunidades ficam inicialmente com status <em>"Pendente de Moderação"</em> e só são liberadas na vitrine pública após a conferência de mandato pelo administrador.
            </p>
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="gold"
              disabled={!isMandataryDeclared}
              className={cn("gap-2 font-semibold", !isMandataryDeclared && "opacity-60 cursor-not-allowed")}
            >
              <Check className="h-4 w-4" /> Submeter para Moderação do Admin
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
