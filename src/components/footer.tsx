import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { formatPhone, whatsappUrl } from "@/lib/whatsapp";
import { Brand, WhatsAppButton } from "./ui";

export function FinalCta({ phone }: { phone: string }) {
  return <section className="final-cta section"><div className="container"><div className="eyebrow"><span className="status-dot" />PRONTO PARA O PRÓXIMO CUIDADO?</div><div className="final-cta-row"><h2>SEU VEÍCULO MERECE<br /><span className="copper-text">VOLTAR A BRILHAR.</span></h2><div><p>Agende o seu atendimento<br />com a Garage 101.</p><WhatsAppButton phone={phone}>Vamos agendar</WhatsAppButton></div></div></div></section>;
}
export function Footer({ settings }: { settings: SiteSettings }) {
  return <><footer className="site-footer"><div className="container"><div className="footer-top"><Brand footer /><p>Cuidado em cada detalhe.<br />Brilho em cada resultado.</p><a className="footer-phone" href={whatsappUrl(settings.whatsapp)} target="_blank" rel="noopener noreferrer"><small>CONVERSE COM A GARAGE 101</small>{formatPhone(settings.whatsapp)}<ArrowUpRight size={22} /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Garage 101</span><div><Link href="/servicos">Serviços</Link><Link href="/sobre">Sobre</Link><Link href="/contato">Contato</Link><Link href="/privacidade">Privacidade</Link></div><span>ATENDIMENTO COM AGENDAMENTO</span></div></div></footer><a className="floating-whatsapp" href={whatsappUrl(settings.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="Conversar com a Garage 101 no WhatsApp"><MessageCircle size={25} strokeWidth={1.8} /><span>Vamos conversar?</span></a></>;
}
