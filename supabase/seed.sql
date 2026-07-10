-- ============================================================
-- Coffee Master — Seed (dados de exemplo migrados do SQLite)
-- Rode este arquivo DEPOIS de supabase/schema.sql.
--
-- Cria 2 usuários no Supabase Auth com SENHAS TEMPORÁRIAS:
--   fabianof@coffeemaster.dev     senha: CoffeeMaster123!
--   joaoeduardo@coffeemaster.dev  senha: CoffeeMaster123!
-- Troque as senhas depois (Dashboard > Authentication ou "Esqueci a senha").
--
-- É idempotente: rodar de novo não duplica usuários nem posts.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Usuários (auth.users + auth.identities). O trigger
--    handle_new_user cria os profiles automaticamente.
-- ------------------------------------------------------------
do $$
declare
  uid1 uuid := gen_random_uuid();
  uid2 uuid := gen_random_uuid();
begin
  -- Fabiano
  if not exists (select 1 from auth.users where email = 'fabianof@coffeemaster.dev') then
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', uid1, 'authenticated', 'authenticated',
      'fabianof@coffeemaster.dev', crypt('CoffeeMaster123!', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object(
        'username','fabianof','name','Fabiano','surname','Freire',
        'image_profile','https://nyousefali.com.br/blog/profile/alex.png'
      ),
      '', '', '', ''
    );
    insert into auth.identities (
      id, provider_id, user_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), uid1::text, uid1,
      jsonb_build_object('sub', uid1::text, 'email', 'fabianof@coffeemaster.dev'),
      'email', now(), now(), now()
    );
  end if;

  -- João Eduardo
  if not exists (select 1 from auth.users where email = 'joaoeduardo@coffeemaster.dev') then
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', uid2, 'authenticated', 'authenticated',
      'joaoeduardo@coffeemaster.dev', crypt('CoffeeMaster123!', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object(
        'username','joaoeduardo','name','João Eduardo','surname','Miranda',
        'image_profile','https://nyousefali.com.br/blog/profile/ny.jpg'
      ),
      '', '', '', ''
    );
    insert into auth.identities (
      id, provider_id, user_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), uid2::text, uid2,
      jsonb_build_object('sub', uid2::text, 'email', 'joaoeduardo@coffeemaster.dev'),
      'email', now(), now(), now()
    );
  end if;
end $$;

-- Descrições dos perfis (o trigger cria o profile; aqui completamos)
update public.profiles
  set description = 'Especialista em cafés especiais e cafeicultura.'
  where username = 'fabianof';
update public.profiles
  set description = 'Entusiasta de tecnologia, fotografia e um bom espresso.'
  where username = 'joaoeduardo';

-- ------------------------------------------------------------
-- 2) Posts (migrados do SQLite). Só insere se ainda não houver posts.
-- ------------------------------------------------------------
insert into public.posts (user_id, date, image_url, category, title, resume, content, duration, views, status)
select p.id, d.date, d.image_url, d.category, d.title, d.resume, d.content, d.duration, d.views, d.status
from (values
  ('fabianof',    date '2022-05-22', 'https://nyousefali.com.br/blog/img/08.png', 'cinema',     'Cafeicultores Mineiros lideram - Prêmio Ernesto Illy', 'Resumo do post', 'Conteúdo do post', '5', 8, 1),
  ('fabianof',    date '2021-12-21', 'https://nyousefali.com.br/blog/img/08.png', 'cinema',     'O novo filme do Spider-Man', 'Resumo do post', 'Conteúdo do post', '7', 10, 1),
  ('fabianof',    date '2024-03-06', 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'tecnologia', 'Novo post', 'resumo do novo post', 'Conteudo do novo post', '5', 10, 1),
  ('joaoeduardo', date '2024-03-05', 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'fotografia', 'Post Teste', 'Resumo de post teste', 'post teste', '10', 10, 1),
  ('fabianof',    date '2024-03-06', 'https://cdn.pixabay.com/photo/2023/04/11/13/27/bird-7917250_1280.jpg', 'cinema',     'Testando post Elizeu', 'Teste de post Elizeu', 'testesteteste', '7', 10, 1)
) as d(username, date, image_url, category, title, resume, content, duration, views, status)
join public.profiles p on p.username = d.username
where not exists (select 1 from public.posts);
