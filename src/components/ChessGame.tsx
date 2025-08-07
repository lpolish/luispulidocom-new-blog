"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { Button } from "@/components/ui/button";

const STOCKFISH_WORKER_URL = "/stockfish-worker.js";

export default function ChessGame() {
	const game = useMemo(() => new Chess(), []);
	const [gamePosition, setGamePosition] = useState(game.fen());
	const [gameStatus, setGameStatus] = useState("In Progress");
	const [isThinking, setIsThinking] = useState(false);
	const [gameMode, setGameMode] = useState<string | null>(null);
	const [aiLevel, setAiLevel] = useState(1);
	const [scorecard, setScorecard] = useState({ wins: 0, losses: 0, draws: 0, aiLevel: 1 });
	const [stockfishWorker, setStockfishWorker] = useState<Worker | null>(null);

	// Load scorecard from localStorage
	useEffect(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("chessScorecard");
			if (saved) {
				try {
					const parsed = JSON.parse(saved);
					setScorecard(parsed);
					setAiLevel(parsed.aiLevel || 1);
				} catch {}
			}
		}
	}, []);

	// Save scorecard to localStorage
	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("chessScorecard", JSON.stringify(scorecard));
		}
	}, [scorecard]);

	// Initialize Stockfish worker
	useEffect(() => {
		if (typeof window !== "undefined" && gameMode === "ai") {
			const worker = new Worker(STOCKFISH_WORKER_URL);
			setStockfishWorker(worker);
			return () => worker.terminate();
		}
		setStockfishWorker(null);
	}, [gameMode]);

	// Listen for Stockfish bestmove
	useEffect(() => {
		if (!stockfishWorker) return;
		const handleMessage = (e: MessageEvent) => {
			const msg = e.data;
			if (typeof msg === "string" && msg.startsWith("bestmove")) {
				const move = msg.split(" ")[1];
				if (move && move !== "(none)") {
					game.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: "q" });
					setGamePosition(game.fen());
					updateGameStatus();
					setIsThinking(false);
				}
			}
		};
		stockfishWorker.addEventListener("message", handleMessage);
		return () => stockfishWorker.removeEventListener("message", handleMessage);
	}, [stockfishWorker]);

	const updateGameStatus = useCallback(() => {
		if (game.isCheckmate()) {
			setGameStatus(`Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins.`);
			if (game.turn() === "w") {
				setScorecard((prev) => ({ ...prev, losses: prev.losses + 1 }));
			} else {
				setScorecard((prev) => {
					const newLevel = Math.min(prev.aiLevel + 1, 5);
					return { ...prev, wins: prev.wins + 1, aiLevel: newLevel };
				});
				setAiLevel((prev) => Math.min(prev + 1, 5));
			}
		} else if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition() || game.isInsufficientMaterial()) {
			setGameStatus("Draw!");
			setScorecard((prev) => ({ ...prev, draws: prev.draws + 1 }));
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
		} catch {}
		return false;
	}, [game, updateGameStatus]);

	function onPieceDrop(sourceSquare: string, targetSquare: string) {
		if (gameMode === "ai" && game.turn() !== "w") return false;
		const move = { from: sourceSquare, to: targetSquare, promotion: "q" };
		const moveSuccessful = makeAMove(move);
		if (moveSuccessful && gameMode === "ai" && !game.isGameOver() && stockfishWorker) {
			setIsThinking(true);
			// Send position and go command to Stockfish
			stockfishWorker.postMessage(`position fen ${game.fen()}`);
			stockfishWorker.postMessage(`go depth ${aiLevel * 2}`);
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
		setGameMode("ai");
		setAiLevel(scorecard.aiLevel || 1);
	}

	if (!gameMode) {
		return (
			<div className="flex flex-col items-center space-y-4">
				<div className="text-center mb-4">
					<h2 className="text-2xl font-semibold mb-2">Choose Game Mode</h2>
					<p className="text-gray-600 dark:text-gray-300">Select how you'd like to play chess</p>
				</div>
				<div className="mb-4 p-2 rounded bg-background border border-border">
					<h4 className="font-semibold mb-1">Your Scorecard</h4>
					<div className="text-sm">Wins: {scorecard.wins} | Losses: {scorecard.losses} | Draws: {scorecard.draws}</div>
					<div className="text-sm">Current AI Level: {scorecard.aiLevel}</div>
				</div>
				<Button onClick={startAIGame} className="w-full max-w-xs">
					🤖 Play vs AI (Level {aiLevel})
				</Button>
			</div>
		);
	}

	if (gameMode === "ai") {
		return (
			<div className="flex flex-col items-center w-full">
				<div className="mb-4 w-full flex justify-center" style={{ position: "relative", overflow: "visible" }}>
					<Chessboard
						position={gamePosition}
						width={320}
						onDrop={({ sourceSquare, targetSquare }) => onPieceDrop(sourceSquare, targetSquare)}
					/>
				</div>
				<div className="mb-2 p-2 rounded bg-background border border-border w-full">
					<h4 className="font-semibold mb-1">Your Scorecard</h4>
					<div className="text-sm">Wins: {scorecard.wins} | Losses: {scorecard.losses} | Draws: {scorecard.draws}</div>
					<div className="text-sm">Current AI Level: {aiLevel}</div>
				</div>
				<p className="text-green-600">Play chess against the AI. Win to advance levels!</p>
				<Button onClick={() => setGameMode(null)} variant="outline">
					Change Mode
				</Button>
			</div>
		);
	}

	return null;
}