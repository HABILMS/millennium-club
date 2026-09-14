"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Award,
  Bell,
  Activity,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const adminNavigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Candidaturas", href: "/admin/candidaturas", icon: FileText },
  { name: "Membros", href: "/admin/membros", icon: Users },
  { name: "Empresas", href: "/admin/empresas", icon: Building2 },
  { name: "Selos", href: "/admin/selos", icon: Award },
  { name: "Notificações", href: "/admin/notificacoes", icon: Bell },
  { name: "Auditoria", href: "/admin/auditoria", icon: Activity },
  { name: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
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
        aria-label="Navegação administrativa"
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {!sidebarCollapsed && (
            <Link href="/admin" className="font-display text-xl font-semibold text-white flex items-center gap-2">
              <Shield className="h-6 w-6 text-gold" />
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

        <nav className="flex-1 overflow-y-auto p-4 space-y-1" role="navigation" aria-label="Menu administrativo">
          {adminNavigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  "group relative overflow-hidden",
                  isActive
                    ? "bg-gold/10 text-white border border-gold/30"
                    : "text-silver hover:text-white hover:bg-obsidian/50"
                )}
                aria-current={isActive ? "page" : undefined}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {!sidebarCollapsed && <span className="font-medium text-sm truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            href="/app"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-silver hover:text-white hover:bg-obsidian/50 transition-colors"
            title={sidebarCollapsed ? "Ir para área do membro" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium text-sm">Área do membro</span>}
          </Link>
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

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-sm text-text-secondary">
              <span>Admin:</span>
              <span className="text-white font-medium">Admin Master</span>
              <Badge variant="gold" size="sm">Super Admin</Badge>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative" id="admin-user-menu">
                <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-charcoal transition-colors">
                  <div className="h-8 w-8 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-semibold">
                    AM
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

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}