import type { Metadata } from "next";
import Image from "next/image";
import { Check, Sparkles, ShieldCheck, CalendarDays } from "lucide-react";
import { getSettings } from "@/lib/data";
import { SectionLabel, WhatsAppButton } from "@/components/ui";
import { FinalCta } from "@/components/footer";

export const metadata: Metadata = { title: "Sobre", description: "Conheça a Garage 101 — estética automotiva e higienização com atendimento por agendamento." };

export default async function SobrePage() {
  const settings = await getSettings();
  return (
    <>
      <section className="page-intro container">
        <SectionLabel number="SOBRE">GARAGE 101</SectionLabel>
        <h1 className="section-title">CUIDADO EM<br /><span className="copper-text">CADA DETALHE.</span></h1>
        <p className="muted" style={{ maxWidth: 560, marginTop: 18 }}>Estética automotiva, higienização interna e cuidado com estofados. Do carro ao pesado, o mesmo padrão — sem atalhos.</p>
      </section>

      <section className="section sobre-hero">
        <div className="container sobre-grid">
          <div className="sobre-media" data-reveal>
            <Image src="/images/garage-101-original.webp" alt="Emblema Garage 101 em cobre" width={896} height={1197} style={{ objectFit: "cover" }} />
            <span className="sobre-badge"><span className="status-dot" /> ATENDIMENTO COM AGENDAMENTO</span>
          </div>
          <div data-reveal>
            <div className="eyebrow"><span className="short-line" /> NOSSA MANEIRA DE CUIDAR</div>
            <h2 className="section-title" style={{ fontSize: 42, marginTop: 18 }}>BRILHO QUE<br /><span className="copper-text">SE SENTE.</span></h2>
            <p className="muted" style={{ marginTop: 18 }}>A Garage 101 nasceu do cuidado com o detalhe. Polimento completo, higienização interna, estofados, caminhões e máquinas agrícolas — cada atendimento combina técnica, produtos adequados e acabamento que valoriza.</p>
            <ul className="sobre-list">
              <li><Check size={14} /> Polimento automotivo com cera cristalizadora e revitalização</li>
              <li><Check size={14} /> Higienização de bancos, tecidos e superfícies internas</li>
              <li><Check size={14} /> Sofás, colchões e estofados da sua casa</li>
              <li><Check size={14} /> Carros, caminhões e máquinas agrícolas</li>
            </ul>
            <div style={{ marginTop: 24, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <WhatsAppButton phone={settings.whatsapp}>Agendar pelo WhatsApp</WhatsAppButton>
              <span className="sobre-note"><CalendarDays size={14} /> Horário combinado diretamente no WhatsApp.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section sobre-values">
        <div className="container">
          <SectionLabel number="02">COMO TRABALHAMOS</SectionLabel>
          <div className="sobre-values-grid">
            {[
              { icon: Sparkles, title: "Acabamento", text: "Cada etapa importa — da lavagem inicial ao enceramento final." },
              { icon: ShieldCheck, title: "Proteção", text: "Produtos adequados que preservam pintura, plásticos e tecidos." },
              { icon: CalendarDays, title: "Agendamento", text: "Seu horário reservado. Sem fila, sem improviso." },
            ].map(({ icon: Icon, title, text }) => (
              <article key={title} className="sobre-value-card" data-reveal>
                <Icon size={28} strokeWidth={1.4} />
                <h3>{title}</h3>
                <p className="muted">{text}</p>
              </article>
            ))}
          </div>
          {settings.address || settings.opening_hours ? (
            <div className="sobre-meta" data-reveal>
              {settings.address ? <p><strong>Endereço:</strong> {settings.address}</p> : null}
              {settings.opening_hours ? <p><strong>Horários:</strong> {settings.opening_hours}</p> : null}
              {settings.instagram ? <p><strong>Instagram:</strong> {settings.instagram}</p> : null}
            </div>
          ) : null}
        </div>
      </section>
      <FinalCta phone={settings.whatsapp} />
    </>
  );
}
