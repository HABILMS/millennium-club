import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Target, Users, Shield, TrendingUp } from "lucide-react";

export default function SobrePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 py-16 px-4 pt-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl font-semibold text-white mb-4">
              Sobre o Millennium Club
            </h1>
            <p className="text-silver text-lg max-w-2xl mx-auto">
              Uma rede privada de negócios conectando empresários, investidores e profissionais de alto nível para criar parcerias estratégicas.
            </p>
          </div>

          <div className="space-y-12">
            <section className="glass rounded-2xl p-8">
              <h2 className="font-display text-2xl font-semibold text-white mb-4">Nossa Missão</h2>
              <p className="text-silver leading-relaxed">
                O Millennium Club nasceu da necessidade de criar um ambiente seguro e qualificado onde profissionais de alto nível possam se conectar, trocar experiências e construir parcerias de verdade. Não somos um networking genérico — somos um clube seletivo onde cada membro é cuidadosamente avaliado para garantir a qualidade das conexões.
              </p>
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="glass rounded-2xl p-8">
                <Target className="h-8 w-8 text-gold mb-4" />
                <h3 className="font-display text-xl font-semibold text-white mb-3">Visão</h3>
                <p className="text-silver text-sm leading-relaxed">
                  Ser a maior e mais influente rede de negócios do Brasil, facilitando R$ 2 bilhões em transações por meio de conexões qualificadas em três anos.
                </p>
              </div>
              <div className="glass rounded-2xl p-8">
                <Users className="h-8 w-8 text-gold mb-4" />
                <h3 className="font-display text-xl font-semibold text-white mb-3">Comunidade</h3>
                <p className="text-silver text-sm leading-relaxed">
                  Empresários, investidores, consultores e representantes que buscam parcerias estratégicas e oportunidades reais de negócio.
                </p>
              </div>
              <div className="glass rounded-2xl p-8">
                <Shield className="h-8 w-8 text-gold mb-4" />
                <h3 className="font-display text-xl font-semibold text-white mb-3">Segurança</h3>
                <p className="text-silver text-sm leading-relaxed">
                  Cada membro passa por um processo seletivo rigoroso. Informações compartilhadas no clube são protegidas por termos de confidencialidade.
                </p>
              </div>
              <div className="glass rounded-2xl p-8">
                <TrendingUp className="h-8 w-8 text-gold mb-4" />
                <h3 className="font-display text-xl font-semibold text-white mb-3">Resultados</h3>
                <p className="text-silver text-sm leading-relaxed">
                  Focamos em conexões que geram valor real — desde fusões e aquisições até parcerias comerciais e investimentos estratégicos.
                </p>
              </div>
            </div>

            <section className="glass rounded-2xl p-8">
              <h2 className="font-display text-2xl font-semibold text-white mb-4">Como Começou</h2>
              <div className="text-silver text-sm leading-relaxed space-y-4">
                <p>
                  O Millennium Club foi fundado por um grupo de empresários que perceberam que as melhores oportunidades de negócio surgem de conexões pessoais qualificadas — não de eventos de networking genéricos ou plataformas de contato frio.
                </p>
                <p>
                  Acreditamos que a qualidade das conexões supera a quantidade. Por isso, cada membro é selecionado criteriosamente, garantindo que todos os participantes tenham algo valioso a contribuir para a comunidade.
                </p>
                <p>
                  Hoje, o clube reúne profissionais de diversas áreas — tecnologia, finanças, indústria, comércio e serviços — todos comprometidos em criar parcerias que transformam negócios e geram resultados concretos.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
