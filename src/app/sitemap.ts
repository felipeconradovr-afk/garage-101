import type { MetadataRoute } from "next";
import { getServices } from "@/lib/data";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return [];
  const services = await getServices();
  return ["", "/servicos", "/resultados", "/sobre", "/contato", "/privacidade", ...services.map((service) => `/servicos/${service.slug}`)].map((path) => ({ url: `${base.replace(/\/$/, "")}${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : .7 }));
}
