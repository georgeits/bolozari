-- Public wish wall for Class 2027.
-- Run this in Supabase SQL editor (or as a migration).

create table if not exists public.class_letters (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  message text not null check (char_length(message) between 1 and 600),
  created_at timestamptz not null default now()
);

alter table public.class_letters enable row level security;

-- Visitors can read all public letters (no login).
drop policy if exists "class_letters_select_public" on public.class_letters;
create policy "class_letters_select_public"
  on public.class_letters for select
  to anon, authenticated
  using (true);

-- Visitors can insert a letter (no login).
drop policy if exists "class_letters_insert_public" on public.class_letters;
create policy "class_letters_insert_public"
  on public.class_letters for insert
  to anon, authenticated
  with check (
    char_length(name) between 1 and 60
    and char_length(message) between 1 and 600
  );

-- No update/delete policies: visitors cannot modify or remove letters.

create index if not exists class_letters_created_at_idx
  on public.class_letters (created_at desc);
