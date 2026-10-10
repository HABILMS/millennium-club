import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { prompt, width = 1200, height = 720 } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "O parâmetro 'prompt' é obrigatório." }, { status: 400 });
    }

    const nvidiaApiKey = process.env.NVIDIA_API_KEY || process.env.NEXT_PUBLIC_NVIDIA_API_KEY;

    // 1. Tentar NVIDIA NIM caso o usuário configure a chave de API
    if (nvidiaApiKey) {
      try {
        const nvidiaRes = await fetch("https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-xl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${nvidiaApiKey}`,
            "Accept": "application/json",
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: `${prompt}, photorealistic, ultra-detailed 8k, cinematic lighting, corporate high-end`,
                weight: 1,
              },
            ],
            cfg_scale: 7,
            sampler: "K_DPM_2_ANCESTRAL",
            seed: Math.floor(Math.random() * 1000000),
            steps: 25,
            width: 1024,
            height: 1024,
          }),
        });

        if (nvidiaRes.ok) {
          const data = await nvidiaRes.json();
          const base64Img = data.artifacts?.[0]?.base64;
          if (base64Img) {
            return NextResponse.json({
              imageUrl: `data:image/jpeg;base64,${base64Img}`,
              provider: "NVIDIA NIM SDXL",
              prompt,
            });
          }
        } else {
          console.warn("[api/generate-image] NVIDIA NIM respondeu com status:", nvidiaRes.status);
        }
      } catch (nvidiaErr) {
        console.warn("[api/generate-image] Erro ao conectar com NVIDIA NIM:", nvidiaErr);
      }
    }

    // 2. Provedor Gratuito de Alta Qualidade (Flux AI) com enriquecimento de prompt fotográfico
    const enhancedPrompt = `${prompt}, photorealistic, ultra-detailed, 8k resolution, cinematic lighting, corporate commercial asset photography, architecture photography, shot on Hasselblad, award-winning photography, clean composition`;

    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const seed = Math.floor(Math.random() * 999999);
    const freeImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&nologo=true&seed=${seed}`;

    return NextResponse.json({
      imageUrl: freeImageUrl,
      provider: nvidiaApiKey ? "NVIDIA Fallback" : "Flux AI Generator",
      prompt,
    });
  } catch (err: any) {
    console.error("[api/generate-image] Erro inesperado:", err);
    return NextResponse.json({ error: err?.message || "Erro ao processar imagem." }, { status: 500 });
  }
}
