
"use client";
export const dynamic = 'force-static';

import SmudgeCanvas from "@/components/SmudgeCanvas";
import Link from "next/link";

export default function SmudgeCanvasPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-text mb-4">Smudge Canvas</h1>
          <p className="text-lg text-textMuted max-w-2xl mx-auto">
            Draw with your mouse or touch to create evolving smudge trails. Colors smoothly transition through palettes for a mesmerizing effect.
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
          <SmudgeCanvas />
          <div className="mt-6 text-center">
            <p className="text-sm text-textMuted">
              <strong>Instructions:</strong> Click and drag (or use your finger on touch devices) to draw. Use the buttons to clear, save, or go fullscreen.
            </p>
          </div>
        </div>
        <div className="mt-8 bg-card/50 border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-text mb-4">About this Smudge Canvas</h2>
          <div className="text-textMuted space-y-3">
            <p>
              This interactive smudge canvas is inspired by creative coding experiments and is based on a design by {" "}
              <a
                href="https://v0.dev/user/soumyajit0901"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 underline transition-colors"
              >
                soumyajit0901
              </a>
              {" "}on v0.dev. Adapted and integrated into this blog with additional features and responsive design.
            </p>
            <p>
              The visualization uses evolving color palettes and particle trails to create a unique, interactive art experience. Try different drawing speeds and gestures for varied effects!
            </p>
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-sm">
                <strong>Credit:</strong> Original concept by {" "}
                <a
                  href="https://v0.dev/user/soumyajit0901"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 underline transition-colors"
                >
                  soumyajit0901
                </a>
                {" "}on v0.dev.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/random" className="text-accent underline hover:text-accent/80 transition-colors">
            ← Back to Random Experiments
          </Link>
        </div>
      </div>
    </div>
  );
}
