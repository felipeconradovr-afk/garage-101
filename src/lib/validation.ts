import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(80),
  phone: z.string().trim().min(10, "Informe um WhatsApp válido.").max(20),
  service: z.string().trim().min(2, "Selecione um serviço.").max(80),
  message: z.string().trim().min(10, "Conte um pouco sobre o que precisa.").max(1000),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(3).max(80),
  slug: z.string().trim().min(3).max(80).regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen."),
  short_description: z.string().trim().min(10).max(160),
  description: z.string().trim().min(20).max(2000),
  image_url: z.string().trim().max(500).nullable().optional(),
  active: z.boolean().default(true),
  sort_order: z.coerce.number().int().min(1).max(99).default(1),
});

export const gallerySchema = z.object({
  title: z.string().trim().min(3).max(80),
  category: z.string().trim().min(2).max(40),
  before_image: z.string().trim().min(10).max(500),
  after_image: z.string().trim().min(10).max(500),
  description: z.string().trim().max(500).optional().default(""),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  sort_order: z.coerce.number().int().min(1).max(99).default(1),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(80),
  text: z.string().trim().min(10).max(600),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  active: z.boolean().default(true),
});

export const settingsSchema = z.object({
  whatsapp: z.string().trim().min(10).max(20),
  instagram: z.string().trim().max(120).optional().default(""),
  address: z.string().trim().max(200).optional().default(""),
  opening_hours: z.string().trim().max(200).optional().default(""),
  hero_title: z.string().trim().min(6).max(120),
  hero_subtitle: z.string().trim().min(10).max(200),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type GalleryInput = z.infer<typeof gallerySchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
