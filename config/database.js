import initSqlJs from 'sql.js';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH || './passport.db';
let db;

// Read the file if it exists, otherwise create a new database
const initDb = async () => {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const file = fs.readFileSync(DB_PATH);
    db = new SQL.Database(file);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TEXT DEFAULT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS login_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    ip_address TEXT,
    attempted_at TEXT DEFAULT (datetime('now')),
    success INTEGER DEFAULT 0
  )`);

  save();
};

// Save database to file
const save = () => {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
};

// Run a query (INSERT, UPDATE, DELETE)
const run = (sql, params = []) => {
  db.run(sql, params);
  save();
};

// Get one row
const get = (sql, params = []) => {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const result = stmt.step() ? stmt.getAsObject() : undefined;
  stmt.free();
  return result;
};

// Get all rows
const all = (sql, params = []) => {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
};

// Get the last inserted row id
const lastId = () => {
  return db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
};

export { initDb };
export default { run, get, all, lastId };
