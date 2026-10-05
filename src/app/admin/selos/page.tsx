"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Award, ShieldCheck, Plus, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface BadgeItem {
  id: string;
  kind: string;
  label: string;
  memberName: string;
  issuedAt: string;
}

const mockBadges: BadgeItem[] = [
  { id: "b-1", kind: "verified_profile", label: "Perfil Verificado 100%", memberName: "Eduardo Silveira", issuedAt: "2026-02-01" },
  { id: "b-2", kind: "founding_member", label: "Membro Fundador", memberName: "Patricia Mendes", issuedAt: "2026-01-10" },
  { id: "b-3", kind: "top_originator", label: "Top Originador Solar", memberName: "Patricia Mendes", issuedAt: "2026-04-15" },
  { id: "b-4", kind: "specialist", label: "Especialista M&A Hoteleiro", memberName: "Fernando Prado", issuedAt: "2026-05-20" },
];

export default function AdminSelosPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-gold" /> Emissão de Selos & Badges
          </h1>
          <p className="text-silver text-sm">
            Atribua selos de verificação, membro fundador e especialista aos associados do clube.
          </p>
        </div>
        <Button variant="gold">
          <Plus className="h-4 w-4 mr-1" /> Emitir Novo Selo
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockBadges.map((b) => (
          <Card key={b.id} className="glass hover:border-gold/30 transition-all">
            <CardHeader className="p-5 border-b border-border flex flex-row items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <Badge variant="gold" size="sm">
                Verificado
              </Badge>
            </CardHeader>
            <CardContent className="p-5 space-y-2">
              <h3 className="font-display font-semibold text-white text-base">{b.label}</h3>
              <p className="text-xs text-silver">Membro: <strong className="text-white">{b.memberName}</strong></p>
              <p className="text-[11px] text-text-secondary">Emitido em: {b.issuedAt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
