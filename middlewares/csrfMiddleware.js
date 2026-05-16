import crypto from 'crypto';

// Generate a CSRF token and store it in a cookie
export const generateCsrfToken = (req, res, next) => {
  if (!req.cookies._csrf) {
    const token = crypto.randomBytes(32).toString('hex');
    res.cookie('_csrf', token, { httpOnly: true, sameSite: 'strict' });
    req.cookies._csrf = token;
  }
  res.locals.csrfToken = req.cookies._csrf;
  next();
};

// Validate that the CSRF token in the form matches the cookie
export const validateCsrfToken = (req, res, next) => {
  if (req.method === 'GET') return next();

  const cookieToken = req.cookies._csrf;
  const bodyToken = req.body._csrf;

  if (!cookieToken || !bodyToken || cookieToken !== bodyToken) {
    return res.status(403).render('login', {
      error: 'Invalid CSRF token.',
      csrfToken: res.locals.csrfToken
    });
  }
  next();
};
