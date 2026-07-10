-- ============================================================
-- Coffee Master — Schema Supabase
-- Rode este arquivo PRIMEIRO no SQL Editor do Supabase.
-- (Depois rode supabase/seed.sql para popular usuários e posts.)
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Tabelas
-- ------------------------------------------------------------

-- Perfil público, 1:1 com auth.users
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique,
  name          text,
  surname       text,
  description   text,
  image_profile text,
  created_at    timestamptz not null default now()
);

create table if not exists public.posts (
  id         bigint generated always as identity primary key,
  user_id    uuid references public.profiles(id) on delete set null,
  date       date,
  image_url  text,
  category   text,
  title      text,
  resume     text,
  content    text,
  duration   text,
  views      int  default 0,
  status     int  default 1,
  created_at timestamptz not null default now()
);

-- Avaliação anônima: 1 voto por navegador (voter_id vem do localStorage)
create table if not exists public.ratings (
  id         bigint generated always as identity primary key,
  post_id    bigint not null references public.posts(id) on delete cascade,
  rating     int    not null check (rating between 1 and 5),
  voter_id   text   not null,
  created_at timestamptz not null default now(),
  unique (post_id, voter_id)
);

-- Comentário anônimo
create table if not exists public.comments (
  id          bigint generated always as identity primary key,
  post_id     bigint not null references public.posts(id) on delete cascade,
  author_name text   not null default 'Anônimo',
  content     text   not null check (char_length(content) between 1 and 2000),
  status      int    not null default 1,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- View: resumo de avaliação por post (média + total de votos)
-- ------------------------------------------------------------
create or replace view public.post_rating_summary as
select
  p.id                                            as post_id,
  coalesce(round(avg(r.rating)::numeric, 2), 0)   as avg_rating,
  count(r.id)                                     as votes_count
from public.posts p
left join public.ratings r on r.post_id = p.id
group by p.id;

-- ------------------------------------------------------------
-- Trigger: cria profile automaticamente ao criar usuário
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, name, surname, image_profile)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'surname', ''),
    new.raw_user_meta_data->>'image_profile'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.posts    enable row level security;
alter table public.ratings  enable row level security;
alter table public.comments enable row level security;

-- profiles: leitura pública; dono gerencia o próprio
drop policy if exists profiles_select_public on public.profiles;
create policy profiles_select_public on public.profiles
  for select using (true);
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert to authenticated with check (auth.uid() = id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- posts: leitura pública; insert autenticado do próprio user_id
drop policy if exists posts_select_public on public.posts;
create policy posts_select_public on public.posts
  for select using (true);
drop policy if exists posts_insert_own on public.posts;
create policy posts_insert_own on public.posts
  for insert to authenticated with check (auth.uid() = user_id);

-- ratings: leitura pública; insert/update anônimo (nota válida)
drop policy if exists ratings_select_public on public.ratings;
create policy ratings_select_public on public.ratings
  for select using (true);
drop policy if exists ratings_insert_anon on public.ratings;
create policy ratings_insert_anon on public.ratings
  for insert with check (rating between 1 and 5);
drop policy if exists ratings_update_anon on public.ratings;
create policy ratings_update_anon on public.ratings
  for update using (true) with check (rating between 1 and 5);

-- comments: leitura pública dos aprovados; insert anônimo
drop policy if exists comments_select_public on public.comments;
create policy comments_select_public on public.comments
  for select using (status = 1);
drop policy if exists comments_insert_anon on public.comments;
create policy comments_insert_anon on public.comments
  for insert with check (char_length(content) between 1 and 2000);

-- ------------------------------------------------------------
-- Grants para os papéis da API (anon = visitante, authenticated = logado)
-- ------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant select on public.posts to anon, authenticated;
grant insert on public.posts to authenticated;
grant select, insert, update on public.ratings to anon, authenticated;
grant select, insert on public.comments to anon, authenticated;
grant select on public.post_rating_summary to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
