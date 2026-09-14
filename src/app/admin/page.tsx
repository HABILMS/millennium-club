import { getDashboardData } from "@/lib/supabase-server";
import { AdminDashboardView } from "./dashboard-view";

// Os KPIs vêm do banco a cada requisição, então nunca são pré-renderizados.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { kpis, error } = await getDashboardData();

  return <AdminDashboardView kpis={kpis} error={error} />;
}
