"use client";

import * as React from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { ChevronRight, CheckCircle, Sparkles, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const opportunityCategories = [
  { id: "automoveis", label: "Automóveis & Frota Executiva", icon: "🚗" },
  { id: "aeronaves", label: "Aeronaves & Aviação Executiva", icon: "✈️" },
  { id: "usinas_rsu", label: "Usinas de RSU (Resíduos Sólidos)", icon: "♻️" },
  { id: "credito_carbono", label: "Crédito de Carbono (Compra / Venda)", icon: "🌿" },
  { id: "usina_solar", label: "Venda de Usina Solar", icon: "☀️" },
  { id: "credito_solar", label: "Venda de Crédito de Usina Solar", icon: "⚡" },
  { id: "passivo_solar", label: "Venda de Passivo de Energia Solar", icon: "🔋" },
  { id: "venda_hoteis", label: "Venda de Redes de Hotéis", icon: "🏨" },
  { id: "compra_hoteis", label: "Compra de Redes de Hotéis", icon: "🏢" },
  { id: "socio_projetos", label: "Sócio para Projetos (Co-investimento / M&A)", icon: "🤝" },
];

export default function CandidaturaPage() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState<Record<string, any>>({
    country: "Brasil",
    timezone: "America/Sao_Paulo",
    signupSource: "linkedin",
    selectedCategories: [],
  });
  const [showOptionalDetails, setShowOptionalDetails] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedCode, setSubmittedCode] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState("");

  const formRef = React.useRef<HTMLDivElement>(null);

  const scrollToFormTop = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError("");
  };

  const toggleCategory = (catId: string) => {
    const current: string[] = formData.selectedCategories || [];
    const updated = current.includes(catId)
      ? current.filter((id) => id !== catId)
      : [...current, catId];
    handleChange("selectedCategories", updated);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.fullName?.trim() || !formData.email?.trim() || !formData.whatsapp?.trim() || !formData.primaryRole) {
        setSubmitError("Por favor, preencha os campos essenciais com asterisco (*).");
        return;
      }
      setSubmitError("");
      setCurrentStep(2);
      setTimeout(scrollToFormTop, 100);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(1);
      setTimeout(scrollToFormTop, 100);
    }
  };

  const handleSubmit = async () => {
    if (!formData.privacyPolicy || !formData.truthfulness) {
      setSubmitError("Você precisa aceitar os termos de privacidade e confirmar a veracidade das informações.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const code = `MC-${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    const txt = (v: any) => {
      const s = String(v ?? "").trim();
      return s === "" ? null : s;
    };

    const categoriesStr = (formData.selectedCategories || [])
      .map((catId: string) => opportunityCategories.find((c) => c.id === catId)?.label || catId)
      .join(", ");

    const payload = {
      code,
      full_name: txt(formData.fullName),
      email: txt(formData.email)?.toLowerCase(),
      phone: txt(formData.whatsapp),
      whatsapp: txt(formData.whatsapp),
      job_title: txt(formData.jobTitle) ?? "Executivo / Sócio",
      company_name: txt(formData.company) ?? "Não informado",
      country: txt(formData.country) ?? "Brasil",
      state: txt(formData.state),
      city: txt(formData.city),
      linkedin: txt(formData.linkedin),
      primary_role: txt(formData.primaryRole) ?? "entrepreneur",
      interest_sectors: categoriesStr || txt(formData.interestSectors),
      network_objective: txt(formData.networkObjective) ?? "Prospecção e originação de negócios executivos",
      executive_bio: txt(formData.executiveBio),
      contribution: txt(formData.contribution) ?? "Conexões estratégicas e originação",
      referred_by: txt(formData.referredBy),
      signup_source: txt(formData.signupSource) ?? "linkedin",
      privacy_policy_accepted: formData.privacyPolicy === true,
      marketing_consent: formData.marketingConsent === true,
      truthfulness_confirmed: formData.truthfulness === true,
      status: "submitted",
    };

    const { error: insertError } = await supabase.from("applications").insert(payload);

    if (insertError) {
      console.error("[candidatura] erro:", insertError);
      setSubmitError("Falha ao salvar candidatura. Verifique os dados e tente novamente.");
      setIsSubmitting(false);
      return;
    }

    setSubmittedCode(code);
    setIsSubmitting(false);
  };

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 pt-16 bg-obsidian text-white min-h-screen">
        <section className="py-10 bg-charcoal/30 border-b border-border">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <Badge variant="gold" size="sm" className="mb-3">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Cadastro de Parceiro Acelerado
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Faça parte do <span className="text-gold">Millennium Club</span>
            </h1>
            <p className="mt-2 text-silver text-sm sm:text-base max-w-xl mx-auto">
              Preenchimento rápido em menos de 60 segundos. Conecte-se a originação de ativos exclusivos e M&A.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 max-w-md mx-auto">
              <div className="flex-1 flex items-center gap-2">
                <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold", currentStep >= 1 ? "bg-gold text-obsidian" : "bg-charcoal text-silver border border-border")}>
                  1
                </div>
                <span className={cn("text-xs font-medium", currentStep >= 1 ? "text-white" : "text-text-secondary")}>Identificação</span>
              </div>
              <div className={cn("h-0.5 flex-1", currentStep === 2 ? "bg-gold" : "bg-border")} />
              <div className="flex-1 flex items-center gap-2">
                <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold", currentStep === 2 ? "bg-gold text-obsidian" : "bg-charcoal text-silver border border-border")}>
                  2
                </div>
                <span className={cn("text-xs font-medium", currentStep === 2 ? "text-white" : "text-text-secondary")}>Interesses & Envio</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-2xl px-4" ref={formRef}>
            {submittedCode ? (
              <Card className="glass border-emerald/40 text-center p-8 sm:p-10 space-y-6 animate-fade-up">
                <div className="h-16 w-16 rounded-full bg-emerald/10 flex items-center justify-center text-emerald mx-auto border border-emerald/30">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h2 className="font-display text-2xl font-bold">Candidatura Recebida com Sucesso!</h2>
                <p className="text-silver text-sm">
                  Sua solicitação foi enviada para o comitê de admissão. Em breve entraremos em contato via WhatsApp/E-mail.
                </p>
                <div className="p-4 rounded-xl bg-charcoal/80 border border-border inline-block min-w-[240px]">
                  <span className="text-xs uppercase tracking-wider text-text-secondary">Código de Protocolo</span>
                  <p className="font-display text-xl font-semibold text-gold mt-1">{submittedCode}</p>
                </div>
                <div>
                  <Button variant="gold" onClick={() => (window.location.href = "/")}>
                    Voltar ao Início
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="glass border-gold/20 shadow-2xl">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-xl text-white">
                    {currentStep === 1 ? "Passo 1: Seus Dados Essenciais" : "Passo 2: Áreas de Originação de Interesse"}
                  </CardTitle>
                  <CardDescription className="text-silver text-xs">
                    {currentStep === 1
                      ? "Informe seus contatos para validação do perfil executivo."
                      : "Selecione em quais tipos de negócios ou ativos você deseja atuar/investir."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-5">
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <Input
                        label="Nome Completo *"
                        placeholder="Ex: Roberto Almeida"
                        value={formData.fullName || ""}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        required
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="E-mail Profissional *"
                          type="email"
                          placeholder="roberto@empresa.com.br"
                          value={formData.email || ""}
                          onChange={(e) => handleChange("email", e.target.value)}
                          required
                        />
                        <Input
                          label="WhatsApp / Celular *"
                          type="tel"
                          placeholder="(11) 99999-8888"
                          value={formData.whatsapp || ""}
                          onChange={(e) => handleChange("whatsapp", e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Empresa Principal"
                          placeholder="Nome da sua empresa"
                          value={formData.company || ""}
                          onChange={(e) => handleChange("company", e.target.value)}
                        />
                        <Input
                          label="Seu Cargo / Atuação"
                          placeholder="Ex: CEO, Diretor, Investor"
                          value={formData.jobTitle || ""}
                          onChange={(e) => handleChange("jobTitle", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-silver mb-1.5">
                          Papel Principal na Rede *
                        </label>
                        <select
                          className="w-full bg-charcoal border border-border text-white rounded-xl py-3 px-4 text-sm focus:border-gold focus:outline-none"
                          value={formData.primaryRole || ""}
                          onChange={(e) => handleChange("primaryRole", e.target.value)}
                        >
                          <option value="">Selecione sua atuação principal...</option>
                          <option value="entrepreneur">Empresário / Fundador</option>
                          <option value="investor">Investidor / Family Office</option>
                          <option value="originator">Originador de Negócios / M&A</option>
                          <option value="consultant">Consultor / Especialista</option>
                          <option value="representative">Representante Comercial</option>
                          <option value="institutional_partner">Parceiro Institucional</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Cidade / Estado"
                          placeholder="Ex: São Paulo - SP"
                          value={formData.city || ""}
                          onChange={(e) => handleChange("city", e.target.value)}
                        />
                        <Input
                          label="Perfil do LinkedIn (opcional)"
                          placeholder="https://linkedin.com/in/perfil"
                          value={formData.linkedin || ""}
                          onChange={(e) => handleChange("linkedin", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Selecione os segmentos de oportunidades de seu interesse:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {opportunityCategories.map((cat) => {
                            const isSelected = (formData.selectedCategories || []).includes(cat.id);
                            return (
                              <button
                                type="button"
                                key={cat.id}
                                onClick={() => toggleCategory(cat.id)}
                                className={cn(
                                  "flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs transition-all",
                                  isSelected
                                    ? "bg-gold/15 border-gold text-white font-medium shadow-md"
                                    : "bg-charcoal/50 border-border text-silver hover:bg-charcoal hover:border-gold/30"
                                )}
                              >
                                <span className="text-base">{cat.icon}</span>
                                <span className="flex-1 truncate">{cat.label}</span>
                                {isSelected && <CheckCircle className="h-4 w-4 text-gold flex-shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Informações Opcionais Retráteis */}
                      <div className="border border-border rounded-xl bg-charcoal/30 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setShowOptionalDetails(!showOptionalDetails)}
                          className="w-full p-3.5 flex items-center justify-between text-xs font-medium text-silver hover:text-white transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-gold" /> Adicionar informações adicionais (Opcional)
                          </span>
                          {showOptionalDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>

                        {showOptionalDetails && (
                          <div className="p-4 border-t border-border space-y-3 bg-obsidian/50">
                            <Input
                              label="Como conheceu o Millennium Club?"
                              placeholder="Ex: Indicação, Evento, LinkedIn..."
                              value={formData.signupSource || ""}
                              onChange={(e) => handleChange("signupSource", e.target.value)}
                            />
                            <div>
                              <label className="block text-xs font-medium text-silver mb-1">
                                Breve histórico executivo / Biografia
                              </label>
                              <textarea
                                className="w-full bg-charcoal border border-border text-white rounded-xl p-3 text-xs focus:border-gold focus:outline-none min-h-[70px]"
                                placeholder="Resumo de investimentos realizados, empresas fundadas..."
                                value={formData.executiveBio || ""}
                                onChange={(e) => handleChange("executiveBio", e.target.value)}
                              />
                            </div>
                            <Input
                              label="Indicação de Membro (se houver)"
                              placeholder="Nome do membro recomendante"
                              value={formData.referredBy || ""}
                              onChange={(e) => handleChange("referredBy", e.target.value)}
                            />
                          </div>
                        )}
                      </div>

                      {/* Consentimento Legal */}
                      <div className="space-y-3 pt-2">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(formData.privacyPolicy)}
                            onChange={(e) => handleChange("privacyPolicy", e.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-border bg-charcoal text-gold focus:ring-gold"
                          />
                          <span className="text-xs text-silver">
                            Aceito a <Link href="/privacidade" className="text-gold underline">Política de Privacidade</Link> e o tratamento confidencial de meus dados. *
                          </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(formData.truthfulness)}
                            onChange={(e) => handleChange("truthfulness", e.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-border bg-charcoal text-gold focus:ring-gold"
                          />
                          <span className="text-xs text-silver">
                            Declaro a veracidade de todas as informações fornecidas. *
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="bg-alert/10 border border-alert/30 text-alert text-xs p-3 rounded-xl flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    {currentStep > 1 ? (
                      <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
                        Voltar
                      </Button>
                    ) : (
                      <div />
                    )}

                    {currentStep === 1 ? (
                      <Button variant="gold" onClick={handleNext}>
                        Avançar para Interesses <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    ) : (
                      <Button variant="gold" size="lg" onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
                        Finalizar Candidatura
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}