import db from '../config/database.js';

export const create = (email, ipAddress, success) =>
  db.run('INSERT INTO login_attempts (email, ip_address, success) VALUES (?, ?, ?)', [email, ipAddress, success ? 1 : 0]);

export const getAll = () =>
  db.all('SELECT * FROM login_attempts ORDER BY attempted_at DESC');
