import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";

export function WhatsAppButton({ children = "Agendar pelo WhatsApp", phone, message, className = "" }: { children?: React.ReactNode; phone?: string; message?: string; className?: string }) {
  return <a className={`button button-primary ${className}`} href={whatsappUrl(phone, message)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} strokeWidth={1.7} /><span>{children}</span><ArrowUpRight size={18} /></a>;
}
export function Brand({ footer = false }: { footer?: boolean }) {
  return <Link href="/" className={`brand ${footer ? "brand-large" : ""}`} aria-label="Garage 101 — início"><span className="brand-name">GARAGE<span>101</span></span><span className="brand-caption">ESTÉTICA & CUIDADO</span></Link>;
}
export function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="eyebrow"><span className="section-number">{number}</span><span>{children}</span></div>;
}
