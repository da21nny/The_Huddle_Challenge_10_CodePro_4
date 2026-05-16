import * as UserModel from '../models/userModel.js';

// Block login if the account has too many failed attempts
export const checkRateLimit = (req, res, next) => {
  const user = UserModel.findByEmail(req.body.email);
  if (!user) return next();

  // Check if account is currently locked
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    return res.status(429).render('login', {
      error: 'Account locked. Try again later.',
      csrfToken: res.locals.csrfToken
    });
  }

  // If lock expired, reset attempts
  if (user.locked_until) {
    UserModel.resetFailedAttempts(req.body.email);
  }

  next();
};
