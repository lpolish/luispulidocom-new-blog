import { useState, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';

export interface ChessGameState {
  fen: string;
  isGameOver: boolean;
  winner: 'white' | 'black' | 'draw' | null;
  isPlayerTurn: boolean;
  isThinking: boolean;
  gameStatus: string;
  lastMove: { from: string; to: string } | null;
}

interface StockfishResponse {
  success: boolean;
  evaluation?: number;
  mate?: number | null;
  bestmove?: string;
  continuation?: string;
}

export function useChessGame() {
  const gameRef = useRef(new Chess());
  // Track who starts: true for white, false for black
  const [playerIsWhite, setPlayerIsWhite] = useState(true);
  const [gameState, setGameState] = useState<ChessGameState>({
    fen: gameRef.current.fen(),
    isGameOver: false,
    winner: null,
    isPlayerTurn: true,
    isThinking: false,
    gameStatus: "Your turn (White)",
    lastMove: null,
  });

  const [apiError, setApiError] = useState<string | null>(null);

  const updateGameState = useCallback(() => {
    const game = gameRef.current;
    const isGameOver = game.isGameOver();
    let winner: 'white' | 'black' | 'draw' | null = null;
    let gameStatus = '';

    // Side to move in FEN
    const whiteToMove = game.turn() === 'w';
    // Determine if it's the human player's turn (player color stored in state)
    const playerTurn = playerIsWhite ? whiteToMove : !whiteToMove;

    if (isGameOver) {
      if (game.isCheckmate()) {
        // If checkmate, the side whose turn it IS (in game.turn()) is the LOSER because they have no legal moves.
        winner = game.turn() === 'w' ? 'black' : 'white';
        const playerWon = (winner === 'white' && playerIsWhite) || (winner === 'black' && !playerIsWhite);
        gameStatus = playerWon ? 'You win! Checkmate!' : 'You lose! Checkmate!';
      } else if (game.isDraw()) {
        winner = 'draw';
        gameStatus = 'Draw!';
      } else if (game.isStalemate()) {
        winner = 'draw';
        gameStatus = 'Draw by stalemate!';
      } else if (game.isThreefoldRepetition()) {
        winner = 'draw';
        gameStatus = 'Draw by threefold repetition!';
      } else if (game.isInsufficientMaterial()) {
        winner = 'draw';
        gameStatus = 'Draw by insufficient material!';
      }
    } else {
      if (game.isCheck()) {
        gameStatus = playerTurn
          ? `Your turn (${playerIsWhite ? 'White' : 'Black'}) - Check!`
          : `AI thinking (${playerIsWhite ? 'Black' : 'White'}) - Check!`;
      } else {
        gameStatus = playerTurn
          ? `Your turn (${playerIsWhite ? 'White' : 'Black'})`
          : `AI thinking (${playerIsWhite ? 'Black' : 'White'})`;
      }
    }

    setGameState(prev => ({
      ...prev,
      fen: game.fen(),
      isGameOver,
      winner,
      // isPlayerTurn now reflects whether it's the HUMAN player's turn (perspective-aware)
      isPlayerTurn: playerTurn,
      gameStatus,
    }));
  }, [playerIsWhite]);

  const fetchAiMove = useCallback(async (currentFen: string): Promise<string | null> => {
    try {
      setApiError(null);
      const response = await fetch(
        `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(currentFen)}&depth=10`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: StockfishResponse = await response.json();
      
      if (data.success && data.bestmove) {
        // Parse the bestmove response (format: "bestmove e2e4 ponder h7h6" or similar)
        const match = data.bestmove.match(/bestmove\s+([a-h][1-8][a-h][1-8])/);
        if (match) {
          const moveUci = match[1];
          return moveUci;
        }
      }
      
      throw new Error('Invalid response format or no best move found');
    } catch (error) {
      console.error('Stockfish API error:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to get AI move');
      
      // Fallback: Generate a random legal move
      const game = new Chess(currentFen);
      const possibleMoves = game.moves({ verbose: true });
      if (possibleMoves.length > 0) {
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        return randomMove.from + randomMove.to;
      }
      
      return null;
    }
  }, []);

  const makePlayerMove = useCallback(async (from: string, to: string): Promise<boolean> => {
    const game = gameRef.current;
    
    try {
      // Try to make the move
      const move = game.move({ from, to, promotion: 'q' });
      if (!move) {
        return false; // Invalid move
      }

      setGameState(prev => ({
        ...prev,
        lastMove: { from, to },
        isThinking: true,
      }));

      updateGameState();

      // Check if game is over after player move
      if (game.isGameOver()) {
        return true;
      }

      // Get AI move
      const aiMoveUci = await fetchAiMove(game.fen());
      if (aiMoveUci && aiMoveUci.length >= 4) {
        const aiFrom = aiMoveUci.substring(0, 2);
        const aiTo = aiMoveUci.substring(2, 4);
        const aiPromotion = aiMoveUci.length > 4 ? aiMoveUci[4] : undefined;

        const aiMove = game.move({ 
          from: aiFrom, 
          to: aiTo, 
          promotion: aiPromotion || 'q' 
        });

        if (aiMove) {
          setGameState(prev => ({
            ...prev,
            lastMove: { from: aiFrom, to: aiTo },
            isThinking: false,
          }));
        }
      } else {
        setGameState(prev => ({
          ...prev,
          isThinking: false,
        }));
      }

      updateGameState();
      return true;
    } catch (error) {
      console.error('Error making move:', error);
      setGameState(prev => ({
        ...prev,
        isThinking: false,
      }));
      return false;
    }
  }, [fetchAiMove, updateGameState]);

  const resetGame = useCallback(() => {
    // Alternate who starts
    setPlayerIsWhite(prev => !prev);
    const playerStartsWhite = !playerIsWhite;
    gameRef.current = new Chess();
    setApiError(null);
    setGameState({
      fen: gameRef.current.fen(),
      isGameOver: false,
      winner: null,
      // When player starts white, it's player's turn; otherwise AI (white) moves first
      isPlayerTurn: playerStartsWhite,
      isThinking: !playerStartsWhite, // we're going to fetch AI move if player is black
      gameStatus: playerStartsWhite ? 'Your turn (White)' : 'AI thinking (White)',
      lastMove: null,
    });
    // Only trigger Stockfish move if user is black
    if (!playerStartsWhite) {
      setTimeout(async () => {
        const aiMoveUci = await fetchAiMove(gameRef.current.fen());
        if (aiMoveUci && aiMoveUci.length >= 4) {
          const aiFrom = aiMoveUci.substring(0, 2);
          const aiTo = aiMoveUci.substring(2, 4);
          const aiPromotion = aiMoveUci.length > 4 ? aiMoveUci[4] : undefined;
          gameRef.current.move({ from: aiFrom, to: aiTo, promotion: aiPromotion || 'q' });
        }
        updateGameState();
      }, 500);
    } else {
      // Ensure state reflects correct perspective after reset
      updateGameState();
    }
  }, []);

  return {
  gameState,
  makePlayerMove,
  resetGame,
  apiError,
  playerIsWhite,
  };
}