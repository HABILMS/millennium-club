import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("[api/tickets/messages] Erro:", error.message);
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    return NextResponse.json({ messages: data || [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ messages: [], error: err?.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { senderType = "member", senderName = "Membro", content, newStatus } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "Conteúdo da mensagem não pode ser vazio." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    const { data: newMsg, error: msgErr } = await supabase
      .from("ticket_messages")
      .insert({
        ticket_id: id,
        sender_type: senderType,
        sender_name: senderName,
        content: content.trim(),
      })
      .select()
      .single();

    if (msgErr) {
      return NextResponse.json({ error: msgErr.message }, { status: 500 });
    }

    // Atualiza status e updated_at do ticket
    const updateTicketPayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (newStatus) {
      updateTicketPayload.status = newStatus;
      if (newStatus === "resolved" || newStatus === "closed") {
        updateTicketPayload.resolved_at = new Date().toISOString();
      }
    } else if (senderType === "admin") {
      updateTicketPayload.status = "waiting_user";
    }

    await supabase.from("tickets").update(updateTicketPayload).eq("id", id);

    // Gatilho Automático: Notificação ao Membro quando Admin responde
    if (senderType === "admin") {
      const { data: tck } = await supabase
        .from("tickets")
        .select("author_email, ticket_number, subject")
        .eq("id", id)
        .single();

      if (tck?.author_email) {
        const { createNotification } = await import("@/lib/notifications");
        const snippet = content.length > 90 ? `${content.slice(0, 90)}...` : content;
        await createNotification({
          userEmail: tck.author_email,
          type: "ticket_reply",
          title: `Resposta no Chamado ${tck.ticket_number}`,
          message: `A administração respondeu à sua solicitação "${tck.subject}": "${snippet}"`,
          actionUrl: "/app/solicitacoes",
          metadata: { ticketId: id, ticketNumber: tck.ticket_number },
        });
      }
    }

    return NextResponse.json({ success: true, message: newMsg });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro no envio da mensagem" }, { status: 500 });
  }
}
