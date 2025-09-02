'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCustomAuth } from '@/contexts/CustomAuthContext'

export interface ChessScores {
  wins: number
  losses: number
  draws: number
  totalGames?: number
  winRate?: number
}

const defaultScores: ChessScores = {
  wins: 0,
  losses: 0,
  draws: 0
}

const SCORES_STORAGE_KEY = 'chessScores'

export function useChessScores() {
  const { user } = useCustomAuth()
  const [scores, setScores] = useState<ChessScores>(defaultScores)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load scores (from API if authenticated, localStorage if not)
  const loadScores = useCallback(async () => {
    if (user) {
      // Load from database
      try {
        const response = await fetch('/api/chess/scores')
        if (response.ok) {
          const data = await response.json()
          setScores(data)
        } else {
          console.error('Failed to load scores from database')
          // Fallback to localStorage
          loadLocalScores()
        }
      } catch (error) {
        console.error('Failed to load scores from database:', error)
        // Fallback to localStorage
        loadLocalScores()
      }
    } else {
      // Load from localStorage
      loadLocalScores()
    }
    setIsLoaded(true)
  }, [user])

  const loadLocalScores = () => {
    try {
      const savedScores = localStorage.getItem(SCORES_STORAGE_KEY)
      if (savedScores) {
        const parsedScores = JSON.parse(savedScores)
        setScores(parsedScores)
      }
    } catch (error) {
      console.error('Error loading local scores:', error)
    }
  }

  useEffect(() => {
    loadScores()
  }, [loadScores])

  const updateScores = useCallback(async (result: 'win' | 'loss' | 'draw', gameData?: any) => {
    if (user) {
      // Update in database
      try {
        const response = await fetch('/api/chess/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ result, gameData })
        })
        
        if (response.ok) {
          const updatedScores = await response.json()
          setScores(updatedScores)
          return
        } else {
          console.error('Failed to update scores in database')
        }
      } catch (error) {
        console.error('Failed to update scores in database:', error)
      }
    }

    // Fallback to localStorage update
    const newScores = {
      wins: result === 'win' ? scores.wins + 1 : scores.wins,
      losses: result === 'loss' ? scores.losses + 1 : scores.losses,
      draws: result === 'draw' ? scores.draws + 1 : scores.draws
    }
    
    setScores(newScores)
    
    if (!user) {
      try {
        localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(newScores))
      } catch (error) {
        console.error('Error saving scores to localStorage:', error)
      }
    }
  }, [user, scores])

  const resetScores = useCallback(async () => {
    const resetData = { wins: 0, losses: 0, draws: 0 }
    
    if (user) {
      // Reset in database
      try {
        const response = await fetch('/api/chess/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reset: true })
        })
        
        if (response.ok) {
          const resetScores = await response.json()
          setScores(resetScores)
          return
        } else {
          console.error('Failed to reset scores in database')
        }
      } catch (error) {
        console.error('Failed to reset scores in database:', error)
      }
    }

    // Fallback to localStorage reset
    setScores(resetData)
    try {
      localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(resetData))
    } catch (error) {
      console.error('Error resetting scores in localStorage:', error)
    }
  }, [user])

  // Migration function to move localStorage scores to database when user logs in
  const migrateLocalScores = useCallback(async () => {
    if (!user) return false

    try {
      const localScores = localStorage.getItem(SCORES_STORAGE_KEY)
      if (localScores) {
        const scores = JSON.parse(localScores)
        
        // Only migrate if there are actual scores to migrate
        if (scores.wins > 0 || scores.losses > 0 || scores.draws > 0) {
          const response = await fetch('/api/chess/scores/migrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scores)
          })
          
          if (response.ok) {
            localStorage.removeItem(SCORES_STORAGE_KEY)
            await loadScores() // Reload from database
            return true
          }
        }
      }
    } catch (error) {
      console.error('Migration failed:', error)
    }
    return false
  }, [user, loadScores])

  return {
    scores,
    updateScores,
    resetScores,
    isLoaded,
    isAuthenticated: !!user,
    migrateLocalScores
  }
}