import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/ui";
import { getSettings } from "@/lib/data";
import { FinalCta } from "@/components/footer";
import { formatPhone, whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Privacidade" };

export default async function PrivacidadePage() {
  const settings = await getSettings();
  return (
    <>
      <section className="page-intro container">
        <SectionLabel number="PRIVACIDADE">TRANSPARÊNCIA</SectionLabel>
        <h1 className="section-title">SEUS DADOS.<br /><span className="copper-text">COM RESPEITO.</span></h1>
        <p className="muted" style={{ maxWidth: 640, marginTop: 18 }}>Como tratamos as informações que você envia pelo formulário e pelo WhatsApp da Garage 101.</p>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container privacy-content">
          <article data-reveal>
            <h2>O que coletamos</h2>
            <p className="muted">Nome, telefone/WhatsApp, serviço de interesse e mensagem que você escreve no formulário de contato. Esses dados são enviados ao nosso banco apenas quando você clica em enviar.</p>
            <h2>Para que usamos</h2>
            <p className="muted">Exclusivamente para responder seu pedido de orçamento, combinar horário e manter histórico de atendimento. Não vendemos, não alugamos e não usamos seus dados para disparos em massa.</p>
            <h2>Onde ficam</h2>
            <p className="muted">No banco Supabase do projeto (tabelas com RLS ativo) e, quando aplicável, no histórico da conversa no WhatsApp. Leads não têm leitura pública.</p>
            <h2>Por quanto tempo</h2>
            <p className="muted">Pelo tempo necessário ao atendimento e à gestão comercial. Você pode pedir a exclusão a qualquer momento.</p>
            <h2>Seus direitos e contato</h2>
            <p className="muted">Você pode solicitar acesso, correção ou exclusão dos seus dados. Fale com a Garage 101 pelo WhatsApp <a href={whatsappUrl(settings.whatsapp)} target="_blank" rel="noopener noreferrer">{formatPhone(settings.whatsapp)}</a> ou volte ao <Link href="/contato">formulário de contato</Link>.</p>
            <h2>Cookies e rastreamento</h2>
            <p className="muted">O site não usa cookies de publicidade. Cookies técnicos podem existir apenas para manter sua sessão no painel administrativo.</p>
          </article>
        </div>
      </section>
      <FinalCta phone={settings.whatsapp} />
    </>
  );
}
