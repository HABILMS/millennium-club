"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Camera, Save, Loader2, CheckCircle, Building2, Globe, Users, DollarSign, Clock, AlertTriangle, Shield } from "lucide-react";
import { useState } from "react";

const verificationStatus: "verified" | "pending" | "rejected" = "verified";

const getVerificationVariant = () => {
  const status = verificationStatus as string;
  switch (status) {
    case "verified": return "emerald";
    case "pending": return "gold";
    default: return "silver";
  }
};

const getVerificationIcon = () => {
  const status = verificationStatus as string;
  switch (status) {
    case "verified": return <CheckCircle className="h-3.5 w-3.5" />;
    case "pending": return <Clock className="h-3.5 w-3.5" />;
    default: return <AlertTriangle className="h-3.5 w-3.5" />;
  }
};

const getVerificationLabel = () => {
  const status = verificationStatus as string;
  switch (status) {
    case "verified": return "Verificada";
    case "pending": return "Em análise";
    default: return "Não verificada";
  }
};

const revenueBrackets = [
  { value: "ate_5m", label: "Até R$ 5 milhões" },
  { value: "5m_20m", label: "R$ 5M a R$ 20M" },
  { value: "20m_100m", label: "R$ 20M a R$ 100M" },
  { value: "100m_500m", label: "R$ 100M a R$ 500M" },
  { value: "acima_500m", label: "Acima de R$ 500M" },
];

const sizes = [
  { value: "micro", label: "Micro (1-9)" },
  { value: "pequena", label: "Pequena (10-49)" },
  { value: "media", label: "Média (50-249)" },
  { value: "grande", label: "Grande (250+)" },
];

const segments = [
  "Tecnologia", "Agropecuária", "Saúde", "Educação", "Financeiro",
  "Indústria", "Comércio", "Serviços", "Logística", "Energia",
  "Imobiliário", "Telecomunicações", "Outro"
];

