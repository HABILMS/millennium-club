import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const category = searchParams.get("category");

    const supabase = await createSupabaseServerClient();
    let query = supabase.from("tickets").select("*");

    if (email) {
      query = query.ilike("author_email", email.trim());
    }

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.warn("[api/tickets] Aviso no Supabase:", error.message);
      return NextResponse.json({ tickets: [] }, { status: 200 });
    }

    return NextResponse.json({ tickets: data || [] }, { status: 200 });
  } catch (err: any) {
    console.error("[api/tickets] Erro fatal:", err?.message);
    return NextResponse.json({ tickets: [], error: err?.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      authorName,
      authorEmail,
      authorWhatsapp,
      category,
      categoryLabel,
      subject,
      description,
      priority = "normal",
      domainRequested,
      emailsRequested = [],
      landingPageRequested = false,
    } = body;

    if (!authorName || !authorEmail || !category || !subject || !description) {
      return NextResponse.json(
        { error: "Campos obrigatórios: Nome, E-mail, Categoria, Assunto e Descrição." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const ticketNumber = `TCK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const insertPayload = {
      ticket_number: ticketNumber,
      author_name: authorName.trim(),
      author_email: authorEmail.trim().toLowerCase(),
      author_whatsapp: authorWhatsapp?.trim() || null,
      category,
      category_label: categoryLabel || "Suporte Geral",
      subject: subject.trim(),
      description: description.trim(),
      priority,
      status: "open",
      domain_requested: domainRequested?.trim() || null,
      emails_requested: emailsRequested || [],
      landing_page_requested: Boolean(landingPageRequested),
    };

    const { data: ticket, error: ticketErr } = await supabase
      .from("tickets")
      .insert(insertPayload)
      .select()
      .single();

    if (ticketErr) {
      console.error("[api/tickets] Erro ao inserir chamado:", ticketErr.message);
      return NextResponse.json({ error: ticketErr.message }, { status: 500 });
    }

    // Insere a mensagem inicial na timeline
    if (ticket?.id) {
      await supabase.from("ticket_messages").insert({
        ticket_id: ticket.id,
        sender_type: "member",
        sender_name: authorName.trim(),
        content: description.trim(),
      });
    }

    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch (err: any) {
    console.error("[api/tickets] Erro inesperado:", err?.message);
    return NextResponse.json({ error: err?.message || "Erro desconhecido" }, { status: 500 });
  }
}
