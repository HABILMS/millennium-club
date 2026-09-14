"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/Separator";
import { Menu, X, ChevronDown } from "lucide-react";

const navigation = [
  { name: "Como funciona", href: "/como-funciona" },
  { name: "Para membros", href: "/para-membros" },
  { name: "Benefícios", href: "/beneficios" },
  { name: "Visão", href: "/visao" },
  { name: "Perguntas frequentes", href: "/faq" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-obsidian/95 backdrop-blur-md border-b border-border glass"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Navegação principal">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-display text-2xl font-semibold text-white hover:text-gold transition-colors" aria-label="Millennium Club - Início">
              Millennium Club
            </Link>
            <div className="hidden md:flex md:items-center md:gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-silver hover:text-white hover:text-gold transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            <Link href="/login" className="text-sm font-medium text-silver hover:text-white transition-colors">
              Entrar
            </Link>
            <Button variant="gold" size="md" onClick={() => window.location.href = "/candidatura"}>
              Quero participar
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-silver hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div
          id="mobile-menu"
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-border",
            mobileMenuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 py-0"
          )}
        >
          <div className="flex flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-2 py-3 text-base font-medium text-silver hover:text-white hover:bg-charcoal/50 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Separator className="my-4" />
            <Link
              href="/login"
              className="px-2 py-3 text-base font-medium text-silver hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Entrar
            </Link>
            <Button variant="gold" size="md" className="w-full" onClick={() => { setMobileMenuOpen(false); window.location.href = "/candidatura"; }}>
              Quero participar
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}