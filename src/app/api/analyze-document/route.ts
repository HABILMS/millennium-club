import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { image, text, pdfData, fileName } = await request.json();

    if (!image && !text && !pdfData) {
      return NextResponse.json(
        { error: "Nenhum documento, texto ou imagem foi fornecido para análise." },
        { status: 400 }
      );
    }

    const apiKey = process.env.NVIDIA_API_KEY || process.env.NEXT_PUBLIC_NVIDIA_API_KEY;

    let extractedText = (text || "").trim();

    // Se receber pdfData bruto (fallback caso não tenha sido convertido no cliente)
    if (!extractedText && pdfData && typeof pdfData === "string") {
      try {
        const base64Content = pdfData.includes(",") ? pdfData.split(",")[1] : pdfData;
        const truncatedBase64 = base64Content.slice(0, 700000);
        const buffer = Buffer.from(truncatedBase64, "base64");
        const rawString = buffer.toString("latin1").slice(0, 300000);

        const cleanTokens = rawString.match(/[A-Za-z0-9À-ÿ$.,/–-]{3,}/g) || [];
        extractedText = cleanTokens.slice(0, 400).join(" ");
      } catch (pdfErr) {
        console.warn("[api/analyze-document] Erro no fallback de leitura do PDF:", pdfErr);
      }
    }

    let extractedData = null;

    if (apiKey) {
      try {
        const systemPrompt = `Você é um analista sênior de M&A, private equity e investimentos do Millennium Club.
Sua missão é ler o documento (em texto, markdown, word ou pdf) ou imagem de negócio fornecido e extrair com precisão os dados para preenchimento da oportunidade.
Retorne EXCLUSIVAMENTE um objeto JSON válido (sem tags markdown, sem explicações antes ou depois) no seguinte formato:
{
  "title": "Título conciso e comercial da oportunidade",
  "category": "Uma destas opções exatas: venda_usina_solar, credito_carbono, venda_hoteis, compra_hoteis, socio_projetos, aeronaves, automoveis, usinas_rsu, credito_solar, passivo_solar (ou deixe vazio se não identificar)",
  "volume": "Valor ou ticket estimado (ex: R$ 45.000.000 ou US$ 6.5M). Se não encontrado, deixe string vazia ''",
  "location": "Localização (cidade, estado ou região). Se não encontrado, deixe string vazia ''",
  "stage": "Uma destas opções: Ativa, Nova Originação, Em Negociação, NDA Requerido",
  "summary": "Resumo executivo de 2 a 3 frases explicando a tese e o ativo. Se não encontrado, deixe string vazia ''",
  "details": "Informações técnicas adicionais, contratos, EBITDA, licenças, garantias. Se não encontrado, deixe string vazia ''",
  "highlights": ["Destaque 1", "Destaque 2", "Destaque 3"]
}
REGRA CRÍTICA: Se algum campo não estiver claro ou não puder ser lido com segurança no documento/imagem, DEIXE-O COMO STRING VAZIA (""). Não invente dados financeiros não presentes no material.`;

        let userMessageContent: any = "";

        if (image) {
          userMessageContent = [
            {
              type: "text",
              text: `Analise as informações e a imagem/teaser da oportunidade de negócio contidas no arquivo "${fileName || "documento"}":\n\n${extractedText ? extractedText.slice(0, 5000) : ""}`,
            },
            {
              type: "image_url",
              image_url: {
                url: image.startsWith("data:") ? image : `data:image/jpeg;base64,${image}`,
              },
            },
          ];
        } else {
          userMessageContent = `Analise as seguintes informações extraídas do arquivo "${fileName || "documento"}":\n\n${extractedText.slice(0, 10000)}`;
        }

        // Timeout de proteção de 18 segundos
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 18000);

        const aiRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "meta/llama-3.2-11b-vision-instruct",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessageContent },
            ],
            temperature: 0.1,
            max_tokens: 1200,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          const rawResponse = aiJson.choices?.[0]?.message?.content || "";

          // Limpa formatações markdown ```json
          const cleanedJsonString = rawResponse
            .replace(/```json/gi, "")
            .replace(/```/gi, "")
            .trim();

          const jsonMatch = cleanedJsonString.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            extractedData = JSON.parse(jsonMatch[0]);
          }
        } else {
          console.warn("[api/analyze-document] Resposta da IA com status:", aiRes.status);
        }
      } catch (aiErr) {
        console.warn("[api/analyze-document] Falha na chamada da IA (prosseguindo com parser inteligente):", aiErr);
      }
    }

    // Heurística de contingência inteligente caso a IA externa esteja inacessível
    if (!extractedData) {
      const combined = `${extractedText || ""} ${fileName || ""}`.toLowerCase();
      let detectedCat = "socio_projetos";
      if (combined.includes("solar") || combined.includes("fotovolt") || combined.includes("mwp")) {
        detectedCat = "venda_usina_solar";
      } else if (combined.includes("carbon") || combined.includes("redd") || combined.includes("florest")) {
        detectedCat = "credito_carbono";
      } else if (combined.includes("hotel") || combined.includes("resort") || combined.includes("hosped")) {
        detectedCat = "venda_hoteis";
      } else if (combined.includes("aero") || combined.includes("jato") || combined.includes("embraer") || combined.includes("aviao")) {
        detectedCat = "aeronaves";
      } else if (combined.includes("frota") || combined.includes("veiculo") || combined.includes("suv") || combined.includes("blindad")) {
        detectedCat = "automoveis";
      } else if (combined.includes("rsu") || combined.includes("lixo") || combined.includes("recicl")) {
        detectedCat = "usinas_rsu";
      }

      const volMatch = (extractedText || "").match(/(r\$|us\$|r\$\s*|us\$\s*)[\d.,]+(\s*(milhões|milhoes|mi|m|bi|bilhões|bilhoes))?/i);
      const volume = volMatch ? volMatch[0] : "";

      const locMatch = (extractedText || "").match(/(são paulo|sp|minas gerais|mg|rio de janeiro|rj|bahia|ba|ceará|ce|curitiba|pr|brasília|df|goiás|go)/i);
      const location = locMatch ? locMatch[0] : "";

      extractedData = {
        title: fileName ? fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") : "Oportunidade Analisada",
        category: detectedCat,
        volume: volume || "",
        location: location || "",
        stage: "Ativa",
        summary: extractedText ? extractedText.slice(0, 250).trim() + "..." : "Oportunidade extraída a partir do documento anexo.",
        details: extractedText ? extractedText.slice(0, 600).trim() : "",
        highlights: ["Material lido e processado", "Dados disponíveis sob NDA"],
      };
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
      provider: "IA Millennium",
    });
  } catch (err: any) {
    console.error("[api/analyze-document] Falha interna:", err);
    return NextResponse.json(
      { error: err?.message || "Erro ao analisar documento." },
      { status: 500 }
    );
  }
}
