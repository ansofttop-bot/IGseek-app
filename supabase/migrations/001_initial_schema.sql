-- IGseek Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Custom types
create type app_role as enum ('admin', 'user');

-- Profiles
create table public.profiles (
  user_id uuid primary key references auth.users on delete cascade,
  username text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = user_id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = user_id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = user_id);

grant select, insert, update on public.profiles to authenticated;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, username)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- User roles
create table public.user_roles (
  user_id uuid references auth.users on delete cascade,
  role app_role not null default 'user',
  primary key (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
end;
$$ language plpgsql security definer;

grant execute on function public.has_role(uuid, app_role) to authenticated;

-- Conversations
create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null default 'Новый чат',
  agent text not null default 'expert',
  updated_at timestamptz default now()
);

alter table public.conversations enable row level security;

create policy "Users can CRUD own conversations" on public.conversations
  for all using (auth.uid() = user_id);

grant select, insert, update, delete on public.conversations to authenticated;

-- Messages
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations on delete cascade,
  role text not null,
  content text not null default '',
  agent text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "Users can read messages in own conversations" on public.messages
  for select using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

create policy "Users can insert messages in own conversations" on public.messages
  for insert with check (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

grant select, insert, update, delete on public.messages to authenticated;

-- Devices
create table public.devices (
  device_id text primary key,
  user_id uuid not null references auth.users on delete cascade,
  created_at timestamptz default now()
);

alter table public.devices enable row level security;

create policy "Users can manage own devices" on public.devices
  for all using (auth.uid() = user_id);

grant select, insert on public.devices to authenticated;

create or replace function public.claim_device(_device_id text)
returns boolean as $$
declare
  existing_user uuid;
begin
  select user_id into existing_user
  from public.devices
  where device_id = _device_id;

  if existing_user is not null then
    if existing_user = auth.uid() then
      return true;
    else
      return false;
    end if;
  end if;

  insert into public.devices (device_id, user_id)
  values (_device_id, auth.uid());

  return true;
end;
$$ language plpgsql security definer;

grant execute on function public.claim_device(text) to authenticated;

-- Subscriptions
create table public.subscriptions (
  user_id uuid primary key references auth.users on delete cascade,
  status text not null default 'inactive',
  expires_at timestamptz,
  source text not null default 'none'
);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

grant select on public.subscriptions to authenticated;
grant insert, update on public.subscriptions to service_role;

-- Free slots
create table public.free_slots (
  user_id uuid primary key references auth.users on delete cascade,
  taken_at timestamptz default now()
);

alter table public.free_slots enable row level security;

create policy "Anyone can read free_slots count" on public.free_slots
  for select using (true);

grant select, insert on public.free_slots to authenticated;

-- System prompts (singleton row)
create table public.system_prompts (
  id int primary key default 1,
  content jsonb not null default '{}'::jsonb
);

alter table public.system_prompts enable row level security;

create policy "Anyone can read system prompts" on public.system_prompts
  for select using (true);

grant select, update on public.system_prompts to authenticated;
grant insert, update on public.system_prompts to service_role;

-- Insert default system prompt
insert into public.system_prompts (id, content)
values (1, jsonb_build_object(
  'system', 'Ты — IGseek, AI-ассистент, созданный командой IGseek TECH.'
))
on conflict (id) do nothing;

-- Realtime
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.messages;
