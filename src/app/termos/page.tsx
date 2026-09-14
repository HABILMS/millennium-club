import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de uso do Millennium Club - Clube privado de negócios",
};

const lastUpdated = "Setembro de 2026";
const version = "1.0.0 (Versão provisória - Aguardando revisão jurídica)";

export default function TermosPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 pt-16">
        <section className="py-12 bg-charcoal/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white">
              Termos de <span className="text-gold">Uso</span>
            </h1>
            <p className="mt-4 text-lg text-silver">
              Última atualização: {lastUpdated} | Versão: {version}
            </p>
            <div className="mt-6 glass rounded-xl p-4 border border-alert/30 bg-alert/5">
              <p className="text-sm text-alert font-medium">
                ⚠️ Este documento é uma versão provisória e deve passar por revisão jurídica completa antes do lançamento oficial.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-12">
            {[
              {
                title: "1. Objeto",
                content: "Estes Termos de Uso regulam o acesso e uso da plataforma Millennium Club, um ecossistema privado de negócios que conecta empresários, investidores, consultores, representantes e outros profissionais qualificados para criar parcerias, acessar oportunidades e desenvolver negócios."
              },
              {
                title: "2. Definições",
                content: `"Plataforma": o site, aplicação web e serviços associados ao Millennium Club.\n"Membro": pessoa física ou jurídica aprovada no processo seletivo e com acesso ativo.\n"Candidato": pessoa que submeteu candidatura e aguarda análise.\n"Conteúdo": qualquer informação, dado, texto, imagem, documento ou material disponibilizado na plataforma.\n"Oportunidade": projeto de negócio, captação, investimento ou parceria apresentado na plataforma.`
              },
              {
                title: "3. Candidatura e Aprovação",
                content: "A participação no Millennium Club requer aprovação após processo de screening. O preenchimento da candidatura não garante entrada. A curadoria reserva-se o direito de aprovar, reprovar ou solicitar informações adicionais. Critérios de avaliação incluem aderência ao perfil da rede, qualidade profissional, referências e alinhamento de valores."
              },
              {
                title: "4. Planos e Pagamentos",
                content: "A plataforma oferece planos gratuitos e pagos. Planos pagos são cobrados conforme periodicidade escolhida (mensal, trimestral, anual). Upgrades entram em vigor imediatamente; downgrades vigoram no próximo ciclo. Cancelamento pode ser feito a qualquer momento, com acesso mantido até o fim do período pago. Reembolsos seguem política específica."
              },
              {
                title: "5. Confidencialidade e NDA",
                content: "Informações sensíveis (financeiras, estratégicas, operacionais) compartilhadas na plataforma são confidenciais. Acesso a Data Room e detalhes de oportunidades exige assinatura de NDA digital. Violação de confidencialidade resulta em suspensão imediata e medidas legais cabíveis."
              },
              {
                title: "6. Propriedade Intelectual",
                content: "A plataforma, sua marca, design, código e conteúdo institucional são propriedade do Millennium Club. Membros concedem licença para exibição de seus perfis e conteúdos autorizados. Uso não autorizado da marca ou conteúdo é proibido."
              },
              {
                title: "7. Responsabilidades do Membro",
                content: "Manter dados cadastrais atualizados. Não compartilhar credenciais. Usar a plataforma de forma ética, legal e respeitosa. Não praticar spam, fraude, captação irregular ou atividades proibidas por lei. Reportar violações imediatamente."
              },
              {
                title: "8. Limitação de Responsabilidade",
                content: "O Millennium Club facilita conexões mas não garante resultados financeiros, aprovação de investimentos, sucesso de negócios ou veracidade de todas as informações de terceiros. Matchmaking indica compatibilidade de critérios, não recomendação financeira. A plataforma não é consultora de investimentos."
              },
              {
                title: "9. Suspensão e Encerramento",
                content: "A plataforma pode suspender ou encerrar acesso por violação destes termos, inatividade prolongada, inadimplência, decisão de compliance ou solicitação do membro. Dados são retidos conforme política de privacidade e LGPD."
              },
              {
                title: "10. LGPD e Proteção de Dados",
                content: "Tratamento de dados pessoais segue a Lei 13.709/2018 (LGPD). Consentimentos são versionados e revogáveis. Membros têm direito a acesso, correção, exclusão, portabilidade e oposição. DPO: privacidade@millenniumclub.com.br"
              },
              {
                title: "11. Disposições Gerais",
                content: "Estes termos podem ser atualizados com aviso prévio de 30 dias. Continuidade do uso implica aceitação. Foro: Comarca de São Paulo/SP. Lei aplicável: brasileira. Dúvidas: juridico@millenniumclub.com.br"
              },
            ].map((section, index) => (
              <article key={index} className="glass rounded-2xl p-6 sm:p-8 border border-border">
                <h2 className="font-display text-xl font-semibold text-white mb-4">{section.title}</h2>
                <div className="text-text-secondary whitespace-pre-line leading-relaxed">{section.content}</div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}