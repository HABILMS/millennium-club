import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Briefcase, Users, TrendingUp, Mail } from "lucide-react";

export default function CarreirasPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 py-16 px-4 pt-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-semibold text-white mb-4">
            Carreiras
          </h1>
          <p className="text-silver text-lg mb-10">
            Faça parte da equipe que está construindo a maior rede de negócios do Brasil.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="font-display text-xl font-semibold text-white mb-4">Por que trabalhar conosco?</h2>
              <div className="text-silver text-sm leading-relaxed space-y-4">
                <p>
                  O Millennium Club está em fase de crescimento acelerado. Buscamos profissionais talentosos, proativos e apaixonados por tecnologia, negócios e conexões humanas para integrar uma equipe que está revolucionando a forma como empresários se conectam.
                </p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="glass rounded-xl p-5 text-center">
                  <TrendingUp className="h-6 w-6 text-gold mx-auto mb-2" />
                  <p className="text-white font-medium text-sm">Crescimento</p>
                  <p className="text-silver text-xs mt-1">Aprendizado contínuo e evolução de carreira</p>
                </div>
                <div className="glass rounded-xl p-5 text-center">
                  <Users className="h-6 w-6 text-gold mx-auto mb-2" />
                  <p className="text-white font-medium text-sm">Time</p>
                  <p className="text-silver text-xs mt-1">Colaboração e cultura de alta performance</p>
                </div>
                <div className="glass rounded-xl p-5 text-center">
                  <Briefcase className="h-6 w-6 text-gold mx-auto mb-2" />
                  <p className="text-white font-medium text-sm">Impacto</p>
                  <p className="text-silver text-xs mt-1">Trabalhe em projetos que movimentam bilhões</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-white mb-4">Vagas em Aberto</h2>
              <p className="text-silver text-sm mb-6">
                No momento, não há vagas abertas. Envie seu currículo para ser considerado em futuras oportunidades.
              </p>
            </section>

            <section className="glass rounded-2xl p-8">
              <h2 className="font-display text-xl font-semibold text-white mb-4">Candidate-se</h2>
              <p className="text-silver text-sm mb-6">
                Interessado em fazer parte do Millennium Club? Envie seu currículo e uma carta de apresentação para:
              </p>
              <div className="flex items-center gap-3 text-gold text-sm font-medium">
                <Mail className="h-5 w-5" />
                <span>carreiras@millenniumclub.com.br</span>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
