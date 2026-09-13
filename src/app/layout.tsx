import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import "./globals.css";

const heading = Barlow_Condensed({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-heading", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Garage 101 | Estética automotiva e higienização", template: "%s | Garage 101" },
  description: "Polimento profissional, estética automotiva e higienização de estofamentos. Cuidado para carros, caminhões, máquinas agrícolas, sofás e colchões. Agende pelo WhatsApp.",
  applicationName: "Garage 101", keywords: ["estética automotiva", "polimento automotivo", "higienização automotiva", "higienização de estofamentos", "Garage 101"],
  openGraph: { title: "Garage 101 — Cuidado em cada detalhe", description: "Polimento, estética automotiva e higienização. Atendimento com agendamento.", type: "website", locale: "pt_BR", siteName: "Garage 101" },
  robots: { index: Boolean(process.env.NEXT_PUBLIC_SITE_URL), follow: true },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};
export const viewport: Viewport = { themeColor: "#090909", colorScheme: "dark" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR" className={`${heading.variable} ${body.variable}`}><body>{children}</body></html>;
}
