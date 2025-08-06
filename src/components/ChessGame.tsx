"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Square } from "chess.js";

interface ChessGameProps {
  user?: any;
}

export default function ChessGame({ user }: ChessGameProps) {
  const game = useMemo(() => new Chess(), []);
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [gameStatus, setGameStatus] = useState("In Progress");
  const [isThinking, setIsThinking] = useState(false);
  const [gameMode, setGameMode] = useState<'ai' | 'human' | null>(null);
  const [stockfishWorker, setStockfishWorker] = useState<Worker | null>(null);
  const supabase = createClient();

  // Initialize Stockfish worker
  useEffect(() => {
    if (typeof window !== 'undefined' && gameMode === 'ai') {
      try {
        // Create Stockfish worker from CDN
        const worker = new Worker('/stockfish-worker.js');
        worker.postMessage('uci');
        worker.postMessage('ucinewgame');
        worker.postMessage('isready');
        setStockfishWorker(worker);
      } catch (error) {
        console.error('Failed to load Stockfish:', error);
        // Fallback to random moves
      }
    }

    return () => {
      if (stockfishWorker) {
        stockfishWorker.terminate();
      }
    };
  }, [gameMode]);

  const updateGameStatus = useCallback(() => {
    if (game.isCheckmate()) {
      setGameStatus(`Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins.`);
    } else if (game.isDraw()) {
      setGameStatus("Draw!");
    } else if (game.isStalemate()) {
      setGameStatus("Stalemate!");
    } else if (game.isThreefoldRepetition()) {
      setGameStatus("Draw by threefold repetition!");
    } else if (game.isInsufficientMaterial()) {
      setGameStatus("Draw by insufficient material!");
    } else {
      setGameStatus("In Progress");
    }
  }, [game]);

  const makeAMove = useCallback((move: any) => {
    try {
      const result = game.move(move);
      if (result) {
        setGamePosition(game.fen());
        updateGameStatus();
        return true;
      }
    } catch (e) {
      // Illegal move
    }
    return false;
  }, [game, updateGameStatus]);

  const makeRandomMove = useCallback(() => {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) {
      updateGameStatus();
      return;
    }
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }, [game, makeAMove, updateGameStatus]);

  const makeStockfishMove = useCallback(() => {
    // For now, just use random moves since we have a placeholder worker
    // In production, this would use the real Stockfish engine
    setIsThinking(true);
    setTimeout(() => {
      makeRandomMove();
      setIsThinking(false);
    }, 1000);
  }, [makeRandomMove]);

  function onPieceDrop(sourceSquare: Square, targetSquare: Square) {
    // Only allow moves for white (human player) in AI mode
    if (gameMode === 'ai' && game.turn() !== 'w') {
      return false;
    }

    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Always promote to queen for simplicity
    };

    const moveSuccessful = makeAMove(move);
    
    if (moveSuccessful && gameMode === 'ai' && !game.isGameOver()) {
      // AI makes a move after a short delay
      setTimeout(() => {
        makeStockfishMove();
      }, 500);
    }

    return moveSuccessful;
  }

  function resetGame() {
    game.reset();
    setGamePosition(game.fen());
    setGameStatus("In Progress");
    setIsThinking(false);
    setGameMode(null);
  }

  function startAIGame() {
    resetGame();
    setGameMode('ai');
  }

  async function requestGameVsLuis() {
    if (!user) {
      alert('Please log in to request a game');
      return;
    }

    try {
      // For now, we'll create a simple game request that can be viewed in the admin
      // In a real implementation, you'd have Luis's actual user ID
      const { data, error } = await supabase
        .from('games')
        .insert({
          white_player_id: user.id,
          black_player_id: null, // Will be set when Luis accepts
          status: 'pending_request',
          game_type: 'human',
          current_fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          pgn: ''
        });

      if (error) {
        console.error('Error creating game request:', error);
        alert('Failed to create game request. Make sure the database is set up!');
      } else {
        alert('Game request sent! I\'ll be notified and can accept your challenge.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send game request. The database might not be set up yet.');
    }
  }

  if (!gameMode) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold mb-2">Choose Game Mode</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Select how you'd like to play chess
          </p>
        </div>
        
        <Button onClick={startAIGame} className="w-full max-w-xs">
          🤖 Play vs AI
        </Button>
        
        {user ? (
          <Button onClick={requestGameVsLuis} variant="outline" className="w-full max-w-xs">
            👨‍💻 Request Game vs Me
          </Button>
        ) : (
          <Button variant="outline" disabled className="w-full max-w-xs">
            👨‍💻 Sign in to challenge me
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 w-full max-w-md">
        <Chessboard
          options={{
            position: gamePosition,
            onPieceDrop: ({ sourceSquare, targetSquare }) => 
              onPieceDrop(sourceSquare as Square, targetSquare as Square),
            boardOrientation: "white",
            allowDragging: true,
          }}
        />
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold">{gameStatus}</p>
        
        {gameMode === 'ai' && (
          <>
            <p className="text-sm text-gray-600">
              {game.turn() === 'w' ? "Your turn (White)" : isThinking ? "AI is thinking..." : "AI's turn (Black)"}
            </p>
            {isThinking && (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm">Stockfish is thinking...</span>
              </div>
            )}
          </>
        )}
        
        <div className="flex space-x-2 mt-4">
          <Button onClick={resetGame}>
            New Game
          </Button>
          <Button onClick={() => setGameMode(null)} variant="outline">
            Change Mode
          </Button>
        </div>
      </div>
    </div>
  );
}
