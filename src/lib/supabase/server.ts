import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig, hasSupabaseConfig } from "./config";

export class AdminAuthError extends Error {
  constructor(public status: number, message: string) { super(message); this.name = "AdminAuthError"; }
}
export async function createServerSupabaseClient() {
  const { url, key } = getSupabaseConfig();
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(values) {
        try { values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
        catch { /* O proxy atualiza os cookies ao renderizar Server Components. */ }
      },
    },
  });
}
export async function requireAdmin() {
  if (!hasSupabaseConfig()) throw new AdminAuthError(503, "Configure o Supabase para acessar a administração.");
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new AdminAuthError(401, "Entre com sua conta administrativa.");
  const { data: admin, error: adminError } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (adminError) throw new AdminAuthError(503, "Não foi possível verificar o acesso administrativo. Confira a configuração do banco.");
  if (!admin) throw new AdminAuthError(403, "Esta conta não tem acesso à administração.");
  return { supabase, user };
}
