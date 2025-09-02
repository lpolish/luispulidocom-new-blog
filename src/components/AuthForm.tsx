'use client'

import { useState } from 'react'
import { useCustomAuth } from '@/contexts/CustomAuthContext'
import { useReCAPTCHA } from '@/components/ReCAPTCHA'
import { X, Eye, EyeOff } from 'lucide-react'

interface AuthFormProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'signin' | 'signup'
  onSuccess?: () => void
}

export default function AuthForm({ isOpen, onClose, defaultMode = 'signin', onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const { signIn, signUp } = useCustomAuth()
  const { getToken, isReady } = useReCAPTCHA()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      let recaptchaToken: string | undefined

      // Get reCAPTCHA token if available
      if (isReady) {
        recaptchaToken = await getToken('auth') || undefined
      }

      if (mode === 'signin') {
        const { error } = await signIn(email, password, recaptchaToken)
        if (error) {
          setError(error)
        } else {
          setMessage('Login successful!')
          onSuccess?.()
          onClose()
        }
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          return
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters')
          return
        }
        const { error } = await signUp(email, password, recaptchaToken)
        if (error) {
          setError(error)
        } else {
          setMessage('Account created successfully! You are now logged in.')
          onSuccess?.()
          onClose()
        }
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setMessage('')
    setShowPassword(false)
  }

  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    setMode(newMode)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg max-w-md w-full relative shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-textMuted hover:text-text transition-colors z-10"
          type="button"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-text mb-6 pr-8">
            {mode === 'signin' && 'Sign In'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-border rounded-lg bg-background text-text placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                disabled={loading}
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 pr-10 border border-border rounded-lg bg-background text-text placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-text transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full p-3 border border-border rounded-lg bg-background text-text placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                  disabled={loading}
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white p-3 rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                mode === 'signin' ? 'Sign In' :
                mode === 'signup' ? 'Create Account' : 'Send Reset Email'
              )}
            </button>
          </form>

          <div className="mt-6 text-sm text-center space-y-2">
            {mode === 'signin' && (
              <>
                <div>
                  <span className="text-textMuted">Don't have an account? </span>
                  <button
                    onClick={() => switchMode('signup')}
                    className="text-accent hover:text-accent2 underline font-medium transition-colors"
                    type="button"
                  >
                    Sign up
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => switchMode('reset')}
                    className="text-accent hover:text-accent2 underline font-medium transition-colors"
                    type="button"
                  >
                    Forgot password?
                  </button>
                </div>
              </>
            )}
            {mode === 'signup' && (
              <div>
                <span className="text-textMuted">Already have an account? </span>
                <button
                  onClick={() => switchMode('signin')}
                  className="text-accent hover:text-accent2 underline font-medium transition-colors"
                  type="button"
                >
                  Sign in
                </button>
              </div>
            )}
            {mode === 'reset' && (
              <div>
                <button
                  onClick={() => switchMode('signin')}
                  className="text-accent hover:text-accent2 underline font-medium transition-colors"
                  type="button"
                >
                  Back to sign in
                </button>
              </div>
            )}
          </div>

          {/* reCAPTCHA notice */}
          {isReady && (
            <div className="mt-4 text-xs text-textMuted text-center">
              This site is protected by reCAPTCHA and the Google{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Terms of Service
              </a>{' '}
              apply.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}