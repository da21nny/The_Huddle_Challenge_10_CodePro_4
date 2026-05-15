const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

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

module.exports = { getDb };
