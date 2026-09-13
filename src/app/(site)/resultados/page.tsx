import type { Metadata } from "next";
import { getGallery, getSettings } from "@/lib/data";
import { SectionLabel, WhatsAppButton } from "@/components/ui";
import { GalleryGrid } from "@/components/gallery";
import { FinalCta } from "@/components/footer";

export const metadata: Metadata = { title: "Resultados", description: "Antes e depois dos cuidados da Garage 101." };

export default async function ResultadosPage() {
  const [gallery, settings] = await Promise.all([getGallery(), getSettings()]);
  return (
    <>
      <section className="page-intro container">
        <SectionLabel number="04">RESULTADOS REAIS</SectionLabel>
        <h1 className="section-title">O DETALHE<br /><span className="copper-text">FAZ A DIFERENÇA.</span></h1>
        <p className="muted" style={{ maxWidth: 520, marginTop: 18 }}>Cada resultado tem uma história de cuidado. Arraste para comparar antes e depois.</p>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {gallery.length ? (
            <GalleryGrid items={gallery} />
          ) : (
            <div className="results-empty-block" data-reveal>
              <div className="results-ghost" aria-hidden="true" style={{ position: "relative", right: "auto", top: 0, fontSize: 120, lineHeight: 1 }}>101<span style={{ fontSize: 38 }}>GARAGE</span></div>
              <span className="eyebrow" style={{ color: "#ab8966", marginTop: 18 }}>CADA TRANSFORMAÇÃO, DE PERTO.</span>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 28, marginTop: 10 }}>Estamos preparando nossa galeria.</p>
              <span style={{ fontSize: 12, color: "#928c84", display: "block", marginTop: 10 }}>Enquanto isso, converse com a gente sobre o cuidado que você procura.</span>
              <div style={{ marginTop: 22 }}><WhatsAppButton phone={settings.whatsapp}>Conversar no WhatsApp</WhatsAppButton></div>
            </div>
          )}
        </div>
      </section>
      <FinalCta phone={settings.whatsapp} />
    </>
  );
}
