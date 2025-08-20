'use client';

import { Chessboard, ChessboardProvider } from 'react-chessboard';
import { ChessGameState } from '@/hooks/useChessGame';

interface ChessBoardProps {
  gameState: ChessGameState;
  onMove: (from: string, to: string) => Promise<boolean>;
  boardSize?: number;
}

export default function ChessBoard({ gameState, onMove, boardSize }: ChessBoardProps) {
  const handlePieceDrop = ({ piece, sourceSquare, targetSquare }: { 
    piece: { isSparePiece: boolean; position: string; pieceType: string }; 
    sourceSquare: string; 
    targetSquare: string | null; 
  }): boolean => {
    // Don't allow moves if it's not the player's turn or game is over
    if (!gameState.isPlayerTurn || gameState.isGameOver || gameState.isThinking || !targetSquare) {
      return false;
    }

    // Execute the move asynchronously but return true for UI responsiveness
    onMove(sourceSquare, targetSquare).then(result => {
      // The result will be handled by the chess game hook
    });
    
    return true;
  };

  const getCustomSquareStyles = () => {
    const styles: { [square: string]: React.CSSProperties } = {};
    
    // Highlight the last move
    if (gameState.lastMove) {
      styles[gameState.lastMove.from] = {
        backgroundColor: 'rgba(255, 206, 84, 0.4)',
      };
      styles[gameState.lastMove.to] = {
        backgroundColor: 'rgba(255, 206, 84, 0.4)',
      };
    }
    
    return styles;
  };

  const chessboardOptions = {
    id: "BasicBoard",
    position: gameState.fen,
    onPieceDrop: handlePieceDrop,
    boardOrientation: "white" as const,
    squareStyles: getCustomSquareStyles(),
    allowDragging: gameState.isPlayerTurn && !gameState.isGameOver && !gameState.isThinking,
    boardStyle: {
      borderRadius: '4px',
    },
    darkSquareStyle: {
      backgroundColor: '#769656',
    },
    lightSquareStyle: {
      backgroundColor: '#eeeed2',
    },
    animationDurationInMs: 300,
    showAnimations: true,
  };

  return (
    <div className="flex justify-center">
      <div 
        className="relative border-2 border-border rounded-lg overflow-hidden shadow-lg"
        style={{ 
          width: boardSize || 'min(90vw, 500px)', 
          height: boardSize || 'min(90vw, 500px)' 
        }}
      >
        <ChessboardProvider options={chessboardOptions}>
          <Chessboard />
        </ChessboardProvider>
        
        
        {/* Overlay for game over state */}
        {gameState.isGameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded">
            <div className="bg-backgroundMuted border border-border rounded-lg px-6 py-4 text-center max-w-xs">
              <h3 className="text-text text-lg font-semibold mb-2">Game Over</h3>
              <p className="text-textMuted text-sm">{gameState.gameStatus}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}