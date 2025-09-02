import { createClient } from '@/lib/supabase/client'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit'
import { validateAndParse, chessScoreUpdateSchema, isValidFEN } from '@/lib/validation'
import { verifyAuthToken } from '@/lib/auth/jwt'

export async function GET(request: NextRequest) {
  // Verify JWT token
  const user = verifyAuthToken(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()

  const { data: scores, error } = await supabase
    .from('chess_scores')
    .select('wins, losses, draws, total_games, win_rate')
    .eq('user_id', user.userId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json(scores || { wins: 0, losses: 0, draws: 0 })
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIP = getClientIP(request)
  const rateLimitResult = rateLimit(`scores:${clientIP}`, RATE_LIMITS.CHESS_SCORE_UPDATE)
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': RATE_LIMITS.CHESS_SCORE_UPDATE.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        }
      }
    )
  }

  const supabase = createClient()
  
  // Verify JWT token
  const user = verifyAuthToken(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  // Validate input
  const validation = validateAndParse(chessScoreUpdateSchema, body)
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }
  
  const { result, gameData, reset } = validation.data

  // Additional FEN validation if gameData is provided
  if (gameData?.fen && !isValidFEN(gameData.fen)) {
    return NextResponse.json({ error: 'Invalid FEN format' }, { status: 400 })
  }

  // Handle score reset
  if (reset) {
    const { data: resetScores, error } = await supabase
      .from('chess_scores')
      .upsert({
        user_id: user.userId,
        wins: 0,
        losses: 0,
        draws: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Reset scores error:', error)
      return NextResponse.json({ error: 'Failed to reset scores' }, { status: 500 })
    }

    return NextResponse.json(resetScores)
  }

  // Update or insert chess scores
  const { data: existingScores } = await supabase
    .from('chess_scores')
    .select('wins, losses, draws')
    .eq('user_id', user.userId)
    .single()

  const newScores = existingScores || { wins: 0, losses: 0, draws: 0 }
  
  if (result === 'win') newScores.wins += 1
  else if (result === 'loss') newScores.losses += 1
  else if (result === 'draw') newScores.draws += 1

  const { data: updatedScores, error } = await supabase
    .from('chess_scores')
    .upsert({
      user_id: user.userId,
      ...newScores
    })
    .select()
    .single()

  if (error) {
    console.error('Update scores error:', error)
    return NextResponse.json({ error: 'Failed to update scores' }, { status: 500 })
  }

  // Optionally save game history
  if (gameData) {
    await supabase.from('chess_games').insert({
      user_id: user.userId,
      player_color: gameData.playerColor,
      result,
      final_fen: gameData.fen,
      moves_count: gameData.movesCount,
      game_duration_seconds: gameData.duration
    })
  }

  return NextResponse.json(updatedScores)
}