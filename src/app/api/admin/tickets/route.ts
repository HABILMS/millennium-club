import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    // 1. Tenta RPC get_all_admin_tickets
    let { data, error } = await supabase.rpc("get_all_admin_tickets");

    if (error || !data) {
      const res = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });
      data = res.data;
      error = res.error;
    }

    if (error) {
      console.warn("[api/admin/tickets] Erro:", error.message);
      return NextResponse.json({ tickets: [] }, { status: 200 });
    }

    return NextResponse.json({ tickets: data || [] }, { status: 200 });
  } catch (err: any) {
    console.error("[api/admin/tickets] Erro fatal:", err?.message);
    return NextResponse.json({ tickets: [], error: err?.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, priority, adminNotes, adminResolutionNotes } = body;

    if (!id) {
      return NextResponse.json({ error: "ID do chamado é obrigatório" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updatePayload.status = status;
      if (status === "resolved" || status === "closed") {
        updatePayload.resolved_at = new Date().toISOString();
      }
    }
    if (priority) updatePayload.priority = priority;
    if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;
    if (adminResolutionNotes !== undefined) updatePayload.admin_resolution_notes = adminResolutionNotes;

    const { data, error } = await supabase
      .from("tickets")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, ticket: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro no PATCH" }, { status: 500 });
  }
}
