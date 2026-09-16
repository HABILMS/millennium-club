"use client";

import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";

export default function ContatoPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 py-16 px-4 pt-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-semibold text-white mb-4">
            Fale Conosco
          </h1>
          <p className="text-silver text-lg mb-10">
            Estamos à disposição para atender você.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="glass rounded-2xl p-8 space-y-6">
              <h2 className="font-display text-xl font-semibold text-white">Canais de Atendimento</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">E-mail</p>
                    <p className="text-silver text-sm">contato@millenniumclub.com.br</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Telefone</p>
                    <p className="text-silver text-sm">+55 (11) 99999-0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Endereço</p>
                    <p className="text-silver text-sm">São Paulo, SP — Brasil</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Horário de Atendimento</p>
                    <p className="text-silver text-sm">Seg — Sex: 9h às 18h</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-8 space-y-6">
              <h2 className="font-display text-xl font-semibold text-white">Envie sua mensagem</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-silver mb-1.5">Nome</label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full rounded-xl border border-border bg-charcoal/50 px-4 py-2.5 text-white text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silver mb-1.5">E-mail</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full rounded-xl border border-border bg-charcoal/50 px-4 py-2.5 text-white text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silver mb-1.5">Assunto</label>
                  <input
                    type="text"
                    placeholder="Como podemos ajudar?"
                    className="w-full rounded-xl border border-border bg-charcoal/50 px-4 py-2.5 text-white text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silver mb-1.5">Mensagem</label>
                  <textarea
                    rows={4}
                    placeholder="Descreva sua solicitação..."
                    className="w-full rounded-xl border border-border bg-charcoal/50 px-4 py-2.5 text-white text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-gold text-charcoal font-medium py-2.5 text-sm hover:bg-gold/90 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  Enviar mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
