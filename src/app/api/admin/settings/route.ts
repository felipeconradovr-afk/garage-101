import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/server";
import { settingsSchema } from "@/lib/validation";

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: unknown) {
    const status = e instanceof Error && "status" in e ? (e as { status: number }).status : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro." }, { status });
  }
}

export async function PUT(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const parsed = settingsSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const { data, error } = await supabase.from("site_settings").update(parsed.data).eq("id", 1).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: unknown) {
    const status = e instanceof Error && "status" in e ? (e as { status: number }).status : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro." }, { status });
  }
}
