create extension if not exists "pgcrypto";

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text default '',
  vote_clear timestamptz not null default now(),
  restrict_control boolean not null default false,
  show_votes boolean not null default false,
  owner uuid,
  banned uuid[] not null default '{}',
  created timestamptz not null default now(),
  updated timestamptz not null default now()
);

create table public.users_public (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar text,
  vote text,
  vote_time timestamptz,
  room uuid references public.rooms(id) on delete set null,
  created timestamptz not null default now(),
  updated timestamptz not null default now()
);

alter table public.rooms
  add constraint rooms_owner_fkey
  foreign key (owner) references public.users_public(id) on delete set null;

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author uuid references public.users_public(id) on delete set null,
  content text not null,
  tags jsonb not null default '[]'::jsonb,
  replies jsonb not null default '[]'::jsonb,
  likes uuid[] not null default '{}',
  created timestamptz not null default now(),
  updated timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  author text,
  content text,
  created timestamptz not null default now(),
  updated timestamptz not null default now()
);

create table public.donators (
  id uuid primary key default gen_random_uuid(),
  user uuid references public.users_public(id) on delete set null,
  amount numeric,
  stripe_id text,
  created timestamptz not null default now(),
  updated timestamptz not null default now()
);

create table public.featured_donators (
  id uuid primary key default gen_random_uuid(),
  name text,
  link text,
  rank integer,
  created timestamptz not null default now(),
  updated timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated = now();
  return new;
end;
$$ language plpgsql;

create trigger rooms_set_updated
before update on public.rooms
for each row execute procedure public.set_updated_at();

create trigger users_public_set_updated
before update on public.users_public
for each row execute procedure public.set_updated_at();

create trigger posts_set_updated
before update on public.posts
for each row execute procedure public.set_updated_at();

create trigger announcements_set_updated
before update on public.announcements
for each row execute procedure public.set_updated_at();

create trigger donators_set_updated
before update on public.donators
for each row execute procedure public.set_updated_at();

create trigger featured_donators_set_updated
before update on public.featured_donators
for each row execute procedure public.set_updated_at();

-- Create a matching public profile row whenever an auth user is created.
-- This is required because the app uses `users_public` as the canonical profile table.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users_public (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- App cleanup helper (rooms older than 24h).
-- You can schedule this function using Supabase scheduling features (or pg_cron if available).
create or replace function public.delete_old_rooms()
returns void as $$
begin
  delete from public.rooms
  where updated < now() - interval '24 hours';
end;
$$ language plpgsql;

alter table public.rooms enable row level security;
alter table public.users_public enable row level security;
alter table public.posts enable row level security;
alter table public.announcements enable row level security;
alter table public.donators enable row level security;
alter table public.featured_donators enable row level security;

create policy rooms_select on public.rooms
  for select using (true);
create policy rooms_insert on public.rooms
  for insert with check (auth.uid() is not null and owner = auth.uid());
create policy rooms_update on public.rooms
  for update using (auth.uid() is not null) with check (auth.uid() is not null and owner = auth.uid());

create policy users_public_select on public.users_public
  for select using (true);
create policy users_public_insert on public.users_public
  for insert with check (auth.uid() = id);
create policy users_public_update on public.users_public
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy posts_select on public.posts
  for select using (true);
create policy posts_insert on public.posts
  for insert with check (auth.uid() is not null);
create policy posts_update on public.posts
  for update using (auth.uid() is not null) with check (auth.uid() is not null);

create policy announcements_select on public.announcements
  for select using (true);

create policy donators_select on public.donators
  for select using (true);
create policy donators_insert on public.donators
  for insert with check (auth.uid() is not null);

create policy featured_donators_select on public.featured_donators
  for select using (true);
