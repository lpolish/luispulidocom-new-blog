import { createClient } from '@supabase/supabase-js'
import { sendPasswordResetEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('Password reset requested for email:', email)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // For now, we'll use Supabase's built-in password reset
    // In the future, we can implement a custom solution
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL}/auth/reset-password`,
    })

    if (error) {
      console.error('Supabase password reset error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('Password reset email sent successfully to:', email)

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent!'
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}