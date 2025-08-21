'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useChessGame } from '@/hooks/useChessGame';
import { useLocalScores } from '@/hooks/useLocalScores';
import ChessBoard from '@/components/chess/ChessBoard';
import GameStatus from '@/components/chess/GameStatus';
import ScoreBoard from '@/components/chess/ScoreBoard';
import { metadata } from './metadata';

export default function ChessPage() {
  const { gameState, makePlayerMove, resetGame, apiError, playerIsWhite } = useChessGame();
  const { scores, updateScores, resetScores, isLoaded } = useLocalScores();
  const gameEndProcessedRef = useRef<string | null>(null);

  // Update scores when game ends (only once per game)
  useEffect(() => {
    if (gameState.isGameOver && gameState.winner !== null) {
      const gameId = `${gameState.fen}-${gameState.winner}`;
      
      // Only process if we haven't already processed this game end
      if (gameEndProcessedRef.current !== gameId) {
        gameEndProcessedRef.current = gameId;
        
        if (gameState.winner === 'draw') {
          updateScores('draw');
        } else if (
          (gameState.winner === 'white' && playerIsWhite) ||
          (gameState.winner === 'black' && !playerIsWhite)
        ) {
          updateScores('win');
        } else {
          updateScores('loss');
        }
      }
    }
    
    // Reset the processed flag when a new game starts
    if (!gameState.isGameOver) {
      gameEndProcessedRef.current = null;
    }
  }, [gameState.isGameOver, gameState.winner, gameState.fen, updateScores, playerIsWhite]);

  // Board orientation is fixed for the game, based on who started
  const boardOrientation = playerIsWhite ? 'white' : 'black';
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-text mb-4">
          Chess Game
        </h1>
        <p className="text-textMuted text-lg max-w-2xl mx-auto">
          Play chess against an AI opponent powered by{' '}
            <Link 
              href="/blog/stockfish-chess-engine-architecture" 
              className="text-accent hover:text-accent2 transition-colors underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stockfish
            </Link>
          .
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chess Board - Main Content */}
        <div className="lg:col-span-2">
          <ChessBoard
            gameState={gameState}
            onMove={makePlayerMove}
            boardOrientation={boardOrientation}
          />
        </div>

        {/* Sidebar with Game Info */}
        <div className="space-y-6">
          <GameStatus
            gameState={gameState}
            onResetGame={resetGame}
            apiError={apiError}
          />
          
          <ScoreBoard
            scores={scores}
            onResetScores={resetScores}
            isLoaded={isLoaded}
          />

          {/* GitHub Source Link */}
          <div className="text-center">
            <a
              href="https://github.com/lpolish/luispulidocom-new-blog/blob/main/src/app/chess/page.tsx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-textMuted hover:text-accent transition-colors"
            >
              View source on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}