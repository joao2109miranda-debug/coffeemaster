# Coffee Master — Migração SQLite → Supabase + Deploy Vercel

**Data:** 2026-07-10
**Status:** Aprovado

## Objetivo

Remover toda a dependência do banco local (SQLite) e do servidor Express, migrar
dados e autenticação para o **Supabase**, limpar código morto e preparar o app
para deploy estático na **Vercel**. Sem redesign visual — mantém a aparência atual.

Adicionalmente, entregar duas features novas que hoje não existem:
- **Avaliação por estrela anônima** (1 voto por navegador).
- **Comentários anônimos** por post.

## Abordagem escolhida

**Cliente conversa direto com o Supabase.** O servidor Express é removido por
completo. O app React (CRA) usa `@supabase/supabase-js` diretamente: Supabase Auth
para login e `supabase.from(...)` para dados, protegido por Row-Level Security (RLS).
Deploy como build estático na Vercel. A `publishable key` é pública por design.

## Modelo de dados (Postgres / Supabase)

- `auth.users` — gerenciada pelo Supabase (email + senha).
- `public.profiles` — `id uuid PK` (= auth.users.id), `username`, `name`, `surname`,
  `description`, `image_profile`. Trigger cria a linha ao criar o usuário.
- `public.posts` — `id bigint PK`, `user_id uuid FK→profiles`, `date`, `image_url`,
  `category`, `title`, `resume`, `content`, `duration`, `views int`, `status int`.
  (Coluna antiga `star` é **removida** — nota real vem de `ratings`.)
- `public.ratings` — `id bigint PK`, `post_id bigint FK→posts`, `rating int (1..5)`,
  `voter_id text`, `created_at`. **UNIQUE (post_id, voter_id)** → 1 voto/navegador.
- `public.comments` — `id bigint PK`, `post_id bigint FK→posts`, `author_name text`
  (default 'Anônimo'), `content text NOT NULL`, `status int default 1`, `created_at`.
- View `public.post_rating_summary(post_id, avg_rating, votes_count)` — pública.

### RLS

- `profiles`: SELECT público; UPDATE apenas pelo dono (`auth.uid() = id`).
- `posts`: SELECT público; INSERT autenticado com `auth.uid() = user_id`.
- `ratings`: SELECT público; INSERT anônimo permitido (upsert em post_id+voter_id).
- `comments`: SELECT público (status=1); INSERT anônimo permitido.

## Mudanças no cliente (React)

- **Novo** `src/services/supabase.js` — client via env vars
  `REACT_APP_SUPABASE_URL` / `REACT_APP_SUPABASE_ANON_KEY`.
- **Remover** `src/services/api.js` (axios).
- `Context`/`Provider`/`Header` → sessão do Supabase (`onAuthStateChange`) no lugar de
  `token`/`idUser` no `sessionStorage`.
- `Login` → `supabase.auth.signInWithPassword` (email/senha).
- `Home`/`Card`/`CardAllPosts`/`AllPosts`/`Posts` → `supabase.from('posts')` com join
  em `profiles`.
- `Profile` → `supabase.from('posts').insert`.
- **Novos componentes** na página do Post: `StarRating` (média + widget de voto) e
  `Comments` (lista + formulário anônimo).

## Setup do banco

Scripts SQL prontos em `supabase/` rodados no SQL Editor do Supabase:
- `schema.sql` — tabelas, view, RLS, trigger de profile.
- `seed.sql` — cria os 2 usuários (senha via `pgcrypto`, temporárias), profiles e 5 posts.

## Estrutura / Deploy

- Mover o app React de `client/` para a **raiz** do repositório.
- **Apagar:** `server/`, `deleteHash.js`, `.sql`/`.sqlite` antigos, deps mortas
  (`axios`, `mysql`, `mongoose`, `cors`, `crypto-js`, `crypto-md5`, `react-script-tag`,
  `babel-runtime`).
- `vercel.json` com rewrite de SPA.
- Env vars na Vercel: `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`.

## Fora de escopo

- Redesign visual.
- Recuperação das senhas bcrypt antigas (impossível; senhas temporárias novas).
- Anti-spam/rate-limiting robusto em comentários anônimos.
