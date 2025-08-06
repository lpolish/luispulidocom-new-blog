"use client";

import { useState, useMemo } from "react";
import { Chess } from "chess.js";
import { Button } from "@/components/ui/button";
import type { Square, PieceSymbol, Color } from "chess.js";

// Unicode chess pieces
const pieceUnicode: Record<string, string> = {
  'wp': '♙', 'wr': '♖', 'wn': '♘', 'wb': '♗', 'wq': '♕', 'wk': '♔',
  'bp': '♟', 'br': '♜', 'bn': '♞', 'bb': '♝', 'bq': '♛', 'bk': '♚'
};

interface ChessSquareProps {
  square: Square;
  piece: { type: PieceSymbol; color: Color } | null;
  isLight: boolean;
  onClick: (square: Square) => void;
  isSelected: boolean;
  isValidMove: boolean;
}

function ChessSquare({ square, piece, isLight, onClick, isSelected, isValidMove }: ChessSquareProps) {
  const pieceSymbol = piece ? `${piece.color}${piece.type}` : '';
  
  return (
    <div
      className={`
        w-12 h-12 flex items-center justify-center text-2xl cursor-pointer select-none
        ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
        ${isSelected ? 'ring-4 ring-blue-500' : ''}
        ${isValidMove ? 'ring-2 ring-green-500' : ''}
        hover:opacity-80
      `}
      onClick={() => onClick(square)}
    >
      {piece && pieceUnicode[pieceSymbol]}
    </div>
  );
}

export default function ChessboardComponent() {
  const game = useMemo(() => new Chess(), []);
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [gameStatus, setGameStatus] = useState("In Progress");
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);

  function makeAMove(move: any) {
    try {
      const result = game.move(move);
      if (result) {
        setGamePosition(game.fen());
        setSelectedSquare(null);
        setValidMoves([]);
        checkGameStatus();
        return true;
      }
    } catch (e) {
      // illegal move
    }
    return false;
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) {
      checkGameStatus();
      return;
    }
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  function onSquareClick(square: Square) {
    if (selectedSquare) {
      // Try to make a move
      const move = {
        from: selectedSquare,
        to: square,
        promotion: "q",
      };

      const moveSuccessful = makeAMove(move);
      if (moveSuccessful) {
        // If human made a move, computer makes a move after a short delay
        setTimeout(makeRandomMove, 500);
      } else {
        // If move failed, select the new square if it has a piece
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(square);
          setValidMoves(game.moves({ square, verbose: true }).map(move => move.to as Square));
        } else {
          setSelectedSquare(null);
          setValidMoves([]);
        }
      }
    } else {
      // Select a square
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        setValidMoves(game.moves({ square, verbose: true }).map(move => move.to as Square));
      }
    }
  }

  function checkGameStatus() {
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
  }

  function resetGame() {
    game.reset();
    setGamePosition(game.fen());
    setGameStatus("In Progress");
    setSelectedSquare(null);
    setValidMoves([]);
  }

  // Generate board squares
  const squares = [];
  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 0; file < 8; file++) {
      const square = `${String.fromCharCode(97 + file)}${rank}` as Square;
      const piece = game.get(square) || null;
      const isLight = (rank + file) % 2 === 1;
      const isSelected = selectedSquare === square;
      const isValidMove = validMoves.includes(square);
      
      squares.push(
        <ChessSquare
          key={square}
          square={square}
          piece={piece}
          isLight={isLight}
          onClick={onSquareClick}
          isSelected={isSelected}
          isValidMove={isValidMove}
        />
      );
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-8 border-2 border-gray-800 mb-4">
        {squares}
      </div>
      <p className="text-lg font-semibold mt-4">{gameStatus}</p>
      <p className="text-sm text-gray-600 mt-2">
        {game.turn() === 'w' ? "White to move" : "Black to move"}
      </p>
      {selectedSquare && (
        <p className="text-sm text-blue-600 mt-1">
          Selected: {selectedSquare}
        </p>
      )}
      <Button onClick={resetGame} className="mt-4">
        New Game
      </Button>
    </div>
  );
}
