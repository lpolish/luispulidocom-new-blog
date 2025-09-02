import { NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth/jwt'
import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const tokenPayload = verifyAccessToken(token)

    if (!tokenPayload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const supabase = createServerClient()

    // Get user data from database
    const { data: userData, error } = await supabase
      .from('user_profiles')
      .select('id, email, display_name')
      .eq('id', tokenPayload.userId)
      .single()

    if (error || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        displayName: userData.display_name,
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}