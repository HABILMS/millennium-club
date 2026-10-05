"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { Users, Search, Filter, ShieldCheck, UserCheck, UserX, Award, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface MemberRecord {
  id: string;
  member_code: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  job_title: string;
  status: "active" | "pending" | "suspended" | "inactive";
  joined_at: string;
}

const mockMembers: MemberRecord[] = [
  { id: "m-1", member_code: "MC-MBR-001", full_name: "Eduardo Silveira", email: "eduardo@silveiracapital.com", phone: "(11) 98888-7777", company_name: "Silveira Capital", job_title: "Managing Partner", status: "active", joined_at: "2026-01-15" },
  { id: "m-2", member_code: "MC-MBR-002", full_name: "Patricia Mendes", email: "patricia@solarinvest.com.br", phone: "(31) 97777-6666", company_name: "Solar Invest Brasil", job_title: "CEO", status: "active", joined_at: "2026-02-10" },
  { id: "m-3", member_code: "MC-MBR-003", full_name: "Fernando Prado", email: "fprado@hotelariagroup.com", phone: "(21) 96666-5555", company_name: "Prado Hoteis", job_title: "Diretor de Expansão", status: "pending", joined_at: "2026-08-20" },
  { id: "m-4", member_code: "MC-MBR-004", full_name: "Carla Antunes", email: "carla@ecocarbon.org", phone: "(41) 95555-4444", company_name: "EcoCarbon Partners", job_title: "Fundadora", status: "active", joined_at: "2026-03-05" },
];

export default function AdminMembrosPage() {
  const [search, setSearch] = React.useState("");
  const [membersList, setMembersList] = React.useState<MemberRecord[]>(mockMembers);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredMembers = React.useMemo(() => {
    return membersList.filter((m) => {
      const matchStatus = statusFilter === "all" || m.status === statusFilter;
      const matchSearch =
        m.full_name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.company_name.toLowerCase().includes(search.toLowerCase()) ||
        m.member_code.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [membersList, search, statusFilter]);

  const toggleStatus = (id: string) => {
    setMembersList((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === "active" ? "suspended" : "active" } : m
      )
    );
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-gold" /> Gestão de Membros
          </h1>
          <p className="text-silver text-sm">
            Administre os perfis executivos, status de associação e acessos à plataforma.
          </p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary">Membros Ativos</p>
              <p className="font-display text-2xl font-bold text-emerald mt-1">
                {membersList.filter((m) => m.status === "active").length}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-emerald/30" />
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary">Pendentes de Admissão</p>
              <p className="font-display text-2xl font-bold text-amber-400 mt-1">
                {membersList.filter((m) => m.status === "pending").length}
              </p>
            </div>
            <ShieldCheck className="h-8 w-8 text-amber-400/30" />
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary">Suspensos / Inativos</p>
              <p className="font-display text-2xl font-bold text-alert mt-1">
                {membersList.filter((m) => m.status === "suspended" || m.status === "inactive").length}
              </p>
            </div>
            <UserX className="h-8 w-8 text-alert/30" />
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtros */}
      <Card className="glass">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-charcoal border border-border text-white rounded-xl pl-9 pr-4 py-2 text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter("all")}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", statusFilter === "all" ? "bg-gold text-obsidian font-bold" : "bg-charcoal text-silver")}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", statusFilter === "active" ? "bg-emerald text-obsidian font-bold" : "bg-charcoal text-silver")}
            >
              Ativos
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", statusFilter === "pending" ? "bg-amber-500 text-obsidian font-bold" : "bg-charcoal text-silver")}
            >
              Pendentes
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Membros */}
      <Card className="glass">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal/80 border-b border-border text-text-secondary uppercase">
              <tr>
                <th className="p-4">Código / Membro</th>
                <th className="p-4">Empresa & Cargo</th>
                <th className="p-4">Contato</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-silver">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-charcoal/40 transition-colors">
                  <td className="p-4">
                    <p className="font-mono text-[11px] text-gold">{m.member_code}</p>
                    <p className="font-semibold text-white text-sm">{m.full_name}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-white font-medium">{m.company_name}</p>
                    <p className="text-text-secondary text-[11px]">{m.job_title}</p>
                  </td>
                  <td className="p-4 space-y-0.5">
                    <p>{m.email}</p>
                    <p className="text-text-secondary">{m.phone}</p>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={m.status === "active" ? "gold" : m.status === "pending" ? "outline" : "alert"}
                      size="sm"
                    >
                      {m.status === "active" ? "Ativo" : m.status === "pending" ? "Pendente" : "Suspenso"}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant={m.status === "active" ? "outline" : "gold"}
                      size="sm"
                      onClick={() => toggleStatus(m.id)}
                    >
                      {m.status === "active" ? "Suspender" : "Ativar"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
