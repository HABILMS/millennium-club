"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Globe, Mail, Loader2, CheckCircle, Clock, AlertTriangle, Plus, ExternalLink, HelpCircle, Server } from "lucide-react";

const requests = [
  {
    id: "1",
    type: "page",
    title: "Página profissional",
    description: "Crie sua página pública com bio, serviços, cases e formulário de leads",
    status: "approved",
    url: "millenniumclub.com.br/membro/joao-da-silva",
    benefits: ["Perfil verificado", "Formulário de leads", "Métricas de acesso"],
  },
  {
    id: "2",
    type: "domain",
    title: "Domínio próprio",
    description: "Use seu próprio domínio (ex: joaosilva.com.br) para sua página profissional",
    status: "pending",
    url: "joaosilva.com.br",
    benefits: ["SSL automático", "DNS gerenciado", "Renovação inclusa"],
  },
  {
    id: "3",
    type: "email",
    title: "E-mail profissional",
    description: "Conta de e-mail com seu domínio (contato@joaosilva.com.br) ou @millenniumclub.com.br",
    status: "pending",
    url: "contato@joaosilva.com.br",
    benefits: ["5 GB de armazenamento", "Webmail", "Configuração móvel"],
  },
];

export default function SolicitacoesPage() {
  const [activeRequest, setActiveRequest] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved": return { variant: "emerald" as const, icon: CheckCircle, label: "Aprovado" };
      case "pending": return { variant: "gold" as const, icon: Clock, label: "Em análise" };
      case "rejected": return { variant: "alert" as const, icon: AlertTriangle, label: "Recusado" };
      case "provisioning": return { variant: "silver" as const, icon: Loader2, label: "Provisionando" };
      default: return { variant: "silver" as const, icon: HelpCircle, label: status };
    }
  };

const getTypeIcon = (type: string) => {
    switch (type) {
      case "page": return Globe;
      case "domain": return Server;
      case "email": return Mail;
      default: return HelpCircle;
    }
  };

  return (
    
      <div className="space-y-6 animate-fade-up max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">Solicitações de benefícios</h1>
            <p className="mt-1 text-silver">Gerencie sua página profissional, domínio próprio e e-mail corporativo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {requests.map((request) => {
            const TypeIcon = getTypeIcon(request.type);
            const statusConfig = getStatusConfig(request.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card key={request.id} className="glass hover:border-gold/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0", request.type === "page" ? "bg-blue/10 text-blue" : request.type === "domain" ? "bg-purple/10 text-purple" : "bg-green/10 text-green")}>
                        <TypeIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-display text-lg font-semibold text-white">{request.title}</h3>
                          <Badge variant={statusConfig.variant} size="sm" className="gap-1.5">
                            <statusConfig.icon className="h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-text-secondary">{request.description}</p>
                        {request.url && (
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <span className="font-mono text-gold bg-charcoal rounded px-2 py-1">{request.url}</span>
                            {request.status === "approved" && (
                              <a href={`https://${request.url}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline flex items-center gap-1">
                                <ExternalLink className="h-3.5 w-3.5" />
                                Visitar
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-4">
{request.status === "approved" && (
                        <Button variant="outline" size="sm" onClick={() => window.open(`https://${request.url}`, "_blank", "noopener,noreferrer")}>
                          Acessar
                        </Button>
                      )}
                      {request.status === "pending" && (
                        <Button variant="ghost" size="sm" className="text-text-secondary">Cancelar solicitação</Button>
                      )}
                      {request.status === "rejected" && (
                        <Button variant="outline" size="sm" className="text-alert border-alert">Ver motivo</Button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="font-medium text-sm text-white mb-2">Benefícios incluídos</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.benefits.map((benefit) => (
                        <Badge key={benefit} variant="outline" size="sm">{benefit}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              type: "page",
              title: "Página profissional",
              description: "Crie sua presença digital com bio, serviços, cases, depoimentos e formulário de captação de leads.",
              icon: Globe,
              color: "blue",
              benefits: ["URL amigável", "Design responsivo", "SEO otimizado", "Analytics básicos"],
              cta: "Criar página",
            },
{
              type: "domain",
              title: "Domínio próprio",
              description: "Registre ou conecte seu domínio (ex: seunome.com.br) com SSL, DNS gerenciado e renovação automática.",
              icon: Server,
              color: "purple",
              benefits: ["Registro incluso", "SSL automático", "DNS gerenciado", "Renovação anual"],
              cta: "Solicitar domínio",
            },
            {
              type: "email",
              title: "E-mail profissional",
              description: "Caixa de entrada profissional com seu domínio ou @millenniumclub.com.br, 5GB de armazenamento.",
              icon: Mail,
              color: "green",
              benefits: ["5 GB de espaço", "Webmail incluso", "IMAP/SMTP", "Anti-spam"],
              cta: "Solicitar e-mail",
            },
          ].map((item) => (
            <Card key={item.type} className="glass hover:border-gold/30 transition-all">
              <CardContent className="p-6">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-4", `bg-${item.color}/10 text-${item.color}`)}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.benefits.map((benefit) => (
                    <Badge key={benefit} variant="silver" size="sm">{benefit}</Badge>
                  ))}
                </div>
                <Button variant="gold" className="w-full" onClick={() => setActiveRequest(item.type)}>
                  {item.cta}
                  <Plus className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {activeRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm">
            <div className="glass rounded-2xl p-6 w-full max-w-md animate-fade-in border border-gold/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-white">Nova solicitação</h2>
                <button onClick={() => setActiveRequest(null)} className="p-2 text-text-secondary hover:text-white rounded-lg hover:bg-charcoal">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="text-text-secondary mb-6">Preencha os dados para solicitar este benefício. Nossa equipe analisará e entrará em contato.</p>
              <form className="space-y-4">
                <Input label="Nome completo" placeholder="João da Silva" required />
                <Input label="E-mail para contato" type="email" placeholder="joao@email.com" required />
                {activeRequest === "domain" && (
                  <Input label="Domínio desejado" placeholder="meudominio.com.br" required />
                )}
                {activeRequest === "email" && (
                  <Input label="Endereço de e-mail desejado" placeholder="contato@meudominio.com.br" required />
                )}
                {activeRequest === "page" && (
                  <Input label="Slug da página" placeholder="joao-da-silva" required />
                )}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setActiveRequest(null)}>Cancelar</Button>
                  <Button variant="gold" className="flex-1" loading={isSubmitting} onClick={async () => { setIsSubmitting(true); await new Promise(r => setTimeout(r, 1000)); setIsSubmitting(false); setActiveRequest(null); }}>Enviar solicitação</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    
  );
}
