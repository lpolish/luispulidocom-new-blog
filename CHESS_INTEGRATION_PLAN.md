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

To optimize the "Play vs AI" experience and avoid backend calls, we will use a local Stockfish engine (WebAssembly) in the browser. Here is the updated implementation guide:

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
9. **Integrate Local Stockfish (WASM):**
    - Add Stockfish WebAssembly (WASM) worker to the `public/` directory (e.g., `stockfish-worker.js`).
    - Update the chess game component to send the current FEN to Stockfish and receive the best move.
    - On each player move, send the updated FEN to Stockfish, parse the best move, and apply it to the board.
    - Show "AI is thinking..." while waiting for Stockfish's response.
    - Handle errors or fallback to random moves if Stockfish fails to load.

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

_This document will be updated as the project progresses._

_This document will be updated as the project progresses._
