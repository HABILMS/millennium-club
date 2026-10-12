import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { defaultOpportunities } from "@/lib/opportunities";
import { mapDbRowToOpportunity } from "@/app/api/opportunities/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    // 1. Tenta buscar via RPC security definer
    let { data, error } = await supabase.rpc("get_all_admin_opportunities");

    // 2. Se a RPC não existir ainda, consulta a tabela diretamente
    if (error || !data) {
      const res = await supabase
        .from("opportunities")
        .select("*")
        .order("created_at", { ascending: false });
      data = res.data;
      error = res.error;
    }

    if (error) {
      console.warn("[api/admin/opportunities] Aviso no Supabase:", error.message);
      return NextResponse.json({ opportunities: defaultOpportunities, error: error.message }, { status: 200 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ opportunities: defaultOpportunities, source: "default" }, { status: 200 });
    }

    const mapped = data.map(mapDbRowToOpportunity);
    return NextResponse.json({ opportunities: mapped }, { status: 200 });
  } catch (err: any) {
    console.error("[api/admin/opportunities] Erro fatal no GET:", err?.message);
    return NextResponse.json({ opportunities: defaultOpportunities, error: err?.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, approvalStatus, rejectionReason, adminNotes, reviewedBy } = body;

    if (!id || !approvalStatus) {
      return NextResponse.json(
        { error: "Parâmetros 'id' e 'approvalStatus' são obrigatórios" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const updatePayload: Record<string, any> = {
      approval_status: approvalStatus,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (rejectionReason !== undefined) updatePayload.rejection_reason = rejectionReason;
    if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;
    if (reviewedBy) updatePayload.reviewed_by = reviewedBy;

    const { data, error } = await supabase
      .from("opportunities")
      .update(updatePayload)
      .eq("id", id)
      .select();

    if (error) {
      console.error("[api/admin/opportunities] Erro no update Supabase:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: data });
  } catch (err: any) {
    console.error("[api/admin/opportunities] Erro fatal no PATCH:", err?.message);
    return NextResponse.json({ error: err?.message || "Erro desconhecido" }, { status: 500 });
  }
}
