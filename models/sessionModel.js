import db from '../config/database.js';

export const create = (id, userId, expiresAt) =>
  db.run('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)', [id, userId, expiresAt]);

export const findById = (id) =>
  db.get('SELECT * FROM sessions WHERE id = ?', [id]);

export const deleteById = (id) =>
  db.run('DELETE FROM sessions WHERE id = ?', [id]);

export const deleteByUserId = (userId) =>
  db.run('DELETE FROM sessions WHERE user_id = ?', [userId]);
