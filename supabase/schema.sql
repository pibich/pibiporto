-- Portfolio schema — run in Supabase Dashboard → SQL Editor.
-- Matches the design handoff: projects (managed from admin), a single settings
-- row for the boosting open/close status, and contact-form messages.

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
-- Single-row table (id = true) holding site-wide bits: the boosting
-- open/close status and the homepage profile picture.
create table if not exists public.settings (
  id                boolean primary key default true,
  boosting_open     boolean not null default true,
  profile_image_url text,
  updated_at        timestamptz not null default now(),
  constraint settings_singleton check (id)
);

-- Backfill the column for databases created before it was added.
alter table public.settings add column if not exists profile_image_url text;

insert into public.settings (id, boosting_open)
values (true, true)
on conflict (id) do nothing;

alter table public.settings enable row level security;

drop policy if exists "settings_public_read" on public.settings;
create policy "settings_public_read"
  on public.settings for select using (true);

drop policy if exists "settings_authed_write" on public.settings;
create policy "settings_authed_write"
  on public.settings for update to authenticated
  using (true) with check (true);

-- ─────────────────────────── games (joki) ───────────────────────────
-- The boosting service game list, managed from the admin page.
create table if not exists public.games (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  tags       text[] not null default '{}',
  image_url  text,
  created_at timestamptz not null default now()
);

alter table public.games enable row level security;

drop policy if exists "games_public_read" on public.games;
create policy "games_public_read"
  on public.games for select using (true);

drop policy if exists "games_authed_write" on public.games;
create policy "games_authed_write"
  on public.games for all to authenticated
  using (true) with check (true);

-- ─────────────────────────── testimonials ───────────────────────────
-- Screenshot testimonials shown on the boosting page, managed from admin.
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  image_url  text not null,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "testimonials_public_read" on public.testimonials;
create policy "testimonials_public_read"
  on public.testimonials for select using (true);

drop policy if exists "testimonials_authed_write" on public.testimonials;
create policy "testimonials_authed_write"
  on public.testimonials for all to authenticated
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
-- Profile picture, game banners, and testimonial screenshots.
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
