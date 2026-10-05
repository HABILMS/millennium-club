"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Quem pode participar do Millennium Club?",
    answer: "Empresários, investidores, consultores estratégicos, especialistas técnicos, representantes comerciais, originadores de negócios, parceiros institucionais e prestadores de serviços qualificados. A entrada passa por processo seletivo (screening) para garantir a qualidade da rede.",
  },
  {
    question: "O cadastro garante entrada no clube?",
    answer: "Não. O preenchimento da candidatura inicia o processo de avaliação. Nossa equipe analisa perfil profissional, aderência aos critérios da rede, referências e pode solicitar documentos complementares ou agendar entrevista. A decisão final é da curadoria do Millennium Club.",
  },
  {
    question: "Haverá participação gratuita?",
    answer: "Sim. O plano Gratuito oferece acesso inicial à rede: perfil básico, conteúdos autorizados, eventos selecionados e comunicados. Os planos pagos (Profissional, Executivo, Fundador) adicionam visibilidade, página comercial, leads, domínio próprio, e-mail profissional, prioridade em oportunidades e relatórios avançados.",
  },
  {
    question: "Como as oportunidades serão apresentadas?",
    answer: "Oportunidades passam por curadoria da equipe Millennium (triagem, due diligence, aprovação para rodada). Membros aprovados visualizam oportunidades compatíveis com seu perfil e nível de acesso. Detalhes financeiros e Data Room exigem NDA assinado. Matchmaking mostra compatibilidade por critérios objetivos, não recomendação financeira.",
  },
  {
    question: "Como funciona a confidencialidade?",
    answer: "Informações sensíveis (financeiras, estratégicas) ficam em Data Room com acesso controlado. Antes de visualizar, o membro assina NDA digital (registro de usuário, versão, data, IP). Documentos confidenciais não têm URL pública permanente — usam links temporários assinados. Perfis têm configurações de privacidade granulares.",
  },
  {
    question: "Quais benefícios estarão nos planos pagos?",
    answer: "Profissional: perfil verificado, página comercial, leads, selo, comitês autorizados, métricas básicas. Executivo: tudo do Profissional + domínio próprio, hospedagem, e-mails profissionais, prioridade no matchmaking, relatórios avançados, destaque no diretório, mais usuários por empresa. Fundador: selo exclusivo, condições especiais, prioridade em rodadas/comitês, benefícios definidos pela administração.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
            Perguntas <span className="text-gold">frequentes</span>
          </h2>
          <p className="mt-4 text-lg text-silver">
            Dúvidas comuns sobre o processo de entrada, funcionamento da rede e benefícios dos planos.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="glass rounded-xl border border-border overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer transition-colors hover:bg-charcoal/40"
                  aria-expanded={isOpen}
                >
                  <h3 className="font-display text-lg font-semibold text-white pr-6">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-gold flex-shrink-0 transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-text-secondary text-sm leading-relaxed border-t border-border/40 pt-4 animate-fade-in">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}