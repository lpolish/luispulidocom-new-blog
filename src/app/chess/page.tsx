import ChessGame from "@/components/ChessGame";
import { createClient } from "@/lib/supabase/server";

export default async function ChessPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Chess</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ChessGame />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Game Options</h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">🤖 Play vs AI</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  Challenge a computer opponent with random moves. Perfect for practicing!
                </p>
                <p className="text-green-600 text-sm font-medium">Available now</p>
              </div>
              
              {user ? (
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">👨‍💻 Challenge Me</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    Request a game against me (Luis). I'll be notified and can accept your challenge.
                  </p>
                  <p className="text-blue-600 text-sm font-medium">Coming soon</p>
                </div>
              ) : (
                <div className="p-4 border rounded-lg opacity-60">
                  <h3 className="text-lg font-medium mb-2">👨‍💻 Challenge Me</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    Sign in to request a game against me (Luis).
                  </p>
                  <p className="text-gray-500 text-sm font-medium">Sign in required</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• Click on a piece to select it</li>
              <li>• Click on a highlighted square to move</li>
              <li>• The computer will respond automatically</li>
              <li>• Use "New Game" to restart</li>
            </ul>
          </div>

          {user && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Your Games</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Game history and ongoing matches will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
