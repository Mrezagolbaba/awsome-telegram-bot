import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database<sqlite3.Database, sqlite3.Statement>;

async function initDb() {
  console.log('Initializing database...');
  db = await open({
    filename: './database.sqlite', // Ensure the database file is persistent
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_id TEXT UNIQUE,
      first_name TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      telegram_id TEXT UNIQUE
    )
  `);

  // Add your hardcoded admins
  const hardcodedAdmins = ["5895108800"]; // Add more admin IDs as needed
  for (const adminId of hardcodedAdmins) {
    await db.run("INSERT OR IGNORE INTO admins (telegram_id) VALUES (?)", [adminId]);
  }
  console.log('Database initialized');
}

export { db, initDb };
