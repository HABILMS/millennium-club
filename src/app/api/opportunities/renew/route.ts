import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, days = 20 } = body;

    if (!id) {
      return NextResponse.json({ error: "ID da oportunidade é obrigatório" }, { status: 400 });
    }

    const validityDays = Math.max(20, Number(days) || 20); // Mínimo de 20 dias garantido
    const expiresAt = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString();

    const supabase = await createSupabaseServerClient();

    // 1. Tenta via RPC renew_opportunity
    const { data: rpcData, error: rpcError } = await supabase.rpc("renew_opportunity", {
      p_opportunity_id: id,
      p_days: validityDays,
    });

    if (!rpcError && rpcData) {
      return NextResponse.json({ success: true, opportunity: rpcData, expiresAt });
    }

    // 2. Fallback direto via UPDATE na tabela
    const { data, error } = await supabase
      .from("opportunities")
      .update({
        expires_at: expiresAt,
        last_renewed_at: new Date().toISOString(),
        validity_days: validityDays,
        approval_status: "approved", // Garante reativação caso estivesse expirada
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    const targetOpp = rpcData || data;
    if (targetOpp) {
      const authorEmail = targetOpp.author_data?.email || targetOpp.created_by_email;
      const oppTitle = targetOpp.title || "Oportunidade";
      if (authorEmail) {
        const { createNotification } = await import("@/lib/notifications");
        await createNotification({
          userEmail: authorEmail,
          type: "opportunity_expiring",
          title: "Oportunidade Renovada!",
          message: `A oportunidade "${oppTitle}" foi renovada com sucesso por mais ${validityDays} dias.`,
          actionUrl: "/app/oportunidades",
          metadata: { opportunityId: id, validityDays, expiresAt },
        });
      }
    }

    return NextResponse.json({ success: true, opportunity: targetOpp, expiresAt });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro ao renovar oportunidade" }, { status: 500 });
  }
}
