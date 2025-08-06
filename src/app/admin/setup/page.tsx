export default function DatabaseSetupPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Database Setup Instructions</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">🚀 Quick Setup</h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            <p className="font-semibold">Step 1: Go to Supabase Dashboard</p>
            <p className="text-sm mt-1">
              Visit <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">
                https://supabase.com/dashboard
              </a> and open your project.
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <p className="font-semibold">Step 2: Open SQL Editor</p>
            <p className="text-sm mt-1">
              Navigate to the "SQL Editor" in the left sidebar.
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            <p className="font-semibold">Step 3: Run the Setup SQL</p>
            <p className="text-sm mt-1">
              Copy and paste the contents of <code>supabase_setup.sql</code> into the SQL editor and run it.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">📋 SQL Schema Preview</h2>
        
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm">
{`-- Create a table for public profiles
create table profiles (
  id uuid not null references auth.users on delete cascade,
  username text,
  rating integer default 1200,
  primary key (id)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Auto-create profile trigger
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create game enums and table
create type game_status as enum ('pending_request', 'active', 'completed', 'declined');
create type game_type as enum ('ai', 'human');
create type game_winner as enum ('white', 'black', 'draw');

create table games (
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

-- Games table RLS and policies
alter table games enable row level security;

create policy "Users can view their own games" on games
  for select using (auth.uid() = white_player_id or auth.uid() = black_player_id);

create policy "Users can create games" on games
  for insert with check (auth.uid() = white_player_id or auth.uid() = black_player_id);

create policy "Users can update their own games" on games
  for update using (auth.uid() = white_player_id or auth.uid() = black_player_id);

-- Enable realtime
alter publication supabase_realtime add table games;`}
          </pre>
        </div>
      </div>
      
      <div className="mt-6 space-x-4">
        <a 
          href="/admin" 
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Test Database Connection
        </a>
        <a 
          href="/chess" 
          className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Go to Chess
        </a>
      </div>
    </div>
  );
}
