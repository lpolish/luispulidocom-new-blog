const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  try {
    console.log('🔍 Checking database status...');
    
    // Test profiles table
    console.log('\n📊 Testing profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.log('❌ Profiles table error:', profilesError.message);
    } else {
      console.log('✅ Profiles table exists and accessible');
      console.log('   Sample data:', profiles);
    }
    
    // Test games table
    console.log('\n🎮 Testing games table...');
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('*')
      .limit(1);
    
    if (gamesError) {
      console.log('❌ Games table error:', gamesError.message);
    } else {
      console.log('✅ Games table exists and accessible');
      console.log('   Sample data:', games);
    }
    
    // Test authentication
    console.log('\n🔐 Testing authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Auth error:', authError.message);
    } else if (user) {
      console.log('✅ User authenticated:', user.email);
    } else {
      console.log('ℹ️  No user currently authenticated (this is normal)');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDatabase();
