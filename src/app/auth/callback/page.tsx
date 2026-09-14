"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  React.useEffect(() => {
    const processCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        router.push("/login?error=auth");
        return;
      }
      if (session?.user) {
        if (window.opener) {
          window.close();
        } else {
          router.push("/app");
        }
      } else {
        if (window.opener) {
          window.close();
        } else {
          router.push("/login");
        }
      }
    };
    processCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-gold" />
    </div>
  );
}
