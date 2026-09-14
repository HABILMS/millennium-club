"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/Badge";
import {
  LayoutDashboard,
  User,
  Building2,
  Users,
  FileText,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Globe,
  Mail,
  CreditCard,
  Briefcase,
  Link2,
  Calendar,
} from "lucide-react";

const navigation = [
  { name: "Visão geral", href: "/app", icon: LayoutDashboard },
  { name: "Meu perfil", href: "/app/perfil", icon: User },
  { name: "Minha empresa", href: "/app/empresa", icon: Building2 },
  { name: "Rede de parceiros", href: "/app/parceiros", icon: Users, comingSoon: true },
  { name: "Oportunidades", href: "/app/oportunidades", icon: Briefcase, comingSoon: true },
  { name: "Conexões", href: "/app/conexoes", icon: Link2, comingSoon: true },
  { name: "Comitês", href: "/app/comites", icon: Users, comingSoon: true },
  { name: "Eventos", href: "/app/eventos", icon: Calendar, comingSoon: true },
  { name: "Documentos", href: "/app/documentos", icon: FileText, comingSoon: true },
  { name: "Remunerações", href: "/app/remuneracoes", icon: CreditCard, comingSoon: true },
  { name: "Página profissional", href: "/app/pagina-profissional", icon: Globe, comingSoon: true },
  { name: "Domínio e e-mail", href: "/app/dominio-email", icon: Mail, comingSoon: true },
  { name: "Assinatura", href: "/app/assinatura", icon: CreditCard, comingSoon: true },
  { name: "Notificações", href: "/app/notificacoes", icon: Bell },
  { name: "Configurações", href: "/app/configuracoes", icon: Settings },
];

interface MemberLayoutProps {
  children: React.ReactNode;
}

export function MemberLayout({ children }: MemberLayoutProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-obsidian flex">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-charcoal border-r border-border transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-20" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        aria-label="Navegação do membro"
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {!sidebarCollapsed && (
            <Link href="/app" className="font-display text-xl font-semibold text-white">
              Millennium Club
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-obsidian"
            aria-label={sidebarCollapsed ? "Expandir menu" : "Colapsar menu"}
            aria-expanded={!sidebarCollapsed}
          >
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1" role="navigation" aria-label="Menu principal">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  "group relative overflow-hidden",
                  isActive
                    ? "bg-gold/10 text-white border border-gold/30"
                    : "text-silver hover:text-white hover:bg-obsidian/50",
                  item.comingSoon && "opacity-60 pointer-events-none cursor-not-allowed"
                )}
                aria-current={isActive ? "page" : undefined}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {!sidebarCollapsed && (
                  <>
                    <span className="font-medium text-sm truncate">{item.name}</span>
                    {item.comingSoon && (
                      <span className="ml-auto text-xs px-2 py-0.5 bg-charcoal border border-border rounded-full text-text-secondary">
                        Em breve
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                <BadgeCheck className="h-5 w-5" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-white truncate">Plano Profissional</p>
                  <p className="text-xs text-text-secondary truncate">Válido até 15/12/2026</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-obsidian/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={cn("flex-1 flex flex-col min-w-0 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
        <header className="sticky top-0 z-20 h-16 bg-obsidian/95 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6">
          <button
            className="lg:hidden p-2 text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-charcoal"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={sidebarOpen}
            aria-controls="sidebar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-4">              <div className="hidden sm:flex items-center gap-3 text-sm text-text-secondary">
              <span>Bem-vindo,</span>
              <span className="text-white font-medium">{user?.user_metadata?.first_name ?? "Membro"}</span>
              <span className="h-4 w-px bg-border" />
              <Badge variant="gold" size="sm">{user ? "Verificado" : "Convidado"}</Badge>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/app/notificacoes" className="relative p-2 text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-charcoal">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold text-obsidian text-xs font-bold flex items-center justify-center">3</span>
              </Link>

              <div className="h-8 w-px bg-border mx-1" />

              <div className="relative" id="user-menu">
                <button
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-charcoal transition-colors"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <div className="h-8 w-8 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-semibold">
                    JS
                  </div>
                  <svg className="h-4 w-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8" id="main-content" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <MemberLayout>{children}</MemberLayout>;
}