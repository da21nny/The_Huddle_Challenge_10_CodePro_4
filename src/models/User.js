const bcrypt = require('bcrypt');
const { getDb } = require('../config/db');

class User {
  static async create({ email, password, role = 'Usuario' }) {
    const db = await getDb();
    
    const existing = await this.findByEmail(email);
    if (existing) throw new Error('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.run(
      `INSERT INTO users (email, password, role, failedAttempts, lockedUntil) VALUES (?, ?, ?, 0, NULL)`,
      [email, hashedPassword, role]
    );

    return {
      id: result.lastID,
      email,
      role,
      failedAttempts: 0,
      lockedUntil: null
    };
  }

  static async findByEmail(email) {
    const db = await getDb();
    return db.get(`SELECT * FROM users WHERE email = ?`, [email]);
  }

  static async findById(id) {
    const db = await getDb();
    return db.get(`SELECT * FROM users WHERE id = ?`, [id]);
  }

  static async update(id, updates) {
    const db = await getDb();
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) return null;

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    await db.run(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);
    
    return this.findById(id);
  }
  
  static async getAll() {
    const db = await getDb();
    const users = await db.all(`SELECT id, email, role, failedAttempts, lockedUntil FROM users`);
    return users;
  }
}

// Crear un administrador por defecto si no existe
(async () => {
    try {
        const db = await getDb();
        const admin = await db.get(`SELECT * FROM users WHERE email = ?`, ['admin@passport.inc']);
        if (!admin) {
            await User.create({ email: 'admin@passport.inc', password: 'adminpassword', role: 'Administrador' });
        }
    } catch (error) {
        console.error("Error creating default admin:", error.message);
    }
})();

module.exports = User;
