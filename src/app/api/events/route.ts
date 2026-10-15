import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { defaultMockEvents, EventItem } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const targetEmail = (emailParam || user?.email || "").trim().toLowerCase();

    // 1. Busca eventos ativos
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error || !events || events.length === 0) {
      if (error) {
        console.warn("[api/events] Aviso na tabela events:", error.message);
      }
      return NextResponse.json({ events: defaultMockEvents, source: "fallback" });
    }

    // 2. Busca todos os RSVPs para computar contagens e checar inscrição do usuário
    const { data: rsvps } = await supabase
      .from("event_rsvps")
      .select("event_id, user_email");

    const rsvpCounts: Record<string, number> = {};
    const userRsvps = new Set<string>();

    if (Array.isArray(rsvps)) {
      for (const r of rsvps) {
        rsvpCounts[r.event_id] = (rsvpCounts[r.event_id] || 0) + 1;
        if (targetEmail && r.user_email?.toLowerCase() === targetEmail) {
          userRsvps.add(r.event_id);
        }
      }
    }

    const mappedEvents: EventItem[] = events.map((e: any) => {
      const dbCount = rsvpCounts[e.id] || 0;
      return {
        id: e.id,
        title: e.title,
        category: e.category,
        categoryLabel: e.category_label,
        date: e.date,
        time: e.time,
        location: e.location,
        speakers: Array.isArray(e.speakers) ? e.speakers : [],
        description: e.description,
        capacity: e.capacity,
        maxAttendees: e.max_attendees,
        registeredCount: dbCount > 0 ? dbCount : 15, // base de inscritos para visual
        isRegistered: userRsvps.has(e.id),
        isActive: e.is_active,
        createdAt: e.created_at,
      };
    });

    return NextResponse.json({ events: mappedEvents, source: "database" });
  } catch (err: any) {
    console.error("[api/events] Erro no GET:", err?.message);
    return NextResponse.json({ events: defaultMockEvents, error: err?.message });
  }
}
