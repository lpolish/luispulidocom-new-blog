'use client';

import { ChessGameState } from '@/hooks/useChessGame';

interface GameStatusProps {
  gameState: ChessGameState;
  onResetGame: () => void;
  apiError: string | null;
  playerIsWhite: boolean;
}

export default function GameStatus({ gameState, onResetGame, apiError, playerIsWhite }: GameStatusProps) {
  const handleResign = () => {
    if (window.confirm('Are you sure you want to resign? You will lose this game.')) {
      if (typeof window !== 'undefined' && window.localStorage) {
        // Deduct a loss in local storage
        try {
          const scoresRaw = localStorage.getItem('chessScores');
          let scores = scoresRaw ? JSON.parse(scoresRaw) : { wins: 0, losses: 0, draws: 0 };
          scores.losses = (scores.losses || 0) + 1;
          localStorage.setItem('chessScores', JSON.stringify(scores));
        } catch {}
      }
      onResetGame();
    }
  };
  const getStatusColor = () => {
    if (gameState.isGameOver) {
      if (gameState.winner === 'draw') return 'text-accent';
      
      // Check if the player won based on their color
      const playerWon = (gameState.winner === 'white' && playerIsWhite) || 
                       (gameState.winner === 'black' && !playerIsWhite);
      return playerWon ? 'text-accent2' : 'text-red-400';
    }
    return gameState.isThinking ? 'text-accent' : 'text-text';
  };

  const getStatusIcon = () => {
    if (gameState.isThinking) {
      return (
        <div className="inline-block ml-2">
          <div className="animate-spin h-4 w-4 border-2 border-accent border-t-transparent rounded-full"></div>
        </div>
      );
    }
    
    if (gameState.isGameOver) {
      if (gameState.winner === 'draw') return ' 🤝';
      
      // Check if the player won based on their color
      const playerWon = (gameState.winner === 'white' && playerIsWhite) || 
                       (gameState.winner === 'black' && !playerIsWhite);
      return playerWon ? ' 🎉' : ' 😔';
    }
    
    return gameState.isPlayerTurn ? ' ♔' : ' ♛';
  };

  const getDisplayStatus = () => {
    if (gameState.isThinking) {
      return apiError ? `AI thinking (using fallback moves)` : 'AI thinking...';
    }
    return gameState.gameStatus;
  };

  return (
    <div className="bg-backgroundMuted border border-border rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-text mb-1">Game Status</h3>
          <p className={`text-sm font-medium ${getStatusColor()}`}>
            {getDisplayStatus()}
            {getStatusIcon()}
          </p>
        </div>
        {!gameState.isGameOver && gameState.lastMove === null ? (
          <button
            onClick={onResetGame}
            className="px-4 py-2 bg-accent hover:bg-accent/80 text-background rounded font-medium transition-colors text-sm"
          >
            New Game
          </button>
        ) : gameState.isGameOver ? (
          <button
            onClick={onResetGame}
            className="px-4 py-2 bg-accent hover:bg-accent/80 text-background rounded font-medium transition-colors text-sm"
          >
            New Game
          </button>
        ) : (
          <button
            onClick={handleResign}
            className="px-4 py-2 bg-accent hover:bg-accent/80 text-background rounded font-medium transition-colors text-sm"
          >
            Resign
          </button>
        )}
      </div>
      {gameState.isGameOver && (
        <div className="mt-3 p-3 bg-background border border-border rounded text-center">
          <p className="text-sm text-textMuted">
            Game Over! Click "New Game" to play again.
          </p>
        </div>
      )}
    </div>
  );
}