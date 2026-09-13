import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/server";
import { gallerySchema } from "@/lib/validation";

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase.from("gallery").select("*").order("sort_order");
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: unknown) {
    const status = e instanceof Error && "status" in e ? (e as { status: number }).status : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro." }, { status });
  }
}
export async function POST(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const parsed = gallerySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const { data, error } = await supabase.from("gallery").insert(parsed.data).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (e: unknown) {
    const status = e instanceof Error && "status" in e ? (e as { status: number }).status : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro." }, { status });
  }
}
