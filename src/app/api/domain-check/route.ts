import { NextResponse } from "next/server";
import dns from "dns/promises";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawDomain = searchParams.get("domain")?.trim().toLowerCase();

    if (!rawDomain) {
      return NextResponse.json({ error: "Parâmetro 'domain' obrigatório" }, { status: 400 });
    }

    // Limpa prefixos http:// ou https:// ou www.
    const cleanDomain = rawDomain
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/.*$/, "");

    // Validação sintática
    const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;
    if (!domainRegex.test(cleanDomain) || cleanDomain.length > 253) {
      return NextResponse.json({
        domain: cleanDomain,
        isValid: false,
        available: false,
        message: "Formato de domínio inválido. Use caracteres alfanuméricos e hífen (ex: suaeampresa.com.br).",
      });
    }

    // 1. Caso seja domínio .br, tenta checar com a API pública do Registro.br
    if (cleanDomain.endsWith(".br")) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(`https://registro.br/v2/ajax/avail/raw/${encodeURIComponent(cleanDomain)}`, {
          signal: controller.signal,
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        });
        clearTimeout(timeout);

        if (res.ok) {
          const json = await res.json();
          // status 0 = disponível, status 1 = registrado/em processo
          const isAvail = json.status === 0;
          return NextResponse.json({
            domain: cleanDomain,
            isValid: true,
            available: isAvail,
            message: isAvail
              ? `✓ O domínio "${cleanDomain}" está DISPONÍVEL para registro imediato!`
              : `O domínio "${cleanDomain}" já se encontra REGISTRADO por terceiros. Tente outra variação.`,
            provider: "Registro.br",
          });
        }
      } catch (e) {
        // Fallback para checagem DNS se o Registro.br demorar
      }
    }

    // 2. Checagem via DNS lookup (se resolver IP, está em uso; se der ENOTFOUND, provavelmente disponível)
    try {
      const records = await dns.resolve(cleanDomain);
      if (records && records.length > 0) {
        return NextResponse.json({
          domain: cleanDomain,
          isValid: true,
          available: false,
          message: `O domínio "${cleanDomain}" já está em uso na internet. Escolha outro nome.`,
          provider: "DNS Resolver",
        });
      }
    } catch (dnsErr: any) {
      if (dnsErr.code === "ENOTFOUND" || dnsErr.code === "NODATA") {
        return NextResponse.json({
          domain: cleanDomain,
          isValid: true,
          available: true,
          message: `✓ O domínio "${cleanDomain}" parece estar DISPONÍVEL! Solicite o registro ao clube.`,
          provider: "DNS Check",
        });
      }
    }

    return NextResponse.json({
      domain: cleanDomain,
      isValid: true,
      available: true,
      message: `Formato válido. Enviaremos para verificação final do provedor de registro.`,
      provider: "Standard Validation",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro ao consultar domínio" }, { status: 500 });
  }
}
