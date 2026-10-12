import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { opportunityId, senderName, senderContact, content } = body;

    if (!opportunityId || !senderName || !content) {
      return NextResponse.json(
        { error: "Campos obrigatórios: opportunityId, senderName e content." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // 1. Tenta via RPC add_opportunity_question
    const { data: rpcData, error: rpcError } = await supabase.rpc("add_opportunity_question", {
      p_opportunity_id: opportunityId,
      p_sender_name: senderName,
      p_sender_contact: senderContact || "",
      p_content: content,
    });

    if (!rpcError && rpcData) {
      return NextResponse.json({ success: true, question: rpcData });
    }

    // 2. Fallback caso a RPC ainda não tenha sido criada no banco
    const { data: currentOpp, error: fetchErr } = await supabase
      .from("opportunities")
      .select("questions")
      .eq("id", opportunityId)
      .single();

    if (fetchErr) {
      console.error("[api/opportunities/question] Erro ao buscar oportunidade:", fetchErr.message);
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    const currentQuestions = Array.isArray(currentOpp?.questions) ? currentOpp.questions : [];
    const newQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      senderName,
      senderContact: senderContact || "",
      content,
      sentAt: new Date().toISOString(),
    };

    const updatedQuestions = [...currentQuestions, newQuestion];

    const { error: updateErr } = await supabase
      .from("opportunities")
      .update({ questions: updatedQuestions })
      .eq("id", opportunityId);

    if (updateErr) {
      console.error("[api/opportunities/question] Erro ao salvar pergunta:", updateErr.message);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, question: newQuestion });
  } catch (err: any) {
    console.error("[api/opportunities/question] Erro fatal:", err?.message);
    return NextResponse.json({ error: err?.message || "Erro desconhecido" }, { status: 500 });
  }
}
