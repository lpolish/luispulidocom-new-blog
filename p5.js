<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>P5.js Kaleidoscope</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.js"></script>
    <style>
        body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #111; /* Dark background for the page */
            font-family: 'Inter', sans-serif; /* Using Inter font */
            overflow: hidden; /* Prevent scrollbars */
        }
        canvas {
            display: block; /* Removes extra space below canvas if any */
            border: 1px solid #333; /* Subtle border for the canvas */
            border-radius: 8px; /* Slightly rounded corners */
        }
    </style>
</head>
<body>
    <script>
        // Number of symmetrical segments
        let symmetry = 8;
        // Angle between segments
        let angle;
        // Current hue value for coloring strokes
        let hueValue = 0;
        // Weight of the drawing stroke
        let lineWeight = 3;
        // Canvas dimensions
        let canvasSize;

        function setup() {
            // Calculate canvas size to fit window with some margin
            canvasSize = Math.min(windowWidth - 40, windowHeight - 40);
            createCanvas(canvasSize, canvasSize);

            // Set angle mode to RADIANS for TWO_PI calculations
            angleMode(RADIANS);
            // Calculate the angle for each symmetry segment
            angle = TWO_PI / symmetry;

            // Set the background color (dark grey, drawn once in setup for persistence)
            background(20);

            // Set color mode to HSB (Hue, Saturation, Brightness, Alpha)
            // Max values: Hue 360, Sat 100, Brightness 100, Alpha 100
            colorMode(HSB, 360, 100, 100, 100);

            // Set the stroke weight for the lines
            strokeWeight(lineWeight);
        }

        function draw() {
            // Translate to the center of the canvas for symmetrical drawing
            translate(width / 2, height / 2);

            // Get current and previous mouse positions relative to the center of the canvas
            let mx = mouseX - width / 2;
            let my = mouseY - height / 2;
            let pmx = pmouseX - width / 2;
            let pmy = pmouseY - height / 2;

            // Only draw if the mouse is within the canvas boundaries
            if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
                // Draw if the mouse is pressed OR if the mouse has moved
                if (mouseIsPressed || (mouseX !== pmouseX || mouseY !== pmouseY)) {
                    
                    // Increment hue value for color cycling
                    hueValue += 0.8;
                    if (hueValue > 360) {
                        hueValue = 0; // Reset hue to loop colors
                    }

                    // Set the stroke color with current hue, high saturation/brightness, and some transparency
                    stroke(hueValue, 90, 90, 70); // 70 alpha for nice layering

                    // Loop through each symmetry segment
                    for (let i = 0; i < symmetry; i++) {
                        // Rotate the coordinate system for the current segment
                        rotate(angle);

                        // Draw the primary line based on mouse movement
                        line(mx, my, pmx, pmy);

                        // Create a reflection within the segment
                        push(); // Save current transformation state
                        scale(1, -1); // Reflect vertically (across the segment's x-axis)
                        line(mx, my, pmx, pmy); // Draw the reflected line
                        pop(); // Restore transformation state
                    }
                }
            }
        }

        // Adjust canvas size and redraw background if window is resized
        function windowResized() {
            canvasSize = Math.min(windowWidth - 40, windowHeight - 40);
            resizeCanvas(canvasSize, canvasSize);
            // Redraw background to clear previous drawing on resize
            background(20); 
            // Re-apply stroke weight as it might be reset by resizeCanvas or other operations
            strokeWeight(lineWeight);
        }
    </script>
</body>
</html>
