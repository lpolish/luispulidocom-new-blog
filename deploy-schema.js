const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Note: For schema changes, we need the service role key, not the anon key
// We'll need to use the database connection string or supabase dashboard

async function deploySchema() {
  try {
    console.log('📋 Reading SQL schema file...');
    const sqlContent = fs.readFileSync('supabase_setup.sql', 'utf8');
    
    console.log('🔗 Supabase connection details:');
    console.log(`   URL: ${supabaseUrl}`);
    console.log(`   Project: afptbjpniwkmcosljjte`);
    
    console.log('\n📝 SQL Schema to deploy:');
    console.log('=====================================');
    console.log(sqlContent);
    console.log('=====================================');
    
    console.log('\n⚠️  To deploy this schema, you have two options:');
    console.log('\n1. 🌐 Using Supabase Dashboard (Recommended):');
    console.log('   • Open: https://supabase.com/dashboard/project/afptbjpniwkmcosljjte/sql');
    console.log('   • Copy and paste the SQL above');
    console.log('   • Click "Run" to execute');
    
    console.log('\n2. 🔧 Using psql command line:');
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      console.log(`   psql "${dbUrl}" -f supabase_setup.sql`);
    } else {
      console.log('   (DATABASE_URL not found in environment)');
    }
    
    console.log('\n✅ Schema file is ready for deployment!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

deploySchema();
