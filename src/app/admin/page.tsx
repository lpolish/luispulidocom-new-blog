import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SimpleAdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Basic check - in a real app you'd have proper admin authentication
  if (!user) {
    redirect('/login');
  }

  // Try to fetch game requests
  let pendingGames: any[] = [];
  let error: string | null = null;
  
  try {
    const { data, error: dbError } = await supabase
      .from('games')
      .select(`
        id,
        white_player_id,
        status,
        game_type,
        created_at
      `)
      .eq('status', 'pending_request')
      .order('created_at', { ascending: false });

    if (dbError) {
      error = dbError.message;
    } else {
      pendingGames = data || [];
    }
  } catch (e) {
    error = 'Database connection failed - make sure to run the SQL schema in Supabase!';
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Simple Chess Admin</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Game Requests Status</h2>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Database Error:</strong> {error}
            <div className="mt-2 text-sm">
              <p>To fix this, you need to:</p>
              <ol className="list-decimal list-inside mt-1">
                <li>Go to your Supabase dashboard</li>
                <li>Navigate to the SQL Editor</li>
                <li>Run the contents of <code>supabase_setup.sql</code></li>
              </ol>
            </div>
          </div>
        ) : pendingGames.length > 0 ? (
          <div className="space-y-4">
            {pendingGames.map((game: any) => (
              <div key={game.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold">Game Request</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  From player: {game.white_player_id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Requested: {new Date(game.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Game Type: {game.game_type} | Status: {game.status}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">
            No pending game requests. Database is connected! ✅
          </p>
        )}
      </div>
      
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <a 
            href="/chess" 
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mr-4"
          >
            Go to Chess Page
          </a>
          <a 
            href="/admin/chess" 
            className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Full Admin Panel
          </a>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Logged in as: {user.email}</p>
        <p>User ID: {user.id}</p>
      </div>
    </div>
  );
}
