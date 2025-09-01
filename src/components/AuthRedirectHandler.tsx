'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function AuthRedirectHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const type = searchParams.get('type')

    // If we have a code parameter and it's for password recovery, redirect to reset password page
    if (code && type === 'recovery') {
      const newUrl = `/auth/reset-password?code=${code}`
      router.replace(newUrl)
      return
    }

    // If we have a code parameter without type, it might be for email confirmation
    if (code && !type) {
      const newUrl = `/auth/callback?code=${code}`
      router.replace(newUrl)
      return
    }
  }, [searchParams, router])

  // This component doesn't render anything
  return null
}