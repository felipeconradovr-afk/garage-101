import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { SectionLabel } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";
import { FinalCta } from "@/components/footer";
import { formatPhone, whatsappUrl } from "@/lib/whatsapp";
import { MessageCircle, MapPin, Clock, Instagram } from "lucide-react";

export const metadata: Metadata = { title: "Contato", description: "Fale com a Garage 101 — orçamento e agendamento pelo WhatsApp." };

export default async function ContatoPage() {
  const settings = await getSettings();
  return (
    <>
      <section className="page-intro container">
        <SectionLabel number="CONTATO">FALE COM A GENTE</SectionLabel>
        <h1 className="section-title">VAMOS<br /><span className="copper-text">CONVERSAR.</span></h1>
        <p className="muted" style={{ maxWidth: 520, marginTop: 18 }}>Conte o que precisa de cuidado. O orçamento e o horário são combinados diretamente no WhatsApp.</p>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container contato-grid">
          <div data-reveal>
            <ContactForm whatsapp={settings.whatsapp} />
          </div>
          <aside className="contato-aside" data-reveal>
            <a className="contato-card contato-card--wa" href={whatsappUrl(settings.whatsapp)} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={22} />
              <div>
                <small>WHATSAPP</small>
                <strong>{formatPhone(settings.whatsapp)}</strong>
                <span>Atendimento com agendamento</span>
              </div>
            </a>
            {settings.address ? <div className="contato-card"><MapPin size={18} /><span>{settings.address}</span></div> : null}
            {settings.opening_hours ? <div className="contato-card"><Clock size={18} /><span>{settings.opening_hours}</span></div> : null}
            {settings.instagram ? <a className="contato-card" href={settings.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={18} /><span>{settings.instagram}</span></a> : null}
            <p className="muted" style={{ marginTop: 18, fontSize: 11, lineHeight: 1.8 }}>Nenhum agendamento é simulado. O envio da mensagem e a confirmação do horário acontecem no WhatsApp.</p>
          </aside>
        </div>
      </section>
      <FinalCta phone={settings.whatsapp} />
    </>
  );
}
