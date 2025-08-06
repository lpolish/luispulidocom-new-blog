const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('_realtime').select('*').limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means table doesn't exist, which is fine
      console.error('Connection error:', error);
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    
    // Check if our tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.log('Could not fetch tables (this is normal if permissions are limited)');
    } else {
      console.log('Existing tables:', tables?.map(t => t.table_name) || []);
    }
    
  } catch (err) {
    console.error('Test failed:', err.message);
  }
}

testConnection();
