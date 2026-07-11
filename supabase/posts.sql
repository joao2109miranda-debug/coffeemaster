-- ============================================================
-- Coffee Master — Categorias e post em destaque
-- Rode DEPOIS de schema.sql, seed.sql, products.sql e brands.sql.
-- ============================================================

-- Catálogo de categorias, mantido por administradores.
create table if not exists public.post_categories (
  id         bigint generated always as identity primary key,
  name       text not null unique,
  created_at timestamptz not null default now()
);

alter table public.post_categories enable row level security;

drop policy if exists post_categories_select_public on public.post_categories;
create policy post_categories_select_public on public.post_categories
  for select using (true);
drop policy if exists post_categories_admin_insert on public.post_categories;
create policy post_categories_admin_insert on public.post_categories
  for insert to authenticated with check (public.is_admin());
drop policy if exists post_categories_admin_update on public.post_categories;
create policy post_categories_admin_update on public.post_categories
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists post_categories_admin_delete on public.post_categories;
create policy post_categories_admin_delete on public.post_categories
  for delete to authenticated using (public.is_admin());

grant select on public.post_categories to anon, authenticated;
grant insert, update, delete on public.post_categories to authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

-- Migra as categorias já presentes nos posts para o catálogo.
insert into public.post_categories (name)
select distinct trim(category)
from public.posts
where nullif(trim(category), '') is not null
on conflict (name) do nothing;

alter table public.posts
  add column if not exists category_id bigint references public.post_categories(id) on delete restrict,
  add column if not exists is_featured boolean not null default false;

update public.posts p
set category_id = c.id
from public.post_categories c
where p.category_id is null
  and lower(trim(p.category)) = lower(c.name);

create index if not exists posts_category_id_idx on public.posts (category_id);
create index if not exists posts_date_idx on public.posts (date desc);
create unique index if not exists posts_one_featured_idx
  on public.posts (is_featured)
  where is_featured;

-- Admin pode administrar qualquer post; autores continuam limitados aos próprios.
drop policy if exists posts_update_admin on public.posts;
create policy posts_update_admin on public.posts
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists posts_delete_admin on public.posts;
create policy posts_delete_admin on public.posts
  for delete to authenticated using (public.is_admin());

-- Troca o destaque de forma atômica e só permite a ação a administradores.
create or replace function public.set_featured_post(p_post_id bigint)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem definir o post em destaque.';
  end if;

  if not exists (select 1 from public.posts where id = p_post_id) then
    raise exception 'Post não encontrado.';
  end if;

  update public.posts set is_featured = false where is_featured;
  update public.posts set is_featured = true where id = p_post_id;
end;
$$;

revoke all on function public.set_featured_post(bigint) from public, anon;
grant execute on function public.set_featured_post(bigint) to authenticated;
