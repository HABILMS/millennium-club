import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

import { defaultPlansData } from "@/lib/plans";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("is_active", true)
      .order("price_cents", { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ plans: defaultPlansData, source: "fallback" }, { status: 200 });
    }

    return NextResponse.json({ plans: data, source: "db" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ plans: defaultPlansData, error: err?.message }, { status: 200 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, code, price_cents, billing_interval, is_active, popular, badge_text, features, digital_kit_included, validity_days } = body;

    if (!id && !code) {
      return NextResponse.json({ error: "Identificador do plano ('id' ou 'code') é obrigatório." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const updatePayload: Record<string, any> = {};

    if (price_cents !== undefined) updatePayload.price_cents = price_cents;
    if (billing_interval !== undefined) updatePayload.billing_interval = billing_interval;
    if (is_active !== undefined) updatePayload.is_active = is_active;
    if (popular !== undefined) updatePayload.popular = popular;
    if (badge_text !== undefined) updatePayload.badge_text = badge_text;
    if (features !== undefined) updatePayload.features = features;
    if (digital_kit_included !== undefined) updatePayload.digital_kit_included = digital_kit_included;
    if (validity_days !== undefined) updatePayload.validity_days = validity_days;

    let query = supabase.from("plans").update(updatePayload);
    if (id) {
      query = query.eq("id", id);
    } else {
      query = query.eq("code", code);
    }

    const { data, error } = await query.select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro no PATCH de planos" }, { status: 500 });
  }
}
