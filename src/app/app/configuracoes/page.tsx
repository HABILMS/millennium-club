"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  User,
  Shield,
  Bell,
  Key,
  Database,
  Download,
  Trash2,
  Loader2,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Smartphone,
  Mail,
  Globe,
  Palette,
  MessageSquare,
  X,
} from "lucide-react";
import { useState } from "react";

const sessions = [
  { id: "1", device: "Chrome no Windows", location: "São Paulo, BR", current: true, lastActive: "Agora" },
  { id: "2", device: "Safari no iPhone", location: "São Paulo, BR", current: false, lastActive: "2h atrás" },
  { id: "3", device: "Firefox no Linux", location: "Rio de Janeiro, BR", current: false, lastActive: "3 dias atrás" },
];

const mfaMethods = [
  { id: "totp", name: "Autenticador (TOTP)", description: "Google Authenticator, Authy, 1Password", enabled: true, required: false },
  { id: "sms", name: "SMS", description: "Código enviado por mensagem de texto", enabled: false, required: false },
  { id: "email", name: "E-mail", description: "Código enviado para seu e-mail", enabled: true, required: true },
];

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = React.useState<"conta" | "seguranca" | "notificacoes" | "privacidade" | "sessoes" | "lgpd" | "aparencia">("conta");
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const [accountData, setAccountData] = React.useState({
    fullName: "João da Silva",
    email: "joao@techventures.com.br",
    phone: "(11) 99999-9999",
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "conta", label: "Conta", icon: User },
    { id: "seguranca", label: "Segurança", icon: Shield },
    { id: "notificacoes", label: "Notificações", icon: Bell },
    { id: "privacidade", label: "Privacidade", icon: Globe },
    { id: "sessoes", label: "Sessões ativas", icon: Smartphone },
    { id: "lgpd", label: "LGPD e Dados", icon: Database },
    { id: "aparencia", label: "Aparência", icon: Palette },
  ];

  return (
    
      <div className="space-y-6 animate-fade-up max-w-4xl">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">Configurações</h1>
          <p className="mt-1 text-silver">Gerencie sua conta, segurança, privacidade e preferências</p>
        </div>

        <div className="flex flex-wrap gap-1 border-b border-border mb-6" role="tablist">
          {tabs.map((tab) => (
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

        {activeTab === "conta" && (
          <Card className="glass">
            <CardHeader className="border-b border-border">
              <CardTitle>Informações da conta</CardTitle>
              <CardDescription>Dados de acesso e contato principal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nome completo"
                  value={accountData.fullName}
                  onChange={(e) => setAccountData({ ...accountData, fullName: e.target.value })}
                  required
                />
                <Input
                  label="E-mail principal"
                  type="email"
                  value={accountData.email}
                  onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Telefone/WhatsApp"
                  value={accountData.phone}
                  onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                />
                <select
                  value={accountData.timezone}
                  onChange={(e) => setAccountData({ ...accountData, timezone: e.target.value })}
                  className="w-full bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none py-3.5 px-5 text-base appearance-none"
                >
                  <option value="America/Sao_Paulo">Brasil (Brasília) - UTC-3</option>
                  <option value="America/New_York">EUA (Nova York) - UTC-5</option>
                  <option value="Europe/Lisbon">Portugal (Lisboa) - UTC+0</option>
                  <option value="Europe/Madrid">Espanha (Madri) - UTC+1</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select
                  value={accountData.language}
                  onChange={(e) => setAccountData({ ...accountData, language: e.target.value })}
                  className="w-full bg-charcoal border border-border text-white rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none py-3.5 px-5 text-base appearance-none"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
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

        {activeTab === "seguranca" && (
          <div className="space-y-6">
            <Card className="glass">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center justify-between">
                  Autenticação de dois fatores (2FA)
                  <Badge variant="emerald" size="sm">Ativo</Badge>
                </CardTitle>
                <CardDescription>Camada extra de segurança para sua conta. Obrigatório para administradores.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mfaMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 glass rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", method.enabled ? "bg-emerald/10 text-emerald" : "bg-charcoal text-text-secondary")}>
                        {method.id === "totp" && <Smartphone className="h-5 w-5" />}
                        {method.id === "sms" && <MessageSquare className="h-5 w-5" />}
                        {method.id === "email" && <Mail className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-white">{method.name}</p>
                        <p className="text-sm text-text-secondary">{method.description}</p>
                        {method.required && <Badge variant="alert" size="sm" className="mt-1">Obrigatório</Badge>}
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={method.enabled}
                        disabled={method.required}
                        className="sr-only peer"
                      />
                      <div className={cn("w-11 h-6 rounded-full transition-colors", method.enabled ? "bg-gold" : "bg-border")}>
                        <span className={cn("absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform", method.enabled ? "translate-x-6" : "")} />
                      </div>
                    </label>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => alert("Fluxo de configuração de 2FA seria iniciado aqui")}>
                  Configurar autenticador (TOTP)
                  <Smartphone className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-gold" />
                  Alterar senha
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4 max-w-md">
                  <Input label="Senha atual" type="password" placeholder="••••••••" required />
                  <Input label="Nova senha" type="password" placeholder="Mínimo 8 caracteres" required />
                  <Input label="Confirmar nova senha" type="password" placeholder="Repita a nova senha" required />
                  <Button variant="gold" onClick={handleSave} loading={isSaving}>
                    Atualizar senha
                    <Loader2 className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="glass border-alert/30 bg-alert/5">
              <CardHeader className="border-b border-alert/20">
                <CardTitle className="flex items-center gap-2 text-alert">
                  <AlertTriangle className="h-5 w-5" />
                  Zona de perigo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary">Ações irreversíveis. Use com cuidado.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="text-alert border-alert hover:bg-alert/10" onClick={() => alert("Exportação de dados iniciada")}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar meus dados (LGPD)
                  </Button>
                  <Button variant="ghost" className="text-alert hover:bg-alert/10" onClick={() => {
                    if (confirm("TEM CERTEZA? Esta ação é irreversível e excluirá permanentemente sua conta e todos os dados.")) {
                      alert("Exclusão de conta solicitada");
                    }
                  }}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir minha conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "notificacoes" && (
          <Card className="glass">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-gold" />
                Preferências de notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-white mb-4">Canais</h4>
                <div className="space-y-3">
                  {[
                    { key: "in_app", label: "No aplicativo", desc: "Central de notificações", enabled: true },
                    { key: "email", label: "E-mail", desc: "Transacionais e alertas", enabled: true },
                    { key: "marketing", label: "Marketing", desc: "Newsletters e promoções", enabled: false },
                  ].map((pref) => (
                    <label key={pref.key} className="flex items-center justify-between p-4 glass rounded-xl cursor-pointer hover:border-gold/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked={pref.enabled} className="h-5 w-5 rounded border-border bg-charcoal text-gold focus:ring-gold" />
                        <div>
                          <p className="font-medium text-white">{pref.label}</p>
                          <p className="text-sm text-text-secondary">{pref.desc}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-white mb-4">Tipos (granular)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Status da candidatura", "Entrevista agendada", "Selo conquistado",
                    "Introdução solicitada", "Oportunidade compatível", "Evento confirmado",
                    "Lembrete de evento", "Mensagem admin", "Sistema", "Newsletter",
                  ].map((t) => (
                    <label key={t} className="flex items-center gap-3 p-3 glass rounded-xl cursor-pointer hover:border-gold/30 transition-colors">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border bg-charcoal text-gold focus:ring-gold" />
                      <span className="text-sm text-silver">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button variant="gold" onClick={handleSave} loading={isSaving}>Salvar</Button>
            </CardContent>
          </Card>
        )}

        {activeTab === "privacidade" && (
          <Card className="glass">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-gold" />
                Configurações de privacidade do perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "profile_visible", label: "Perfil visível no diretório", desc: "Outros membros podem te encontrar" },
                { key: "show_email", label: "Mostrar e-mail", desc: "Visível para conexões" },
                { key: "show_phone", label: "Mostrar telefone/WhatsApp", desc: "Visível para conexões" },
                { key: "show_company", label: "Mostrar empresa", desc: "Nome e link da empresa" },
                { key: "allow_introductions", label: "Permitir introduções", desc: "Outros podem pedir para te apresentar" },
                { key: "index_profile", label: "Indexar no Google", desc: "Página pública aparece em buscas" },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center justify-between p-4 glass rounded-xl cursor-pointer hover:border-gold/30 transition-colors">
                  <div>
                    <p className="font-medium text-white">{opt.label}</p>
                    <p className="text-sm text-text-secondary">{opt.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked={opt.key !== "show_email" && opt.key !== "show_phone" && opt.key !== "index_profile"} className="h-5 w-5 rounded border-border bg-charcoal text-gold focus:ring-gold" />
                </label>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === "sessoes" && (
          <Card className="glass">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-gold" />
                Sessões ativas
              </CardTitle>
              <CardDescription>Gerencie onde sua conta está logada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-0">
              {sessions.map((session) => (
                <div key={session.id} className={cn("flex items-center justify-between p-4 border-b border-border last:border-0", session.current && "bg-gold/5")}>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-charcoal flex items-center justify-center text-text-secondary">
                      <Smartphone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{session.device} {session.current && <Badge variant="emerald" size="sm" className="ml-2">Atual</Badge>}</p>
                      <p className="text-sm text-text-secondary">{session.location} • {session.lastActive}</p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="ghost" size="sm" className="text-alert hover:text-alert" onClick={() => alert("Sessão revogada")}>
                      Revogar
                    </Button>
                  )}
                </div>
              ))}
              <div className="p-4">
                <Button variant="outline" className="w-full" onClick={() => alert("Todas as outras sessões revogadas")}>
                  Revogar todas as outras sessões
                  <LogOut className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "lgpd" && (
          <div className="space-y-6">
            <Card className="glass">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-gold" />
                  Seus direitos (LGPD - Lei 13.709/2018)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Acessar dados", desc: "Obter cópia de todos os seus dados pessoais", action: "Solicitar acesso" },
                    { title: "Corrigir dados", desc: "Atualizar informações incompletas ou incorretas", action: "Editar perfil" },
                    { title: "Excluir dados", desc: "Solicitar eliminação (exceto obrigações legais)", action: "Solicitar exclusão" },
                    { title: "Portabilidade", desc: "Receber dados em formato estruturado", action: "Exportar dados" },
                    { title: "Opor tratamento", desc: "Opor-se a processamento baseado em legítimo interesse", action: "Configurar" },
                    { title: "Revogar consentimento", desc: "Retirar consentimento para marketing, analytics", action: "Gerenciar" },
                  ].map((right) => (
                    <Button key={right.title} variant="outline" className="w-full justify-start text-left p-4 h-auto gap-3" onClick={() => alert(right.action)}>
                      <div className="flex-1">
                        <p className="font-medium text-white">{right.title}</p>
                        <p className="text-sm text-text-secondary">{right.desc}</p>
                      </div>
                      <Download className="h-4 w-4 text-gold" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gold" />
                  Consentimentos registrados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { type: "Política de Privacidade", version: "1.0", date: "15/01/2026", status: "active" },
                  { type: "Termos de Uso", version: "1.0", date: "15/01/2026", status: "active" },
                  { type: "Marketing", version: "1.0", date: "15/01/2026", status: "inactive" },
                  { type: "NDA Padrão", version: "2.1", date: "10/01/2026", status: "active" },
                  { type: "Tratamento de Dados", version: "1.0", date: "15/01/2026", status: "active" },
                ].map((consent) => (
                  <div key={consent.type} className="flex items-center justify-between p-4 glass rounded-xl">
                    <div>
                      <p className="font-medium text-white">{consent.type}</p>
                      <p className="text-sm text-text-secondary">v{consent.version} • {consent.date}</p>
                    </div>
                    <Badge variant={consent.status === "active" ? "emerald" : "silver"} size="sm">
                      {consent.status === "active" ? "Ativo" : "Revogado"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass border-alert/30 bg-alert/5">
              <CardHeader className="border-b border-alert/20">
                <CardTitle className="flex items-center gap-2 text-alert">
                  <AlertTriangle className="h-5 w-5" />
                  Encarregado de Proteção de Dados (DPO)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">Para exercer seus direitos ou tirar dúvidas sobre proteção de dados:</p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="glass rounded-xl p-4">
                    <p className="font-medium text-white">E-mail</p>
                    <a href="mailto:privacidade@millenniumclub.com.br" className="text-gold hover:underline">privacidade@millenniumclub.com.br</a>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="font-medium text-white">Canal na plataforma</p>
                    <span className="text-silver">Configurações - LGPD e Dados</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "aparencia" && (
          <Card className="glass">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-gold" />
                Aparência e experiência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-white mb-4">Tema</h4>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "dark", label: "Escuro (padrão)", icon: "🌙" },
                    { id: "light", label: "Claro", icon: "☀️" },
                    { id: "system", label: "Sistema", icon: "💻" },
                  ].map((theme) => (
                    <label key={theme.id} className="relative cursor-pointer">
                      <input type="radio" name="theme" defaultChecked={theme.id === "dark"} className="sr-only" />
                      <div className="glass rounded-xl p-6 text-center border-2 hover:border-gold/30 transition-all peer-checked:border-gold peer-checked:bg-gold/5">
                        <span className="text-3xl block mb-2">{theme.icon}</span>
                        <p className="font-medium text-white">{theme.label}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-white mb-4">Densidade da interface</h4>
                <div className="flex gap-4">
                  {["Compacta", "Confortável", "Espaçosa"].map((density) => (
                    <label key={density} className="flex-1 cursor-pointer">
                      <input type="radio" name="density" defaultChecked={density === "Confortável"} className="sr-only" />
                      <div className="glass rounded-xl p-4 text-center border-2 hover:border-gold/30 transition-all peer-checked:border-gold peer-checked:bg-gold/5">
                        <p className="font-medium text-white">{density}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-white mb-4">Acessibilidade</h4>
                <div className="space-y-3">
                  {[
                    "Reduzir animações",
                    "Alto contraste",
                    "Foco visível sempre",
                    "Tamanho de fonte aumentado",
                  ].map((a11y) => (
                    <label key={a11y} className="flex items-center gap-3 p-4 glass rounded-xl cursor-pointer hover:border-gold/30 transition-colors">
                      <input type="checkbox" className="h-5 w-5 rounded border-border bg-charcoal text-gold focus:ring-gold" />
                      <span className="text-silver">{a11y}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button variant="gold" onClick={handleSave} loading={isSaving}>Salvar preferências</Button>
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
