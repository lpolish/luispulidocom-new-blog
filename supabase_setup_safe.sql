-- Create a table for public profiles (if it doesn't exist)
create table if not exists profiles (
  id uuid not null references auth.users on delete cascade,
  username text,
  rating integer default 1200,
  primary key (id)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Drop existing policies if they exist and recreate them
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create or replace the user creation function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if it exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create game enums (if they don't exist)
do $$ begin
  create type game_status as enum ('pending_request', 'active', 'completed', 'declined');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type game_type as enum ('ai', 'human');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type game_winner as enum ('white', 'black', 'draw');
exception
  when duplicate_object then null;
end $$;

-- Create games table (if it doesn't exist)
create table if not exists games (
  id uuid default gen_random_uuid() primary key,
  white_player_id uuid references profiles(id),
  black_player_id uuid references profiles(id),
  status game_status default 'pending_request',
  current_fen text default 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  pgn text default '',
  winner game_winner,
  game_type game_type default 'human',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for games table
alter table games enable row level security;

-- Drop existing policies if they exist and recreate them
drop policy if exists "Users can view their own games" on games;
drop policy if exists "Users can create games" on games;
drop policy if exists "Users can update their own games" on games;

-- Users can view games they are participating in
create policy "Users can view their own games" on games
  for select using (auth.uid() = white_player_id or auth.uid() = black_player_id);

-- Users can insert games where they are a player
create policy "Users can create games" on games
  for insert with check (auth.uid() = white_player_id or auth.uid() = black_player_id);

-- Users can update games they are participating in
create policy "Users can update their own games" on games
  for update using (auth.uid() = white_player_id or auth.uid() = black_player_id);

-- Create or replace the updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop existing trigger if it exists and recreate
drop trigger if exists on_games_updated on games;
create trigger on_games_updated
  before update on games
  for each row execute procedure public.handle_updated_at();

-- Try to enable realtime for games table (this might fail if already enabled)
do $$ begin
  alter publication supabase_realtime add table games;
exception
  when duplicate_object then null;
end $$;
