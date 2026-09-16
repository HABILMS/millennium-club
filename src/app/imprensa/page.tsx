import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ImprensaPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 py-16 px-4 pt-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-semibold text-white mb-4">
            Imprensa
          </h1>
          <p className="text-silver text-lg mb-10">
            Informações para jornalistas, repórteres e veículos de comunicação.
          </p>

          <div className="space-y-10">
            <section>
              <h2 className="font-display text-xl font-semibold text-white mb-4">Sobre o Millennium Club</h2>
              <div className="text-silver text-sm leading-relaxed space-y-4">
                <p>
                  O Millennium Club é um clube privado de negócios que conecta empresários, investidores, consultores e representantes para criar parcerias estratégicas e desenvolver negócios no Brasil e no exterior.
                </p>
                <p>
                  Com uma rede qualificada de profissionais de alto nível, o clube facilita conexões que geram valor real — desde fusões e aquisições até parcerias comerciais e investimentos.
                </p>
                <p className="text-gold font-medium">
                  Meta estratégica: facilitar R$ 2 bilhões em transações por meio de conexões qualificadas em três anos.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-white mb-4">Fala Imprensa</h2>
              <div className="text-silver text-sm leading-relaxed">
                <p>
                  Para solicitar entrevistas, informações adicionais ou material institucional, entre em contato com nossa assessoria de comunicação:
                </p>
              </div>
              <div className="mt-6 glass rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 text-silver text-sm">
                  <Mail className="h-5 w-5 text-gold" />
                  <span>imprensa@millenniumclub.com.br</span>
                </div>
                <div className="flex items-center gap-3 text-silver text-sm">
                  <Phone className="h-5 w-5 text-gold" />
                  <span>+55 (11) 99999-0000</span>
                </div>
                <div className="flex items-center gap-3 text-silver text-sm">
                  <MapPin className="h-5 w-5 text-gold" />
                  <span>São Paulo, SP — Brasil</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-white mb-4">Materiais Disponíveis</h2>
              <ul className="text-silver text-sm space-y-2 list-disc pl-6">
                <li>Comunicados oficiais</li>
                <li>Material institucional em PDF</li>
                <li>Logotipos e identidade visual</li>
                <li>Fotos de alta resolução</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
