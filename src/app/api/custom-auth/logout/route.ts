import { NextResponse } from 'next/server'
import { clearAuthCookies } from '@/lib/auth/jwt'

export async function POST() {
  try {
    // Clear auth cookies
    await clearAuthCookies()

    return NextResponse.json({
      success: true,
      message: 'Logout successful!',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}