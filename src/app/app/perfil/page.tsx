"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Camera, Save, Loader2, CheckCircle, Shield, Eye, EyeOff, Globe, Building2, User } from "lucide-react";
import { useState } from "react";

const privacyOptions = [
  { key: "profile_visible", label: "Perfil visível para membros", description: "Outros membros podem encontrar seu perfil no diretório" },
  { key: "show_email", label: "Mostrar e-mail no perfil", description: "Seu e-mail profissional será visível para conexões" },
  { key: "show_phone", label: "Mostrar telefone/WhatsApp", description: "Seus contatos serão visíveis para conexões" },
  { key: "show_company", label: "Mostrar empresa no perfil", description: "Nome e link da sua empresa" },
  { key: "allow_introductions", label: "Permitir solicitações de introdução", description: "Outros membros podem pedir para ser apresentados a você" },
  { key: "index_profile", label: "Indexar em buscadores (página pública)", description: "Sua página pública pode aparecer no Google" },
];

export default function PerfilPage() {
  const [activeTab, setActiveTab] = React.useState<"dados" | "privacidade" | "foto">("dados");
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const [formData, setFormData] = React.useState({
    fullName: "João da Silva",
    jobTitle: "CEO & Fundador",
    company: "TechVentures Ltda",
    bio: "Empreendedor serial com 15+ anos em tecnologia e investimentos. Fundador de 3 startups, 2 exits. Investidor anjo em 20+ empresas. Especialista em SaaS B2B, FinTech e captação de capital.",
    phone: "(11) 99999-9999",
    whatsapp: "(11) 99999-9999",
    country: "Brasil",
    state: "SP",
    city: "São Paulo",
    linkedin: "https://linkedin.com/in/joaodasilva",
    website: "https://techventures.com.br",
    languages: "Português, Inglês, Espanhol",
    timezone: "America/Sao_Paulo",
  });

  const [privacy, setPrivacy] = React.useState({
    profile_visible: true,
    show_email: false,
    show_phone: false,
    show_company: true,
    allow_introductions: true,
    index_profile: false,
  });

  const [avatar, setAvatar] = React.useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>("/placeholder-avatar.jpg");

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const completion = 85;

  return (
      <div className="space-y-6 animate-fade-up max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">Meu perfil</h1>
            <p className="mt-1 text-silver">Gerencie suas informações profissionais e configurações de privacidade</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass rounded-xl p-4 border border-gold/30 bg-gold/5 min-w-[200px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-secondary">Conclusão do perfil</p>
                  <p className="font-display text-2xl font-bold text-gold">{completion}%</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-3 h-2 bg-charcoal rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-b border-border mb-6" role="tablist">
          {[
            { id: "dados", label: "Dados profissionais", icon: User },
            { id: "privacidade", label: "Privacidade", icon: Shield },
            { id: "foto", label: "Foto e avatar", icon: Camera },
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
          <Card className="glass">
            <CardHeader className="border-b border-border">
              <CardTitle>Informações profissionais</CardTitle>
              <CardDescription>Estes dados são usados para matchmaking e networking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nome completo"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="João da Silva"
                  required
                />
                <Input
                  label="Cargo"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="CEO / Fundador"
                />
              </div>

              <Input
                label="Empresa"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Nome da empresa"
              />

              <div>
                <label className="block text-sm font-medium text-silver mb-2">Biografia executiva</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={5}
                  className="w-full bg-charcoal border border-border text-white placeholder-text-secondary rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none py-3.5 px-5 text-base resize-y min-h-[120px]"
                  placeholder="Conte sua trajetória, especialidades e o que você busca na rede..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Telefone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
                <Input
                  label="WhatsApp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="LinkedIn"
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/seuusuario"
                />
                <Input
                  label="Site pessoal/empresa"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://seusite.com.br"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Idiomas"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  placeholder="Português, Inglês, Espanhol"
                />
                <Input
                  label="Fuso horário"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
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
        )}

        {activeTab === "privacidade" && (
          <Card className="glass">
            <CardHeader className="border-b border-border">
              <CardTitle>Configurações de privacidade</CardTitle>
              <CardDescription>Controle quem vê suas informações e como você aparece na rede</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {privacyOptions.map((option) => (
                <div key={option.key} className="flex items-start justify-between gap-4 p-4 glass rounded-xl">
                  <div className="flex-1">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacy[option.key as keyof typeof privacy]}
                        onChange={(e) => setPrivacy({ ...privacy, [option.key]: e.target.checked })}
                        className="h-5 w-5 rounded border-border bg-charcoal text-gold focus:ring-gold focus:ring-2"
                      />
                      <div>
                        <p className="font-medium text-white">{option.label}</p>
                        <p className="text-sm text-text-secondary">{option.description}</p>
                      </div>
                    </label>
                  </div>
                  <Badge variant={privacy[option.key as keyof typeof privacy] ? "emerald" : "silver"} size="sm">
                    {privacy[option.key as keyof typeof privacy] ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              ))}

              <div className="pt-4 border-t border-border">
                <Button variant="gold" onClick={handleSave} loading={isSaving}>
                  Salvar preferências
                  <Loader2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "foto" && (
          <Card className="glass">
            <CardHeader className="border-b border-border">
              <CardTitle>Foto do perfil e avatar</CardTitle>
              <CardDescription>Sua foto aparece no diretório, matchmaking e comunicações. Use uma foto profissional.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <div className="h-32 w-32 rounded-2xl overflow-hidden bg-charcoal border border-border flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview do avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-text-secondary">Sem foto</div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-gold text-obsidian flex items-center justify-center cursor-pointer hover:bg-gold-secondary transition-colors">
                    <Camera className="h-5 w-5" />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" />
                  </label>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="font-medium text-white">Foto atual</p>
                    <p className="text-sm text-text-secondary">JPG, PNG ou WebP. Máx. 5MB. Recomendado: 400x400px.</p>
                  </div>
                  <Button variant="gold" onClick={handleSave} loading={isSaving}>
                    Salvar foto
                    <Loader2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="glass rounded-xl p-4 border border-border">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gold" />
                  Página pública do perfil
                </h4>
                <p className="text-sm text-text-secondary mb-4">
                  Quando seu perfil estiver 100% completo e você ativar a indexação, sua página pública será:
                </p>
                <div className="font-mono text-sm text-gold bg-charcoal rounded-lg px-3 py-2">
                  millenniumclub.com.br/membro/joao-da-silva
                </div>
              </div>
            </CardContent>
          </Card>
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