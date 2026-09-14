"use client";

import * as React from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import Link from "next/link";
import { Loader2, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getSiteUrlFor } from "@/lib/site-url";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function RecuperarSenhaPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>}>
      <RecuperarSenhaPageContent />
    </Suspense>
  );
}

function RecuperarSenhaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [step, setStep] = React.useState<"request" | "sent" | "reset">("request");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Informe seu e-mail");
      return;
    }
    setIsLoading(true);
    setError("");
    const { error: otpError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getSiteUrlFor("/recuperar-senha?type=recovery"),
    });
    if (otpError) {
      setError(otpError.message);
      setIsLoading(false);
      return;
    }
    setStep("sent");
    setSuccess("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    setIsLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    if (newPassword.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      return;
    }
    setIsLoading(true);
    setError("");
    const token = searchParams.get("token");
    if (!token) {
      setError("Token de recuperação não encontrado.");
      setIsLoading(false);
      return;
    }
    const { error: otpError } = await supabase.auth.verifyOtp({
      token,
      type: "recovery",
      newPassword,
    } as any);
    if (otpError) {
      setError(otpError.message);
      setIsLoading(false);
      return;
    }
    setStep("request");
    setSuccess("Senha alterada com sucesso! Redirecionando para login...");
    setTimeout(() => router.push("/login"), 1500);
    setIsLoading(false);
  };

  if (step === "sent") {
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
              <h1 className="font-display text-2xl font-semibold text-white mb-2">E-mail enviado!</h1>
              <p className="text-silver mb-6">{success}</p>
              <Button variant="gold" asChild onClick={() => { setStep("request"); setSuccess(""); }}>
                <Link href="/login">Voltar ao login</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (step === "reset") {
    return (
      <>
        <Header />
        <main id="main-content" className="flex-1 flex items-center justify-center py-12 px-4 pt-16">
          <div className="w-full max-w-md">
            <Link href="/" className="font-display text-2xl font-semibold text-white">
              Millennium Club
            </Link>
            <h1 className="mt-6 font-display text-3xl font-semibold text-white text-center">Nova senha</h1>
            <p className="mt-2 text-silver text-center">Digite sua nova senha abaixo</p>

            <Card className="glass mt-8">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <form onSubmit={handleReset} className="space-y-5">
                  {error && (
                    <div className="bg-alert/10 border border-alert/30 text-alert rounded-xl p-4 text-sm" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="relative">
                    <Input
                      label="Nova senha"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      required
                      autoComplete="new-password"
                      icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-[38px] text-text-secondary hover:text-white transition-colors"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>

                  <Input
                    label="Confirmar nova senha"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    required
                    autoComplete="new-password"
                    icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                  />

                  <Button variant="gold" size="lg" className="w-full" loading={isLoading} type="submit">
                    Salvar nova senha
                    <Loader2 className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
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
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="font-display text-2xl font-semibold text-white">
              Millennium Club
            </Link>
            <h1 className="mt-6 font-display text-3xl font-semibold text-white">Recuperar senha</h1>
            <p className="mt-2 text-silver">Informe seu e-mail para receber instruções de redefinição</p>
          </div>

          <Card className="glass">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <form onSubmit={handleRequest} className="space-y-5">
                {error && (
                  <div className="bg-alert/10 border border-alert/30 text-alert rounded-xl p-4 text-sm" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-emerald/10 border border-emerald/30 text-emerald rounded-xl p-4 text-sm" role="status">
                    {success}
                  </div>
                )}

                <Input
                  label="E-mail profissional"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  icon={<Mail className="h-5 w-5" />}
                />

                <Button variant="gold" size="lg" className="w-full" loading={isLoading} type="submit">
                  Enviar link de recuperação
                  <Loader2 className="h-4 w-4" />
                </Button>
              </form>

              <p className="text-center text-sm text-text-secondary">
                Lembrou a senha?{" "}
                <Link href="/login" className="text-gold hover:underline font-medium">
                  Voltar ao login
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
