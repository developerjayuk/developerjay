-- posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null default '',
  cover_image_url text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_tags_gin_idx on public.posts using gin (tags);
create index if not exists posts_status_idx on public.posts (status);

-- keep updated_at current on every write
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- RLS
alter table public.posts enable row level security;

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts"
  on public.posts for select
  using (status = 'published');

drop policy if exists "admin full access" on public.posts;
create policy "admin full access"
  on public.posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- base table privileges — RLS policies above only restrict *rows*; Postgres still requires
-- these grants before a role can query the table at all (service_role bypasses RLS itself via
-- its role attribute, but still needs the base grant to be queryable through PostgREST).
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on public.posts to authenticated, service_role;
grant select on public.posts to anon;

-- storage bucket for post images
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

drop policy if exists "public read post images" on storage.objects;
create policy "public read post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

drop policy if exists "admin write post images" on storage.objects;
create policy "admin write post images"
  on storage.objects for insert
  with check (bucket_id = 'post-images' and auth.role() = 'authenticated');

drop policy if exists "admin update post images" on storage.objects;
create policy "admin update post images"
  on storage.objects for update
  using (bucket_id = 'post-images' and auth.role() = 'authenticated');

drop policy if exists "admin delete post images" on storage.objects;
create policy "admin delete post images"
  on storage.objects for delete
  using (bucket_id = 'post-images' and auth.role() = 'authenticated');
