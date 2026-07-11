-- ============================================================
-- Coffee Master — Marcas nos produtos
-- Rode DEPOIS de products.sql (independente de account.sql).
-- ============================================================

alter table public.products
  add column if not exists brand text;

-- Marcas são livres; os filtros da aplicação usam os valores cadastrados.
-- Este comando também remove o constraint de instalações anteriores.
alter table public.products
  drop constraint if exists products_brand_check;

-- Backfill: os 2 produtos semeados são Astoria
update public.products
  set brand = 'astoria'
  where brand is null and name ilike 'ASTORIA%';

-- Index simples para filtrar rápido por marca
create index if not exists products_brand_idx on public.products (brand);

-- ------------------------------------------------------------
-- RLS extra em posts: autor pode UPDATE/DELETE os proprios posts
-- (o schema original so permitia SELECT publico e INSERT do dono)
-- ------------------------------------------------------------
drop policy if exists posts_update_own on public.posts;
create policy posts_update_own on public.posts
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists posts_delete_own on public.posts;
create policy posts_delete_own on public.posts
  for delete to authenticated using (auth.uid() = user_id);

grant update, delete on public.posts to authenticated;
