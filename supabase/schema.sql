-- Portfolio schema — run in Supabase Dashboard → SQL Editor.
-- Projects (managed from admin), a single settings row for the homepage
-- profile picture, and contact-form messages.

-- ─────────────────────────── projects ───────────────────────────
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  demo_url    text,
  repo_url    text,
  tech        text[] not null default '{}',
  image_url   text,
  created_at  timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read"
  on public.projects for select using (true);

drop policy if exists "projects_authed_write" on public.projects;
create policy "projects_authed_write"
  on public.projects for all to authenticated
  using (true) with check (true);

-- ─────────────────────────── settings ───────────────────────────
-- Single-row table (id = true) holding site-wide bits: the homepage
-- profile picture.
create table if not exists public.settings (
  id                boolean primary key default true,
  profile_image_url text,
  updated_at        timestamptz not null default now(),
  constraint settings_singleton check (id)
);

-- Backfill the column for databases created before it was added.
alter table public.settings add column if not exists profile_image_url text;

insert into public.settings (id)
values (true)
on conflict (id) do nothing;

alter table public.settings enable row level security;

drop policy if exists "settings_public_read" on public.settings;
create policy "settings_public_read"
  on public.settings for select using (true);

drop policy if exists "settings_authed_write" on public.settings;
create policy "settings_authed_write"
  on public.settings for update to authenticated
  using (true) with check (true);

-- ─────────────────────────── messages ───────────────────────────
-- Contact-form submissions. Anonymous visitors may insert only.
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

drop policy if exists "messages_public_insert" on public.messages;
create policy "messages_public_insert"
  on public.messages for insert to anon, authenticated
  with check (true);

drop policy if exists "messages_authed_read" on public.messages;
create policy "messages_authed_read"
  on public.messages for select to authenticated using (true);

-- ─────────────────────── storage (project images) ───────────────────────
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "project_images_public_read" on storage.objects;
create policy "project_images_public_read"
  on storage.objects for select
  using (bucket_id = 'project-images');

drop policy if exists "project_images_authed_write" on storage.objects;
create policy "project_images_authed_write"
  on storage.objects for all to authenticated
  using (bucket_id = 'project-images')
  with check (bucket_id = 'project-images');

-- ─────────────────────── storage (site assets) ───────────────────────
-- Homepage profile picture.
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

drop policy if exists "site_assets_public_read" on storage.objects;
create policy "site_assets_public_read"
  on storage.objects for select
  using (bucket_id = 'site-assets');

drop policy if exists "site_assets_authed_write" on storage.objects;
create policy "site_assets_authed_write"
  on storage.objects for all to authenticated
  using (bucket_id = 'site-assets')
  with check (bucket_id = 'site-assets');
