import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createServerClient } from '@/lib/supabase/server'
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt'
import { sendWelcomeEmail } from '@/lib/email'
import { cookies } from 'next/headers'

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

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
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

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user in database
    const { data: userData, error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        email,
        password_hash: hashedPassword,
        display_name: email.split('@')[0],
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
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
    const cookieStore = await cookies()
    cookieStore.set('auth-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    })

    cookieStore.set('refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    // Send welcome email
    try {
      await sendWelcomeEmail(email, userData.display_name)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the signup if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: userData.id,
        email: userData.email,
        displayName: userData.display_name,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}