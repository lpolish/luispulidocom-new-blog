const { Client } = require('pg');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function deploySchema() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('❌ DATABASE_URL not found in environment variables');
    return;
  }
  
  if (dbUrl.includes('[YOUR-PASSWORD]')) {
    console.error('❌ DATABASE_URL contains placeholder text. Please update with real password.');
    console.log('   You can find the password in your Supabase dashboard under Settings > Database');
    return;
  }
  
  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔗 Connecting to Supabase database...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    console.log('📋 Reading SQL schema file...');
    const sqlContent = fs.readFileSync('supabase_setup_safe.sql', 'utf8');
    
    console.log('🚀 Executing SQL schema...');
    const result = await client.query(sqlContent);
    
    console.log('✅ Schema deployed successfully!');
    console.log('📊 Result:', result);
    
  } catch (error) {
    console.error('❌ Error deploying schema:', error.message);
    if (error.message.includes('password')) {
      console.log('\n💡 Tip: You need to set the correct database password in your DATABASE_URL');
      console.log('   Check your Supabase dashboard: Settings > Database > Connection string');
    }
  } finally {
    await client.end();
  }
}

deploySchema();
