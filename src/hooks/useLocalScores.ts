import { useState, useEffect, useCallback } from 'react';

export interface ChessScores {
  wins: number;
  losses: number;
  draws: number;
}

const defaultScores: ChessScores = {
  wins: 0,
  losses: 0,
  draws: 0
};

const SCORES_STORAGE_KEY = 'chessScores';

export function useLocalScores() {
  const [scores, setScores] = useState<ChessScores>(defaultScores);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load scores from localStorage on mount
  useEffect(() => {
    try {
      const savedScores = localStorage.getItem(SCORES_STORAGE_KEY);
      if (savedScores) {
        const parsedScores = JSON.parse(savedScores);
        setScores(parsedScores);
      }
    } catch (error) {
      console.error('Error loading scores from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save scores to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(scores));
      } catch (error) {
        console.error('Error saving scores to localStorage:', error);
      }
    }
  }, [scores, isLoaded]);

  const updateScores = useCallback((result: 'win' | 'loss' | 'draw') => {
    setScores(prev => ({
      ...prev,
      wins: result === 'win' ? prev.wins + 1 : prev.wins,
      losses: result === 'loss' ? prev.losses + 1 : prev.losses,
      draws: result === 'draw' ? prev.draws + 1 : prev.draws,
    }));
  }, []);

  const resetScores = useCallback(() => {
    setScores(defaultScores);
  }, []);

  // TODO: Replace with API call to save score after auth integration
  // const updateScoresWithAuth = async (result: 'win' | 'loss' | 'draw') => {
  //   try {
  //     const response = await fetch('/api/chess/scores', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ result })
  //     });
  //     if (response.ok) {
  //       const updatedScores = await response.json();
  //       setScores(updatedScores);
  //     }
  //   } catch (error) {
  //     console.error('Error updating scores:', error);
  //     // Fallback to local update
  //     updateScores(result);
  //   }
  // };

  return {
    scores,
    updateScores,
    resetScores,
    isLoaded
  };
}