export const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).render('dashboard', {
      user: req.user,
      error: 'Access denied.'
    });
  }
  next();
};
