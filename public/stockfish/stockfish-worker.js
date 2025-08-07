

// Stockfish Worker: Prioritize WASM, fallback to JS, then API
let engineType = null;
let stockfish = null;

function log(msg) {
	postMessage(`[Worker-LOG] ${msg}`);
}

function tryLoadWASM() {
	log('Attempting to load Stockfish WASM...');
	try {
		importScripts('/stockfish/stockfish-16.1.js');
		engineType = 'wasm';
		log('Loaded Stockfish WASM');
		return true;
	} catch (e) {
		log('Failed to load WASM: ' + e.message);
		return false;
	}
}

function tryLoadJS() {
	log('Attempting to load Stockfish JS...');
	try {
		importScripts('/stockfish/stockfish.js');
		engineType = 'js';
		log('Loaded Stockfish JS');
		return true;
	} catch (e) {
		log('Failed to load JS: ' + e.message);
		return false;
	}
}

function tryLoadAPI() {
	engineType = 'api';
	log('Falling back to remote API (not implemented)');
}

// Try to load WASM, then JS, then API
let stockfishInit = false;
if (!tryLoadWASM()) {
	if (!tryLoadJS()) {
		tryLoadAPI();
	}
}

// Stockfish interface: after importScripts, Stockfish is available as a global function
if (engineType === 'wasm' || engineType === 'js') {
	if (typeof Stockfish === 'function') {
		log('Initializing Stockfish engine...');
		stockfish = Stockfish();
		stockfishInit = true;
		log('Stockfish engine initialized.');
		stockfish.onmessage = function(e) {
			// Forward only relevant messages
			if (typeof e === 'string') {
				if (e.startsWith('bestmove') || e.startsWith('info') || e.startsWith('uciok') || e.startsWith('readyok') || e.startsWith('id') || e.startsWith('option')) {
					postMessage(e);
				}
				// Debug: log all Stockfish output
				log('[Stockfish] ' + e);
			}
		};
	} else {
		log('Stockfish global function not found after importScripts.');
	}
} else {
	log('Engine type is not wasm or js, skipping Stockfish initialization.');
}

self.onmessage = function(e) {
	const command = e.data;
	log(`Received command: ${command}`);
	if (engineType === 'wasm' || engineType === 'js') {
		if (stockfishInit && stockfish) {
			log(`Forwarding command to Stockfish: ${command}`);
			stockfish.postMessage(command);
		} else {
			log('Stockfish engine not initialized, cannot forward command.');
			postMessage('[Worker] Stockfish engine not initialized');
		}
	} else if (engineType === 'api') {
		// Placeholder: Would call remote API for move calculation
		log('API fallback not implemented');
		postMessage('[Worker] API fallback not implemented');
	}
};
