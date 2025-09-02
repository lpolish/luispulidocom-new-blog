import { createClient } from '@/lib/supabase/client'
import { NextRequest, NextResponse } from 'next/server'
import { validateAndParse, chessScoreMigrationSchema } from '@/lib/validation'
import { verifyAuthToken } from '@/lib/auth/jwt'

export async function POST(request: NextRequest) {
  // Verify JWT token
  const user = verifyAuthToken(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()

  const body = await request.json()
  
  // Validate input
  const validation = validateAndParse(chessScoreMigrationSchema, body)
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }
  
  const { wins, losses, draws } = validation.data

  // Check if user already has scores in database
  const { data: existingScores } = await supabase
    .from('chess_scores')
    .select('wins, losses, draws')
    .eq('user_id', user.userId)
    .single()

  if (existingScores) {
    // Merge local scores with existing database scores
    const mergedScores = {
      wins: existingScores.wins + wins,
      losses: existingScores.losses + losses,
      draws: existingScores.draws + draws
    }

    const { data: updatedScores, error } = await supabase
      .from('chess_scores')
      .update(mergedScores)
      .eq('user_id', user.userId)
      .select()
      .single()

    if (error) {
      console.error('Migration update error:', error)
      return NextResponse.json({ error: 'Failed to migrate scores' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Scores merged successfully',
      scores: updatedScores,
      merged: true
    })
  } else {
    // Create new scores record with local scores
    const { data: newScores, error } = await supabase
      .from('chess_scores')
      .insert({
        user_id: user.userId,
        wins,
        losses,
        draws
      })
      .select()
      .single()

    if (error) {
      console.error('Migration insert error:', error)
      return NextResponse.json({ error: 'Failed to migrate scores' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Scores migrated successfully',
      scores: newScores,
      merged: false
    })
  }
}