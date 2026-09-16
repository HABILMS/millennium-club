import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para o navegador com sessão em COOKIES (e não apenas
 * localStorage). Isso é essencial: o middleware de /app valida a sessão via
 * cookies; com createClient puro o login "funciona" mas o middleware nunca
 * enxerga o usuário e devolve para /login em loop.
 *
 * O @supabase/ssr mantém localStorage + cookies em sincronia no browser.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
