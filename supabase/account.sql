-- ============================================================
-- Coffee Master — Conta: avatars (Storage) + exclusão de conta
-- Rode DEPOIS de schema.sql, seed.sql e products.sql.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Bucket público para fotos de perfil
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists avatars_public_read on storage.objects;
create policy avatars_public_read on storage.objects
  for select using (bucket_id = 'avatars');
drop policy if exists avatars_auth_insert on storage.objects;
create policy avatars_auth_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'avatars');
drop policy if exists avatars_auth_update on storage.objects;
create policy avatars_auth_update on storage.objects
  for update to authenticated using (bucket_id = 'avatars');
drop policy if exists avatars_auth_delete on storage.objects;
create policy avatars_auth_delete on storage.objects
  for delete to authenticated using (bucket_id = 'avatars');

-- ------------------------------------------------------------
-- 2) Função para o usuário excluir a própria conta
-- ------------------------------------------------------------
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer set search_path = public, auth
as $$
begin
  -- Remove o usuário do Auth; profiles/posts caem por ON DELETE CASCADE
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
