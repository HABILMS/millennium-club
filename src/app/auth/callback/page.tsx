"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");
      const next = searchParams.get("next") || "/app";

      // PKCE flow: exchange code for session
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error("Exchange error:", exchangeError);
          setError("Falha ao confirmar a sessão. Tente fazer login novamente.");
          return;
        }
        router.push(next);
        return;
      }

      // Token hash flow (verifyOtp)
      if (tokenHash && type) {
        const email = searchParams.get("email") || "";
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token: tokenHash,
          type: type as "signup" | "recovery" | "magiclink",
          email,
        });
        if (verifyError) {
          console.error("Verify error:", verifyError);
          setError("Link inválido ou expirado. Solicite um novo.");
          return;
        }
        // For recovery, redirect to password reset page
        if (type === "recovery") {
          router.push("/recuperar-senha?type=recovery");
          return;
        }
        router.push(next);
        return;
      }

      // Fallback: check existing session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setError("Erro ao verificar sessão.");
        return;
      }
      if (session?.user) {
        router.push(next);
      } else {
        router.push("/login");
      }
    };

    processCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-alert text-sm text-center max-w-md">{error}</div>
        <button
          onClick={() => router.push("/login")}
          className="text-gold hover:underline text-sm"
        >
          Ir para o login
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-gold" />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
