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
} from "lucide-react";
import {
  OpportunityItem,
  opportunityCategories,
} from "@/lib/opportunities";

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

  // PDF
  const [pdfFileName, setPdfFileName] = useState("Teaser_Executivo_Investimento.pdf");
  const [pdfFileSize, setPdfFileSize] = useState("3.2 MB");

  // Autor
  const [authorName, setAuthorName] = useState(defaultAuthorName);
  const [authorCompany, setAuthorCompany] = useState(defaultCompanyName);
  const [authorJobTitle, setAuthorJobTitle] = useState("Diretor Executivo & Sócio");
  const [authorBadge, setAuthorBadge] = useState("Membro Verificado 100%");
  const [authorWhatsapp, setAuthorWhatsapp] = useState("(11) 98888-0000");
  const [authorEmail, setAuthorEmail] = useState("membro@millenniumclub.com");

  // Handler para upload local de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageUrl(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler para upload local de PDF
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setPdfFileSize(`${sizeMb} MB`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !volume.trim()) {
      alert("Por favor, preencha o título e o volume da oportunidade.");
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
              <h2 className="font-display text-xl font-bold text-white">
                Publicar Nova Oportunidade ou Negócio
              </h2>
              <p className="text-xs text-silver mt-0.5">
                Sua oportunidade será exibida na vitrine pública e no mural fechado de membros associados.
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

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5 my-5">
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
                placeholder="Ex: São Paulo, SP ou Minas Gerais, Brasil"
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

          {/* Seção 2: Fotos e Documento PDF */}
          <div className="space-y-3 pt-3 border-t border-border">
            <h3 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5" /> 2. Fotos do Ativo & Anexo de Documento (PDF)
            </h3>

            {/* Upload de Imagem */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-charcoal/40 border border-border rounded-xl space-y-2">
                <span className="text-xs font-semibold text-white block">Foto Principal do Ativo</span>
                <p className="text-[11px] text-silver">Faça upload de uma foto ou informe a URL:</p>
                <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-gold/40 rounded-xl cursor-pointer hover:bg-gold/5 transition-colors">
                  <Upload className="h-4 w-4 text-gold" />
                  <span className="text-xs font-medium text-gold">Escolher arquivo de imagem</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <Input
                  placeholder="Ou cole a URL da imagem..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="h-8 text-xs mt-1"
                />
              </div>

              {/* Upload de PDF */}
              <div className="p-4 bg-charcoal/40 border border-border rounded-xl space-y-2">
                <span className="text-xs font-semibold text-white block">Documento Anexo (Teaser em PDF)</span>
                <p className="text-[11px] text-silver">Anexe o teaser, deck de apresentação ou ficha técnica:</p>
                <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-alert/40 rounded-xl cursor-pointer hover:bg-alert/5 transition-colors">
                  <FileText className="h-4 w-4 text-alert" />
                  <span className="text-xs font-medium text-alert">Anexar Documento PDF</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </label>
                <div className="flex items-center justify-between text-xs text-silver mt-1 px-1">
                  <span className="truncate text-white font-medium">{pdfFileName}</span>
                  <span className="text-text-secondary">{pdfFileSize}</span>
                </div>
              </div>
            </div>

            {/* Prévia da Foto */}
            {imageUrl && (
              <div className="relative h-28 w-full rounded-xl overflow-hidden border border-border mt-2">
                <img src={imageUrl} alt="Prévia" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-obsidian/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur">
                  Prévia da foto de capa
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

          {/* Botões do Rodapé */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="gold" className="gap-2 font-semibold">
              <Check className="h-4 w-4" /> Publicar Oportunidade
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
