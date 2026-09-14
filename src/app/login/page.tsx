"use client";

import * as React from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { getSiteUrlFor } from "@/lib/site-url";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
    } else {
      setSuccess("Login realizado com sucesso! Redirecionando...");
      setTimeout(() => router.push("/app"), 1000);
    }
    setIsLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError("Informe seu e-mail para receber o Magic Link");
      return;
    }
    setIsLoading(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: getSiteUrlFor("/app") },
    });
    if (otpError) {
      setError(otpError.message);
    } else {
      setSuccess("Magic Link enviado! Verifique sua caixa de entrada.");
    }
    setIsLoading(false);
  };

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 flex items-center justify-center py-12 px-4 pt-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="font-display text-2xl font-semibold text-white">
              Millennium Club
            </Link>
            <h1 className="mt-6 font-display text-3xl font-semibold text-white">Entrar na sua conta</h1>
            <p className="mt-2 text-silver">Acesse sua área de membro</p>
          </div>

          <Card className="glass">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
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
                  icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                />

                <div className="relative">
                  <Input
                    label="Senha"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[38px] text-text-secondary hover:text-white transition-colors"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded border-border bg-charcoal text-gold focus:ring-gold" />
                    <span className="text-sm text-silver">Lembrar-me</span>
                  </label>
                  <Link href="/recuperar-senha" className="text-sm text-gold hover:underline">
                    Esqueci a senha
                  </Link>
                </div>

                <Button variant="gold" size="lg" className="w-full" loading={isLoading} type="submit">
                  Entrar
                  <Loader2 className="h-4 w-4" />
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-text-secondary">Ou continue com</span>
                </div>
              </div>

              <SocialButtons isLoading={isLoading} />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-text-secondary">Ou continue com e-mail</span>
                </div>
              </div>

              <Button variant="outline" size="lg" className="w-full" onClick={handleMagicLink} disabled={isLoading || !email}>
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Receber Magic Link por e-mail
              </Button>

              <p className="text-center text-sm text-text-secondary">
                Não tem conta?{" "}
                <Link href="/cadastro" className="text-gold hover:underline font-medium">
                  Cadastre-se
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