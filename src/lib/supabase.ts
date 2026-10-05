import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para o navegador com sessão em COOKIES (e não apenas
 * localStorage). Isso é essencial: o middleware de /app valida a sessão via
 * cookies; com createClient puro o login "funciona" mas o middleware nunca
 * enxerga o usuário e devolve para /login em loop.
 *
 * O @supabase/ssr mantém localStorage + cookies em sincronia no browser.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dsosgpzpxwzsuoxqdghn.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzb3NncHpweHd6c3VveHFkZ2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMjkyNDksImV4cCI6MjEwNDkwNTI0OX0.pfbQa-JET7Xj3J7n3t-SBX-UlWnjUFRqSHSRgHHnXjc";

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
