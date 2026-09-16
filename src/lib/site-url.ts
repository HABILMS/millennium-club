/**
 * Resolve a URL pública do site usada em redirects de autenticação
 * (magic link, recuperação de senha, OAuth) e metadados.
 *
 * Ordem de precedência:
 *  1. `NEXT_PUBLIC_SITE_URL` — domínio canônico definido explicitamente.
 *  2. Origem atual do navegador — garante que o redirect volte para o
 *     mesmo domínio em que o usuário está (localhost, preview ou produção).
 *  3. `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` — domínio da Vercel
 *     quando a origem do navegador não está disponível (ex.: build).
 *  4. localhost — apenas desenvolvimento.
 */
function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  // No browser: always prefer the current origin over a potentially stale env var
  if (typeof window !== "undefined") {
    // If the env var is set to localhost but we're clearly on production, ignore it
    if (fromEnv && !fromEnv.includes("localhost")) {
      return stripTrailingSlash(fromEnv);
    }
    return window.location.origin;
  }

  // Server-side: use env var if it's a real URL (not localhost)
  if (fromEnv && !fromEnv.includes("localhost")) {
    return stripTrailingSlash(fromEnv);
  }

  // Vercel build: use the project's production URL
  const vercelDomain =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelDomain) return `https://${stripTrailingSlash(vercelDomain)}`;

  return "http://localhost:3000";
}

/** Monta uma URL absoluta a partir de um caminho relativo do app. */
export function getSiteUrlFor(path: string): string {
  const base = getSiteUrl();
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
