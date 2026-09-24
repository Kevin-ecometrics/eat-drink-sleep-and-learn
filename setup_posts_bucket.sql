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
