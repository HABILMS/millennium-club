import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const defaultDemoNotifications = [
  {
    id: "notif-demo-1",
    user_email: "demo@millenniumclub.com.br",
    type: "welcome",
    title: "Bem-vindo ao Millennium Club",
    message: "Sua conta de membro está ativa. Explore a vitrine de ativos, consulte oportunidades e configure seu perfil.",
    read: false,
    action_url: "/app/oportunidades",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "notif-demo-2",
    user_email: "demo@millenniumclub.com.br",
    type: "badge_earned",
    title: "Selo de Membro Verificado",
    message: "Você conquistou o selo de Membro Credenciado ao completar a verificação cadastral.",
    read: true,
    action_url: "/app/perfil",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "notif-demo-3",
    user_email: "demo@millenniumclub.com.br",
    type: "event_rsvp",
    title: "Convite: Mesa Redonda Energia Solar & Crédito",
    message: "Nova rodada técnica exclusiva agendada para este mês. Garanta sua vaga com antecedência.",
    read: false,
    action_url: "/app/eventos",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const emailParam = searchParams.get("email");

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const targetEmail = (emailParam || user?.email || "").trim().toLowerCase();

    let query = supabase.from("notifications").select("*");

    if (user?.id && targetEmail) {
      query = query.or(`user_id.eq.${user.id},user_email.ilike.${targetEmail}`);
    } else if (targetEmail) {
      query = query.ilike("user_email", targetEmail);
    } else if (user?.id) {
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(50);

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn("[api/notifications] Aviso ao buscar:", error.message);
      }
      return NextResponse.json({
        notifications: defaultDemoNotifications,
        unreadCount: defaultDemoNotifications.filter((n) => !n.read).length,
        source: "fallback",
      });
    }

    const unreadCount = data.filter((n: any) => !n.read).length;

    return NextResponse.json({
      notifications: data,
      unreadCount,
      source: "database",
    });
  } catch (err: any) {
    console.error("[api/notifications] Erro no GET:", err?.message);
    return NextResponse.json({
      notifications: defaultDemoNotifications,
      unreadCount: defaultDemoNotifications.filter((n) => !n.read).length,
      error: err?.message,
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, all, email } = body;

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const targetEmail = (email || user?.email || "").trim().toLowerCase();

    if (all) {
      let query = supabase
        .from("notifications")
        .update({ read: true, read_at: new Date().toISOString() });

      if (user?.id && targetEmail) {
        query = query.or(`user_id.eq.${user.id},user_email.ilike.${targetEmail}`);
      } else if (targetEmail) {
        query = query.ilike("user_email", targetEmail);
      } else if (user?.id) {
        query = query.eq("user_id", user.id);
      } else {
        query = query.eq("read", false);
      }

      const { error } = await query;
      if (error) {
        console.warn("[api/notifications] Erro ao marcar todas lidas:", error.message);
      }
      return NextResponse.json({ success: true, markedAll: true });
    }

    if (!id) {
      return NextResponse.json({ error: "ID da notificação é obrigatório" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true, read_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.warn("[api/notifications] Erro ao atualizar status:", error.message);
    }

    return NextResponse.json({ success: true, notification: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro no PATCH" }, { status: 500 });
  }
}
