import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { SetupScreen } from "@/components/admin/SetupScreen";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { requireAdmin, AdminAuthError } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!hasSupabaseConfig()) return <SetupScreen />;
  let email = "";
  try {
    const { user } = await requireAdmin();
    email = user.email ?? "Administrador";
  } catch (error) {
    if (error instanceof AdminAuthError) {
      if (error.status === 401) redirect("/admin/login");
      if (error.status === 403) redirect("/admin/login?access=denied");
      return <SetupScreen connectionError />;
    }
    throw error;
  }
  return <AdminDashboard email={email} />;
}
