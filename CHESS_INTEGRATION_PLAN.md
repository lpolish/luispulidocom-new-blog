# Chess Integration Planning

## Overview
This document outlines the plan to integrate Lichess streaming and a 'Play vs Me' queue into the website.

## Features

### 1. Stream Lichess Games
- Display live games from the user's Lichess account.
- Use Lichess API/WebSocket for real-time updates.
- Show current or recent games in a dedicated section.
- Render chessboard and moves in real time.

### 2. 'Play vs Me' Queue
- Allow visitors to join a queue to play chess against the site owner.
- Integrate with Lichess challenges or provide an on-site chessboard.
- Notify the owner when a new challenger is in the queue.
- Optionally, allow chat or move commentary.

## Technical Considerations
- Use React components for chessboard UI (e.g., react-chessboard).
- Securely handle Lichess API authentication (OAuth or API token).
- Ensure real-time updates (WebSocket or polling).
- Design a user-friendly interface for both features.

## Next Steps
1. Research Lichess API endpoints and authentication.
2. Choose chessboard and logic libraries.
3. Design UI mockups for both features.
4. Implement streaming feature.
5. Implement queue system.
6. Test and deploy.

---

## Phase 1: Planning and Design

### 1. Database Choice Justification

For this project, I recommend using **Supabase**.

**Justification:**

*   **All-in-One Solution:** Supabase is a Backend-as-a-Service (BaaS) that provides a PostgreSQL database, authentication, real-time subscriptions, and storage in a single, integrated platform. This is a significant advantage over Neon DB, which is purely a database and would require integrating separate services for authentication and real-time features.
*   **Ease of Integration:** The `@supabase/supabase-js` client library is specifically designed for easy integration with Next.js, offering helper functions for both client-side and server-side (API routes, Server Actions) interactions.
*   **Built-in Authentication:** Supabase's authentication service is robust, secure, and will handle user sign-ups, logins, and profile management out of the box, drastically reducing development time.
*   **Real-Time Capabilities:** The chess game requires real-time updates to reflect opponent moves instantly. Supabase's Realtime Subscriptions are built for this exact use case, allowing the frontend to listen for database changes (e.g., a new move) and update the UI without needing to poll the server.
*   **Scalability:** Supabase is built on a scalable architecture that can handle the growth from a simple player-vs-AI feature to a full-fledged chess community.

### 2. High-Level Architecture

Here is the proposed architecture for the new chess section.

*   **Frontend (Next.js):**
    *   The UI will be built with React components. A new route, `/chess`, will be the main entry point.
    *   We'll use a library like `react-chessboard` for the visual board and `chess.js` for game logic (move validation, FEN string management).
    *   The Next.js frontend will communicate directly with Supabase using the official client library.

*   **Backend (Supabase):**
    *   **Database:** All game and user data will be stored in the Supabase Postgres database.
    *   **Authentication:** Supabase Auth will manage all user accounts and sessions.
    *   **Real-Time:** Supabase Realtime will be used to push live game updates to connected clients.

*   **Stockfish AI Integration:**
    *   Stockfish will be integrated on the **client-side using WebAssembly (WASM)**. This is the most scalable approach, as it leverages the user's own browser to calculate the AI's moves, placing zero computational load on our server.

*   **Database Schema:**
    *   **`profiles`**: Will store public user data. It will have a one-to-one relationship with the `auth.users` table.
        *   `id` (UUID, Foreign Key to `auth.users.id`)
        *   `username` (text)
        *   `rating` (integer, default: 1200)
    *   **`games`**: Stores the state of each chess game.
        *   `id` (UUID, Primary Key)
        *   `white_player_id` (UUID, Foreign Key to `profiles.id`, nullable for AI games)
        *   `black_player_id` (UUID, Foreign Key to `profiles.id`, nullable for AI games)
        *   `status` (enum: `pending_request`, `active`, `completed`, `declined`)
        *   `current_fen` (text, stores the board state)
        *   `pgn` (text, stores the full game notation)
        *   `winner` (enum: `white`, `black`, `draw`, nullable)
        *   `game_type` (enum: `ai`, `human`)
    *   **`moves`**: Stores each move in a game. While the full PGN is in the `games` table for portability, a `moves` table is useful for analysis and can be omitted for the initial implementation to simplify the model. For now, we will rely on the `pgn` field in the `games` table.

*   **Game Management Flow:**
    1.  **Player vs. AI:** A user clicks "Play vs. AI". A new game is created locally. The game state can be optionally saved to the `games` table if the user is logged in and wants to resume later.
    2.  **Player vs. Luis (Request):** A logged-in user clicks "Request Game vs. Luis". This creates a new row in the `games` table with `status: 'pending_request'`, `white_player_id: <user_id>`, and `black_player_id: <luis_id>`.
    3.  **Luis's Dashboard:** I will have a special page that fetches all games where `status` is `pending_request` and my ID is one of the players. This page will have "Accept" or "Decline" buttons.
    4.  **Gameplay:** When a game is `active`, both players will connect. When one player makes a move, the frontend updates the `games` table in Supabase. The other player's client, subscribed to changes on that specific game row, will receive the new board state in real-time and update their UI automatically.

