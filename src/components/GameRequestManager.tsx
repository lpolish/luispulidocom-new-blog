"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface GameRequest {
  id: string;
  white_player_id: string;
  black_player_id: string;
  status: string;
  game_type: string;
  created_at: string;
  profiles: {
    username: string;
  };
}

interface GameRequestManagerProps {
  games: GameRequest[];
}

export default function GameRequestManager({ games: initialGames }: GameRequestManagerProps) {
  const [games, setGames] = useState(initialGames);
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();

  async function handleGameRequest(gameId: string, action: 'accept' | 'decline') {
    setLoading(gameId);
    
    try {
      const newStatus = action === 'accept' ? 'active' : 'declined';
      
      const { error } = await supabase
        .from('games')
        .update({ status: newStatus })
        .eq('id', gameId);

      if (error) {
        console.error('Error updating game:', error);
        alert('Failed to update game request');
      } else {
        // Remove the game from the pending list
        setGames(games.filter(game => game.id !== gameId));
        alert(`Game request ${action}ed successfully!`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update game request');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <div key={game.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">
                Game Request from {game.profiles?.username || 'Unknown Player'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Requested: {new Date(game.created_at).toLocaleDateString()} at{' '}
                {new Date(game.created_at).toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-500">
                Game Type: {game.game_type}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => handleGameRequest(game.id, 'accept')}
                disabled={loading === game.id}
                className="bg-green-500 hover:bg-green-600"
              >
                {loading === game.id ? 'Processing...' : 'Accept'}
              </Button>
              <Button
                onClick={() => handleGameRequest(game.id, 'decline')}
                disabled={loading === game.id}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                {loading === game.id ? 'Processing...' : 'Decline'}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
