import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { defaultMockEvents, EventItem } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    // 1. Busca todos os eventos
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !events || events.length === 0) {
      if (error) console.warn("[api/admin/events] Erro:", error.message);
      return NextResponse.json({ events: defaultMockEvents, source: "fallback" });
    }

    // 2. Busca lista de todos os inscritos
    const { data: rsvps } = await supabase
      .from("event_rsvps")
      .select("id, event_id, user_email, user_name, created_at")
      .order("created_at", { ascending: false });

    const attendeesByEvent: Record<string, any[]> = {};
    if (Array.isArray(rsvps)) {
      for (const r of rsvps) {
        if (!attendeesByEvent[r.event_id]) {
          attendeesByEvent[r.event_id] = [];
        }
        attendeesByEvent[r.event_id].push({
          id: r.id,
          name: r.user_name || "Membro",
          email: r.user_email,
          registeredAt: r.created_at,
        });
      }
    }

    const mapped: EventItem[] = events.map((e: any) => {
      const attendees = attendeesByEvent[e.id] || [];
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
        registeredCount: attendees.length > 0 ? attendees.length : 12,
        isActive: e.is_active,
        createdAt: e.created_at,
        attendees,
      };
    });

    return NextResponse.json({ events: mapped, source: "database" });
  } catch (err: any) {
    console.error("[api/admin/events] Erro fatal no GET:", err?.message);
    return NextResponse.json({ events: defaultMockEvents, error: err?.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      category = "webinar",
      categoryLabel,
      date,
      time,
      location,
      speakers = [],
      description,
      capacity = "100 participantes",
      maxAttendees = 100,
      isActive = true,
    } = body;

    if (!title || !date || !location || !description) {
      return NextResponse.json(
        { error: "Campos obrigatórios: Título, Data, Local e Descrição." },
        { status: 400 }
      );
    }

    const categoryMap: Record<string, string> = {
      presencial: "Evento Presencial",
      seminario: "Seminário",
      webinar: "Webinar Online",
    };

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("events")
      .insert({
        title: title.trim(),
        category,
        category_label: categoryLabel || categoryMap[category] || "Evento",
        date: date.trim(),
        time: time?.trim() || "19:00 (BRT)",
        location: location.trim(),
        speakers: Array.isArray(speakers) ? speakers : [],
        description: description.trim(),
        capacity: capacity.trim(),
        max_attendees: Number(maxAttendees) || 100,
        is_active: Boolean(isActive),
      })
      .select()
      .single();

    if (error) {
      console.error("[api/admin/events] Erro ao criar evento:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro no POST" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID do evento obrigatório" }, { status: 400 });
    }

    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title) payload.title = updates.title.trim();
    if (updates.category) payload.category = updates.category;
    if (updates.categoryLabel) payload.category_label = updates.categoryLabel;
    if (updates.date) payload.date = updates.date.trim();
    if (updates.time) payload.time = updates.time.trim();
    if (updates.location) payload.location = updates.location.trim();
    if (updates.speakers !== undefined) payload.speakers = updates.speakers;
    if (updates.description) payload.description = updates.description.trim();
    if (updates.capacity) payload.capacity = updates.capacity.trim();
    if (updates.maxAttendees !== undefined) payload.max_attendees = Number(updates.maxAttendees);
    if (updates.isActive !== undefined) payload.is_active = Boolean(updates.isActive);

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("events")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro no PATCH" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID do evento obrigatório" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro no DELETE" }, { status: 500 });
  }
}