### 3. Step-by-Step Implementation Plan


## Next Steps: Enabling Play vs AI with Local Stockfish

## Next Steps: Enabling Play vs AI with Local Stockfish (Optimized Loading Strategy)

To optimize the "Play vs AI" experience and avoid backend calls, we will use a local Stockfish engine in the browser, prioritizing support for WebAssembly (WASM), then JavaScript, and finally falling back to an API if needed. Here is the updated implementation guide:

### Part A: Setup and Authentication

1. **Create Supabase Project:** Initialize a new project on Supabase.
2. **Install Dependencies:** Add `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`, `react-chessboard`, and `chess.js` to the project.
3. **Environment Setup:** Configure Supabase URL and keys in the Next.js environment variables (`.env.local`).
4. **Supabase Client:** Create a Supabase client instance for use across the application.
5. **Authentication UI:** Create simple UI components for Login, Logout, and displaying the user's status. Integrate Supabase's authentication logic.
6. **Create `profiles` Table:** Set up the `profiles` table in Supabase and create a trigger that automatically adds a new profile when a new user signs up.

### Part B: Core Chess Functionality

7. **Create Chess Page:** Create the main page at `/chess`.
8. **Develop Chessboard Component:** Create a new component that wraps `react-chessboard` and `chess.js`. This component will manage the board's state, handle user moves, and validate them.
9. **Integrate Local Stockfish (WASM/JS Fallback/API):**
    - Move all Stockfish JS and WASM files into `public/stockfish/` for better organization.
    - Update the chess game worker to first attempt loading the WASM version (e.g., `stockfish-16.1.wasm` with its JS loader).
    - If WASM fails to load, fallback to a JS-only version (e.g., `stockfish-16.1.js`).
    - If both local engines fail, fallback to a remote API for move calculation (to be implemented or selected).
    - On each player move, send the updated FEN to Stockfish, parse the best move, and apply it to the board.
    - Show "AI is thinking..." while waiting for Stockfish's response.
    - Handle errors gracefully and log which engine is being used.

10. **Game State Management:**
    - Optionally, allow saving/retrieving games vs AI for logged-in users.
    - Store completed games in Supabase for history/analysis.

11. **UI/UX Enhancements:**
    - Add a difficulty selector (Stockfish skill level).
    - Show move analysis or hints from Stockfish if desired.

### Part C: Database-Driven Gameplay

12. **Create `games` Table:** Create the `games` table in the Supabase database as per the schema.
13. **Game State Management:**
    - Create a new game in the database.
    - Load an existing game from the database.
    - Update a game's state (FEN and PGN) after each move.
14. **Implement "Request Game" Flow:** Add the UI and logic for a user to send a game request to me.
15. **Create Admin Dashboard:** Build the private page for me to view and manage game requests.
16. **Enable Real-Time Updates:** Use Supabase Realtime Subscriptions to make the games interactive between two players.

---


---

## Status Update (2025-08-07)

### Current Flow and Implementation

**Frontend:**
- Chess game UI is implemented using React and `chessboardjsx`.
- Game logic is managed with `chess.js`.
- The AI mode uses a Web Worker to communicate with Stockfish.
- The worker is loaded from `/stockfish/stockfish-worker.js` and attempts to load Stockfish WASM, then JS, then fallback to API (not yet implemented).
- The UI blocks further moves while waiting for Stockfish to respond, showing "thinking..." status.
- Only valid moves are allowed, and only when it is the player's turn.

**Worker:**
- The worker now has robust logging for initialization, command receipt, and Stockfish output.
- It attempts to load WASM first, then JS, and logs all steps and errors.
- Commands are forwarded to Stockfish, and relevant output (`bestmove`, etc.) is posted back to the main thread.
- Debug and status messages are visible in the browser console for troubleshooting.

**Current Issue:**
- After the first player move, the worker receives the command but Stockfish does not respond with a `bestmove`.
- The UI correctly blocks further moves, but does not update or show the AI's move.
- No errors are shown, but more logging is now available for diagnosis.

### Next Steps for Testing and Debugging
1. Test the chess game in the browser and monitor the console for `[Worker-LOG]` and `[Stockfish]` messages.
2. Confirm that the worker is initialized and receiving commands after each move.
3. Check if Stockfish is posting output (especially `bestmove`) back to the main thread.
4. If no output is received, verify the Stockfish JS/WASM files are correct and compatible with the worker interface.
5. If needed, add more logging to the frontend to display worker status and errors in the UI.
6. Once Stockfish responds, ensure the UI updates with the AI's move and unblocks the player.
7. Document any further issues and update the plan before continuing with new features.

---

_This document will be updated as the project progresses._

_This document will be updated as the project progresses._
