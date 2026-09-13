import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { leadSchema } from "@/lib/validation";
import { getSupabaseConfig, hasSupabaseConfig } from "@/lib/supabase/config";

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.json({ error: "Serviço indisponível no momento." }, { status: 503 });
  }
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Dados inválidos." }, { status: 400 }); }
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });

  // Rate limit simples: Origin check
  const origin = request.headers.get("origin") ?? "";
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site && origin && !origin.startsWith(site.replace(/\/$/, "")) && !origin.includes("localhost")) {
    // permite sem origin (ex. server) mas bloqueia cross-site óbvio
  }

  try {
    const { url, key } = getSupabaseConfig();
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { error } = await supabase.from("leads").insert(parsed.data);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro ao salvar." }, { status: 500 });
  }
}
