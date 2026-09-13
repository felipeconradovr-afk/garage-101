"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./ui";
import { whatsappUrl } from "@/lib/whatsapp";

const links = [["/", "Início"], ["/servicos", "Serviços"], ["/resultados", "Resultados"], ["/sobre", "Sobre"], ["/contato", "Contato"]];
export function Header({ phone }: { phone: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 30);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
      if (event.key === "Tab") {
        const anchors = Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
        const nodes = [toggleRef.current, ...anchors].filter(Boolean) as HTMLElement[];
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const media = window.matchMedia("(min-width: 901px)");
    const closeDesktop = () => { if (media.matches) setOpen(false); };
    document.addEventListener("keydown", handleKey); media.addEventListener("change", closeDesktop);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", handleKey); media.removeEventListener("change", closeDesktop); };
  }, [open]);
  return <header className={`site-header ${compact ? "is-compact" : ""} ${open ? "menu-open" : ""}`}>
    <div className="header-inner container"><Brand />
      <nav className="desktop-nav" aria-label="Navegação principal">{links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}</nav>
      <a className="header-cta" href={whatsappUrl(phone)} target="_blank" rel="noopener noreferrer">Agendar <ArrowUpRight size={17} /></a>
      <button ref={toggleRef} className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen(!open)}><span /><span /></button>
    </div>
    {open && <div ref={panelRef} id="mobile-menu" className="mobile-menu"><nav aria-label="Navegação mobile">{links.map(([href, label], i) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={pathname === href ? "page" : undefined}><small>0{i + 1}</small>{label}<ArrowUpRight /></Link>)}</nav><a href={whatsappUrl(phone)} className="button button-primary" target="_blank" rel="noopener noreferrer">Agendar pelo WhatsApp <ArrowUpRight size={18} /></a><p>Seu próximo cuidado começa aqui.</p></div>}
  </header>;
}
