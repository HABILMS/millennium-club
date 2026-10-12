import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "documents";

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniquePath = `${folder}/${Date.now()}_${cleanFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Tenta upload no bucket 'opportunities'
    const { data, error } = await supabase.storage
      .from("opportunities")
      .upload(uniquePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (error) {
      console.warn("[api/upload] Supabase Storage aviso:", error.message);
      // Se o bucket não estiver criado, geramos um fallback com data URL se for imagem pequena ou aviso
      return NextResponse.json({
        warning: "Bucket Supabase 'opportunities' não configurado ainda.",
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        url: "#",
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from("opportunities")
      .getPublicUrl(uniquePath);

    return NextResponse.json({
      success: true,
      path: uniquePath,
      url: publicUrlData.publicUrl,
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    });
  } catch (err: any) {
    console.error("[api/upload] Erro interno:", err?.message);
    return NextResponse.json({ error: err?.message || "Falha no upload" }, { status: 500 });
  }
}
