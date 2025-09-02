'use client';

import { useState } from 'react';
import { ChessScores } from '@/hooks/useLocalScores';

interface ScoreBoardProps {
  scores: ChessScores;
  onResetScores: () => void;
  isLoaded: boolean;
}

export default function ScoreBoard({ scores, onResetScores, isLoaded }: ScoreBoardProps) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleResetClick = () => {
    setShowConfirmReset(true);
  };

  const handleConfirmReset = () => {
    onResetScores();
    setShowConfirmReset(false);
  };

  const handleCancelReset = () => {
    setShowConfirmReset(false);
  };

  if (!isLoaded) {
    return (
      <div className="bg-backgroundMuted border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text mb-3">Score</h3>
        <div className="animate-pulse space-y-2">
          <div className="h-6 bg-border rounded"></div>
          <div className="h-6 bg-border rounded"></div>
          <div className="h-6 bg-border rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-backgroundMuted border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text mb-3">Score</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-textMuted">Wins:</span>
            <span className="text-accent2 font-medium">{scores.wins}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-textMuted">Losses:</span>
            <span className="text-red-400 font-medium">{scores.losses}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-textMuted">Draws:</span>
            <span className="text-accent font-medium">{scores.draws}</span>
          </div>
          <div className="border-t border-border pt-2 mt-3">
            <div className="flex justify-between">
              <span className="text-textMuted">Total:</span>
              <span className="text-text font-medium">
                {scores.wins + scores.losses + scores.draws}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full mt-4 flex justify-end">
          <button
            onClick={handleResetClick}
            className="text-xs text-red-400 hover:text-red-600 underline bg-transparent border-none p-0 m-0 cursor-pointer transition-colors"
            style={{ fontWeight: 500 }}
          >
            Reset Scores
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-text mb-3">Reset Scores</h3>
            <p className="text-textMuted text-sm mb-6">
              Are you sure you want to reset all your chess scores? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelReset}
                className="px-4 py-2 text-sm text-textMuted hover:text-text border border-border rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
              >
                Reset Scores
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}