"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  CheckCircle2,
  Edit,
  Save,
  Globe,
  Briefcase,
  Clock,
  Sparkles,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { defaultPlansData } from "@/lib/plans";

export default function AdminPlanosPage() {
  const [plans, setPlans] = useState<any[]>(defaultPlansData);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states de edição
  const [priceReais, setPriceReais] = useState<number>(0);
  const [billingInterval, setBillingInterval] = useState<string>("month");
  const [badgeText, setBadgeText] = useState<string>("");
  const [popular, setPopular] = useState<boolean>(false);
  const [digitalKitIncluded, setDigitalKitIncluded] = useState<boolean>(false);
  const [maxActiveDeals, setMaxActiveDeals] = useState<number>(1);
  const [validityDays, setValidityDays] = useState<number>(20);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.plans) && data.plans.length > 0) {
          setPlans(data.plans);
        }
      }
    } catch (e) {
      console.warn("Falha ao carregar planos:", e);
    }
  };

  const handleStartEdit = (plan: any) => {
    setEditingPlan(plan);
    setPriceReais(plan.price_cents ? plan.price_cents / 100 : 0);
    setBillingInterval(plan.billing_interval || "month");
    setBadgeText(plan.badge_text || "");
    setPopular(Boolean(plan.popular));
    setDigitalKitIncluded(Boolean(plan.digital_kit_included));
    setMaxActiveDeals(plan.max_active_deals || 1);
    setValidityDays(Math.max(20, plan.validity_days || 20));
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    setIsSaving(true);
    const updatedPayload = {
      code: editingPlan.code,
      price_cents: Math.round(priceReais * 100),
      billing_interval: billingInterval,
      badge_text: badgeText.trim() || null,
      popular,
      digital_kit_included: digitalKitIncluded,
      max_active_deals: maxActiveDeals,
      validity_days: Math.max(20, validityDays),
    };

    try {
      const res = await fetch("/api/plans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      if (res.ok) {
        setPlans((prev) =>
          prev.map((p) => (p.code === editingPlan.code ? { ...p, ...updatedPayload } : p))
        );
        showToast(`Plano "${editingPlan.name}" atualizado com sucesso!`);
      } else {
        // Atualiza localmente
        setPlans((prev) =>
          prev.map((p) => (p.code === editingPlan.code ? { ...p, ...updatedPayload } : p))
        );
        showToast(`Plano "${editingPlan.name}" atualizado localmente!`);
      }
    } catch (err) {
      console.warn("Erro ao salvar plano:", err);
    } finally {
      setIsSaving(false);
      setEditingPlan(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-charcoal/95 border border-gold/40 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-text-secondary hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" size="sm">
              <CreditCard className="h-3.5 w-3.5 mr-1" /> Faturamento & Modelo de Negócios
            </Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            Configuração dos Planos & Benefícios
          </h1>
          <p className="mt-1 text-silver text-sm">
            Gerencie os valores de assinatura, cotas de oportunidades e liberação do Kit Presença Digital diretamente pelo painel.
          </p>
        </div>

        <a
          href="/planos"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline font-semibold bg-gold/10 px-3 py-2 rounded-xl border border-gold/30 shrink-0"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Ver Página Pública de Planos
        </a>
      </div>

      {/* Grid de Planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.code}
            className={cn(
              "glass transition-all hover:border-gold/40 border-border relative flex flex-col",
              plan.popular && "border-gold/50 ring-1 ring-gold/30 shadow-lg"
            )}
          >
            {plan.badge_text && (
              <Badge variant="gold" className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] px-2.5 py-0.5">
                {plan.badge_text}
              </Badge>
            )}

            <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-white">{plan.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStartEdit(plan)}
                    className="h-8 w-8 p-0 text-gold hover:text-white hover:bg-gold/10"
                    title="Editar Plano"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-xs text-silver mt-1">{plan.description}</p>

                {/* Preço */}
                <div className="mt-4 pt-4 border-t border-border">
                  {plan.price_cents > 0 ? (
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-2xl font-bold text-white">
                        R$ {(plan.price_cents / 100).toLocaleString("pt-BR")}
                      </span>
                      <span className="text-xs text-silver">
                        /{plan.billing_interval === "month" ? "mês" : "ano"}
                      </span>
                    </div>
                  ) : (
                    <span className="font-display text-xl font-bold text-gold">
                      {plan.code === "free" ? "R$ 0 (Gratuito)" : "Sob Convite"}
                    </span>
                  )}
                </div>

                {/* Métricas Principais */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-silver">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-gold" /> Oportunidades:
                    </span>
                    <span className="font-bold text-white">
                      {plan.max_active_deals >= 999 ? "Ilimitadas" : `${plan.max_active_deals} ativas`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-silver">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gold" /> Validade do Ativo:
                    </span>
                    <span className="font-bold text-white">{plan.validity_days || 20} dias</span>
                  </div>

                  <div className="flex items-center justify-between text-silver">
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-gold" /> Kit Digital:
                    </span>
                    <span className={cn("font-bold", plan.digital_kit_included ? "text-emerald" : "text-text-secondary")}>
                      {plan.digital_kit_included ? "Incluso (Domínio + E-mails)" : "Não incluso"}
                    </span>
                  </div>
                </div>

                {/* Lista de Recursos */}
                <div className="mt-4 pt-3 border-t border-border space-y-1.5">
                  {Array.isArray(plan.features) &&
                    plan.features.slice(0, 4).map((f: string, idx: number) => (
                      <p key={idx} className="text-[11px] text-silver flex items-start gap-1.5 leading-snug">
                        <Check className="h-3 w-3 text-gold shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </p>
                    ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStartEdit(plan)}
                className="w-full text-xs font-semibold gap-1.5 border-border hover:border-gold hover:text-white"
              >
                <Edit className="h-3.5 w-3.5 text-gold" /> Configurar Plano
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Edição de Plano */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian/85 backdrop-blur-md animate-fade-in">
          <div className="glass rounded-2xl w-full max-w-lg border border-gold/40 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gold" />
                <h3 className="font-display font-bold text-white text-lg">
                  Configurar Plano: {editingPlan.name}
                </h3>
              </div>
              <button onClick={() => setEditingPlan(null)} className="p-1 text-text-secondary hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              {/* Valor em Reais */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-silver uppercase">Preço Mensal (R$):</label>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    value={priceReais}
                    onChange={(e) => setPriceReais(Number(e.target.value))}
                    className="text-xs bg-charcoal"
                    required
                  />
                  <p className="text-[10px] text-silver">Digite 0 para plano gratuito ou sob convite.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-silver uppercase">Periodicidade:</label>
                  <select
                    value={billingInterval}
                    onChange={(e) => setBillingInterval(e.target.value)}
                    className="w-full bg-charcoal border border-border text-white rounded-xl px-3 py-2 text-xs focus:border-gold focus:outline-none"
                  >
                    <option value="month">Mensal</option>
                    <option value="year">Anual</option>
                  </select>
                </div>
              </div>

              {/* Cotas de Negócios e Validade */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-silver uppercase">Max. Negócios Ativos:</label>
                  <Input
                    type="number"
                    min="1"
                    value={maxActiveDeals}
                    onChange={(e) => setMaxActiveDeals(Number(e.target.value))}
                    className="text-xs bg-charcoal"
                  />
                  <p className="text-[10px] text-silver">Use 999 para ilimitados.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-silver uppercase">Validade Padrão (Dias):</label>
                  <Input
                    type="number"
                    min="20"
                    value={validityDays}
                    onChange={(e) => setValidityDays(Number(e.target.value))}
                    className="text-xs bg-charcoal"
                  />
                  <p className="text-[10px] text-silver">Mínimo obrigatório: 20 dias.</p>
                </div>
              </div>

              {/* Badge e Destaque */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-silver uppercase">Texto do Badge (opcional):</label>
                <Input
                  placeholder="Ex: Mais Popular, Completo, Sob Convite..."
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="text-xs bg-charcoal"
                />
              </div>

              {/* Checkboxes de Configuração */}
              <div className="p-3 bg-charcoal rounded-xl border border-border space-y-2 text-xs">
                <label className="flex items-center gap-2 text-silver cursor-pointer">
                  <input
                    type="checkbox"
                    checked={digitalKitIncluded}
                    onChange={(e) => setDigitalKitIncluded(e.target.checked)}
                    className="rounded accent-gold h-4 w-4"
                  />
                  <span>
                    <strong>Incluir Kit Presença Digital:</strong> concede direito a 1 domínio por 1 ano + 5 caixas de e-mail + Landing Page.
                  </span>
                </label>

                <label className="flex items-center gap-2 text-silver cursor-pointer pt-1 border-t border-border">
                  <input
                    type="checkbox"
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                    className="rounded accent-gold h-4 w-4"
                  />
                  <span>Marcar este plano como destaque visual ("Mais Popular") na vitrine de preços.</span>
                </label>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingPlan(null)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="gold" size="sm" loading={isSaving} className="font-bold gap-1">
                  <Save className="h-3.5 w-3.5" /> Salvar Configurações
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
