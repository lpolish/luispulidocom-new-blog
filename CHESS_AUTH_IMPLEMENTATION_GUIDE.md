# Chess Authentication Implementation Guide

## Project Overview

This guide outlines the implementation of a comprehensive authentication system for the chess page, enabling users to create accounts, authenticate securely, and persist their chess scores across sessions.

## Goals

1. **User Account Management**: Allow users to create free accounts with email verification
2. **Score Persistence**: Store and retrieve chess game statistics across sessions
3. **Security**: Implement proper authentication flows and prevent system abuse
4. **Scalability**: Build foundation for future user-centric features
5. **User Experience**: Seamless authentication without disrupting chess gameplay

## Current State Analysis

### Existing Components
- ✅ Chess game functionality with `useChessGame` hook
- ✅ Local score tracking with `useLocalScores` hook
- ✅ Chess UI components (ChessBoard, GameStatus, ScoreBoard)
- ✅ Basic API route structure
- ✅ Next.js 14 app router setup

### Current Score System
- Stores scores in `localStorage` as `chessScores`
- Tracks wins, losses, and draws
- No user persistence or cross-device sync

## Implementation Status

### ✅ Completed Tasks

1. **Project Documentation** - Comprehensive implementation guide created
2. **Database Provider Selection** - Chosen Supabase with PostgreSQL + RLS
3. **Authentication System** - Supabase Auth with email verification implemented
4. **API Routes** - Chess scores, migration, and auth callback endpoints created
5. **Database Integration** - Updated chess hooks to work with authentication
6. **UI Components** - AuthModal and updated chess page with auth state
7. **Basic Security** - Rate limiting, input validation, and abuse prevention

### 🔄 In Progress

- **Abuse Prevention** - Rate limiting and validation implemented, email verification needs testing
- **Testing & Deployment** - Setup instructions created, needs live testing

### 📋 Next Steps (To Continue Implementation)

1. **Set up Supabase Project**
   - Create account at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase/schema.sql`
   - Configure authentication settings
   - Get API keys and add to `.env.local`

2. **Test Authentication Flow**
   - Test user registration and email verification
   - Test login/logout functionality
   - Test score persistence and migration
   - Verify rate limiting works

3. **Production Deployment**
   - Update Supabase auth settings with production URLs
   - Set environment variables in deployment platform
   - Test in production environment

4. **Additional Features** (Future Enhancements)
   - Social authentication (Google, GitHub)
   - User profiles and avatars
   - Game history and replay
   - Leaderboards and tournaments

## Quick Start Commands

```bash
# Install dependencies (already done)
pnpm install

# Copy environment template
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# NEXT_PUBLIC_SUPABASE_URL=your_project_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Files Created/Modified

### New Files
- `src/lib/supabase/client.ts` - Browser Supabase client
- `src/lib/supabase/server.ts` - Server Supabase client  
- `src/contexts/AuthContext.tsx` - Authentication context provider
- `src/hooks/useChessScores.ts` - Database-integrated scores hook
- `src/components/auth/AuthModal.tsx` - Login/register modal
- `src/app/api/chess/scores/route.ts` - Chess scores API
- `src/app/api/chess/scores/migrate/route.ts` - Score migration API
- `src/app/auth/callback/route.ts` - Auth callback handler
- `src/lib/rate-limit.ts` - Rate limiting utilities
- `src/lib/validation.ts` - Input validation schemas
- `supabase/schema.sql` - Database schema
- `.env.example` - Environment variables template
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide

### Modified Files
- `src/app/layout.tsx` - Added AuthProvider
- `src/app/chess/page.tsx` - Integrated authentication
- `src/app/api/chess/callback/route.ts` - Updated for Supabase
- `README.md` - Added authentication documentation

## Current Implementation Status

### Phase 1: Database Setup and Provider Selection

#### Option A: Supabase (Recommended)
**Pros:**
- Built-in authentication with email verification
- Real-time capabilities for future features
- PostgreSQL with excellent Next.js integration
- Free tier with generous limits
- Built-in RLS (Row Level Security)

