-- References feature — score saving.
-- Run this in the Supabase SQL Editor (in addition to schema.sql).

create table if not exists reference_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity text not null check (activity in ('guide', 'write_citation', 'hostile_judge')),
  score integer not null,
  total integer not null,
  created_at timestamptz default now()
);

alter table reference_progress enable row level security;

create policy "reference_progress: select own"
  on reference_progress for select
  using (auth.uid() = user_id);

create policy "reference_progress: insert own"
  on reference_progress for insert
  with check (auth.uid() = user_id);

create policy "reference_progress: admin select all"
  on reference_progress for select
  using (auth.jwt() ->> 'email' = 'Priscilla.photos@gmail.com');
