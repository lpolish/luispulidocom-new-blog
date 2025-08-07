// Stockfish Worker using official Stockfish JS from CDN

// Load Stockfish engine locally using importScripts
importScripts('/stockfish.js');

// Stockfish is now available as a global object
self.onmessage = function(e) {
  const command = e.data;
  // Debug: log commands sent to Stockfish
  self.postMessage('[Worker] ' + command);
  if (typeof postMessage === 'function') {
    // Send command to Stockfish engine
    postMessage(command);
  }
};

onmessage = function(e) {
  // Forward messages to Stockfish
  postMessage(e.data);
};

// Listen for Stockfish output and forward to main thread
onmessage = function(event) {
  self.postMessage(event.data);
};