**Cons:**
- Learning curve for Supabase-specific features
- Vendor lock-in

#### Option B: Neon + NextAuth.js
**Pros:**
- Pure PostgreSQL with familiar SQL
- NextAuth.js flexibility for multiple providers
- Serverless PostgreSQL scaling

**Cons:**
- More configuration required
- Need to implement email verification separately

**Recommendation: Supabase** for faster implementation and built-in auth features.

### Phase 2: Database Schema Design

```sql
-- Users table (handled by Supabase Auth)
-- auth.users table is automatically created

-- User profiles table
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Chess scores table
CREATE TABLE public.chess_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  wins INTEGER DEFAULT 0 NOT NULL,
  losses INTEGER DEFAULT 0 NOT NULL,
  draws INTEGER DEFAULT 0 NOT NULL,
  total_games INTEGER GENERATED ALWAYS AS (wins + losses + draws) STORED,
  win_rate DECIMAL GENERATED ALWAYS AS 
    (CASE WHEN (wins + losses + draws) > 0 
     THEN ROUND((wins::DECIMAL / (wins + losses + draws)) * 100, 2) 
     ELSE 0 END) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Chess games history (optional - for future features)
CREATE TABLE public.chess_games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  player_color TEXT CHECK (player_color IN ('white', 'black')) NOT NULL,
  result TEXT CHECK (result IN ('win', 'loss', 'draw')) NOT NULL,
  final_fen TEXT NOT NULL,
  moves_count INTEGER NOT NULL,
  game_duration_seconds INTEGER,
  ai_difficulty TEXT DEFAULT 'stockfish_depth_10',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security policies
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
```

### Phase 3: Environment Setup

```bash
# Install required dependencies
pnpm add @supabase/ssr @supabase/supabase-js
pnpm add -D @types/node

# For alternative NextAuth.js setup
# pnpm add next-auth @auth/prisma-adapter prisma @prisma/client
# pnpm add @neon/serverless
```

### Phase 4: Authentication Implementation

#### Supabase Client Setup

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle SSR cookie setting errors
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle SSR cookie removal errors
          }
        },
      },
    }
  )
}
```

#### Authentication Hook

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect, createContext, useContext } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{error?: string}>
  signUp: (email: string, password: string) => Promise<{error?: string}>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{error?: string}>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### Phase 5: API Routes for Chess Integration

```typescript
// src/app/api/chess/scores/route.ts
import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: scores, error } = await supabase
    .from('chess_scores')
    .select('wins, losses, draws, total_games, win_rate')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json(scores || { wins: 0, losses: 0, draws: 0 })
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { result, gameData } = body // result: 'win' | 'loss' | 'draw'

  // Update or insert chess scores
  const { data: existingScores } = await supabase
    .from('chess_scores')
    .select('wins, losses, draws')
    .eq('user_id', user.id)
    .single()

  const newScores = existingScores || { wins: 0, losses: 0, draws: 0 }
  
  if (result === 'win') newScores.wins += 1
  else if (result === 'loss') newScores.losses += 1
  else if (result === 'draw') newScores.draws += 1

  const { data: updatedScores, error } = await supabase
    .from('chess_scores')
    .upsert({
      user_id: user.id,
      ...newScores
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to update scores' }, { status: 500 })
  }

  // Optionally save game history
  if (gameData) {
    await supabase.from('chess_games').insert({
      user_id: user.id,
      player_color: gameData.playerColor,
      result,
      final_fen: gameData.fen,
      moves_count: gameData.movesCount,
      game_duration_seconds: gameData.duration
    })
  }

  return NextResponse.json(updatedScores)
}
```

### Phase 6: Updated Chess Hooks

```typescript
// src/hooks/useChessScores.ts
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

export interface ChessScores {
  wins: number
  losses: number
  draws: number
  totalGames?: number
  winRate?: number
}