export default function EmpresaPage() {
  const [activeTab, setActiveTab] = React.useState<"dados" | "membros" | "verificacao">("dados");
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [logoPreview, setLogoPreview] = React.useState<string | null>("/placeholder-logo.jpg");

  const [formData, setFormData] = React.useState({
    legalName: "TechVentures Ltda",
    tradeName: "TechVentures",
    taxId: "12.345.678/0001-90",
    segment: "Tecnologia",
    revenueBracket: "20m_100m",
    size: "pequena",
    country: "Brasil",
    state: "SP",
    city: "São Paulo",
    website: "https://techventures.com.br",
    description: "Empresa de tecnologia especializada em SaaS B2B para o mercado financeiro. Desenvolvemos soluções de gestão de investimentos, compliance e automação bancária.",
  });

  const [members, setMembers] = React.useState([
    { id: "1", name: "João da Silva", email: "joao@techventures.com.br", role: "owner", title: "CEO & Fundador", status: "active" },
    { id: "2", name: "Maria Santos", email: "maria@techventures.com.br", role: "admin", title: "CFO", status: "active" },
    { id: "3", name: "Carlos Oliveira", email: "carlos@techventures.com.br", role: "member", title: "CTO", status: "active" },
  ]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const verificationStatus = "verified";

  return (
    
      <div className="space-y-6 animate-fade-up max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">Minha empresa</h1>
            <p className="mt-1 text-silver">Gerencie os dados da sua organização e membros da equipe</p>
          </div>
<div className="flex items-center gap-3">
            <Badge variant={getVerificationVariant()} className="gap-2">
              {getVerificationIcon()}
              {getVerificationLabel()}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 border-b border-border mb-6" role="tablist">
          {[
            { id: "dados", label: "Dados da empresa", icon: Building2 },
            { id: "membros", label: "Membros da equipe", icon: Users },
            { id: "verificacao", label: "Verificação", icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl transition-all",
                activeTab === tab.id
                  ? "bg-gold/10 text-gold border-b-2 border-gold"
                  : "text-text-secondary hover:text-silver hover:bg-charcoal/50"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "dados" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 glass">
              <CardHeader className="border-b border-border">
                <CardTitle>Informações da empresa</CardTitle>
                <CardDescription>Dados cadastrais usados para matchmaking e diretório</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Razão social"
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    placeholder="TechVentures Ltda"
                    required
                  />
                  <Input
                    label="Nome fantasia"
                    value={formData.tradeName}
                    onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                    placeholder="TechVentures"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="CNPJ / Identificador"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    placeholder="12.345.678/0001-90"
                    required
                  />
                  <select
                    value={formData.segment}
                    onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                    className="w-full bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none py-3.5 px-5 text-base appearance-none"
                  >
                    {segments.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select
                    value={formData.revenueBracket}
                    onChange={(e) => setFormData({ ...formData, revenueBracket: e.target.value })}
                    className="w-full bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none py-3.5 px-5 text-base appearance-none"
                  >
                    {revenueBrackets.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none py-3.5 px-5 text-base appearance-none"
                  >
                    {sizes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="País"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                  <Input
                    label="Estado"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="SP"
                  />
                  <Input
                    label="Cidade"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="São Paulo"
                  />
                </div>

                <Input
                  label="Site da empresa"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://empresa.com.br"
                />

                <div>
                  <label className="block text-sm font-medium text-silver mb-2">Descrição da empresa</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full bg-charcoal border border-border text-white placeholder-text-secondary rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none py-3.5 px-5 text-base resize-y min-h-[100px]"
                    placeholder="Descreva o negócio, mercado, diferenciais e momento atual..."
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-border">
                  <Button variant="gold" size="lg" onClick={handleSave} loading={isSaving}>
                    Salvar alterações
                    <Loader2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center justify-between">
                  Logotipo
                  <Camera className="h-4 w-4 text-gold" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <div className="h-32 w-full rounded-xl overflow-hidden bg-charcoal border border-border flex items-center justify-center">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Preview do logotipo" className="h-full w-full object-contain p-4" />
                    ) : (
                      <div className="text-text-secondary">Sem logotipo</div>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 h-9 w-9 rounded-full bg-gold text-obsidian flex items-center justify-center cursor-pointer hover:bg-gold-secondary transition-colors">
                    <Camera className="h-5 w-5" />
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="sr-only" />
                  </label>
                </div>
                <p className="text-sm text-text-secondary">PNG, JPG ou SVG. Máx. 2MB. Fundo transparente recomendado.</p>
                <Button variant="outline" className="w-full" onClick={handleSave} loading={isSaving}>
                  Salvar logotipo
                  <Loader2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "membros" && (
          <Card className="glass">
            <CardHeader className="border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Membros da equipe</CardTitle>
                <CardDescription>Gerencie quem tem acesso à empresa no Millennium Club</CardDescription>
              </div>
              <Button variant="gold" size="sm">
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                Convidar membro
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-charcoal/50">
                      <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">Membro</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">Cargo</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">Papel</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">Status</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-text-secondary">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-charcoal/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-semibold">
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="font-medium text-white">{member.name}</p>
                              <p className="text-sm text-text-secondary">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-silver">{member.title}</td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={member.role === "owner" ? "gold" : member.role === "admin" ? "emerald" : "silver"}
                            size="sm"
                          >
                            {member.role === "owner" ? "Proprietário" : member.role === "admin" ? "Admin" : "Membro"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={member.status === "active" ? "emerald" : "silver"} size="sm">
                            {member.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">Editar</Button>
                            {member.id !== "1" && <Button variant="ghost" size="sm" className="text-alert hover:text-alert">Remover</Button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "verificacao" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gold" />
                  Status de verificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="glass rounded-xl p-6 border border-emerald/30 bg-emerald/5">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-white">Empresa verificada</h3>
                      <p className="text-sm text-text-secondary">Verificada em 15/01/2026 por equipe de compliance</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-white">Documentos verificados</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Contrato Social", status: "approved" },
                      { name: "Cartão CNPJ", status: "approved" },
                      { name: "Comprovante de endereço", status: "approved" },
                      { name: "Documentos dos sócios", status: "approved" },
                    ].map((doc) => (
                      <div key={doc.name} className="flex items-center justify-between p-3 glass rounded-lg">
                        <span className="text-sm text-silver">{doc.name}</span>
                        <Badge variant={doc.status === "approved" ? "emerald" : "gold"} size="sm">
                          {doc.status === "approved" ? "Aprovado" : "Pendente"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Atualizar documentação
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gold" />
                  Página pública da empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="glass rounded-xl p-4 border border-gold/20 bg-gold/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-white">URL pública</span>
                    <Badge variant="emerald" size="sm">Ativa</Badge>
                  </div>
                  <div className="font-mono text-sm text-gold bg-charcoal rounded-lg px-3 py-2 mb-3">
                    millenniumclub.com.br/empresa/techventures
                  </div>
                  <Button variant="outline" size="sm" className="w-full">Gerenciar página</Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-white">Configurações de visibilidade</h4>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-silver">Exibir no diretório público</span>
                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-border bg-charcoal text-gold focus:ring-gold" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-silver">Permitir solicitações de parceria</span>
                    <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-border bg-charcoal text-gold focus:ring-gold" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-silver">Mostrar métricas de engajamento</span>
                    <input type="checkbox" className="h-5 w-5 rounded border-border bg-charcoal text-gold focus:ring-gold" />
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {saved && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in glass rounded-xl border border-emerald/30 bg-emerald/5 p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald" />
            <span className="text-emerald font-medium">Alterações salvas com sucesso!</span>
          </div>
        )}
      </div>
    
  );
}
