import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Motion } from "@/components/motion";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return <><a href="#main" className="skip-link">Pular para o conteúdo</a><Header phone={settings.whatsapp} /><Motion><main id="main">{children}</main></Motion><Footer settings={settings} /></>;
}