export function useChessScores() {
  const { user } = useAuth()
  const [scores, setScores] = useState<ChessScores>({ wins: 0, losses: 0, draws: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  // Load scores (from API if authenticated, localStorage if not)
  useEffect(() => {
    loadScores()
  }, [user])

  const loadScores = useCallback(async () => {
    if (user) {
      // Load from database
      try {
        const response = await fetch('/api/chess/scores')
        if (response.ok) {
          const data = await response.json()
          setScores(data)
        }
      } catch (error) {
        console.error('Failed to load scores from database:', error)
        // Fallback to localStorage
        loadLocalScores()
      }
    } else {
      // Load from localStorage
      loadLocalScores()
    }
    setIsLoaded(true)
  }, [user])

  const loadLocalScores = () => {
    try {
      const savedScores = localStorage.getItem('chessScores')
      if (savedScores) {
        setScores(JSON.parse(savedScores))
      }
    } catch (error) {
      console.error('Error loading local scores:', error)
    }
  }

  const updateScores = useCallback(async (result: 'win' | 'loss' | 'draw', gameData?: any) => {
    if (user) {
      // Update in database
      try {
        const response = await fetch('/api/chess/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ result, gameData })
        })
        
        if (response.ok) {
          const updatedScores = await response.json()
          setScores(updatedScores)
          return
        }
      } catch (error) {
        console.error('Failed to update scores in database:', error)
      }
    }

    // Fallback to localStorage update
    const newScores = {
      wins: result === 'win' ? scores.wins + 1 : scores.wins,
      losses: result === 'loss' ? scores.losses + 1 : scores.losses,
      draws: result === 'draw' ? scores.draws + 1 : scores.draws
    }
    
    setScores(newScores)
    
    if (!user) {
      localStorage.setItem('chessScores', JSON.stringify(newScores))
    }
  }, [user, scores])

  const resetScores = useCallback(async () => {
    const resetData = { wins: 0, losses: 0, draws: 0 }
    
    if (user) {
      // Reset in database
      try {
        const response = await fetch('/api/chess/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reset: true })
        })
        
        if (response.ok) {
          setScores(resetData)
          return
        }
      } catch (error) {
        console.error('Failed to reset scores in database:', error)
      }
    }

    // Fallback to localStorage reset
    setScores(resetData)
    localStorage.setItem('chessScores', JSON.stringify(resetData))
  }, [user])

  return {
    scores,
    updateScores,
    resetScores,
    isLoaded,
    isAuthenticated: !!user
  }
}
```

### Phase 7: UI Components

#### Authentication Modal
```typescript
// src/components/auth/AuthModal.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const { signIn, signUp, resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error)
        } else {
          onClose()
        }
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          return
        }
        const { error } = await signUp(email, password)
        if (error) {
          setError(error)
        } else {
          setMessage('Check your email for verification link!')
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email)
        if (error) {
          setError(error)
        } else {
          setMessage('Password reset email sent!')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">
          {mode === 'signin' && 'Sign In'}
          {mode === 'signup' && 'Create Account'}
          {mode === 'reset' && 'Reset Password'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          
          {mode !== 'reset' && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          )}
          
          {mode === 'signup' && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          )}
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 
             mode === 'signin' ? 'Sign In' :
             mode === 'signup' ? 'Create Account' : 'Send Reset Email'}
          </button>
        </form>
        
        <div className="mt-4 text-sm text-center">
          {mode === 'signin' && (
            <>
              <button onClick={() => setMode('signup')} className="text-blue-500 hover:underline">
                Don't have an account? Sign up
              </button>
              <br />
              <button onClick={() => setMode('reset')} className="text-blue-500 hover:underline">
                Forgot password?
              </button>
            </>
          )}
          {mode === 'signup' && (
            <button onClick={() => setMode('signin')} className="text-blue-500 hover:underline">
              Already have an account? Sign in
            </button>
          )}
          {mode === 'reset' && (
            <button onClick={() => setMode('signin')} className="text-blue-500 hover:underline">
              Back to sign in
            </button>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
    </div>
  )
}
```

### Phase 8: Updated Chess Page

```typescript
// src/app/chess/page.tsx - Updates
import { useAuth } from '@/hooks/useAuth'
import { useChessScores } from '@/hooks/useChessScores'
import AuthModal from '@/components/auth/AuthModal'

