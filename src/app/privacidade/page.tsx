import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de privacidade do Millennium Club - Como tratamos seus dados pessoais conforme LGPD",
};

const lastUpdated = "Setembro de 2026";
const version = "1.0.0 (Versão provisória - Aguardando revisão jurídica)";

export default function PrivacidadePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 pt-16">
        <section className="py-12 bg-charcoal/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white">
              Política de <span className="text-gold">Privacidade</span>
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
                title: "1. Controlador de Dados",
                content: "Millennium Club Tecnologia Ltda., CNPJ XX.XXX.XXX/0001-XX, com sede em São Paulo/SP. Encarregado (DPO): privacidade@millenniumclub.com.br"
              },
              {
                title: "2. Dados Coletados",
                content: `Dados de identificação: nome, CPF, RG, foto, nacionalidade, estado civil.
Dados de contato: e-mail, telefone, WhatsApp, endereço, LinkedIn, site.
Dados profissionais: cargo, empresa, histórico, competências, bio, referências.
Dados de negócio: setores, tickets, regiões, objetivos, preferências de investimento.
Dados técnicos: IP, user agent, cookies, logs de acesso, dispositivo.
Dados financeiros (apenas membros pagos): dados de cobrança, faturas, comprovantes.
Dados sensíveis: não coletamos dados sensíveis (origem racial, opinião política, convicção religiosa, saúde, vida sexual, genético, biométrico) exceto quando estritamente necessário e com consentimento específico.`
              },
              {
                title: "3. Finalidades e Base Legal",
                content: `Cadastro e screening: execução de contrato/medidas pré-contratuais (Art. 7º, V LGPD).
Autenticação e segurança: legítimo interesse (Art. 7º, IX) e obrigação legal.
Comunicações: consentimento (Art. 7º, I) para marketing; legítimo interesse para transacionais.
Matchmaking e oportunidades: execução de contrato/legítimo interesse.
Cobrança e pagamentos: execução de contrato/obrigação legal.
Analytics e melhoria: legítimo interesse (anonimizados quando possível).
Cumprimento legal: obrigação legal (Art. 7º, II).`
              },
              {
                title: "4. Compartilhamento de Dados",
                content: `Com outros membros: apenas dados autorizados nas configurações de privacidade do perfil.
Com administradores e curadores: dados necessários para screening, moderação e suporte.
Com provedores de serviço: hospedagem (Supabase), e-mail transacional, pagamentos (Stripe/Asaas), analytics — sob contratos de processamento (DPA).
Com autoridades: quando exigido por lei ou ordem judicial.
Não vendemos dados a terceiros.`
              },
              {
                title: "5. Transferência Internacional",
                content: "Servidores Supabase podem estar nos EUA. Cláusulas contratuais padrão (SCCs) e medidas suplementares garantem nível de proteção adequado perante LGPD."
              },
              {
                title: "6. Retenção e Exclusão",
                content: `Dados de candidatura: 2 anos após decisão final (aprovado/reprovado), salvo consentimento para banco de talentos.
Dados de membro ativo: durante a vigência + 5 anos após encerramento (obrigações legais/fiscais).
Logs de acesso e segurança: 12 meses.
Dados de marketing: até revogação do consentimento.
Backups: retenção técnica de 30 dias após exclusão lógica.`
              },
              {
                title: "7. Direitos do Titular (Art. 18 LGPD)",
                content: `Confirmação e acesso aos dados.
Correção de dados incompletos, inexatos ou desatualizados.
Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou em desconformidade.
Portabilidade dos dados a outro fornecedor.
Eliminação dos dados tratados com consentimento (exceto hipóteses do Art. 16 LGPD).
Informação sobre compartilhamento.
Informação sobre possibilidade de não consentir e consequências.
Revogação do consentimento.
Oposição a tratamento em desconformidade.
Solicitações: privacidade@millenniumclub.com.br ou área do membro > Configurações > LGPD. Prazo: 15 dias.`
              },
              {
                title: "8. Segurança da Informação",
                content: `Criptografia em trânsito (TLS 1.3) e em repouso (AES-256).
Autenticação multifator (MFA) obrigatória para admins e financeiro.
Row Level Security (RLS) no banco de dados.
URLs assinadas e temporárias para arquivos privados.
Auditoria de acessos sensíveis.
Testes de penetração anuais.
Plano de resposta a incidentes.`
              },
              {
                title: "9. Cookies e Tecnologias Similares",
                content: `Essenciais: sessão, segurança, preferências (não requerem consentimento).
Analytics: uso da plataforma (consentimento via banner).
Marketing: rastreamento para campanhas (consentimento via banner).
Gerencie preferências no rodapé ou nas configurações da conta.`
              },
              {
                title: "10. Menores de Idade",
                content: "A plataforma não se destina a menores de 18 anos. Não coletamos dados de menores intencionalmente. Se identificado, excluiremos imediatamente."
              },
              {
                title: "11. Alterações desta Política",
                content: "Atualizações serão notificadas por e-mail e na plataforma com 30 dias de antecedência para mudanças materiais. Versão anterior arquivada e acessível mediante solicitação."
              },
              {
                title: "12. Contato",
                content: `DPO: privacidade@millenniumclub.com.br
Canal LGPD na plataforma: área do membro > Configurações > Privacidade
Autoridade Nacional: ANPD (https://www.gov.br/anpd)`
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