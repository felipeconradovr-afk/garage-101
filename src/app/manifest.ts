import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Garage 101", short_name: "Garage 101", description: "Estética automotiva e higienização", start_url: "/", display: "standalone", background_color: "#090909", theme_color: "#090909", lang: "pt-BR", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }] };
}
