'use client';

import { ChessGameState } from '@/hooks/useChessGame';

interface GameStatusProps {
  gameState: ChessGameState;
  onResetGame: () => void;
  apiError: string | null;
}

export default function GameStatus({ gameState, onResetGame, apiError }: GameStatusProps) {
  const getStatusColor = () => {
    if (gameState.isGameOver) {
      if (gameState.winner === 'white') return 'text-accent2';
      if (gameState.winner === 'black') return 'text-red-400';
      return 'text-accent';
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
      if (gameState.winner === 'white') return ' 🎉';
      if (gameState.winner === 'black') return ' 😔';
      return ' 🤝';
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
        
        <button
          onClick={onResetGame}
          className="px-4 py-2 bg-accent hover:bg-accent/80 text-background rounded font-medium transition-colors text-sm"
        >
          New Game
        </button>
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