'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useChessGame } from '@/hooks/useChessGame';
import { useChessScores } from '@/hooks/useChessScores';
import { useCustomAuth } from '@/contexts/CustomAuthContext';
import ChessBoard from '@/components/chess/ChessBoard';
import GameStatus from '@/components/chess/GameStatus';
import ScoreBoard from '@/components/chess/ScoreBoard';
import AuthForm from '@/components/AuthForm';
import { metadata } from './metadata';

export default function ChessPage() {
  const { user, signOut } = useCustomAuth();
  const { gameState, makePlayerMove, resetGame, apiError, playerIsWhite } = useChessGame();
  const { scores, updateScores, resetScores, isLoaded, isAuthenticated, migrateLocalScores } = useChessScores();
  const gameEndProcessedRef = useRef<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Migrate local scores when user signs in
  useEffect(() => {
    if (user && isLoaded) {
      migrateLocalScores();
    }
  }, [user, isLoaded, migrateLocalScores]);

  // Update scores when game ends (only once per game)
  useEffect(() => {
    if (gameState.isGameOver && gameState.winner !== null) {
      const gameId = `${gameState.fen}-${gameState.winner}`;
      
      // Only process if we haven't already processed this game end
      if (gameEndProcessedRef.current !== gameId) {
        gameEndProcessedRef.current = gameId;
        
        // Prepare game data for database storage
        const gameData = {
          playerColor: playerIsWhite ? 'white' : 'black',
          fen: gameState.fen,
          movesCount: gameState.fen.split(' ')[5] || 0, // Full move counter from FEN
        };
        
        // Determine if the player won based on their color and the winner
        if (gameState.winner === 'draw') {
          updateScores('draw', gameData);
        } else {
          const playerWon = (playerIsWhite && gameState.winner === 'white') || 
                           (!playerIsWhite && gameState.winner === 'black');
          if (playerWon) {
            updateScores('win', gameData);
          } else {
            updateScores('loss', gameData);
          }
        }
      }
    }
    
    // Reset the processed flag when a new game starts
    if (!gameState.isGameOver) {
      gameEndProcessedRef.current = null;
    }
  }, [gameState.isGameOver, gameState.winner, gameState.fen, updateScores, playerIsWhite]);

  // Authentication section component
  const AuthSection = () => (
    <div className="text-center mb-6 p-4 bg-backgroundMuted border border-border rounded-lg">
      {user ? (
        <div className="flex items-center justify-center gap-4">
          <div className="text-sm">
            <span className="text-textMuted">Signed in as </span>
            <span className="text-text font-medium">{user.email}</span>
            <div className="text-xs text-accent mt-1">
              {isAuthenticated ? 'Scores are saved to your account' : 'Scores saved locally'}
            </div>
          </div>
          <button
            onClick={signOut}
            className="text-sm text-accent hover:text-accent2 underline transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <p className="text-textMuted mb-3">
            Create a free account to save your chess scores across devices!
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent2 transition-colors font-medium"
          >
            Sign In / Create Account
          </button>
        </div>
      )}
    </div>
  );

  // Board orientation is fixed for the game, based on who started
  const boardOrientation = playerIsWhite ? 'white' : 'black';

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Authentication Section */}
      <AuthSection />

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

      {/* Authentication Modal */}
      <AuthForm
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}