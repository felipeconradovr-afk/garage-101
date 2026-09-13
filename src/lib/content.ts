import type { Service, SiteSettings } from "./types";
import { DEFAULT_WHATSAPP } from "./whatsapp";

export const defaultSettings: SiteSettings = {
  id: 1, whatsapp: DEFAULT_WHATSAPP, instagram: "", address: "", opening_hours: "",
  hero_title: "ESTÉTICA QUE DEVOLVE O BRILHO AO SEU VEÍCULO.",
  hero_subtitle: "Polimento profissional, higienização e cuidado completo para carros, caminhões e máquinas agrícolas.",
};
const entries = [
  ["Polimento automotivo", "polimento-automotivo", "Recuperação do brilho, correção visual e valorização da pintura.", "O cuidado com a pintura começa nos detalhes. Nosso polimento completo reúne lavagem externa, polimento, lavagem com produtos desengordurantes, enceramento com cera cristalizadora e revitalização dos plásticos externos. Converse com a Garage 101 para avaliar o seu veículo e combinar o atendimento."],
  ["Higienização interna", "higienizacao-interna", "Limpeza profunda de bancos, tecidos e superfícies internas.", "O interior do seu veículo também merece atenção. A higienização interna cuida dos bancos, tecidos e superfícies para uma sensação renovada de limpeza e conforto. Informe o modelo do veículo e o que precisa de cuidado para solicitar um orçamento."],
  ["Higienização de estofamentos", "higienizacao-de-estofamentos", "Limpeza profunda para sofás, colchões e outros estofados.", "Um novo cuidado para os espaços do seu dia a dia. A higienização ajuda a remover sujeira acumulada e odores, preservando o material e a sensação de conforto. Envie uma foto do sofá, colchão ou estofado pelo WhatsApp para conversar sobre o serviço."],
  ["Caminhões", "caminhoes", "Cuidado e estética para veículos de grande porte.", "Do carro ao pesado, o cuidado continua o mesmo. A Garage 101 também atende caminhões. Conte o modelo e o serviço desejado para consultar as possibilidades de atendimento e agendamento."],
  ["Máquinas agrícolas", "maquinas-agricolas", "Limpeza e acabamento para máquinas utilizadas no campo.", "A atenção ao acabamento também chega às máquinas do campo. Fale com a Garage 101 sobre sua máquina agrícola e o cuidado que ela precisa. As condições do serviço são combinadas no orçamento."],
];
export const defaultServices: Service[] = entries.map(([title, slug, short_description, description], index) => ({
  id: `00000000-0000-4000-8000-00000000000${index + 1}`, title, slug, short_description, description,
  image_url: null, active: true, sort_order: index + 1, created_at: "2026-09-13T00:00:00.000Z",
}));
export const polishingSteps = [
  ["Lavagem completa externa", "O primeiro cuidado com a superfície."],
  ["Polimento completo", "A atenção que devolve o brilho."],
  ["Lavagem com desengordurantes", "Limpeza externa após o polimento."],
  ["Cera cristalizadora", "Enceramento completo da pintura."],
  ["Revitalização dos plásticos", "Acabamento nos detalhes externos."],
];
