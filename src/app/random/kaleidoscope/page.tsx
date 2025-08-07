"use client";
export const dynamic = 'force-static';

import { useEffect, useRef } from 'react';
import type { Metadata } from "next";

const KaleidoscopePage = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load p5.js library
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.js';
    script.onload = () => {
      // Initialize p5.js sketch after library loads
      initializeSketch();
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      // Remove p5 instance if it exists
      if ((window as any).p5Instance) {
        (window as any).p5Instance.remove();
      }
    };
  }, []);

  const initializeSketch = () => {
    // Number of symmetrical segments
    let symmetry = 8;
    // Angle between segments
    let angle: number;
    // Current hue value for coloring strokes
    let hueValue = 0;
    // Weight of the drawing stroke
    let lineWeight = 3;
    // Canvas dimensions
    let canvasSize: number;

    const sketch = (p: any) => {
      p.setup = () => {
        // Calculate canvas size to fit container
        const container = canvasRef.current;
        if (container) {
          const containerWidth = container.offsetWidth;
          const containerHeight = container.offsetHeight;
          canvasSize = Math.min(containerWidth - 20, containerHeight - 20);
        } else {
          canvasSize = Math.min(window.innerWidth - 100, window.innerHeight - 200);
        }
        
        const canvas = p.createCanvas(canvasSize, canvasSize);
        canvas.parent(canvasRef.current);

        // Set angle mode to RADIANS for TWO_PI calculations
        p.angleMode(p.RADIANS);
        // Calculate the angle for each symmetry segment
        angle = p.TWO_PI / symmetry;

        // Set the background color (dark grey, drawn once in setup for persistence)
        p.background(20);

        // Set color mode to HSB (Hue, Saturation, Brightness, Alpha)
        // Max values: Hue 360, Sat 100, Brightness 100, Alpha 100
        p.colorMode(p.HSB, 360, 100, 100, 100);

        // Set the stroke weight for the lines
        p.strokeWeight(lineWeight);
      };

      p.draw = () => {
        // Translate to the center of the canvas for symmetrical drawing
        p.translate(p.width / 2, p.height / 2);

        // Get current and previous mouse positions relative to the center of the canvas
        let mx = p.mouseX - p.width / 2;
        let my = p.mouseY - p.height / 2;
        let pmx = p.pmouseX - p.width / 2;
        let pmy = p.pmouseY - p.height / 2;

        // Only draw if the mouse is within the canvas boundaries
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          // Draw if the mouse is pressed OR if the mouse has moved
          if (p.mouseIsPressed || (p.mouseX !== p.pmouseX || p.mouseY !== p.pmouseY)) {
            
            // Increment hue value for color cycling
            hueValue += 0.8;
            if (hueValue > 360) {
              hueValue = 0; // Reset hue to loop colors
            }

            // Set the stroke color with current hue, high saturation/brightness, and some transparency
            p.stroke(hueValue, 90, 90, 70); // 70 alpha for nice layering

            // Loop through each symmetry segment
            for (let i = 0; i < symmetry; i++) {
              // Rotate the coordinate system for the current segment
              p.rotate(angle);

              // Draw the primary line based on mouse movement
              p.line(mx, my, pmx, pmy);

              // Create a reflection within the segment
              p.push(); // Save current transformation state
              p.scale(1, -1); // Reflect vertically (across the segment's x-axis)
              p.line(mx, my, pmx, pmy); // Draw the reflected line
              p.pop(); // Restore transformation state
            }
          }
        }
      };

      // Adjust canvas size and redraw background if window is resized
      p.windowResized = () => {
        const container = canvasRef.current;
        if (container) {
          const containerWidth = container.offsetWidth;
          const containerHeight = container.offsetHeight;
          canvasSize = Math.min(containerWidth - 20, containerHeight - 20);
        } else {
          canvasSize = Math.min(window.innerWidth - 100, window.innerHeight - 200);
        }
        
        p.resizeCanvas(canvasSize, canvasSize);
        // Redraw background to clear previous drawing on resize
        p.background(20); 
        // Re-apply stroke weight as it might be reset by resizeCanvas or other operations
        p.strokeWeight(lineWeight);
      };
    };

    // Create new p5 instance
    (window as any).p5Instance = new (window as any).p5(sketch);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-text mb-4">Kaleidoscope</h1>
          <p className="text-lg text-textMuted max-w-2xl mx-auto">
            Move your cursor around the canvas to create beautiful symmetrical patterns. 
            The kaleidoscope reacts to your movement with vibrant colors that cycle through the spectrum.
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
          <div 
            ref={canvasRef}
            className="flex justify-center items-center mx-auto"
            style={{ 
              height: 'min(70vh, 600px)',
              width: '100%',
              maxWidth: '600px'
            }}
          />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-textMuted">
              <strong>Instructions:</strong> Move your mouse over the canvas to draw. 
              Click and drag for continuous drawing. The patterns will automatically reflect across 8 symmetrical segments.
            </p>
          </div>
        </div>
        
        <div className="mt-8 bg-card/50 border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-text mb-4">About this Kaleidoscope</h2>
          <div className="text-textMuted space-y-3">
            <p>
              This interactive kaleidoscope is built with <strong>p5.js</strong>, a JavaScript library that makes coding accessible for artists, designers, and educators.
            </p>
            <p>
              The visualization creates 8 symmetrical segments, with each mouse movement reflected across all segments to create mesmerizing patterns. 
              The colors cycle through the HSB color space, creating smooth transitions through the entire spectrum.
            </p>
            <p>
              Try different movements: slow curves for flowing patterns, quick gestures for dynamic bursts, or steady drawing for detailed designs.
            </p>
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-sm">
                <strong>Credit:</strong> Original concept shared by{' '}
                <a 
                  href="https://x.com/iwangbowen/status/1921549004778721710" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 underline transition-colors"
                >
                  @iwangbowen on X
                </a>
                {' '}— adapted and integrated into this blog with responsive design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaleidoscopePage;
