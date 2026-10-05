import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    // 1. Tenta buscar via RPC com privilégios definidos
    let { data, error } = await supabase.rpc("get_all_applications");

    // 2. Se a RPC não existir ainda no banco, faz a consulta direta na tabela
    if (error || !data) {
      const res = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });
      data = res.data;
      error = res.error;
    }

    if (error) {
      console.error("[api/admin/candidaturas] erro RLS/DB:", error.message);
      return NextResponse.json({ applications: [], error: error.message }, { status: 200 });
    }

    return NextResponse.json({ applications: data || [] }, { status: 200 });
  } catch (err: any) {
    console.error("[api/admin/candidaturas] falha na requisição:", err?.message);
    return NextResponse.json({ applications: [], error: err?.message }, { status: 500 });
  }
}
