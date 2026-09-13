export const DEFAULT_WHATSAPP = "5551995888316";
export const DEFAULT_MESSAGE = "Olá! Vim pelo site da Garage 101 e gostaria de solicitar um orçamento.";
export function whatsappUrl(phone = DEFAULT_WHATSAPP, message = DEFAULT_MESSAGE) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits || DEFAULT_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
export function serviceWhatsappUrl(service: string, phone = DEFAULT_WHATSAPP) {
  return whatsappUrl(phone, `Olá! Vim pelo site da Garage 101 e gostaria de saber mais sobre o serviço de ${service}.`);
}
export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const local = digits.startsWith("55") && digits.length === 13 ? digits.slice(2) : digits;
  return local.length === 11 ? `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}` : phone;
}
