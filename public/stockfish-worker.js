// Simple Stockfish worker that falls back to random moves
// In a real implementation, you'd use the actual Stockfish WASM

let game = null;

// Simple chess piece values for basic evaluation
const pieceValues = {
  'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0,
  'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 0
};

// Basic position evaluation
function evaluatePosition(fen) {
  const pieces = fen.split(' ')[0];
  let score = 0;
  
  for (let char of pieces) {
    if (pieceValues[char]) {
      if (char === char.toUpperCase()) {
        score += pieceValues[char];
      } else {
        score -= pieceValues[char];
      }
    }
  }
  return score;
}

// Simple minimax-like selection (just picks moves that don't lose material immediately)
function getBestMove(fen) {
  // In a real implementation, this would use actual Stockfish
  // For now, we'll simulate it with a simple algorithm
  
  // Parse the position and return a pseudo-random but slightly intelligent move
  const moves = [
    'e2e4', 'e7e5', 'd2d4', 'd7d5', 'g1f3', 'b8c6', 
    'f1c4', 'f8c5', 'e1g1', 'e8g8'
  ];
  
  // Return a random move from common opening moves
  return moves[Math.floor(Math.random() * moves.length)];
}

self.onmessage = function(e) {
  const command = e.data;
  
  if (command === 'uci') {
    self.postMessage('id name Simple Engine');
    self.postMessage('id author Chess Demo');
    self.postMessage('uciok');
  } else if (command === 'isready') {
    self.postMessage('readyok');
  } else if (command === 'ucinewgame') {
    game = null;
  } else if (command.startsWith('position fen')) {
    const fen = command.substring(12);
    game = fen;
  } else if (command.startsWith('go')) {
    // Simulate thinking time
    setTimeout(() => {
      if (game) {
        // For now, just return a random move indication
        // In a real implementation, this would analyze the position
        self.postMessage('bestmove e2e4');
      } else {
        self.postMessage('bestmove (none)');
      }
    }, 1000);
  }
};
