'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface CustomUser {
  id: string
  email: string
  displayName: string
}

interface CustomAuthContextType {
  user: CustomUser | null
  loading: boolean
  signIn: (email: string, password: string, recaptchaToken?: string) => Promise<{error?: string}>
  signUp: (email: string, password: string, recaptchaToken?: string) => Promise<{error?: string}>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const CustomAuthContext = createContext<CustomAuthContextType | undefined>(undefined)

export function useCustomAuth() {
  const context = useContext(CustomAuthContext)
  if (!context) {
    throw new Error('useCustomAuth must be used within CustomAuthProvider')
  }
  return context
}

interface CustomAuthProviderProps {
  children: React.ReactNode
}

export function CustomAuthProvider({ children }: CustomAuthProviderProps) {
  const [user, setUser] = useState<CustomUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize user on mount by checking auth status
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await fetch('/api/custom-auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const signIn = async (email: string, password: string, recaptchaToken?: string) => {
    try {
      const response = await fetch('/api/custom-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, recaptchaToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error }
      }

      setUser(data.user)
      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  const signUp = async (email: string, password: string, recaptchaToken?: string) => {
    try {
      const response = await fetch('/api/custom-auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, recaptchaToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error }
      }

      setUser(data.user)
      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/custom-auth/logout', {
        method: 'POST',
      })
      setUser(null)
    } catch (error) {
      console.error('Error during sign out:', error)
    }
  }

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/custom-auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  }

  return (
    <CustomAuthContext.Provider value={value}>
      {children}
    </CustomAuthContext.Provider>
  )
}