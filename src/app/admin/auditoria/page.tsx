"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Activity, Shield, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  entity: string;
  date: string;
}

const mockLogs: AuditEntry[] = [
  { id: "log-1", actor: "Admin Master", action: "Aprovação de Candidatura (MC-88A)", entity: "applications", date: "2026-09-16 18:42" },
  { id: "log-2", actor: "Admin Master", action: "Emissão de Selo Verificado", entity: "badges", date: "2026-09-15 14:20" },
  { id: "log-3", actor: "Compliance Bot", action: "Validação KYC / Antecedentes", entity: "applications", date: "2026-09-14 11:05" },
  { id: "log-4", actor: "Admin Master", action: "Atualização de Status de Membro", entity: "members", date: "2026-09-12 09:30" },
];

export default function AdminAuditoriaPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="h-6 w-6 text-gold" /> Logs de Auditoria & Compliance
        </h1>
        <p className="text-silver text-sm">
          Rastreamento histórico de ações administrativas, aprovações e auditorias na plataforma.
        </p>
      </div>

      <Card className="glass">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal/80 border-b border-border text-text-secondary uppercase">
              <tr>
                <th className="p-4">Data / Hora</th>
                <th className="p-4">Operador</th>
                <th className="p-4">Ação Realizada</th>
                <th className="p-4">Tabela Afetada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-silver">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-charcoal/40 transition-colors">
                  <td className="p-4 font-mono text-text-secondary flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gold" /> {log.date}
                  </td>
                  <td className="p-4 font-semibold text-white">{log.actor}</td>
                  <td className="p-4">{log.action}</td>
                  <td className="p-4">
                    <Badge variant="outline" size="sm">
                      {log.entity}
                    </Badge>
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
