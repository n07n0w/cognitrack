const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration using Supabase connection string
const dbConfig = {
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false }
};

async function checkAndRecreateDatabase() {
  const pool = new Pool(dbConfig);
  
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    
    // Check if tables exist
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const requiredTables = ['mood_entries', 'activities', 'emotions'];
    const existingTables = tablesCheck.rows.map(row => row.table_name);
    
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.log('⚠️ Missing tables detected:', missingTables);
      console.log('🔄 Recreating database schema...');
      
      // Read and execute schema file
      const schemaPath = path.join(__dirname, '../src/db/schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      await pool.query(schema);
      console.log('✅ Database schema recreated successfully');
    } else {
      console.log('✅ All required tables exist');
    }
    
    // Check for required data
    const emotionsCheck = await pool.query('SELECT COUNT(*) FROM emotions');
    if (parseInt(emotionsCheck.rows[0].count) === 0) {
      console.log('🔄 Seeding emotions data...');
      const emotionsData = require('../src/constants/moodData').EMOTIONS;
      for (const emotion of emotionsData) {
        await pool.query(
          'INSERT INTO emotions (id, emoji, label, color) VALUES ($1, $2, $3, $4)',
          [emotion.id, emotion.emoji, emotion.label, emotion.color]
        );
      }
      console.log('✅ Emotions data seeded successfully');
    }
    
    const activitiesCheck = await pool.query('SELECT COUNT(*) FROM activities');
    if (parseInt(activitiesCheck.rows[0].count) === 0) {
      console.log('🔄 Seeding activities data...');
      const activitiesData = require('../src/constants/moodData').ACTIVITIES;
      for (const activity of activitiesData) {
        await pool.query(
          'INSERT INTO activities (id, name, icon, color) VALUES ($1, $2, $3, $4)',
          [activity.id, activity.name, activity.icon, activity.color]
        );
      }
      console.log('✅ Activities data seeded successfully');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

checkAndRecreateDatabase(); 