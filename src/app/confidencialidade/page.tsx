import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";

export default function ConfidencialidadePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 py-16 px-4 pt-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-semibold text-white mb-8">
            Termo de Confidencialidade
          </h1>
          <div className="prose prose-invert max-w-none space-y-6 text-silver text-sm leading-relaxed">
            <p>
              <strong className="text-white">1. Objeto</strong>
              <br />
              O presente Termo de Confidencialidade estabelece as condições sob as quais os membros do Millennium Club deverão tratar as informações confidenciais compartilhadas durante as atividades do clube, incluindo reuniões, eventos, conexões e quaisquer interações facilitadas pela plataforma.
            </p>
            <p>
              <strong className="text-white">2. Definição de Informação Confidencial</strong>
              <br />
              Considera-se informação confidencial todo dado, dado, documento, dado estratégico, dado financeiro, dado comercial, dado operacional ou qualquer outro tipo de informação divulgada por um membro a outro membro, seja por meio da plataforma, em eventos presenciais, reuniões virtuais ou qualquer outro canal de comunicação do clube.
            </p>
            <p>
              <strong className="text-white">3. Obrigações</strong>
              <br />
              Os membros comprometem-se a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Manter em absoluto sigilo todas as informações confidenciais recebidas;</li>
              <li>Não divulgar, reproduzir ou utilizar informações confidenciais para finalidades diversas daquelas para as quais foram fornecidas;</li>
              <li>Não copiar ou reproduzir informações confidenciais sem autorização expressa do titular;</li>
              <li>Utilizar as informações exclusivamente para os fins de negociação ou parceria pretendida;</li>
              <li>Adotar medidas de segurança adequadas para proteger as informações confidenciais.</li>
            </ul>
            <p>
              <strong className="text-white">4. Exceções</strong>
              <br />
              Não serão consideradas informações confidenciais aquelas que:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Já sejam de conhecimento público sem violação deste termo;</li>
              <li>Já estivessem na posse do destinatário antes da divulgação;</li>
              <li>Sejam desenvolvidas independentemente pelo destinatário;</li>
              <li>Sejam obtidas de terceiros sem restrição de uso;</li>
              <li>Sejam exigidas por lei ou ordem judicial.</li>
            </ul>
            <p>
              <strong className="text-white">5. Prazo</strong>
              <br />
              As obrigações de confidencialidade perdurarão pelo prazo de 2 (dois) anos após o término da relação do membro com o Millennium Club, independentemente do motivo.
            </p>
            <p>
              <strong className="text-white">6. Sanções</strong>
              <br />
              O descumprimento das obrigações previstas neste termo poderá resultar na suspensão ou exclusão do membro do Millennium Club, sem prejuízo de eventuais medidas judiciais cabíveis.
            </p>
            <p>
              <strong className="text-white">7. Disposições Gerais</strong>
              <br />
              Este termo é regido pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer questões oriundas deste instrumento.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
