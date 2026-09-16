"use client";

import * as React from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import Link from "next/link";
import { Loader2, Shield, Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getSiteUrlFor } from "@/lib/site-url";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
    marketing: false,
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const router = useRouter();

  const handleChange = (name: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    if (formData.password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      return;
    }
    if (!formData.terms) {
      setError("Você deve aceitar os Termos de Uso e Política de Privacidade");
      return;
    }

    setIsLoading(true);
    const emailParts = formData.fullName.split(" ");
    const firstName = emailParts[0] || "";
    const lastName = emailParts.slice(1).join(" ") || "";
    const { error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: getSiteUrlFor("/auth/callback?next=/app"),
      },
    });
    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }
    setSuccess("Conta criada com sucesso! Verifique seu e-mail para confirmar a conta.");
      // Auto-redirect to confirmar-email page after 3 seconds
      setTimeout(() => router.push("/confirmar-email"), 3000);
    setIsLoading(false);
    setFormData({ fullName: "", email: "", password: "", confirmPassword: "", terms: false, marketing: false });
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
            <h1 className="mt-6 font-display text-3xl font-semibold text-white">Criar conta</h1>
            <p className="mt-2 text-silver">Participe do processo seletivo do clube</p>
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
                  label="Nome completo"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="João da Silva"
                  required
                  autoComplete="name"
                  icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                />

                <Input
                  label="E-mail profissional"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  icon={<Mail className="h-5 w-5" />}
                />

                <div className="relative">
                  <Input
                    label="Senha"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    autoComplete="new-password"
                    icon={<Lock className="h-5 w-5" />}
                    helperText="Use letras, números e símbolos"
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
                  label="Confirmar senha"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="Repita a senha"
                  required
                  autoComplete="new-password"
                  icon={<Lock className="h-5 w-5" />}
                />

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.terms}
                      onChange={(e) => handleChange("terms", e.target.checked)}
                      required
                      className="mt-1 h-4 w-4 rounded border-border bg-charcoal text-gold focus:ring-gold focus:ring-2"
                    />
                    <div className="text-sm text-silver">
                      Aceito os <Link href="/termos" className="text-gold hover:underline">Termos de Uso</Link> e a <Link href="/privacidade" className="text-gold hover:underline">Política de Privacidade</Link>
                      <span className="text-alert">*</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.marketing}
                      onChange={(e) => handleChange("marketing", e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-border bg-charcoal text-gold focus:ring-gold focus:ring-2"
                    />
                    <span className="text-sm text-silver">Autorizo receber comunicações sobre novidades, eventos e oportunidades</span>
                  </label>
                </div>

                <Button variant="gold" size="lg" className="w-full" loading={isLoading} type="submit">
                  Criar conta
                  <Loader2 className="h-4 w-4" />
                </Button>
              </form>

              <p className="text-center text-sm text-text-secondary">
                Já tem conta?{" "}
                <Link href="/login" className="text-gold hover:underline font-medium">
                  Entrar
                </Link>
              </p>

              <div className="flex items-center justify-center gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-gold" />
                  <span>Seguro e criptografado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-gold" />
                  <span>Confirmação por e-mail</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}