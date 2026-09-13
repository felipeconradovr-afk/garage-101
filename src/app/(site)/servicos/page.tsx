import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, CarFront, Sofa, Truck, Tractor } from "lucide-react";
import { getServices, getSettings } from "@/lib/data";
import { SectionLabel, WhatsAppButton } from "@/components/ui";
import { FinalCta } from "@/components/footer";

export const metadata: Metadata = { title: "Serviços" };
const icons = [Sparkles, CarFront, Sofa, Truck, Tractor];

export default async function ServicosPage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  return (
    <>
      <section className="page-intro container">
        <SectionLabel number="01">CATÁLOGO</SectionLabel>
        <h1 className="section-title">CADA CUIDADO.<br /><span className="copper-text">NO SEU TEMPO.</span></h1>
        <p className="muted">Polimento, higienização e atenção a cada detalhe. Escolha o serviço e converse com a Garage 101 no WhatsApp.</p>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="service-list">
            {services.map((service, i) => {
              const Icon = icons[i % icons.length];
              return (
                <Link key={service.id} href={`/servicos/${service.slug}`} className="service-row" data-reveal>
                  <span className="service-index">0{i + 1}</span>
                  <div className="service-icon"><Icon size={27} strokeWidth={1.25} /></div>
                  <h3>{service.title}</h3>
                  <p>{service.short_description}</p>
                  <span className="circle-arrow"><ArrowUpRight size={21} /></span>
                </Link>
              );
            })}
          </div>
          <div className="servicos-extra" data-reveal>
            <div className="servicos-extra-media">
              <Image src="/images/higienizacao-original.webp" alt="Arte original Garage 101 — higienização" width={896} height={1200} style={{ objectFit: "cover", objectPosition: "center" }} />
              <span className="servicos-extra-badge">ATENDIMENTO COM AGENDAMENTO</span>
            </div>
            <div>
              <h2 className="section-title" style={{ fontSize: 38 }}>NÃO ENCONTROU<br /><span className="copper-text">O QUE PROCURA?</span></h2>
              <p className="muted">Conte o que precisa — carro, caminhão, máquina ou estofado — e a equipe combina o cuidado ideal.</p>
              <WhatsAppButton phone={settings.whatsapp}>Conversar no WhatsApp</WhatsAppButton>
            </div>
          </div>
        </div>
      </section>
      <FinalCta phone={settings.whatsapp} />
    </>
  );
}
