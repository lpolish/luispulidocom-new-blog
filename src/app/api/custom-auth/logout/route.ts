import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Clear auth cookies
    const cookieStore = await cookies()
    cookieStore.delete('auth-token')
    cookieStore.delete('refresh-token')

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