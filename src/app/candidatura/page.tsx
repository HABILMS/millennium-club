"use client";

import * as React from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "url" | "number" | "select" | "textarea" | "checkbox";
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

const steps = [
  { number: 1, title: "Informações básicas", href: "#" },
  { number: 2, title: "Perfil profissional", href: "#" },
  { number: 3, title: "Negócios e investimento", href: "#" },
  { number: 4, title: "Contribuição e consentimento", href: "#" },
];

const stepFields: Record<number, FormField[]> = {
  1: [
    { name: "fullName", label: "Nome completo", type: "text", required: true, placeholder: "João da Silva" },
    { name: "email", label: "E-mail profissional", type: "email", required: true, placeholder: "joao@empresa.com.br" },
    { name: "phone", label: "Telefone", type: "tel", placeholder: "(11) 99999-9999" },
    { name: "whatsapp", label: "WhatsApp", type: "tel", placeholder: "(11) 99999-9999" },
    { name: "jobTitle", label: "Cargo", type: "text", placeholder: "CEO / Fundador" },
    { name: "company", label: "Empresa", type: "text", placeholder: "Nome da empresa" },
    { name: "country", label: "País", type: "text", defaultValue: "Brasil" },
    { name: "state", label: "Estado", type: "text", placeholder: "SP" },
    { name: "city", label: "Cidade", type: "text", placeholder: "São Paulo" },
    { name: "linkedin", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/in/joaodasilva" },
    { name: "website", label: "Site pessoal/empresa", type: "url", placeholder: "https://empresa.com.br" },
    { name: "languages", label: "Idiomas", type: "text", placeholder: "Português, Inglês, Espanhol" },
    { name: "timezone", label: "Fuso horário", type: "text", defaultValue: "America/Sao_Paulo" },
  ],
  2: [
    { name: "primaryRole", label: "Papel principal", type: "select", required: true, options: [
      { value: "", label: "Selecione" },
      { value: "entrepreneur", label: "Empresário" },
      { value: "investor", label: "Investidor" },
      { value: "consultant", label: "Consultor" },
      { value: "specialist", label: "Especialista técnico" },
      { value: "originator", label: "Originador de negócios" },
      { value: "representative", label: "Representante comercial" },
      { value: "institutional_partner", label: "Parceiro institucional" },
      { value: "service_provider", label: "Prestador de serviços" },
    ]},
    { name: "additionalRoles", label: "Papéis adicionais", type: "text", placeholder: "Ex: investor, consultant" },
    { name: "sectors", label: "Setor e subsetores", type: "text", placeholder: "Tecnologia, SaaS, FinTech" },
    { name: "executiveBio", label: "Biografia executiva", type: "textarea", rows: 4, placeholder: "Resumo da sua trajetória profissional..." },
    { name: "professionalHistory", label: "Histórico profissional", type: "textarea", rows: 4, placeholder: "Principais empresas, cargos e períodos..." },
    { name: "competencies", label: "Competências", type: "text", placeholder: "Estratégia, M&A, Captação, Gestão" },
    { name: "keyResults", label: "Principais resultados", type: "textarea", rows: 3, placeholder: "Ex: Liderou captação de R$ 50M, Exit de startup..." },
    { name: "references", label: "Referências profissionais", type: "textarea", rows: 3, placeholder: "Nome, cargo, empresa, contato, relação" },
  ],
  3: [
    { name: "networkObjective", label: "Objetivo na rede", type: "textarea", rows: 3, required: true, placeholder: "O que você busca ao entrar no Millennium Club?" },
    { name: "interestSectors", label: "Setores de interesse", type: "text", placeholder: "Agro, Logística, Saúde, Energia, Imobiliário, Tech" },
    { name: "interestRegions", label: "Regiões de interesse", type: "text", placeholder: "Brasil, América Latina, EUA, Europa" },
    { name: "minTicket", label: "Ticket mínimo (R$)", type: "number", placeholder: "1000000" },
    { name: "maxTicket", label: "Ticket máximo (R$)", type: "number", placeholder: "50000000" },
    { name: "revenueBracket", label: "Faturamento anual por faixa", type: "select", options: [
      { value: "", label: "Selecione" },
      { value: "ate_5m", label: "Até R$ 5 milhões" },
      { value: "5m_20m", label: "R$ 5M a R$ 20M" },
      { value: "20m_100m", label: "R$ 20M a R$ 100M" },
      { value: "100m_500m", label: "R$ 100M a R$ 500M" },
      { value: "acima_500m", label: "Acima de R$ 500M" },
    ]},
    { name: "businessStages", label: "Estágio dos negócios de interesse", type: "text", placeholder: "Early stage, Growth, M&A, Sucessão" },
    { name: "preferredModels", label: "Modelos de negócio preferidos", type: "text", placeholder: "B2B SaaS, Marketplace, Indústria, Serviços" },
    { name: "participationInterests", label: "Interesse em participar como", type: "text", placeholder: "Investir, Captar, Representar, Indicar, Consultoria" },
  ],
  4: [
    { name: "contribution", label: "Como poderá contribuir", type: "textarea", rows: 3, required: true, placeholder: "Network, capital, expertise, originação, mentoria..." },
    { name: "committeeInterests", label: "Comitês de interesse", type: "text", placeholder: "Agro, Infra, Saúde, Tech, Finanças, Internacional" },
    { name: "referredBy", label: "Indicação de membro existente (opcional)", type: "text", placeholder: "Nome do membro que o indicou" },
    { name: "signupSource", label: "Origem do cadastro", type: "select", required: true, options: [
      { value: "", label: "Como conheceu o Millennium Club?" },
      { value: "indication", label: "Indicação de membro" },
      { value: "event", label: "Evento" },
      { value: "linkedin", label: "LinkedIn" },
      { value: "press", label: "Imprensa/Artigo" },
      { value: "search", label: "Busca orgânica" },
      { value: "other", label: "Outro" },
    ]},
    { name: "privacyPolicy", label: "Aceito a Política de Privacidade", type: "checkbox", required: true },
    { name: "marketingConsent", label: "Autorizo contato para comunicações", type: "checkbox" },
    { name: "truthfulness", label: "Confirmo a veracidade das informações", type: "checkbox", required: true },
  ],
};

export default function CandidaturaPage() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [submittedCode, setSubmittedCode] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState("");

  const handleChange = (name: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaved(false);
    if (submitError) setSubmitError("");
  };

  const formRef = React.useRef<HTMLDivElement>(null);

  const scrollToFormTop = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNext = () => {
    const fields = stepFields[currentStep as keyof typeof stepFields];
    const requiredFields = fields.filter(f => f.required);
    const isValid = requiredFields.every(f => {
      const value = formData[f.name];
      if (f.type === "checkbox") return value === true;
      return value && String(value).trim() !== "";
    });

    if (!isValid) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      setTimeout(scrollToFormTop, 100);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setTimeout(scrollToFormTop, 100);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("millennium_candidatura_draft", JSON.stringify({
      step: currentStep,
      data: formData,
      savedAt: new Date().toISOString(),
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSubmit = async () => {
    const fields = stepFields[4];
    const requiredFields = fields.filter(f => f.required);
    const isValid = requiredFields.every(f => {
      const value = formData[f.name];
      if (f.type === "checkbox") return value === true;
      return value && String(value).trim() !== "";
    });

    if (!isValid) {
      setSubmitError("Por favor, preencha os campos obrigatórios e aceite os termos antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    // Código de protocolo amigável (coluna `code` é unique no banco).
    const code = `MC-${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    const num = (v: unknown) => {
      const raw = String(v ?? "").trim();
      if (raw === "") return null;
      const n = Number(raw.replace(/\./g, "").replace(",", "."));
      return Number.isFinite(n) ? n : null;
    };
    const txt = (v: unknown) => {
      const s = String(v ?? "").trim();
      return s === "" ? null : s;
    };

    // Mapeia os campos do formulário para as colunas da tabela `applications`.
    const payload = {
      code,
      // etapa 1
      full_name: txt(formData.fullName),
      email: txt(formData.email)?.toLowerCase(),
      phone: txt(formData.phone),
      whatsapp: txt(formData.whatsapp),
      job_title: txt(formData.jobTitle),
      company_name: txt(formData.company),
      country: txt(formData.country) ?? "Brasil",
      state: txt(formData.state),
      city: txt(formData.city),
      linkedin: txt(formData.linkedin),
      website: txt(formData.website),
      languages: txt(formData.languages),
      timezone: txt(formData.timezone) ?? "America/Sao_Paulo",
      // etapa 2 (primary_role usa os mesmos valores do enum no banco)
      primary_role: txt(formData.primaryRole),
      additional_roles: txt(formData.additionalRoles),
      sectors: txt(formData.sectors),
      executive_bio: txt(formData.executiveBio),
      professional_history: txt(formData.professionalHistory),
      competencies: txt(formData.competencies),
      key_results: txt(formData.keyResults),
      professional_references: txt(formData.references),
      // etapa 3
      network_objective: txt(formData.networkObjective),
      interest_sectors: txt(formData.interestSectors),
      interest_regions: txt(formData.interestRegions),
      min_ticket: num(formData.minTicket),
      max_ticket: num(formData.maxTicket),
      revenue_bracket: txt(formData.revenueBracket),
      business_stages: txt(formData.businessStages),
      preferred_models: txt(formData.preferredModels),
      participation_interests: txt(formData.participationInterests),
      // etapa 4
      contribution: txt(formData.contribution),
      committee_interests: txt(formData.committeeInterests),
      referred_by: txt(formData.referredBy),
      signup_source: txt(formData.signupSource),
      privacy_policy_accepted: formData.privacyPolicy === true,
      marketing_consent: formData.marketingConsent === true,
      truthfulness_confirmed: formData.truthfulness === true,
    };

    const { error: insertError } = await supabase
      .from("applications")
      .insert(payload);

    if (insertError) {
      console.error("[candidatura] erro ao salvar:", insertError);
      setSubmitError(
        "Não foi possível enviar sua candidatura agora. Tente novamente em alguns instantes — se o problema persistir, fale conosco pela página de contato."
      );
      setIsSubmitting(false);
      return;
    }

    localStorage.removeItem("millennium_candidatura_draft");
    setSubmittedCode(code);
    setIsSubmitting(false);
    setFormData({});
    setCurrentStep(1);
    scrollToFormTop();
  };

  React.useEffect(() => {
    const draft = localStorage.getItem("millennium_candidatura_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.data) {
          setFormData(parsed.data);
          setCurrentStep(parsed.step || 1);
        }
      } catch {}
    }
  }, []);

  const progress = (currentStep / 4) * 100;

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 pt-16">
        <section className="py-12 bg-charcoal/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="hidden md:flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                {steps.map((step, index) => (
                  <React.Fragment key={step.number}>
                    <div className={cn(
                      "flex items-center gap-2",
                      index < currentStep - 1 ? "text-gold" : index === currentStep - 1 ? "text-white" : "text-text-secondary"
                    )}>
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm",
                        index < currentStep - 1 ? "bg-gold text-obsidian" : index === currentStep - 1 ? "bg-gold text-obsidian" : "bg-charcoal border border-border text-silver"
                      )}>
                        {index < currentStep - 1 ? <CheckCircle className="h-4 w-4" /> : step.number}
                      </div>
                      <span className="font-medium hidden sm:block">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "h-0.5 w-20",
                        index < currentStep - 1 ? "bg-gold" : "bg-border"
                      )} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="md:hidden mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-silver">Progresso</span>
                <span className="text-sm font-semibold text-gold">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-charcoal rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-text-secondary mt-1 text-center">
                Etapa {currentStep} de 4: {steps[currentStep - 1].title}
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {submittedCode ? (
              <Card className="glass border-emerald/30">
                <CardContent className="p-8 sm:p-10 text-center space-y-5">
                  <div className="h-16 w-16 rounded-full bg-emerald/10 flex items-center justify-center text-emerald mx-auto">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-white">Candidatura enviada!</h2>
                  <p className="text-silver">
                    Recebemos sua candidatura. Nossa equipe fará a análise e entrará em contato em até 5 dias úteis pelo e-mail informado.
                  </p>
                  <div className="inline-block rounded-xl border border-border bg-charcoal/50 px-8 py-4">
                    <p className="text-xs uppercase tracking-wider text-text-secondary">Protocolo</p>
                    <p className="font-display text-xl text-gold mt-1">{submittedCode}</p>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmittedCode(null);
                        setFormData({});
                        setCurrentStep(1);
                        scrollToFormTop();
                      }}
                    >
                      Enviar nova candidatura
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
            <Card className="glass">
              <CardHeader className="border-b border-border">
                <CardTitle>Etapa {currentStep} de 4: {steps[currentStep - 1].title}</CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Dados pessoais e de contato para identificação"}
                  {currentStep === 2 && "Sua trajetória, competências e como você atua no mercado"}
                  {currentStep === 3 && "Seus interesses de investimento, setores e tickets"}
                  {currentStep === 4 && "Como você agrega valor à rede e consentimentos legais"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6" ref={formRef} data-testid="form-content">
                {stepFields[currentStep as keyof typeof stepFields].map((field) => (
                  <div key={field.name}>
                    {field.type === "select" && (
                      <div>
                        <label className="block text-sm font-medium text-silver mb-2">
                          {field.label}
                          {field.required && <span className="text-alert ml-1" aria-hidden="true">*</span>}
                        </label>
                        <select
                          value={String(formData[field.name] || "")}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          className={cn(
                            "w-full bg-charcoal border border-border text-white placeholder-text-secondary rounded-xl",
                            "focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none",
                            "py-3.5 px-5 text-base"
                          )}
                          required={field.required}
                        >
                          {field.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {field.type === "textarea" && (
                      <div>
                        <label className="block text-sm font-medium text-silver mb-2">
                          {field.label}
                          {field.required && <span className="text-alert ml-1" aria-hidden="true">*</span>}
                        </label>
                        <textarea
                          value={String(formData[field.name] || "")}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          rows={field.rows || 3}
                          className={cn(
                            "w-full bg-charcoal border border-border text-white placeholder-text-secondary rounded-xl",
                            "focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none",
                            "py-3.5 px-5 text-base resize-y min-h-[100px]"
                          )}
                          required={field.required}
                          placeholder={field.placeholder}
                        />
                      </div>
                    )}
                    {field.type === "checkbox" && (
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(formData[field.name])}
                          onChange={(e) => handleChange(field.name, e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-border bg-charcoal text-gold focus:ring-gold focus:ring-2"
                          required={field.required}
                        />
                        <span className="text-sm text-silver">{field.label}</span>
                      </label>
                    )}
                    {field.type !== "select" && field.type !== "textarea" && field.type !== "checkbox" && (
                      <Input
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={String(formData[field.name] || "")}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}

                {submitError && (
                  <div className="bg-alert/10 border border-alert/30 text-alert rounded-xl p-4 text-sm" role="alert">
                    {submitError}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                  <Button variant="secondary" onClick={handleSaveDraft} disabled={isSubmitting}>
                    {saved ? "Rascunho salvo ✓" : "Salvar rascunho"}
                  </Button>
                  <div className="flex gap-3 w-full sm:w-auto">
                    {currentStep > 1 && (
                      <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
                        Voltar
                      </Button>
                    )}
                    {currentStep < 4 ? (
                      <Button variant="gold" onClick={handleNext} disabled={isSubmitting}>
                        Próxima
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="gold" size="lg" onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
                        Enviar candidatura
                        <Loader2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

            <div className="mt-6 text-center text-sm text-text-secondary">
              <p>Ao enviar, você concorda com nossos <Link href="/termos" className="text-gold hover:underline">Termos de Uso</Link> e <Link href="/privacidade" className="text-gold hover:underline">Política de Privacidade</Link>.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}