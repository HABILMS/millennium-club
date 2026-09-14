"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/Separator";

const footerLinks = {
  institucional: [
    { name: "Sobre nós", href: "/sobre" },
    { name: "Como funciona", href: "/como-funciona" },
    { name: "Visão", href: "/visao" },
    { name: "Planos", href: "/planos" },
  ],
  membros: [
    { name: "Para membros", href: "/para-membros" },
    { name: "Benefícios", href: "/beneficios" },
    { name: "Perguntas frequentes", href: "/faq" },
    { name: "Candidatura", href: "/candidatura" },
  ],
  legal: [
    { name: "Termos de uso", href: "/termos" },
    { name: "Política de privacidade", href: "/privacidade" },
    { name: "Termo de confidencialidade", href: "/confidencialidade" },
  ],
  contato: [
    { name: "Fale conosco", href: "/contato" },
    { name: "Imprensa", href: "/imprensa" },
    { name: "Carreiras", href: "/carreiras" },
  ],
};

const socialLinks = [
  { name: "LinkedIn", href: "https://linkedin.com/company/millennium-club", icon: "in" },
  { name: "Instagram", href: "https://instagram.com/millenniumclub", icon: "ig" },
  { name: "Twitter", href: "https://twitter.com/millenniumclub", icon: "tw" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal border-t border-border" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="font-display text-2xl font-semibold text-white" aria-label="Millennium Club - Início">
              Millennium Club
            </Link>
            <p className="mt-4 text-sm text-text-secondary max-w-xs">
              Clube privado de negócios para conexões estratégicas. Conectamos empresários, investidores, consultores e representantes para criar parcerias e desenvolver negócios no Brasil e no exterior.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-gold transition-colors"
                  aria-label={social.name}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {social.icon === "in" && (
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    )}
                    {social.icon === "ig" && (
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    )}
                    {social.icon === "tw" && (
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.24-3.356.945-8.274-9.239-7.522 8.27 3.314.957 7.892-8.68-8.293-8.93 3.316-.953 7.43 8.252 8.454-9.241-3.353-.947-7.55 8.272z"/>
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">Institucional</h3>
            <ul className="mt-4 space-y-3" role="list">
              {footerLinks.institucional.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">Membros</h3>
            <ul className="mt-4 space-y-3" role="list">
              {footerLinks.membros.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-3" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider">Contato</h3>
            <ul className="mt-4 space-y-3" role="list">
              {footerLinks.contato.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} Millennium Club. Todos os direitos reservados.
          </p>
          <p className="text-sm text-text-secondary">
            Meta estratégica: facilitar R$ 2 bilhões em transações por meio de conexões qualificadas em três anos.
          </p>
        </div>
      </div>
    </footer>
  );
}