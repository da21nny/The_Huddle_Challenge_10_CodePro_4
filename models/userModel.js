import db from '../config/database.js';

export const findByEmail = (email) =>
  db.get('SELECT * FROM users WHERE email = ?', [email]);

export const findById = (id) =>
  db.get('SELECT * FROM users WHERE id = ?', [id]);

export const create = (email, hashedPassword, role = 'user') => {
  db.run('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);
  return findById(db.lastId());
};

export const getAll = () =>
  db.all('SELECT id, email, role, created_at FROM users');

export const deleteById = (id) =>
  db.run('DELETE FROM users WHERE id = ?', [id]);

export const incrementFailedAttempts = (email) =>
  db.run('UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE email = ?', [email]);

export const resetFailedAttempts = (email) =>
  db.run('UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE email = ?', [email]);

export const lockAccount = (email, until) =>
  db.run('UPDATE users SET locked_until = ? WHERE email = ?', [until, email]);
