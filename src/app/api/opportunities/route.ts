import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { defaultOpportunities, OpportunityItem } from "@/lib/opportunities";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Mapeia linha do banco Supabase para o formato OpportunityItem da aplicação
export function mapDbRowToOpportunity(row: any): OpportunityItem {
  return {
    id: String(row.id),
    title: row.title || "Oportunidade sem título",
    category: row.category || "all",
    categoryLabel: row.category_label || "Geral",
    categoryIcon: row.category_icon || "💎",
    volume: row.volume || (row.requested_volume ? `R$ ${Number(row.requested_volume).toLocaleString('pt-BR')}` : "Sob Consulta"),
    location: row.location || "Brasil",
    stage: row.stage || "Ativa",
    summary: row.summary || "",
    details: row.details || row.summary || "",
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    imageUrl: row.image_url || "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
    documentPdfName: row.document_pdf_name || undefined,
    documentPdfSize: row.document_pdf_size || undefined,
    documentPdfUrl: row.document_pdf_url || undefined,
    author: row.author_data && typeof row.author_data === "object" ? row.author_data : {
      name: "Membro Millennium",
      company: "Clube de Negócios",
      jobTitle: "Membro Credenciado",
      badge: "Membro Verificado",
    },
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    questions: Array.isArray(row.questions) ? row.questions : [],
    approvalStatus: (row.approval_status as any) || "approved",
    isMandataryDeclared: row.is_mandatary_declared ?? true,
    reviewedAt: row.reviewed_at || undefined,
    reviewedBy: row.reviewed_by || undefined,
    rejectionReason: row.rejection_reason || undefined,
    adminNotes: row.admin_notes || undefined,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const authorEmail = searchParams.get("authorEmail");
    const status = searchParams.get("status") || "approved";

    const supabase = await createSupabaseServerClient();

    let query = supabase.from("opportunities").select("*");

    if (status !== "all") {
      query = query.eq("approval_status", status);
    }

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.warn("[api/opportunities] Alerta na consulta Supabase:", error.message);
      // Fallback gracioso para dados padrão aprovados caso o banco esteja em processo de migration
      let filteredDefaults = defaultOpportunities.filter((item) => {
        if (status !== "all" && item.approvalStatus !== status) return false;
        if (category && category !== "all" && item.category !== category) return false;
        return true;
      });
      return NextResponse.json({ opportunities: filteredDefaults, source: "fallback", error: error.message });
    }

    if (!data || data.length === 0) {
      // Se a tabela estiver vazia e busca por aprovados, retorna defaultOpportunities
      if (status === "approved" || status === "all") {
        return NextResponse.json({ opportunities: defaultOpportunities, source: "default_seed" });
      }
      return NextResponse.json({ opportunities: [], source: "db" });
    }

    let opportunities = data.map(mapDbRowToOpportunity);

    if (authorEmail) {
      opportunities = opportunities.filter(
        (opp) => opp.author?.email?.toLowerCase() === authorEmail.toLowerCase()
      );
    }

    return NextResponse.json({ opportunities, source: "db" });
  } catch (err: any) {
    console.error("[api/opportunities] Erro fatal:", err?.message);
    return NextResponse.json({ opportunities: defaultOpportunities, source: "fallback_catch" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      category,
      categoryLabel,
      categoryIcon,
      volume,
      location,
      stage,
      summary,
      details,
      highlights,
      imageUrl,
      galleryImages,
      documentPdfName,
      documentPdfSize,
      documentPdfUrl,
      author,
      isMandataryDeclared,
    } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: "Título e categoria são campos obrigatórios." },
        { status: 400 }
      );
    }

    if (!isMandataryDeclared) {
      return NextResponse.json(
        { error: "É obrigatório declarar ser mandatário direto ou exclusivo do ativo para submeter." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const insertPayload = {
      title,
      category,
      category_label: categoryLabel || "Oportunidade",
      category_icon: categoryIcon || "💎",
      volume: volume || "Sob Consulta",
      location: location || "Brasil",
      stage: stage || "Ativa",
      summary: summary || "",
      details: details || summary || "",
      highlights: highlights || [],
      image_url: imageUrl || "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
      gallery_images: galleryImages || [],
      document_pdf_name: documentPdfName || null,
      document_pdf_size: documentPdfSize || null,
      document_pdf_url: documentPdfUrl || null,
      author_data: author || {},
      questions: [],
      approval_status: "pending",
      is_mandatary_declared: true,
    };

    const { data, error } = await supabase
      .from("opportunities")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("[api/opportunities] Erro ao inserir no Supabase:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const mapped = mapDbRowToOpportunity(data);
    return NextResponse.json({ success: true, opportunity: mapped }, { status: 201 });
  } catch (err: any) {
    console.error("[api/opportunities] Erro inesperado no POST:", err?.message);
    return NextResponse.json({ error: err?.message || "Erro interno" }, { status: 500 });
  }
}
