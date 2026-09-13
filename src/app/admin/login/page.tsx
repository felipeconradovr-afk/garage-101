import { LoginPanel } from "@/components/admin/LoginPanel";
import { SetupScreen } from "@/components/admin/SetupScreen";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ access?: string }> }) {
  if (!hasSupabaseConfig()) return <SetupScreen />;
  const { access } = await searchParams;
  return <LoginPanel accessDenied={access === "denied"} />;
}
