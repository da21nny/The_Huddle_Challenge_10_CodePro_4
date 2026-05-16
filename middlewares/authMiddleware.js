import jwt from 'jsonwebtoken';
import * as SessionModel from '../models/sessionModel.js';
import * as UserModel from '../models/userModel.js';

export const authenticate = (req, res, next) => {
  // Try JWT cookie first
  if (req.cookies.jwt_token) {
    try {
      const payload = jwt.verify(req.cookies.jwt_token, process.env.JWT_SECRET);
      req.user = { id: payload.id, email: payload.email, role: payload.role };
      return next();
    } catch (_) { /* invalid token, try session cookie */ }
  }

  // Try session cookie
  if (req.cookies.session_id) {
    const session = SessionModel.findById(req.cookies.session_id);
    if (session && new Date(session.expires_at) > new Date()) {
      const user = UserModel.findById(session.user_id);
      if (user) {
        req.user = { id: user.id, email: user.email, role: user.role };
        return next();
      }
    }
  }

  // Not authenticated
  res.redirect('/login');
};
