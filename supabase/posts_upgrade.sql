-- ============================================================
-- Coffee Master — Upgrade de posts: imagens, slug (SEO) e moderação
-- Rode DEPOIS de schema.sql, products.sql e brands.sql.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Bucket de imagens de post (qualquer usuário autenticado publica)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

drop policy if exists post_images_public_read on storage.objects;
create policy post_images_public_read on storage.objects
  for select using (bucket_id = 'post-images');
drop policy if exists post_images_auth_insert on storage.objects;
create policy post_images_auth_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'post-images');
drop policy if exists post_images_auth_update on storage.objects;
create policy post_images_auth_update on storage.objects
  for update to authenticated using (bucket_id = 'post-images');
drop policy if exists post_images_auth_delete on storage.objects;
create policy post_images_auth_delete on storage.objects
  for delete to authenticated using (bucket_id = 'post-images');

-- ------------------------------------------------------------
-- 2) Slug (URL amigável para SEO)
-- ------------------------------------------------------------
create or replace function public.slugify(txt text)
returns text
language sql
immutable
as $$
  select trim(both '-' from
    regexp_replace(
      regexp_replace(
        lower(translate(
          coalesce(txt, ''),
          'áàâãäéèêëíìîïóòôõöúùûüçñ',
          'aaaaaeeeeiiiiooooouuuucn'
        )),
        '[^a-z0-9]+', '-', 'g'
      ),
      '-{2,}', '-', 'g'
    )
  );
$$;

alter table public.posts add column if not exists slug text;

-- Backfill com desempate para títulos repetidos
with ranked as (
  select id,
         nullif(public.slugify(title), '') as base,
         row_number() over (partition by public.slugify(title) order by id) as rn
  from public.posts
)
update public.posts p
   set slug = case
                when r.base is null then 'post-' || p.id
                when r.rn = 1 then r.base
                else r.base || '-' || r.rn
              end
  from ranked r
 where r.id = p.id
   and (p.slug is null or p.slug = '');

create unique index if not exists posts_slug_key on public.posts (slug);

-- ------------------------------------------------------------
-- 3) Moderação de comentários (admin)
--    status: 1 = visível · 0 = oculto/censurado
-- ------------------------------------------------------------
-- Admin enxerga todos os comentários (inclusive ocultos)
drop policy if exists comments_select_admin on public.comments;
create policy comments_select_admin on public.comments
  for select using (public.is_admin());

-- Admin pode censurar (update status) e excluir
drop policy if exists comments_admin_update on public.comments;
create policy comments_admin_update on public.comments
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists comments_admin_delete on public.comments;
create policy comments_admin_delete on public.comments
  for delete to authenticated using (public.is_admin());

grant update, delete on public.comments to authenticated;
