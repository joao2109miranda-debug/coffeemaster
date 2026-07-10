-- ============================================================
-- Coffee Master — Produtos + Admin + Storage
-- Rode DEPOIS de schema.sql e seed.sql no SQL Editor do Supabase.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Flag de admin no profile + helper
-- ------------------------------------------------------------
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- fabianof é o admin
update public.profiles set is_admin = true where username = 'fabianof';

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and is_admin);
$$;

-- ------------------------------------------------------------
-- 2) Tabela de produtos
-- ------------------------------------------------------------
create table if not exists public.products (
  id            bigint generated always as identity primary key,
  name          text not null,
  available     boolean not null default true,
  description   text,
  specification text,
  image_url     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.products enable row level security;

-- Leitura pública; escrita apenas admin
drop policy if exists products_select_public on public.products;
create policy products_select_public on public.products
  for select using (true);
drop policy if exists products_admin_insert on public.products;
create policy products_admin_insert on public.products
  for insert to authenticated with check (public.is_admin());
drop policy if exists products_admin_update on public.products;
create policy products_admin_update on public.products
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists products_admin_delete on public.products;
create policy products_admin_delete on public.products
  for delete to authenticated using (public.is_admin());

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

-- ------------------------------------------------------------
-- 3) Storage: bucket público para imagens de produto
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists product_images_public_read on storage.objects;
create policy product_images_public_read on storage.objects
  for select using (bucket_id = 'product-images');
drop policy if exists product_images_admin_insert on storage.objects;
create policy product_images_admin_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists product_images_admin_update on storage.objects;
create policy product_images_admin_update on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.is_admin());
drop policy if exists product_images_admin_delete on storage.objects;
create policy product_images_admin_delete on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());

-- ------------------------------------------------------------
-- 4) Seed: produtos Astoria migrados do HTML antigo (só se vazio)
-- ------------------------------------------------------------
insert into public.products (name, available, description, specification)
select * from (values
  ('ASTORIA AVANT', true,
   'Avant é uma máquina de café pronta para se adaptar a todas as situações. Estilo com linhas elegantes e modernas, projeto elegante, decorado com detalhes cromados brilhantes que complementam o caráter com gosto muito refinado. Dentro, toda a experiência e tecnologia da Astoria oferecem alta confiabilidade e elevada confiança para um resultado final de excelente qualidade das bebidas fornecidas.',
   '- Entrada automática de água; // - Lança de Vapor; // Sistema de fornecimento de água quente; // Programação de 4 doses por grupo; // Voltagem: 220V'),
  ('ASTORIA CALYPSO', true,
   'Calypso é a máquina tradicional que garante uma extraordinária qualidade na extração do café, combinando tecnologia e estilo. Calypso é precisa, confiável e o seu design com traços simples e elegantes torna-a perfeita para qualquer tipo de decoração: torna cada pausa para café um verdadeiro momento de prazer. Uma máquina de dois grupos compacta ideal para quem precisa de espaço.',
   '- Entrada automática de água; // - Lança de Vapor; // Sistema de fornecimento de água quente; // Programação de 6 doses por grupo; // Voltagem: 220V')
) as d(name, available, description, specification)
where not exists (select 1 from public.products);
