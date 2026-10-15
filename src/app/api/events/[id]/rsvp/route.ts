import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "ID do evento obrigatório" }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userEmail = (body.email || user?.email || "membro@millenniumclub.com.br").trim().toLowerCase();
    const userName = body.name || user?.user_metadata?.first_name || "Membro Millennium";

    // 1. Verifica se já está inscrito
    const { data: existing } = await supabase
      .from("event_rsvps")
      .select("id")
      .eq("event_id", id)
      .ilike("user_email", userEmail)
      .maybeSingle();

    if (existing) {
      // Cancela a inscrição (Toggle OFF)
      await supabase.from("event_rsvps").delete().eq("id", existing.id);
      return NextResponse.json({
        success: true,
        registered: false,
        message: "Inscrição cancelada com sucesso.",
      });
    }

    // 2. Insere inscrição (Toggle ON)
    const { data: inserted, error: insertErr } = await supabase
      .from("event_rsvps")
      .insert({
        event_id: id,
        user_id: user?.id || null,
        user_email: userEmail,
        user_name: userName,
      })
      .select()
      .single();

    if (insertErr) {
      console.warn("[api/events/rsvp] Aviso ao inserir RSVP:", insertErr.message);
    }

    // 3. Busca detalhes do evento para gerar notificação in-app
    const { data: evt } = await supabase
      .from("events")
      .select("title, date, time")
      .eq("id", id)
      .maybeSingle();

    const eventTitle = evt?.title || "Evento Exclusivo";

    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userEmail,
      type: "event_rsvp",
      title: "Inscrição Confirmada!",
      message: `Sua vaga para "${eventTitle}" foi confirmada. Verifique os horários e links na agenda do clube.`,
      actionUrl: "/app/eventos",
      metadata: { eventId: id, eventTitle },
    });

    return NextResponse.json({
      success: true,
      registered: true,
      rsvp: inserted,
      message: "Vaga garantida com sucesso!",
    });
  } catch (err: any) {
    console.error("[api/events/rsvp] Erro:", err?.message);
    return NextResponse.json({ error: err?.message || "Erro ao processar RSVP" }, { status: 500 });
  }
}
