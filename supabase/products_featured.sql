-- ============================================================
-- Coffee Master — Produtos em destaque na landing
-- Rode DEPOIS de products.sql e brands.sql no SQL Editor do Supabase.
-- ============================================================

alter table public.products
  add column if not exists is_featured boolean not null default false;

create index if not exists products_featured_created_at_idx
  on public.products (is_featured desc, created_at asc);

-- Mantém no máximo quatro produtos favoritos e só permite a ação a admins.
create or replace function public.set_featured_product(
  p_product_id bigint,
  p_featured boolean
)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem alterar produtos em destaque.';
  end if;

  if not exists (select 1 from public.products where id = p_product_id) then
    raise exception 'Produto não encontrado.';
  end if;

  if p_featured
     and not exists (select 1 from public.products where id = p_product_id and is_featured)
     and (select count(*) from public.products where is_featured) >= 4 then
    raise exception 'É possível destacar no máximo quatro produtos.';
  end if;

  update public.products
     set is_featured = p_featured,
         updated_at = now()
   where id = p_product_id;
end;
$$;

revoke all on function public.set_featured_product(bigint, boolean) from public, anon;
grant execute on function public.set_featured_product(bigint, boolean) to authenticated;
