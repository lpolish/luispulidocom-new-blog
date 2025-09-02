import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createServerClient } from '@/lib/supabase/server'
import { generateAccessToken, generateRefreshToken, setAuthCookies } from '@/lib/auth/jwt'

export async function POST(request: NextRequest) {
  try {
    const { email, password, recaptchaToken } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA if token provided
    if (recaptchaToken) {
      const recaptchaResponse = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
        { method: 'POST' }
      )
      const recaptchaData = await recaptchaResponse.json()

      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed' },
          { status: 400 }
        )
      }
    }

    const supabase = createServerClient()

    // Get user from database
    const { data: userData, error: userError } = await supabase
      .from('user_profiles')
      .select('id, email, password_hash, display_name')
      .eq('email', email)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password_hash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: userData.id,
      email: userData.email,
    })

    const refreshToken = generateRefreshToken({
      userId: userData.id,
      email: userData.email,
    })

    // Set cookies
    await setAuthCookies(accessToken, refreshToken)

    return NextResponse.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: userData.id,
        email: userData.email,
        displayName: userData.display_name,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}