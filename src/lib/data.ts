import "server-only";
import { createClient } from "@supabase/supabase-js";
import { defaultServices, defaultSettings } from "./content";
import { getSupabaseConfig, hasSupabaseConfig } from "./supabase/config";
import type { Service, GalleryItem, Testimonial, SiteSettings } from "./types";

function publicClient() {
  const { url, key } = getSupabaseConfig();
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) } });
}
export async function getServices(): Promise<Service[]> {
  if (!hasSupabaseConfig()) return defaultServices;
  try {
    const { data, error } = await publicClient().from("services").select("*").eq("active", true).order("sort_order");
    if (error) { console.error("Falha ao consultar conteúdo da Garage 101:", error.message); return defaultServices; }
    return (data ?? []) as Service[];
  } catch (e) { console.error("Falha ao consultar conteúdo da Garage 101:", e); return defaultServices; }
}
export async function getService(slug: string): Promise<Service | null> {
  if (!hasSupabaseConfig()) return defaultServices.find(item => item.slug === slug) ?? null;
  try {
    const { data, error } = await publicClient().from("services").select("*").eq("active", true).eq("slug", slug).maybeSingle();
    if (error) { console.error("Falha ao consultar conteúdo da Garage 101:", error.message); return defaultServices.find(item => item.slug === slug) ?? null; }
    return data as Service | null;
  } catch (e) { console.error("Falha ao consultar conteúdo da Garage 101:", e); return defaultServices.find(item => item.slug === slug) ?? null; }
}
export async function getGallery(): Promise<GalleryItem[]> {
  if (!hasSupabaseConfig()) return [];
  try {
    const { data, error } = await publicClient().from("gallery").select("*").eq("active", true).order("sort_order");
    if (error) { console.error("Falha ao consultar conteúdo da Garage 101:", error.message); return []; }
    return (data ?? []) as GalleryItem[];
  } catch (e) { console.error("Falha ao consultar conteúdo da Garage 101:", e); return []; }
}
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!hasSupabaseConfig()) return [];
  try {
    const { data, error } = await publicClient().from("testimonials").select("*").eq("active", true).order("created_at", { ascending: false });
    if (error) { console.error("Falha ao consultar conteúdo da Garage 101:", error.message); return []; }
    return (data ?? []) as Testimonial[];
  } catch (e) { console.error("Falha ao consultar conteúdo da Garage 101:", e); return []; }
}
export async function getSettings(): Promise<SiteSettings> {
  if (!hasSupabaseConfig()) return defaultSettings;
  try {
    const { data, error } = await publicClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) { console.error("Falha ao consultar conteúdo da Garage 101:", error.message); return defaultSettings; }
    if (!data) { console.error("As configurações do site ainda não foram cadastradas no banco."); return defaultSettings; }
    return data as SiteSettings;
  } catch (e) { console.error("Falha ao consultar conteúdo da Garage 101:", e); return defaultSettings; }
}
