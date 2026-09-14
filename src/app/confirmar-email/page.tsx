"use client";

import * as React from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Loader2, Mail, CheckCircle, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase";

function ConfirmarEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [status, setStatus] = React.useState<"verifying" | "success" | "error" | "expired">("verifying");
  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token de verificação não encontrado no link.");
        return;
      }

      setIsLoading(true);
      const { error: otpError } = await supabase.auth.verifyOtp({ token, type: "email", email: email ?? "" });
      if (otpError) {
        const message = otpError.message.toLowerCase();
        if (message.includes("expired") || message.includes("expired")) {
          setStatus("expired");
          setMessage("Este link de verificação expirou. Solicite um novo e-mail de confirmação.");
        } else {
          setStatus("error");
          setMessage(otpError.message);
        }
      } else {
        setStatus("success");
        setMessage("E-mail confirmado com sucesso! Sua conta está ativa.");
      }
      setIsLoading(false);
    };

    verifyEmail();
  }, [token]);

  const handleResend = async () => {
    if (!email) return;
    setIsLoading(true);
    const { error: otpError } = await supabase.auth.resend({ type: "signup", email });
    if (otpError) {
      setMessage("Falha ao reenviar: " + otpError.message);
    } else {
      setMessage("Novo e-mail de confirmação enviado! Verifique sua caixa de entrada.");
    }
    setIsLoading(false);
  };

  if (status === "verifying") {
    return (
      <>
        <Header />
        <main id="main-content" className="flex-1 flex items-center justify-center py-12 px-4 pt-16">
          <div className="w-full max-w-md text-center">
            <Link href="/" className="font-display text-2xl font-semibold text-white">
              Millennium Club
            </Link>
            <div className="mt-8 glass rounded-2xl p-8">
              <div className="h-16 w-16 rounded-full bg-gold/10 flex items-center justify-center text-gold mx-auto mb-4 animate-pulse">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
              <h1 className="font-display text-2xl font-semibold text-white mb-2">Verificando seu e-mail...</h1>
              <p className="text-silver">Por favor, aguarde enquanto validamos seu link de confirmação.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (status === "success") {
    return (
      <>
        <Header />
        <main id="main-content" className="flex-1 flex items-center justify-center py-12 px-4 pt-16">
          <div className="w-full max-w-md text-center">
            <Link href="/" className="font-display text-2xl font-semibold text-white">
              Millennium Club
            </Link>
            <div className="mt-8 glass rounded-2xl p-8 border border-emerald/30">
              <div className="h-16 w-16 rounded-full bg-emerald/10 flex items-center justify-center text-emerald mx-auto mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h1 className="font-display text-2xl font-semibold text-white mb-2">E-mail confirmado!</h1>
              <p className="text-silver mb-6">{message}</p>
              <Button variant="gold" size="lg" onClick={() => window.location.href = "/login"}>
                Entrar na plataforma
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (status === "expired") {
    return (
      <>
        <Header />
        <main id="main-content" className="flex-1 flex items-center justify-center py-12 px-4 pt-16">
          <div className="w-full max-w-md text-center">
            <Link href="/" className="font-display text-2xl font-semibold text-white">
              Millennium Club
            </Link>
            <div className="mt-8 glass rounded-2xl p-8 border border-alert/30">
              <div className="h-16 w-16 rounded-full bg-alert/10 flex items-center justify-center text-alert mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h1 className="font-display text-2xl font-semibold text-white mb-2">Link expirado</h1>
              <p className="text-silver mb-6">{message}</p>
              <Button variant="outline" size="lg" onClick={handleResend} loading={isLoading} disabled={isLoading}>
                Reenviar e-mail de confirmação
                <Loader2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 flex items-center justify-center py-12 px-4 pt-16">
        <div className="w-full max-w-md text-center">
          <Link href="/" className="font-display text-2xl font-semibold text-white">
            Millennium Club
          </Link>
          <div className="mt-8 glass rounded-2xl p-8 border border-alert/30">
            <div className="h-16 w-16 rounded-full bg-alert/10 flex items-center justify-center text-alert mx-auto mb-4">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-white mb-2">Não foi possível confirmar</h1>
            <p className="text-silver mb-6">{message}</p>
            <div className="flex flex-col gap-3">
              <Button variant="gold" size="lg" onClick={() => window.location.href = "/login"}>
                Tentar fazer login
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = "/cadastro"}>
                Criar nova conta
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ConfirmarEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    }>
      <ConfirmarEmailContent />
    </Suspense>
  );
}