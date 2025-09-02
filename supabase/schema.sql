-- Chess Authentication Database Schema
-- Run this SQL in your Supabase SQL editor to set up the required tables

-- Enable RLS on auth.users (should already be enabled)
-- ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  password_hash TEXT, -- Added for custom auth
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Chess scores table
CREATE TABLE IF NOT EXISTS public.chess_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  wins INTEGER DEFAULT 0 NOT NULL CHECK (wins >= 0),
  losses INTEGER DEFAULT 0 NOT NULL CHECK (losses >= 0),
  draws INTEGER DEFAULT 0 NOT NULL CHECK (draws >= 0),
  total_games INTEGER GENERATED ALWAYS AS (wins + losses + draws) STORED,
  win_rate DECIMAL GENERATED ALWAYS AS 
    (CASE WHEN (wins + losses + draws) > 0 
     THEN ROUND((wins::DECIMAL / (wins + losses + draws)) * 100, 2) 
     ELSE 0 END) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Chess games history (optional - for future features like game replay)
CREATE TABLE IF NOT EXISTS public.chess_games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  player_color TEXT CHECK (player_color IN ('white', 'black')) NOT NULL,
  result TEXT CHECK (result IN ('win', 'loss', 'draw')) NOT NULL,
  final_fen TEXT NOT NULL,
  moves_count INTEGER NOT NULL CHECK (moves_count >= 0),
  game_duration_seconds INTEGER CHECK (game_duration_seconds >= 0),
  ai_difficulty TEXT DEFAULT 'stockfish_depth_10',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chess_scores_user_id ON public.chess_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_chess_games_user_id ON public.chess_games(user_id);
CREATE INDEX IF NOT EXISTS idx_chess_games_created_at ON public.chess_games(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chess_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chess_games ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for chess_scores
CREATE POLICY "Users can view own scores" ON public.chess_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own scores" ON public.chess_scores
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scores" ON public.chess_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for chess_games
CREATE POLICY "Users can view own games" ON public.chess_games
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own games" ON public.chess_games
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_chess_scores_updated_at 
  BEFORE UPDATE ON public.chess_scores 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT ON public.user_profiles TO anon;
GRANT ALL ON public.user_profiles TO authenticated;

GRANT SELECT ON public.chess_scores TO anon;
GRANT ALL ON public.chess_scores TO authenticated;

GRANT SELECT ON public.chess_games TO anon;
GRANT ALL ON public.chess_games TO authenticated;