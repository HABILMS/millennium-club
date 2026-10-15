import { createSupabaseServerClient } from "@/lib/supabase-server";

export type NotificationType =
  | "opportunity_approved"
  | "opportunity_rejected"
  | "opportunity_expiring"
  | "ticket_reply"
  | "ticket_created"
  | "event_rsvp"
  | "system"
  | "welcome"
  | "badge_earned";

export interface NotificationItem {
  id: string;
  user_id?: string;
  user_email: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
  read_at?: string;
}

export interface CreateNotificationParams {
  userId?: string;
  userEmail: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

/**
 * Cria uma notificação no banco de dados Supabase de forma segura e não bloqueante.
 */
export async function createNotification(params: CreateNotificationParams): Promise<boolean> {
  try {
    if (!params.userEmail || !params.title || !params.message) {
      console.warn("[notifications] Dados incompletos para criar notificação:", params);
      return false;
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("notifications").insert({
      user_id: params.userId || null,
      user_email: params.userEmail.trim().toLowerCase(),
      type: params.type,
      title: params.title.trim(),
      message: params.message.trim(),
      read: false,
      action_url: params.actionUrl || null,
      metadata: params.metadata || {},
    });

    if (error) {
      console.warn("[notifications] Aviso ao inserir no Supabase:", error.message);
      return false;
    }

    return true;
  } catch (err: any) {
    console.warn("[notifications] Erro inesperado ao criar notificação:", err?.message);
    return false;
  }
}
