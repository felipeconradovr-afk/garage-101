import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/server";
import { serviceSchema } from "@/lib/validation";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { supabase } = await requireAdmin();
    const body = await request.json();
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const { data, error } = await supabase.from("services").update(parsed.data).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: unknown) {
    const status = e instanceof Error && "status" in e ? (e as { status: number }).status : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro." }, { status });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const status = e instanceof Error && "status" in e ? (e as { status: number }).status : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro." }, { status });
  }
}
