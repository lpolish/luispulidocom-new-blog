import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GameRequestManager from "@/components/GameRequestManager";

export default async function AdminChessPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // In a real app, you'd check if the user is actually Luis
  // For now, we'll just check if they're logged in
  if (!user) {
    redirect('/login');
  }

  // Fetch pending game requests
  const { data: pendingGames, error } = await supabase
    .from('games')
    .select(`
      id,
      white_player_id,
      black_player_id,
      status,
      game_type,
      created_at,
      profiles!white_player_id(username),
      profiles!black_player_id(username)
    `)
    .eq('status', 'pending_request')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching games:', error);
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Chess Admin Dashboard</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Pending Game Requests</h2>
        
        {pendingGames && pendingGames.length > 0 ? (
          <GameRequestManager games={pendingGames} />
        ) : (
          <p className="text-gray-600 dark:text-gray-300">
            No pending game requests at the moment.
          </p>
        )}
      </div>
      
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        
        <div className="space-y-2">
          <a 
            href="/chess" 
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Go to Chess Page
          </a>
        </div>
      </div>
    </div>
  );
}
