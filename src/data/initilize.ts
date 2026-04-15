import * as SQLite from 'expo-sqlite';

export async function initializeDatabase(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      classroom_id TEXT UNIQUE,
      title TEXT NOT NULL,
      status TEXT DEFAULT 'pending', -- pending, completed
      due_date TEXT
    );

    CREATE TABLE IF NOT EXISTS peers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      google_id TEXT UNIQUE,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS task_peers (
      task_id INTEGER,
      peer_id INTEGER,
      FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
      FOREIGN KEY (peer_id) REFERENCES peers (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT
    );

    CREATE TABLE IF NOT EXISTS user_badges (
      badge_id INTEGER,
      earned_at TEXT,
      FOREIGN KEY (badge_id) REFERENCES badges (id)
    );
  `);
}