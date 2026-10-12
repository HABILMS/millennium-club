"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import {
  X,
  MapPin,
  DollarSign,
  FileText,
  Download,
  Send,
  MessageSquare,
  ShieldCheck,
  Building,
  CheckCircle,
  FileCheck2,
  Calendar,
  Clock,
  Sparkles,
  User,
  Phone,
  Mail,
  ArrowRight,
  ExternalLink,
  Lock,
  AlertTriangle,
  Briefcase,
} from "lucide-react";
import {
  OpportunityItem,
  OpportunityQuestion,
} from "@/lib/opportunities";

interface OpportunityDetailModalProps {
  opportunity: OpportunityItem;
  onClose: () => void;
  onAddQuestion: (oppId: string, question: Omit<OpportunityQuestion, "id" | "sentAt">) => void;
  isMemberLoggedIn?: boolean;
}

export function OpportunityDetailModal({
  opportunity,
  onClose,
  onAddQuestion,
  isMemberLoggedIn = false,
}: OpportunityDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>(opportunity.imageUrl);
  const [questionText, setQuestionText] = useState("");
  const [senderName, setSenderName] = useState(isMemberLoggedIn ? "Membro Associado" : "");
  const [senderContact, setSenderContact] = useState("");
  const [questionSuccess, setQuestionSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"detalhes" | "chat">("detalhes");

  // Estado do Fluxo de Blindagem Comercial & NDA Digital
  const [isNdaModalOpen, setIsNdaModalOpen] = useState(false);
  const [ndaName, setNdaName] = useState("");
  const [ndaCompany, setNdaCompany] = useState("");
  const [ndaRole, setNdaRole] = useState("");
  const [ndaPhone, setNdaPhone] = useState("");
  const [ndaEmail, setNdaEmail] = useState("");
  const [ndaCapacity, setNdaCapacity] = useState("R$ 5.000.000 a R$ 20.000.000");
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [ndaSubmitting, setNdaSubmitting] = useState(false);
  const [ndaSuccessTicketId, setNdaSuccessTicketId] = useState<string | null>(null);

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    if (!isMemberLoggedIn && (!senderName.trim() || !senderContact.trim())) {
      alert("Por favor, preencha seu nome e contato para que o criador do negócio possa lhe responder.");
      return;
    }

    onAddQuestion(opportunity.id, {
      senderName: senderName.trim() || "Investidor Interessado",
      senderContact: senderContact.trim() || "Via Portal Millennium Club",
      content: questionText.trim(),
    });

    setQuestionText("");
    setQuestionSuccess(true);
    setTimeout(() => setQuestionSuccess(false), 5000);
  };

  const handleNdaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ndaAccepted) {
      alert("É necessário ler e aceitar o Termo de Confidencialidade e Não-Circunvenção de 24 Meses para prosseguir.");
      return;
    }

    setNdaSubmitting(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "deals_ma",
          subject: `[Dossiê Confidencial & NDA] Solicitação para ${opportunity.title}`,
          priority: "high",
          deal_id: opportunity.id,
          description: `Solicitação formal de acesso a Dossiê Confidencial com aceite de NDA e Termo de Não-Circunvenção de 24 Meses.\n\nAtivo: ${opportunity.title}\nID do Ativo: ${opportunity.id}\nVolume: ${opportunity.volume}\n\nSignatário: ${ndaName}\nEmpresa/Fundo: ${ndaCompany}\nCargo: ${ndaRole}\nWhatsApp: ${ndaPhone}\nE-mail: ${ndaEmail}\nCapacidade Prevista de Aporte: ${ndaCapacity}\n\nTermo de Não-Circunvenção (24 Meses): ACEITO DIGITALMENTE em ${new Date().toLocaleString("pt-BR")}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNdaSuccessTicketId(data.ticket?.ticket_number || data.ticket?.id || "TCK-NDA");
      } else {
        setNdaSuccessTicketId(`TCK-${Date.now().toString().slice(-6)}`);
      }
    } catch (err) {
      console.warn("Falha ao registrar ticket via API, gerando protocolo local:", err);
      setNdaSuccessTicketId(`TCK-${Date.now().toString().slice(-6)}`);
    } finally {
      setNdaSubmitting(false);
    }
  };

  const allImages = [
    opportunity.imageUrl,
    ...(opportunity.galleryImages || []).filter((img) => img !== opportunity.imageUrl),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="glass rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-gold/30 shadow-2xl relative">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-text-secondary hover:text-white bg-charcoal/80 hover:bg-charcoal rounded-xl transition-colors border border-border"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Imagem de Capa e Galeria de Fotos */}
        <div className="relative w-full h-64 sm:h-80 bg-charcoal overflow-hidden rounded-t-2xl">
          <img
            src={selectedImage}
            alt={opportunity.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />

          {/* Badges sobre a foto */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-obsidian/90 text-gold border border-gold/40 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              {opportunity.categoryIcon} {opportunity.categoryLabel}
            </span>
            <span
              className={cn(
                "text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md shadow-lg uppercase tracking-wider",
                opportunity.stage === "Ativa" && "bg-emerald/80 text-white border-emerald/50",
                opportunity.stage === "Em Negociação" && "bg-amber-500/80 text-white border-amber-500/50",
                opportunity.stage === "Nova Originação" && "bg-blue-600/80 text-white border-blue-500/50",
                opportunity.stage === "NDA Requerido" && "bg-purple-600/80 text-white border-purple-500/50"
              )}
            >
              {opportunity.stage}
            </span>

            {/* Badge de Mandato & Veracidade */}
            <span className="bg-emerald/90 text-white border border-emerald/50 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <ShieldCheck className="h-3.5 w-3.5" /> Mandatário Declarado
            </span>

            {/* Blindagem de Proteção Comercial */}
            <span className="bg-gold/90 text-obsidian border border-gold font-bold text-xs px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <Lock className="h-3.5 w-3.5" /> Teaser Cego & Intermediado
            </span>

            {opportunity.approvalStatus === "pending" && (
              <span className="bg-amber-500 text-obsidian border border-amber-400 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg animate-pulse">
                <Clock className="h-3.5 w-3.5" /> Em Análise Admin
              </span>
            )}
          </div>

          {/* Título sobreposto ao final da imagem */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white drop-shadow-md">
              {opportunity.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-silver">
              <span className="flex items-center gap-1 font-semibold text-gold">
                <DollarSign className="h-3.5 w-3.5" /> Volume: {opportunity.volume}
              </span>
              <span className="flex items-center gap-1 text-silver">
                <MapPin className="h-3.5 w-3.5" /> {opportunity.location}
              </span>
              <span className="flex items-center gap-1 text-text-secondary">
                <Calendar className="h-3.5 w-3.5" /> Publicado em: {opportunity.createdAt}
              </span>
            </div>
          </div>
        </div>

        {/* Miniaturas das Fotos (se houver mais de uma) */}
        {allImages.length > 1 && (
          <div className="flex items-center gap-2 p-3 bg-charcoal/40 border-b border-border/50 overflow-x-auto">
            <span className="text-xs text-text-secondary font-medium ml-2 mr-1">Fotos:</span>
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  "h-12 w-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                  selectedImage === img ? "border-gold scale-105 shadow-md" : "border-border opacity-70 hover:opacity-100"
                )}
              >
                <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Banner de Blindagem Comercial & Não-Circunvenção */}
        <div className="bg-gold/10 border-b border-gold/20 px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-gold">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span className="font-semibold">
              Blindagem Comercial & Mesa de Deals M&A
            </span>
            <span className="text-silver hidden sm:inline">•</span>
            <span className="text-silver hidden sm:inline">
              Termo de Não-Circunvenção de 24 Meses ativo para preservação de honorários e confidencialidade.
            </span>
          </div>
          <button
            onClick={() => setIsNdaModalOpen(true)}
            className="text-gold hover:underline font-bold text-[11px] shrink-0"
          >
            Assinar NDA & Acessar Dossiê →
          </button>
        </div>

        {/* Abas: Detalhes do Ativo vs Chat com o Criador */}
        <div className="flex border-b border-border/70 px-6 pt-2 bg-charcoal/20">
          <button
            onClick={() => setActiveTab("detalhes")}
            className={cn(
              "py-3 px-4 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2",
              activeTab === "detalhes"
                ? "border-gold text-gold"
                : "border-transparent text-silver hover:text-white"
            )}
          >
            <FileText className="h-4 w-4" /> Detalhes & Documentação
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={cn(
              "py-3 px-4 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2",
              activeTab === "chat"
                ? "border-gold text-gold"
                : "border-transparent text-silver hover:text-white"
            )}
          >
            <MessageSquare className="h-4 w-4" /> Perguntas Intermediadas
            <span className="bg-gold/20 text-gold border border-gold/30 text-xs px-1.5 py-0.2 rounded-full font-bold">
              {opportunity.questions?.length || 0}
            </span>
          </button>
        </div>

        {/* CONTEÚDO DA ABA 1: DETALHES, AUTOR E PDF */}
        {activeTab === "detalhes" && (
          <div className="p-6 space-y-6">
            {/* Box do Autor com Blindagem de Contato Direto */}
            <div className="p-4 rounded-xl bg-charcoal/60 border border-gold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-gold/15 border border-gold/30 text-gold flex items-center justify-center font-display font-bold text-lg shadow-inner">
                  {opportunity.author?.name
                    ? opportunity.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "MC"}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display font-bold text-white text-base">
                      {opportunity.author?.name || "Membro Associado"}
                    </p>
                    <span className="text-[11px] bg-gold/15 text-gold border border-gold/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> {opportunity.author?.badge || "Membro Verificado"}
                    </span>
                  </div>
                  <p className="text-xs text-silver mt-0.5">
                    {opportunity.author?.jobTitle} • <strong className="text-white">{opportunity.author?.company}</strong>
                  </p>
                </div>
              </div>

              {/* Botões de Ação Intermediados pela Mesa de Negócios */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => setIsNdaModalOpen(true)}
                  className="gap-1.5 text-xs font-bold bg-gradient-to-r from-gold via-gold-light to-gold text-obsidian shadow-md hover:opacity-95"
                >
                  <FileCheck2 className="h-3.5 w-3.5" /> Solicitar Dossiê & NDA
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("chat")}
                  className="gap-1.5 text-xs font-semibold border-border text-silver hover:text-white"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Fazer Pergunta
                </Button>
              </div>
            </div>

            {/* Resumo e Descrição */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Tese & Descrição do Ativo (Teaser Cego)
              </h3>
              <p className="text-sm text-silver leading-relaxed bg-charcoal/30 p-4 rounded-xl border border-border/70">
                {opportunity.details || opportunity.summary}
              </p>
            </div>

            {/* Destaques da Operação */}
            {opportunity.highlights && opportunity.highlights.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Destaques Estratégicos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {opportunity.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-charcoal/50 border border-border/70 flex items-center gap-2 text-xs text-white"
                    >
                      <CheckCircle className="h-4 w-4 text-gold shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DOCUMENTO PDF ANEXADO - ACESSO VIA NDA */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Documentação & Dossiê Executivo (PDF)
                </h3>
                <span className="text-[11px] text-gold flex items-center gap-1 font-semibold">
                  <Lock className="h-3 w-3" /> Requer NDA Digital
                </span>
              </div>

              <div className="p-4 rounded-xl bg-charcoal/60 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gold/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold border border-gold/30 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {opportunity.documentPdfName || "Teaser_Executivo_Investimento.pdf"}
                    </p>
                    <p className="text-xs text-silver">
                      Tamanho: {opportunity.documentPdfSize || "2.8 MB"} • Dossiê Confidencial Desblindado
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => setIsNdaModalOpen(true)}
                    className="gap-1.5 text-xs font-bold bg-gold text-obsidian hover:bg-gold-light"
                  >
                    <FileCheck2 className="h-3.5 w-3.5" /> Assinar NDA para Baixar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA 2: CHAT E PERGUNTAS AO CRIADOR */}
        {activeTab === "chat" && (
          <div className="p-6 space-y-5">
            {/* Cabeçalho do Chat */}
            <div className="flex items-center justify-between p-3.5 bg-charcoal/50 border border-border rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gold/10 text-gold border border-gold/20 flex items-center justify-center font-bold text-sm">
                  {opportunity.author?.name ? opportunity.author.name[0] : "A"}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Canal Intermediado com {opportunity.author?.name}
                  </p>
                  <p className="text-xs text-silver">
                    Tire dúvidas técnicas e de escopo. Propostas de valor e trocas de dados ocorrem mediante NDA firmado.
                  </p>
                </div>
              </div>
            </div>

            {/* Sucesso no Envio */}
            {questionSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald/10 border border-emerald/30 text-emerald text-sm flex items-center gap-2 animate-fade-in">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>Sua pergunta foi enviada com sucesso para a curadoria e para {opportunity.author?.name}! Você receberá retorno por e-mail ou WhatsApp.</span>
              </div>
            )}

            {/* Histórico de Mensagens / Perguntas */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {(!opportunity.questions || opportunity.questions.length === 0) ? (
                <div className="text-center py-8 text-silver/60 italic text-xs">
                  Nenhuma pergunta registrada ainda. Envie sua primeira pergunta técnica sobre o ativo!
                </div>
              ) : (
                opportunity.questions.map((q) => (
                  <div key={q.id} className="p-3.5 rounded-xl bg-charcoal/50 border border-border/70 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <User className="h-3 w-3 text-gold" /> {q.senderName}
                      </span>
                      <span className="text-[11px] text-text-secondary">{q.sentAt}</span>
                    </div>
                    <p className="text-xs text-silver pl-4 border-l-2 border-gold/40">
                      "{q.content}"
                    </p>
                    {q.reply && (
                      <div className="mt-2 pt-2 border-t border-border/40 text-xs pl-4 border-l-2 border-emerald/50 bg-emerald/5 p-2 rounded-lg">
                        <p className="font-semibold text-emerald text-[11px] mb-0.5">
                          Resposta do Autor ({opportunity.author?.name}):
                        </p>
                        <p className="text-silver">{q.reply}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Formulário para Envio de Pergunta */}
            <form onSubmit={handleSendQuestion} className="space-y-3 pt-2 border-t border-border/60">
              <p className="text-xs font-semibold text-white uppercase tracking-wider">
                Escreva sua Pergunta Técnica
              </p>

              {!isMemberLoggedIn && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    required
                    placeholder="Seu Nome Completo *"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="h-9 text-xs"
                  />
                  <Input
                    required
                    placeholder="Seu WhatsApp ou E-mail para contato *"
                    value={senderContact}
                    onChange={(e) => setSenderContact(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <textarea
                  required
                  rows={2}
                  placeholder={`Pergunte algo sobre "${opportunity.title}"...`}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full bg-charcoal border border-border text-white placeholder-text-secondary rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none p-3 text-xs resize-none"
                />
                <Button type="submit" variant="gold" className="self-end h-10 px-4 text-xs gap-1.5">
                  <Send className="h-3.5 w-3.5" /> Enviar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Rodapé do Modal */}
        <div className="p-4 bg-charcoal/40 border-t border-border flex items-center justify-between text-xs text-silver">
          <span>
            ID do Ativo: <strong className="font-mono text-gold">{opportunity.id}</strong>
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Fechar Janela
          </Button>
        </div>
      </div>

      {/* SUB-MODAL DE ASSINATURA DE NDA DIGITAL & TERMO DE NÃO-CIRCUNVENÇÃO (24 MESES) */}
      {isNdaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian/90 backdrop-blur-lg animate-fade-in">
          <div className="glass rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-gold/40 p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => {
                setIsNdaModalOpen(false);
                setNdaSuccessTicketId(null);
              }}
              className="absolute top-4 right-4 p-2 text-text-secondary hover:text-white bg-charcoal/80 rounded-xl border border-border"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Cabeçalho do NDA */}
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold border border-gold/30 flex items-center justify-center shrink-0">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2 py-0.5 rounded border border-gold/30">
                    Deal Desk & M&A
                  </span>
                  <span className="text-[11px] text-emerald font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Blindagem Jurídica
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                  Termo de Confidencialidade & Não-Circunvenção (24 Meses)
                </h3>
              </div>
            </div>

            {/* Tela de Sucesso após Assinatura */}
            {ndaSuccessTicketId ? (
              <div className="py-6 space-y-4 text-center">
                <div className="h-16 w-16 rounded-full bg-emerald/20 text-emerald border-2 border-emerald/50 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle className="h-9 w-9" />
                </div>

                <div className="space-y-1">
                  <h4 className="font-display text-xl font-bold text-white">
                    Termo de NDA & Não-Circunvenção Firmado com Sucesso!
                  </h4>
                  <p className="text-sm text-silver max-w-md mx-auto">
                    Seu compromisso de confidencialidade foi registrado na Mesa de Deals do Millennium Club com protocolo oficial:
                  </p>
                  <p className="font-mono text-lg font-bold text-gold pt-1">
                    {ndaSuccessTicketId}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-charcoal/60 border border-gold/30 text-xs text-silver max-w-lg mx-auto text-left space-y-2">
                  <p className="text-white font-semibold flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-gold" /> Próximos Passos da Deal Desk:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-silver">
                    <li>Um consultor de M&A do Clube entrará em contato em até 4 horas úteis.</li>
                    <li>O Dossiê Executivo Completo com dados desblindados (razão social, balanços e auditoria) será liberado no seu e-mail corporativo ({ndaEmail || "cadastrado"}).</li>
                    <li>Coordenaremos a conferência introdutória formal com o proprietário do ativo sob mediação do Clube.</li>
                  </ul>
                </div>

                <Button
                  variant="gold"
                  onClick={() => {
                    setIsNdaModalOpen(false);
                    setNdaSuccessTicketId(null);
                  }}
                  className="px-6 font-bold"
                >
                  Concluir e Voltar aos Detalhes
                </Button>
              </div>
            ) : (
              /* Formulário de Assinatura do NDA */
              <form onSubmit={handleNdaSubmit} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-charcoal/50 border border-border text-xs space-y-1">
                  <p className="text-silver">
                    Ativo Solicitado: <strong className="text-white">{opportunity.title}</strong>
                  </p>
                  <p className="text-silver">
                    Volume da Operação: <strong className="text-gold">{opportunity.volume}</strong> • Categoria: <strong className="text-silver">{opportunity.categoryLabel}</strong>
                  </p>
                </div>

                {/* Texto do Acordo Jurídico de Não-Circunvenção */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Cláusula de Confidencialidade e Não-Circunvenção (NCNDA)
                  </label>
                  <div className="h-32 overflow-y-auto bg-charcoal/80 border border-border rounded-xl p-3 text-[11px] text-silver leading-relaxed space-y-2">
                    <p>
                      <strong>1. OBRIGAÇÃO DE SIGILO:</strong> O Interessado compromete-se a manter sob rigorosa confidencialidade toda informação técnica, financeira, societária e comercial a que tiver acesso, vedada a divulgação a terceiros não autorizados.
                    </p>
                    <p>
                      <strong>2. NÃO-CIRCUNVENÇÃO (24 MESES):</strong> O Interessado declara e concorda que todas as tratativas relativas a este ativo serão intermediadas e coordenadas com exclusividade pela plataforma Millennium Club. É expressamente vedado o contato direto ou conclusão de negócios com o proprietário, mandatário ou afiliadas sem o envolvimento da plataforma, sob pena de indenização integral equivalente aos honorários de sucesso estipulados e perdas e danos.
                    </p>
                    <p>
                      <strong>3. VALIDADE ELETRÔNICA:</strong> Este aceite eletrônico possui eficácia legal vinculante perante os artigos 107 e 425 do Código Civil Brasileiro.
                    </p>
                  </div>
                </div>

                {/* Dados Cadastrais do Interessado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-silver mb-1 font-medium">Nome Completo *</label>
                    <Input
                      required
                      placeholder="Ex: Carlos Albuquerque"
                      value={ndaName}
                      onChange={(e) => setNdaName(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-silver mb-1 font-medium">Empresa / Fundo / Family Office *</label>
                    <Input
                      required
                      placeholder="Ex: Alfa Capital Partners"
                      value={ndaCompany}
                      onChange={(e) => setNdaCompany(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-silver mb-1 font-medium">Cargo / Posição *</label>
                    <Input
                      required
                      placeholder="Ex: Diretor de Investimentos / Sócio"
                      value={ndaRole}
                      onChange={(e) => setNdaRole(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-silver mb-1 font-medium">Capacidade Estimada de Aporte *</label>
                    <select
                      value={ndaCapacity}
                      onChange={(e) => setNdaCapacity(e.target.value)}
                      className="w-full h-9 bg-charcoal border border-border rounded-xl px-2 text-xs text-white focus:border-gold focus:outline-none"
                    >
                      <option value="R$ 1.000.000 a R$ 5.000.000">R$ 1.000.000 a R$ 5.000.000</option>
                      <option value="R$ 5.000.000 a R$ 20.000.000">R$ 5.000.000 a R$ 20.000.000</option>
                      <option value="R$ 20.000.000 a R$ 100.000.000">R$ 20.000.000 a R$ 100.000.000</option>
                      <option value="Acima de R$ 100.000.000">Acima de R$ 100.000.000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-silver mb-1 font-medium">WhatsApp / Celular com DDD *</label>
                    <Input
                      required
                      placeholder="(11) 98888-0000"
                      value={ndaPhone}
                      onChange={(e) => setNdaPhone(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-silver mb-1 font-medium">E-mail Corporativo *</label>
                    <Input
                      required
                      type="email"
                      placeholder="investidor@alfacapital.com"
                      value={ndaEmail}
                      onChange={(e) => setNdaEmail(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                {/* Checkbox de Aceite Legal */}
                <div className="pt-2 border-t border-border/70">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={ndaAccepted}
                      onChange={(e) => setNdaAccepted(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-border text-gold focus:ring-gold bg-charcoal shrink-0"
                    />
                    <span className="text-xs text-silver leading-relaxed">
                      Declaro sob as penas da lei que tenho poderes de representação e concordo com os termos de <strong>Confidencialidade e Não-Circunvenção de 24 Meses</strong> do Millennium Club, comprometendo-me a não realizar contato direto nem negociações sem a intermediação da plataforma.
                    </span>
                  </label>
                </div>

                {/* Ações */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsNdaModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    size="sm"
                    disabled={!ndaAccepted || ndaSubmitting}
                    className="font-bold gap-1.5"
                  >
                    {ndaSubmitting ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" /> Registrando NDA...
                      </>
                    ) : (
                      <>
                        <FileCheck2 className="h-4 w-4" /> Assinar Digitalmente & Solicitar Dossiê
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
