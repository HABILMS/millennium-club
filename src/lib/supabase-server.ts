import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { EMPTY_KPIS, normalizeKpis, type DashboardKpis } from "@/lib/dashboard";

/**
 * Cliente Supabase para Server Components / Route Handlers.
 * Usa os cookies da requisição, então as políticas de RLS enxergam o usuário
 * autenticado (necessário para as consultas administrativas).
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components não podem gravar cookies; o middleware renova a sessão.
          }
        },
      },
    }
  );
}

export interface DashboardData {
  kpis: DashboardKpis;
  error: string | null;
}

/** Busca os KPIs agregados pela função `dashboard_kpis()` no banco. */
export async function getDashboardData(): Promise<DashboardData> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("dashboard_kpis");

    if (error) {
      return { kpis: EMPTY_KPIS, error: error.message };
    }

    return { kpis: normalizeKpis(data), error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("[dashboard] falha ao carregar KPIs:", message);
    return { kpis: EMPTY_KPIS, error: message };
  }
}
