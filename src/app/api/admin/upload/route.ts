import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/server";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Selecione uma imagem." }, { status: 400 });
    if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "Formato não permitido. Use JPG, PNG ou WebP." }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "Imagem muito grande. Máximo 5MB." }, { status: 400 });

    // preview sniff: primeiros bytes devem parecer imagem
    const buf = Buffer.from(await file.arrayBuffer());
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/avif" ? "avif" : "jpg";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage.from("garage-media").upload(name, buf, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("garage-media").getPublicUrl(name);
    return NextResponse.json({ url: data.publicUrl, path: name });
  } catch (e: unknown) {
    const status = e instanceof Error && "status" in e ? (e as { status: number }).status : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro no upload." }, { status });
  }
}
