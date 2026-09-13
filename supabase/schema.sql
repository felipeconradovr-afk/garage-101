-- Garage 101 — schema + RLS
-- Execute neste ordem em um projeto Supabase novo.
-- 1) Este schema.sql  2) seed.sql  3) desativar signups em Auth  4) criar usuário admin e inserir em admin_users

-- Extensões
create extension if not exists "uuid-ossp";

-- Tabelas
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null,
  description text not null,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  before_image text not null,
  after_image text not null,
  description text not null default '',
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  rating integer not null check (rating between 1 and 5),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key,
  whatsapp text not null,
  instagram text not null default '',
  address text not null default '',
  opening_hours text not null default '',
  hero_title text not null,
  hero_subtitle text not null
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  service text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.services enable row level security;
alter table public.gallery enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;
alter table public.leads enable row level security;
alter table public.admin_users enable row level security;

-- Leitura pública apenas para conteúdo ativo / settings
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'services_public_read') then
    create policy services_public_read on public.services for select using (active = true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'gallery_public_read') then
    create policy gallery_public_read on public.gallery for select using (active = true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'testimonials_public_read') then
    create policy testimonials_public_read on public.testimonials for select using (active = true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'site_settings_public_read') then
    create policy site_settings_public_read on public.site_settings for select using (true);
  end if;
end $$;

-- Inserção pública de leads (formulário sem login). Leitura restrita a admin.
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'leads_public_insert') then
    create policy leads_public_insert on public.leads for insert with check (true);
  end if;
end $$;

-- Admin: verificação via tabela admin_users. Políticas desbloqueiam tudo para quem está na lista.
-- Função helper
create or replace function public.is_admin() returns boolean language sql stable as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid())
$$;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'services_admin_all') then
    create policy services_admin_all on public.services for all using (public.is_admin()) with check (public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'gallery_admin_all') then
    create policy gallery_admin_all on public.gallery for all using (public.is_admin()) with check (public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'testimonials_admin_all') then
    create policy testimonials_admin_all on public.testimonials for all using (public.is_admin()) with check (public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'site_settings_admin_all') then
    create policy site_settings_admin_all on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'leads_admin_read') then
    create policy leads_admin_read on public.leads for select using (public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'leads_admin_delete') then
    create policy leads_admin_delete on public.leads for delete using (public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'admin_users_self_read') then
    create policy admin_users_self_read on public.admin_users for select using (user_id = auth.uid());
  end if;
end $$;

-- Storage bucket público garage-media (criar via SQL se ainda não existir)
insert into storage.buckets (id, name, public) values ('garage-media','garage-media', true)
on conflict (id) do nothing;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'garage_media_public_read') then
    create policy garage_media_public_read on storage.objects for select using (bucket_id = 'garage-media');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'garage_media_admin_write') then
    create policy garage_media_admin_write on storage.objects for insert with check (bucket_id = 'garage-media' and public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'garage_media_admin_update') then
    create policy garage_media_admin_update on storage.objects for update using (bucket_id = 'garage-media' and public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'garage_media_admin_delete') then
    create policy garage_media_admin_delete on storage.objects for delete using (bucket_id = 'garage-media' and public.is_admin());
  end if;
end $$;
