import "server-only";
import { createClient } from "@supabase/supabase-js";
import { defaultServices, defaultSettings } from "./content";
import { getSupabaseConfig, hasSupabaseConfig } from "./supabase/config";
import type { Service, GalleryItem, Testimonial, SiteSettings } from "./types";

function publicClient() {
  const { url, key } = getSupabaseConfig();
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) } });
}
function databaseError(error: { message: string } | null) {
  if (error) { console.error("Falha ao consultar conteúdo da Garage 101:", error.message); throw new Error("Não foi possível carregar o conteúdo. Tente novamente em instantes."); }
}
export async function getServices(): Promise<Service[]> {
  if (!hasSupabaseConfig()) return defaultServices;
  const { data, error } = await publicClient().from("services").select("*").eq("active", true).order("sort_order");
  databaseError(error); return (data ?? []) as Service[];
}
export async function getService(slug: string): Promise<Service | null> {
  if (!hasSupabaseConfig()) return defaultServices.find(item => item.slug === slug) ?? null;
  const { data, error } = await publicClient().from("services").select("*").eq("active", true).eq("slug", slug).maybeSingle();
  databaseError(error); return data as Service | null;
}
export async function getGallery(): Promise<GalleryItem[]> {
  if (!hasSupabaseConfig()) return [];
  const { data, error } = await publicClient().from("gallery").select("*").eq("active", true).order("sort_order");
  databaseError(error); return (data ?? []) as GalleryItem[];
}
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!hasSupabaseConfig()) return [];
  const { data, error } = await publicClient().from("testimonials").select("*").eq("active", true).order("created_at", { ascending: false });
  databaseError(error); return (data ?? []) as Testimonial[];
}
export async function getSettings(): Promise<SiteSettings> {
  if (!hasSupabaseConfig()) return defaultSettings;
  const { data, error } = await publicClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
  databaseError(error);
  if (!data) throw new Error("As configurações do site ainda não foram cadastradas no banco.");
  return data as SiteSettings;
}
