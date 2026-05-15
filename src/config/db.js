import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance = null;

async function getDb() {
    if (dbInstance) {
        return dbInstance;
    }

    dbInstance = await open({
        filename: path.join(__dirname, '..', '..', 'database.sqlite'),
        driver: sqlite3.Database
    });

    // Crear la tabla de usuarios si no existe
    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'Usuario',
            failedAttempts INTEGER DEFAULT 0,
            lockedUntil INTEGER
        )
    `);

    return dbInstance;
}

export { getDb };
