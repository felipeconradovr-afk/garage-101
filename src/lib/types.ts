export interface Service {
  id: string; title: string; slug: string; short_description: string;
  description: string; image_url: string | null; active: boolean;
  sort_order: number; created_at: string;
}
export interface GalleryItem {
  id: string; title: string; category: string; before_image: string;
  after_image: string; description: string; featured: boolean;
  active: boolean; sort_order: number; created_at: string;
}
export interface Testimonial {
  id: string; name: string; text: string; rating: number;
  active: boolean; created_at: string;
}
export interface SiteSettings {
  id: number; whatsapp: string; instagram: string; address: string;
  opening_hours: string; hero_title: string; hero_subtitle: string;
}
export interface Lead {
  id: string; name: string; phone: string; service: string;
  message: string; created_at: string;
}
