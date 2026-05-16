import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UserModel from '../models/userModel.js';
import * as SessionModel from '../models/sessionModel.js';
import * as LoginAttemptModel from '../models/loginAttemptModel.js';

// Show register page
export const showRegister = (req, res) => {
  res.render('register', { csrfToken: res.locals.csrfToken });
};

// Create new user
export const register = (req, res) => {
  const { email, password } = req.body;
  const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const hash = bcrypt.hashSync(password, rounds);
  UserModel.create(email, hash);
  res.redirect('/login');
};

// Show login page
export const showLogin = (req, res) => {
  res.render('login', { csrfToken: res.locals.csrfToken });
};

// Authenticate user
export const login = (req, res) => {
  const { email, password, sessionType } = req.body;
  const user = UserModel.findByEmail(email);

  // Wrong credentials
  if (!user || !bcrypt.compareSync(password, user.password)) {
    if (user) handleFailedAttempt(email);
    LoginAttemptModel.create(email, req.ip, false);
    return res.render('login', { error: 'Invalid email or password.', csrfToken: res.locals.csrfToken });
  }

  // Success — reset failed attempts and log
  UserModel.resetFailedAttempts(email);
  LoginAttemptModel.create(email, req.ip, true);

  // Create session based on user choice
  const isSecure = process.env.NODE_ENV === 'production';
  const maxAge = parseInt(process.env.COOKIE_MAX_AGE) || 86400000;

  if (sessionType === 'jwt') {
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.cookie('jwt_token', token, { httpOnly: true, secure: isSecure, sameSite: 'strict', maxAge });
  } else {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + maxAge).toISOString();
    SessionModel.create(sessionId, user.id, expiresAt);
    res.cookie('session_id', sessionId, { httpOnly: true, secure: isSecure, sameSite: 'strict', maxAge });
  }

  res.redirect('/dashboard');
};

// Clear session and cookies
export const logout = (req, res) => {
  if (req.cookies.session_id) {
    SessionModel.deleteById(req.cookies.session_id);
    res.clearCookie('session_id');
  }
  if (req.cookies.jwt_token) {
    res.clearCookie('jwt_token');
  }
  res.redirect('/login');
};

// Helper: handle a failed login attempt
const handleFailedAttempt = (email) => {
  UserModel.incrementFailedAttempts(email);
  const user = UserModel.findByEmail(email);
  const maxAttempts = parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS) || 5;

  if (user.failed_login_attempts >= maxAttempts) {
    const lockMinutes = parseInt(process.env.RATE_LIMIT_LOCK_MINUTES) || 15;
    const lockUntil = new Date(Date.now() + lockMinutes * 60 * 1000).toISOString();
    UserModel.lockAccount(email, lockUntil);
  }
};
