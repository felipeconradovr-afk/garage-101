import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { getService, getServices, getSettings } from "@/lib/data";
import { polishingSteps } from "@/lib/content";
import { SectionLabel, WhatsAppButton } from "@/components/ui";
import { FinalCta } from "@/components/footer";
import { serviceWhatsappUrl } from "@/lib/whatsapp";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Serviço não encontrado" };
  return { title: service.title, description: service.short_description };
}

export default async function ServicoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([getService(slug), getSettings()]);
  if (!service) notFound();
  const isPolimento = slug === "polimento-automotivo";

  return (
    <>
      <section className="page-intro container">
        <Link href="/servicos" className="back-link"><ArrowLeft size={16} /> Todos os serviços</Link>
        <SectionLabel number="SERVIÇO">GARAGE 101</SectionLabel>
        <h1 className="section-title">{service.title.toUpperCase()}</h1>
        <p className="muted" style={{ maxWidth: 560, marginTop: 18 }}>{service.description}</p>
        <div style={{ marginTop: 22 }}>
          <WhatsAppButton phone={settings.whatsapp} message={`Olá! Vim pelo site da Garage 101 e gostaria de saber mais sobre ${service.title}.`}>
            Solicitar orçamento — {service.title}
          </WhatsAppButton>
        </div>
      </section>

      {isPolimento ? (
        <section className="section polish-detail">
          <div className="container">
            <SectionLabel number="02">O QUE ESTÁ INCLUSO</SectionLabel>
            <ol className="polish-steps" style={{ maxWidth: 720, marginTop: 28 }}>
              {polishingSteps.map(([title, desc], i) => (
                <li key={title} className="polish-step"><span>0{i + 1}</span><div><h3>{title}</h3><p>{desc}</p></div><Check size={18} /></li>
              ))}
            </ol>
            <div className="polish-bottom" style={{ maxWidth: 720 }}><ShieldCheck size={26} /><p>BRILHO. PROTEÇÃO.<br /><strong>VALORIZAÇÃO.</strong></p></div>
          </div>
        </section>
      ) : null}

      <section className="section service-detail-info">
        <div className="container">
          <div className="service-detail-grid">
            <div>
              <h2>O que esperar</h2>
              <p className="muted">{service.short_description}</p>
              <ul className="service-detail-list">
                <li><Check size={14} /> Atendimento com agendamento</li>
                <li><Check size={14} /> Orçamento combinado no WhatsApp</li>
                <li><Check size={14} /> Cuidado sem atalhos</li>
              </ul>
            </div>
            <div className="service-detail-cta">
              <p className="eyebrow">PRONTO PARA AGENDAR?</p>
              <p className="muted">Fale com a equipe, informe o modelo e combine o melhor horário.</p>
              <a className="button button-primary" href={serviceWhatsappUrl(service.title, settings.whatsapp)} target="_blank" rel="noopener noreferrer">
                Falar sobre {service.title} <ArrowUpRight size={16} />
              </a>
              <Link href="/contato" className="text-link">Ou use o formulário <ArrowUpRight size={14} /></Link>
            </div>
          </div>
        </div>
      </section>
      <FinalCta phone={settings.whatsapp} />
    </>
  );
}
