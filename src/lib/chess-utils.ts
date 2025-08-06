import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

export type GameStatus = 'pending_request' | 'active' | 'completed' | 'declined'
export type GameType = 'ai' | 'human'
export type GameWinner = 'white' | 'black' | 'draw'

export interface Game {
  id: string
  white_player_id: string | null
  black_player_id: string | null
  status: GameStatus
  current_fen: string
  pgn: string
  winner: GameWinner | null
  game_type: GameType
  created_at: string
  updated_at: string
}

// Client-side functions
export async function createGameRequest(opponentId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('games')
    .insert({
      white_player_id: user.id,
      black_player_id: opponentId,
      status: 'pending_request',
      game_type: 'human'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateGameState(gameId: string, fen: string, pgn: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('games')
    .update({
      current_fen: fen,
      pgn: pgn,
      updated_at: new Date().toISOString()
    })
    .eq('id', gameId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function acceptGameRequest(gameId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('games')
    .update({ status: 'active' })
    .eq('id', gameId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function declineGameRequest(gameId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('games')
    .update({ status: 'declined' })
    .eq('id', gameId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function completeGame(gameId: string, winner: GameWinner) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('games')
    .update({ 
      status: 'completed',
      winner: winner
    })
    .eq('id', gameId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserGames(userId?: string) {
  const supabase = createClient()
  
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')
    userId = user.id
  }

  const { data, error } = await supabase
    .from('games')
    .select(`
      *,
      white_player:profiles!white_player_id(username),
      black_player:profiles!black_player_id(username)
    `)
    .or(`white_player_id.eq.${userId},black_player_id.eq.${userId}`)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

// Server-side functions
export async function getGameRequests(userId: string) {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('games')
    .select(`
      *,
      white_player:profiles!white_player_id(username),
      black_player:profiles!black_player_id(username)
    `)
    .eq('black_player_id', userId)
    .eq('status', 'pending_request')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function subscribeToGame(gameId: string, callback: (game: Game) => void) {
  const supabase = createClient()
  
  return supabase
    .channel(`game-${gameId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`
      },
      (payload) => {
        callback(payload.new as Game)
      }
    )
    .subscribe()
}
