-- The Docket — prototype schema
-- Run this in Supabase SQL Editor after creating your project.

-- 1. PROFILES ---------------------------------------------------------------
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code_name text not null,
  student_number integer not null,
  name text,
  gender text,
  experience_level text,
  goal text,
  notes text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "profiles: select own"
  on profiles for select
  using (auth.uid() = user_id);

create policy "profiles: insert own"
  on profiles for insert
  with check (auth.uid() = user_id);

create policy "profiles: update own"
  on profiles for update
  using (auth.uid() = user_id);

-- Admin can read every profile (for the admin view)
create policy "profiles: admin select all"
  on profiles for select
  using (auth.jwt() ->> 'email' = 'Priscilla.photos@gmail.com');

-- 2. MOOTS -------------------------------------------------------------------
create table if not exists moots (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  facts text not null,
  issues text not null,
  type text not null default 'general',
  created_at timestamptz default now()
);

alter table moots enable row level security;

create policy "moots: public read"
  on moots for select
  using (true);

-- Seed the one General Moot
insert into moots (title, facts, issues, type)
values (
  'Geoffrey Smith (General Moot)',
  'Geoffrey Smith, a mid-level manager at Alden Freight Ltd, was dismissed after a workplace investigation concluded he had falsified expense reports over an 8-month period. Smith contends the investigation was procedurally unfair: he was not shown the full evidence against him, was given only 24 hours to respond, and the investigating officer was a close friend of the employee who first reported him. Alden Freight maintains the dismissal was substantively justified given the weight of documentary evidence, and that the process, while imperfect, met the minimum standard required by law. Smith has brought a claim for wrongful/unfair dismissal.',
  '1. Whether the investigation and disciplinary process afforded Smith a fair opportunity to respond. 2. Whether the alleged conflict of interest on the part of the investigating officer vitiates the process. 3. Whether, even if the process was flawed, the dismissal was substantively justified on the evidence. 4. What remedy, if any, Smith is entitled to.',
  'general'
)
on conflict do nothing;

-- 3. SUBMISSIONS --------------------------------------------------------------
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  moot_id uuid not null references moots(id),
  draft_stage text not null check (draft_stage in ('first', 'final')),
  memorial_text text not null,
  feedback_text text,
  created_at timestamptz default now()
);

alter table submissions enable row level security;

create policy "submissions: select own"
  on submissions for select
  using (auth.uid() = user_id);

create policy "submissions: insert own"
  on submissions for insert
  with check (auth.uid() = user_id);

create policy "submissions: admin select all"
  on submissions for select
  using (auth.jwt() ->> 'email' = 'Priscilla.photos@gmail.com');

-- NOTE: the /api/assess route inserts submissions using the SERVICE ROLE key
-- (server-side only), so it bypasses RLS entirely for the insert itself.
-- The policies above govern what the browser (anon key + user session) can read.