export default function ChessPage() {
  const { user, signOut } = useAuth()
  const { gameState, makePlayerMove, resetGame, apiError, playerIsWhite } = useChessGame()
  const { scores, updateScores, resetScores, isLoaded, isAuthenticated } = useChessScores()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Add authentication status to the header
  const AuthSection = () => (
    <div className="flex items-center gap-4 mb-4">
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-textMuted">Welcome, {user.email}</span>
          <button
            onClick={signOut}
            className="text-sm text-blue-500 hover:underline"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-textMuted mb-2">
            Sign in to save your scores across devices!
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign In / Create Account
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Add AuthSection to header */}
      <AuthSection />
      
      {/* Existing chess game content */}
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  )
}
```

### Phase 9: Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# For email verification (if using custom SMTP)
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password

# For rate limiting (optional)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### Phase 10: Abuse Prevention

1. **Email Verification**: Required for account activation
2. **Rate Limiting**: Limit account creation and API calls
3. **CAPTCHA**: Add reCAPTCHA for registration (already have dependency)
4. **Input Validation**: Comprehensive validation on all inputs
5. **Session Management**: Proper session timeouts and security

```typescript
// src/lib/rate-limit.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function rateLimit(identifier: string, limit: number, window: number) {
  const key = `rate_limit:${identifier}`
  const current = await redis.incr(key)
  
  if (current === 1) {
    await redis.expire(key, window)
  }
  
  return {
    success: current <= limit,
    remaining: Math.max(0, limit - current),
    reset: Date.now() + window * 1000
  }
}
```

## Migration Strategy

### 1. Database Migration from localStorage
```typescript
// src/lib/migrateLocalScores.ts
export async function migrateLocalScores(userId: string) {
  try {
    const localScores = localStorage.getItem('chessScores')
    if (localScores) {
      const scores = JSON.parse(localScores)
      
      // Send to API to merge with existing scores
      const response = await fetch('/api/chess/scores/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scores)
      })
      
      if (response.ok) {
        localStorage.removeItem('chessScores')
        return true
      }
    }
  } catch (error) {
    console.error('Migration failed:', error)
  }
  return false
}
```

## Testing Checklist

- [ ] User registration with email verification
- [ ] User login/logout flows
- [ ] Password reset functionality
- [ ] Score persistence for authenticated users
- [ ] Local score fallback for anonymous users
- [ ] Score migration from localStorage to database
- [ ] Rate limiting on authentication endpoints
- [ ] RLS policies working correctly
- [ ] Cross-device score synchronization
- [ ] UI/UX for authentication states

## Deployment Considerations

1. **Environment Variables**: Ensure all Supabase credentials are set
2. **Database Migrations**: Run schema migrations in production
3. **Email Templates**: Configure Supabase email templates
4. **Domain Configuration**: Set up proper redirect URLs
5. **HTTPS**: Ensure SSL for authentication security
6. **Monitoring**: Set up logging for authentication events

## Future Enhancements

1. **Social Authentication**: Google, GitHub, Discord OAuth
2. **User Profiles**: Display names, avatars, preferences
3. **Leaderboards**: Global and friends rankings
4. **Game History**: Detailed game analysis and replay
5. **Chess Puzzles**: Daily puzzles with scoring
6. **Tournaments**: User-organized tournaments
7. **Friends System**: Add friends and private matches
8. **Statistics Dashboard**: Advanced analytics

This implementation provides a solid foundation for user authentication while maintaining the existing chess functionality and preparing for future feature expansion.