'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function AuthRedirectHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const type = searchParams.get('type')
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')

    // Handle legacy token-based flow
    if (accessToken && refreshToken) {
      const newUrl = `/auth/reset-password?access_token=${accessToken}&refresh_token=${refreshToken}`
      router.replace(newUrl)
      return
    }

    // Handle type-specific flows
    if (code && type) {
      if (type === 'recovery') {
        // Password reset flow
        const newUrl = `/auth/reset-password?code=${code}`
        router.replace(newUrl)
        return
      }
      if (type === 'signup') {
        // Email confirmation flow
        const newUrl = `/auth/callback?code=${code}`
        router.replace(newUrl)
        return
      }
    }

    // Handle code without type - try to determine the flow
    if (code && !type) {
      // For now, assume it's an email confirmation unless we can determine otherwise
      // This handles cases where Supabase doesn't send the type parameter
      const newUrl = `/auth/callback?code=${code}`
      router.replace(newUrl)
      return
    }
  }, [searchParams, router])

  // This component doesn't render anything
  return null
}