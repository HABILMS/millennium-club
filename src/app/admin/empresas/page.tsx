"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Building2, Search, Plus, MapPin, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

interface CompanyRecord {
  id: string;
  name: string;
  sector: string;
  city: string;
  website: string;
  membersCount: number;
}

const mockCompanies: CompanyRecord[] = [
  { id: "c-1", name: "Silveira Capital", sector: "Private Equity & M&A", city: "São Paulo, SP", website: "https://silveiracapital.com", membersCount: 3 },
  { id: "c-2", name: "Solar Invest Brasil", sector: "Energia Solar GD", city: "Belo Horizonte, MG", website: "https://solarinvest.com.br", membersCount: 5 },
  { id: "c-3", name: "EcoCarbon Partners", sector: "Créditos de Carbono", city: "Curitiba, PR", website: "https://ecocarbon.org", membersCount: 2 },
  { id: "c-4", name: "Prado Hoteis & Resorts", sector: "Hospitality & Real Estate", city: "Rio de Janeiro, RJ", website: "https://pradohoteis.com", membersCount: 4 },
];

export default function AdminEmpresasPage() {
  const [search, setSearch] = React.useState("");

  const filtered = mockCompanies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.sector.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="h-6 w-6 text-gold" /> Empresas Cadastradas
          </h1>
          <p className="text-silver text-sm">
            Diretório de empresas, parceiros institucionais e holdings vinculadas aos membros.
          </p>
        </div>
        <Button variant="gold">
          <Plus className="h-4 w-4 mr-1" /> Nova Empresa
        </Button>
      </div>

      <Card className="glass">
        <CardContent className="p-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Buscar por nome ou setor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-charcoal border border-border text-white rounded-xl pl-9 pr-4 py-2 text-xs focus:border-gold focus:outline-none"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((comp) => (
          <Card key={comp.id} className="glass hover:border-gold/30 transition-all">
            <CardHeader className="p-5 border-b border-border flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white text-base font-semibold">{comp.name}</CardTitle>
                <span className="text-xs text-gold font-medium">{comp.sector}</span>
              </div>
              <Badge variant="outline" size="sm">
                {comp.membersCount} membros
              </Badge>
            </CardHeader>
            <CardContent className="p-5 space-y-2 text-xs text-silver">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-text-secondary" />
                <span>{comp.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-text-secondary" />
                <a href={comp.website} target="_blank" rel="noreferrer" className="text-gold hover:underline">
                  {comp.website}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
