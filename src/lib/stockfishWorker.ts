// src/lib/stockfishWorker.ts
// Utility for communicating with Stockfish WASM via Web Worker

export type StockfishMessage = { type: string; data?: any };

export class StockfishWorker {
  private worker: Worker;
  private listeners: ((msg: StockfishMessage) => void)[] = [];
  private ready: boolean = false;

  constructor(workerPath: string = '/stockfish-worker.js') {
    this.worker = new Worker(workerPath);
    this.worker.onmessage = (e) => this.handleMessage(e.data);
    this.init();
  }

  private handleMessage(data: any) {
    if (typeof data === 'string') {
      if (data.includes('uciok')) {
        this.ready = true;
      }
      this.listeners.forEach((cb) => cb({ type: 'raw', data }));
    }
  }

  private init() {
    this.worker.postMessage('uci');
  }

  setSkillLevel(level: number) {
    this.worker.postMessage(`setoption name Skill Level value ${level}`);
  }

  getBestMove(fen: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let bestMove = '';
      const timeout = setTimeout(() => {
        this.listeners = this.listeners.filter((cb) => cb !== onMessage);
        reject(new Error('Stockfish timeout'));
      }, 3000);
      const onMessage = (msg: StockfishMessage) => {
        if (msg.type === 'raw' && typeof msg.data === 'string') {
          if (msg.data.startsWith('bestmove')) {
            bestMove = msg.data.split(' ')[1];
            clearTimeout(timeout);
            this.listeners = this.listeners.filter((cb) => cb !== onMessage);
            resolve(bestMove);
          }
        }
      };
      this.listeners.push(onMessage);
      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage('go');
    });
  }

  terminate() {
    this.worker.terminate();
  }
}

// Usage:
// const sf = new StockfishWorker();
// await sf.getBestMove(fen);
// sf.setSkillLevel(10);
// sf.terminate();
