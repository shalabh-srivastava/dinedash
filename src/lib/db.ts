
// @ts-nocheck
// TODO: Remove no-check when issues with sqlite3 types are resolved in project
'use server';
import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';
import path from 'path';
import bcrypt from 'bcryptjs';

// Singleton instance of the database
let db: Database | null = null;

export async function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'dinedash.sqlite');
    console.log(`Database path: ${dbPath}`);
    try {
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });
      console.log('Database connection established.');
      await initializeDbSchema(db);
    } catch (error) {
      console.error('Failed to open database connection:', error);
      throw error; // Re-throw the error to indicate failure
    }
  }
  return db;
}

async function initializeDbSchema(dbInstance: Database) {
  console.log('Initializing database schema...');
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'manager' 
    );
  `);
  console.log('Users table checked/created.');

  // Add default manager user if not exists
  const defaultManagerEmail = 'manager@email.com';
  const existingManager = await dbInstance.get('SELECT * FROM users WHERE email = ?', defaultManagerEmail);
  if (!existingManager) {
    const defaultPassword = 'password';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    await dbInstance.run(
      'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
      defaultManagerEmail,
      hashedPassword,
      'Default Manager',
      'manager'
    );
    console.log(`Default manager user (${defaultManagerEmail}) created.`);
  } else {
    console.log(`Default manager user (${defaultManagerEmail}) already exists.`);
  }


  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      address TEXT,
      phone_number TEXT,
      menu_items TEXT,
      feedback_text TEXT NOT NULL,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Feedback table checked/created.');
  console.log('Database schema initialization complete.');
}

// Optional: Close DB connection when server shuts down (more relevant for standalone scripts)
// process.on('SIGINT', async () => {
//   if (db) {
//     await db.close();
//     console.log('Database connection closed.');
//   }
//   process.exit(0);
// });

