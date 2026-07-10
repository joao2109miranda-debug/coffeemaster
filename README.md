# Coffee Master

Blog/site institucional do Coffee Master. Frontend em React (Create React App)
conversando **direto com o Supabase** (Auth + Postgres, protegido por RLS).
Não há mais servidor Express nem banco SQLite — pronto para deploy estático na Vercel.

## Stack

- **React 18** + React Router (CRA)
- **Supabase** (`@supabase/supabase-js`) — autenticação e dados
- Deploy: **Vercel** (build estático)

## Configuração local

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie o arquivo `.env.local` a partir do exemplo e preencha com as credenciais
   do seu projeto Supabase (a *publishable key*):
   ```bash
   cp .env.example .env.local
   ```
   ```
   REACT_APP_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=sua-publishable-key
   ```
3. Rode em desenvolvimento:
   ```bash
   npm start
   ```

## Banco de dados (Supabase)

Os scripts SQL ficam em [`supabase/`](supabase/). No **SQL Editor** do Supabase, rode
na ordem:

1. `supabase/schema.sql` — tabelas (`profiles`, `posts`, `ratings`, `comments`),
   a view `post_rating_summary`, políticas de RLS e o trigger que cria o profile.
2. `supabase/seed.sql` — cria os 2 usuários de exemplo e migra os 5 posts.

Usuários de exemplo (senhas **temporárias** — troque depois):

| E-mail                        | Senha              |
|-------------------------------|--------------------|
| fabianof@coffeemaster.dev     | `CoffeeMaster123!` |
| joaoeduardo@coffeemaster.dev  | `CoffeeMaster123!` |

## Funcionalidades

- Blog com posts e autores (perfis).
- Login (Supabase Auth) e criação de posts por usuários autenticados.
- **Avaliação por estrela anônima** (1 voto por navegador, via `localStorage`).
- **Comentários anônimos** por post.

## Deploy na Vercel

1. Importe o repositório na Vercel (framework detectado: Create React App).
2. Em **Settings > Environment Variables**, configure:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
3. Deploy. O `vercel.json` já cuida do roteamento SPA (deep links).
