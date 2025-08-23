'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const { signIn, signUp, resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error)
        } else {
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
        const { error } = await signUp(email, password)
        if (error) {
          setError(error)
        } else {
          setMessage('Check your email for verification link!')
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email)
        if (error) {
          setError(error)
        } else {
          setMessage('Password reset email sent!')
        }
      }
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
  }

  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    setMode(newMode)
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-textMuted hover:text-text transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-text mb-6">
            {mode === 'signin' && 'Sign In'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'reset' && 'Reset Password'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-border rounded-lg bg-background text-text placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            
            {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border border-border rounded-lg bg-background text-text placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
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
                  className="w-full p-3 border border-border rounded-lg bg-background text-text placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
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
              {loading ? 'Loading...' : 
               mode === 'signin' ? 'Sign In' :
               mode === 'signup' ? 'Create Account' : 'Send Reset Email'}
            </button>
          </form>
          
          <div className="mt-6 text-sm text-center space-y-2">
            {mode === 'signin' && (
              <>
                <div>
                  <span className="text-textMuted">Don't have an account? </span>
                  <button 
                    onClick={() => switchMode('signup')} 
                    className="text-accent hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </div>
                <div>
                  <button 
                    onClick={() => switchMode('reset')} 
                    className="text-accent hover:underline font-medium"
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
                  className="text-accent hover:underline font-medium"
                >
                  Sign in
                </button>
              </div>
            )}
            {mode === 'reset' && (
              <div>
                <button 
                  onClick={() => switchMode('signin')} 
                  className="text-accent hover:underline font-medium"
                >
                  Back to sign in
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}