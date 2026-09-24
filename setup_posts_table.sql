-- Recrea la tabla "posts" que espera el codigo (app/lib/supabase/types.ts)

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  category text,
  image_url text,
  video_url text,
  published boolean not null default true,
  author_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_slug_idx on public.posts (slug);

-- Habilita RLS
alter table public.posts enable row level security;

-- El admin de este sitio NO usa Supabase Auth (usa credenciales por variables de entorno),
-- asi que todas las operaciones llegan con la anon key. Politicas permisivas:

create policy "Public read published posts"
  on public.posts for select
  using (true);

create policy "Anon can insert posts"
  on public.posts for insert
  with check (true);

create policy "Anon can update posts"
  on public.posts for update
  using (true)
  with check (true);

create policy "Anon can delete posts"
  on public.posts for delete
  using (true);

-- Bucket de Storage para imagenes/videos de posts
insert into storage.buckets (id, name, public)
values ('posts-images', 'posts-images', true)
on conflict (id) do nothing;

create policy "Public read posts-images"
  on storage.objects for select
  using (bucket_id = 'posts-images');

create policy "Anon can upload posts-images"
  on storage.objects for insert
  with check (bucket_id = 'posts-images');
